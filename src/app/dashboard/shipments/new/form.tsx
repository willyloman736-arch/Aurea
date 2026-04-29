"use client";

import { useMemo, useState, useTransition } from "react";
import {
  AlertCircle,
  RotateCw,
  Package,
  ArrowRight,
  User,
  MapPin,
} from "lucide-react";
import { createShipmentAction } from "./actions";
import { generateTrackingCode, STATUS_OPTIONS } from "@/lib/tracking-code";
import type { ShipmentStatus } from "@/lib/types";

interface FormState {
  trackingCode: string;
  packageDescription: string;
  weight: string;
  pieces: string;
  dimensions: string;
  declaredValue: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderCity: string;
  senderAddr: string;
  receiverName: string;
  receiverEmail: string;
  receiverPhone: string;
  receiverCity: string;
  receiverAddr: string;
  status: ShipmentStatus;
  dispatchLocation: string;
  etaDate: string;
  internalNotes: string;
}

const INITIAL: Omit<FormState, "trackingCode"> = {
  packageDescription: "",
  weight: "",
  pieces: "1",
  dimensions: "",
  declaredValue: "",
  senderName: "",
  senderEmail: "",
  senderPhone: "",
  senderCity: "",
  senderAddr: "",
  receiverName: "",
  receiverEmail: "",
  receiverPhone: "",
  receiverCity: "",
  receiverAddr: "",
  status: "Pending",
  dispatchLocation: "",
  etaDate: "",
  internalNotes: "",
};

