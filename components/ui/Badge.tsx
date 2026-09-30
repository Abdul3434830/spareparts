import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-semibold transition-colors",
  {
    variants: {
      variant: {
        amber: "bg-brand-amber text-brand-black",
        "amber-outline":
          "border border-brand-amber text-brand-amber bg-transparent",
        zinc: "bg-brand-zinc-700 text-brand-zinc-300",
        green: "bg-green-900/60 text-green-300 border border-green-700/50",
        red: "bg-red-900/60 text-red-300 border border-red-700/50",
        blue: "bg-blue-900/60 text-blue-300 border border-blue-700/50",
        yellow: "bg-yellow-900/60 text-yellow-300 border border-yellow-700/50",
        purple:
          "bg-purple-900/60 text-purple-300 border border-purple-700/50",
      },
      size: {
        sm: "px-1.5 py-0.5 text-xs",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "zinc",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

const dotColorMap: Record<string, string> = {
  amber: "bg-brand-black",
  "amber-outline": "bg-brand-amber",
  zinc: "bg-brand-zinc-400",
  green: "bg-green-400 animate-pulse",
  red: "bg-red-400",
  blue: "bg-blue-400",
  yellow: "bg-yellow-400",
  purple: "bg-purple-400",
};

function Badge({ className, variant = "zinc", size, dot = false, children, ...props }: BadgeProps) {
  const dotColor = variant ? dotColorMap[variant] || "bg-current" : "bg-current";

  return (
    <span className={cn(badgeVariants({ variant, size, className }))} {...props}>
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full inline-block shrink-0", dotColor)}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
