import Link from "next/link";
import type { Metadata } from "next";
import { Ambient } from "@/components/ambient";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Get started — Aurea",
};

export default function SignUpPage() {
  return (
    <>
      <Ambient />
      <Nav />
      <main>
        <section className="hero" style={{ paddingTop: 120, paddingBottom: 120, minHeight: "70vh" }}>
          <div className="container-aurea" style={{ position: "relative", zIndex: 2 }}>
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              Private beta
            </div>
            <h1 className="hero-title">
              Join the <em>waitlist.</em>
            </h1>
            <p className="hero-lede">
              Aurea is in private beta while we onboard our first operators. Full access — API keys, dashboard, webhooks — rolls out in Phase 3. Leave your email and we&apos;ll reach out in order.
            </p>
            <form
              className="track-card"
              style={{ maxWidth: 520, padding: 20, animation: "none" }}
              action="mailto:hello@aurea.example"
              method="post"
            >
              <div className="track-form">
                <div className="track-input-wrap">
                  <input
                    type="email"
                    name="email"
                    className="track-input"
                    placeholder="you@company.com"
                    required
                    style={{ padding: "14px 4px" }}
                  />
                </div>
                <button type="submit" className="btn-primary btn-track">Request access</button>
              </div>
            </form>
            <div style={{ marginTop: 24 }}>
              <Link href="/" className="btn-text">← Back to home</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
