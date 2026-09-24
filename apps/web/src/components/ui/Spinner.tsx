export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2.5 text-mist-400" role="status" aria-live="polite">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-600 border-t-signal" />
      <span className="text-sm">{label}…</span>
    </div>
  );
}

export function FullPageSpinner({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner label={label} />
    </div>
  );
}
