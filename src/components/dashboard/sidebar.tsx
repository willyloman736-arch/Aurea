"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Plus,
  Settings,
  LogOut,
  FileText,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PRIMARY_NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/shipments", label: "Shipments", icon: Package },
  { href: "/dashboard/shipments/new", label: "New shipment", icon: Plus },
];

const SECONDARY_NAV = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "#", label: "API docs", icon: FileText },
  { href: "#", label: "Status", icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className="dash-sidebar">
      <Link href="/" className="dash-brand">
        <span className="brand-mark">◈</span>
        <span className="brand-text">Aurea</span>
        <span className="dash-brand-env">admin</span>
      </Link>

      <nav className="dash-nav">
        <div className="dash-nav-group">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("dash-nav-link", isActive(item.href, item.exact) && "active")}
            >
              <item.icon size={15} strokeWidth={1.5} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="dash-nav-group dash-nav-secondary">
          {SECONDARY_NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn("dash-nav-link", isActive(item.href) && "active")}
            >
              <item.icon size={15} strokeWidth={1.5} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="dash-profile">
        <div className="dash-avatar">AX</div>
        <div className="dash-profile-info">
          <div className="dash-profile-name">Admin</div>
          <div className="dash-profile-email">ops@aurea.example</div>
        </div>
        <button className="dash-icon-btn" title="Sign out" aria-label="Sign out">
          <LogOut size={14} strokeWidth={1.5} />
        </button>
      </div>
    </aside>
  );
}
