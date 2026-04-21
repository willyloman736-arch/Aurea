import Link from "next/link";
import type { Metadata } from "next";
import { Ambient } from "@/components/ambient";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Sign in — Aurea",
};

export default function SignInPage() {
  return (
    <>
      <Ambient />
      <Nav />
      <main>
        <section className="hero" style={{ paddingTop: 120, paddingBottom: 120, minHeight: "70vh" }}>
          <div className="container-aurea" style={{ position: "relative", zIndex: 2 }}>
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              Coming soon
            </div>
            <h1 className="hero-title">
              Sign in,<br /><em>coming soon.</em>
            </h1>
            <p className="hero-lede">
              Authentication unlocks in Phase 3 along with the customer dashboard. In the meantime, the public tracking at <code style={{ fontFamily: "ui-monospace, monospace", fontSize: 15, background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: 4 }}>/track/[id]</code> is open.
            </p>
            <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/" className="btn-primary">Back to home</Link>
              <Link href="/dashboard" className="btn-ghost">Join waitlist</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
