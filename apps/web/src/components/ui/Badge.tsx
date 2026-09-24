import type { ReactNode } from "react";

type Tone = "neutral" | "success" | "warning" | "danger" | "signal";

const tones: Record<Tone, string> = {
  neutral: "bg-ink-700 text-mist-300 border border-ink-600",
  success: "bg-success-bg text-success border border-success/20",
  warning: "bg-warning-bg text-warning border border-warning/20",
  danger: "bg-danger-bg text-danger border border-danger/20",
  signal: "bg-signal/10 text-signal border border-signal/20",
};

export function Badge({
  children,
  tone = "neutral",
  dot = false,
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  );
}
