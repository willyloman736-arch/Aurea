import { TrackingForm } from "./tracking-form";

export function Hero() {
  return (
    <section className="hero" id="home">
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/ocean-poster.jpg"
      >
        <source src="/ocean.mp4" type="video/mp4" />
      </video>
      <div className="hero-vignette" aria-hidden="true" />

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
