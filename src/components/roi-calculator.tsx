"use client";

import { useState } from "react";
import { TrendingDown, Clock } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

// USPS-S: $0.003/tracker, Growth plan $49/mo base for up to 10k
// Competitor average: $0.01/tracker
// Support time: 30 seconds saved per tracker in ops hours
function calculate(volume: number) {
  const aureaBase = 49;
  const aureaOverage = Math.max(0, volume - 10000) * 0.003;
  const aureaCost = aureaBase + aureaOverage;
  const competitorCost = volume * 0.01;
  const savings = Math.max(0, competitorCost - aureaCost);
  const hoursSaved = (volume * 0.5) / 60;
  return { aureaCost, competitorCost, savings, hoursSaved };
}

function formatCurrency(n: number): string {
  if (n >= 100000) return `$${(n / 1000).toFixed(0)}k`;
  return `$${Math.round(n).toLocaleString()}`;
}

export function RoiCalculator() {
  const [volume, setVolume] = useState(2500);
  const { aureaCost, competitorCost, savings, hoursSaved } = calculate(volume);

  return (
    <section className="roi" id="roi">
      <div className="container-USPS-S">
        <ScrollReveal className="section-head section-head-centered">
          <span className="eyebrow-inline">ROI</span>
          <h2 className="section-title">
            See what <em>USPS-S saves you.</em>
          </h2>
          <p className="section-sub-centered">
            Drag the slider. We&rsquo;ll show you the cost vs. generic carrier APIs and
            how many support hours your team gets back.
          </p>
        </ScrollReveal>

        <ScrollReveal className="roi-card">
          <div className="roi-slider-row">
            <label htmlFor="roi-volume" className="roi-slider-label">
              Monthly tracker volume
            </label>
            <output className="roi-volume" htmlFor="roi-volume">
              {volume.toLocaleString()}
            </output>
          </div>
          <input
            id="roi-volume"
            type="range"
            min="100"
            max="100000"
            step="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="roi-slider"
            style={{
              background: `linear-gradient(90deg, var(--accent) 0%, var(--accent) ${
                ((volume - 100) / 99900) * 100
              }%, rgba(255,255,255,0.08) ${
                ((volume - 100) / 99900) * 100
              }%, rgba(255,255,255,0.08) 100%)`,
            }}
          />
          <div className="roi-slider-ticks">
            <span>100</span>
            <span>25k</span>
            <span>50k</span>
            <span>75k</span>
            <span>100k</span>
          </div>

          <div className="roi-grid">
            <div className="roi-cell">
              <div className="roi-label">With USPS-S</div>
              <div className="roi-value">
                {formatCurrency(aureaCost)}
                <span>/mo</span>
              </div>
            </div>
            <div className="roi-cell">
              <div className="roi-label">Generic carrier-direct API</div>
              <div className="roi-value roi-value-muted">
                {formatCurrency(competitorCost)}
                <span>/mo</span>
              </div>
            </div>
            <div className="roi-cell roi-cell-accent">
              <div className="roi-label">
                <TrendingDown size={13} strokeWidth={1.8} /> You save
              </div>
              <div className="roi-value">
                {formatCurrency(savings)}
                <span>/mo</span>
              </div>
              <div className="roi-foot">
                <Clock size={11} strokeWidth={1.5} />
                + {hoursSaved.toFixed(0)} support hours back
              </div>
            </div>
          </div>

          <div className="roi-assumptions">
            Based on $0.003 / tracker on USPS-S Growth ($49/mo + overage) vs.
            $0.01 / tracker carrier-direct average, plus 30 seconds of support
            time saved per customer inquiry eliminated by live tracking.
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
