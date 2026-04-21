import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { StatusPill } from "./status-pill";
import type { DashboardShipmentRow } from "@/lib/dashboard-queries";

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

interface Props {
  rows: DashboardShipmentRow[];
  emptyTitle?: string;
  emptyBody?: string;
  showHeader?: boolean;
}

export function ShipmentTable({
  rows,
  emptyTitle = "No shipments yet",
  emptyBody = "Create a tracker or wait for the first carrier update to flow in.",
  showHeader = true,
}: Props) {
  if (rows.length === 0) {
    return (
      <div className="dash-empty">
        <div className="dash-empty-icon">📦</div>
        <h3>{emptyTitle}</h3>
        <p>{emptyBody}</p>
        <Link href="/dashboard/shipments/new" className="btn-primary">
          Create tracker
        </Link>
      </div>
    );
  }

  return (
    <div className="dash-table-wrap">
      <table className="dash-table">
        {showHeader && (
          <thead>
            <tr>
              <th>Tracking #</th>
              <th>Status</th>
              <th>Carrier</th>
              <th>Route</th>
              <th>ETA</th>
              <th className="right">Updated</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="dash-table-code">
                <Link href={`/dashboard/shipments/${r.id}`}>{r.trackingCode}</Link>
              </td>
              <td>
                <StatusPill status={r.status} />
              </td>
              <td className="dash-table-muted">{r.carrier ?? "—"}</td>
              <td>
                <span className="dash-route">
                  <span>{r.originCity ?? "—"}</span>
                  <ArrowRight size={12} strokeWidth={1.5} />
                  <span>{r.destCity ?? "—"}</span>
                </span>
              </td>
              <td className="dash-table-muted">{r.etaDate ?? "Pending"}</td>
              <td className="right dash-table-muted">{timeAgo(r.updatedAt)}</td>
              <td className="right">
                <Link href={`/dashboard/shipments/${r.id}`} className="dash-icon-btn">
                  <ChevronRight size={14} strokeWidth={1.5} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
