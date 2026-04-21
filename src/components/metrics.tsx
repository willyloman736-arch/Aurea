import { Counter } from "./counter";
import { ScrollReveal } from "./scroll-reveal";
import { MetricsBgMount } from "./metrics-bg-mount";

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
      </ScrollReveal>
    </section>
  );
}
