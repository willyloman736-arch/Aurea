import { ScrollReveal } from "./scroll-reveal";

const FEATURES = [
  {
    num: "01",
    title: "Live custody",
    body: "Every scan, every checkpoint, every handoff — visible to you and your recipient the moment it happens. No polling, no support calls.",
    meta: ["Real-time", "<500ms"],
    icon: (
      <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth={1.25}>
        <path d="M4 14h6l2-6 4 12 2-6h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Predictive ETA",
    body: "Per-lane historical performance plus real-time congestion data. We update the ETA every checkpoint — and we hold to within 38 minutes.",
    meta: ["±38 min", "Every lane"],
    icon: (
      <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth={1.25}>
        <path d="M3 18c4 0 4-6 8-6s4 6 8 6 4-6 6-6" strokeLinecap="round" />
        <circle cx="22" cy="8" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Chain of custody",
    body: "OTP at the door for high-value parcels, geo-verified proof of delivery, audit-ready logs. SOC 2 Type II and ISO 27001 — every shipment.",
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
    title: "Global reach",
    body: "Ten regional hubs. 220 countries served. We handle customs paperwork, duty calculation, and clearance — your cargo doesn't sit at a border.",
    meta: ["220 countries", "Customs handled"],
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
      <div className="container-USPS-S">
        <ScrollReveal className="section-head">
          <span className="eyebrow-inline">The network</span>
          <h2 className="section-title">
            Every lane. Every hub. <em>One network.</em>
          </h2>
          <p className="section-sub">
            Ten regional hubs, 220 countries, the same on-time discipline whether your cargo moves twenty kilometres or two continents. We own the lanes, we own the custody chain — and we own the outcome.
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
