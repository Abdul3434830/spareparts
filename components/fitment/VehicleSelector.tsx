"use client";

import { useState, useEffect } from "react";
import { Car, Check, Search, AlertCircle } from "lucide-react";
import { Button, Select } from "@/components/ui";
import { useGarageStore, GarageVehicle } from "@/store/garage";

interface VehicleSelectorProps {
  onVehicleSelected?: (vehicle: GarageVehicle) => void;
  className?: string;
  horizontal?: boolean;
}

interface MakeItem {
  id: string;
  name: string;
  slug: string;
}

interface ModelItem {
  id: string;
  name: string;
  slug: string;
  yearFrom?: number | null;
  yearTo?: number | null;
}

export function VehicleSelector({
  onVehicleSelected,
  className = "",
  horizontal = false,
}: VehicleSelectorProps) {
  const { addVehicle, setActiveVehicle } = useGarageStore();

  const [makes, setMakes] = useState<MakeItem[]>([]);
  const [models, setModels] = useState<ModelItem[]>([]);
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedEngine, setSelectedEngine] = useState<string>("");

  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch makes on mount
  useEffect(() => {
    async function loadMakes() {
      setLoadingMakes(true);
      try {
        const res = await fetch("/api/vehicles");
        if (res.ok) {
          const data = await res.json();
          setMakes(data);
        }
      } catch (err) {
        console.error("Failed to load vehicle makes:", err);
      } finally {
        setLoadingMakes(false);
      }
    }
    loadMakes();
  }, []);

  // Fetch models when make changes
  useEffect(() => {
    if (!selectedMake) {
      setModels([]);
      setSelectedModel("");
      setSelectedYear("");
      setSelectedEngine("");
      return;
    }

    async function loadModels() {
      setLoadingModels(true);
      try {
        const res = await fetch(`/api/vehicles?makeId=${selectedMake}`);
        if (res.ok) {
          const data = await res.json();
          setModels(data);
          setSelectedModel("");
          setSelectedYear("");
          setSelectedEngine("");
        }
      } catch (err) {
        console.error("Failed to load models:", err);
      } finally {
        setLoadingModels(false);
      }
    }
    loadModels();
  }, [selectedMake]);

  // Compute available years from selected model
  const activeModelObj = models.find((m) => m.id === selectedModel);
  const yearOptions: { label: string; value: string }[] = [];
  if (activeModelObj) {
    const from = activeModelObj.yearFrom || 2000;
    const to = activeModelObj.yearTo || new Date().getFullYear() + 1;
    for (let yr = to; yr >= from; yr--) {
      yearOptions.push({ label: String(yr), value: String(yr) });
    }
  }

  const handleApply = () => {
    if (!selectedMake || !selectedModel || !selectedYear) return;

    const makeObj = makes.find((m) => m.id === selectedMake);
    const modelObj = models.find((m) => m.id === selectedModel);

    if (!makeObj || !modelObj) return;

    const newVehicle = addVehicle({
      make: makeObj.name,
      model: modelObj.name,
      year: parseInt(selectedYear, 10),
      engine: selectedEngine.trim() || undefined,
    });

    setActiveVehicle(newVehicle);
    setSuccessMsg(`Active vehicle set to ${selectedYear} ${makeObj.name} ${modelObj.name}!`);

    if (onVehicleSelected) {
      onVehicleSelected(newVehicle);
    }

    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
  };

  return (
    <div
      className={`p-5 rounded-2xl bg-brand-zinc border border-brand-zinc-700 shadow-xl ${className}`}
    >
      <div className="flex items-center gap-2 mb-4 text-brand-white">
        <Car className="w-5 h-5 text-brand-amber" />
        <h3 className="font-heading font-bold text-base tracking-wide uppercase">
          Find Parts For Your Car
        </h3>
      </div>

      <div
        className={`grid gap-3.5 ${
          horizontal
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-end"
            : "grid-cols-1"
        }`}
      >
        {/* Make Select */}
        <div>
          <label className="block text-xs font-semibold text-brand-zinc-400 mb-1.5">
            1. Select Make
          </label>
          <Select
            placeholder={loadingMakes ? "Loading makes..." : "Select Make"}
            disabled={loadingMakes || makes.length === 0}
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
            options={makes.map((m) => ({ label: m.name, value: m.id }))}
          />
        </div>

        {/* Model Select */}
        <div>
          <label className="block text-xs font-semibold text-brand-zinc-400 mb-1.5">
            2. Select Model
          </label>
          <Select
            placeholder={
              !selectedMake
                ? "Choose Make First"
                : loadingModels
                ? "Loading models..."
                : "Select Model"
            }
            disabled={!selectedMake || loadingModels || models.length === 0}
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            options={models.map((m) => ({ label: m.name, value: m.id }))}
          />
        </div>

        {/* Year Select */}
        <div>
          <label className="block text-xs font-semibold text-brand-zinc-400 mb-1.5">
            3. Select Year
          </label>
          <Select
            placeholder={!selectedModel ? "Choose Model First" : "Select Year"}
            disabled={!selectedModel || yearOptions.length === 0}
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            options={yearOptions}
          />
        </div>

        {/* Engine Input (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-brand-zinc-400 mb-1.5">
            4. Engine / Trim (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. 1.8L, 2.0 Turbo"
            value={selectedEngine}
            onChange={(e) => setSelectedEngine(e.target.value)}
            disabled={!selectedYear}
            className="w-full px-3.5 py-2.5 rounded-lg bg-brand-black border border-brand-zinc-700 text-sm text-brand-white placeholder-brand-zinc-500 focus:outline-none focus:border-brand-amber transition-colors disabled:opacity-50"
          />
        </div>

        {/* Submit Button */}
        <div>
          <Button
            variant="primary"
            className="w-full h-[42px] font-heading uppercase tracking-wider text-xs font-bold"
            disabled={!selectedMake || !selectedModel || !selectedYear}
            onClick={handleApply}
            leftIcon={<Search className="w-4 h-4" />}
          >
            Check Fitment
          </Button>
        </div>
      </div>

      {successMsg && (
        <div className="mt-3 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2 text-emerald-400 text-xs">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {makes.length === 0 && !loadingMakes && (
        <div className="mt-3 p-3 rounded-lg bg-brand-zinc-800 border border-brand-zinc-700 flex items-center gap-2 text-brand-zinc-400 text-xs">
          <AlertCircle className="w-4 h-4 text-brand-amber shrink-0" />
          <span>Vehicle catalog is being populated by our team. Check back shortly.</span>
        </div>
      )}
    </div>
  );
}
