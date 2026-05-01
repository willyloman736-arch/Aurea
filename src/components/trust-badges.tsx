import Image from "next/image";
import { ScrollReveal } from "./scroll-reveal";

const PARTNERS = [
  { name: "FedEx", src: "/badges/fedex.png" },
  { name: "USPS", src: "/badges/usps.png" },
  { name: "DHL", src: "/badges/dhl.png" },
  { name: "UPS", src: "/badges/ups.jpg" },
] as const;

export function TrustBadges() {
  return (
    <section className="trust" aria-label="Last-mile carrier partners">
      <ScrollReveal className="container-USPS-S trust-inner">
        <span className="trust-label">
          Last-mile partners on every continent
        </span>
        <div className="trust-row">
          {PARTNERS.map((p) => (
            <div key={p.name} className="trust-badge">
              <Image
                src={p.src}
                alt={`${p.name} logo`}
                className="trust-badge-img"
                width={300}
                height={120}
                sizes="152px"
              />
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
