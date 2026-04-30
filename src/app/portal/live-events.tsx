"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import {
  HUBS,
  SHIPMENTS,
  EVENT_TEMPLATES,
  type PortalEvent,
} from "./portal-data";

function formatTime(d: Date): string {
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

const STATUS_DOT_COLOR: Record<PortalEvent["status"], string> = {
  "Picked up": "#4682bc",
  "In Transit": "#1a4480",
  "Out for delivery": "#2079d5",
  "On hold": "#6b7280",
  Delivered: "#2e8b57",
  Exception: "#d52b1e",
};

const SEED: PortalEvent[] = [
  {
    id: "e0",
    trackingCode: "AUR-K7M9Q3P",
    title: "Departed origin hub",
    city: "Lagos",
    time: "14:08",
    status: "In Transit",
  },
  {
    id: "e1",
    trackingCode: "AUR-J2X8R4N",
    title: "Out for delivery",
    city: "Tokyo",
    time: "14:02",
    status: "Out for delivery",
  },
  {
    id: "e2",
    trackingCode: "AUR-G4K7P2J",
    title: "Geo-verified handoff",
    city: "London",
    time: "13:54",
    status: "Delivered",
  },
  {
    id: "e3",
    trackingCode: "AUR-W3F6L8H",
    title: "Customs cleared",
    city: "Hong Kong",
    time: "13:41",
    status: "In Transit",
  },
];

export function LiveEvents() {
  const [events, setEvents] = useState<PortalEvent[]>(SEED);

  useEffect(() => {
    let counter = 100;
    const tick = () => {
      const ship = SHIPMENTS[Math.floor(Math.random() * SHIPMENTS.length)];
      const template =
        EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
      const hub = HUBS.find(
        (h) => h.id === (Math.random() > 0.5 ? ship.fromHub : ship.toHub),
      );
      if (!hub) return;
      const ev: PortalEvent = {
        id: `e${counter++}`,
        trackingCode: ship.trackingCode,
        title: template.title,
        city: hub.city,
        time: formatTime(new Date()),
        status: template.status,
      };
      setEvents((prev) => [ev, ...prev].slice(0, 8));
    };

    const id = setInterval(tick, 5200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="live-events">
      <div className="live-events-head">
        <span className="live-events-eyebrow">Live events</span>
        <span className="live-events-pulse" aria-hidden="true">
          <span />
        </span>
      </div>
      <ol className="live-events-list">
        {events.map((ev) => (
          <li key={ev.id} className="live-event">
            <span
              className="live-event-dot"
              style={{ background: STATUS_DOT_COLOR[ev.status] }}
            />
            <div className="live-event-body">
              <div className="live-event-title">{ev.title}</div>
              <div className="live-event-meta">
                <span className="live-event-code">{ev.trackingCode}</span>
                <span className="live-event-loc">
                  <MapPin size={9} strokeWidth={1.6} />
                  {ev.city}
                </span>
              </div>
            </div>
            <time className="live-event-time">{ev.time}</time>
          </li>
        ))}
      </ol>
    </div>
  );
}
