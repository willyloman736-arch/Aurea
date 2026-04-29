"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Package, X } from "lucide-react";
import { LiveMap } from "./live-map";
import { LiveEvents } from "./live-events";
import {
  HUBS,
  SHIPMENTS,
  type ActiveShipment,
} from "./portal-data";

const FILTERS: Array<{
  id: "all" | ActiveShipment["status"];
  label: string;
}> = [
  { id: "all", label: "All" },
  { id: "Picked up", label: "Picked up" },
  { id: "In Transit", label: "In transit" },
  { id: "Out for delivery", label: "Out for delivery" },
  { id: "Delivered", label: "Delivered" },
  { id: "Exception", label: "Exception" },
];

const STATUS_BADGE: Record<ActiveShipment["status"], string> = {
  "Picked up": "portal-pill portal-pill-picked",
  "In Transit": "portal-pill portal-pill-transit",
  "Out for delivery": "portal-pill portal-pill-out",
  Delivered: "portal-pill portal-pill-delivered",
  Exception: "portal-pill portal-pill-exception",
};

export function PortalClient() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return SHIPMENTS;
    return SHIPMENTS.filter((s) => s.status === filter);
  }, [filter]);

  const selected = useMemo(
    () => SHIPMENTS.find((s) => s.id === selectedId) ?? null,
    [selectedId],
  );

  const hubById = useMemo(
    () => Object.fromEntries(HUBS.map((h) => [h.id, h])),
    [],
  );

  const totals = useMemo(() => {
    const t = { transit: 0, out: 0, delivered: 0, exception: 0 };
    for (const s of SHIPMENTS) {
      if (s.status === "In Transit" || s.status === "Picked up") t.transit++;
      else if (s.status === "Out for delivery") t.out++;
      else if (s.status === "Delivered") t.delivered++;
      else if (s.status === "Exception") t.exception++;
    }
    return t;
  }, []);

  return (
    <div className="portal">
      {/* Top stat strip */}
      <div className="portal-stats">
        <div className="portal-stat">
          <strong>{SHIPMENTS.length}</strong>
          <span>Active shipments</span>
        </div>
        <div className="portal-stat">
          <strong>{totals.transit}</strong>
          <span>In transit</span>
        </div>
        <div className="portal-stat">
          <strong>{totals.out}</strong>
          <span>Out for delivery</span>
        </div>
        <div className="portal-stat">
          <strong className="portal-stat-warn">{totals.exception}</strong>
          <span>Exceptions</span>
        </div>
      </div>

      {/* Filter chips */}
      <div className="portal-filters" role="tablist" aria-label="Status filter">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            className={`portal-filter ${filter === f.id ? "is-active" : ""}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="portal-grid">
        {/* Map */}
        <div className="portal-map">
          <LiveMap
            hubs={HUBS}
            shipments={filtered}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          {/* Selected shipment overlay */}
          {selected && (
            <div className="portal-detail">
              <div className="portal-detail-head">
                <span className="portal-detail-code">{selected.trackingCode}</span>
                <button
                  type="button"
                  className="portal-detail-close"
                  onClick={() => setSelectedId(null)}
                  aria-label="Close shipment detail"
                >
                  <X size={13} strokeWidth={1.6} />
                </button>
              </div>
              <div className="portal-detail-route">
                <span>{hubById[selected.fromHub]?.city ?? "—"}</span>
                <ArrowRight size={12} strokeWidth={1.5} />
                <span>{hubById[selected.toHub]?.city ?? "—"}</span>
              </div>
              <span className={STATUS_BADGE[selected.status]}>
                {selected.status}
              </span>
              <div className="portal-detail-rows">
                <div>
                  <small>Recipient</small>
                  <strong>{selected.recipient}</strong>
                </div>
                <div>
                  <small>ETA</small>
                  <strong>{selected.eta}</strong>
                </div>
                <div>
                  <small>Pieces</small>
                  <strong>{selected.pieces}</strong>
                </div>
                <div>
                  <small>Weight</small>
                  <strong>{selected.weight}</strong>
                </div>
              </div>
              <div className="portal-detail-progress">
                <div className="portal-detail-progress-bar">
                  <div
                    className="portal-detail-progress-fill"
                    style={{ width: `${Math.round(selected.progress * 100)}%` }}
                  />
                </div>
                <span>{Math.round(selected.progress * 100)}% complete</span>
              </div>
              <Link
                href={`/track/${selected.trackingCode}`}
                className="btn-ghost btn-sm portal-detail-cta"
              >
                Open public tracking
                <ArrowRight size={11} strokeWidth={1.6} />
              </Link>
            </div>
          )}
        </div>

        {/* Side panels */}
        <div className="portal-side">
          {/* Active shipments list */}
          <div className="portal-panel">
            <div className="portal-panel-head">
              <Package size={12} strokeWidth={1.6} />
              <span>Active shipments</span>
              <span className="portal-panel-count">{filtered.length}</span>
            </div>
            <ol className="portal-ships">
              {filtered.map((s) => (
                <li
                  key={s.id}
                  className={`portal-ship ${selectedId === s.id ? "is-active" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedId(s.id === selectedId ? null : s.id)
                    }
                  >
                    <div className="portal-ship-row">
                      <span className="portal-ship-code">{s.trackingCode}</span>
                      <span className={STATUS_BADGE[s.status]}>{s.status}</span>
                    </div>
                    <div className="portal-ship-route">
                      <span>{hubById[s.fromHub]?.city}</span>
                      <ArrowRight size={10} strokeWidth={1.6} />
                      <span>{hubById[s.toHub]?.city}</span>
                      <span className="portal-ship-eta">· {s.eta}</span>
                    </div>
                  </button>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="portal-ships-empty">
                  No shipments in this state right now.
                </li>
              )}
            </ol>
          </div>

          {/* Live events ticker */}
          <div className="portal-panel">
            <LiveEvents />
          </div>
        </div>
      </div>
    </div>
  );
}
