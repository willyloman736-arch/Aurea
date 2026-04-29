import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer-wrap" id="support">
      <div className="container-aurea footer-inner">
        <div className="footer-top">
          <Link href="/" className="brand">
            <span className="brand-mark">◈</span>
            <span className="brand-text">Aurea</span>
          </Link>
          <div className="footer-cols">
            <div>
              <h5>Services</h5>
              <Link href="/services#express">Express parcel</Link>
              <Link href="/services#international">International freight</Link>
              <Link href="/services#same-day">Same-day pickup</Link>
            </div>
            <div>
              <h5>Coverage</h5>
              <Link href="/coverage#hubs">Network hubs</Link>
              <Link href="/coverage#lanes">Lane map</Link>
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
            </div>
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
