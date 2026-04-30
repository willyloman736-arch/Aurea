"use client";

import { useMemo } from "react";
import { MapPin, Navigation } from "lucide-react";
import { CONTINENTS } from "@/app/portal/world-paths";
import { lookupCityCoords } from "@/lib/city-coords";
import type { ShipmentStatus } from "@/lib/types";

const VIEW_W = 720;
const VIEW_H = 360;

function project(lng: number, lat: number) {
  return {
    x: ((lng + 180) / 360) * VIEW_W,
    y: ((90 - lat) / 180) * VIEW_H,
  };
}

function continentToPoints(coords: [number, number][]): string {
  return coords
    .map(([lng, lat]) => {
      const { x, y } = project(lng, lat);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

interface TrackMapProps {
  origin: { city: string };
  destination: { city: string };
  /** Most recent event location string (e.g. "Lagos, NG"). Falls back to origin. */
  currentLoc?: string;
  status: ShipmentStatus;
  /** 0-1 progress along the route. */
  progressFraction: number;
}

const STATUS_COLOR: Record<ShipmentStatus, string> = {
  Pending: "#6b7280",
  "Picked up": "#4682bc",
  "In Transit": "#1a4480",
  "Out for delivery": "#2079d5",
  "On hold": "#6b7280",
  Delivered: "#2e8b57",
  Exception: "#d52b1e",
};

export function TrackMap({
  origin,
  destination,
  currentLoc,
  status,
  progressFraction,
}: TrackMapProps) {
  const o = useMemo(() => lookupCityCoords(origin.city), [origin.city]);
  const d = useMemo(() => lookupCityCoords(destination.city), [destination.city]);
  const c = useMemo(
    () => lookupCityCoords(currentLoc) ?? o,
    [currentLoc, o],
  );

  if (!o || !d) {
    return null; // can't render — both endpoints needed
  }

  const oP = project(o[0], o[1]);
  const dP = project(d[0], d[1]);
  const cP = c ? project(c[0], c[1]) : oP;

  // Bezier control point — lift the arc above the midpoint
  const midX = (oP.x + dP.x) / 2;
  const midY = (oP.y + dP.y) / 2;
  const dx = dP.x - oP.x;
  const dy = dP.y - oP.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const lift = Math.min(dist * 0.28, 80);
  const cx = midX;
  const cy = midY - lift;
  const arcPath = `M ${oP.x} ${oP.y} Q ${cx} ${cy} ${dP.x} ${dP.y}`;

  // Compute viewBox to fit the route with padding (20% around)
  const allXs = [oP.x, dP.x, cP.x];
  const allYs = [oP.y, dP.y, cP.y, cy];
  const minX = Math.min(...allXs);
  const maxX = Math.max(...allXs);
  const minY = Math.min(...allYs);
  const maxY = Math.max(...allYs);
  const padX = Math.max((maxX - minX) * 0.4, 40);
  const padY = Math.max((maxY - minY) * 0.6, 40);
  const vbX = Math.max(0, minX - padX);
  const vbY = Math.max(0, minY - padY);
  const vbW = Math.min(VIEW_W - vbX, maxX - minX + padX * 2);
  const vbH = Math.min(VIEW_H - vbY, maxY - minY + padY * 2);

  const accent = STATUS_COLOR[status];
  const isDelivered = status === "Delivered";

  return (
    <div className="track-map">
      <div className="track-map-frame">
        <svg
          viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
          className="track-map-svg"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`Map showing the parcel route from ${origin.city} to ${destination.city}`}
        >
          <defs>
            <radialGradient id="track-pin-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
              <stop offset="60%" stopColor={accent} stopOpacity="0.10" />
              <stop offset="100%" stopColor={accent} stopOpacity="0" />
            </radialGradient>
            <filter id="track-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.4" />
            </filter>
          </defs>

          {/* Subtle graticule */}
          <g aria-hidden="true">
            {[0, 60, 120, 180, 240, 300].map((deg) => {
              const x = (deg / 360) * VIEW_W;
              return (
                <line
                  key={`v${deg}`}
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={VIEW_H}
                  stroke="rgba(10, 30, 60, 0.05)"
                  strokeWidth={0.4}
                />
              );
            })}
            {[60, 90, 120].map((deg) => {
              const y = (deg / 180) * VIEW_H;
              return (
                <line
                  key={`h${deg}`}
                  x1={0}
                  y1={y}
                  x2={VIEW_W}
                  y2={y}
                  stroke="rgba(10, 30, 60, 0.05)"
                  strokeWidth={0.4}
                />
              );
            })}
          </g>

          {/* Continents — light fill on white bg */}
          <g aria-hidden="true">
            {CONTINENTS.map((cont) => (
              <polygon
                key={cont.id}
                points={continentToPoints(cont.points)}
                fill="rgba(26, 68, 128, 0.05)"
                stroke="rgba(26, 68, 128, 0.18)"
                strokeWidth={0.5}
                strokeLinejoin="round"
              />
            ))}
          </g>

          {/* Route arc — completed portion solid, remaining dashed */}
          {/* Solid completed segment (fade-out style) */}
          <path
            d={arcPath}
            fill="none"
            stroke={accent}
            strokeOpacity={0.18}
            strokeWidth={5}
            strokeLinecap="round"
            filter="url(#track-blur)"
          />
          <path
            d={arcPath}
            fill="none"
            stroke={accent}
            strokeOpacity={0.30}
            strokeWidth={1.8}
            strokeDasharray="4 5"
          />
          {/* Solid completed portion using stroke-dasharray trick: not exact
              but approximates "filled to current pin" — we color the arc
              from origin to the current pin solidly, rest dashed. */}
          <path
            d={`M ${oP.x} ${oP.y} Q ${(oP.x + cP.x) / 2} ${cy} ${cP.x} ${cP.y}`}
            fill="none"
            stroke={accent}
            strokeOpacity={0.85}
            strokeWidth={1.8}
            strokeLinecap="round"
          />

          {/* Origin pin */}
          <g transform={`translate(${oP.x} ${oP.y})`}>
            <circle r={6} fill="rgba(26, 68, 128, 0.18)" />
            <circle r={2.4} fill="#1a4480" />
          </g>

          {/* Destination pin */}
          <g transform={`translate(${dP.x} ${dP.y})`}>
            <circle r={6} fill="rgba(26, 68, 128, 0.18)" />
            <circle
              r={2.4}
              fill="#fff"
              stroke="#1a4480"
              strokeWidth={1.4}
            />
          </g>

          {/* Current pin — large, glowing, pulsing */}
          {!isDelivered && (
            <g transform={`translate(${cP.x} ${cP.y})`}>
              <circle r={16} fill="url(#track-pin-glow)">
                <animate
                  attributeName="r"
                  values="14;20;14"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.9;0.35;0.9"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle r={5} fill={accent} />
              <circle r={2.2} fill="#fff" />
            </g>
          )}
          {isDelivered && (
            <g transform={`translate(${cP.x} ${cP.y})`}>
              <circle r={10} fill="rgba(46, 139, 87, 0.20)" />
              <circle r={5} fill="#2e8b57" />
              <circle r={2.2} fill="#fff" />
            </g>
          )}
        </svg>

        {/* Legend at the bottom of the map */}
        <div className="track-map-legend">
          <div className="track-map-leg">
            <span className="track-map-leg-dot" data-kind="origin" />
            <small>From</small>
            <strong>{origin.city}</strong>
          </div>
          <div className="track-map-leg track-map-leg-current">
            <span
              className="track-map-leg-dot"
              data-kind="current"
              style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
            />
            <small>{isDelivered ? "Delivered at" : "Now at"}</small>
            <strong>{currentLoc ?? origin.city}</strong>
          </div>
          <div className="track-map-leg">
            <span className="track-map-leg-dot" data-kind="dest" />
            <small>To</small>
            <strong>{destination.city}</strong>
          </div>
        </div>
      </div>

      {/* Bar: progress + ETA call-out */}
      <div className="track-map-meta">
        <div className="track-map-meta-bar">
          <div
            className="track-map-meta-fill"
            style={{
              width: `${Math.round(progressFraction * 100)}%`,
              background: accent,
            }}
          />
        </div>
        <div className="track-map-meta-row">
          <span className="track-map-meta-label">
            <Navigation size={12} strokeWidth={1.6} />
            Live position
          </span>
          <span className="track-map-meta-percent">
            {Math.round(progressFraction * 100)}% complete
          </span>
        </div>
      </div>

      {!c && (
        <div className="track-map-hint">
          <MapPin size={11} strokeWidth={1.6} />
          <span>
            Awaiting first scan — current location will appear here once the
            courier picks up.
          </span>
        </div>
      )}
    </div>
  );
}
