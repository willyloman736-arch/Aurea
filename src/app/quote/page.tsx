import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { QuoteForm } from "./quote-form";

export const metadata: Metadata = {
  title: "Get a quote · USPS-S",
  description:
    "Live shipping rates between USPS-S hubs. Pick origin, destination, weight, and service tier — get a price and ETA in seconds.",
};

export default function QuotePage() {
  return (
    <PageShell
      eyebrow="Quote"
      title={
        <>
          A price, <em>right now.</em>
        </>
      }
      lede="No phone calls, no sales reps. Pick origin, destination, weight, and service tier — see a real estimate and ETA the moment you change a field."
    >
      <QuoteForm />
    </PageShell>
  );
}
