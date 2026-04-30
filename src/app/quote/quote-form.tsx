"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Package, Clock, Sparkles } from "lucide-react";
import {
  CITIES,
  SERVICES,
  calculateRate,
  type ServiceTier,
} from "@/lib/rate-calculator";

export function QuoteForm() {
  const [originName, setOriginName] = useState("Lagos");
  const [destName, setDestName] = useState("Berlin");
  const [weight, setWeight] = useState("3");
  const [pieces, setPieces] = useState("1");
  const [service, setService] = useState<ServiceTier>("express");
  const [declaredValue, setDeclaredValue] = useState("");

  const origin = CITIES.find((c) => c.name === originName)!;
  const dest = CITIES.find((c) => c.name === destName)!;

  const result = useMemo(() => {
    const w = Math.max(0.1, parseFloat(weight) || 0);
    const p = Math.max(1, parseInt(pieces, 10) || 1);
    return calculateRate({ origin, dest, weightKg: w, pieces: p, service });
  }, [origin, dest, weight, pieces, service]);

  const sameDayUnavailable = service === "sameDay" && result.zone !== 1;

  const bookHref =
    `/book?from=${encodeURIComponent(originName)}` +
    `&to=${encodeURIComponent(destName)}` +
    `&weight=${encodeURIComponent(weight)}` +
    `&pieces=${encodeURIComponent(pieces)}` +
    `&service=${encodeURIComponent(service)}` +
    `&total=${result.total.toFixed(2)}` +
    `&base=${result.base.toFixed(2)}` +
    `&weightFee=${result.weight.toFixed(2)}` +
    `&serviceFee=${result.service.toFixed(2)}` +
    `&etaMin=${result.etaMin}` +
    `&etaMax=${result.etaMax}` +
    `&zoneLabel=${encodeURIComponent(result.zoneLabel)}`;

  return (
    <div className="ship-form">
      <div className="ship-form-grid">
        <div className="ship-form-main">
          {/* ROUTE */}
          <section className="ship-section">
            <header className="ship-section-head">
              <div>
                <span className="eyebrow-inline">Route</span>
                <h3 className="ship-section-title">
                  Where it&rsquo;s <em>going.</em>
                </h3>
              </div>
            </header>

            <div className="ship-field-grid-2">
              <div className="ship-field">
                <label htmlFor="origin">From</label>
                <select
                  id="origin"
                  value={originName}
                  onChange={(e) => setOriginName(e.target.value)}
                  className="ship-input"
                >
                  {CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}, {c.country}
                    </option>
                  ))}
                </select>
              </div>
              <div className="ship-field">
                <label htmlFor="dest">To</label>
                <select
                  id="dest"
                  value={destName}
                  onChange={(e) => setDestName(e.target.value)}
                  className="ship-input"
                >
                  {CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}, {c.country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* CARGO */}
          <section className="ship-section">
            <header className="ship-section-head">
              <div>
                <span className="eyebrow-inline">Cargo</span>
                <h3 className="ship-section-title">
                  What you&rsquo;re <em>moving.</em>
                </h3>
              </div>
            </header>

            <div className="ship-field-grid-3">
              <div className="ship-field">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  id="weight"
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="ship-input"
                />
              </div>
              <div className="ship-field">
                <label htmlFor="pieces">Pieces</label>
                <input
                  id="pieces"
                  type="number"
                  min={1}
                  value={pieces}
                  onChange={(e) => setPieces(e.target.value)}
                  className="ship-input"
                />
              </div>
              <div className="ship-field">
                <label htmlFor="value">Declared value</label>
                <input
                  id="value"
                  type="text"
                  placeholder="$250"
                  value={declaredValue}
                  onChange={(e) => setDeclaredValue(e.target.value)}
                  className="ship-input"
                />
              </div>
            </div>
          </section>

          {/* SERVICE */}
          <section className="ship-section">
            <header className="ship-section-head">
              <div>
                <span className="eyebrow-inline">Service</span>
                <h3 className="ship-section-title">
                  How <em>fast.</em>
                </h3>
              </div>
            </header>

            <div className="quote-service-grid">
              {SERVICES.map((s) => {
                const active = service === s.id;
                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setService(s.id)}
                    className={`quote-service-card ${active ? "is-active" : ""}`}
                  >
                    <div className="quote-service-head">
                      <span className="quote-service-name">{s.label}</span>
                      {active && (
                        <span className="quote-service-dot" aria-hidden="true" />
                      )}
                    </div>
                    <p className="quote-service-desc">{s.description}</p>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* RESULT — sticky live quote */}
        <aside className="ship-summary">
          <div className="ship-summary-card quote-result">
            <div className="ship-summary-eyebrow">
              <Sparkles size={12} strokeWidth={1.6} />
              <span>Live quote</span>
            </div>

            {sameDayUnavailable ? (
              <div className="quote-result-empty">
                <p>
                  Same-day is only available within a single region. Try{" "}
                  <button
                    type="button"
                    className="quote-link"
                    onClick={() => setService("express")}
                  >
                    Express
                  </button>{" "}
                  for cross-region cargo.
                </p>
              </div>
            ) : (
              <>
                <div className="quote-price">
                  <span className="quote-price-currency">$</span>
                  <span className="quote-price-amount">
                    {result.total.toFixed(2)}
                  </span>
                </div>
                <div className="quote-price-sub">
                  Estimate · {result.zoneLabel}
                </div>

                <div className="quote-route">
                  <div className="quote-route-row">
                    <MapPin size={11} strokeWidth={1.6} />
                    <span>
                      {origin.name}, {origin.country}
                    </span>
                  </div>
                  <div className="quote-route-arrow">
                    <ArrowRight size={14} strokeWidth={1.4} />
                  </div>
                  <div className="quote-route-row">
                    <MapPin size={11} strokeWidth={1.6} />
                    <span>
                      {dest.name}, {dest.country}
                    </span>
                  </div>
                </div>

                <div className="quote-eta">
                  <Clock size={12} strokeWidth={1.6} />
                  <span>
                    {result.etaMin === 0
                      ? "Same day"
                      : result.etaMin === result.etaMax
                        ? `${result.etaMin} business day${result.etaMin === 1 ? "" : "s"}`
                        : `${result.etaMin}–${result.etaMax} business days`}
                  </span>
                </div>

                <div className="quote-breakdown">
                  <div className="quote-breakdown-row">
                    <span>Base ({result.zoneLabel.toLowerCase()})</span>
                    <span>${result.base.toFixed(2)}</span>
                  </div>
                  <div className="quote-breakdown-row">
                    <span>
                      Weight · {weight}kg
                      {parseInt(pieces, 10) > 1 && ` × ${pieces}`}
                    </span>
                    <span>${result.weight.toFixed(2)}</span>
                  </div>
                  {result.service !== 0 && (
                    <div className="quote-breakdown-row">
                      <span>
                        Service ·{" "}
                        {SERVICES.find((s) => s.id === service)!.label}
                      </span>
                      <span>
                        {result.service > 0 ? "+" : ""}
                        ${result.service.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="quote-breakdown-row quote-breakdown-total">
                    <span>Total</span>
                    <span>${result.total.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href={bookHref}
                  className="btn-primary ship-summary-submit"
                  data-magnetic
                >
                  <Package size={13} strokeWidth={1.6} />
                  Book this shipment
                </Link>
                <p className="ship-summary-hint">
                  Indicative rate. Final price confirmed at booking.
                </p>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
