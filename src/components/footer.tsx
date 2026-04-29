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
              <Link href="#how">Express parcel</Link>
              <Link href="#how">International freight</Link>
              <Link href="#how">Same-day pickup</Link>
            </div>
            <div>
              <h5>Coverage</h5>
              <Link href="#network">Network hubs</Link>
              <Link href="#network">Lane map</Link>
              <Link href="#faq">Customs &amp; duties</Link>
            </div>
            <div>
              <h5>Company</h5>
              <Link href="#customers">Customers</Link>
              <Link href="#">Careers</Link>
              <Link href="mailto:hello@aurealogistics.com">Contact</Link>
            </div>
            <div>
              <h5>Legal</h5>
              <Link href="#">Privacy</Link>
              <Link href="#">Terms</Link>
              <Link href="#">Insurance</Link>
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
