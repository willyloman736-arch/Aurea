import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { PortalClient } from "./portal-client";

export const metadata: Metadata = {
  title: "Live portal · USPS-S",
  description:
    "Live network view — every active USPS-S shipment, every hub, every event the moment it happens.",
};

export default function PortalPage() {
  return (
    <PageShell
      eyebrow="Live"
      title={
        <>
          The network, <em>right now.</em>
        </>
      }
      lede="Every active shipment, every hub, every event the moment it happens. Click a route to drill in. Watch the ticker for live custody scans."
    >
      <PortalClient />
    </PageShell>
  );
}