export function NewShipmentForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [state, setState] = useState<FormState>(() => ({
    trackingCode: generateTrackingCode(),
    ...INITIAL,
  }));

  const set =
    <K extends keyof FormState>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setState((s) => ({ ...s, [key]: e.target.value as FormState[K] }));
    };

  const regenerate = () => {
    setState((s) => ({ ...s, trackingCode: generateTrackingCode() }));
  };

  const requiredOk = useMemo(
    () =>
      state.trackingCode.trim().length > 0 &&
      state.senderName.trim().length > 0 &&
      state.senderCity.trim().length > 0 &&
      state.receiverName.trim().length > 0 &&
      state.receiverCity.trim().length > 0,
    [state],
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!requiredOk) {
      setError("Please fill in all required fields.");
      return;
    }
    const formData = new FormData(e.currentTarget);
    start(async () => {
      const result = await createShipmentAction(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={onSubmit} className="ship-form">
      <div className="ship-form-grid">
        <div className="ship-form-main">
          {/* SHIPMENT */}
          <section className="ship-section">
            <header className="ship-section-head">
              <div>
                <span className="eyebrow-inline">Shipment</span>
                <h3 className="ship-section-title">
                  Package <em>details</em>
                </h3>
              </div>
            </header>

            <div className="ship-field">
              <label htmlFor="trackingCode">
                Tracking number <span className="ship-required">*</span>
              </label>
              <div className="ship-field-row">
                <input
                  id="trackingCode"
                  name="trackingCode"
                  type="text"
                  required
                  value={state.trackingCode}
                  onChange={set("trackingCode")}
                  className="ship-input ship-input-mono"
                  spellCheck={false}
                  autoComplete="off"
                  disabled={pending}
                />
                <button
                  type="button"
                  className="ship-btn-icon"
                  onClick={regenerate}
                  disabled={pending}
                  title="Regenerate tracking number"
                  aria-label="Regenerate tracking number"
                >
                  <RotateCw size={14} strokeWidth={1.6} />
                </button>
              </div>
              <small>
                Auto-generated. You can edit it if you need to match an external
                system.
              </small>
            </div>

            <div className="ship-field">
              <label htmlFor="packageDescription">Package description</label>
              <textarea
                id="packageDescription"
                name="packageDescription"
                rows={2}
                value={state.packageDescription}
                onChange={set("packageDescription")}
                className="ship-input"
                placeholder="e.g. Two cartons of dry goods, no fragile items"
                disabled={pending}
              />
            </div>

            <div className="ship-field-grid-3">
              <div className="ship-field">
                <label htmlFor="weight">Weight</label>
                <input
                  id="weight"
                  name="weight"
                  type="text"
                  value={state.weight}
                  onChange={set("weight")}
                  className="ship-input"
                  placeholder="e.g. 4.2 kg"
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
                  value={state.pieces}
                  onChange={set("pieces")}
                  className="ship-input"
                  disabled={pending}
                />
              </div>
              <div className="ship-field">
                <label htmlFor="dimensions">Dimensions</label>
                <input
                  id="dimensions"
                  name="dimensions"
                  type="text"
                  value={state.dimensions}
                  onChange={set("dimensions")}
                  className="ship-input"
                  placeholder="e.g. 30 × 20 × 15 cm"
                  disabled={pending}
                />
              </div>
            </div>

            <div className="ship-field">
              <label htmlFor="declaredValue">Declared value</label>
              <input
                id="declaredValue"
                name="declaredValue"
                type="text"
                value={state.declaredValue}
                onChange={set("declaredValue")}
                className="ship-input"
                placeholder="e.g. $250"
                disabled={pending}
              />
            </div>
          </section>

          {/* SENDER */}
          <section className="ship-section">
            <header className="ship-section-head">
              <div>
                <span className="eyebrow-inline">Sender</span>
                <h3 className="ship-section-title">
                  Who&rsquo;s <em>sending</em> it
                </h3>
              </div>
            </header>

            <div className="ship-field-grid-2">
              <div className="ship-field">
                <label htmlFor="senderName">
                  Name <span className="ship-required">*</span>
                </label>
                <input
                  id="senderName"
                  name="senderName"
                  type="text"
                  required
                  value={state.senderName}
                  onChange={set("senderName")}
                  className="ship-input"
                  placeholder="Full name or business"
                  autoComplete="name"
                  disabled={pending}
                />
              </div>
              <div className="ship-field">
                <label htmlFor="senderPhone">Phone</label>
                <input
                  id="senderPhone"
                  name="senderPhone"
                  type="tel"
                  value={state.senderPhone}
                  onChange={set("senderPhone")}
                  className="ship-input"
                  placeholder="+1 555 123 4567"
                  autoComplete="tel"
                  disabled={pending}
                />
              </div>
            </div>

            <div className="ship-field">
              <label htmlFor="senderEmail">Email</label>
              <input
                id="senderEmail"
                name="senderEmail"
                type="email"
                value={state.senderEmail}
                onChange={set("senderEmail")}
                className="ship-input"
                placeholder="name@company.com"
                autoComplete="email"
                disabled={pending}
              />
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
                  value={state.senderCity}
                  onChange={set("senderCity")}
                  className="ship-input"
                  placeholder="e.g. Lagos, NG"
                  disabled={pending}
                />
              </div>
              <div className="ship-field">
                <label htmlFor="senderAddr">Street address</label>
                <input
                  id="senderAddr"
                  name="senderAddr"
                  type="text"
                  value={state.senderAddr}
                  onChange={set("senderAddr")}
                  className="ship-input"
                  placeholder="Building, street, postal code"
                  autoComplete="street-address"
                  disabled={pending}
                />
              </div>
            </div>
          </section>

          {/* RECIPIENT */}
          <section className="ship-section">
            <header className="ship-section-head">
              <div>
                <span className="eyebrow-inline">Recipient</span>
                <h3 className="ship-section-title">
                  Who&rsquo;s <em>receiving</em> it
                </h3>
              </div>
            </header>

            <div className="ship-field-grid-2">
              <div className="ship-field">
                <label htmlFor="receiverName">
                  Name <span className="ship-required">*</span>
                </label>
                <input
                  id="receiverName"
                  name="receiverName"
                  type="text"
                  required
                  value={state.receiverName}
                  onChange={set("receiverName")}
                  className="ship-input"
                  placeholder="Full name or business"
                  disabled={pending}
                />
              </div>
              <div className="ship-field">
                <label htmlFor="receiverPhone">Phone</label>
                <input
                  id="receiverPhone"
                  name="receiverPhone"
                  type="tel"
                  value={state.receiverPhone}
                  onChange={set("receiverPhone")}
                  className="ship-input"
                  placeholder="+1 555 987 6543"
                  disabled={pending}
                />
              </div>
            </div>

            <div className="ship-field">
              <label htmlFor="receiverEmail">Email</label>
              <input
                id="receiverEmail"
                name="receiverEmail"
                type="email"
                value={state.receiverEmail}
                onChange={set("receiverEmail")}
                className="ship-input"
                placeholder="name@company.com"
                disabled={pending}
              />
            </div>

            <div className="ship-field-grid-2">
              <div className="ship-field">
                <label htmlFor="receiverCity">
                  City <span className="ship-required">*</span>
                </label>
                <input
                  id="receiverCity"
                  name="receiverCity"
                  type="text"
                  required
                  value={state.receiverCity}
                  onChange={set("receiverCity")}
                  className="ship-input"
                  placeholder="e.g. Berlin, DE"
                  disabled={pending}
                />
              </div>
              <div className="ship-field">
                <label htmlFor="receiverAddr">Street address</label>
                <input
                  id="receiverAddr"
                  name="receiverAddr"
                  type="text"
                  value={state.receiverAddr}
                  onChange={set("receiverAddr")}
                  className="ship-input"
                  placeholder="Building, street, postal code"
                  disabled={pending}
                />
              </div>
            </div>
          </section>

          {/* STATUS */}
          <section className="ship-section">
            <header className="ship-section-head">
              <div>
                <span className="eyebrow-inline">Status &amp; timing</span>
                <h3 className="ship-section-title">
                  Where it is <em>now</em>
                </h3>
              </div>
            </header>

            <div className="ship-field">
              <label>Initial status</label>
              <div className="ship-segmented">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`ship-segment ${state.status === s ? "is-active" : ""}`}
                    onClick={() => setState((p) => ({ ...p, status: s }))}
                    disabled={pending}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <input type="hidden" name="status" value={state.status} />
            </div>

            <div className="ship-field-grid-2">
              <div className="ship-field">
                <label htmlFor="dispatchLocation">Dispatch location</label>
                <input
                  id="dispatchLocation"
                  name="dispatchLocation"
                  type="text"
                  value={state.dispatchLocation}
                  onChange={set("dispatchLocation")}
                  className="ship-input"
                  placeholder="e.g. Warehouse A, Lagos"
                  disabled={pending}
                />
              </div>
              <div className="ship-field">
                <label htmlFor="etaDate">Estimated delivery</label>
                <input
                  id="etaDate"
                  name="etaDate"
                  type="date"
                  value={state.etaDate}
                  onChange={set("etaDate")}
                  className="ship-input"
                  disabled={pending}
                />
              </div>
            </div>

            <div className="ship-field">
              <label htmlFor="internalNotes">Internal notes</label>
              <textarea
                id="internalNotes"
                name="internalNotes"
                rows={2}
                value={state.internalNotes}
                onChange={set("internalNotes")}
                className="ship-input"
                placeholder="Visible only to your ops team"
                disabled={pending}
              />
            </div>
          </section>

          {error && (
            <div className="dash-alert">
              <AlertCircle size={14} strokeWidth={1.5} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* SUMMARY — sticky on desktop */}
        <aside className="ship-summary">
          <div className="ship-summary-card">
            <div className="ship-summary-eyebrow">
              <Package size={12} strokeWidth={1.6} />
              <span>Live preview</span>
            </div>

            <div className="ship-summary-code-label">Tracking code</div>
            <div className="ship-summary-code">{state.trackingCode || "—"}</div>

            <div className="ship-summary-route">
              <div className="ship-summary-route-row">
                <User size={11} strokeWidth={1.6} />
                <span className="ship-summary-route-name">
                  {state.senderName || "Sender"}
                </span>
              </div>
              <div className="ship-summary-route-city">
                <MapPin size={10} strokeWidth={1.6} />
                {state.senderCity || "—"}
              </div>

              <div className="ship-summary-arrow">
                <ArrowRight size={14} strokeWidth={1.4} />
              </div>

              <div className="ship-summary-route-row">
                <User size={11} strokeWidth={1.6} />
                <span className="ship-summary-route-name">
                  {state.receiverName || "Recipient"}
                </span>
              </div>
              <div className="ship-summary-route-city">
                <MapPin size={10} strokeWidth={1.6} />
                {state.receiverCity || "—"}
              </div>
            </div>

            <div className="ship-summary-grid">
              <div>
                <small>Status</small>
                <strong>{state.status}</strong>
              </div>
              <div>
                <small>ETA</small>
                <strong>{state.etaDate || "—"}</strong>
              </div>
              <div>
                <small>Pieces</small>
                <strong>{state.pieces || "—"}</strong>
              </div>
              <div>
                <small>Weight</small>
                <strong>{state.weight || "—"}</strong>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary ship-summary-submit"
              disabled={pending || !requiredOk}
            >
              {pending ? "Creating shipment…" : "Create shipment"}
            </button>
            {!requiredOk && (
              <p className="ship-summary-hint">
                Fill in tracking code, sender, and recipient to continue.
              </p>
            )}
          </div>
        </aside>
      </div>
    </form>
  );
}
