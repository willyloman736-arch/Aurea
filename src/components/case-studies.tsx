import { ScrollReveal } from "./scroll-reveal";

const STUDIES = [
  {
    customer: "Vendr",
    logo: "VENDR",
    metric: "−68",
    unit: "%",
    metricLabel: "support tickets",
    story:
      "Replaced three separate carrier integrations with one Aurea endpoint. Ops reclaimed six hours a week, and on-time delivery numbers finally told the truth.",
    author: "Maya Aldrin",
    role: "VP Operations",
    initial: "M",
  },
  {
    customer: "Flexport",
    logo: "FLEXPORT",
    metric: "±38",
    unit: "min",
    metricLabel: "median ETA accuracy",
    story:
      "Aurea's predictive ETA replaced our in-house model entirely. Our customers now know when packages arrive — not when they should have arrived.",
    author: "Daniel Okafor",
    role: "Head of Platform",
    initial: "D",
  },
  {
    customer: "Ramp",
    logo: "RAMP",
    metric: "220",
    unit: "countries",
    metricLabel: "live in week one",
    story:
      "Launched international tracking in 48 hours. Aurea handles every carrier, every country, every language receipt. Code shipped Tuesday, customers haven't noticed.",
    author: "Sara Kim",
    role: "Staff Engineer",
    initial: "S",
  },
];

export function CaseStudies() {
  return (
    <section className="case-studies" id="customers">
      <div className="container-aurea">
        <ScrollReveal className="section-head">
          <span className="eyebrow-inline">Case studies</span>
          <h2 className="section-title">
            Operators who <em>moved the numbers.</em>
          </h2>
          <p className="section-sub">
            Three teams who replaced existing tracking infrastructure with Aurea
            — and what it cost them not to.
          </p>
        </ScrollReveal>

        <div className="cs-grid">
          {STUDIES.map((s) => (
            <ScrollReveal as="div" key={s.customer} className="cs-card">
              <div className="cs-logo">{s.logo}</div>
              <div className="cs-metric">
                <div className="cs-metric-num">
                  {s.metric}
                  <span className="cs-metric-unit">{s.unit}</span>
                </div>
                <div className="cs-metric-label">{s.metricLabel}</div>
              </div>
              <p className="cs-story">&ldquo;{s.story}&rdquo;</p>
              <div className="cs-author">
                <div className="cs-author-avatar">{s.initial}</div>
                <div>
                  <div className="cs-author-name">{s.author}</div>
                  <div className="cs-author-role">
                    {s.role} · {s.customer}
                  </div>
                </div>
              </div>
              <a href="#" className="cs-link">
                Read the story <span aria-hidden="true">→</span>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
