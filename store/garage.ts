import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface GarageVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  engine?: string;
  isPrimary?: boolean;
}

interface GarageStore {
  vehicles: GarageVehicle[];
  activeVehicle: GarageVehicle | null;
  addVehicle: (vehicle: Omit<GarageVehicle, "id">) => GarageVehicle;
  removeVehicle: (id: string) => void;
  setActiveVehicle: (vehicle: GarageVehicle | null) => void;
  clearGarage: () => void;
}

export const useGarageStore = create<GarageStore>()(
  persist(
    (set, get) => ({
      vehicles: [],
      activeVehicle: null,
      addVehicle: (vehicleData) => {
        const id = `veh-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        const newVehicle: GarageVehicle = {
          ...vehicleData,
          id,
        };

        set((state) => {
          const updated = [...state.vehicles, newVehicle];
          return {
            vehicles: updated,
            activeVehicle: state.activeVehicle || newVehicle,
          };
        });

        return newVehicle;
      },
      removeVehicle: (id) => {
        set((state) => {
          const filtered = state.vehicles.filter((v) => v.id !== id);
          return {
            vehicles: filtered,
            activeVehicle:
              state.activeVehicle?.id === id
                ? filtered[0] || null
                : state.activeVehicle,
          };
        });
      },
      setActiveVehicle: (vehicle) => {
        set({ activeVehicle: vehicle });
      },
      clearGarage: () => set({ vehicles: [], activeVehicle: null }),
    }),
    {
      name: "care_spare_parts_garage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
