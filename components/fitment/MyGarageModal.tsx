"use client";

import { useState } from "react";
import { Car, Trash2, CheckCircle, Plus, Check } from "lucide-react";
import { Modal, Button, EmptyState } from "@/components/ui";
import { useGarageStore } from "@/store/garage";
import { VehicleSelector } from "./VehicleSelector";

interface MyGarageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MyGarageModal({ isOpen, onClose }: MyGarageModalProps) {
  const { vehicles, activeVehicle, setActiveVehicle, removeVehicle } = useGarageStore();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleVehicleAdded = () => {
    setShowAddForm(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="My Garage"
      description="Save your vehicles to automatically filter parts and guarantee 100% fitment."
    >
      <div className="space-y-6 py-2">
        {/* Active Vehicle Banner */}
        {activeVehicle && (
          <div className="p-4 rounded-xl bg-brand-zinc-800 border-2 border-brand-amber/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-amber/20 border border-brand-amber/40 flex items-center justify-center text-brand-amber">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-brand-amber uppercase tracking-wider">
                  Currently Active Vehicle
                </div>
                <div className="text-base font-heading font-bold text-brand-white">
                  {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                </div>
                {activeVehicle.engine && (
                  <div className="text-xs text-brand-zinc-400">
                    Engine: {activeVehicle.engine}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
              <CheckCircle className="w-4 h-4" />
              <span>Active</span>
            </div>
          </div>
        )}

        {/* Saved Vehicles List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-bold text-sm text-brand-zinc-200 uppercase tracking-wide">
              Saved Vehicles ({vehicles.length})
            </h4>
            {!showAddForm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Another Car
              </Button>
            )}
          </div>

          {vehicles.length === 0 && !showAddForm ? (
            <EmptyState
              icon={Car}
              title="Your garage is empty"
              description="Add your car to instantly view parts that match your exact year, make, and model."
              action={{
                label: "Add Vehicle",
                onClick: () => setShowAddForm(true),
              }}
            />
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {vehicles.map((v) => {
                const isActive = activeVehicle?.id === v.id;
                return (
                  <div
                    key={v.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isActive
                        ? "bg-brand-zinc-800/80 border-brand-amber/50"
                        : "bg-brand-zinc-900 border-brand-zinc-800 hover:border-brand-zinc-700"
                    }`}
                  >
                    <div>
                      <div className="font-heading font-semibold text-sm text-brand-white">
                        {v.year} {v.make} {v.model}
                      </div>
                      {v.engine && (
                        <div className="text-xs text-brand-zinc-400">{v.engine}</div>
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
                          Select
                        </Button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeVehicle(v.id)}
                        className="p-1.5 text-brand-zinc-500 hover:text-rose-400 transition-colors"
                        title="Remove from garage"
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

        {/* Add Car Form */}
        {showAddForm && (
          <div className="pt-2 border-t border-brand-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-xs font-semibold text-brand-amber uppercase tracking-wider">
                Add Vehicle To Garage
              </h5>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs text-brand-zinc-400 hover:text-brand-white"
              >
                Cancel
              </button>
            </div>
            <VehicleSelector onVehicleSelected={handleVehicleAdded} />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-brand-zinc-700">
        <Button variant="primary" onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  );
}
