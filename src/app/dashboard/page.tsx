import Link from "next/link";
import { Package, Truck, CheckCircle2, AlertTriangle } from "lucide-react";
import { DashHeader } from "@/components/dashboard/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ShipmentTable } from "@/components/dashboard/shipment-table";
import { getStats, getShipments } from "@/lib/dashboard-queries";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const [stats, recent] = await Promise.all([getStats(), getShipments(8)]);

  return (
    <>
      <DashHeader
        title="Overview"
        subtitle="Operations at a glance"
        actions={
          <Link href="/dashboard/shipments/new" className="btn-primary">
            New shipment
          </Link>
        }
      />

      <div className="dash-content">
        {!stats.dbConfigured && (
          <div className="dash-notice">
            <strong>Database not connected.</strong> Real shipments will appear here once{" "}
            <code>DATABASE_URL</code> is set. Meanwhile, demo data flows through
            the public tracking page. See{" "}
            <Link href="/dashboard/settings">Settings</Link> for status.
          </div>
        )}

        <div className="dash-stats-grid">
          <StatCard
            label="Total shipments"
            value={stats.total}
            icon={Package}
            delta={{ value: 12, label: "vs last week" }}
          />
          <StatCard
            label="In motion"
            value={stats.inTransit}
            icon={Truck}
            variant="accent"
            delta={{ value: 8 }}
          />
          <StatCard
            label="Delivered"
            value={stats.delivered}
            icon={CheckCircle2}
            delta={{ value: 24, label: "this week" }}
          />
          <StatCard
            label="Exceptions"
            value={stats.exceptions}
            icon={AlertTriangle}
            variant="warning"
            delta={{ value: -3 }}
          />
        </div>

        <div className="dash-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Recent shipments</h2>
              <p className="dash-card-sub">The last 8 tracked packages across your network</p>
            </div>
            <Link href="/dashboard/shipments" className="btn-ghost btn-sm">
              View all
            </Link>
          </div>
          <ShipmentTable rows={recent} />
        </div>
      </div>
    </>
  );
}
