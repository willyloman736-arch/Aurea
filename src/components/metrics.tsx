import { Counter } from "./counter";
import { ScrollReveal } from "./scroll-reveal";
import { MetricsBgMount } from "./metrics-bg-mount";

function CracksOverlay() {
  return (
    <svg
      className="metrics-cracks"
      viewBox="0 0 1200 200"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Three main cracks between the four shards, each zig-zags vertically */}
      <path d="M 310 -10 L 288 22 L 324 50 L 292 78 L 318 112 L 294 148 L 314 180 L 298 210" />
      <path d="M 585 -10 L 612 28 L 578 58 L 604 88 L 574 120 L 602 152 L 582 184 L 608 210" />
      <path d="M 865 -10 L 842 30 L 878 62 L 854 94 L 882 126 L 856 158 L 878 190 L 860 210" />

      {/* Branching sub-cracks — give the shatter a fractal feel */}
      <path d="M 295 58 L 250 66 L 215 74" className="metrics-crack-sub" />
      <path d="M 614 80 L 660 75 L 700 70" className="metrics-crack-sub" />
      <path d="M 858 130 L 820 140 L 780 135" className="metrics-crack-sub" />
      <path d="M 312 168 L 345 178 L 378 172" className="metrics-crack-sub" />

      {/* Impact-point glint where the cracks seem to originate */}
      <circle cx="600" cy="90" r="3" className="metrics-crack-glint" />
    </svg>
  );
}

export function Metrics() {
  return (
    <section className="metrics">
      <MetricsBgMount />
      <ScrollReveal className="container-aurea metrics-inner">
        <div className="metric">
          <div className="metric-num">
            <Counter to={18.2} decimals={1} />
            <span className="metric-unit">M</span>
          </div>
          <div className="metric-label">Shipments tracked daily</div>
        </div>
        <div className="metric">
          <div className="metric-num">
            <Counter to={220} />
          </div>
          <div className="metric-label">Countries, live</div>
        </div>
        <div className="metric">
          <div className="metric-num">
            <Counter to={99.3} decimals={1} />
            <span className="metric-unit">%</span>
          </div>
          <div className="metric-label">On-time delivery</div>
        </div>
        <div className="metric">
          <div className="metric-num">
            &lt;<Counter to={180} />
            <span className="metric-unit">ms</span>
          </div>
          <div className="metric-label">API p99 latency</div>
        </div>

        <CracksOverlay />
      </ScrollReveal>
    </section>
  );
}
