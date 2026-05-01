import { ScrollReveal } from "./scroll-reveal";

const STEPS = [
  {
    num: "01",
    title: "Book a pickup",
    body: "Tell us where the cargo is and where it's going. Online, by phone, or through your account manager. Most major cities, same-day if booked before 11am local.",
    code: "PICKUP · 09:42 · LAGOS",
  },
  {
    num: "02",
    title: "We collect, sort, route",
    body: "Our courier scans the cargo into custody the moment it leaves your hands. Routed through the closest hub, on the next available lane, with weather and customs already accounted for.",
    code: "IN_TRANSIT · 14:08 · ROTTERDAM",
  },
  {
    num: "03",
    title: "Doorstep handoff",
    body: "Geo-verified proof of delivery, OTP at the door for high-value parcels. Recipients track every checkpoint live — no logins, no support calls, no \"where is my package?\"",
    code: "DELIVERED · 11:03 · BERLIN",
  },
];

export function HowItWorks() {
  return (
    <section className="how-it-works" id="how">
      <div className="container-USPS-S">
        <ScrollReveal className="section-head">
          <span className="eyebrow-inline">How it works</span>
          <h2 className="section-title">
            From dispatch to <em>doorstep.</em><br />In three moves.
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
