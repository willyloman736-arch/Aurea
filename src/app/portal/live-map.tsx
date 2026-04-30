"use client";

import { useMemo, useState } from "react";
import type { ActiveShipment, Hub } from "./portal-data";
import { CONTINENTS } from "./world-paths";

const VIEW_W = 720;
const VIEW_H = 360;

/** Equirectangular projection. */
function project(lat: number, lng: number): { x: number; y: number } {
  return {
    x: ((lng + 180) / 360) * VIEW_W,
    y: ((90 - lat) / 180) * VIEW_H,
  };
}

/** Convert a list of [lng, lat] to a closed SVG polygon points string. */
function continentToPoints(coords: [number, number][]): string {
  return coords
    .map(([lng, lat]) => {
      const { x, y } = project(lat, lng);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

const STATUS_COLOR: Record<ActiveShipment["status"], string> = {
  "Picked up": "#4682bc",
  "In Transit": "#1a4480",
  "Out for delivery": "#2079d5",
  "On hold": "#6b7280",
  Delivered: "#2e8b57",
  Exception: "#d52b1e",
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
  const [hoveredHub, setHoveredHub] = useState<string | null>(null);

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

  // Hubs that should show their label: hubs in the selected route + hovered hub
  const labeledHubIds = useMemo(() => {
    const ids = new Set<string>();
    if (hoveredHub) ids.add(hoveredHub);
    if (selectedId) {
      const sel = shipments.find((s) => s.id === selectedId);
      if (sel) {
        ids.add(sel.fromHub);
        ids.add(sel.toHub);
      }
    }
    return ids;
  }, [hoveredHub, selectedId, shipments]);

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
          <stop offset="0%" stopColor="rgba(26, 68, 128, 0.6)" />
          <stop offset="60%" stopColor="rgba(26, 68, 128, 0.10)" />
          <stop offset="100%" stopColor="rgba(26, 68, 128, 0)" />
        </radialGradient>
        <radialGradient id="hub-glow-active" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(232, 241, 255, 0.95)" />
          <stop offset="60%" stopColor="rgba(26, 68, 128, 0.18)" />
          <stop offset="100%" stopColor="rgba(26, 68, 128, 0)" />
        </radialGradient>
        <filter id="map-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
        <linearGradient id="continent-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(26, 68, 128, 0.05)" />
          <stop offset="100%" stopColor="rgba(26, 68, 128, 0.02)" />
        </linearGradient>
      </defs>

      {/* Graticule — fine grid, slightly emphasized equator/prime meridian */}
      <g className="map-grid" aria-hidden="true">
        {/* Meridians every 30° */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
          const x = (deg / 360) * VIEW_W;
          const isPrime = deg === 180;
          return (
            <line
              key={`v${deg}`}
              x1={x}
              y1={0}
              x2={x}
              y2={VIEW_H}
              className={isPrime ? "map-grid-axis" : ""}
            />
          );
        })}
        {/* Parallels every 30° */}
        {[60, 90, 120, 150].map((deg, i) => {
          const y = (deg / 180) * VIEW_H;
          const isEquator = deg === 90;
          return (
            <line
              key={`h${i}`}
              x1={0}
              y1={y}
              x2={VIEW_W}
              y2={y}
              className={isEquator ? "map-grid-axis" : ""}
            />
          );
        })}
      </g>

      {/* Continent silhouettes — schematic, low-opacity */}
      <g className="map-continents" aria-hidden="true">
        {CONTINENTS.map((c) => (
          <polygon
            key={c.id}
            points={continentToPoints(c.points)}
            fill="url(#continent-fill)"
            stroke="rgba(26, 68, 128, 0.18)"
            strokeWidth={0.6}
            strokeLinejoin="round"
          />
        ))}
      </g>

      {/* Routes */}
      <g className="map-routes">
        {routes.map((r) => {
          const active = selectedId === r.id;
          const stroke = STATUS_COLOR[r.status];
          return (
            <g key={r.id} className={`map-route ${active ? "is-active" : ""}`}>
              {/* Soft glow layer */}
              <path
                d={r.path}
                fill="none"
                stroke={stroke}
                strokeOpacity={active ? 0.4 : 0.22}
                strokeWidth={active ? 5 : 3}
                strokeLinecap="round"
                filter="url(#map-soft)"
              />
              {/* Bright top stroke */}
              <path
                d={r.path}
                fill="none"
                stroke={stroke}
                strokeOpacity={active ? 1 : 0.75}
                strokeWidth={active ? 1.8 : 1.2}
                strokeLinecap="round"
                strokeDasharray={r.status === "Exception" ? "3 3" : undefined}
              />
              {/* Travelling pulse */}
              {r.status !== "Delivered" && r.status !== "Exception" && (
                <circle
                  r={active ? 3.4 : 2.6}
                  fill="#1a4480"
                  filter="url(#map-soft)"
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
          const isInActiveRoute = involvedIds.some(
            (id) => id === selectedId,
          );
          const isHovered = hoveredHub === h.id;
          const isLabeled = labeledHubIds.has(h.id);
          return (
            <g
              key={h.id}
              className="map-hub"
              transform={`translate(${x} ${y})`}
              onMouseEnter={() => setHoveredHub(h.id)}
              onMouseLeave={() => setHoveredHub(null)}
            >
              <circle
                r={isInActiveRoute || isHovered ? 14 : 9}
                fill={
                  isInActiveRoute || isHovered
                    ? "url(#hub-glow-active)"
                    : "url(#hub-glow)"
                }
              />
              <circle
                r={isInActiveRoute || isHovered ? 2.8 : 2.0}
                fill={isInActiveRoute || isHovered ? "#fff5e0" : "#2079d5"}
              />
              {isLabeled && (
                <g className="map-hub-label-group">
                  <rect
                    x={-(h.city.length * 2.4)}
                    y={-22}
                    width={h.city.length * 4.8}
                    height={11}
                    rx={2}
                    className="map-hub-label-bg"
                  />
                  <text
                    x={0}
                    y={-14}
                    textAnchor="middle"
                    className="map-hub-label"
                  >
                    {h.city.toUpperCase()}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </g>

      {/* Click-overlay layer — wider hit area on each route */}
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
