import { ScrollReveal } from "./scroll-reveal";

const STUDIES = [
  {
    customer: "Vendr",
    logo: "VENDR",
    metric: "−68",
    unit: "%",
    metricLabel: "support tickets",
    story:
      "We move 20,000 parcels a month with Aurea. They don't lose packages, they don't pad delivery windows, and our customers stopped calling to ask where their orders are.",
    author: "Maya Aldrin",
    role: "VP Operations",
    initial: "M",
  },
  {
    customer: "Flexport",
    logo: "FLEXPORT",
    metric: "±38",
    unit: "min",
    metricLabel: "ETA accuracy",
    story:
      "Aurea handles our cross-border freight through customs without us sitting on the phone. ETAs hold within thirty minutes. We've stopped scheduling around their delays — because there aren't any.",
    author: "Daniel Okafor",
    role: "Head of Logistics",
    initial: "D",
  },
  {
    customer: "Ramp",
    logo: "RAMP",
    metric: "220",
    unit: "countries",
    metricLabel: "served, no follow-ups",
    story:
      "We ship hardware, swag, and signed contracts to employees in 40 countries. Aurea is the only courier we trust to land a package without four follow-up emails.",
    author: "Sara Kim",
    role: "Ops Lead",
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
