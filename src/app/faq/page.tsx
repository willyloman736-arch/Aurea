import Link from "next/link";
import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "FAQ · USPS-S",
  description:
    "Pickup, claims, customs, billing — everything we get asked, with the real answers.",
};

interface QA {
  q: string;
  a: string;
}

const PICKUP: QA[] = [
  {
    q: "How fast can you pick up?",
    a: "Most major cities, same-day pickup if booked before 11am local time. Otherwise next business day. Account customers get fixed pickup windows — every Tuesday at 10, every Friday at 4 — whatever rhythm suits the operation.",
  },
  {
    q: "Do you have a minimum order?",
    a: "No. Single-parcel pickups are welcome. Volume discounts kick in past fifty shipments per month, applied automatically on the next invoice.",
  },
  {
    q: "Can I schedule recurring pickups?",
    a: "Yes — set them up in your dashboard or ask your account manager. Pickups can be daily, weekly, or on a custom cadence. We honour the schedule even if there's nothing to ship that day.",
  },
  {
    q: "What if I miss the pickup window?",
    a: "Your courier waits up to ten minutes. After that we'll either reschedule for the same day if a route is still open, or roll to the next business day. No charge for a single missed window per month.",
  },
];

const CARGO: QA[] = [
  {
    q: "What can I ship?",
    a: "Standard parcels up to 50 kg. Freight up to one tonne per pallet. Hazmat by arrangement, with proper documentation. Lithium batteries are accepted with declaration.",
  },
  {
    q: "What's prohibited?",
    a: "Firearms, ammunition, live animals (without prior arrangement), perishables (without prior cold-chain arrangement), cash or bearer instruments, narcotics, and items prohibited by destination customs. If we discover a prohibited item in transit we may dispose of it lawfully and bill you for the cost.",
  },
  {
    q: "How should I package my cargo?",
    a: "We accept anything packaged for normal courier handling. For fragile items, double-box with at least two inches of padding on every side. Our courier can flag inadequate packaging at pickup; if you proceed anyway, that voids the standard insurance for damage.",
  },
];

const TRACKING: QA[] = [
  {
    q: "How does tracking work?",
    a: "Every shipment has a public tracking page (e.g. /track/USPS-S-K7M9Q3P) that updates the moment a checkpoint scans. Recipients don't need an account or password — share the link and they see live status.",
  },
  {
    q: "How accurate is the ETA?",
    a: "Per-lane historical performance, real-time congestion data, and current cargo position. We update the ETA every time a checkpoint scans. Median error across all lanes is ±38 minutes.",
  },
  {
    q: "What if delivery is delayed?",
    a: "You'll see the new ETA in your tracking page within minutes of the delay being detected. If the cargo was time-sensitive and the delay is on us, we credit the full shipping cost automatically — no email, no support ticket.",
  },
];

const INSURANCE: QA[] = [
  {
    q: "Is my cargo insured?",
    a: "Every shipment is covered up to its declared value, included in the base rate. The standard cap is five thousand US dollars or local equivalent. Add additional cover for high-value items at booking.",
  },
  {
    q: "How do I file a claim?",
    a: "Email info@usps-s.com within seven days of the delivery window with your tracking code, a description of what happened, and photos if there's damage. Most claims resolve in under forty-eight hours.",
  },
  {
    q: "What's NOT covered?",
    a: "Inadequate packaging that was visible at pickup, pre-existing damage not flagged at the pickup scan, force majeure (war, natural disaster), and indirect losses (missed sales, lost contracts). See the insurance page for the full breakdown.",
  },
];

const CUSTOMS: QA[] = [
  {
    q: "Do you handle customs?",
    a: "For international shipments we handle all customs paperwork, duty calculation, and clearance through our broker network. Customs status appears as a checkpoint on your tracking page.",
  },
  {
    q: "Who pays the duty?",
    a: "By default, the recipient (DDU — delivered duties unpaid). For pre-paid duty (DDP — delivered duties paid), tell us at booking and we'll quote the duty alongside the shipping rate and pay it on your behalf.",
  },
  {
    q: "What if customs holds my shipment?",
    a: "Our broker network reaches out the same day. If the hold is due to incomplete paperwork on our end, we resolve it at no extra cost. If it's due to recipient information we don't have, we'll contact you for what's needed.",
  },
];

const BILLING: QA[] = [
  {
    q: "How do you bill?",
    a: "Per shipment, billed monthly in arrears. Invoices issue on the first business day of each month, due within thirty days. Wire, card, and SEPA direct debit are accepted.",
  },
  {
    q: "Are there volume discounts?",
    a: "Yes. Discounts kick in past fifty shipments per month and scale up from there. Talk to ops if you're moving more than five hundred a month — we'll quote a custom rate.",
  },
  {
    q: "Can I get a custom contract?",
    a: "For volumes above two thousand shipments per month or with bespoke insurance/customs requirements, yes. Email info@usps-s.com to start the conversation.",
  },
];

const SECTIONS = [
  { id: "pickup", title: "Pickup & booking", items: PICKUP },
  { id: "cargo", title: "What we ship", items: CARGO },
  { id: "tracking", title: "Tracking & delivery", items: TRACKING },
  { id: "insurance", title: "Insurance & claims", items: INSURANCE },
  { id: "customs", title: "Customs & international", items: CUSTOMS },
  { id: "billing", title: "Billing & accounts", items: BILLING },
];

export default function FaqPage() {
  return (
    <PageShell
      eyebrow="FAQ"
      title={
        <>
          Questions, <em>answered.</em>
        </>
      }
      lede="Pickup, cargo, claims, customs, billing — everything we get asked, with the real answers. Can't find what you're looking for? Ping us at info@usps-s.com."
    >
      {SECTIONS.map((section) => (
        <article key={section.id} id={section.id} className="page-section faq-section">
          <h2>{section.title}</h2>
          <div className="faq-list-static">
            {section.items.map((item, i) => (
              <details key={i} className="faq-item-static">
                <summary>
                  <span>{item.q}</span>
                  <ChevronDown size={15} strokeWidth={1.5} className="faq-icon" />
                </summary>
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </article>
      ))}

      <div className="page-cta">
        <h3>
          Still have a <em>question?</em>
        </h3>
        <p>
          We&rsquo;re happy to answer something not on this page. Replies within
          an hour, weekdays.
        </p>
        <div className="page-cta-actions">
          <Link
            href="mailto:info@usps-s.com"
            className="btn-primary" data-magnetic
          >
            Email info@usps-s.com
          </Link>
          <Link href="/contact" className="btn-ghost">
            See all channels
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
