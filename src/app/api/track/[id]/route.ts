import { NextResponse } from "next/server";
import { lookupShipment } from "@/lib/shipments";

export const dynamic = "force-dynamic";

/**
 * GET /api/track/:id
 *
 * Public read endpoint for shipment status.
 * Resolves from demo → DB cache → EasyPost → 404.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const shipment = await lookupShipment(decodeURIComponent(id));

  if (!shipment) {
    return NextResponse.json(
      { error: "Tracking number not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({ shipment });
}
