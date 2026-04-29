"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { X, MapPin } from "lucide-react";
import type { Hub } from "./globe";
import { useInView } from "./use-in-view";

const Globe = dynamic(
  () => import("./globe").then((m) => m.Globe),
  {
    ssr: false,
    loading: () => <div className="globe-loading" />,
  },
);

export function GlobeMount() {
  const [selected, setSelected] = useState<Hub | null>(null);
  const [ref, inView] = useInView<HTMLDivElement>("400px");

  return (
    <div ref={ref} className="globe-wrap">
      {inView ? (
        <Globe onHubClick={setSelected} selectedHub={selected} />
      ) : (
        <div className="globe-loading" />
      )}

      <div className="globe-hint">
        <span className="globe-hint-dot" />
        Drag to rotate · click a hub
      </div>

      {selected && (
        <div className="hub-detail">
          <button
            className="hub-detail-close"
            onClick={() => setSelected(null)}
            aria-label="Close"
          >
            <X size={14} />
          </button>
          <div className="hub-detail-head">
            <MapPin size={14} className="hub-detail-pin" />
            <span className="hub-detail-country">{selected.country}</span>
          </div>
          <div className="hub-detail-name">{selected.name}</div>
          <div className="hub-detail-grid">
            <div>
              <small>Throughput</small>
              <strong>{selected.throughput}</strong>
            </div>
            <div>
              <small>Active lanes</small>
              <strong>{selected.lanes}</strong>
            </div>
            <div>
              <small>Coordinates</small>
              <strong className="hub-detail-coord">
                {selected.lat.toFixed(2)}, {selected.lng.toFixed(2)}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
