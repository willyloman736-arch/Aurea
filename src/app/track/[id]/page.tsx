import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Ambient } from "@/components/ambient";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { TrackingResult } from "@/components/tracking-result";
import { getShipment } from "@/content/shipments";

interface Params {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const shipment = getShipment(decodeURIComponent(id));
  if (!shipment) return { title: "Tracking not found — Aurea" };
  return {
    title: `${shipment.id} · ${shipment.status} — Aurea`,
    description: `Tracking ${shipment.id} from ${shipment.origin.city} to ${shipment.destination.city}.`,
  };
}

export default async function TrackPage({ params }: Params) {
  const { id } = await params;
  const decoded = decodeURIComponent(id);
  const shipment = getShipment(decoded);

  if (!shipment) notFound();

  return (
    <>
      <Ambient />
      <Nav />
      <main style={{ paddingTop: 60 }}>
        <TrackingResult shipment={shipment} />
      </main>
      <Footer />
    </>
  );
}
