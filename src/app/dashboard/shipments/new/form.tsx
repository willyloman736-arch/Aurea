"use client";

import { useState, useTransition } from "react";
import { AlertCircle } from "lucide-react";
import { createShipmentAction } from "./actions";

const CARRIERS = [
  { value: "", label: "Auto-detect (recommended)" },
  { value: "FedEx", label: "FedEx" },
  { value: "UPS", label: "UPS" },
  { value: "USPS", label: "USPS" },
  { value: "DHLExpress", label: "DHL Express" },
  { value: "Canpar", label: "Canpar" },
  { value: "OnTrac", label: "OnTrac" },
];

export function NewShipmentForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    start(async () => {
      const result = await createShipmentAction(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={onSubmit} className="dash-form">
      <div className="dash-field">
        <label htmlFor="trackingCode">Tracking number</label>
        <input
          id="trackingCode"
          name="trackingCode"
          type="text"
          required
          autoFocus
          spellCheck={false}
          autoComplete="off"
          placeholder="e.g. 1Z999AA10123456784 or EZ1000000001"
          className="dash-input"
          disabled={pending}
        />
        <small>
          Works with FedEx, UPS, USPS, DHL, and most international carriers. Use
          <code> EZ1000000001</code> in test mode to simulate a delivered shipment.
        </small>
      </div>

      <div className="dash-field">
        <label htmlFor="carrier">Carrier (optional)</label>
        <select id="carrier" name="carrier" className="dash-input" disabled={pending}>
          {CARRIERS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <small>Leave on auto-detect unless the number is ambiguous.</small>
      </div>

      {error && (
        <div className="dash-alert">
          <AlertCircle size={14} strokeWidth={1.5} />
          <span>{error}</span>
        </div>
      )}

      <div className="dash-form-actions">
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? "Creating tracker…" : "Create tracker"}
        </button>
      </div>
    </form>
  );
}
