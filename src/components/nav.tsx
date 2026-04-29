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
          <Link href="/services">Services</Link>
          <Link href="/network">Network</Link>
          <Link href="/customers">Customers</Link>
          <Link href="/faq">FAQ</Link>
        </nav>
        <div className="nav-actions">
          <Link href="/sign-in" className="btn-text">Sign in</Link>
          <Link href="/sign-up" className="btn-primary" data-magnetic>Get a quote</Link>
          <NavGlobeMount />
        </div>
      </div>
    </header>
  );
}
