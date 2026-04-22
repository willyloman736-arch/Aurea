import { ScrollReveal } from "./scroll-reveal";

const STEPS = [
  {
    num: "01",
    title: "Drop in a tracking number",
    body: "Paste it in our dashboard, or send it to our API. No carrier pre-selection — Aurea auto-detects FedEx, UPS, USPS, DHL, and 70+ others from the number format.",
    code: "POST /v1/trackers",
  },
  {
    num: "02",
    title: "We watch the network",
    body: "The moment a scan happens — anywhere — it hits our stream. Sub-second propagation, Kafka-backed, with weather and customs data joined in before it reaches you.",
    code: "event: tracker.updated",
  },
  {
    num: "03",
    title: "Customers see live status",
    body: "A shareable public page updates itself as events arrive. No polling, no refresh — your customers stop calling support, you stop answering.",
    code: "GET /track/{id}",
  },
];

export function HowItWorks() {
  return (
    <section className="how-it-works" id="how">
      <div className="container-aurea">
        <ScrollReveal className="section-head">
          <span className="eyebrow-inline">How it works</span>
          <h2 className="section-title">
            From tracking number to<br /><em>live status.</em> In three moves.
          </h2>
        </ScrollReveal>
        <ol className="how-list">
          {STEPS.map((step, i) => (
            <ScrollReveal as="li" key={step.num} className="how-step">
              <div className="how-num">{step.num}</div>
              <div className="how-body">
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                <code className="how-code">{step.code}</code>
              </div>
              {i < STEPS.length - 1 && <div className="how-connector" aria-hidden="true" />}
            </ScrollReveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
