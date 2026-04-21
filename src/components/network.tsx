import { ScrollReveal } from "./scroll-reveal";
import { GlobeMount } from "./globe-mount";

const FEATURES = [
  {
    num: "01",
    title: "Real-time events",
    body: "Sub-second streaming from every scan point. Kafka-backed, HMAC-signed webhooks, at-least-once delivery.",
    meta: ["18M/day", "<500ms"],
    icon: (
      <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth={1.25}>
        <path d="M4 14h6l2-6 4 12 2-6h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Predictive ETA",
    body: "Machine-learning models adjust delivery windows for weather, traffic, customs and hub congestion — before delays propagate.",
    meta: ["±38 min", "Per-lane"],
    icon: (
      <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth={1.25}>
        <path d="M3 18c4 0 4-6 8-6s4 6 8 6 4-6 6-6" strokeLinecap="round" />
        <circle cx="22" cy="8" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Secure handoff",
    body: "OAuth 2.0, OTP at the door, geo-verified proof of delivery. SOC 2 Type II and ISO 27001 from day one.",
    meta: ["SOC 2", "ISO 27001"],
    icon: (
      <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth={1.25}>
        <path d="M14 3 L23 7 V14 C23 19 19 23 14 25 C9 23 5 19 5 14 V7 Z" strokeLinejoin="round" />
        <path d="M10 14 l3 3 l5 -6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Global coverage",
    body: "Single API across 220 countries. Local-language receipts, per-region residency, compliant carrier handoffs.",
    meta: ["220 countries", "EU residency"],
    icon: (
      <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth={1.25}>
        <circle cx="14" cy="14" r="10" />
        <path d="M4 14h20M14 4c3 3 3 17 0 20M14 4c-3 3-3 17 0 20" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function Network() {
  return (
    <section className="network" id="network">
      <div className="container-aurea">
        <div className="reach-grid">
          <ScrollReveal className="section-head reach-copy">
            <span className="eyebrow-inline">The network</span>
            <h2 className="section-title">
              Every scan. Every sensor. <em>One signal.</em>
            </h2>
            <p className="section-sub">
              Aurea fuses handheld scans, BLE sensors, carrier APIs, weather and customs feeds into a single live event stream — and exposes it as one clean HTTP contract.
            </p>
            <ul className="reach-hubs">
              <li><span /> Singapore</li>
              <li><span /> Amsterdam</li>
              <li><span /> Dubai</li>
              <li><span /> Los Angeles</li>
              <li><span /> Tokyo</li>
              <li><span /> São Paulo</li>
              <li><span /> Hong Kong</li>
              <li><span /> Johannesburg</li>
            </ul>
          </ScrollReveal>

          <GlobeMount />
        </div>

        <ul className="feature-list">
          {FEATURES.map((f) => (
            <ScrollReveal as="li" key={f.num} className="feature-row">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-body">
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
              <div className="feature-meta">
                {f.meta.map((m) => <span key={m}>{m}</span>)}
              </div>
            </ScrollReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
