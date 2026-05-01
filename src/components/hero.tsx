import { TrackingForm } from "./tracking-form";
import { HeroBgSlider } from "./hero-bg-slider";

export function Hero() {
  return (
    <section className="hero hero--with-bg-slider" id="home">
      <HeroBgSlider />
      <div className="hero-bg-overlay" aria-hidden="true" />

      <div className="container-USPS-S">
        <div className="eyebrow eyebrow--on-photo">
          <span className="eyebrow-dot" />
          From dispatch to doorstep · 220 countries
        </div>

        <h1 className="hero-title hero-title--on-photo">
          Cargo, moved like<br />
          <em>it matters.</em>
        </h1>

        <p className="hero-lede hero-lede--on-photo">
          Premium freight and parcel logistics across 220 countries. Doorstep pickup, custody every step, on-time arrival measured in minutes — not days.
        </p>

        <TrackingForm />

        <div className="hero-credits hero-credits--on-photo">
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
