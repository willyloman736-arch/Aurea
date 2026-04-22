import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DashHeader } from "@/components/dashboard/header";
import { NewShipmentForm } from "./form";

export default function NewShipmentPage() {
  return (
    <>
      <DashHeader
        title="New shipment"
        subtitle="Create a tracker that watches a carrier tracking number"
        actions={
          <Link href="/dashboard/shipments" className="btn-ghost btn-sm">
            <ArrowLeft size={13} strokeWidth={1.5} />
            Back
          </Link>
        }
      />

      <div className="dash-content">
        <div className="dash-card dash-card-form">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">Create a tracker</h2>
              <p className="dash-card-sub">
                Paste a carrier tracking number. Aurea will auto-detect the carrier and
                start monitoring events from EasyPost.
              </p>
            </div>
          </div>

          <NewShipmentForm />
        </div>

        <div className="dash-card dash-card-info">
          <h3>How it works</h3>
          <ol className="dash-steps">
            <li>
              <strong>Submit</strong> the tracking number. Aurea detects the
              carrier from the number format (UPS 1Z…, USPS 94…, etc.).
            </li>
            <li>
              <strong>Aurea registers a tracker</strong> with Shippo; supports
              USPS, UPS, FedEx, DHL, and 70+ carriers.
            </li>
            <li>
              <strong>Events flow in</strong> as the carrier scans the package.
              A Shippo <code>track_updated</code> webhook keeps the cache fresh — no polling.
            </li>
            <li>
              <strong>Customers see live status</strong> at
              <code>/track/[tracking-number]</code> (public, shareable).
            </li>
          </ol>
        </div>
      </div>
    </>
  );
}
