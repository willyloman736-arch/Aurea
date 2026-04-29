"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  ShieldCheck,
} from "lucide-react";
import { submitClaimAction, type ClaimResult } from "./actions";

const CLAIM_TYPES = [
  { id: "damaged", label: "Damaged", desc: "Cargo arrived but damaged" },
  { id: "lost", label: "Lost", desc: "Cargo never arrived" },
  { id: "delayed", label: "Delayed", desc: "Time-sensitive cargo arrived late" },
  { id: "incomplete", label: "Incomplete", desc: "Some pieces missing" },
];

export function ClaimForm() {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<ClaimResult | null>(null);
  const [claimType, setClaimType] = useState("damaged");
  const [copied, setCopied] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const res = await submitClaimAction(fd);
      setResult(res);
      if (res.ok) window.scrollTo({ top: 0, behavior: "smooth" });
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
          Claim <em>filed.</em>
        </h2>
        <p className="confirm-sub">
          A claims lead has it. We acknowledge inside twenty-four hours and
          decide most claims inside forty-eight.
        </p>

        <div className="confirm-ref">
          <div className="confirm-ref-label">Claim reference</div>
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
              A claims lead reviews the case and may email you for additional
              photos or context.
            </li>
            <li>
              For approved claims, payment lands in your account within five
              business days.
            </li>
            <li>
              We don&rsquo;t use third-party adjusters under twenty thousand US
              dollars — a real ops lead reads your email.
            </li>
          </ol>
        </div>

        <div className="confirm-actions">
          <Link href="/" className="btn-ghost">
            Back to home
          </Link>
          <Link href="/insurance" className="btn-primary" data-magnetic>
            Read the cover
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="ship-form">
      <div className="ship-form-grid">
        <div className="ship-form-main">
          <section className="ship-section">
            <header className="ship-section-head">
              <div>
                <span className="eyebrow-inline">Shipment</span>
                <h3 className="ship-section-title">
                  Which <em>shipment.</em>
                </h3>
              </div>
            </header>

            <div className="ship-field">
              <label htmlFor="trackingCode">
                Tracking code <span className="ship-required">*</span>
              </label>
              <input
                id="trackingCode"
                name="trackingCode"
                type="text"
                required
                spellCheck={false}
                autoComplete="off"
                placeholder="AUR-K7M9Q3P"
                className="ship-input ship-input-mono"
                disabled={pending}
              />
              <small>From the tracking page or your booking confirmation email.</small>
            </div>

            <div className="ship-field">
              <label htmlFor="claimEmail">
                Your email <span className="ship-required">*</span>
              </label>
              <input
                id="claimEmail"
                name="claimEmail"
                type="email"
                required
                placeholder="name@company.com"
                autoComplete="email"
                className="ship-input"
                disabled={pending}
              />
              <small>Where we&rsquo;ll send the resolution.</small>
            </div>
          </section>

          <section className="ship-section">
            <header className="ship-section-head">
              <div>
                <span className="eyebrow-inline">Claim type</span>
                <h3 className="ship-section-title">
                  What <em>happened.</em>
                </h3>
              </div>
            </header>

            <input type="hidden" name="claimType" value={claimType} />
            <div className="claim-type-grid">
              {CLAIM_TYPES.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setClaimType(t.id)}
                  className={`quote-service-card ${claimType === t.id ? "is-active" : ""}`}
                >
                  <div className="quote-service-head">
                    <span className="quote-service-name">{t.label}</span>
                    {claimType === t.id && (
                      <span className="quote-service-dot" aria-hidden="true" />
                    )}
                  </div>
                  <p className="quote-service-desc">{t.desc}</p>
                </button>
              ))}
            </div>

            <div className="ship-field" style={{ marginTop: 18 }}>
              <label htmlFor="description">
                Tell us what happened <span className="ship-required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                placeholder="Two sentences is enough. We follow up if we need more."
                className="ship-input"
                disabled={pending}
              />
            </div>

            <div className="ship-field-grid-2">
              <div className="ship-field">
                <label htmlFor="declaredValue">Declared value at booking</label>
                <input
                  id="declaredValue"
                  name="declaredValue"
                  type="text"
                  placeholder="$250"
                  className="ship-input"
                  disabled={pending}
                />
              </div>
              <div className="ship-field">
                <label htmlFor="claimAmount">Amount claimed</label>
                <input
                  id="claimAmount"
                  name="claimAmount"
                  type="text"
                  placeholder="$250"
                  className="ship-input"
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
        </div>

        <aside className="ship-summary">
          <div className="ship-summary-card">
            <div className="ship-summary-eyebrow">
              <ShieldCheck size={12} strokeWidth={1.6} />
              <span>Claim coverage</span>
            </div>

            <div className="confirm-next" style={{ borderTop: "none", paddingTop: 0 }}>
              <h4 style={{ marginBottom: 8 }}>How fast we move</h4>
              <ol>
                <li>Acknowledge inside 24 hours</li>
                <li>Decide most claims inside 48 hours</li>
                <li>Pay approved claims within 5 business days</li>
                <li>No third-party adjusters under $20K</li>
              </ol>
            </div>

            <button
              type="submit"
              className="btn-primary ship-summary-submit"
              disabled={pending}
              data-magnetic
            >
              {pending ? "Filing…" : "File claim"}
            </button>
            <p className="ship-summary-hint">
              File within 7 days of the delivery window.
            </p>
          </div>
        </aside>
      </div>
    </form>
  );
}
