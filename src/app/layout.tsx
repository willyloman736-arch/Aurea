import type { Metadata, Viewport } from "next";
import { Public_Sans } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CursorGlow } from "@/components/cursor-glow";
import { ScrollProgress } from "@/components/scroll-progress";
import { CommandPalette } from "@/components/command-palette";
import { MagneticEffects } from "@/components/magnetic-effects";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

// Both old token names map to Public Sans now — keeps existing CSS working
// while we deprecate references to --font-serif-display.
const fontVars = `${publicSans.variable}`;

export const metadata: Metadata = {
  title: "USPS-S — Global shipment visibility",
  description:
    "Shipment tracking, engineered for scale. Real-time visibility across 220 countries — one API, 18 million daily events.",
  metadataBase: new URL("https://usps-s.com"),
  openGraph: {
    title: "USPS-S — Global shipment visibility",
    description: "Real-time shipment tracking across 220 countries.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0f13",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVars}>
      <head>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important;}`}</style>
        </noscript>
      </head>
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <ScrollProgress />
        <SmoothScroll>{children}</SmoothScroll>
        <CursorGlow />
        <CommandPalette />
        <MagneticEffects />
      </body>
    </html>
  );
}
