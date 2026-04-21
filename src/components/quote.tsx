import { ScrollReveal } from "./scroll-reveal";

export function Quote() {
  return (
    <section className="editorial" id="platform">
      <div className="container-aurea">
        <ScrollReveal as="figure" className="quote">
          <blockquote>
            <em>
              &ldquo;We replaced four tracking integrations with one Aurea endpoint. Our ops team got six hours back every week, and our on-time number finally started telling the truth.&rdquo;
            </em>
          </blockquote>
          <figcaption>
            <span className="cite-name">Maya Aldrin</span>
            <span className="cite-role">VP Operations, Vendr</span>
          </figcaption>
        </ScrollReveal>
      </div>
    </section>
  );
}
