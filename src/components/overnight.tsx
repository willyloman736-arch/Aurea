import { Moon, Truck, Sun } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

export function Overnight() {
  return (
    <section className="overnight" id="overnight">
      <div className="container-aurea">
        <div className="overnight-grid">
          <ScrollReveal className="overnight-copy">
            <span className="eyebrow-inline">Overnight &amp; same-day</span>
            <h2 className="section-title">
              When it can&rsquo;t wait <em>until morning.</em>
            </h2>
            <p className="section-sub">
              Our hubs run twenty-four hours. Cargo loaded at midnight is on a
              doorstep before nine — across thirty cities, every weekday. No
              surcharge math, no eleventh-hour exceptions.
            </p>
            <ul className="overnight-points">
              <li>
                <Moon size={14} strokeWidth={1.5} />
                <div>
                  <strong>11pm cutoff</strong>
                  <span>Last pickup window for next-day delivery</span>
                </div>
              </li>
              <li>
                <Truck size={14} strokeWidth={1.5} />
                <div>
                  <strong>Sealed in transit</strong>
                  <span>One driver, one truck, no rehandling</span>
                </div>
              </li>
              <li>
                <Sun size={14} strokeWidth={1.5} />
                <div>
                  <strong>9am delivery</strong>
                  <span>On a doorstep before the day starts</span>
                </div>
              </li>
            </ul>
          </ScrollReveal>

          <ScrollReveal as="div" className="overnight-visual">
            <div className="overnight-image-frame">
              {/* Save image at: aurea/public/overnight.jpg */}
              <img
                src="/overnight.jpg"
                alt="Aurea overnight loading bay — couriers loading parcels into a van after dark"
                className="overnight-image"
                loading="lazy"
              />
              <div className="overnight-image-stamp">
                <span className="overnight-image-dot" />
                Live · 02:14 · Dispatch hub
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
