"use client";

import dynamic from "next/dynamic";
import { useInView } from "./use-in-view";

const NavGlobe = dynamic(
  () => import("./nav-globe").then((m) => m.NavGlobe),
  {
    ssr: false,
    loading: () => null,
  },
);

export function NavGlobeMount() {
  const [ref, inView] = useInView<HTMLDivElement>("150px");
  return (
    <div ref={ref} className="nav-globe-wrap" aria-hidden="true">
      <span className="nav-globe-ring nav-globe-ring-1" />
      <div className="nav-globe-canvas">
        <NavGlobe active={inView} />
      </div>
      <span className="nav-globe-live">
        <span className="nav-globe-live-dot" />
        LIVE
      </span>
    </div>
  );
}
