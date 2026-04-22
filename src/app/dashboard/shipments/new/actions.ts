"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasDatabase, prisma } from "@/lib/db";
import { hasShippo, lookupOrCreateTracker } from "@/lib/shippo";
import { shippoToShipment } from "@/lib/mappers";

export async function createShipmentAction(formData: FormData) {
  const trackingCode = (formData.get("trackingCode") as string | null)?.trim().toUpperCase();
  const carrier = (formData.get("carrier") as string | null)?.trim() || undefined;

  if (!trackingCode) {
    return { error: "Tracking number is required." };
  }

  if (!hasShippo()) {
    return {
      error:
        "SHIPPO_API_KEY is not configured. Add your Shippo test key to .env.local to create real trackers.",
    };
  }

  if (!hasDatabase()) {
    return {
      error:
        "DATABASE_URL is not configured. Add your Neon Postgres connection string to .env to persist shipments.",
    };
  }

  try {
    const tracker = await lookupOrCreateTracker(trackingCode, carrier);
    if (!tracker) {
      return { error: "No tracker could be found or registered for that number." };
    }
    const mapped = shippoToShipment(tracker);

    const data = {
      trackingCode: mapped.id,
      easypostId: null,
      carrier: tracker.carrier,
      status: mapped.status,
      service: mapped.service,
      weight: mapped.weight,
      pieces: mapped.pieces,
      dimensions: mapped.dimensions,
      originCity: mapped.origin.city,
      originAddr: mapped.origin.addr,
      destCity: mapped.destination.city,
      destAddr: mapped.destination.addr,
      etaDate: mapped.etaDate,
      etaWindow: mapped.etaWindow,
      progress: mapped.progress,
    };

    const saved = await prisma.shipment.upsert({
      where: { trackingCode: mapped.id },
      update: data,
      create: data,
    });

    await prisma.trackingEvent.deleteMany({ where: { shipmentId: saved.id } });
    const events = (tracker.tracking_history ?? []).slice(0, 12).map((ev, i) => ({
      shipmentId: saved.id,
      time: new Date(ev.status_date),
      title: ev.status_details || ev.status.replace(/_/g, " ").toLowerCase(),
      location:
        [ev.location?.city, ev.location?.state, ev.location?.country]
          .filter(Boolean)
          .join(", ") || null,
      status: ev.status,
      latest: i === 0,
    }));
    if (events.length > 0) {
      await prisma.trackingEvent.createMany({ data: events });
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/shipments");
    redirect(`/dashboard/shipments/${saved.id}`);
  } catch (err) {
    if (err instanceof Error && err.message === "NEXT_REDIRECT") throw err;
    return { error: (err as Error).message };
  }
}
