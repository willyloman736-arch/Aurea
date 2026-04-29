import Link from "next/link";
import { NavGlobeMount } from "./nav-globe-mount";

export function Nav() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">◈</span>
          <span className="brand-text">Aurea</span>
        </Link>
        <nav className="nav-links" aria-label="Primary">
          <Link href="#platform">Platform</Link>
          <Link href="#network">Network</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="#pricing">Pricing</Link>
        </nav>
        <div className="nav-actions">
          <Link href="/sign-in" className="btn-text">Sign in</Link>
          <Link href="/sign-up" className="btn-primary" data-magnetic>Start tracking</Link>
          <NavGlobeMount />
        </div>
      </div>
    </header>
  );
}
