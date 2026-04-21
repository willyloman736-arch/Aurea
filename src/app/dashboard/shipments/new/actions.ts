"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasDatabase, prisma } from "@/lib/db";
import { hasEasyPost, lookupOrCreateTracker } from "@/lib/easypost";
import { easypostToShipment } from "@/lib/mappers";

export async function createShipmentAction(formData: FormData) {
  const trackingCode = (formData.get("trackingCode") as string | null)?.trim().toUpperCase();
  const carrier = (formData.get("carrier") as string | null)?.trim() || undefined;

  if (!trackingCode) {
    return { error: "Tracking number is required." };
  }

  if (!hasEasyPost()) {
    return {
      error:
        "EASYPOST_API_KEY is not configured. Add your EasyPost test key to .env.local to create real trackers.",
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
    const mapped = easypostToShipment(tracker);

    const data = {
      trackingCode: mapped.id,
      easypostId: tracker.id,
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
    const events = tracker.tracking_details.slice(0, 12).map((ev, i) => ({
      shipmentId: saved.id,
      time: new Date(ev.datetime),
      title: ev.message || ev.description || ev.status,
      location:
        [ev.tracking_location?.city, ev.tracking_location?.state, ev.tracking_location?.country]
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
