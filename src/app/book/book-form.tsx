"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Calendar,
  Package,
} from "lucide-react";
import { submitBookingAction, type BookingResult } from "./actions";

const TIME_WINDOWS = [
  { id: "morning", label: "Morning · 8am–12pm" },
  { id: "afternoon", label: "Afternoon · 12pm–4pm" },
  { id: "evening", label: "Evening · 4pm–8pm" },
];

function todayIsoDate(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function maxIsoDate(daysAhead = 90): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().slice(0, 10);
}

export function BookForm() {
  const params = useSearchParams();
  const [pending, start] = useTransition();
  const [result, setResult] = useState<BookingResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Prefill from /quote query string when present
  const [senderCity, setSenderCity] = useState(params.get("from") ?? "");
  const [receiverCity, setReceiverCity] = useState(params.get("to") ?? "");
  const [weight, setWeight] = useState(params.get("weight") ?? "");
  const [pieces, setPieces] = useState(params.get("pieces") ?? "1");
  const service = params.get("service") ?? "express";
  const [pickupDate, setPickupDate] = useState(todayIsoDate());
  const [pickupWindow, setPickupWindow] = useState("morning");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const res = await submitBookingAction(fd);
      setResult(res);
      if (res.ok) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  function copyReference() {
    if (result?.reference) {
      navigator.clipboard.writeText(result.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  if (result?.ok && result.reference) {
    return (
      <div className="confirm-card">
        <div className="confirm-icon">
          <CheckCircle2 size={20} strokeWidth={1.5} />
        </div>
        <h2 className="confirm-title">
          Pickup <em>booked.</em>
        </h2>
        <p className="confirm-sub">
          A regional ops lead has the request. We&rsquo;ll email confirmation and
          your tracking code within the hour, weekdays.
        </p>

        <div className="confirm-ref">
          <div className="confirm-ref-label">Booking reference</div>
          <div className="confirm-ref-row">
            <span className="confirm-ref-code">{result.reference}</span>
            <button
              type="button"
              className="ship-btn-icon"
              onClick={copyReference}
              aria-label="Copy reference"
            >
              <Copy size={13} strokeWidth={1.6} />
            </button>
          </div>
          {copied && <div className="confirm-ref-copied">Copied</div>}
        </div>

        <div className="confirm-next">
          <h4>What happens next</h4>
          <ol>
            <li>
              You&rsquo;ll get a confirmation email with the assigned tracking
              code.
            </li>
            <li>
              The driver arrives within your booked window. They scan the cargo
              into custody at pickup.
            </li>
            <li>
              You and your recipient see live status at{" "}
              <code>/track/&#123;tracking-code&#125;</code>.
            </li>
          </ol>
        </div>

        <div className="confirm-actions">
          <Link href="/" className="btn-ghost">
            Back to home
          </Link>
          <Link href="/contact" className="btn-primary" data-magnetic>
            Talk to ops
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="ship-form">
      <div className="ship-form-grid">
        <div className="ship-form-main">
          {/* PICKUP TIME */}
          <section className="ship-section">
            <header className="ship-section-head">
              <div>
                <span className="eyebrow-inline">Pickup</span>
                <h3 className="ship-section-title">
                  When we&rsquo;re <em>collecting.</em>
                </h3>
              </div>
            </header>

            <div className="ship-field-grid-2">
              <div className="ship-field">
                <label htmlFor="pickupDate">Pickup date</label>
                <input
                  id="pickupDate"
                  name="pickupDate"
                  type="date"
                  required
                  min={todayIsoDate()}
                  max={maxIsoDate(90)}
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="ship-input"
                  disabled={pending}
                />
              </div>
              <div className="ship-field">
                <label htmlFor="pickupWindow">Time window</label>
                <select
                  id="pickupWindow"
                  name="pickupWindow"
                  value={pickupWindow}
                  onChange={(e) => setPickupWindow(e.target.value)}
                  className="ship-input"
                  disabled={pending}
                >
                  {TIME_WINDOWS.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* SENDER */}
          <section className="ship-section">
            <header className="ship-section-head">
              <div>
                <span className="eyebrow-inline">Sender</span>
                <h3 className="ship-section-title">
                  Where we&rsquo;re <em>picking up.</em>
                </h3>
              </div>
            </header>

            <div className="ship-field-grid-2">
              <div className="ship-field">
                <label htmlFor="senderName">
                  Your name <span className="ship-required">*</span>
                </label>
                <input
                  id="senderName"
                  name="senderName"
                  type="text"
                  required
                  className="ship-input"
                  placeholder="Full name or business"
                  autoComplete="name"
                  disabled={pending}
                />
              </div>
              <div className="ship-field">
                <label htmlFor="senderEmail">
                  Email <span className="ship-required">*</span>
                </label>
                <input
                  id="senderEmail"
                  name="senderEmail"
                  type="email"
                  required
                  className="ship-input"
                  placeholder="name@company.com"
                  autoComplete="email"
                  disabled={pending}
                />
              </div>
            </div>

            <div className="ship-field-grid-2">
              <div className="ship-field">
                <label htmlFor="senderCity">
                  City <span className="ship-required">*</span>
                </label>
                <input
                  id="senderCity"
                  name="senderCity"
                  type="text"
                  required
                  value={senderCity}
                  onChange={(e) => setSenderCity(e.target.value)}
                  className="ship-input"
                  placeholder="e.g. Lagos, NG"
                  disabled={pending}
                />
              </div>
              <div className="ship-field">
                <label htmlFor="senderPhone">Phone</label>
                <input
                  id="senderPhone"
                  name="senderPhone"
                  type="tel"
                  className="ship-input"
                  placeholder="+1 555 123 4567"
                  autoComplete="tel"
                  disabled={pending}
                />
              </div>
            </div>

            <div className="ship-field">
              <label htmlFor="senderAddr">Pickup address</label>
              <input
                id="senderAddr"
                name="senderAddr"
                type="text"
                className="ship-input"
                placeholder="Building, street, postal code"
                autoComplete="street-address"
                disabled={pending}
              />
            </div>
          </section>

          {/* RECIPIENT */}
          <section className="ship-section">
            <header className="ship-section-head">
              <div>
                <span className="eyebrow-inline">Recipient</span>
                <h3 className="ship-section-title">
                  Where it&rsquo;s <em>going.</em>
                </h3>
              </div>
            </header>

            <div className="ship-field-grid-2">
              <div className="ship-field">
                <label htmlFor="receiverName">
                  Recipient name <span className="ship-required">*</span>
                </label>
                <input
                  id="receiverName"
                  name="receiverName"
                  type="text"
                  required
                  className="ship-input"
                  placeholder="Full name or business"
                  disabled={pending}
                />
              </div>
              <div className="ship-field">
                <label htmlFor="receiverCity">
                  City <span className="ship-required">*</span>
                </label>
                <input
                  id="receiverCity"
                  name="receiverCity"
                  type="text"
                  required
                  value={receiverCity}
                  onChange={(e) => setReceiverCity(e.target.value)}
                  className="ship-input"
                  placeholder="e.g. Berlin, DE"
                  disabled={pending}
                />
              </div>
            </div>

            <div className="ship-field">
              <label htmlFor="receiverAddr">Delivery address</label>
              <input
                id="receiverAddr"
                name="receiverAddr"
                type="text"
                className="ship-input"
                placeholder="Building, street, postal code"
                disabled={pending}
              />
            </div>
          </section>

          {/* CARGO */}
          <section className="ship-section">
            <header className="ship-section-head">
              <div>
                <span className="eyebrow-inline">Cargo</span>
                <h3 className="ship-section-title">
                  What we&rsquo;re <em>moving.</em>
                </h3>
              </div>
            </header>

            <div className="ship-field">
              <label htmlFor="description">
                Description <span className="ship-required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={2}
                required
                className="ship-input"
                placeholder="e.g. Two cartons of dry goods, no fragile items"
                disabled={pending}
              />
            </div>

            <div className="ship-field-grid-3">
              <div className="ship-field">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="ship-input"
                  disabled={pending}
                />
              </div>
              <div className="ship-field">
                <label htmlFor="pieces">Pieces</label>
                <input
                  id="pieces"
                  name="pieces"
                  type="number"
                  min={1}
                  value={pieces}
                  onChange={(e) => setPieces(e.target.value)}
                  className="ship-input"
                  disabled={pending}
                />
              </div>
              <div className="ship-field">
                <label htmlFor="declaredValue">Declared value</label>
                <input
                  id="declaredValue"
                  name="declaredValue"
                  type="text"
                  className="ship-input"
                  placeholder="$250"
                  disabled={pending}
                />
              </div>
            </div>
          </section>

          {result?.error && (
            <div className="dash-alert">
              <AlertCircle size={14} strokeWidth={1.5} />
              <span>{result.error}</span>
            </div>
          )}

          <input type="hidden" name="service" value={service} />
        </div>

        {/* SUMMARY */}
        <aside className="ship-summary">
          <div className="ship-summary-card">
            <div className="ship-summary-eyebrow">
              <Calendar size={12} strokeWidth={1.6} />
              <span>Booking summary</span>
            </div>

            <div className="ship-summary-code-label">Pickup</div>
            <div className="ship-summary-code" style={{ fontSize: 16 }}>
              {pickupDate}
              <br />
              <span style={{ fontSize: 12, color: "var(--text-3)", letterSpacing: 0.04 }}>
                {TIME_WINDOWS.find((w) => w.id === pickupWindow)?.label}
              </span>
            </div>

            <div className="ship-summary-grid">
              <div>
                <small>From</small>
                <strong>{senderCity || "—"}</strong>
              </div>
              <div>
                <small>To</small>
                <strong>{receiverCity || "—"}</strong>
              </div>
              <div>
                <small>Weight</small>
                <strong>{weight ? `${weight} kg` : "—"}</strong>
              </div>
              <div>
                <small>Pieces</small>
                <strong>{pieces || "—"}</strong>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary ship-summary-submit"
              disabled={pending}
              data-magnetic
            >
              <Package size={13} strokeWidth={1.6} />
              {pending ? "Booking…" : "Book pickup"}
            </button>
            <p className="ship-summary-hint">
              We&rsquo;ll email confirmation within an hour.
            </p>
          </div>
        </aside>
      </div>
    </form>
  );
}
