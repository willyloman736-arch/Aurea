import Link from "next/link";
import { Plus } from "lucide-react";
import { DashHeader } from "@/components/dashboard/header";
import { ShipmentTable } from "@/components/dashboard/shipment-table";
import { getShipments } from "@/lib/dashboard-queries";

export const dynamic = "force-dynamic";

export default async function ShipmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const rows = await getShipments(200, q);

  return (
    <>
      <DashHeader
        title="Shipments"
        subtitle={`${rows.length} ${rows.length === 1 ? "shipment" : "shipments"}${q ? ` matching "${q}"` : ""}`}
        actions={
          <Link href="/dashboard/shipments/new" className="btn-primary">
            <Plus size={14} strokeWidth={2} />
            New shipment
          </Link>
        }
      />

      <div className="dash-content">
        <form className="dash-filter-bar" action="/dashboard/shipments" method="GET">
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search by tracking #, carrier, or city…"
            className="dash-input"
          />
          <button type="submit" className="btn-ghost btn-sm">Filter</button>
          {q && (
            <Link href="/dashboard/shipments" className="btn-text btn-sm">
              Clear
            </Link>
          )}
        </form>

        <div className="dash-card dash-card-tight">
          <ShipmentTable rows={rows} />
        </div>
      </div>
    </>
  );
}
