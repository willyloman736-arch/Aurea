"use client";

import dynamic from "next/dynamic";

const MetricsBg = dynamic(
  () => import("./metrics-bg").then((m) => m.MetricsBg),
  {
    ssr: false,
    loading: () => null,
  },
);

export function MetricsBgMount() {
  return (
    <div className="metrics-3d-bg" aria-hidden="true">
      <MetricsBg />
    </div>
  );
}
