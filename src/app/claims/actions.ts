"use server";

import { generateReference } from "@/lib/rate-calculator";

export interface ClaimResult {
  ok: boolean;
  reference?: string;
  error?: string;
}

function s(formData: FormData, key: string): string | undefined {
  const v = (formData.get(key) as string | null)?.trim();
  return v && v.length > 0 ? v : undefined;
}

export async function submitClaimAction(
  formData: FormData,
): Promise<ClaimResult> {
  const trackingCode = s(formData, "trackingCode")?.toUpperCase();
  const claimType = s(formData, "claimType");
  const description = s(formData, "description");
  const claimEmail = s(formData, "claimEmail");

  if (!trackingCode) {
    return { ok: false, error: "Tracking code is required." };
  }
  if (!claimType) {
    return { ok: false, error: "Pick a claim type." };
  }
  if (!description) {
    return { ok: false, error: "Tell us what happened (one or two sentences)." };
  }
  if (!claimEmail) {
    return { ok: false, error: "We need an email to send the resolution to." };
  }

  // Production: write to claims table, notify claims lead, attach photos.
  const reference = generateReference("CL");
  return { ok: true, reference };
}
