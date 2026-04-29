"use server";

import { revalidatePath } from "next/cache";
import { hasDatabase, prisma } from "@/lib/db";
import { statusToProgress } from "@/lib/tracking-code";
import type { ShipmentStatus } from "@/lib/types";

export async function addTrackingEventAction(formData: FormData) {
  if (!hasDatabase()) {
    return { error: "Database is not configured." };
  }

  const shipmentId = (formData.get("shipmentId") as string | null)?.trim();
  const status = (formData.get("status") as string | null)?.trim() as ShipmentStatus | null;
  const title = (formData.get("title") as string | null)?.trim();
  const location = (formData.get("location") as string | null)?.trim() || null;
  const time = (formData.get("time") as string | null)?.trim();

  if (!shipmentId) return { error: "Missing shipment id." };
  if (!status) return { error: "Status is required." };
  if (!title) return { error: "Event title is required." };

  const eventTime = time ? new Date(time) : new Date();
  if (isNaN(eventTime.getTime())) {
    return { error: "Invalid event time." };
  }

  try {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      select: { id: true, trackingCode: true },
    });
    if (!shipment) return { error: "Shipment not found." };

    // Mark previous events as not-latest
    await prisma.trackingEvent.updateMany({
      where: { shipmentId },
      data: { latest: false },
    });

    await prisma.trackingEvent.create({
      data: {
        shipmentId,
        time: eventTime,
        title,
        location,
        status,
        latest: true,
      },
    });

    await prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        status,
        progress: statusToProgress(status),
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/shipments");
    revalidatePath(`/dashboard/shipments/${shipmentId}`);
    revalidatePath(`/track/${shipment.trackingCode}`);

    return { ok: true };
  } catch (err) {
    return { error: (err as Error).message };
  }
}
