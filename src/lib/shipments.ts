import type { Shipment } from "./types";
import { getShipment as getDemoShipment } from "@/content/shipments";
import { hasEasyPost, lookupOrCreateTracker, type EasyPostTracker } from "./easypost";
import { easypostToShipment } from "./mappers";
import { hasDatabase, prisma } from "./db";

/** How long a cached shipment is considered fresh before refreshing from EasyPost. */
const CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes

/**
 * Unified shipment lookup.
 *
 * Resolution order:
 *   1. DEMO_SHIPMENTS (hardcoded in content/shipments.ts) — for marketing demos
 *   2. DB cache (if recent)
 *   3. EasyPost live API (creates tracker if new)
 *      → writes to DB cache
 *   4. null (→ 404)
 */
export async function lookupShipment(trackingCode: string): Promise<Shipment | null> {
  const code = trackingCode.trim().toUpperCase();

  // 1. Demo (always works, no network, no DB)
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
        // else fall through to refresh from EasyPost
      }
    } catch (err) {
      console.error("DB cache lookup failed:", err);
    }
  }

  // 3. EasyPost live lookup
  if (hasEasyPost()) {
    try {
      const tracker = await lookupOrCreateTracker(code);
      const shipment = easypostToShipment(tracker);
      if (hasDatabase()) {
        cacheTracker(tracker, shipment).catch((err) =>
          console.error("Failed to cache tracker:", err),
        );
      }
      return shipment;
    } catch (err) {
      console.error("EasyPost lookup failed:", err);
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

async function cacheTracker(tracker: EasyPostTracker, mapped: Shipment) {
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

  const shipment = await prisma.shipment.upsert({
    where: { trackingCode: mapped.id },
    update: data,
    create: data,
  });

  // Replace events (simple strategy — fine at our scale)
  await prisma.trackingEvent.deleteMany({ where: { shipmentId: shipment.id } });
  const events = tracker.tracking_details.slice(0, 12).map((ev, i) => ({
    shipmentId: shipment.id,
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
}
