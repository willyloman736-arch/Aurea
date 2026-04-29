"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Returns a ref + a boolean that's true while the ref element is in the viewport
 * (within `rootMargin`). Used to pause expensive animations when off-screen.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  rootMargin = "200px",
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin, threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return [ref, inView];
}
