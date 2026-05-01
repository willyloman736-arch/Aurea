import Link from "next/link";
import { Ambient } from "@/components/ambient";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function NotFound() {
  return (
    <>
      <Ambient />
      <Nav />
      <main>
        <section className="hero" style={{ paddingTop: 120, paddingBottom: 120 }}>
          <div className="container-USPS-S" style={{ position: "relative", zIndex: 2 }}>
            <div className="eyebrow"><span className="eyebrow-dot" /> Not found</div>
            <h1 className="hero-title">
              We don&apos;t recognize <em>that tracking number.</em>
            </h1>
            <p className="hero-lede">
              It may be mistyped, expired (30+ days after delivery), or issued by a carrier we haven&apos;t ingested yet. Try one of the demo IDs below, or paste a different tracking number.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/" className="btn-primary">Back to home</Link>
              <Link href="/#track" className="btn-ghost">Try another number</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
