import { TrackingForm } from "./tracking-form";
import { HeroCubeMount } from "./hero-cube-mount";
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
      <HeroCubeMount />

      <div className="container-aurea">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          Live across 220 countries
        </div>

        <h1 className="hero-title">
          Shipment tracking,<br />
          engineered for <em>scale.</em>
        </h1>

        <p className="hero-lede">
          One endpoint. Eighteen million daily events. Zero blind spots between first mile and final handshake.
        </p>

        <TrackingForm />

        <div className="hero-credits">
          <span className="hero-credits-label">Trusted by operations teams at</span>
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
