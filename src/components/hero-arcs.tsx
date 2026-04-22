export function HeroArcs() {
  return (
    <svg
      className="hero-arcs"
      viewBox="0 0 1920 820"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Faint baseline routes — permanently visible dashed */}
      <g className="hero-arc-base">
        <path d="M 80 440 Q 400 220 720 380" />
        <path d="M 720 380 Q 1020 160 1340 310" />
        <path d="M 1340 310 Q 1620 460 1840 340" />
        <path d="M 120 640 Q 540 740 990 580" />
        <path d="M 990 580 Q 1400 680 1820 540" />
        <path d="M 400 200 Q 800 60 1200 180" />
        <path d="M 80 440 Q 200 300 400 200" />
      </g>

      {/* Drawing arcs — animate pathLength to simulate the line being drawn */}
      <g className="hero-arc-flow">
        <path d="M 80 440 Q 400 220 720 380"   className="hero-arc hero-arc-1" pathLength="1"/>
        <path d="M 720 380 Q 1020 160 1340 310" className="hero-arc hero-arc-2" pathLength="1"/>
        <path d="M 1340 310 Q 1620 460 1840 340" className="hero-arc hero-arc-3" pathLength="1"/>
        <path d="M 120 640 Q 540 740 990 580"   className="hero-arc hero-arc-4" pathLength="1"/>
        <path d="M 990 580 Q 1400 680 1820 540" className="hero-arc hero-arc-5" pathLength="1"/>
        <path d="M 400 200 Q 800 60 1200 180"   className="hero-arc hero-arc-6" pathLength="1"/>
        <path d="M 80 440 Q 200 300 400 200"    className="hero-arc hero-arc-7" pathLength="1"/>
      </g>

      {/* Hub nodes at route joints */}
      <g className="hero-arc-nodes">
        <circle cx="80"   cy="440" r="3" />
        <circle cx="720"  cy="380" r="3" />
        <circle cx="1340" cy="310" r="3" />
        <circle cx="1840" cy="340" r="3" />
        <circle cx="120"  cy="640" r="3" />
        <circle cx="990"  cy="580" r="3" />
        <circle cx="1820" cy="540" r="3" />
        <circle cx="400"  cy="200" r="3" />
        <circle cx="1200" cy="180" r="3" />
      </g>
    </svg>
  );
}
