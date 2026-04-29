import Link from "next/link";
import { ScrollReveal } from "./scroll-reveal";

export function Cta() {
  return (
    <section className="cta" id="get-started">
      <ScrollReveal className="container-aurea cta-inner">
        <h2 className="section-title">Send your first package this week.</h2>
        <p>No subscription. No minimums. Pay per shipment, with volume discounts past 50 a month.</p>
        <div className="cta-actions">
          <Link href="/sign-up" className="btn-primary btn-lg" data-magnetic>Get a quote</Link>
          <Link href="mailto:hello@aurealogistics.com?subject=Talk%20to%20ops" className="btn-ghost btn-lg" data-magnetic>Talk to ops</Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
