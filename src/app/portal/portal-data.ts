// Demo data for the live tracking portal. In production this would stream
// from /api/portal-feed via SSE or websockets.

export interface Hub {
  id: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
}

export interface ActiveShipment {
  id: string;
  trackingCode: string;
  fromHub: string;
  toHub: string;
  status:
    | "Picked up"
    | "In Transit"
    | "Out for delivery"
    | "Delivered"
    | "Exception";
  pieces: number;
  weight: string;
  recipient: string;
  /** 0–1 — how far along the route the cargo currently is. */
  progress: number;
  /** ETA as ISO date string */
  eta: string;
}

export interface PortalEvent {
  id: string;
  trackingCode: string;
  title: string;
  city: string;
  time: string; // formatted HH:MM
  status: ActiveShipment["status"];
}

export const HUBS: Hub[] = [
  { id: "lagos", city: "Lagos", country: "NG", lat: 6.45, lng: 3.4 },
  { id: "amsterdam", city: "Amsterdam", country: "NL", lat: 52.37, lng: 4.9 },
  { id: "rotterdam", city: "Rotterdam", country: "NL", lat: 51.92, lng: 4.48 },
  { id: "berlin", city: "Berlin", country: "DE", lat: 52.52, lng: 13.4 },
  { id: "london", city: "London", country: "UK", lat: 51.51, lng: -0.13 },
  { id: "dubai", city: "Dubai", country: "AE", lat: 25.2, lng: 55.27 },
  { id: "singapore", city: "Singapore", country: "SG", lat: 1.35, lng: 103.82 },
  { id: "hongkong", city: "Hong Kong", country: "HK", lat: 22.32, lng: 114.17 },
  { id: "tokyo", city: "Tokyo", country: "JP", lat: 35.68, lng: 139.76 },
  { id: "mumbai", city: "Mumbai", country: "IN", lat: 19.07, lng: 72.87 },
  { id: "la", city: "Los Angeles", country: "US", lat: 33.94, lng: -118.41 },
  { id: "ny", city: "New York", country: "US", lat: 40.71, lng: -74.0 },
  { id: "sao-paulo", city: "São Paulo", country: "BR", lat: -23.55, lng: -46.63 },
  {
    id: "joburg",
    city: "Johannesburg",
    country: "ZA",
    lat: -26.2,
    lng: 28.04,
  },
];

export const SHIPMENTS: ActiveShipment[] = [
  {
    id: "s1",
    trackingCode: "AUR-K7M9Q3P",
    fromHub: "lagos",
    toHub: "amsterdam",
    status: "In Transit",
    pieces: 2,
    weight: "4.8 kg",
    recipient: "Maya Aldrin",
    progress: 0.62,
    eta: "Tomorrow · 14:00",
  },
  {
    id: "s2",
    trackingCode: "AUR-J2X8R4N",
    fromHub: "singapore",
    toHub: "tokyo",
    status: "Out for delivery",
    pieces: 1,
    weight: "1.2 kg",
    recipient: "Daniel Okafor",
    progress: 0.94,
    eta: "Today · 17:30",
  },
  {
    id: "s3",
    trackingCode: "AUR-M5T2Y9F",
    fromHub: "dubai",
    toHub: "mumbai",
    status: "Picked up",
    pieces: 6,
    weight: "32.0 kg",
    recipient: "Flexport India",
    progress: 0.08,
    eta: "Wed · 10:00",
  },
  {
    id: "s4",
    trackingCode: "AUR-Q9N4D7B",
    fromHub: "ny",
    toHub: "la",
    status: "In Transit",
    pieces: 3,
    weight: "8.4 kg",
    recipient: "Ramp Ops",
    progress: 0.45,
    eta: "Tomorrow · 09:00",
  },
  {
    id: "s5",
    trackingCode: "AUR-W3F6L8H",
    fromHub: "hongkong",
    toHub: "berlin",
    status: "In Transit",
    pieces: 1,
    weight: "0.8 kg",
    recipient: "Vendr EU",
    progress: 0.31,
    eta: "Fri · 11:00",
  },
  {
    id: "s6",
    trackingCode: "AUR-G4K7P2J",
    fromHub: "rotterdam",
    toHub: "london",
    status: "Out for delivery",
    pieces: 4,
    weight: "12.6 kg",
    recipient: "Notion UK",
    progress: 0.88,
    eta: "Today · 15:00",
  },
  {
    id: "s7",
    trackingCode: "AUR-V1R5C8X",
    fromHub: "joburg",
    toHub: "sao-paulo",
    status: "Exception",
    pieces: 2,
    weight: "5.2 kg",
    recipient: "ProServ BR",
    progress: 0.55,
    eta: "Held — customs",
  },
  {
    id: "s8",
    trackingCode: "AUR-Z8B3M6S",
    fromHub: "amsterdam",
    toHub: "tokyo",
    status: "In Transit",
    pieces: 1,
    weight: "2.4 kg",
    recipient: "Shopify JP",
    progress: 0.74,
    eta: "Tomorrow · 22:00",
  },
];

// Templates from which the live ticker generates plausible events.
export const EVENT_TEMPLATES = [
  { title: "Picked up by courier", status: "Picked up" as const },
  { title: "Departed origin hub", status: "In Transit" as const },
  { title: "Arrived sorting facility", status: "In Transit" as const },
  { title: "In transit on lane", status: "In Transit" as const },
  { title: "Customs cleared", status: "In Transit" as const },
  { title: "Out for delivery", status: "Out for delivery" as const },
  { title: "Delivered to recipient", status: "Delivered" as const },
  { title: "Geo-verified handoff", status: "Delivered" as const },
];
