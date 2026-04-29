import { Ambient } from "@/components/ambient";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Metrics } from "@/components/metrics";
import { HowItWorks } from "@/components/how-it-works";
import { DashboardPreview } from "@/components/dashboard-preview";
import { Network } from "@/components/network";
import { CaseStudies } from "@/components/case-studies";
import { Faq } from "@/components/faq";
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
        <DashboardPreview />
        <Network />
        <CaseStudies />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
