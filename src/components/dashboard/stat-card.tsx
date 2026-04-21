import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  delta?: { value: number; label?: string };
  variant?: "default" | "accent" | "warning";
}

export function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  delta,
  variant = "default",
}: StatCardProps) {
  const DeltaIcon = !delta
    ? Minus
    : delta.value > 0
      ? TrendingUp
      : delta.value < 0
        ? TrendingDown
        : Minus;

  return (
    <div className={cn("dash-stat", `dash-stat-${variant}`)}>
      <div className="dash-stat-head">
        <span className="dash-stat-label">{label}</span>
        {Icon && <Icon size={14} strokeWidth={1.5} className="dash-stat-icon" />}
      </div>
      <div className="dash-stat-value">
        <span>{value}</span>
        {unit && <em className="dash-stat-unit">{unit}</em>}
      </div>
      {delta && (
        <div
          className={cn(
            "dash-stat-delta",
            delta.value > 0 && "up",
            delta.value < 0 && "down",
          )}
        >
          <DeltaIcon size={11} strokeWidth={2} />
          <span>
            {delta.value > 0 ? "+" : ""}
            {delta.value}%
          </span>
          {delta.label && <span className="dash-stat-delta-label">{delta.label}</span>}
        </div>
      )}
    </div>
  );
}
