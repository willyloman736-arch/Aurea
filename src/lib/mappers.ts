import type { Shipment, ShipmentEvent, ShipmentProgress, ShipmentStatus } from "./types";
import type { ShippoAddress, ShippoTracker, ShippoTrackingStatus } from "./shippo";

/** Shippo status → our progress step (1–4). */
const STATUS_TO_PROGRESS: Record<ShippoTrackingStatus["status"], ShipmentProgress> = {
  UNKNOWN: 1,
  PRE_TRANSIT: 1,
  TRANSIT: 2,
  DELIVERED: 4,
  RETURNED: 2,
  FAILURE: 2,
};

/** Shippo status → our display label. */
const STATUS_TO_LABEL: Record<ShippoTrackingStatus["status"], ShipmentStatus> = {
  UNKNOWN: "In Transit",
  PRE_TRANSIT: "Pending",
  TRANSIT: "In Transit",
  DELIVERED: "Delivered",
  RETURNED: "Exception",
  FAILURE: "Exception",
};

const CARRIER_LABEL: Record<string, string> = {
  shippo: "Shippo (test)",
  usps: "USPS",
  ups: "UPS",
  fedex: "FedEx",
  dhl_express: "DHL Express",
  dhl: "DHL",
  canada_post: "Canada Post",
  ontrac: "OnTrac",
  lasership: "LaserShip",
  newgistics: "Newgistics",
};

function carrierLabel(carrier: string): string {
  return CARRIER_LABEL[carrier.toLowerCase()] ?? carrier.toUpperCase();
}

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

function formatAddress(addr: ShippoAddress | null | undefined): string {
  if (!addr) return "—";
  return [addr.city, addr.state, addr.country].filter(Boolean).join(", ") || "—";
}

export function shippoToShipment(tracker: ShippoTracker): Shipment {
  const status = tracker.tracking_status;
  const progress: ShipmentProgress = STATUS_TO_PROGRESS[status.status] ?? 1;
  const label: ShipmentStatus = STATUS_TO_LABEL[status.status] ?? "In Transit";

  // Sort history newest → oldest
  const sorted = [...(tracker.tracking_history ?? [])].sort(
    (a, b) => new Date(b.status_date).getTime() - new Date(a.status_date).getTime(),
  );

  const events: ShipmentEvent[] = sorted.slice(0, 12).map((ev, i) => ({
    time: formatEventTime(ev.status_date),
    title: ev.status_details || ev.status.replace(/_/g, " ").toLowerCase(),
    loc: formatAddress(ev.location),
    latest: i === 0,
  }));

  // "Out for delivery" is a substatus inside TRANSIT — try to detect it.
  const substatusText = (status.substatus ?? "").toLowerCase();
  if (substatusText.includes("out_for_delivery") || substatusText.includes("out for delivery")) {
    return buildShipment({
      tracker,
      events,
      label: "Out for delivery",
      progress: 3,
    });
  }

  return buildShipment({ tracker, events, label, progress });
}

function buildShipment({
  tracker,
  events,
  label,
  progress,
}: {
  tracker: ShippoTracker;
  events: ShipmentEvent[];
  label: ShipmentStatus;
  progress: ShipmentProgress;
}): Shipment {
  const carrier = carrierLabel(tracker.carrier);
  const service = tracker.servicelevel?.name
    ? `${carrier} ${tracker.servicelevel.name}`
    : carrier;

  return {
    id: tracker.tracking_number,
    status: label,
    service,
    weight: "—",
    pieces: 1,
    dimensions: "—",
    origin: {
      city: formatAddress(tracker.address_from),
      addr: carrier,
    },
    destination: {
      city: formatAddress(tracker.address_to),
      addr: carrier,
    },
    etaDate: formatDateStr(tracker.eta),
    etaWindow:
      tracker.tracking_status.status === "DELIVERED"
        ? "Delivered"
        : tracker.eta
          ? "Estimated"
          : "Awaiting first scan",
    progress,
    events:
      events.length > 0
        ? events
        : [
            {
              time: formatEventTime(tracker.object_updated ?? new Date().toISOString()),
              title: "Tracker created — awaiting first carrier scan",
              loc: carrier,
              latest: true,
            },
          ],
  };
}
