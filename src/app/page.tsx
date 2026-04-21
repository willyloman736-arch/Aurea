import { Ambient } from "@/components/ambient";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Metrics } from "@/components/metrics";
import { Network } from "@/components/network";
import { Quote } from "@/components/quote";
import { Cta } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <Ambient />
      <Nav />
      <main id="main-content">
        <Hero />
        <Metrics />
        <Network />
        <Quote />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
