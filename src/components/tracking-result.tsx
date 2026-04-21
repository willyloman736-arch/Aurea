import Link from "next/link";
import { ArrowRight, Download, Share2 } from "lucide-react";
import type { Shipment } from "@/lib/types";
import { STEP_LABELS } from "@/lib/types";

export function TrackingResult({ shipment }: { shipment: Shipment }) {
  const pct = ((shipment.progress - 1) / (STEP_LABELS.length - 1)) * 100;

  return (
    <section className="result-section">
      <div className="container-aurea">
        <div className="result-shell">
          <div className="result-head">
            <div>
              <div className="result-id">
                Tracking ID <strong>{shipment.id}</strong>
              </div>
              <h2 className="result-title">
                {shipment.status === "Delivered" ? "Delivered" : "In motion"}
                <span className="status-badge">{shipment.status}</span>
              </h2>
            </div>
            <div className="result-actions">
              <button className="btn-ghost">
                <Share2 size={14} /> Share
              </button>
              <button className="btn-ghost">
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>

          <div className="result-route">
            <div className="route-point">
              <small>From</small>
              <div className="city">{shipment.origin.city}</div>
              <div className="addr">{shipment.origin.addr}</div>
            </div>
            <div className="route-arrow">
              <ArrowRight size={22} strokeWidth={1.6} />
            </div>
            <div className="route-point" style={{ textAlign: "right" }}>
              <small>To</small>
              <div className="city">{shipment.destination.city}</div>
              <div className="addr">{shipment.destination.addr}</div>
            </div>
          </div>

          <div className="progress-wrap">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="progress-steps">
              {STEP_LABELS.map((label, i) => {
                const n = i + 1;
                const cls = n < shipment.progress ? "done" : n === shipment.progress ? "current" : "";
                const time = n < shipment.progress ? "✓" : n === shipment.progress ? "Now" : "—";
                return (
                  <div key={label} className={`progress-step ${cls}`}>
                    <span className="step-label">{label}</span>
                    <span className="step-time">{time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="result-details">
            <div className="timeline">
              <h4>Event history</h4>
              {shipment.events.map((ev, i) => (
                <div key={i} className={`event ${ev.latest ? "latest" : ""}`}>
                  <div className="event-time">{ev.time}</div>
                  <div className="event-title">{ev.title}</div>
                  <div className="event-loc">{ev.loc}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="eta-card">
                <div className="eta-label">Estimated delivery</div>
                <div className="eta-date">{shipment.etaDate}</div>
                <div className="eta-window">{shipment.etaWindow}</div>
              </div>
              <div className="side-card" style={{ marginTop: 14 }}>
                <h4>Shipment details</h4>
                <div className="side-row"><span>Service</span><span>{shipment.service}</span></div>
                <div className="side-row"><span>Pieces</span><span>{shipment.pieces}</span></div>
                <div className="side-row"><span>Weight</span><span>{shipment.weight}</span></div>
                <div className="side-row"><span>Dimensions</span><span>{shipment.dimensions}</span></div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 28, textAlign: "center" }}>
            <Link href="/#track" className="btn-ghost">Track another shipment</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
