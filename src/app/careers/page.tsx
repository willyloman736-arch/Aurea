import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Careers · USPS-S",
  description:
    "Build the network. Open roles for couriers, dispatchers, and operators across every USPS-S hub.",
};

const ROLES = [
  {
    title: "Hub Operations Lead",
    location: "Amsterdam · Singapore · Los Angeles",
    type: "Full-time",
    body: "Run a hub's twenty-four-hour cycle — sortation, line-haul departures, and on-time discipline. You'll own the metrics that show up on the homepage.",
  },
  {
    title: "Courier · Same-day",
    location: "Lagos · Berlin · Tokyo",
    type: "Full-time",
    body: "On-the-ground driver for our same-day service. Sealed transit, signed handovers, GPS the whole way. We pay above market for couriers who treat custody seriously.",
  },
  {
    title: "Customs Broker",
    location: "Rotterdam · Dubai",
    type: "Full-time",
    body: "Classify, file, and clear cross-border cargo. You'll be the reason we can keep saying customs status is just another checkpoint on the tracking page.",
  },
  {
    title: "Dispatch Engineer",
    location: "Remote · EU/US time zones",
    type: "Full-time",
    body: "Build the routing system that decides which truck moves what and when. Strong opinions on operations research and good taste in TypeScript.",
  },
];

export default function CareersPage() {
  return (
    <PageShell
      eyebrow="Careers"
      title={
        <>
          Build the <em>network.</em>
        </>
      }
      lede="We're hiring couriers, dispatchers, brokers, and operators across every USPS-S hub. The work is tangible — cargo goes in, cargo comes out — and we move quickly when we hire."
    >
      <article className="page-section">
        <h2>
          What we&rsquo;re <em>looking for</em>
        </h2>
        <p>
          People who care that the right thing happens, not that the box gets ticked.
          Couriers who know that a signed handover is a promise. Engineers who can read
          a customs form and a Postgres query plan. Operators who don&rsquo;t accept
          &ldquo;the carrier lost it&rdquo; as an explanation.
        </p>
        <p>
          We pay above local market, share equity broadly, and offer a real benefits
          package across every hub. Two weeks of paid time off after your first month —
          no &ldquo;earn it as you go&rdquo; nonsense.
        </p>
      </article>

      <article className="page-section">
        <h2>
          Open <em>roles</em>
        </h2>
        <div className="page-grid">
          {ROLES.map((r) => (
            <div key={r.title} className="page-card">
              <div className="page-card-eyebrow">{r.type}</div>
              <h4>{r.title}</h4>
              <p>{r.body}</p>
              <div className="page-card-rows">
                <div style={{ gridColumn: "1 / -1" }}>
                  <small>Location</small>
                  <strong>{r.location}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 12 }}>
          Don&rsquo;t see your role?{" "}
          <Link href="mailto:careers@usps-s.com">
            Send us a note
          </Link>{" "}
          — we open positions as the network grows.
        </p>
      </article>

      <div className="page-cta">
        <h3>
          Apply in <em>one email.</em>
        </h3>
        <p>
          Tell us which role, where you are, and one thing you&rsquo;ve shipped that
          you&rsquo;re proud of. CV optional.
        </p>
        <div className="page-cta-actions">
          <Link
            href="mailto:careers@usps-s.com?subject=Application"
            className="btn-primary" data-magnetic
          >
            careers@usps-s.com
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
