import { TrackingForm } from "./tracking-form";
import { HeroArcs } from "./hero-arcs";

export function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-bg-blob hero-bg-blob-1" />
        <div className="hero-bg-blob hero-bg-blob-2" />
        <div className="hero-bg-blob hero-bg-blob-3" />
        <div className="hero-bg-grain" />
      </div>
      <HeroArcs />

      <div className="container-aurea">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          From dispatch to doorstep · 220 countries
        </div>

        <h1 className="hero-title">
          Cargo, moved like<br />
          <em>it matters.</em>
        </h1>

        <p className="hero-lede">
          Premium freight and parcel logistics across 220 countries. Doorstep pickup, custody every step, on-time arrival measured in minutes — not days.
        </p>

        <TrackingForm />

        <div className="hero-credits">
          <span className="hero-credits-label">Moving cargo for</span>
          <div className="hero-credits-logos">
            <span>VENDR</span>
            <span>FLEXPORT</span>
            <span>SHOPIFY</span>
            <span>RAMP</span>
            <span>NOTION</span>
          </div>
        </div>
      </div>
    </section>
  );
}
