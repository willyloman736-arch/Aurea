"use server";

import { generateReference } from "@/lib/rate-calculator";

export interface BookingResult {
  ok: boolean;
  reference?: string;
  error?: string;
  // Echoed back for the receipt rendering
  receipt?: {
    total: string;
    base: string;
    weightFee: string;
    serviceFee: string;
    zoneLabel: string;
    etaMin: string;
    etaMax: string;
    senderName: string;
    senderCity: string;
    senderEmail: string;
    receiverName: string;
    receiverCity: string;
    pickupDate: string;
    pickupWindow: string;
    description: string;
    weight: string;
    pieces: string;
    service: string;
    declaredValue: string;
    issuedAt: string;
  };
}

function s(formData: FormData, key: string): string | undefined {
  const v = (formData.get(key) as string | null)?.trim();
  return v && v.length > 0 ? v : undefined;
}

export async function submitBookingAction(
  formData: FormData,
): Promise<BookingResult> {
  const senderName = s(formData, "senderName");
  const senderCity = s(formData, "senderCity");
  const senderEmail = s(formData, "senderEmail");
  const receiverName = s(formData, "receiverName");
  const receiverCity = s(formData, "receiverCity");
  const pickupDate = s(formData, "pickupDate");
  const description = s(formData, "description");

  if (!senderName || !senderCity || !senderEmail) {
    return { ok: false, error: "Sender name, city, and email are required." };
  }
  if (!receiverName || !receiverCity) {
    return { ok: false, error: "Recipient name and city are required." };
  }
  if (!pickupDate) {
    return { ok: false, error: "A pickup date is required." };
  }
  if (!description) {
    return { ok: false, error: "Tell us what you're shipping (one line is enough)." };
  }

  const reference = generateReference("BK");

  return {
    ok: true,
    reference,
    receipt: {
      total: s(formData, "total") ?? "0.00",
      base: s(formData, "base") ?? "0.00",
      weightFee: s(formData, "weightFee") ?? "0.00",
      serviceFee: s(formData, "serviceFee") ?? "0.00",
      zoneLabel: s(formData, "zoneLabel") ?? "—",
      etaMin: s(formData, "etaMin") ?? "—",
      etaMax: s(formData, "etaMax") ?? "—",
      senderName,
      senderCity,
      senderEmail,
      receiverName,
      receiverCity,
      pickupDate,
      pickupWindow: s(formData, "pickupWindow") ?? "—",
      description,
      weight: s(formData, "weight") ?? "—",
      pieces: s(formData, "pieces") ?? "1",
      service: s(formData, "service") ?? "express",
      declaredValue: s(formData, "declaredValue") ?? "—",
      issuedAt: new Date().toISOString(),
    },
  };
}
