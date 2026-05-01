import { Ambient } from "@/components/ambient";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function Loading() {
  return (
    <>
      <Ambient />
      <Nav />
      <main style={{ paddingTop: 60 }}>
        <section className="result-section">
          <div className="container-USPS-S">
            <div className="result-shell">
              <div className="result-loading">
                <div className="spinner" />
                <div style={{ color: "var(--text-2)", fontSize: 14 }}>
                  Querying the USPS-S network…
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
