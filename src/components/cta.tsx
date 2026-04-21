import Link from "next/link";
import { ScrollReveal } from "./scroll-reveal";

export function Cta() {
  return (
    <section className="cta" id="pricing">
      <ScrollReveal className="container-aurea cta-inner">
        <h2 className="section-title">Start tracking in under five minutes.</h2>
        <p>Fourteen-day free trial. No credit card. Cancel anytime.</p>
        <div className="cta-actions">
          <Link href="/sign-up" className="btn-primary btn-lg">Start tracking free</Link>
          <Link href="#" className="btn-ghost btn-lg">Book a demo</Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
