import type { Metadata } from "next";
import { Sidebar } from "@/components/dashboard/sidebar";

export const metadata: Metadata = {
  title: "Dashboard — Aurea",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dash-shell">
      <Sidebar />
      <div className="dash-main">{children}</div>
    </div>
  );
}
