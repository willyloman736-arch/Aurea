export function HeroArcs() {
  return (
    <svg
      className="hero-arcs"
      viewBox="0 0 1920 820"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Single shared glow filter — 20× cheaper than per-path drop-shadow */}
      <defs>
        <filter id="hero-arc-glow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="2.2" result="blurSmall" />
          <feMerge>
            <feMergeNode in="blurSmall" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Faint baseline routes — permanently visible dashed */}
      <g className="hero-arc-base">
        <path d="M 80 440 Q 400 220 720 380" />
        <path d="M 720 380 Q 1020 160 1340 310" />
        <path d="M 1340 310 Q 1620 460 1840 340" />
        <path d="M 120 640 Q 540 740 990 580" />
        <path d="M 990 580 Q 1400 680 1820 540" />
        <path d="M 400 200 Q 800 60 1200 180" />
        <path d="M 80 440 Q 200 300 400 200" />
        <path d="M 1200 180 Q 1500 100 1780 220" />
        <path d="M 1840 340 Q 1800 440 1820 540" />
        <path d="M 1200 180 Q 1280 240 1340 310" />
        <path d="M 720 380 Q 870 480 990 580" />
        <path d="M 400 200 Q 560 280 720 380" />
        <path d="M 80 440 Q 100 540 120 640" />
        <path d="M 260 100 Q 540 40 860 90" />
        <path d="M 860 90 Q 1040 130 1200 180" />
        <path d="M 1600 600 Q 1720 690 1820 540" />
        <path d="M 500 720 Q 720 660 990 580" />
        <path d="M 120 640 Q 300 580 540 620" />
        <path d="M 1340 310 Q 1480 400 1600 490" />
        <path d="M 1600 490 Q 1680 540 1820 540" />
      </g>

      {/* Drawing arcs — one shared filter on the group */}
      <g className="hero-arc-flow" filter="url(#hero-arc-glow)">
        <path d="M 80 440 Q 400 220 720 380"      className="hero-arc hero-arc-1"  pathLength="1"/>
        <path d="M 720 380 Q 1020 160 1340 310"   className="hero-arc hero-arc-2"  pathLength="1"/>
        <path d="M 1340 310 Q 1620 460 1840 340"  className="hero-arc hero-arc-3"  pathLength="1"/>
        <path d="M 120 640 Q 540 740 990 580"     className="hero-arc hero-arc-4"  pathLength="1"/>
        <path d="M 990 580 Q 1400 680 1820 540"   className="hero-arc hero-arc-5"  pathLength="1"/>
        <path d="M 400 200 Q 800 60 1200 180"     className="hero-arc hero-arc-6"  pathLength="1"/>
        <path d="M 80 440 Q 200 300 400 200"      className="hero-arc hero-arc-7"  pathLength="1"/>
        <path d="M 1200 180 Q 1500 100 1780 220"  className="hero-arc hero-arc-8"  pathLength="1"/>
        <path d="M 1840 340 Q 1800 440 1820 540"  className="hero-arc hero-arc-9"  pathLength="1"/>
        <path d="M 1200 180 Q 1280 240 1340 310"  className="hero-arc hero-arc-10" pathLength="1"/>
        <path d="M 720 380 Q 870 480 990 580"     className="hero-arc hero-arc-11" pathLength="1"/>
        <path d="M 400 200 Q 560 280 720 380"     className="hero-arc hero-arc-12" pathLength="1"/>
        <path d="M 80 440 Q 100 540 120 640"      className="hero-arc hero-arc-13" pathLength="1"/>
        <path d="M 260 100 Q 540 40 860 90"       className="hero-arc hero-arc-14" pathLength="1"/>
        <path d="M 860 90 Q 1040 130 1200 180"    className="hero-arc hero-arc-15" pathLength="1"/>
        <path d="M 1600 600 Q 1720 690 1820 540"  className="hero-arc hero-arc-16" pathLength="1"/>
        <path d="M 500 720 Q 720 660 990 580"     className="hero-arc hero-arc-17" pathLength="1"/>
        <path d="M 120 640 Q 300 580 540 620"     className="hero-arc hero-arc-18" pathLength="1"/>
        <path d="M 1340 310 Q 1480 400 1600 490"  className="hero-arc hero-arc-19" pathLength="1"/>
        <path d="M 1600 490 Q 1680 540 1820 540"  className="hero-arc hero-arc-20" pathLength="1"/>
      </g>

      {/* Hub nodes at route joints — also share the same filter */}
      <g className="hero-arc-nodes" filter="url(#hero-arc-glow)">
        <circle cx="80"   cy="440" r="3" />
        <circle cx="720"  cy="380" r="3" />
        <circle cx="1340" cy="310" r="3" />
        <circle cx="1840" cy="340" r="3" />
        <circle cx="120"  cy="640" r="3" />
        <circle cx="990"  cy="580" r="3" />
        <circle cx="1820" cy="540" r="3" />
        <circle cx="400"  cy="200" r="3" />
        <circle cx="1200" cy="180" r="3" />
        <circle cx="1780" cy="220" r="3" />
        <circle cx="260"  cy="100" r="3" />
        <circle cx="860"  cy="90"  r="3" />
        <circle cx="1600" cy="600" r="3" />
        <circle cx="500"  cy="720" r="3" />
        <circle cx="540"  cy="620" r="3" />
        <circle cx="1600" cy="490" r="3" />
      </g>
    </svg>
  );
}
