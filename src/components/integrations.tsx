import { ScrollReveal } from "./scroll-reveal";

const CARRIERS = [
  "USPS",
  "FEDEX",
  "UPS",
  "DHL",
  "MAERSK",
  "ROYAL MAIL",
  "CANADA POST",
  "JAPAN POST",
  "AUSTRALIA POST",
  "YAMATO",
  "ARAMEX",
  "SF EXPRESS",
  "EVRI",
  "LASERSHIP",
  "ONTRAC",
  "PUROLATOR",
];

export function Integrations() {
  return (
    <section className="integrations" id="integrations">
      <div className="container-aurea">
        <ScrollReveal className="int-head">
          <span className="eyebrow-inline">Integrations</span>
          <h3 className="int-title">
            Every carrier your customers ship with.<br />
            <em>One integration.</em>
          </h3>
        </ScrollReveal>

        <ScrollReveal className="int-grid">
          {CARRIERS.map((c) => (
            <div key={c} className="int-logo">{c}</div>
          ))}
          <div className="int-logo int-more">+ 56 more</div>
        </ScrollReveal>

        <ScrollReveal className="int-footnote">
          Aurea handles carrier differences behind a single HTTP contract. Add a new
          shipping partner tomorrow and your code doesn&rsquo;t change.
        </ScrollReveal>
      </div>
    </section>
  );
}
