"use client";

import dynamic from "next/dynamic";

const Globe = dynamic(
  () => import("./globe").then((m) => m.Globe),
  {
    ssr: false,
    loading: () => <div className="globe-loading" />,
  },
);

export function GlobeMount() {
  return (
    <div className="globe-wrap">
      <Globe />
    </div>
  );
}
