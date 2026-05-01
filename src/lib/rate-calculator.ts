// Plausible rate model for the public quote calculator. Numbers are believable
// for premium courier service — not real published rates. Replace with a live
// pricing API call when one exists.

export interface City {
  name: string;
  region: string;
  country: string;
}

export const CITIES: City[] = [
  { name: "Lagos", region: "africa-w", country: "NG" },
  { name: "Johannesburg", region: "africa-s", country: "ZA" },
  { name: "Amsterdam", region: "europe-w", country: "NL" },
  { name: "Rotterdam", region: "europe-w", country: "NL" },
  { name: "Berlin", region: "europe-de", country: "DE" },
  { name: "London", region: "europe-w", country: "UK" },
  { name: "Paris", region: "europe-w", country: "FR" },
  { name: "Dubai", region: "mideast", country: "AE" },
  { name: "Singapore", region: "asia-se", country: "SG" },
  { name: "Hong Kong", region: "asia-ne", country: "HK" },
  { name: "Tokyo", region: "asia-ne", country: "JP" },
  { name: "Mumbai", region: "asia-s", country: "IN" },
  { name: "Los Angeles", region: "america-w", country: "US" },
  { name: "New York", region: "america-e", country: "US" },
  { name: "São Paulo", region: "america-s", country: "BR" },
];

export type ServiceTier = "express" | "freight" | "sameDay";

export interface ServiceInfo {
  id: ServiceTier;
  label: string;
  description: string;
  multiplier: number;
}

export const SERVICES: ServiceInfo[] = [
  {
    id: "express",
    label: "Express parcel",
    description: "Door-to-door under 72 hours, daily routes",
    multiplier: 1,
  },
  {
    id: "freight",
    label: "Freight",
    description: "Pallet & container, customs handled",
    multiplier: 0.72,
  },
  {
    id: "sameDay",
    label: "Same-day",
    description: "Within-city, sealed transit, GPS",
    multiplier: 2.8,
  },
];

function continent(region: string): string {
  return region.split("-")[0];
}

/** 1 = same region/country, 2 = same continent, 3 = cross-continent. */
export function getZone(origin: City, dest: City): 1 | 2 | 3 {
  if (origin.region === dest.region) return 1;
  if (continent(origin.region) === continent(dest.region)) return 2;
  return 3;
}

export interface RateBreakdown {
  base: number;
  weight: number;
  service: number;
  total: number;
  etaMin: number;
  etaMax: number;
  zone: 1 | 2 | 3;
  zoneLabel: string;
}

const ZONE_LABELS: Record<number, string> = {
  1: "Regional lane",
  2: "Continental lane",
  3: "Cross-continent lane",
};

const BASE_BY_ZONE = [0, 14, 32, 78];
const PER_KG_BY_ZONE = [0, 1.4, 2.8, 5.6];

export function calculateRate(opts: {
  origin: City;
  dest: City;
  weightKg: number;
  pieces: number;
  service: ServiceTier;
}): RateBreakdown {
  const { origin, dest, weightKg, pieces, service } = opts;
  const zone = getZone(origin, dest);
  const tier = SERVICES.find((s) => s.id === service)!;

  const base = BASE_BY_ZONE[zone];
  const weight = PER_KG_BY_ZONE[zone] * weightKg * Math.max(1, pieces);
  const subtotal = base + weight;
  const serviceFee = subtotal * tier.multiplier - subtotal;
  const total = subtotal + serviceFee;

  let etaMin: number;
  let etaMax: number;
  if (service === "sameDay") {
    if (zone !== 1) {
      // Same-day only valid within region
      etaMin = -1;
      etaMax = -1;
    } else {
      etaMin = 0;
      etaMax = 0;
    }
  } else if (service === "freight") {
    etaMin = zone + 2;
    etaMax = zone + 4;
  } else {
    etaMin = zone;
    etaMax = zone + 1;
  }

  return {
    base,
    weight,
    service: serviceFee,
    total,
    etaMin,
    etaMax,
    zone,
    zoneLabel: ZONE_LABELS[zone],
  };
}

/** Tracking-style reference for booking and claim confirmations. */
export function generateReference(prefix: "BK" | "CL"): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = `USPS-S-${prefix}-`;
  for (let i = 0; i < 6; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}
