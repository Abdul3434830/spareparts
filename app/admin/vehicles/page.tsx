"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Car, ChevronRight, RefreshCw } from "lucide-react";
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Badge, Spinner } from "@/components/ui";

interface ModelItem {
  id: string;
  name: string;
  slug: string;
  yearFrom?: number | null;
  yearTo?: number | null;
  _count?: { fitments: number };
}

interface MakeItem {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  models: ModelItem[];
}

export default function AdminVehiclesPage() {
  const [makes, setMakes] = useState<MakeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMake, setSelectedMake] = useState<MakeItem | null>(null);

  // New Make Form
  const [newMakeName, setNewMakeName] = useState("");
  const [isAddingMake, setIsAddingMake] = useState(false);

  // New Model Form
  const [newModelName, setNewModelName] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [isAddingModel, setIsAddingModel] = useState(false);

  const fetchMakes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/vehicles");
      if (res.ok) {
        const data = await res.json();
        setMakes(data);
        if (data.length > 0 && !selectedMake) {
          setSelectedMake(data[0]);
        } else if (selectedMake) {
          const updated = data.find((m: MakeItem) => m.id === selectedMake.id);
          if (updated) setSelectedMake(updated);
        }
      }
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMakes();
  }, []);

  const handleAddMake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMakeName.trim()) return;
    setIsAddingMake(true);
    try {
      const res = await fetch("/api/admin/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "make", name: newMakeName.trim() }),
      });
      if (res.ok) {
        setNewMakeName("");
        await fetchMakes();
      }
    } finally {
      setIsAddingMake(false);
    }
  };

  const handleDeleteMake = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Make and all its Models?")) return;
    try {
      const res = await fetch(`/api/admin/vehicles?type=make&id=${id}`, { method: "DELETE" });
      if (res.ok) {
        if (selectedMake?.id === id) setSelectedMake(null);
        await fetchMakes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMake || !newModelName.trim()) return;
    setIsAddingModel(true);
    try {
      const res = await fetch("/api/admin/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "model",
          makeId: selectedMake.id,
          name: newModelName.trim(),
          yearFrom: yearFrom ? parseInt(yearFrom, 10) : undefined,
          yearTo: yearTo ? parseInt(yearTo, 10) : undefined,
        }),
      });
      if (res.ok) {
        setNewModelName("");
        setYearFrom("");
        setYearTo("");
        await fetchMakes();
      }
    } finally {
      setIsAddingModel(false);
    }
  };

  const handleDeleteModel = async (id: string) => {
    if (!confirm("Delete this model?")) return;
    try {
      const res = await fetch(`/api/admin/vehicles?type=model&id=${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchMakes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-white">
            Vehicles & Fitment Taxonomy
          </h1>
          <p className="text-xs sm:text-sm text-brand-zinc-400 mt-1">
            Manage auto manufacturers (Makes) and car lines (Models & Year ranges)
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={fetchMakes}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />}
        >
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Makes List & Add Make */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Car className="w-4 h-4 text-brand-amber" />
                <span>Manufacturers ({makes.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleAddMake} className="flex gap-2">
                <Input
                  placeholder="New Make (e.g. Toyota)"
                  value={newMakeName}
                  onChange={(e) => setNewMakeName(e.target.value)}
                  className="text-xs"
                />
                <Button type="submit" size="sm" loading={isAddingMake} variant="primary">
                  <Plus className="w-4 h-4" />
                </Button>
              </form>

              {loading ? (
                <div className="py-6 flex justify-center">
                  <Spinner size="md" color="amber" />
                </div>
              ) : makes.length === 0 ? (
                <div className="text-center py-6 text-xs text-brand-zinc-500">
                  No makes added yet. Add Toyota, Honda, etc.
                </div>
              ) : (
                <div className="divide-y divide-brand-zinc-800 max-h-[500px] overflow-y-auto">
                  {makes.map((make) => (
                    <div
                      key={make.id}
                      onClick={() => setSelectedMake(make)}
                      className={`py-3 px-2 flex items-center justify-between rounded-lg cursor-pointer transition-colors ${
                        selectedMake?.id === make.id
                          ? "bg-brand-zinc-800 border-l-2 border-brand-amber"
                          : "hover:bg-brand-zinc-800/50"
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold text-brand-white">{make.name}</div>
                        <div className="text-[11px] text-brand-zinc-400">
                          {make.models.length} {make.models.length === 1 ? "model" : "models"}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMake(make.id);
                          }}
                          className="p-1.5 text-brand-zinc-500 hover:text-red-400 rounded-md transition-colors"
                          title="Delete Make"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-brand-zinc-600" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Selected Make's Models */}
        <div className="lg:col-span-2 space-y-4">
          {selectedMake ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Models for <span className="text-brand-amber">{selectedMake.name}</span>
                    </CardTitle>
                    <p className="text-xs text-brand-zinc-400 mt-0.5">
                      Define chassis lines and production year ranges for precise compatibility checks
                    </p>
                  </div>
                  <Badge variant="amber">{selectedMake.models.length} Registered</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Model Form */}
                <form
                  onSubmit={handleAddModel}
                  className="p-4 rounded-xl bg-brand-zinc-800/60 border border-brand-zinc-700/60 space-y-3"
                >
                  <div className="text-xs font-semibold text-brand-white">Add New Model</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <Input
                        placeholder="Model name (e.g. Corolla)"
                        value={newModelName}
                        onChange={(e) => setNewModelName(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="From Year (e.g. 2014)"
                        type="number"
                        value={yearFrom}
                        onChange={(e) => setYearFrom(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="To Year (e.g. 2019)"
                        type="number"
                        value={yearTo}
                        onChange={(e) => setYearTo(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      size="sm"
                      variant="primary"
                      loading={isAddingModel}
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                    >
                      Save Model
                    </Button>
                  </div>
                </form>

                {/* Models List */}
                {selectedMake.models.length === 0 ? (
                  <div className="text-center py-10 text-xs text-brand-zinc-500">
                    No models registered for {selectedMake.name} yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-brand-zinc-800 text-brand-zinc-400">
                          <th className="py-2.5 font-semibold">Model Name</th>
                          <th className="py-2.5 font-semibold">Production Years</th>
                          <th className="py-2.5 font-semibold">Compatible Parts</th>
                          <th className="py-2.5 text-right font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-zinc-800">
                        {selectedMake.models.map((model) => (
                          <tr key={model.id} className="hover:bg-brand-zinc-800/30">
                            <td className="py-3 font-semibold text-brand-white">{model.name}</td>
                            <td className="py-3 text-brand-zinc-300">
                              {model.yearFrom || "All"} &mdash; {model.yearTo || "Present"}
                            </td>
                            <td className="py-3">
                              <Badge size="sm" variant="zinc">
                                {model._count?.fitments || 0} parts
                              </Badge>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleDeleteModel(model.id)}
                                className="p-1.5 text-brand-zinc-500 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="py-16 text-center text-xs text-brand-zinc-500">
              Select or create a vehicle make from the left to configure models.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
