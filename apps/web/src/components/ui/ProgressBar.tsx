export function ProgressBar({
  value,
  colorClass = "bg-signal",
  size = "md",
}: {
  value: number;
  colorClass?: string;
  size?: "sm" | "md";
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`w-full overflow-hidden rounded-full bg-ink-700 ${size === "sm" ? "h-1.5" : "h-2"}`}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-500 ease-out ${colorClass}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
