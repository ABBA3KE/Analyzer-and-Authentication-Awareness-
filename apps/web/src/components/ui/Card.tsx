import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function Card({
  children,
  className = "",
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={`rounded-md border border-ink-600 bg-ink-800 p-5 ${
        interactive ? "transition-colors duration-150 hover:border-ink-500" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="font-display text-sm font-semibold tracking-tight text-mist-100">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-mist-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}

interface Trend {
  direction: "up" | "down";
  value: string;
  positive?: boolean; // whether an "up" trend is a good thing (default true)
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  trend?: Trend;
}) {
  const isGood = trend ? (trend.direction === "up") === (trend.positive ?? true) : true;
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-mist-400">{label}</p>
        {Icon && (
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-signal/10 text-signal">
            <Icon size={14} />
          </span>
        )}
      </div>
      <p className="mt-2 font-display text-[1.75rem] font-semibold leading-none tracking-tight text-mist-100">
        {value}
      </p>
      <div className="mt-2 flex items-center gap-1.5">
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium ${
              isGood ? "bg-success-bg text-success" : "bg-danger-bg text-danger"
            }`}
          >
            {trend.direction === "up" ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
            {trend.value}
          </span>
        )}
        {hint && <p className="text-xs text-mist-500">{hint}</p>}
      </div>
    </Card>
  );
}
