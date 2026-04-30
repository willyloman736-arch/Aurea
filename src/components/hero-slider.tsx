"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Slide {
  src: string;
  alt: string;
}

const SLIDES: Slide[] = [
  { src: "/hero/slide-1.jpg", alt: "Aurea cargo at the dock" },
  { src: "/hero/slide-2.jpg", alt: "Network in motion" },
  { src: "/hero/slide-3.jpg", alt: "Delivery in progress" },
  { src: "/hero/slide-4.jpg", alt: "End-to-end custody" },
];

const ADVANCE_MS = 6500;

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, ADVANCE_MS);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section
      className="hero-slider"
      aria-roledescription="carousel"
      aria-label="Aurea operations gallery"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container-aurea">
        <div className="hero-slider-frame">
          {SLIDES.map((s, i) => (
            <div
              key={s.src}
              className={`hero-slide ${i === active ? "is-active" : ""}`}
              aria-hidden={i !== active}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${SLIDES.length}`}
            >
              <Image
                src={s.src}
                alt={s.alt}
                fill
                sizes="(max-width: 1180px) 100vw, 1180px"
                priority={i === 0}
                className="hero-slide-img"
              />
            </div>
          ))}

          <div className="hero-slider-overlay" aria-hidden="true" />

          <div
            className="hero-slider-progress"
            aria-hidden="true"
            key={`${active}-${paused}`}
            data-paused={paused}
          />

          <div
            className="hero-slider-dots"
            role="tablist"
            aria-label="Slide selector"
          >
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Go to slide ${i + 1}`}
                className={`hero-slider-dot ${i === active ? "is-active" : ""}`}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
