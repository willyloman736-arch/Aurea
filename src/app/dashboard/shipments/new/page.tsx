import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DashHeader } from "@/components/dashboard/header";
import { NewShipmentForm } from "./form";

export default function NewShipmentPage() {
  return (
    <>
      <DashHeader
        title="New shipment"
        subtitle="Log a package, tag a recipient, hand it off — USPS-S generates the tracking code."
        actions={
          <Link href="/dashboard/shipments" className="btn-ghost btn-sm">
            <ArrowLeft size={13} strokeWidth={1.5} />
            Back
          </Link>
        }
      />

      <div className="dash-content">
        <NewShipmentForm />
      </div>
    </>
  );
}
