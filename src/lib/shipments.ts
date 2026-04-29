import type { Shipment } from "./types";
import { getShipment as getDemoShipment } from "@/content/shipments";
import { hasShippo, lookupOrCreateTracker, type ShippoTracker } from "./shippo";
import { shippoToShipment } from "./mappers";
import { hasDatabase, prisma } from "./db";

/** How long a cached shipment is considered fresh before refreshing from Shippo. */
const CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes

/**
 * Unified shipment lookup.
 *
 * Resolution order:
 *   1. DEMO_SHIPMENTS (hardcoded in content/shipments.ts) — marketing demos.
 *   2. DB cache — if recent, return cached.
 *   3. Shippo live API — lookup-or-create under auto-detected carrier.
 *      → writes to DB cache on success.
 *   4. null (→ 404).
 */
export async function lookupShipment(trackingCode: string): Promise<Shipment | null> {
  const code = trackingCode.trim().toUpperCase();

  // 1. Demo
  const demo = getDemoShipment(code);
  if (demo) return demo;

  // 2. DB cache
  if (hasDatabase()) {
    try {
      const cached = await prisma.shipment.findUnique({
        where: { trackingCode: code },
        include: { events: { orderBy: { time: "desc" } } },
      });
      if (cached) {
        const age = Date.now() - cached.updatedAt.getTime();
        if (age < CACHE_TTL_MS) return dbToShipment(cached);
      }
    } catch (err) {
      console.error("DB cache lookup failed:", err);
    }
  }

  // 3. Shippo live
  if (hasShippo()) {
    try {
      const tracker = await lookupOrCreateTracker(code);
      if (!tracker) return null;
      const shipment = shippoToShipment(tracker);
      if (hasDatabase()) {
        cacheTracker(tracker, shipment).catch((err) =>
          console.error("Failed to cache tracker:", err),
        );
      }
      return shipment;
    } catch (err) {
      console.error("Shippo lookup failed:", err);
    }
  }

  return null;
}

type DbShipmentWithEvents = {
  id: string;
  trackingCode: string;
  carrier: string | null;
  status: string;
  service: string | null;
  weight: string | null;
  pieces: number;
  dimensions: string | null;
  originCity: string | null;
  originAddr: string | null;
  destCity: string | null;
  destAddr: string | null;
  etaDate: string | null;
  etaWindow: string | null;
  progress: number;
  senderName: string | null;
  senderEmail: string | null;
  senderPhone: string | null;
  receiverName: string | null;
  receiverEmail: string | null;
  receiverPhone: string | null;
  packageDescription: string | null;
  events: Array<{
    time: Date;
    title: string;
    location: string | null;
    latest: boolean;
  }>;
};

function dbToShipment(s: DbShipmentWithEvents): Shipment {
  return {
    id: s.trackingCode,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    status: s.status as any,
    service: s.service ?? "—",
    weight: s.weight ?? "—",
    pieces: s.pieces ?? 1,
    dimensions: s.dimensions ?? "—",
    origin: {
      city: s.originCity ?? "Origin",
      addr: s.originAddr ?? "",
    },
    destination: {
      city: s.destCity ?? "Destination",
      addr: s.destAddr ?? "",
    },
    etaDate: s.etaDate ?? "Pending",
    etaWindow: s.etaWindow ?? "—",
    progress: Math.max(1, Math.min(4, s.progress)) as 1 | 2 | 3 | 4,
    sender: s.senderName
      ? {
          name: s.senderName,
          email: s.senderEmail ?? undefined,
          phone: s.senderPhone ?? undefined,
        }
      : undefined,
    receiver: s.receiverName
      ? {
          name: s.receiverName,
          email: s.receiverEmail ?? undefined,
          phone: s.receiverPhone ?? undefined,
        }
      : undefined,
    packageDescription: s.packageDescription ?? undefined,
    events: s.events.map((ev, i) => ({
      time: ev.time.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      title: ev.title,
      loc: ev.location ?? "—",
      latest: ev.latest || i === 0,
    })),
  };
}

async function cacheTracker(tracker: ShippoTracker, mapped: Shipment) {
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

  const shipment = await prisma.shipment.upsert({
    where: { trackingCode: mapped.id },
    update: data,
    create: data,
  });

  await prisma.trackingEvent.deleteMany({ where: { shipmentId: shipment.id } });
  const events = (tracker.tracking_history ?? []).slice(0, 12).map((ev, i) => ({
    shipmentId: shipment.id,
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
}
