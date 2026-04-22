"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "How fast do tracking events propagate?",
    a: "Sub-second from carrier scan to your webhook. Our ingestion pipeline is Kafka-backed with at-least-once delivery and HMAC-signed webhooks. In practice, you see a scan in your dashboard within 800ms of it being recorded at the carrier.",
  },
  {
    q: "Which carriers do you support?",
    a: "Every major US carrier (USPS, FedEx, UPS, DHL, OnTrac, LaserShip, Newgistics) plus 70+ international carriers including Royal Mail, Canada Post, Japan Post, Yamato, Aramex, SF Express, and every EU national post. Auto-detection from tracking-number format means your code doesn't change when you add a new carrier.",
  },
  {
    q: "How does predictive ETA work?",
    a: "A gradient-boosted model trained on 4 years of carrier-specific scan histories, weather data, and customs clearance times. It predicts delivery windows per lane with a median error of ±38 minutes. Models retrain nightly with the latest 24 hours of scans.",
  },
  {
    q: "Is my data safe?",
    a: "SOC 2 Type II and ISO 27001 certified from day one. All data encrypted at rest (AES-256) and in transit (TLS 1.3). EU customers get dedicated EU residency — data never leaves Frankfurt or Dublin. We don't sell, share, or train on your shipment data.",
  },
  {
    q: "What happens if a carrier goes down?",
    a: "We maintain two independent aggregator connections plus direct API keys for the major carriers. If one path fails, the other serves your traffic with no code change on your side. Our status page at status.aurea.co reflects any incident within 60 seconds.",
  },
  {
    q: "Can I bring my own carrier accounts?",
    a: "Yes. On Growth and Scale plans you can wire up your own negotiated FedEx/UPS accounts for discounted rates. Tracking data still flows through Aurea's unified API — you get your rates plus our reliability.",
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
