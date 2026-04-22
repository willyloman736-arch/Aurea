"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch devices + reduced-motion
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0, y = 0, targetX = 0, targetY = 0;
    let raf: number;

    function onMove(e: MouseEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
    }

    function loop() {
      // Smooth follow
      x += (targetX - x) * 0.15;
      y += (targetY - y) * 0.15;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${x - 160}px, ${y - 160}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}
