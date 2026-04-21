import type { Shipment, ShipmentEvent, ShipmentProgress, ShipmentStatus } from "./types";
import type { EasyPostTracker } from "./easypost";

/** EasyPost status → our progress step (1–4). */
const STATUS_TO_PROGRESS: Record<string, ShipmentProgress> = {
  pre_transit: 1,
  in_transit: 2,
  out_for_delivery: 3,
  delivered: 4,
  available_for_pickup: 3,
  return_to_sender: 2,
  failure: 2,
  cancelled: 1,
  error: 1,
  unknown: 1,
};

/** EasyPost status → our display label. */
const STATUS_TO_LABEL: Record<string, ShipmentStatus> = {
  pre_transit: "Label created",
  in_transit: "In Transit",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  available_for_pickup: "Out for delivery",
  return_to_sender: "Exception",
  failure: "Exception",
  cancelled: "Exception",
  error: "Exception",
  unknown: "In Transit",
};

const CARRIER_LABEL: Record<string, string> = {
  FedEx: "FedEx",
  FedExDefault: "FedEx",
  UPS: "UPS",
  USPS: "USPS",
  DHL: "DHL",
  DHLExpress: "DHL Express",
  Canpar: "Canpar",
  OnTrac: "OnTrac",
};

function formatDateStr(iso: string | null | undefined): string {
  if (!iso) return "Pending";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Pending";
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatEventTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatLocation(loc: EasyPostTracker["tracking_details"][number]["tracking_location"]): string {
  return [loc?.city, loc?.state, loc?.country].filter(Boolean).join(", ") || "—";
}

export function easypostToShipment(tracker: EasyPostTracker): Shipment {
  const progress: ShipmentProgress = STATUS_TO_PROGRESS[tracker.status] ?? 1;
  const status: ShipmentStatus = STATUS_TO_LABEL[tracker.status] ?? "In Transit";

  // Sort events newest → oldest
  const sorted = [...(tracker.tracking_details ?? [])].sort(
    (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime(),
  );

  const events: ShipmentEvent[] = sorted.slice(0, 12).map((ev, i) => ({
    time: formatEventTime(ev.datetime),
    title: ev.message || ev.description || ev.status_detail || ev.status,
    loc: formatLocation(ev.tracking_location),
    latest: i === 0,
  }));

  const firstEvent = sorted[sorted.length - 1];
  const lastEvent = sorted[0];
  const origin = firstEvent?.tracking_location;
  const destination = lastEvent?.tracking_location;

  const carrierLabel = CARRIER_LABEL[tracker.carrier] ?? tracker.carrier;
  const service = tracker.carrier_detail?.service
    ? `${carrierLabel} ${tracker.carrier_detail.service}`
    : carrierLabel;

  return {
    id: tracker.tracking_code,
    status,
    service,
    weight: tracker.weight ? `${(tracker.weight * 28.35).toFixed(0)} g` : "—",
    pieces: 1,
    dimensions: "—",
    origin: {
      city:
        tracker.carrier_detail?.origin_location ||
        (origin ? formatLocation(origin) : "Origin pending"),
      addr: carrierLabel,
    },
    destination: {
      city:
        tracker.carrier_detail?.destination_location ||
        (destination ? formatLocation(destination) : "Destination pending"),
      addr: carrierLabel,
    },
    etaDate: formatDateStr(tracker.est_delivery_date),
    etaWindow:
      tracker.status === "delivered"
        ? "Delivered"
        : tracker.est_delivery_date
          ? "Estimated"
          : "Awaiting first scan",
    progress,
    events: events.length > 0 ? events : [
      {
        time: formatEventTime(tracker.updated_at),
        title: "Tracker created — awaiting first carrier scan",
        loc: carrierLabel,
        latest: true,
      },
    ],
  };
}
