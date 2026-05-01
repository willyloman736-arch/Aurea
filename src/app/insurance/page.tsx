import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Insurance · USPS-S",
  description:
    "Every USPS-S shipment is insured up to its declared value. Here's how it works.",
};

export default function InsurancePage() {
  return (
    <PageShell
      eyebrow="Legal · Insurance"
      title={
        <>
          Every shipment, <em>covered.</em>
        </>
      }
      lede="Cargo insurance up to declared value, included in the base rate. Optional excess cover at booking. Claims resolved in-house, most inside forty-eight hours."
    >
      <div className="page-callout">
        <strong>The short version:</strong> Declare what your cargo is worth.
        We&rsquo;ll cover up to that amount if it&rsquo;s lost or damaged in our
        custody. Higher-value items get additional cover at booking.
      </div>

      <article className="page-section">
        <h2>
          Standard <em>cover</em>
        </h2>
        <p>
          Every shipment booked through USPS-S includes insurance up to the value
          you declare at booking, capped at five thousand US dollars (or local
          equivalent). There&rsquo;s no separate premium — it&rsquo;s built into
          the shipping rate. Cover begins the moment our courier scans the cargo
          into custody and ends when the recipient signs for delivery.
        </p>
      </article>

      <article className="page-section">
        <h2>
          Excess <em>cover</em>
        </h2>
        <p>
          For cargo worth more than the standard cap, you can purchase additional
          insurance at booking. Premiums are quoted as a small percentage of the
          declared value and depend on the cargo type and lane.
        </p>
        <h3>Typical premium ranges</h3>
        <ul>
          <li>General merchandise · 0.4–0.8% of declared value</li>
          <li>Electronics and high-value goods · 0.8–1.5% of declared value</li>
          <li>Fine art, fragile, or single-item irreplaceable · quoted bespoke</li>
        </ul>
      </article>

      <article className="page-section">
        <h2>
          What&rsquo;s <em>covered</em>
        </h2>
        <ul>
          <li>Loss in transit</li>
          <li>Damage occurring while in our custody</li>
          <li>Theft from a sealed truck or sealed hub area</li>
          <li>
            Customs seizure, where the seizure was caused by an USPS-S
            misclassification (we cover the duty plus the cargo value)
          </li>
        </ul>
      </article>

      <article className="page-section">
        <h2>
          What&rsquo;s <em>not covered</em>
        </h2>
        <ul>
          <li>Items prohibited by our restricted list (see Terms)</li>
          <li>Inadequate packaging that was visible at pickup</li>
          <li>Pre-existing damage not flagged at the pickup scan</li>
          <li>Loss caused by force majeure (war, civil unrest, natural disaster)</li>
          <li>Indirect or consequential losses (missed sales, lost contracts)</li>
        </ul>
      </article>

      <article className="page-section">
        <h2>
          How to <em>file a claim</em>
        </h2>
        <ol>
          <li>
            Email{" "}
            <Link href="mailto:info@usps-s.com">
              info@usps-s.com
            </Link>{" "}
            within seven days of the delivery window
          </li>
          <li>
            Include the tracking code, a description of what happened, and photos
            if there&rsquo;s damage
          </li>
          <li>
            Our claims lead acknowledges within twenty-four hours and decides
            within forty-eight in most cases
          </li>
          <li>
            Approved claims are paid by wire or card refund within five business
            days
          </li>
        </ol>
        <p>
          We don&rsquo;t use third-party adjusters for claims under twenty
          thousand US dollars. A real ops lead reads your email and a real
          claims lead approves it.
        </p>
      </article>

      <article className="page-section">
        <h2>
          Underwriting <em>partner</em>
        </h2>
        <p>
          Excess cover is underwritten through our marine cargo broker (named in
          your insurance certificate at booking). The standard cover is
          self-funded by USPS-S, which is why we can move so quickly on small
          claims — there&rsquo;s nobody to defer to.
        </p>
      </article>

      <div className="page-cta">
        <h3>
          Shipping something <em>valuable?</em>
        </h3>
        <p>
          Tell us at booking and we&rsquo;ll quote excess cover alongside the
          shipping rate.
        </p>
        <div className="page-cta-actions">
          <Link href="/contact" className="btn-primary" data-magnetic>
            Talk to ops
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
