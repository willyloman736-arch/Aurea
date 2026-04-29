"use client";

import dynamic from "next/dynamic";
import { useInView } from "./use-in-view";

const MetricsBg = dynamic(
  () => import("./metrics-bg").then((m) => m.MetricsBg),
  {
    ssr: false,
    loading: () => null,
  },
);

export function MetricsBgMount() {
  const [ref, inView] = useInView<HTMLDivElement>("200px");
  return (
    <div ref={ref} className="metrics-3d-bg" aria-hidden="true">
      <MetricsBg active={inView} />
    </div>
  );
}
