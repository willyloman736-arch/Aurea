import type { Shipment } from "@/lib/types";

/**
 * Demo shipment data. Replaced in Phase 2 by EasyPost + Neon lookups.
 * These IDs are advertised in the hero as demo chips.
 */
export const DEMO_SHIPMENTS: Record<string, Shipment> = {
  "AUR-2847-JK3921": {
    id: "AUR-2847-JK3921",
    status: "In Transit",
    service: "Aurea Air Priority",
    weight: "2.4 kg",
    pieces: 1,
    dimensions: "32 × 24 × 8 cm",
    origin: { city: "Singapore", addr: "Changi Airfreight Terminal, SG" },
    destination: { city: "Amsterdam", addr: "Schiphol Cargo, NL — 1118 ZA" },
    etaDate: "Tue, 23 Apr 2026",
    etaWindow: "Between 10:30 — 13:45 local",
    progress: 3,
    events: [
      { time: "Apr 20 · 14:22 CET", title: "Departed customs — international flight AU441", loc: "Singapore Changi (SIN)", latest: true },
      { time: "Apr 20 · 11:08 SGT", title: "Cleared origin customs", loc: "Singapore Changi Freight" },
      { time: "Apr 20 · 08:40 SGT", title: "Arrived at origin sort facility", loc: "Aurea Hub, SG-03" },
      { time: "Apr 19 · 22:15 SGT", title: "Picked up from shipper", loc: "Marina Bay, Singapore" },
      { time: "Apr 19 · 18:02 SGT", title: "Label created — awaiting pickup", loc: "Shipper portal" },
    ],
  },
  "AUR-9931-LM7740": {
    id: "AUR-9931-LM7740",
    status: "Out for delivery",
    service: "Aurea Ground Express",
    weight: "5.8 kg",
    pieces: 2,
    dimensions: "40 × 30 × 22 cm",
    origin: { city: "Rotterdam", addr: "Europoort Terminal, NL" },
    destination: { city: "Berlin", addr: "Mitte, DE — 10115" },
    etaDate: "Today · 20 Apr 2026",
    etaWindow: "Arriving 15:40 — 16:20 local",
    progress: 4,
    events: [
      { time: "Apr 20 · 14:55 CET", title: "Out for delivery with courier #244", loc: "Berlin Mitte depot", latest: true },
      { time: "Apr 20 · 11:20 CET", title: "Arrived at destination facility", loc: "Berlin-Schönefeld sort" },
      { time: "Apr 20 · 06:12 CET", title: "In transit — line-haul from Hannover", loc: "A2 corridor" },
      { time: "Apr 19 · 22:44 CET", title: "Departed origin hub", loc: "Rotterdam Europoort" },
      { time: "Apr 19 · 16:30 CET", title: "Picked up from shipper", loc: "Rotterdam — Kop van Zuid" },
    ],
  },
};

export function getShipment(id: string): Shipment | null {
  const normalized = id.trim().toUpperCase();
  return DEMO_SHIPMENTS[normalized] ?? null;
}
