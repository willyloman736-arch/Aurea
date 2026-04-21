import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatTrackingId(raw: string): string {
  return raw.trim().toUpperCase();
}
