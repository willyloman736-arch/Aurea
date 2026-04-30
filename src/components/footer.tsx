import Link from "next/link";
import Image from "next/image";


const FOOTER_PARTNERS = [
  { name: "FedEx", src: "/badges/fedex.png" },
  { name: "USPS", src: "/badges/usps.png" },
  { name: "DHL", src: "/badges/dhl.png" },
  { name: "UPS", src: "/badges/ups.jpg" },
] as const;

export function Footer() {
  return (
    <footer className="footer-wrap" id="support">
      <div className="container-aurea footer-inner">
        <div className="footer-top">
          <Link href="/" className="brand" aria-label="Aurea — home">
            <Image
              src="/logo.svg"
              alt="Aurea"
              width={40}
              height={40}
              className="brand-mark brand-mark-img"
            />
          </Link>
          <div className="footer-cols">
            <div>
              <h5>Services</h5>
              <Link href="/quote">Get a quote</Link>
              <Link href="/book">Book a pickup</Link>
              <Link href="/services">All services</Link>
            </div>
            <div>
              <h5>Coverage</h5>
              <Link href="/portal">Live portal</Link>
              <Link href="/coverage#hubs">Network hubs</Link>
              <Link href="/coverage#customs">Customs &amp; duties</Link>
            </div>
            <div>
              <h5>Company</h5>
              <Link href="/#customers">Customers</Link>
              <Link href="/careers">Careers</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div>
              <h5>Legal</h5>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/insurance">Insurance</Link>
              <Link href="/claims">File a claim</Link>
            </div>
          </div>
        </div>
        <div className="footer-partners" aria-label="Last-mile carrier partners">
          <span className="footer-partners-label">Last-mile partners</span>
          <div className="footer-partners-row">
            {FOOTER_PARTNERS.map((p) => (
              <div key={p.name} className="footer-partner-badge">
                <Image
                  src={p.src}
                  alt={`${p.name} logo`}
                  className="footer-partner-img"
                  width={300}
                  height={120}
                  sizes="100px"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} Aurea Logistics</span>
          <span className="footer-badges">
            <span>SOC 2</span>
            <span>ISO 27001</span>
            <span>GDPR</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
