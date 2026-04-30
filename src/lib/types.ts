export type ShipmentStatus =
  | "Pending"
  | "Picked up"
  | "In Transit"
  | "Out for delivery"
  | "On hold"
  | "Delivered"
  | "Exception";

export type ShipmentProgress = 1 | 2 | 3 | 4;

export interface ShipmentEvent {
  time: string;
  title: string;
  loc: string;
  latest?: boolean;
}

export interface ShipmentLocation {
  city: string;
  addr: string;
}

export interface ShipmentParty {
  name?: string;
  email?: string;
  phone?: string;
}

export interface Shipment {
  id: string;
  status: ShipmentStatus;
  service: string;
  weight: string;
  pieces: number;
  dimensions: string;
  origin: ShipmentLocation;
  destination: ShipmentLocation;
  etaDate: string;
  etaWindow: string;
  progress: ShipmentProgress;
  events: ShipmentEvent[];
  // Model A — manual courier mode
  sender?: ShipmentParty;
  receiver?: ShipmentParty;
  packageDescription?: string;
}

export const STEP_LABELS = [
  "Picked up",
  "In transit",
  "Out for delivery",
  "Delivered",
] as const;
