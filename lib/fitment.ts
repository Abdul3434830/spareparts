import { GarageVehicle } from "@/store/garage";

export type FitmentStatus = "fits" | "does_not_fit" | "universal" | "unknown";

export interface FitmentRecord {
  make: string;
  model: string;
  yearFrom: number;
  yearTo: number;
  engine?: string | null;
  notes?: string | null;
}

export interface FitmentCheckResult {
  status: FitmentStatus;
  message: string;
  matchedFitment?: FitmentRecord;
}

export function checkFitment(
  product: {
    fitments?: FitmentRecord[];
    tags?: string[];
  },
  activeVehicle: GarageVehicle | null
): FitmentCheckResult {
  // If product is marked universal or has universal tag
  const isUniversal = product.tags?.some((t) => t.toLowerCase().includes("universal"));
  if (isUniversal) {
    return {
      status: "universal",
      message: "Universal Fit — Compatible with most vehicles",
    };
  }

  // If no active vehicle is selected by user
  if (!activeVehicle) {
    return {
      status: "unknown",
      message: "Select your vehicle to confirm fitment",
    };
  }

  const fitments = product.fitments || [];
  if (fitments.length === 0) {
    return {
      status: "unknown",
      message: "Fitment details pending verification for your vehicle",
    };
  }

  // Check if any fitment matches make, model, year, and optionally engine
  const activeMake = activeVehicle.make.trim().toLowerCase();
  const activeModel = activeVehicle.model.trim().toLowerCase();
  const activeYear = Number(activeVehicle.year);
  const activeEngine = activeVehicle.engine ? activeVehicle.engine.trim().toLowerCase() : null;

  const matched = fitments.find((f) => {
    const fMake = f.make.trim().toLowerCase();
    const fModel = f.model.trim().toLowerCase();
    const matchesMake = fMake === activeMake;
    const matchesModel = fModel === activeModel || fModel.includes(activeModel) || activeModel.includes(fModel);
    const matchesYear = activeYear >= f.yearFrom && activeYear <= f.yearTo;

    if (!matchesMake || !matchesModel || !matchesYear) {
      return false;
    }

    // Engine check if both fitment and active vehicle specify engine
    if (f.engine && activeEngine) {
      const fEngine = f.engine.trim().toLowerCase();
      return fEngine.includes(activeEngine) || activeEngine.includes(fEngine);
    }

    return true;
  });

  if (matched) {
    return {
      status: "fits",
      message: `Guaranteed to Fit your ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}${
        activeVehicle.engine ? ` (${activeVehicle.engine})` : ""
      }`,
      matchedFitment: matched,
    };
  }

  return {
    status: "does_not_fit",
    message: `Does Not Fit your ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}`,
  };
}
