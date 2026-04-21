/**
 * EasyPost REST client — Phase 2.
 * Using fetch directly instead of the SDK for fewer deps + edge-compatible.
 *
 * https://docs.easypost.com/docs/tracking
 */

const API_URL = "https://api.easypost.com/v2";

function authHeader(): HeadersInit {
  const key = process.env.EASYPOST_API_KEY;
  if (!key) throw new Error("EASYPOST_API_KEY is not set");
  // EasyPost uses HTTP Basic auth with the API key as the username (no password).
  const token = Buffer.from(`${key}:`).toString("base64");
  return {
    Authorization: `Basic ${token}`,
    "Content-Type": "application/json",
  };
}

export interface EasyPostTracker {
  id: string;
  tracking_code: string;
  carrier: string;
  status: string;
  status_detail?: string;
  signed_by?: string | null;
  weight?: number | null;
  est_delivery_date?: string | null;
  shipment_id?: string | null;
  tracking_details: Array<{
    object: "TrackingDetail";
    message: string;
    description?: string;
    status: string;
    status_detail?: string;
    datetime: string;
    source?: string;
    tracking_location: {
      city: string | null;
      state: string | null;
      country: string | null;
      zip: string | null;
    };
  }>;
  carrier_detail?: {
    object: "CarrierDetail";
    service?: string;
    container_type?: string;
    origin_location?: string;
    destination_location?: string;
  } | null;
  public_url?: string;
  created_at: string;
  updated_at: string;
}

export interface EasyPostError {
  error: {
    code: string;
    message: string;
    errors?: Array<{ field?: string; message: string }>;
  };
}

/** Create a new tracker. EasyPost auto-detects carrier if not provided. */
export async function createTracker(
  trackingCode: string,
  carrier?: string,
): Promise<EasyPostTracker> {
  const res = await fetch(`${API_URL}/trackers`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({
      tracker: {
        tracking_code: trackingCode,
        ...(carrier ? { carrier } : {}),
      },
    }),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as Partial<EasyPostError>;
    throw new Error(
      err.error?.message ?? `EasyPost createTracker ${res.status}`,
    );
  }
  return res.json();
}

/** Fetch an existing tracker by EasyPost ID. */
export async function getTrackerById(id: string): Promise<EasyPostTracker | null> {
  const res = await fetch(`${API_URL}/trackers/${id}`, {
    headers: authHeader(),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`EasyPost getTracker ${res.status}`);
  return res.json();
}

/** Find trackers by tracking code — returns most recent match. */
export async function findTrackerByCode(
  trackingCode: string,
): Promise<EasyPostTracker | null> {
  const params = new URLSearchParams({ tracking_code: trackingCode });
  const res = await fetch(`${API_URL}/trackers?${params.toString()}`, {
    headers: authHeader(),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { trackers: EasyPostTracker[] };
  return data.trackers?.[0] ?? null;
}

/**
 * Get-or-create: try to find an existing tracker for this code first;
 * if none exists, create one. EasyPost charges once per unique tracker,
 * so we avoid duplicate creation on repeat lookups.
 */
export async function lookupOrCreateTracker(
  trackingCode: string,
  carrier?: string,
): Promise<EasyPostTracker> {
  const existing = await findTrackerByCode(trackingCode).catch(() => null);
  if (existing) return existing;
  return createTracker(trackingCode, carrier);
}

export function hasEasyPost(): boolean {
  return Boolean(process.env.EASYPOST_API_KEY);
}
