import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Terms · USPS-S",
  description:
    "Terms of service for USPS-S — what we promise, what we charge for, and how disputes work.",
};

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal · Terms"
      title={
        <>
          Terms of <em>service.</em>
        </>
      }
      lede="What we promise, what we charge for, and how disputes work. Last updated April 2026."
    >
      <div className="page-callout">
        <strong>The short version:</strong> We move your cargo on time. If we
        miss, we credit the shipping cost. You don&rsquo;t ship illegal,
        dangerous, or restricted goods without telling us. Disputes go to
        arbitration in the jurisdiction of the origin hub.
      </div>

      <article className="page-section">
        <h2>1. Who&rsquo;s agreeing to what</h2>
        <p>
          These terms govern your use of USPS-S services — booking
          shipments, the dashboard, the public tracking page, and our APIs (where
          applicable). By booking a shipment you accept these terms on behalf of
          yourself or the entity you represent.
        </p>
      </article>

      <article className="page-section">
        <h2>2. What we agree to do</h2>
        <ul>
          <li>Pick up your cargo within the booked window</li>
          <li>Maintain unbroken custody from pickup to delivery</li>
          <li>Provide live tracking visible to you and your recipient</li>
          <li>Insure every shipment up to its declared value</li>
          <li>Handle customs paperwork on international lanes</li>
          <li>Respond to support inquiries within four hours, every day</li>
        </ul>
      </article>

      <article className="page-section">
        <h2>3. What you agree to do</h2>
        <ul>
          <li>Provide accurate sender, recipient, and contents information</li>
          <li>
            Not ship items prohibited by law or by our restricted list (firearms,
            uninsured high-value cash, live animals without prior approval)
          </li>
          <li>Pay invoices within thirty days of issue</li>
          <li>Notify us immediately of suspected loss or damage</li>
        </ul>
      </article>

      <article className="page-section">
        <h2>4. Pricing and payment</h2>
        <p>
          Quoted prices are valid for thirty days unless otherwise stated. Volume
          discounts kick in past fifty shipments per month, applied automatically
          on the next invoice. We accept wire transfer, card, and SEPA direct
          debit for EU customers. Late payments accrue interest at the legal
          maximum in the origin jurisdiction.
        </p>
      </article>

      <article className="page-section">
        <h2>5. Delivery promises and credits</h2>
        <p>
          When we miss a published delivery window and the delay is on us, we
          credit the full shipping cost to your account automatically — no claim
          form. &ldquo;On us&rdquo; excludes weather events, customs holds caused
          by missing or incorrect declarations, and recipient unavailability.
        </p>
      </article>

      <article className="page-section">
        <h2>6. Loss and damage</h2>
        <p>
          Every shipment is insured up to its declared value at no extra cost.
          For higher-value cargo, additional cover is available at booking.
          Claims are filed by emailing{" "}
          <Link href="mailto:info@usps-s.com">
            info@usps-s.com
          </Link>{" "}
          with the tracking code and a description of what happened. Most claims
          resolve in under forty-eight hours.
        </p>
      </article>

      <article className="page-section">
        <h2>7. Restricted and prohibited items</h2>
        <p>
          You may not ship: firearms, ammunition, live animals (without prior
          arrangement), perishables (without prior cold-chain arrangement), cash
          or bearer instruments, narcotics, items prohibited by destination
          customs, or anything else that would put our crew, equipment, or other
          shipments at risk. If we discover a prohibited item in transit we may
          dispose of it lawfully and bill you for the cost.
        </p>
      </article>

      <article className="page-section">
        <h2>8. Liability cap</h2>
        <p>
          Our total liability for any single shipment is capped at the declared
          value plus shipping cost, except where additional insurance was
          purchased. We&rsquo;re not liable for indirect or consequential damages
          (lost sales, lost contracts, brand damage) — bring those concerns to
          our ops team in advance and we&rsquo;ll discuss bespoke coverage.
        </p>
      </article>

      <article className="page-section">
        <h2>9. Termination</h2>
        <p>
          You can close your account at any time. We can terminate accounts that
          repeatedly ship prohibited items, engage in fraud, or fail to pay. In
          either case we honour cargo already in our custody until it&rsquo;s
          delivered or returned.
        </p>
      </article>

      <article className="page-section">
        <h2>10. Disputes</h2>
        <p>
          We try to resolve disputes through{" "}
          <Link href="mailto:info@usps-s.com">
            info@usps-s.com
          </Link>{" "}
          first — most are misunderstandings that an ops lead can fix in an
          afternoon. Failing that, disputes go to binding arbitration in the
          jurisdiction of the shipment&rsquo;s origin hub, governed by local law.
        </p>
      </article>

      <article className="page-section">
        <h2>11. Changes</h2>
        <p>
          When these terms change materially, we email everyone with an active
          account thirty days in advance. Continued use after the effective date
          counts as acceptance. The full revision history is available on
          request.
        </p>
      </article>
    </PageShell>
  );
}
