import { ScrollReveal } from "./scroll-reveal";

// Last-mile partners. Wordmark placeholders with brand-color accents — replace
// with official SVGs at /public/badges/{fedex,usps,dhl,ups}.svg when available.
const PARTNERS = [
  { name: "FedEx", tone: "fedex" },
  { name: "USPS", tone: "usps" },
  { name: "DHL", tone: "dhl" },
  { name: "UPS", tone: "ups" },
] as const;

export function TrustBadges() {
  return (
    <section className="trust" aria-label="Last-mile carrier partners">
      <ScrollReveal className="container-aurea trust-inner">
        <span className="trust-label">
          Last-mile partners on every continent
        </span>
        <div className="trust-row">
          {PARTNERS.map((p) => (
            <div key={p.name} className={`trust-badge trust-${p.tone}`}>
              {p.name}
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
