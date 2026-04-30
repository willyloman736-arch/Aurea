// Generates an Aurea tracking code: AUR-XXXXXXX (7 alphanumeric chars,
// uppercase, no ambiguous 0/O/1/I).
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateTrackingCode(): string {
  let code = "AUR-";
  for (let i = 0; i < 7; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}

import type { ShipmentStatus, ShipmentProgress } from "./types";

export const STATUS_OPTIONS: ShipmentStatus[] = [
  "Pending",
  "Picked up",
  "In Transit",
  "Out for delivery",
  "On hold",
  "Delivered",
  "Exception",
];

export function statusToProgress(status: ShipmentStatus): ShipmentProgress {
  switch (status) {
    case "Pending":
    case "Picked up":
      return 1;
    case "In Transit":
      return 2;
    case "On hold":
      return 2;
    case "Out for delivery":
      return 3;
    case "Delivered":
      return 4;
    case "Exception":
      return 2;
  }
}
