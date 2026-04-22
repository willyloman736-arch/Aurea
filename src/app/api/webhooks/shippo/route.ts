import { NextResponse } from "next/server";
import { prisma, hasDatabase } from "@/lib/db";
import { shippoToShipment } from "@/lib/mappers";
import type { ShippoTracker } from "@/lib/shippo";

export const dynamic = "force-dynamic";

/**
 * POST /api/webhooks/shippo?token=<SHIPPO_WEBHOOK_SECRET>
 *
 * Receives track_updated events from Shippo and refreshes our cache.
 * https://docs.goshippo.com/shippoapi/public-api/#webhook-events
 *
 * Shippo doesn't HMAC-sign outbound webhooks, so we authenticate via a
 * shared-secret token in the query string.
 *
 * To enable:
 *   1. Set SHIPPO_WEBHOOK_SECRET to a long random string (e.g. `openssl rand -hex 32`)
 *   2. In Shippo → Webhooks, add a webhook pointed at:
 *        https://<your-domain>/api/webhooks/shippo?token=<that-same-secret>
 *   3. Subscribe to event: "track_updated"
 */
export async function POST(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const expected = process.env.SHIPPO_WEBHOOK_SECRET;

  if (expected) {
    if (!token || token !== expected) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!hasDatabase()) {
    return NextResponse.json({ ok: true, cached: false });
  }

  let body: { event?: string; data?: ShippoTracker } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.event !== "track_updated" || !body.data) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const tracker = body.data;
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

  return NextResponse.json({ ok: true });
}
