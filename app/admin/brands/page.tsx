"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Plus,
  Trash2,
  Tag,
  Upload,
  RefreshCw,
  Search,
  Sparkles,
  Edit2,
  X,
  Check,
} from "lucide-react";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Spinner,
  Modal,
} from "@/components/ui";
import { compressAndUploadImage } from "@/lib/client-upload";

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  country?: string | null;
  description?: string | null;
  logo?: string | null;
  _count?: { products: number };
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Create Form State
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Brand State
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLogoUrl, setEditLogoUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadingEditLogo, setUploadingEditLogo] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/brands");
      if (res.ok) {
        const data = await res.json();
        setBrands(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isEdit) {
      setUploadingEditLogo(true);
    } else {
      setUploadingLogo(true);
    }

    try {
      const res = await compressAndUploadImage(file, "brands");
      if (isEdit) {
        setEditLogoUrl(res.url);
      } else {
        setLogoUrl(res.url);
      }
    } catch (err) {
      alert((err as Error).message || "Logo upload failed");
    } finally {
      if (isEdit) {
        setUploadingEditLogo(false);
      } else {
        setUploadingLogo(false);
      }
    }
  };

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setFeedbackMsg(null);
    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          country: country.trim() || undefined,
          description: description.trim() || undefined,
          logo: logoUrl || undefined,
        }),
      });

      if (res.ok) {
        setName("");
        setCountry("");
        setDescription("");
        setLogoUrl("");
        setFeedbackMsg({ type: "success", text: `Brand "${name}" created successfully!` });
        await fetchBrands();
      } else {
        const errJson = await res.json();
        setFeedbackMsg({ type: "error", text: errJson.error || "Failed to create brand" });
      }
    } catch (err) {
      setFeedbackMsg({ type: "error", text: (err as Error).message || "Error creating brand" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSeedDefaults = async () => {
    if (!confirm("This will automatically populate top 22 global automotive spare part brands (Bosch, Denso, Brembo, NGK, etc.). Continue?")) return;

    setIsSeeding(true);
    setFeedbackMsg(null);
    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "seed" }),
      });

      if (res.ok) {
        const data = await res.json();
        setFeedbackMsg({ type: "success", text: data.message || "Top brands seeded successfully!" });
        await fetchBrands();
      } else {
        setFeedbackMsg({ type: "error", text: "Failed to seed brands" });
      }
    } catch (err) {
      setFeedbackMsg({ type: "error", text: (err as Error).message });
    } finally {
      setIsSeeding(false);
    }
  };

  const openEditModal = (brand: BrandItem) => {
    setEditingBrand(brand);
    setEditName(brand.name);
    setEditCountry(brand.country || "");
    setEditDescription(brand.description || "");
    setEditLogoUrl(brand.logo || "");
  };

  const handleUpdateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand || !editName.trim()) return;

    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/brands", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingBrand.id,
          name: editName.trim(),
          country: editCountry.trim() || undefined,
          description: editDescription.trim() || undefined,
          logo: editLogoUrl || undefined,
        }),
      });

      if (res.ok) {
        setEditingBrand(null);
        setFeedbackMsg({ type: "success", text: `Brand updated successfully!` });
        await fetchBrands();
      } else {
        const errJson = await res.json();
        alert(errJson.error || "Failed to update brand");
      }
    } catch (err) {
      alert((err as Error).message || "Error updating brand");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteBrand = async (id: string, brandName: string) => {
    if (!confirm(`Delete brand "${brandName}"? Any products assigned to this brand will need reassignment.`)) return;
    try {
      const res = await fetch(`/api/admin/brands?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setFeedbackMsg({ type: "success", text: `Brand "${brandName}" deleted.` });
        await fetchBrands();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete brand");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBrands = useMemo(() => {
    if (!searchQuery.trim()) return brands;
    const q = searchQuery.toLowerCase();
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.country && b.country.toLowerCase().includes(q)) ||
        (b.description && b.description.toLowerCase().includes(q))
    );
  }, [brands, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-white">
            Brands Management
          </h1>
          <p className="text-xs sm:text-sm text-brand-zinc-400 mt-1">
            Genuine factory brands, Tier 1 OEM suppliers, and aftermarket manufacturers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSeedDefaults}
            loading={isSeeding}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-brand-amber" />}
          >
            Seed Top Brands
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchBrands}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between ${
            feedbackMsg.type === "success"
              ? "bg-emerald-950/60 border border-emerald-800 text-emerald-300"
              : "bg-red-950/60 border border-red-800 text-red-300"
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button
            type="button"
            onClick={() => setFeedbackMsg(null)}
            className="p-1 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Brand Card (1 col) */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-brand-amber" />
                <span>Add New Brand</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateBrand} className="space-y-3.5">
                <Input
                  label="Brand Name *"
                  placeholder="e.g. Brembo, Denso, Bosch, NGK"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs"
                  required
                />

                <Input
                  label="Country of Origin"
                  placeholder="e.g. Japan, Germany, Italy, USA"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="text-xs"
                />

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-brand-zinc-300">
                    Brand Logo
                  </label>
                  <div className="flex items-center gap-3">
                    {logoUrl ? (
                      <div className="w-12 h-12 rounded-lg bg-brand-zinc-800 border border-brand-zinc-700 p-1 flex items-center justify-center shrink-0">
                        <img src={logoUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-brand-zinc-800 border border-dashed border-brand-zinc-700 flex items-center justify-center text-brand-zinc-500 shrink-0">
                        <Tag className="w-5 h-5" />
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleLogoUpload(e, false)}
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      loading={uploadingLogo}
                      leftIcon={<Upload className="w-3.5 h-3.5" />}
                    >
                      {logoUrl ? "Replace" : "Upload Logo"}
                    </Button>
                    {logoUrl && (
                      <button
                        type="button"
                        onClick={() => setLogoUrl("")}
                        className="text-xs text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-brand-zinc-300">
                    Description / Bio
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Short description of product lines and manufacturing history"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-brand-zinc-800 border border-brand-zinc-700 text-brand-white placeholder-brand-zinc-500 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-brand-amber focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  size="md"
                  loading={isSubmitting}
                >
                  Save Brand
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Brands List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">
                  Registered Brands ({brands.length})
                </CardTitle>
                <Badge variant="amber">Catalog Ready</Badge>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-zinc-500" />
                <input
                  type="text"
                  placeholder="Search brands or country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-brand-zinc-900 border border-brand-zinc-700 text-xs text-brand-white placeholder-brand-zinc-500 focus:outline-none focus:border-brand-amber"
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-16 flex justify-center">
                  <Spinner size="lg" color="amber" />
                </div>
              ) : brands.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-zinc-800 border border-brand-zinc-700 flex items-center justify-center mx-auto text-brand-amber">
                    <Tag className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-sm text-brand-white">
                      No Brands Registered Yet
                    </h3>
                    <p className="text-xs text-brand-zinc-500 max-w-sm mx-auto">
                      Click the button below to seed top 22 global automotive brands (Denso, Bosch, Brembo, etc.) instantly.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSeedDefaults}
                    loading={isSeeding}
                    leftIcon={<Sparkles className="w-4 h-4" />}
                  >
                    Seed Top 22 Brands Now
                  </Button>
                </div>
              ) : filteredBrands.length === 0 ? (
                <div className="text-center py-12 text-xs text-brand-zinc-500">
                  No brands matching &quot;{searchQuery}&quot;
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {filteredBrands.map((brand) => (
                    <div
                      key={brand.id}
                      className="p-3.5 rounded-xl bg-brand-zinc-800/50 border border-brand-zinc-700/60 flex items-start justify-between gap-3 hover:border-brand-zinc-600 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-zinc-900 border border-brand-zinc-700 p-1 flex items-center justify-center shrink-0">
                          {brand.logo ? (
                            <img
                              src={brand.logo}
                              alt={brand.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <Tag className="w-4 h-4 text-brand-amber" />
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <div className="font-semibold text-xs sm:text-sm text-brand-white">
                            {brand.name}
                          </div>
                          {brand.country && (
                            <div className="text-[11px] text-brand-zinc-400">
                              Origin: {brand.country}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 pt-1">
                            <Badge size="sm" variant="zinc">
                              {brand._count?.products || 0} parts
                            </Badge>
                            <span className="text-[10px] text-brand-zinc-500 font-mono">
                              /{brand.slug}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(brand)}
                          className="p-1.5 text-brand-zinc-400 hover:text-brand-amber hover:bg-brand-zinc-700 rounded-lg transition-colors"
                          title="Edit Brand"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBrand(brand.id, brand.name)}
                          className="p-1.5 text-brand-zinc-400 hover:text-red-400 hover:bg-brand-zinc-700 rounded-lg transition-colors"
                          title="Delete Brand"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Brand Modal */}
      {editingBrand && (
        <Modal
          isOpen={true}
          onClose={() => setEditingBrand(null)}
          title={`Edit Brand: ${editingBrand.name}`}
          size="md"
        >
          <form onSubmit={handleUpdateBrand} className="space-y-4">
            <Input
              label="Brand Name *"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="text-xs"
              required
            />

            <Input
              label="Country of Origin"
              placeholder="e.g. Japan, Germany"
              value={editCountry}
              onChange={(e) => setEditCountry(e.target.value)}
              className="text-xs"
            />

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-brand-zinc-300">
                Brand Logo
              </label>
              <div className="flex items-center gap-3">
                {editLogoUrl ? (
                  <div className="w-12 h-12 rounded-lg bg-brand-zinc-800 border border-brand-zinc-700 p-1 flex items-center justify-center shrink-0">
                    <img src={editLogoUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-brand-zinc-800 border border-dashed border-brand-zinc-700 flex items-center justify-center text-brand-zinc-500 shrink-0">
                    <Tag className="w-5 h-5" />
                  </div>
                )}
                <input
                  type="file"
                  ref={editFileInputRef}
                  onChange={(e) => handleLogoUpload(e, true)}
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => editFileInputRef.current?.click()}
                  loading={uploadingEditLogo}
                  leftIcon={<Upload className="w-3.5 h-3.5" />}
                >
                  {editLogoUrl ? "Change Logo" : "Upload Logo"}
                </Button>
                {editLogoUrl && (
                  <button
                    type="button"
                    onClick={() => setEditLogoUrl("")}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-brand-zinc-300">
                Description / Bio
              </label>
              <textarea
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full bg-brand-zinc-800 border border-brand-zinc-700 text-brand-white placeholder-brand-zinc-500 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-brand-amber focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-zinc-700">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingBrand(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={isUpdating}
                leftIcon={<Check className="w-3.5 h-3.5" />}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
