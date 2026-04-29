import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Network · Aurea",
  description:
    "How the Aurea network holds — owned hubs, real-time custody, audited handoffs, and last-mile partners on every continent.",
};

export default function NetworkPage() {
  return (
    <PageShell
      eyebrow="Network"
      title={
        <>
          How the network <em>holds.</em>
        </>
      }
      lede="We own the lanes that need owning and partner where it makes the cargo move faster. Every shipment stays in one custody chain, scanned end-to-end, audited by default."
    >
      <article className="page-section">
        <h2>
          Owned hubs, <em>owned trucks</em>
        </h2>
        <p>
          Ten regional hubs run by Aurea staff, twenty-four hours a day. Our
          couriers wear our uniform, drive our vehicles, and report to a regional
          ops lead — not a contractor pool. That&rsquo;s the difference between a
          shipment going right and a shipment going through the cracks.
        </p>
        <p>
          See the full hub list, with throughput and active lanes, on the{" "}
          <Link href="/coverage#hubs">coverage page</Link>.
        </p>
      </article>

      <article className="page-section">
        <h2>
          Real-time <em>custody</em>
        </h2>
        <p>
          Every cargo movement — pickup, line-haul departure, hub arrival, sort,
          out-for-delivery, doorstep handoff — is scanned and timestamped. Those
          events stream to a tracking page that&rsquo;s public the moment you book
          and shareable in one click. No polling, no support calls, no
          &ldquo;please allow 24-48 hours for tracking to update.&rdquo;
        </p>
        <div className="page-stats">
          <div className="page-stat">
            <strong>&lt;500<em>ms</em></strong>
            <span>Scan to tracking page</span>
          </div>
          <div className="page-stat">
            <strong>±38<em>min</em></strong>
            <span>ETA accuracy, every lane</span>
          </div>
          <div className="page-stat">
            <strong>0</strong>
            <span>Custody gaps allowed</span>
          </div>
        </div>
      </article>

      <article className="page-section">
        <h2>
          Last-mile <em>partners</em>
        </h2>
        <p>
          For destinations outside our owned coverage we partner with FedEx, USPS,
          DHL, and UPS for the final leg. Hand-offs happen at our hub on a sealed
          unit, scanned in and out, so the custody chain remains visible even when
          the truck changes colour. You see who&rsquo;s moving the cargo at every
          stage.
        </p>
        <ul>
          <li>FedEx — North America domestic + Latin America connections</li>
          <li>USPS — last-mile residential delivery in the United States</li>
          <li>DHL — Europe and intra-Asia cross-border</li>
          <li>UPS — North America domestic + freight forwarding</li>
        </ul>
      </article>

      <article className="page-section">
        <h2>
          Audit-ready, <em>by default</em>
        </h2>
        <p>
          SOC 2 Type II and ISO 27001, audited annually. Geo-verified proof of
          delivery on every shipment. Optional OTP at the door for high-value
          parcels. Audit logs available on request, with a forty-eight-hour
          turnaround for SOC 2 evidence requests from your compliance team.
        </p>
        <ul>
          <li>SOC 2 Type II · audited by an independent CPA firm</li>
          <li>ISO 27001 · re-certified each January</li>
          <li>GDPR · EU data stays in Frankfurt or Dublin</li>
          <li>HIPAA-aligned storage available on regulated lanes</li>
        </ul>
      </article>

      <div className="page-cta">
        <h3>
          Need the network on a <em>specific lane?</em>
        </h3>
        <p>
          Tell us where the cargo originates, where it&rsquo;s going, and how
          often. We&rsquo;ll quote service the same hour, weekdays.
        </p>
        <div className="page-cta-actions">
          <Link href="/contact" className="btn-primary">
            Talk to ops
          </Link>
          <Link href="/coverage" className="btn-ghost">
            See coverage
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
