import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { getShipmentByReceiptKey } from "@/lib/dashboard-queries";
import { getSiteUrl } from "@/lib/site-url";
import { ReceiptActions } from "./receipt-actions";

export const metadata: Metadata = {
  title: "Shipment receipt · USPS-S",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type ReceiptEvent = {
  id: string;
  time: Date;
  title: string;
  location: string | null;
};

const SERVICE_LABELS: Record<string, string> = {
  express: "Express parcel",
  freight: "Freight",
  sameDay: "Same-day",
};

function formatDate(d: Date): string {
  return d.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STAMP_MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

function stampDate(d: Date): string {
  return `${String(d.getDate()).padStart(2, "0")} ${STAMP_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export default async function ShipmentReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shipment = await getShipmentByReceiptKey(id);
  if (!shipment) notFound();

  const siteUrl = getSiteUrl();
  const status = shipment.status;
  const issued = formatDate(shipment.createdAt);
  const updated = formatDate(shipment.updatedAt);
  const today = stampDate(new Date());

  return (
    <main className="rcpt-shell">
      <ReceiptActions
        backHref={`/track/${shipment.trackingCode}`}
        trackingCode={shipment.trackingCode}
      />

      <article className="rcpt-doc">
        {/* OFFICIAL STAMP — SVG with proper curved text along arcs */}
        <div className="rcpt-stamp" aria-hidden="true">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Top arc — text reads from left to right, arching upward */}
              <path
                id="rcpt-stamp-top-arc"
                d="M 28 100 A 72 72 0 0 1 172 100"
                fill="none"
              />
              {/* Bottom arc — drawn right→left so text reads upright */}
              <path
                id="rcpt-stamp-bottom-arc"
                d="M 172 100 A 72 72 0 0 1 28 100"
                fill="none"
              />
            </defs>

            {/* Outer ring */}
            <circle
              cx="100"
              cy="100"
              r="92"
              fill="none"
              stroke="#1a4480"
              strokeWidth="3.5"
            />
            {/* Inner ring */}
            <circle
              cx="100"
              cy="100"
              r="84"
              fill="none"
              stroke="#1a4480"
              strokeWidth="1"
            />

            {/* Top curved text */}
            <text
              fontFamily="var(--font-public-sans), sans-serif"
              fontSize="11"
              fontWeight="800"
              letterSpacing="2.4"
              fill="#1a4480"
            >
              <textPath
                href="#rcpt-stamp-top-arc"
                startOffset="50%"
                textAnchor="middle"
              >
                ★ USPS-S ★
              </textPath>
            </text>

            {/* Bottom curved text (the path reverses so it reads upright) */}
            <text
              fontFamily="var(--font-public-sans), sans-serif"
              fontSize="9.5"
              fontWeight="700"
              letterSpacing="2.2"
              fill="#1a4480"
            >
              <textPath
                href="#rcpt-stamp-bottom-arc"
                startOffset="50%"
                textAnchor="middle"
              >
                OFFICIAL · DOCUMENT
              </textPath>
            </text>

            {/* Centre — horizontal rule + RECEIVED + date + horizontal rule */}
            <line
              x1="48"
              y1="78"
              x2="152"
              y2="78"
              stroke="#1a4480"
              strokeWidth="1"
            />
            <line
              x1="48"
              y1="124"
              x2="152"
              y2="124"
              stroke="#1a4480"
              strokeWidth="1"
            />

            <text
              x="100"
              y="94"
              textAnchor="middle"
              fontFamily="var(--font-public-sans), sans-serif"
              fontSize="11"
              fontWeight="800"
              letterSpacing="2"
              fill="#1a4480"
            >
              RECEIVED
            </text>

            <text
              x="100"
              y="115"
              textAnchor="middle"
              fontFamily='ui-monospace, "SF Mono", Consolas, monospace'
              fontSize="14"
              fontWeight="800"
              letterSpacing="1.4"
              fill="#1a4480"
            >
              {today}
            </text>
          </svg>
        </div>

        {/* HEADER */}
        <header className="rcpt-header">
          <div className="rcpt-header-brand">
            <Image
              src="/logo.svg"
              alt="USPS-S"
              width={56}
              height={56}
              className="rcpt-logo"
            />
            <div>
              <div className="rcpt-brand-name">USPS-S</div>
              <div className="rcpt-brand-tag">
                Shipment Receipt &amp; Bill of Carriage
              </div>
            </div>
          </div>
          <div className="rcpt-header-meta">
            <div>
              <span className="rcpt-meta-label">Tracking code</span>
              <span className="rcpt-meta-value rcpt-mono">
                {shipment.trackingCode}
              </span>
            </div>
            <div>
              <span className="rcpt-meta-label">Issued</span>
              <span className="rcpt-meta-value">{issued}</span>
            </div>
            <div>
              <span className="rcpt-meta-label">Status</span>
              <span className={`rcpt-status rcpt-status-${slug(status)}`}>
                {status}
              </span>
            </div>
          </div>
        </header>

        {/* ROUTE */}
        <section className="rcpt-route">
          <div className="rcpt-route-end">
            <span className="rcpt-route-label">From</span>
            <div className="rcpt-route-city">
              {shipment.originCity ?? "—"}
            </div>
            {shipment.originAddr && (
              <div className="rcpt-route-addr">{shipment.originAddr}</div>
            )}
          </div>
          <div className="rcpt-route-arrow" aria-hidden="true">
            <ArrowRight size={18} strokeWidth={1.6} />
          </div>
          <div className="rcpt-route-end">
            <span className="rcpt-route-label">To</span>
            <div className="rcpt-route-city">
              {shipment.destCity ?? "—"}
            </div>
            {shipment.destAddr && (
              <div className="rcpt-route-addr">{shipment.destAddr}</div>
            )}
          </div>
        </section>

        {/* PARTIES */}
        <section className="rcpt-parties">
          <div className="rcpt-party">
            <div className="rcpt-party-eyebrow">Sender</div>
            <div className="rcpt-party-name">
              {shipment.senderName ?? "—"}
            </div>
            <dl className="rcpt-party-rows">
              {shipment.senderEmail && (
                <div>
                  <dt>Email</dt>
                  <dd>{shipment.senderEmail}</dd>
                </div>
              )}
              {shipment.senderPhone && (
                <div>
                  <dt>Phone</dt>
                  <dd>{shipment.senderPhone}</dd>
                </div>
              )}
              {shipment.originAddr && (
                <div>
                  <dt>Address</dt>
                  <dd>{shipment.originAddr}</dd>
                </div>
              )}
            </dl>
          </div>
          <div className="rcpt-party">
            <div className="rcpt-party-eyebrow">Recipient</div>
            <div className="rcpt-party-name">
              {shipment.receiverName ?? "—"}
            </div>
            <dl className="rcpt-party-rows">
              {shipment.receiverEmail && (
                <div>
                  <dt>Email</dt>
                  <dd>{shipment.receiverEmail}</dd>
                </div>
              )}
              {shipment.receiverPhone && (
                <div>
                  <dt>Phone</dt>
                  <dd>{shipment.receiverPhone}</dd>
                </div>
              )}
              {shipment.destAddr && (
                <div>
                  <dt>Address</dt>
                  <dd>{shipment.destAddr}</dd>
                </div>
              )}
            </dl>
          </div>
        </section>

        {/* PACKAGE */}
        <section className="rcpt-package">
          <div className="rcpt-section-title">Package details</div>
          <dl className="rcpt-grid">
            <div>
              <dt>Description</dt>
              <dd>{shipment.packageDescription ?? "—"}</dd>
            </div>
            <div>
              <dt>Service</dt>
              <dd>
                {SERVICE_LABELS[shipment.service ?? ""] ??
                  shipment.service ??
                  "—"}
              </dd>
            </div>
            <div>
              <dt>Pieces</dt>
              <dd>{shipment.pieces}</dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>{shipment.weight ?? "—"}</dd>
            </div>
            <div>
              <dt>Dimensions</dt>
              <dd>{shipment.dimensions ?? "—"}</dd>
            </div>
            <div>
              <dt>Declared value</dt>
              <dd>{shipment.declaredValue ?? "—"}</dd>
            </div>
            <div>
              <dt>Dispatch location</dt>
              <dd>{shipment.dispatchLocation ?? "—"}</dd>
            </div>
            <div>
              <dt>Estimated delivery</dt>
              <dd>{shipment.etaDate ?? "—"}</dd>
            </div>
          </dl>
        </section>

        {/* TIMELINE — only show if there are events beyond "Shipment created" */}
        {shipment.events.length > 0 && (
          <section className="rcpt-timeline">
            <div className="rcpt-section-title">Tracking history</div>
            <ol className="rcpt-events">
              {shipment.events.map((ev: ReceiptEvent, i: number) => (
                <li key={ev.id} className={i === 0 ? "is-latest" : ""}>
                  <div className="rcpt-event-dot" />
                  <div className="rcpt-event-body">
                    <div className="rcpt-event-title">{ev.title}</div>
                    <div className="rcpt-event-meta">
                      <span>{ev.time.toLocaleString()}</span>
                      {ev.location && <span> · {ev.location}</span>}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* TERMS / FOOTER */}
        <footer className="rcpt-foot">
          <div className="rcpt-foot-block">
            <div className="rcpt-foot-eyebrow">Track this shipment</div>
            <div>
              Recipient can follow live status at{" "}
              <strong>{siteUrl}/track/{shipment.trackingCode}</strong>
              {" "}— no login required.
            </div>
          </div>
          <div className="rcpt-foot-block">
            <div className="rcpt-foot-eyebrow">Insurance</div>
            <div>
              Every USPS-S shipment is covered up to its declared value. Excess
              cover available at booking. File a claim at{" "}
              <strong>{siteUrl}/claims</strong> within 7 days
              of the delivery window.
            </div>
          </div>
          <div className="rcpt-foot-block">
            <div className="rcpt-foot-eyebrow">Contact</div>
            <div>
              Questions about this shipment:{" "}
              <strong>info@usps-s.com</strong>. We answer within 4
              hours, every day.
            </div>
          </div>
          <div className="rcpt-foot-rule" />
          <div className="rcpt-foot-base">
            <span>
              © {new Date().getFullYear()} USPS-S. SOC 2 Type II ·
              ISO 27001 · GDPR
            </span>
            <span>Last updated {updated}</span>
          </div>
        </footer>
      </article>

      {/* Bottom action bar (mobile-friendly) */}
      <div className="rcpt-foot-bar">
        <Link
          href={`/track/${shipment.trackingCode}`}
          className="btn-ghost btn-sm"
        >
          <ArrowLeft size={13} strokeWidth={1.6} />
          Back to shipment
        </Link>
      </div>
    </main>
  );
}

function slug(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "-");
}
