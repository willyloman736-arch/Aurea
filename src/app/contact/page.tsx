import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Contact · Aurea",
  description:
    "Quotes, partnerships, account questions — we answer same day, weekdays.",
};

const CHANNELS = [
  {
    label: "Quotes & ops",
    detail: "hello@aurealogistics.com",
    sub: "Replies within an hour, weekdays. Quote requests go to a real ops lead, not a queue.",
    href: "mailto:hello@aurealogistics.com",
  },
  {
    label: "Existing accounts",
    detail: "support@aurealogistics.com",
    sub: "Account questions, claims, anything stuck in transit. Tell us your tracking code in the first line.",
    href: "mailto:support@aurealogistics.com",
  },
  {
    label: "Partnerships",
    detail: "partners@aurealogistics.com",
    sub: "Carrier partnerships, hub agreements, integrations. We move slowly here on purpose.",
    href: "mailto:partners@aurealogistics.com",
  },
  {
    label: "Press",
    detail: "press@aurealogistics.com",
    sub: "Coverage, comment requests, brand assets.",
    href: "mailto:press@aurealogistics.com",
  },
];

const OFFICES = [
  { city: "Amsterdam", addr: "Stadhouderskade 6, 1054 ES", role: "EU operations" },
  { city: "Singapore", addr: "1 Raffles Place, #44-02", role: "APAC operations" },
  { city: "Los Angeles", addr: "10250 Constellation Blvd, Suite 1700", role: "Americas operations" },
];

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="Contact"
      title={
        <>
          Talk to <em>ops.</em>
        </>
      }
      lede="Quotes, partnerships, account questions — we answer same day, weekdays. There's no support queue and no chatbot in the loop. You write to a person who can do something about it."
    >
      <article className="page-section">
        <h2>
          By <em>email</em>
        </h2>
        <div className="page-grid">
          {CHANNELS.map((c) => (
            <Link key={c.label} href={c.href} className="page-card">
              <div className="page-card-eyebrow">{c.label}</div>
              <h4>{c.detail}</h4>
              <p>{c.sub}</p>
            </Link>
          ))}
        </div>
      </article>

      <article className="page-section">
        <h2>
          In <em>person</em>
        </h2>
        <p>
          We have crew in every hub on the map. The three offices below are where
          our regional ops leads sit — knock if you&rsquo;re nearby and want to talk
          freight over coffee.
        </p>
        <div className="page-grid">
          {OFFICES.map((o) => (
            <div key={o.city} className="page-card">
              <div className="page-card-eyebrow">{o.role}</div>
              <h4>{o.city}</h4>
              <p>{o.addr}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="page-section">
        <h2>
          Hours &amp; <em>response times</em>
        </h2>
        <ul>
          <li>
            <strong>Quotes</strong> — within one hour, weekdays 8am–6pm local
          </li>
          <li>
            <strong>Account support</strong> — within four hours, every day
          </li>
          <li>
            <strong>Partnerships &amp; press</strong> — within two business days
          </li>
          <li>
            <strong>Stuck in transit?</strong> — call your account manager directly
            if you have one; otherwise email support and we page someone.
          </li>
        </ul>
      </article>

      <div className="page-cta">
        <h3>
          Need a quote <em>now?</em>
        </h3>
        <p>
          Most quotes go out the same hour. Tell us what you&rsquo;re moving and where.
        </p>
        <div className="page-cta-actions">
          <Link
            href="mailto:hello@aurealogistics.com?subject=Quote%20request"
            className="btn-primary" data-magnetic
          >
            Email hello@aurealogistics.com
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
