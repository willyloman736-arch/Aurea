import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Coverage · Aurea",
  description:
    "Ten regional hubs, 220 countries. Where Aurea moves cargo and how the lanes connect.",
};

const HUBS = [
  { city: "Singapore",   country: "SG", lanes: 42, throughput: "2.4M/mo", role: "Asia-Pacific gateway" },
  { city: "Amsterdam",   country: "NL", lanes: 38, throughput: "1.8M/mo", role: "EU consolidation" },
  { city: "Dubai",       country: "AE", lanes: 31, throughput: "1.5M/mo", role: "Middle East routing" },
  { city: "Los Angeles", country: "US", lanes: 44, throughput: "2.1M/mo", role: "West-coast gateway" },
  { city: "Tokyo",       country: "JP", lanes: 35, throughput: "1.7M/mo", role: "North-Asia trunk" },
  { city: "São Paulo",   country: "BR", lanes: 22, throughput: "0.9M/mo", role: "Latin America hub" },
  { city: "Hong Kong",   country: "HK", lanes: 37, throughput: "1.9M/mo", role: "Greater China gateway" },
  { city: "Johannesburg",country: "ZA", lanes: 18, throughput: "0.5M/mo", role: "Sub-Saharan trunk" },
  { city: "Rotterdam",   country: "NL", lanes: 28, throughput: "1.2M/mo", role: "Sea/air interchange" },
  { city: "Berlin",      country: "DE", lanes: 24, throughput: "0.8M/mo", role: "Central-EU lanes" },
];

export default function CoveragePage() {
  return (
    <PageShell
      eyebrow="Coverage"
      title={
        <>
          Where <em>Aurea</em> moves.
        </>
      }
      lede="Ten regional hubs, two-hundred-and-twenty countries served, and the lanes that connect them — the same custody discipline whether your cargo moves twenty kilometres or two continents."
    >
      <article id="hubs" className="page-section">
        <h2>
          Network <em>hubs</em>
        </h2>
        <p>
          Each hub runs twenty-four hours. They handle local pickup and delivery,
          consolidate cargo onto trunk lanes, and cross-dock between modes — air,
          ground, and ocean — when a route calls for it.
        </p>

        <div className="page-grid">
          {HUBS.map((h) => (
            <div key={h.city} className="page-card">
              <div className="page-card-eyebrow">{h.country}</div>
              <h4>{h.city}</h4>
              <p>{h.role}</p>
              <div className="page-card-rows">
                <div>
                  <small>Active lanes</small>
                  <strong>{h.lanes}</strong>
                </div>
                <div>
                  <small>Throughput</small>
                  <strong>{h.throughput}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </article>

      <article id="lanes" className="page-section">
        <h2>
          Lane <em>map</em>
        </h2>
        <p>
          A lane is a fixed route between two hubs, run on a known schedule with known
          equipment. We publish departure windows for every trunk lane; spot lanes
          spin up the moment volume justifies them.
        </p>
        <h3>Three classes of lane</h3>
        <ul>
          <li>
            <strong>Trunk lanes</strong> — daily departures between major hubs
            (Singapore↔Amsterdam, Hong Kong↔Los Angeles). Fastest, most predictable.
          </li>
          <li>
            <strong>Regional lanes</strong> — every-other-day routes connecting trunk
            hubs to secondary cities. Local cutoff windows differ.
          </li>
          <li>
            <strong>Spot lanes</strong> — opened on demand for volume customers. Talk
            to ops before promising a delivery date on a spot lane.
          </li>
        </ul>
      </article>

      <article id="customs" className="page-section">
        <h2>
          Customs &amp; <em>duties</em>
        </h2>
        <p>
          For international shipments we handle all customs paperwork, duty
          calculation, and clearance through our broker network. Customs status appears
          as a checkpoint on your tracking page — no surprise calls from a port asking
          for documents.
        </p>
        <h3>What we handle</h3>
        <ul>
          <li>HS-code classification and commercial-invoice generation</li>
          <li>Duty and VAT calculation, paid on your behalf where pre-funded</li>
          <li>Broker submission and clearance follow-up</li>
          <li>Restricted-goods declarations (lithium batteries, dangerous goods)</li>
        </ul>
        <h3>What we need from you</h3>
        <ul>
          <li>Description and declared value of the cargo</li>
          <li>Importer-of-record details if different from the recipient</li>
          <li>Any export licences for restricted destinations</li>
        </ul>
      </article>

      <div className="page-cta">
        <h3>
          Need a lane that <em>isn&rsquo;t</em> on the map?
        </h3>
        <p>
          We open new lanes when volume justifies them. Tell us where you&rsquo;re
          shipping and how often.
        </p>
        <div className="page-cta-actions">
          <Link href="/contact" className="btn-primary" data-magnetic>
            Talk to ops
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
