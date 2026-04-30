"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SLIDES = [
  { src: "/hero/slide-1.jpg", alt: "" },
  { src: "/hero/slide-2.jpg", alt: "" },
  { src: "/hero/slide-3.jpg", alt: "" },
  { src: "/hero/slide-4.jpg", alt: "" },
];

const ADVANCE_MS = 7000;

/**
 * Full-bleed cycling image background for the hero. No controls — just
 * gentle 1.4s crossfade every 7s. Decorative; aria-hidden.
 */
export function HeroBgSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, ADVANCE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hero-bg-slider" aria-hidden="true">
      {SLIDES.map((s, i) => (
        <div
          key={s.src}
          className={`hero-bg-slide ${i === active ? "is-active" : ""}`}
        >
          <Image
            src={s.src}
            alt={s.alt}
            fill
            sizes="100vw"
            priority={i === 0}
            className="hero-bg-slide-img"
          />
        </div>
      ))}
    </div>
  );
}
