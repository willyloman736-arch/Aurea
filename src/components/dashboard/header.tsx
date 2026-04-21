import { Search, Bell } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function DashHeader({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="dash-header">
      <div className="dash-header-titles">
        <h1 className="dash-title">{title}</h1>
        {subtitle && <p className="dash-subtitle">{subtitle}</p>}
      </div>

      <div className="dash-header-right">
        <div className="dash-search">
          <Search size={14} strokeWidth={1.5} />
          <input
            type="search"
            placeholder="Search shipments, tracking #, customers…"
            aria-label="Global search"
          />
          <kbd className="dash-kbd">⌘K</kbd>
        </div>

        <button className="dash-icon-btn dash-icon-btn-lg" aria-label="Notifications">
          <Bell size={15} strokeWidth={1.5} />
          <span className="dash-dot" />
        </button>

        {actions}
      </div>
    </header>
  );
}
