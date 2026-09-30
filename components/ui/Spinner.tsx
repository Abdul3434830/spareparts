import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  color?: "amber" | "white" | "zinc";
}

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-2",
  xl: "h-16 w-16 border-4",
};

const colorMap = {
  amber: "border-brand-amber/20 border-t-brand-amber",
  white: "border-brand-white/20 border-t-brand-white",
  zinc: "border-brand-zinc-600 border-t-brand-zinc-300",
};

export function Spinner({
  size = "md",
  className,
  color = "amber",
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "animate-spin rounded-full",
        sizeMap[size],
        colorMap[color],
        className
      )}
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" />
        <p className="text-brand-zinc-400 text-sm animate-pulse">Loading…</p>
      </div>
    </div>
  );
}
