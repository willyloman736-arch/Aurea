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
              <h5>Platform</h5>
              <Link href="#">Tracking API</Link>
              <Link href="#">Webhooks</Link>
              <Link href="#">Dashboards</Link>
            </div>
            <div>
              <h5>Developers</h5>
              <Link href="#">Reference</Link>
              <Link href="#">SDKs</Link>
              <Link href="#">Status</Link>
            </div>
            <div>
              <h5>Company</h5>
              <Link href="#">About</Link>
              <Link href="#">Careers</Link>
              <Link href="#">Press</Link>
            </div>
            <div>
              <h5>Legal</h5>
              <Link href="#">Privacy</Link>
              <Link href="#">Terms</Link>
              <Link href="#">Security</Link>
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
