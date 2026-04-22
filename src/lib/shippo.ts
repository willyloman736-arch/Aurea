/**
 * Shippo REST client — Phase 2.
 * Replaces the EasyPost client. Same contract: lookupTracker returns a
 * provider-agnostic object that our mapper transforms into a Shipment.
 *
 * https://docs.goshippo.com/shippoapi/public-api
 */

const API_URL = "https://api.goshippo.com";

function authHeader(): HeadersInit {
  const key = process.env.SHIPPO_API_KEY;
  if (!key) throw new Error("SHIPPO_API_KEY is not set");
  return {
    Authorization: `ShippoToken ${key}`,
    "Content-Type": "application/json",
  };
}

export interface ShippoAddress {
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zip?: string | null;
}

export interface ShippoTrackingStatus {
  status: "UNKNOWN" | "PRE_TRANSIT" | "TRANSIT" | "DELIVERED" | "RETURNED" | "FAILURE";
  status_details: string;
  status_date: string;
  location: ShippoAddress | null;
  substatus?: string | null;
}

export interface ShippoTracker {
  carrier: string;
  tracking_number: string;
  address_from: ShippoAddress | null;
  address_to: ShippoAddress | null;
  eta: string | null;
  original_eta: string | null;
  servicelevel: { token?: string; name?: string; terms?: string } | null;
  tracking_status: ShippoTrackingStatus;
  tracking_history: ShippoTrackingStatus[];
  messages?: Array<string | { text?: string; code?: string; source?: string }>;
  metadata?: string;
  test: boolean;
  object_created?: string;
  object_updated?: string;
}

/**
 * Heuristic carrier detection from tracking-number format.
 * Covers the common US carriers; falls back to null for unknown patterns.
 */
export function detectCarrier(trackingNumber: string): string | null {
  const n = trackingNumber.replace(/[\s-]/g, "").toUpperCase();

  // Shippo test trackers
  if (n.startsWith("SHIPPO_")) return "shippo";

  // UPS — 1Z + 16 alphanumeric
  if (/^1Z[0-9A-Z]{16}$/.test(n)) return "ups";

  // USPS — starts with 94, 93, 92, 91, 82 + 20–22 digits
  if (/^(94|93|92|91|82)\d{18,20}$/.test(n)) return "usps";

  // FedEx — 12, 14, 15, 20, or 22 digits
  if (/^\d{12}$|^\d{14}$|^\d{15}$|^\d{20}$|^\d{22}$/.test(n)) return "fedex";

  // DHL Express — 10–11 digits
  if (/^\d{10,11}$/.test(n)) return "dhl_express";

  return null;
}

/** Carriers to try when we can't guess from the tracking-number format. */
const FALLBACK_CARRIERS = [
  "shippo",      // test-mode mock carrier
  "usps",
  "ups",
  "fedex",
  "dhl_express",
];

/** Register a tracker — subscribes to webhook updates. Idempotent on Shippo's side. */
export async function registerTracker(
  trackingNumber: string,
  carrier: string,
): Promise<ShippoTracker> {
  const res = await fetch(`${API_URL}/tracks/`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({
      carrier: carrier.toLowerCase(),
      tracking_number: trackingNumber,
      metadata: `aurea`,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Shippo register ${res.status}: ${body}`);
  }
  return res.json();
}

/** Get a single tracker by carrier + number. Returns null on 404. */
export async function getTracker(
  carrier: string,
  trackingNumber: string,
): Promise<ShippoTracker | null> {
  const url = `${API_URL}/tracks/${carrier.toLowerCase()}/${encodeURIComponent(trackingNumber)}/`;
  const res = await fetch(url, { headers: authHeader() });
  if (res.status === 404) return null;
  if (!res.ok) return null;
  return res.json();
}

/**
 * Lookup-or-create: try the detected/specified carrier first, then the
 * fallback sweep. If nothing exists, register a new tracker under the best
 * guess so future lookups hit the cache.
 */
export async function lookupOrCreateTracker(
  trackingNumber: string,
  carrier?: string,
): Promise<ShippoTracker | null> {
  const guessed = carrier ?? detectCarrier(trackingNumber);
  const carriers = guessed
    ? [guessed, ...FALLBACK_CARRIERS.filter((c) => c !== guessed)]
    : FALLBACK_CARRIERS;

  // Try existing trackers first — no billing, no side effects.
  for (const c of carriers) {
    const existing = await getTracker(c, trackingNumber).catch(() => null);
    if (existing) return existing;
  }

  // None found — register under the best guess (or "shippo" test fallback).
  try {
    return await registerTracker(trackingNumber, guessed ?? "shippo");
  } catch {
    return null;
  }
}

export function hasShippo(): boolean {
  return Boolean(process.env.SHIPPO_API_KEY);
}
