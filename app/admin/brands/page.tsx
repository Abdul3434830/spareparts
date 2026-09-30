"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Tag, Upload, RefreshCw } from "lucide-react";
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Badge, Spinner } from "@/components/ui";
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

  // Form State
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const res = await compressAndUploadImage(file, "brands");
      setLogoUrl(res.url);
    } catch (err) {
      alert((err as Error).message || "Logo upload failed");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
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
        await fetchBrands();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBrand = async (id: string) => {
    if (!confirm("Delete this brand?")) return;
    try {
      const res = await fetch(`/api/admin/brands?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchBrands();
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
            Brands Management
          </h1>
          <p className="text-xs sm:text-sm text-brand-zinc-400 mt-1">
            Genuine manufacturers, OEM suppliers, and aftermarket brands with logo upload
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={fetchBrands}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />}
        >
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Brand Card */}
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
                  label="Brand Name"
                  placeholder="e.g. Brembo, Denso, Bosch"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs"
                  required
                />

                <Input
                  label="Country of Origin"
                  placeholder="e.g. Japan, Germany, Italy"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="text-xs"
                />

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-brand-zinc-300">
                    Brand Logo (Direct to Vercel Blob)
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
                      onChange={handleLogoUpload}
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
                      {logoUrl ? "Replace Logo" : "Upload Logo"}
                    </Button>
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

        {/* Brands List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Registered Brands ({brands.length})</CardTitle>
              <Badge variant="amber">Catalog Ready</Badge>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-12 flex justify-center">
                  <Spinner size="lg" color="amber" />
                </div>
              ) : brands.length === 0 ? (
                <div className="text-center py-12 text-xs text-brand-zinc-500">
                  No brands registered yet. Add Denso, Bosch, Toyota Genuine, etc.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {brands.map((brand) => (
                    <div
                      key={brand.id}
                      className="p-4 rounded-xl bg-brand-zinc-800/50 border border-brand-zinc-700/60 flex items-start justify-between gap-3"
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
                            <Tag className="w-4 h-4 text-brand-zinc-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-brand-white">{brand.name}</div>
                          {brand.country && (
                            <div className="text-[11px] text-brand-zinc-400">
                              Origin: {brand.country}
                            </div>
                          )}
                          <div className="mt-1">
                            <Badge size="sm" variant="zinc">
                              {brand._count?.products || 0} parts
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteBrand(brand.id)}
                        className="p-1.5 text-brand-zinc-500 hover:text-red-400 transition-colors"
                        title="Delete Brand"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
