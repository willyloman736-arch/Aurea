export type ShipmentStatus =
  | "Label created"
  | "In Transit"
  | "Out for delivery"
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
}

export const STEP_LABELS = [
  "Picked up",
  "In transit",
  "Out for delivery",
  "Delivered",
] as const;
