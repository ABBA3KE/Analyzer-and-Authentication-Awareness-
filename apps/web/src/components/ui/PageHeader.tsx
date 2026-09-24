import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-signal">{eyebrow}</p>
        )}
        <h1 className="font-display text-2xl font-semibold tracking-tight text-mist-100 sm:text-[1.75rem]">
          {title}
        </h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-mist-400">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
