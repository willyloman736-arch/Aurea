"use client";

import dynamic from "next/dynamic";

const HeroCube = dynamic(
  () => import("./hero-cube").then((m) => m.HeroCube),
  {
    ssr: false,
    loading: () => null,
  },
);

export function HeroCubeMount() {
  return (
    <div className="hero-cube-wrap" aria-hidden="true">
      <HeroCube />
    </div>
  );
}
