import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "subtle";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-signal text-white shadow-card hover:bg-signal-dim active:bg-signal-dim focus-visible:ring-2 focus-visible:ring-signal/50",
  secondary:
    "bg-ink-700 text-mist-100 border border-ink-600 hover:bg-ink-600 hover:border-ink-500 active:bg-ink-600",
  subtle:
    "bg-signal/10 text-signal border border-signal/20 hover:bg-signal/15",
  ghost:
    "text-mist-300 hover:bg-ink-700 hover:text-mist-100",
  danger:
    "bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-[38px] px-4 text-sm gap-2",
  lg: "h-11 px-5 text-sm gap-2",
  icon: "h-9 w-9 p-0",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "primary", size = "md", loading = false, disabled, className = "", children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex select-none items-center justify-center whitespace-nowrap rounded-md font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${sizes[size]} ${variants[variant]} ${className}`}
        {...rest}
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
