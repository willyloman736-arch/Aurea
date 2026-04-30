"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { NavGlobeMount } from "./nav-globe-mount";

export function Nav() {
  const [open, setOpen] = useState(false);

  // Close drawer on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand" onClick={close} aria-label="Aurea — home">
          <Image
            src="/logo.svg"
            alt="Aurea"
            width={32}
            height={32}
            className="brand-mark brand-mark-img"
            priority
          />
        </Link>

        <nav className="nav-links" aria-label="Primary">
          <Link href="/services">Services</Link>
          <Link href="/network">Network</Link>
          <Link href="/portal" className="nav-live">
            <span className="nav-live-dot" aria-hidden="true" />
            Live
          </Link>
          <Link href="/customers">Customers</Link>
          <Link href="/faq">FAQ</Link>
        </nav>

        <div className="nav-actions">
          <Link href="/sign-in" className="btn-text nav-signin-desktop">
            Sign in
          </Link>
          <Link
            href="/quote"
            className="btn-primary nav-cta-desktop"
            data-magnetic
          >
            Get a quote
          </Link>
          <NavGlobeMount />

          {/* Mobile menu trigger */}
          <button
            type="button"
            className="nav-burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X size={18} strokeWidth={1.6} />
            ) : (
              <Menu size={18} strokeWidth={1.6} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          <div
            className="nav-drawer-backdrop"
            onClick={close}
            aria-hidden="true"
          />
          <div
            className="nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
          >
            <nav className="nav-drawer-links">
              <Link href="/services" onClick={close}>
                Services
              </Link>
              <Link href="/network" onClick={close}>
                Network
              </Link>
              <Link href="/portal" onClick={close} className="nav-live">
                <span className="nav-live-dot" aria-hidden="true" />
                Live portal
              </Link>
              <Link href="/customers" onClick={close}>
                Customers
              </Link>
              <Link href="/faq" onClick={close}>
                FAQ
              </Link>
              <Link href="/coverage" onClick={close}>
                Coverage
              </Link>
              <Link href="/contact" onClick={close}>
                Contact
              </Link>
            </nav>
            <div className="nav-drawer-actions">
              <Link
                href="/sign-in"
                onClick={close}
                className="btn-ghost btn-lg"
              >
                Sign in
              </Link>
              <Link
                href="/quote"
                onClick={close}
                className="btn-primary btn-lg"
                data-magnetic
              >
                Get a quote
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
