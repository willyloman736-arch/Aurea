"use client";

import { useEffect } from "react";

/**
 * Finds every [data-magnetic] element and makes it subtly follow the cursor
 * when hovered. Keeps a small strength so it feels premium, not gimmicky.
 */
export function MagneticEffects() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const STRENGTH = 0.18;
    const els = document.querySelectorAll<HTMLElement>("[data-magnetic]");

    const cleanups: Array<() => void> = [];

    els.forEach((el) => {
      function onMove(e: MouseEvent) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * STRENGTH;
        const dy = (e.clientY - cy) * STRENGTH;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      }
      function onLeave() {
        el.style.transform = "";
      }
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
        el.style.transform = "";
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
