import Link from "next/link";
import { Check } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    blurb: "For side projects and first deployments.",
    cta: "Start free",
    href: "/sign-up",
    highlighted: false,
    features: [
      "100 trackers / month",
      "Public tracking pages",
      "All 70+ carriers",
      "Email support",
    ],
  },
  {
    name: "Growth",
    price: "$49",
    period: "per month",
    blurb: "For operators shipping daily.",
    cta: "Start 14-day trial",
    href: "/sign-up",
    highlighted: true,
    features: [
      "10,000 trackers / month",
      "Webhooks + API access",
      "Custom-branded pages",
      "Dashboard & analytics",
      "Priority support (4h SLA)",
    ],
  },
  {
    name: "Scale",
    price: "Custom",
    period: "contact us",
    blurb: "For platforms and enterprise.",
    cta: "Book a call",
    href: "#contact",
    highlighted: false,
    features: [
      "Unlimited trackers",
      "SOC 2 Type II report",
      "SSO + SAML",
      "99.99% uptime SLA",
      "EU data residency",
      "Dedicated success manager",
    ],
  },
];

export function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <div className="container-USPS-S">
        <ScrollReveal className="section-head section-head-centered">
          <span className="eyebrow-inline">Pricing</span>
          <h2 className="section-title">
            Simple tiers. <em>Clear value.</em>
          </h2>
          <p className="section-sub-centered">
            Every plan includes the full carrier network. Upgrade when your volume does.
          </p>
        </ScrollReveal>

        <div className="pricing-grid">
          {TIERS.map((tier) => (
            <ScrollReveal
              key={tier.name}
              className={cn("pricing-card", tier.highlighted && "pricing-card-featured")}
            >
              {tier.highlighted && <div className="pricing-badge">Most teams pick this</div>}
              <div className="pricing-head">
                <h3 className="pricing-name">{tier.name}</h3>
                <p className="pricing-blurb">{tier.blurb}</p>
              </div>
              <div className="pricing-price">
                <span className="pricing-amount">{tier.price}</span>
                <span className="pricing-period">{tier.period}</span>
              </div>
              <ul className="pricing-features">
                {tier.features.map((f) => (
                  <li key={f}>
                    <Check size={14} strokeWidth={2} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={tier.href}
                className={cn("pricing-cta", tier.highlighted ? "btn-primary" : "btn-ghost")}
              >
                {tier.cta}
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <div className="pricing-footnote">
          All plans include SOC 2 compliance, GDPR data handling, and 24/7 status page.
        </div>
      </div>
    </section>
  );
}
