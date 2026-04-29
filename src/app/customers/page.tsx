import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Customers · Aurea",
  description:
    "Real ops teams shipping with Aurea. Three case studies, the metrics, the work behind them.",
};

export default function CustomersPage() {
  return (
    <PageShell
      eyebrow="Customers"
      title={
        <>
          Operators who moved the <em>numbers.</em>
        </>
      }
      lede="Three teams who replaced existing courier and freight infrastructure with Aurea — and what it cost them not to. Real metrics, named operators, no anonymous &ldquo;Fortune 500 retailer.&rdquo;"
    >
      <article id="vendr" className="page-section">
        <h2>
          Vendr · <em>Twenty-thousand parcels a month</em>
        </h2>
        <div className="page-stats">
          <div className="page-stat">
            <strong>&minus;68<em>%</em></strong>
            <span>Support tickets about delivery</span>
          </div>
          <div className="page-stat">
            <strong>20K</strong>
            <span>Parcels / month</span>
          </div>
          <div className="page-stat">
            <strong>6<em>h</em></strong>
            <span>Ops hours reclaimed weekly</span>
          </div>
        </div>
        <h3>The challenge</h3>
        <p>
          Vendr was running three separate courier integrations — one regional, one
          international, one for high-value. Each had its own support inbox, its
          own SLA fine print, and its own way of saying &ldquo;the package is in
          transit&rdquo; for a week before admitting it was lost.
        </p>
        <h3>What changed</h3>
        <p>
          Vendr moved every shipment to Aurea over six weeks. One booking flow,
          one custody chain, one phone number when something needs attention.
          Their ops team reclaimed roughly six hours a week from chasing carrier
          updates, and customer support tickets about delivery dropped by more
          than two-thirds in the first quarter.
        </p>
        <p className="page-callout">
          <strong>Maya Aldrin, VP Operations:</strong> &ldquo;We move twenty
          thousand parcels a month with Aurea. They don&rsquo;t lose packages,
          they don&rsquo;t pad delivery windows, and our customers stopped
          calling to ask where their orders are.&rdquo;
        </p>
      </article>

      <article id="flexport" className="page-section">
        <h2>
          Flexport · <em>Cross-border freight, customs included</em>
        </h2>
        <div className="page-stats">
          <div className="page-stat">
            <strong>±38<em>min</em></strong>
            <span>Median ETA accuracy</span>
          </div>
          <div className="page-stat">
            <strong>0</strong>
            <span>Customs holds in 2025</span>
          </div>
          <div className="page-stat">
            <strong>4<em>×</em></strong>
            <span>Faster claim resolution</span>
          </div>
        </div>
        <h3>The challenge</h3>
        <p>
          Flexport&rsquo;s in-house ETA model held within two hours on a good day
          and four on a bad one. Cross-border shipments routinely sat at customs
          waiting for paperwork. Their freight ops team was on the phone more than
          they were operating.
        </p>
        <h3>What changed</h3>
        <p>
          Flexport replaced their internal ETA pipeline with Aurea&rsquo;s
          per-lane predictive ETA. Cross-border freight now flows through Aurea
          customs brokers, so paperwork is filed before the truck arrives at the
          border. ETAs hold within thirty minutes on most lanes; the freight ops
          team stopped scheduling around delays — because there aren&rsquo;t any.
        </p>
        <p className="page-callout">
          <strong>Daniel Okafor, Head of Logistics:</strong> &ldquo;Aurea handles
          our cross-border freight through customs without us sitting on the
          phone. ETAs hold within thirty minutes. We&rsquo;ve stopped scheduling
          around their delays — because there aren&rsquo;t any.&rdquo;
        </p>
      </article>

      <article id="ramp" className="page-section">
        <h2>
          Ramp · <em>Hardware to forty countries</em>
        </h2>
        <div className="page-stats">
          <div className="page-stat">
            <strong>40+</strong>
            <span>Countries with employees</span>
          </div>
          <div className="page-stat">
            <strong>0</strong>
            <span>Lost packages, last 12 mo</span>
          </div>
          <div className="page-stat">
            <strong>1<em>×</em></strong>
            <span>Avg follow-up emails</span>
          </div>
        </div>
        <h3>The challenge</h3>
        <p>
          Ramp ships swag, hardware, and signed contracts to a distributed team in
          more than forty countries. The previous courier required four follow-up
          emails per international shipment, and at least one a quarter would land
          in a customs queue with the wrong paperwork.
        </p>
        <h3>What changed</h3>
        <p>
          Ramp moved its full international flow to Aurea. The first hundred
          shipments cleared customs without intervention. The People Ops team now
          books from a single internal tool, sees live tracking on every parcel,
          and gets a doorstep-confirmed photo for every laptop they ship.
        </p>
        <p className="page-callout">
          <strong>Sara Kim, Ops Lead:</strong> &ldquo;We ship hardware, swag, and
          signed contracts to employees in forty countries. Aurea is the only
          courier we trust to land a package without four follow-up emails.&rdquo;
        </p>
      </article>

      <article className="page-section">
        <h2>
          And <em>many more</em>
        </h2>
        <p>
          We move cargo for retailers, marketplaces, hardware companies,
          professional services firms, and individual senders who care about who&rsquo;s
          handling their parcels. Most of them you&rsquo;ve heard of. A few prefer not
          to have their logos on a marketing page — fair enough.
        </p>
      </article>

      <div className="page-cta">
        <h3>
          Want to be the <em>fourth case study?</em>
        </h3>
        <p>
          Tell us what you&rsquo;re moving and where. We&rsquo;ll have you on a
          lane this week.
        </p>
        <div className="page-cta-actions">
          <Link href="/quote" className="btn-primary" data-magnetic>
            Get a quote
          </Link>
          <Link href="/services" className="btn-ghost">
            Browse services
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
