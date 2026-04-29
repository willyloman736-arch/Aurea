import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Ambient } from "./ambient";
import { Nav } from "./nav";
import { Footer } from "./footer";

interface PageShellProps {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
}

export function PageShell({ eyebrow, title, lede, children }: PageShellProps) {
  return (
    <>
      <Ambient />
      <Nav />
      <main id="main-content" className="static-main">
        <section className="page-hero">
          <div className="container-aurea">
            <Link href="/" className="page-back">
              <ArrowLeft size={13} strokeWidth={1.5} />
              <span>Back to home</span>
            </Link>
            <span className="eyebrow-inline">{eyebrow}</span>
            <h1 className="page-title">{title}</h1>
            {lede && <p className="page-lede">{lede}</p>}
          </div>
        </section>
        <section className="page-content">
          <div className="container-aurea page-content-inner">
            {children}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
