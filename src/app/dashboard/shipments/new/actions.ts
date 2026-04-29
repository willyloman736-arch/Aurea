"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasDatabase, prisma } from "@/lib/db";
import { statusToProgress } from "@/lib/tracking-code";
import {
  demoCreate,
  demoAddEvent,
  demoFindByCode,
} from "@/lib/demo-store";
import type { ShipmentStatus } from "@/lib/types";

function s(formData: FormData, key: string): string | undefined {
  const v = (formData.get(key) as string | null)?.trim();
  return v && v.length > 0 ? v : undefined;
}

export async function createShipmentAction(formData: FormData) {
  const trackingCode = s(formData, "trackingCode")?.toUpperCase();
  if (!trackingCode) return { error: "Tracking number is required." };

  const senderName = s(formData, "senderName");
  const receiverName = s(formData, "receiverName");
  const senderCity = s(formData, "senderCity");
  const receiverCity = s(formData, "receiverCity");

  if (!senderName || !receiverName) {
    return { error: "Sender and recipient names are required." };
  }
  if (!senderCity || !receiverCity) {
    return { error: "Sender and recipient cities are required." };
  }

  const status = (s(formData, "status") ?? "Pending") as ShipmentStatus;
  const piecesRaw = s(formData, "pieces");
  const pieces = piecesRaw ? Math.max(1, parseInt(piecesRaw, 10) || 1) : 1;
  const progress = statusToProgress(status);

  const data = {
    trackingCode,
    status,
    progress,
    pieces,
    weight: s(formData, "weight"),
    dimensions: s(formData, "dimensions"),
    declaredValue: s(formData, "declaredValue"),

    senderName,
    senderEmail: s(formData, "senderEmail"),
    senderPhone: s(formData, "senderPhone"),
    originCity: senderCity,
    originAddr: s(formData, "senderAddr"),

    receiverName,
    receiverEmail: s(formData, "receiverEmail"),
    receiverPhone: s(formData, "receiverPhone"),
    destCity: receiverCity,
    destAddr: s(formData, "receiverAddr"),

    packageDescription: s(formData, "packageDescription"),
    dispatchLocation: s(formData, "dispatchLocation"),
    etaDate: s(formData, "etaDate"),
    internalNotes: s(formData, "internalNotes"),
  };

  // Demo mode — write to in-process store when DATABASE_URL isn't configured.
  if (!hasDatabase()) {
    if (demoFindByCode(trackingCode)) {
      return {
        error: `Tracking code ${trackingCode} already exists. Regenerate or pick a new one.`,
      };
    }
    const saved = demoCreate(data);
    demoAddEvent(saved.id, {
      time: new Date(),
      title: `Shipment created · ${status.toLowerCase()}`,
      location: data.dispatchLocation ?? data.originCity ?? null,
      status,
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/shipments");
    revalidatePath(`/track/${trackingCode}`);
    redirect(`/dashboard/shipments/${saved.id}`);
  }

  try {
    const existing = await prisma.shipment.findUnique({
      where: { trackingCode },
      select: { id: true },
    });
    if (existing) {
      return {
        error: `Tracking code ${trackingCode} already exists. Regenerate or pick a new one.`,
      };
    }

    const saved = await prisma.shipment.create({ data });

    await prisma.trackingEvent.create({
      data: {
        shipmentId: saved.id,
        time: new Date(),
        title: `Shipment created · ${status.toLowerCase()}`,
        location: data.dispatchLocation ?? data.originCity ?? null,
        status: status,
        latest: true,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/shipments");
    revalidatePath(`/track/${trackingCode}`);
    redirect(`/dashboard/shipments/${saved.id}`);
  } catch (err) {
    if (err instanceof Error && err.message === "NEXT_REDIRECT") throw err;
    return { error: (err as Error).message };
  }
}
