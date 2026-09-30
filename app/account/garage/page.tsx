"use client";

import { useState } from "react";
import { Car, Trash2, CheckCircle2, Plus, Check } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";
import { useGarageStore } from "@/store/garage";
import { VehicleSelector } from "@/components/fitment/VehicleSelector";

export default function AccountGaragePage() {
  const { vehicles, activeVehicle, setActiveVehicle, removeVehicle } = useGarageStore();
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-brand-zinc-800">
        <div>
          <h2 className="font-heading font-bold text-xl text-brand-white">
            My Garage ({vehicles.length} Saved)
          </h2>
          <p className="text-xs text-brand-zinc-400 mt-0.5">
            Your saved cars are used to filter spare parts and guarantee 100% fitment
          </p>
        </div>

        {!showAddForm && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddForm(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add New Vehicle
          </Button>
        )}
      </div>

      {/* Active Vehicle Banner */}
      {activeVehicle && (
        <div className="p-6 rounded-3xl bg-brand-zinc border-2 border-brand-amber/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl shadow-brand-amber/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-amber/20 border border-brand-amber/50 flex items-center justify-center text-brand-amber shrink-0">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-brand-amber uppercase tracking-wider">
                Currently Active Vehicle Filter
              </div>
              <h3 className="text-xl font-heading font-extrabold text-brand-white">
                {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
              </h3>
              {activeVehicle.engine && (
                <div className="text-xs text-brand-zinc-400 mt-0.5">
                  Engine Spec: {activeVehicle.engine}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold self-start sm:self-center">
            <CheckCircle2 className="w-4 h-4" />
            <span>Active Fitment Filter</span>
          </div>
        </div>
      )}

      {/* Add Vehicle Form */}
      {showAddForm && (
        <div className="p-6 rounded-3xl bg-brand-zinc border border-brand-zinc-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-brand-zinc-800">
            <h4 className="font-heading font-bold text-sm text-brand-white uppercase">
              Add Vehicle To Your Garage
            </h4>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-brand-zinc-400 hover:text-brand-white"
            >
              Cancel
            </button>
          </div>
          <VehicleSelector onVehicleSelected={() => setShowAddForm(false)} />
        </div>
      )}

      {/* Vehicles List */}
      {vehicles.length === 0 && !showAddForm ? (
        <EmptyState
          icon={Car}
          title="Your garage is empty"
          description="Add your car's Make, Model, and Year to instantly verify parts compatibility and filter search results."
          action={{
            label: "Add Vehicle Now",
            onClick: () => setShowAddForm(true),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vehicles.map((v) => {
            const isActive = activeVehicle?.id === v.id;
            return (
              <div
                key={v.id}
                className={`p-5 rounded-2xl border transition-all flex items-center justify-between ${
                  isActive
                    ? "bg-brand-zinc border-brand-amber/60 shadow-lg"
                    : "bg-brand-zinc border-brand-zinc-800 hover:border-brand-zinc-700"
                }`}
              >
                <div>
                  <div className="font-heading font-bold text-base text-brand-white">
                    {v.year} {v.make} {v.model}
                  </div>
                  {v.engine ? (
                    <div className="text-xs text-brand-zinc-400 mt-0.5 font-mono">
                      {v.engine}
                    </div>
                  ) : (
                    <div className="text-xs text-brand-zinc-500 mt-0.5">Standard Factory Engine</div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!isActive && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveVehicle(v)}
                      leftIcon={<Check className="w-3.5 h-3.5 text-brand-amber" />}
                    >
                      Make Active
                    </Button>
                  )}

                  <button
                    type="button"
                    onClick={() => removeVehicle(v.id)}
                    className="p-2 text-brand-zinc-500 hover:text-rose-400 transition-colors rounded-lg hover:bg-brand-black"
                    title="Remove vehicle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
