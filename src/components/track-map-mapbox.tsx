"use client";

import { useEffect, useRef } from "react";
import { Navigation } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import { lookupCityCoords } from "@/lib/city-coords";
import type { ShipmentStatus } from "@/lib/types";

interface Props {
  origin: { city: string };
  destination: { city: string };
  currentLoc?: string;
  status: ShipmentStatus;
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

export function TrackMapMapbox({
  origin,
  destination,
  currentLoc,
  status,
  progressFraction,
}: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const o = lookupCityCoords(origin.city);
  const d = lookupCityCoords(destination.city);
  const c = lookupCityCoords(currentLoc) ?? o;
  const accent = STATUS_COLOR[status];
  const isDelivered = status === "Delivered";

  // Stringify coords for stable primitive deps in useEffect
  const oKey = o ? `${o[0]},${o[1]}` : "";
  const dKey = d ? `${d[0]},${d[1]}` : "";
  const cKey = c ? `${c[0]},${c[1]}` : "";

  useEffect(() => {
    if (!token || !o || !d || !mapContainer.current) return;

    let cancelled = false;
    let map: import("mapbox-gl").Map | null = null;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      mapboxgl.accessToken = token;

      if (cancelled || !mapContainer.current) return;

      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(o);
      bounds.extend(d);
      if (c) bounds.extend(c);

      map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        bounds,
        fitBoundsOptions: { padding: { top: 80, bottom: 120, left: 80, right: 80 } },
        attributionControl: false,
        cooperativeGestures: true, // require ctrl+scroll to zoom (UX)
      });

      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
      map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");

      map.on("load", () => {
        if (!map || cancelled) return;

        // Route line — dashed, soft glow underneath
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [o, d],
            },
          },
        });

        // Glow underline
        map.addLayer({
          id: "route-glow",
          type: "line",
          source: "route",
          paint: {
            "line-color": accent,
            "line-width": 8,
            "line-opacity": 0.15,
            "line-blur": 3,
          },
        });

        // Crisp dashed top stroke
        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          paint: {
            "line-color": accent,
            "line-width": 2,
            "line-opacity": 0.85,
            "line-dasharray": [2, 2.5],
          },
        });

        // Origin marker — small navy filled
        const originEl = document.createElement("div");
        originEl.className = "mb-marker mb-marker-origin";
        originEl.innerHTML = `<div class="mb-marker-halo"></div><div class="mb-marker-dot mb-marker-dot-filled"></div>`;
        new mapboxgl.Marker({ element: originEl, anchor: "center" })
          .setLngLat(o)
          .setPopup(
            new mapboxgl.Popup({ offset: 14, closeButton: false }).setHTML(
              `<div class="mb-popup"><div class="mb-popup-label">From</div><div class="mb-popup-name">${escapeHtml(origin.city)}</div></div>`,
            ),
          )
          .addTo(map);

        // Destination marker — small white ringed
        const destEl = document.createElement("div");
        destEl.className = "mb-marker mb-marker-dest";
        destEl.innerHTML = `<div class="mb-marker-halo"></div><div class="mb-marker-dot mb-marker-dot-ringed"></div>`;
        new mapboxgl.Marker({ element: destEl, anchor: "center" })
          .setLngLat(d)
          .setPopup(
            new mapboxgl.Popup({ offset: 14, closeButton: false }).setHTML(
              `<div class="mb-popup"><div class="mb-popup-label">To</div><div class="mb-popup-name">${escapeHtml(destination.city)}</div></div>`,
            ),
          )
          .addTo(map);

        // Current location marker — large, pulsing, status-coloured
        if (c) {
          const currEl = document.createElement("div");
          currEl.className = "mb-marker mb-marker-current";
          currEl.style.setProperty("--mb-current-color", accent);
          currEl.innerHTML = `
            <div class="mb-marker-pulse"></div>
            <div class="mb-marker-pulse mb-marker-pulse-2"></div>
            <div class="mb-marker-core"></div>
          `;
          new mapboxgl.Marker({ element: currEl, anchor: "center" })
            .setLngLat(c)
            .setPopup(
              new mapboxgl.Popup({ offset: 18, closeButton: false }).setHTML(
                `<div class="mb-popup"><div class="mb-popup-label">${isDelivered ? "Delivered at" : "Now at"}</div><div class="mb-popup-name">${escapeHtml(currentLoc ?? origin.city)}</div></div>`,
              ),
            )
            .addTo(map);
        }
      });
    })();

    return () => {
      cancelled = true;
      if (map) {
        map.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    token,
    oKey,
    dKey,
    cKey,
    accent,
    isDelivered,
    origin.city,
    destination.city,
    currentLoc,
  ]);

  if (!token || !o || !d) return null;

  return (
    <div className="track-map">
      <div className="track-map-frame track-map-frame-mb">
        <div ref={mapContainer} className="track-map-mb-canvas" />

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
              style={{
                background: accent,
                boxShadow: `0 0 10px ${accent}`,
              }}
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
    </div>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
