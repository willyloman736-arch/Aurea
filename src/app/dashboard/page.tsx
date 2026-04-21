import Link from "next/link";
import { Lock } from "lucide-react";
import type { Metadata } from "next";
import { Ambient } from "@/components/ambient";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Dashboard — Aurea",
  description: "Your Aurea shipments, live.",
};

export default function DashboardPage() {
  return (
    <>
      <Ambient />
      <Nav />
      <main>
        <section className="hero" style={{ paddingTop: 120, paddingBottom: 120, minHeight: "70vh" }}>
          <div className="container-aurea" style={{ position: "relative", zIndex: 2 }}>
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              Coming soon · Phase 3
            </div>
            <h1 className="hero-title">
              The <em>dashboard</em><br />is almost ready.
            </h1>
            <p className="hero-lede">
              Shipment management, per-lane analytics, webhook configuration, and team settings — launching alongside Aurea authentication. Request early access below.
            </p>
            <div
              className="track-card"
              style={{
                maxWidth: 560,
                padding: 28,
                display: "flex",
                alignItems: "center",
                gap: 16,
                animation: "none",
              }}
            >
              <div
                style={{
                  width: 44, height: 44,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(217, 165, 106, 0.12)",
                  border: "1px solid rgba(217, 165, 106, 0.22)",
                  borderRadius: "10px",
                  color: "var(--accent)",
                  flexShrink: 0,
                }}
              >
                <Lock size={20} strokeWidth={1.5} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                  Private beta
                </div>
                <div style={{ fontSize: 13.5, color: "var(--text-2)" }}>
                  Invite-only while we onboard the first operators. Sign up for the waitlist.
                </div>
              </div>
              <Link href="/sign-up" className="btn-primary">Join waitlist</Link>
            </div>
            <div style={{ marginTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/" className="btn-ghost">Back to home</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
