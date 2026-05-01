import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Services · USPS-S",
  description:
    "Express parcel, international freight, and same-day pickup. Three lanes, one custody chain.",
};

export default function ServicesPage() {
  return (
    <PageShell
      eyebrow="Services"
      title={
        <>
          Three ways to <em>move cargo.</em>
        </>
      }
      lede="Whatever the deadline, the package, or the border — we have a lane for it. One custody chain across all of them, no handoff between vendors, no excuses about who lost what."
    >
      <article id="express" className="page-section">
        <h2>
          Express <em>parcel</em>
        </h2>
        <p>
          Door-to-door for parcels under thirty kilograms. Daily routes between every
          major city we operate in. Picked up before noon, on a doorstep within
          seventy-two hours — most lanes faster.
        </p>
        <div className="page-stats">
          <div className="page-stat">
            <strong>&lt;72<em>h</em></strong>
            <span>Door-to-door, most lanes</span>
          </div>
          <div className="page-stat">
            <strong>30<em>kg</em></strong>
            <span>Per-parcel weight ceiling</span>
          </div>
          <div className="page-stat">
            <strong>Daily</strong>
            <span>Routes, every weekday</span>
          </div>
        </div>
        <h3>Best for</h3>
        <ul>
          <li>E-commerce orders, swag drops, replenishment runs</li>
          <li>Hardware sent to remote employees</li>
          <li>Documents and contracts that need a signature</li>
        </ul>
      </article>

      <article id="international" className="page-section">
        <h2>
          International <em>freight</em>
        </h2>
        <p>
          Pallet and container freight across thirty-plus countries. We handle customs
          paperwork, duty calculation, and clearance — your cargo doesn&rsquo;t sit at a
          border because someone forgot a form.
        </p>
        <div className="page-stats">
          <div className="page-stat">
            <strong>30+</strong>
            <span>Countries served end-to-end</span>
          </div>
          <div className="page-stat">
            <strong>1<em>t</em></strong>
            <span>Per pallet</span>
          </div>
          <div className="page-stat">
            <strong>Brokers</strong>
            <span>Customs handled in-house</span>
          </div>
        </div>
        <h3>Best for</h3>
        <ul>
          <li>Cross-border B2B shipments</li>
          <li>Bulk replenishment to international warehouses</li>
          <li>High-value cargo that benefits from sealed transit</li>
        </ul>
      </article>

      <article id="same-day" className="page-section">
        <h2>
          Same-day <em>pickup</em>
        </h2>
        <p>
          Within-city moves with a two-hour cutoff window. Same driver, same truck,
          GPS the whole way, signed proof of delivery at the door. For when waiting
          until tomorrow isn&rsquo;t the answer.
        </p>
        <div className="page-stats">
          <div className="page-stat">
            <strong>&lt;2<em>h</em></strong>
            <span>Cutoff to wheels-rolling</span>
          </div>
          <div className="page-stat">
            <strong>GPS</strong>
            <span>Live position the whole way</span>
          </div>
          <div className="page-stat">
            <strong>Signed</strong>
            <span>POD with photo and timestamp</span>
          </div>
        </div>
        <h3>Best for</h3>
        <ul>
          <li>Legal documents, signed contracts</li>
          <li>Last-minute event collateral</li>
          <li>Replacement parts to a job site</li>
        </ul>
      </article>

      <div className="page-cta">
        <h3>
          Not sure which lane is <em>right?</em>
        </h3>
        <p>
          Tell us what you&rsquo;re moving and where. We&rsquo;ll quote the right service
          inside an hour, weekdays.
        </p>
        <div className="page-cta-actions">
          <Link href="/quote" className="btn-primary" data-magnetic>
            Get a quote
          </Link>
          <Link href="/coverage" className="btn-ghost">
            See coverage
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
