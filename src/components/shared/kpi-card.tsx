import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { KpiMetric } from "@/types/analytics";

interface KpiCardProps {
  metric: KpiMetric;
  className?: string;
}

export function KpiCard({ metric, className }: KpiCardProps) {
  const { label, formatted, change, trend } = metric;

  return (
    <div
      className={cn(
        "rounded-lg bg-panel border border-border p-5 flex flex-col gap-3",
        className
      )}
    >
      <p className="text-[11px] uppercase tracking-widest text-[#625d58] font-medium">
        {label}
      </p>
      <p className="font-serif text-3xl font-medium text-ink leading-none">
        {formatted}
      </p>
      <div
        className={cn(
          "flex items-center gap-1 text-xs font-medium",
          trend === "up" && "text-[#536443]",
          trend === "down" && "text-[#9e4d3b]",
          trend === "flat" && "text-[#625d58]"
        )}
      >
        {trend === "up" && <TrendingUp className="size-3" />}
        {trend === "down" && <TrendingDown className="size-3" />}
        {trend === "flat" && <Minus className="size-3" />}
        <span>
          {change > 0 ? "+" : ""}
          {change}% vs last period
        </span>
      </div>
    </div>
  );
}
