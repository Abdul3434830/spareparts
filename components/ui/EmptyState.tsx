import * as React from "react";
import Link from "next/link";
import { LucideIcon, PackageOpen, Wrench, ShoppingBag, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
  secondaryAction,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-brand-zinc-700 bg-brand-zinc/50",
        compact ? "py-8 px-4" : "py-16 px-6 sm:px-12",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl bg-brand-zinc-800 border border-brand-zinc-700 text-brand-amber shadow-inner",
          compact ? "h-12 w-12 mb-3" : "h-16 w-16 mb-5"
        )}
      >
        <Icon className={compact ? "h-6 w-6" : "h-8 w-8"} aria-hidden="true" />
      </div>

      <h3
        className={cn(
          "font-heading font-bold text-brand-white tracking-wide",
          compact ? "text-base" : "text-xl sm:text-2xl"
        )}
      >
        {title}
      </h3>

      {description && (
        <p
          className={cn(
            "text-brand-zinc-400 max-w-md mx-auto mt-2 leading-relaxed",
            compact ? "text-xs" : "text-sm"
          )}
        >
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          {action && (
            action.href ? (
              <Link href={action.href}>
                <Button variant="primary" size={compact ? "sm" : "md"}>
                  {action.label}
                </Button>
              </Link>
            ) : (
              <Button onClick={action.onClick} variant="primary" size={compact ? "sm" : "md"}>
                {action.label}
              </Button>
            )
          )}
          {secondaryAction && (
            secondaryAction.href ? (
              <Link href={secondaryAction.href}>
                <Button variant="outline" size={compact ? "sm" : "md"}>
                  {secondaryAction.label}
                </Button>
              </Link>
            ) : (
              <Button onClick={secondaryAction.onClick} variant="outline" size={compact ? "sm" : "md"}>
                {secondaryAction.label}
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
}

// Common specialized Empty States
export function NoProductsEmptyState({
  title = "No parts found",
  description = "We couldn't find any auto parts matching your current filters or search query.",
  onResetFilters,
}: {
  title?: string;
  description?: string;
  onResetFilters?: () => void;
}) {
  return (
    <EmptyState
      icon={Search}
      title={title}
      description={description}
      action={
        onResetFilters
          ? {
              label: "Clear All Filters",
              onClick: onResetFilters,
            }
          : undefined
      }
    />
  );
}

export function NoOrdersEmptyState() {
  return (
    <EmptyState
      icon={ShoppingBag}
      title="No orders placed yet"
      description="When you purchase parts, your order history and tracking status will appear here."
      action={{
        label: "Browse Parts Catalog",
        href: "/shop",
      }}
    />
  );
}

export function EmptyGarageState() {
  return (
    <EmptyState
      icon={Wrench}
      title="Your garage is empty"
      description="Add your vehicle to find guaranteed fitting parts with zero guesswork."
      action={{
        label: "Add Vehicle",
        href: "#vehicle-selector",
      }}
    />
  );
}
