import { cn } from "@/lib/utils";

const VARIANT: Record<string, string> = {
  "In Transit": "transit",
  "Out for delivery": "transit",
  "Delivered": "delivered",
  "Exception": "exception",
  "Label created": "pending",
  "Pending": "pending",
};

export function StatusPill({ status }: { status: string }) {
  const variant = VARIANT[status] ?? "pending";
  return <span className={cn("dash-pill", `dash-pill-${variant}`)}>{status}</span>;
}
