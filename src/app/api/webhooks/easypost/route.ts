import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma, hasDatabase } from "@/lib/db";
import { easypostToShipment } from "@/lib/mappers";
import type { EasyPostTracker } from "@/lib/easypost";

export const dynamic = "force-dynamic";

/**
 * POST /api/webhooks/easypost
 *
 * Receives tracker.updated events from EasyPost and refreshes our cache.
 * https://docs.easypost.com/docs/webhooks
 *
 * To enable:
 *   1. In EasyPost dashboard → Webhooks, add:
 *        URL:    https://your-domain.com/api/webhooks/easypost
 *        Secret: (random string, paste into EASYPOST_WEBHOOK_SECRET env)
 *   2. Select event: tracker.updated
 */
export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ ok: true, cached: false });
  }

  // Verify signature (HMAC-SHA256 of raw body with the configured secret)
  const secret = process.env.EASYPOST_WEBHOOK_SECRET;
  const signature = request.headers.get("x-hmac-signature");
  const raw = await request.text();

  if (secret) {
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }
    const expected = crypto
      .createHmac("sha256", secret)
      .update(raw, "utf8")
      .digest("hex");
    const provided = signature.replace(/^hmac-sha256=/i, "");
    const match =
      expected.length === provided.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
    if (!match) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const body = JSON.parse(raw) as {
    description?: string;
    result?: EasyPostTracker;
  };

  if (body.description !== "tracker.updated" || !body.result) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const tracker = body.result;
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

  const shipment = await prisma.shipment.upsert({
    where: { trackingCode: mapped.id },
    update: data,
    create: data,
  });

  await prisma.trackingEvent.deleteMany({ where: { shipmentId: shipment.id } });
  const events = tracker.tracking_details.slice(0, 12).map((ev, i) => ({
    shipmentId: shipment.id,
    time: new Date(ev.datetime),
    title: ev.message || ev.description || ev.status,
    location:
      [
        ev.tracking_location?.city,
        ev.tracking_location?.state,
        ev.tracking_location?.country,
      ]
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
