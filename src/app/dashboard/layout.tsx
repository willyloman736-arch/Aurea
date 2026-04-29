import type { Metadata } from "next";
import { Sidebar } from "@/components/dashboard/sidebar";
import { hasDatabase } from "@/lib/db";

export const metadata: Metadata = {
  title: "Dashboard — Aurea",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDemo = !hasDatabase();
  return (
    <div className="dash-shell">
      <Sidebar />
      <div className="dash-main">
        {isDemo && (
          <div className="demo-banner" role="status">
            <span className="demo-banner-dot" />
            <span>
              <strong>Demo mode</strong> · in-memory store, data resets on
              cold-start. Connect Neon to persist.
            </span>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
