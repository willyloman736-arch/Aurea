"use server";

import { generateReference } from "@/lib/rate-calculator";

export interface BookingResult {
  ok: boolean;
  reference?: string;
  error?: string;
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

  // In production this would write to the DB and notify ops. For now we
  // generate a confirmation reference — a real ops lead picks it up from there.
  const reference = generateReference("BK");
  return { ok: true, reference };
}
