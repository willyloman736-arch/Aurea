"use client";

import { useMemo } from "react";
import type { ActiveShipment, Hub } from "./portal-data";

const VIEW_W = 720;
const VIEW_H = 360;

/** Equirectangular projection. Good enough for a premium dashboard,
 *  no surprises near the poles since our hubs are mid-latitude. */
function project(lat: number, lng: number): { x: number; y: number } {
  return {
    x: ((lng + 180) / 360) * VIEW_W,
    y: ((90 - lat) / 180) * VIEW_H,
  };
}

const STATUS_COLOR: Record<ActiveShipment["status"], string> = {
  "Picked up": "#a8c4e0",
  "In Transit": "#d9a56a",
  "Out for delivery": "#f5d4a5",
  Delivered: "#9ae0b8",
  Exception: "#e08a7a",
};

interface LiveMapProps {
  hubs: Hub[];
  shipments: ActiveShipment[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function LiveMap({
  hubs,
  shipments,
  selectedId,
  onSelect,
}: LiveMapProps) {
  const hubById = useMemo(() => {
    return Object.fromEntries(hubs.map((h) => [h.id, h]));
  }, [hubs]);

  const routes = useMemo(() => {
    return shipments
      .map((s) => {
        const a = hubById[s.fromHub];
        const b = hubById[s.toHub];
        if (!a || !b) return null;
        const p1 = project(a.lat, a.lng);
        const p2 = project(b.lat, b.lng);
        // Quadratic bezier control point — lifted toward top of canvas
        // so arcs curve over the equator visually.
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const lift = Math.min(dist * 0.22, 60);
        const cx = midX;
        const cy = midY - lift;
        const path = `M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`;
        return { id: s.id, path, status: s.status, progress: s.progress };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);
  }, [shipments, hubById]);

  return (
    <svg
      className="map-svg"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Live tracking map of active Aurea shipments"
    >
      <defs>
        <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(217, 165, 106, 0.55)" />
          <stop offset="60%" stopColor="rgba(217, 165, 106, 0.08)" />
          <stop offset="100%" stopColor="rgba(217, 165, 106, 0)" />
        </radialGradient>
        <radialGradient id="hub-glow-active" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255, 232, 196, 0.85)" />
          <stop offset="60%" stopColor="rgba(217, 165, 106, 0.15)" />
          <stop offset="100%" stopColor="rgba(217, 165, 106, 0)" />
        </radialGradient>
        <filter id="map-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>

      {/* Latitude grid — equator and tropics */}
      <g className="map-grid" aria-hidden="true">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const x = (deg / 360) * VIEW_W;
          return <line key={`v${deg}`} x1={x} y1={0} x2={x} y2={VIEW_H} />;
        })}
        {[30, 90, 150, 210, 270].map((deg) => {
          const y = (deg / 360) * VIEW_H * 2;
          return <line key={`h${deg}`} x1={0} y1={y} x2={VIEW_W} y2={y} />;
        })}
      </g>

      {/* Routes */}
      <g className="map-routes">
        {routes.map((r) => {
          const active = selectedId === r.id;
          const stroke = STATUS_COLOR[r.status];
          return (
            <g key={r.id} className={`map-route ${active ? "is-active" : ""}`}>
              {/* Soft glow underline */}
              <path
                d={r.path}
                fill="none"
                stroke={stroke}
                strokeOpacity={active ? 0.32 : 0.16}
                strokeWidth={active ? 4 : 2.5}
                strokeLinecap="round"
                filter="url(#map-blur)"
              />
              {/* Crisp top stroke */}
              <path
                d={r.path}
                fill="none"
                stroke={stroke}
                strokeOpacity={active ? 0.9 : 0.55}
                strokeWidth={active ? 1.4 : 0.9}
                strokeLinecap="round"
                strokeDasharray={r.status === "Exception" ? "3 3" : undefined}
              />
              {/* Travelling pulse */}
              {r.status !== "Delivered" && r.status !== "Exception" && (
                <circle
                  r={active ? 3 : 2.2}
                  fill="#fff5e0"
                  filter="url(#map-blur)"
                >
                  <animateMotion
                    dur={`${4.5 + (r.id.charCodeAt(2) % 4) * 0.6}s`}
                    repeatCount="indefinite"
                    rotate="auto"
                    path={r.path}
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.15;0.85;1"
                    dur={`${4.5 + (r.id.charCodeAt(2) % 4) * 0.6}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          );
        })}
      </g>

      {/* Hub markers */}
      <g className="map-hubs">
        {hubs.map((h) => {
          const { x, y } = project(h.lat, h.lng);
          const involvedIds = shipments
            .filter((s) => s.fromHub === h.id || s.toHub === h.id)
            .map((s) => s.id);
          const isInActiveRoute = involvedIds.some((id) => id === selectedId);
          return (
            <g
              key={h.id}
              className="map-hub"
              transform={`translate(${x} ${y})`}
            >
              <circle
                r={isInActiveRoute ? 12 : 8}
                fill={
                  isInActiveRoute
                    ? "url(#hub-glow-active)"
                    : "url(#hub-glow)"
                }
              />
              <circle
                r={isInActiveRoute ? 2.6 : 2.1}
                fill={isInActiveRoute ? "#fff5e0" : "#e9b981"}
              />
              <text
                x={0}
                y={-9}
                textAnchor="middle"
                className="map-hub-label"
              >
                {h.city}
              </text>
            </g>
          );
        })}
      </g>

      {/* Click-overlay layer for shipments — wider hit area on each route */}
      <g className="map-route-hits">
        {routes.map((r) => (
          <path
            key={r.id}
            d={r.path}
            fill="none"
            stroke="transparent"
            strokeWidth={14}
            style={{ cursor: "pointer", pointerEvents: "stroke" }}
            onClick={() => onSelect(r.id === selectedId ? null : r.id)}
          />
        ))}
      </g>
    </svg>
  );
}
