import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Ambient } from "@/components/ambient";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { TrackingResult } from "@/components/tracking-result";
import { lookupShipment } from "@/lib/shipments";

interface Params {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const shipment = await lookupShipment(decodeURIComponent(id));
  if (!shipment) return { title: "Tracking not found — Aurea" };
  return {
    title: `${shipment.id} · ${shipment.status} — Aurea`,
    description: `Tracking ${shipment.id} from ${shipment.origin.city} to ${shipment.destination.city}.`,
  };
}

export default async function TrackPage({ params }: Params) {
  const { id } = await params;
  const shipment = await lookupShipment(decodeURIComponent(id));

  if (!shipment) notFound();

  return (
    <>
      <Ambient />
      <Nav />
      <main id="main-content" style={{ paddingTop: 60 }}>
        <TrackingResult shipment={shipment} />
      </main>
      <Footer />
    </>
  );
}
