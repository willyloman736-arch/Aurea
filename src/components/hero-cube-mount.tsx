"use client";

import dynamic from "next/dynamic";
import { useInView } from "./use-in-view";

const HeroCube = dynamic(
  () => import("./hero-cube").then((m) => m.HeroCube),
  {
    ssr: false,
    loading: () => null,
  },
);

export function HeroCubeMount() {
  const [ref, inView] = useInView<HTMLDivElement>("300px");
  return (
    <div ref={ref} className="hero-cube-wrap" aria-hidden="true">
      <HeroCube active={inView} />
    </div>
  );
}
