import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, RefreshCw } from "lucide-react";
import { DashHeader } from "@/components/dashboard/header";
import { StatusPill } from "@/components/dashboard/status-pill";
import { getShipmentById } from "@/lib/dashboard-queries";
import { STEP_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shipment = await getShipmentById(id);
  if (!shipment) notFound();

  const pct = ((shipment.progress - 1) / (STEP_LABELS.length - 1)) * 100;

  return (
    <>
      <DashHeader
        title={shipment.trackingCode}
        subtitle={`${shipment.carrier ?? "Carrier pending"} · ${shipment.service ?? "—"}`}
        actions={
          <>
            <Link href="/dashboard/shipments" className="btn-ghost btn-sm">
              <ArrowLeft size={13} strokeWidth={1.5} /> Back
            </Link>
            <Link href={`/track/${shipment.trackingCode}`} className="btn-ghost btn-sm" target="_blank">
              <ExternalLink size={13} strokeWidth={1.5} /> Public view
            </Link>
            <button className="btn-primary btn-sm">
              <RefreshCw size={13} strokeWidth={1.5} /> Refresh
            </button>
          </>
        }
      />

      <div className="dash-content">
        <div className="dash-detail-grid">
          <div>
            {/* Status + route */}
            <div className="dash-card">
              <div className="dash-status-row">
                <StatusPill status={shipment.status} />
                <span className="dash-muted">Updated {shipment.updatedAt.toLocaleString()}</span>
              </div>

              <div className="dash-route-block">
                <div>
                  <small>From</small>
                  <strong>{shipment.originCity ?? "Pending"}</strong>
                  <span>{shipment.originAddr ?? "—"}</span>
                </div>
                <ArrowRight size={20} strokeWidth={1.5} className="dash-route-arrow" />
                <div className="right">
                  <small>To</small>
                  <strong>{shipment.destCity ?? "Pending"}</strong>
                  <span>{shipment.destAddr ?? "—"}</span>
                </div>
              </div>

              {/* Progress */}
              <div className="dash-progress">
                <div className="dash-progress-bar">
                  <div className="dash-progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="dash-progress-steps">
                  {STEP_LABELS.map((label, i) => {
                    const n = i + 1;
                    const cls = n < shipment.progress ? "done" : n === shipment.progress ? "current" : "";
                    return (
                      <div key={label} className={`dash-step ${cls}`}>
                        <span>{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Event history */}
            <div className="dash-card">
              <div className="dash-card-head">
                <h2 className="dash-card-title">Event history</h2>
                <span className="dash-muted">{shipment.events.length} events</span>
              </div>
              {shipment.events.length === 0 ? (
                <p className="dash-muted">No events yet — awaiting first carrier scan.</p>
              ) : (
                <ol className="dash-timeline">
                  {shipment.events.map((ev, i) => (
                    <li key={ev.id} className={i === 0 ? "latest" : ""}>
                      <div className="dash-timeline-dot" />
                      <div className="dash-timeline-content">
                        <time>{ev.time.toLocaleString()}</time>
                        <h4>{ev.title}</h4>
                        {ev.location && <p>{ev.location}</p>}
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>

          <div>
            {/* ETA */}
            <div className="dash-card dash-card-accent">
              <h4>Estimated delivery</h4>
              <div className="dash-eta">{shipment.etaDate ?? "Pending"}</div>
              <p>{shipment.etaWindow ?? "Awaiting first scan"}</p>
            </div>

            {/* Details */}
            <div className="dash-card">
              <h4 className="dash-card-title-sm">Shipment details</h4>
              <dl className="dash-dl">
                <div><dt>ID</dt><dd className="mono">{shipment.id}</dd></div>
                <div><dt>Tracking #</dt><dd className="mono">{shipment.trackingCode}</dd></div>
                <div><dt>Carrier</dt><dd>{shipment.carrier ?? "—"}</dd></div>
                <div><dt>Service</dt><dd>{shipment.service ?? "—"}</dd></div>
                <div><dt>Pieces</dt><dd>{shipment.pieces}</dd></div>
                <div><dt>Weight</dt><dd>{shipment.weight ?? "—"}</dd></div>
                <div><dt>Dimensions</dt><dd>{shipment.dimensions ?? "—"}</dd></div>
                <div><dt>EasyPost ID</dt><dd className="mono">{shipment.easypostId ?? "—"}</dd></div>
                <div><dt>Created</dt><dd>{shipment.createdAt.toLocaleDateString()}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
