import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex animate-fade-in flex-col items-center justify-center rounded-md border border-dashed border-ink-600 bg-ink-800/40 px-6 py-14 text-center">
      <span className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-full bg-ink-700 text-mist-400">
        <Icon size={20} />
      </span>
      <p className="font-display text-base font-semibold text-mist-100">{title}</p>
      <p className="mt-1.5 max-w-sm text-sm text-mist-400">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
