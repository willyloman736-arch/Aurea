"use client";

import { useState, useTransition } from "react";
import { AlertCircle, ChevronDown, Plus } from "lucide-react";
import { addTrackingEventAction } from "./actions";
import { STATUS_OPTIONS } from "@/lib/tracking-code";
import type { ShipmentStatus } from "@/lib/types";

const PRESET_TITLES: Record<ShipmentStatus, string> = {
  Pending: "Awaiting pickup",
  "Picked up": "Picked up by courier",
  "In Transit": "In transit",
  "Out for delivery": "Out for delivery",
  Delivered: "Delivered to recipient",
  Exception: "Exception — action required",
};

function nowIsoLocal(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function UpdateEventCard({
  shipmentId,
  currentStatus,
}: {
  shipmentId: string;
  currentStatus: ShipmentStatus;
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ShipmentStatus>(currentStatus);
  const [title, setTitle] = useState(PRESET_TITLES[currentStatus] ?? "");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState(nowIsoLocal());

  function pickStatus(s: ShipmentStatus) {
    setStatus(s);
    if (!title || Object.values(PRESET_TITLES).includes(title)) {
      setTitle(PRESET_TITLES[s] ?? "");
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const res = await addTrackingEventAction(fd);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setOpen(false);
      setLocation("");
      setTime(nowIsoLocal());
    });
  }

  return (
    <div className={`event-update ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="event-update-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="event-update-trigger-left">
          <Plus size={14} strokeWidth={1.6} />
          <span>Add tracking event</span>
        </span>
        <ChevronDown size={14} strokeWidth={1.6} className="event-update-chevron" />
      </button>

      {open && (
        <form onSubmit={onSubmit} className="event-update-form">
          <input type="hidden" name="shipmentId" value={shipmentId} />
          <input type="hidden" name="status" value={status} />

          <div className="ship-field">
            <label>New status</label>
            <div className="ship-segmented">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`ship-segment ${status === s ? "is-active" : ""}`}
                  onClick={() => pickStatus(s)}
                  disabled={pending}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="ship-field-grid-2">
            <div className="ship-field">
              <label htmlFor="event-title">Event title</label>
              <input
                id="event-title"
                name="title"
                type="text"
                className="ship-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Picked up by courier"
                required
                disabled={pending}
              />
            </div>
            <div className="ship-field">
              <label htmlFor="event-location">Location</label>
              <input
                id="event-location"
                name="location"
                type="text"
                className="ship-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Lagos, Nigeria"
                disabled={pending}
              />
            </div>
          </div>

          <div className="ship-field">
            <label htmlFor="event-time">Time</label>
            <input
              id="event-time"
              name="time"
              type="datetime-local"
              className="ship-input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={pending}
            />
          </div>

          {error && (
            <div className="dash-alert">
              <AlertCircle size={14} strokeWidth={1.5} />
              <span>{error}</span>
            </div>
          )}

          <div className="event-update-actions">
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary btn-sm" disabled={pending}>
              {pending ? "Saving…" : "Save event"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
