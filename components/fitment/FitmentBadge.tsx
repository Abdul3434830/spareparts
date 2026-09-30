"use client";

import { useGarageStore } from "@/store/garage";
import { checkFitment, FitmentRecord } from "@/lib/fitment";
import { Badge } from "@/components/ui";
import { CheckCircle2, XCircle, HelpCircle, Sparkles } from "lucide-react";

interface FitmentBadgeProps {
  fitments?: FitmentRecord[];
  tags?: string[];
  onOpenSelector?: () => void;
  className?: string;
  showVehicleName?: boolean;
}

export function FitmentBadge({
  fitments = [],
  tags = [],
  onOpenSelector,
  className = "",
  showVehicleName = true,
}: FitmentBadgeProps) {
  const { activeVehicle } = useGarageStore();
  const result = checkFitment({ fitments, tags }, activeVehicle);

  if (result.status === "universal") {
    return (
      <Badge variant="amber" className={`inline-flex items-center gap-1.5 ${className}`}>
        <Sparkles className="w-3.5 h-3.5" />
        <span>Universal Fitment</span>
      </Badge>
    );
  }

  if (result.status === "fits") {
    return (
      <Badge variant="green" dot className={`inline-flex items-center gap-1.5 font-semibold ${className}`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>
          {showVehicleName && activeVehicle
            ? `Fits Your ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}`
            : "Guaranteed to Fit"}
        </span>
      </Badge>
    );
  }

  if (result.status === "does_not_fit") {
    return (
      <Badge variant="red" dot className={`inline-flex items-center gap-1.5 font-semibold ${className}`}>
        <XCircle className="w-3.5 h-3.5 text-rose-400" />
        <span>
          {showVehicleName && activeVehicle
            ? `Does Not Fit Your ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}`
            : "Does Not Fit"}
        </span>
      </Badge>
    );
  }

  // Status unknown / no vehicle selected
  return (
    <button
      type="button"
      onClick={onOpenSelector}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-brand-zinc-700 bg-brand-zinc-800/80 text-brand-zinc-300 hover:border-brand-amber hover:text-brand-amber transition-colors ${className}`}
    >
      <HelpCircle className="w-3.5 h-3.5 text-brand-amber" />
      <span>Select Vehicle to Confirm Fitment</span>
    </button>
  );
}
