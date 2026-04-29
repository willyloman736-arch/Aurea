"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "How fast can you pick up?",
    a: "Most major cities, same-day pickup if booked before 11am local time. Otherwise next business day. Account customers get fixed pickup windows — every Tuesday at 10, every Friday at 4 — whatever rhythm suits the operation.",
  },
  {
    q: "What can I ship?",
    a: "Standard parcels up to 50 kg. Freight up to one tonne per pallet. Hazmat by arrangement, with proper documentation. We do not transport firearms, perishables without prior cold-chain approval, live animals, or anything restricted by destination customs.",
  },
  {
    q: "How accurate is the ETA?",
    a: "Per-lane historical performance, real-time congestion data, and current cargo position. We update the ETA every time a checkpoint scans. Median error across all lanes is ±38 minutes. Where we miss, we credit the shipping cost — no claim forms.",
  },
  {
    q: "Is my cargo insured?",
    a: "Every shipment is covered up to its declared value, included in the base rate. Add additional cover for high-value items at booking. Claims are handled in-house — most resolve in under 48 hours, no third-party adjusters.",
  },
  {
    q: "What if delivery is delayed?",
    a: "You'll see the new ETA in your tracking page within minutes of the delay being detected. If the cargo was time-sensitive and the delay is on us, we credit the full shipping cost automatically — no email, no support ticket.",
  },
  {
    q: "Do you handle customs?",
    a: "For international shipments we handle all customs paperwork, duty calculation, and clearance through our broker network. Customs status appears as a checkpoint on your tracking page — no surprise calls from a port asking for documents.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="faq" id="faq">
      <div className="container-aurea faq-grid">
        <ScrollReveal className="faq-head">
          <span className="eyebrow-inline">FAQ</span>
          <h2 className="section-title">
            Questions,<br /><em>answered.</em>
          </h2>
          <p className="section-sub">
            Can't find what you're looking for? Ping us at{" "}
            <a href="mailto:hello@aurealogistics.com">hello@aurealogistics.com</a>
            {" "}— replies within an hour during business days.
          </p>
        </ScrollReveal>

        <ScrollReveal className="faq-list">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={cn("faq-item", isOpen && "open")}>
                <button
                  className="faq-q"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <Plus size={15} strokeWidth={1.5} className="faq-icon" />
                </button>
                <div className="faq-a" aria-hidden={!isOpen}>
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
}
