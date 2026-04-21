import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const serif = Instrument_Serif({
  variable: "--font-serif-display",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aurea — Global shipment visibility",
  description:
    "Shipment tracking, engineered for scale. Real-time visibility across 220 countries — one API, 18 million daily events.",
  metadataBase: new URL("https://aurea.example"),
  openGraph: {
    title: "Aurea — Global shipment visibility",
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
    <html lang="en" className={`${inter.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
