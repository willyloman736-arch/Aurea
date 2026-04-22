import { Ambient } from "@/components/ambient";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Metrics } from "@/components/metrics";
import { HowItWorks } from "@/components/how-it-works";
import { Network } from "@/components/network";
import { Integrations } from "@/components/integrations";
import { Quote } from "@/components/quote";
import { Pricing } from "@/components/pricing";
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
        <HowItWorks />
        <Network />
        <Integrations />
        <Quote />
        <Pricing />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
