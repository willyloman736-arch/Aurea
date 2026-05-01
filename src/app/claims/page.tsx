import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ClaimForm } from "./claim-form";

export const metadata: Metadata = {
  title: "File a claim · USPS-S",
  description:
    "File a claim in three minutes. Damaged, lost, delayed, incomplete — most resolve inside 48 hours.",
};

export default function ClaimsPage() {
  return (
    <PageShell
      eyebrow="Claims"
      title={
        <>
          File a <em>claim.</em>
        </>
      }
      lede="Damaged, lost, delayed, or incomplete — tell us what happened. A claims lead reviews inside 24 hours and resolves most cases inside 48."
    >
      <ClaimForm />
    </PageShell>
  );
}
