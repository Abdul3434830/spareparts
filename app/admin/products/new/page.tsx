"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Check,
  Star,
  Car,
} from "lucide-react";
import { Button, Input, Select, Card, CardHeader, CardTitle, CardContent, Badge, Spinner, Modal } from "@/components/ui";
import { compressAndUploadImage } from "@/lib/client-upload";
import { formatPrice } from "@/lib/utils";

interface BrandOption {
  id: string;
  name: string;
}

interface CategoryOption {
  id: string;
  name: string;
  subcategories: { id: string; name: string }[];
}

interface MakeOption {
  id: string;
  name: string;
  models: { id: string; name: string; yearFrom?: number | null; yearTo?: number | null }[];
}

interface ProductImageItem {
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface FitmentItem {
  make: string;
  model: string;
  yearFrom: number;
  yearTo: number;
  engine?: string;
  notes?: string;
}

export default function NewProductPage() {
  const router = useRouter();

  // Reference data
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [makes, setMakes] = useState<MakeOption[]>([]);
  const [loadingRefs, setLoadingRefs] = useState(true);

  // Form Fields
  const [name, setName] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [oemNumbers, setOemNumbers] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [type, setType] = useState("AFTERMARKET");
  const [condition, setCondition] = useState("NEW");
  const [warranty, setWarranty] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [position, setPosition] = useState("");

  // Pricing
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [supplierPrice, setSupplierPrice] = useState("");

  // Inventory & Specs
  const [stock, setStock] = useState("10");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");
  const [weight, setWeight] = useState("");
  const [installationNotes, setInstallationNotes] = useState("");
  const [professionalInstall, setProfessionalInstall] = useState(false);
  const [tags, setTags] = useState("");
  const [featured, setFeatured] = useState(false);
  const [bestseller, setBestseller] = useState(false);
  const [published, setPublished] = useState(true);

  // Images
  const [images, setImages] = useState<ProductImageItem[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Fitment Selector State
  const [fitments, setFitments] = useState<FitmentItem[]>([]);
  const [selectedFitMake, setSelectedFitMake] = useState("");
  const [selectedFitModel, setSelectedFitModel] = useState("");
  const [fitYearFrom, setFitYearFrom] = useState("2015");
  const [fitYearTo, setFitYearTo] = useState("2022");
  const [fitEngine, setFitEngine] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick Add Brand State
  const [quickBrandModalOpen, setQuickBrandModalOpen] = useState(false);
  const [quickBrandName, setQuickBrandName] = useState("");
  const [quickBrandCountry, setQuickBrandCountry] = useState("");
  const [quickBrandSubmitting, setQuickBrandSubmitting] = useState(false);
  const [quickBrandSeeding, setQuickBrandSeeding] = useState(false);

  const handleQuickAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickBrandName.trim()) return;
    setQuickBrandSubmitting(true);
    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: quickBrandName.trim(),
          country: quickBrandCountry.trim() || undefined,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setBrands((prev) =>
          [...prev, { id: created.id, name: created.name }].sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        );
        setBrandId(created.id);
        setQuickBrandName("");
        setQuickBrandCountry("");
        setQuickBrandModalOpen(false);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create brand");
      }
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setQuickBrandSubmitting(false);
    }
  };

  const handleQuickSeedBrands = async () => {
    setQuickBrandSeeding(true);
    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "seed" }),
      });
      if (res.ok) {
        const bRes = await fetch("/api/admin/brands");
        if (bRes.ok) {
          const loaded = await bRes.json();
          setBrands(loaded);
          if (loaded.length > 0 && !brandId) {
            setBrandId(loaded[0].id);
          }
        }
      }
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setQuickBrandSeeding(false);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingRefs(true);
        const [bRes, cRes, mRes] = await Promise.all([
          fetch("/api/admin/brands"),
          fetch("/api/admin/categories"),
          fetch("/api/admin/vehicles"),
        ]);
        if (bRes.ok) setBrands(await bRes.json());
        if (cRes.ok) setCategories(await cRes.json());
        if (mRes.ok) setMakes(await mRes.json());
      } finally {
        setLoadingRefs(false);
      }
    }
    loadData();
  }, []);

  // Compute live profit margin
  const retailNum = parseFloat(price) || 0;
  const supplierNum = parseFloat(supplierPrice) || 0;
  const profit = retailNum - supplierNum;
  const marginPercent = retailNum > 0 ? ((profit / retailNum) * 100).toFixed(1) : "0.0";

  // Handle Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await compressAndUploadImage(file, "products");
        setImages((prev) => [
          ...prev,
          {
            url: res.url,
            alt: name || "Product Image",
            isPrimary: prev.length === 0 && i === 0,
            sortOrder: prev.length + i,
          },
        ]);
      }
    } catch (err) {
      alert((err as Error).message || "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const setPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  // Add Fitment
  const handleAddFitment = () => {
    if (!selectedFitMake || !selectedFitModel) {
      alert("Please select both a make and a model");
      return;
    }

    const from = parseInt(fitYearFrom, 10);
    const to = parseInt(fitYearTo, 10);

    if (isNaN(from) || isNaN(to) || from > to) {
      alert("Please enter a valid year range (From <= To)");
      return;
    }

    setFitments((prev) => [
      ...prev,
      {
        make: selectedFitMake,
        model: selectedFitModel,
        yearFrom: from,
        yearTo: to,
        engine: fitEngine.trim() || undefined,
      },
    ]);

    setFitEngine("");
  };

  const removeFitment = (index: number) => {
    setFitments((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name || !partNumber || !brandId || !categoryId || !price) {
      setErrorMsg("Please fill in all mandatory fields marked with an asterisk (*)");
      return;
    }

    setIsSubmitting(true);
    try {
      const oemArray = oemNumbers
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);

      const tagsArray = tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name,
        partNumber,
        oemNumbers: oemArray,
        brandId,
        categoryId,
        subcategoryId: subcategoryId || null,
        type,
        condition,
        warranty: warranty || null,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        supplierPrice: supplierPrice ? parseFloat(supplierPrice) : 0,
        stock: parseInt(stock, 10) || 0,
        lowStockThreshold: parseInt(lowStockThreshold, 10) || 5,
        weight: weight ? parseFloat(weight) : null,
        countryOfOrigin: countryOfOrigin || null,
        position: position || null,
        installationNotes: installationNotes || null,
        professionalInstall,
        tags: tagsArray,
        featured,
        bestseller,
        published,
        images,
        fitments,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Failed to create product");
        setIsSubmitting(false);
        return;
      }

      router.push("/admin/products");
    } catch (err) {
      setErrorMsg((err as Error).message || "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  const currentCategory = categories.find((c) => c.id === categoryId);
  const currentMake = makes.find((m) => m.name === selectedFitMake);

  if (loadingRefs) {
    return (
      <div className="py-24 flex justify-center">
        <Spinner size="lg" color="amber" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-zinc-400 hover:text-brand-amber transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products List
        </button>
        <Badge variant="amber">New Inventory Item</Badge>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-white">
          Add New Product
        </h1>
        <p className="text-xs sm:text-sm text-brand-zinc-400 mt-1">
          Complete part specification, OEM cross-references, vehicle fitment, and Vercel Blob photos
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1. Basic Identification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Part Name *"
                placeholder="e.g. Front Ceramic Brake Pad Set"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-xs"
              />

              <Input
                label="Part Number / SKU *"
                placeholder="e.g. 04465-02220 or D1210"
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
                required
                className="text-xs font-mono uppercase"
              />
            </div>

            <Input
              label="OEM & Cross-Reference Numbers (comma-separated)"
              placeholder="e.g. 04465-02220, 04465-12610, 04465-YZZE1"
              value={oemNumbers}
              onChange={(e) => setOemNumbers(e.target.value)}
              className="text-xs font-mono"
              hint="Used by vehicle search engine to cross-match genuine factory parts"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-brand-zinc-300">
                    Brand <span className="text-brand-amber">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setQuickBrandModalOpen(true)}
                    className="text-[11px] font-semibold text-brand-amber hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Quick Add</span>
                  </button>
                </div>
                <Select
                  placeholder={brands.length === 0 ? "No brands available..." : "Select Brand..."}
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  required
                  options={brands.map((b) => ({ label: b.name, value: b.id }))}
                />
                {brands.length === 0 && (
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-amber-400/90 bg-amber-950/40 border border-amber-800/60 p-2 rounded-lg">
                    <span>No brands yet.</span>
                    <button
                      type="button"
                      onClick={handleQuickSeedBrands}
                      disabled={quickBrandSeeding}
                      className="font-semibold underline hover:text-white"
                    >
                      {quickBrandSeeding ? "Loading..." : "Seed Top 22"}
                    </button>
                  </div>
                )}
              </div>

              <Select
                label="Main Category *"
                placeholder="Select Category..."
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setSubcategoryId("");
                }}
                required
                options={categories.map((c) => ({ label: c.name, value: c.id }))}
              />

              <Select
                label="Subcategory"
                placeholder="Select Subcategory..."
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                disabled={!currentCategory || currentCategory.subcategories.length === 0}
                options={
                  currentCategory?.subcategories.map((s) => ({
                    label: s.name,
                    value: s.id,
                  })) || []
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Part Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                options={[
                  { label: "GENUINE (Factory Original)", value: "GENUINE" },
                  { label: "OEM (Original Equipment)", value: "OEM" },
                  { label: "AFTERMARKET (Replacement)", value: "AFTERMARKET" },
                  { label: "PERFORMANCE (High Performance)", value: "PERFORMANCE" },
                ]}
              />

              <Select
                label="Condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                options={[
                  { label: "Brand New (Unused)", value: "NEW" },
                  { label: "Used / Tested", value: "USED" },
                  { label: "Refurbished", value: "REFURBISHED" },
                ]}
              />

              <Input
                label="Warranty Period"
                placeholder="e.g. 1 Year / 20,000 KM"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Pricing & Live Margin Calculator */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">2. Pricing & Profit Margin</CardTitle>
              {retailNum > 0 && supplierNum > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-brand-zinc-400">Profit: {formatPrice(profit)}</span>
                  <Badge
                    variant={
                      parseFloat(marginPercent) >= 25
                        ? "green"
                        : parseFloat(marginPercent) >= 15
                        ? "amber"
                        : "red"
                    }
                  >
                    {marginPercent}% Margin
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Input
                label="Retail Price (PKR) *"
                placeholder="14500"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="text-xs"
              />

              <Input
                label="Promotional Sale Price (PKR)"
                placeholder="Optional strike-through"
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="text-xs"
              />

              <Input
                label="Supplier Cost (PKR) [ADMIN ONLY]"
                placeholder="Private purchase cost"
                type="number"
                value={supplierPrice}
                onChange={(e) => setSupplierPrice(e.target.value)}
                className="text-xs border-amber-800/60"
                hint="Never visible to customers"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Stock & Physical Specs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">3. Inventory & Dimensions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Input
                label="Stock Quantity *"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                className="text-xs"
              />

              <Input
                label="Low Stock Alert Threshold"
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                className="text-xs"
              />

              <Input
                label="Weight (kg)"
                placeholder="e.g. 2.5"
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="text-xs"
              />

              <Input
                label="Position / Axle"
                placeholder="e.g. Front, Rear, Left"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Country of Origin"
                placeholder="e.g. Japan, Germany, Thailand"
                value={countryOfOrigin}
                onChange={(e) => setCountryOfOrigin(e.target.value)}
                className="text-xs"
              />

              <Input
                label="Search Tags (comma-separated)"
                placeholder="e.g. ceramic, performance, brake pads, front"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-brand-zinc-300">
                Installation Notes & Guidelines
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Clean brake disc rotors before pad installation. Caliper pin grease included."
                value={installationNotes}
                onChange={(e) => setInstallationNotes(e.target.value)}
                className="w-full bg-brand-zinc-800 border border-brand-zinc-700 text-brand-white placeholder-brand-zinc-500 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-brand-amber focus:outline-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Multi-Image Upload (Direct to Vercel Blob) */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">4. Product Images (Vercel Blob)</CardTitle>
              <input
                type="file"
                ref={imageInputRef}
                multiple
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => imageInputRef.current?.click()}
                loading={uploadingImage}
                leftIcon={<Upload className="w-4 h-4" />}
              >
                Upload Images
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {images.length === 0 ? (
              <div
                onClick={() => imageInputRef.current?.click()}
                className="p-10 border-2 border-dashed border-brand-zinc-700 hover:border-brand-amber rounded-xl text-center cursor-pointer transition-colors"
              >
                <Upload className="w-8 h-8 text-brand-zinc-500 mx-auto mb-2" />
                <div className="text-xs font-semibold text-brand-white">
                  Drop product images here or click to browse
                </div>
                <p className="text-[11px] text-brand-zinc-500 mt-1">
                  Images are automatically compressed client-side to WebP (max 1600px) and uploaded to Vercel Blob.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-xl overflow-hidden border p-2 bg-brand-zinc-800/60 ${
                      img.isPrimary ? "border-brand-amber shadow-amber" : "border-brand-zinc-700"
                    }`}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-brand-black flex items-center justify-center">
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-brand-zinc-700/60">
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(idx)}
                        className={`text-[11px] font-semibold flex items-center gap-1 ${
                          img.isPrimary ? "text-brand-amber" : "text-brand-zinc-400 hover:text-brand-white"
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {img.isPrimary ? "Primary" : "Set Primary"}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="text-brand-zinc-500 hover:text-red-400 p-1"
                        title="Delete Image"
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

        {/* Section 5: Vehicle Compatibility Multi-Select */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Car className="w-4 h-4 text-brand-amber" />
                <span>5. Vehicle Compatibility & Fitment ({fitments.length})</span>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cascading Vehicle Selector Form */}
            <div className="p-4 rounded-xl bg-brand-zinc-800/60 border border-brand-zinc-700/60 space-y-3">
              <div className="text-xs font-semibold text-brand-white">Add Compatible Vehicle</div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <div className="sm:col-span-1">
                  <Select
                    placeholder="Make..."
                    value={selectedFitMake}
                    onChange={(e) => {
                      setSelectedFitMake(e.target.value);
                      setSelectedFitModel("");
                    }}
                    options={makes.map((m) => ({ label: m.name, value: m.name }))}
                  />
                </div>

                <div className="sm:col-span-1">
                  <Select
                    placeholder="Model..."
                    value={selectedFitModel}
                    onChange={(e) => setSelectedFitModel(e.target.value)}
                    disabled={!currentMake || currentMake.models.length === 0}
                    options={
                      currentMake?.models.map((m) => ({
                        label: m.name,
                        value: m.name,
                      })) || []
                    }
                  />
                </div>

                <div>
                  <Input
                    placeholder="From (2014)"
                    type="number"
                    value={fitYearFrom}
                    onChange={(e) => setFitYearFrom(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div>
                  <Input
                    placeholder="To (2019)"
                    type="number"
                    value={fitYearTo}
                    onChange={(e) => setFitYearTo(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div>
                  <Input
                    placeholder="Engine (1.8L)"
                    value={fitEngine}
                    onChange={(e) => setFitEngine(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={handleAddFitment}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add Compatibility
                </Button>
              </div>
            </div>

            {/* Fitments List */}
            {fitments.length === 0 ? (
              <div className="text-center py-6 text-xs text-brand-zinc-500">
                No vehicles linked to this part yet. Add compatibility above.
              </div>
            ) : (
              <div className="divide-y divide-brand-zinc-800">
                {fitments.map((fit, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <Badge variant="green" dot>
                        {fit.make} {fit.model}
                      </Badge>
                      <span className="text-brand-zinc-300">
                        {fit.yearFrom} &mdash; {fit.yearTo}
                      </span>
                      {fit.engine && (
                        <span className="text-brand-zinc-400 font-mono text-[11px]">
                          ({fit.engine})
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFitment(idx)}
                      className="p-1 text-brand-zinc-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 6: Publishing & Visibility Flags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">6. Publishing Flags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <label className="flex items-center gap-2 p-3 rounded-lg bg-brand-zinc-800/40 border border-brand-zinc-700/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="rounded text-brand-amber focus:ring-brand-amber bg-brand-zinc-800"
                />
                <span className="font-semibold text-brand-white">Published in Store</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-lg bg-brand-zinc-800/40 border border-brand-zinc-700/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-brand-amber focus:ring-brand-amber bg-brand-zinc-800"
                />
                <span className="font-semibold text-brand-white">Featured Homepage</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-lg bg-brand-zinc-800/40 border border-brand-zinc-700/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bestseller}
                  onChange={(e) => setBestseller(e.target.checked)}
                  className="rounded text-brand-amber focus:ring-brand-amber bg-brand-zinc-800"
                />
                <span className="font-semibold text-brand-white">Bestseller Badge</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-lg bg-brand-zinc-800/40 border border-brand-zinc-700/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={professionalInstall}
                  onChange={(e) => setProfessionalInstall(e.target.checked)}
                  className="rounded text-brand-amber focus:ring-brand-amber bg-brand-zinc-800"
                />
                <span className="font-semibold text-brand-white">Requires Pro Install</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-zinc-800">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Save & Publish Product
          </Button>
        </div>
      </form>

      {/* Quick Add Brand Modal */}
      {quickBrandModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setQuickBrandModalOpen(false)}
          title="Quick Add Part Brand"
          size="sm"
        >
          <form onSubmit={handleQuickAddBrand} className="space-y-4">
            <Input
              label="Brand Name *"
              placeholder="e.g. Bosch, Brembo, Denso, NGK"
              value={quickBrandName}
              onChange={(e) => setQuickBrandName(e.target.value)}
              className="text-xs"
              autoFocus
              required
            />
            <Input
              label="Country of Origin"
              placeholder="e.g. Germany, Japan, Italy, USA"
              value={quickBrandCountry}
              onChange={(e) => setQuickBrandCountry(e.target.value)}
              className="text-xs"
            />
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-zinc-700">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setQuickBrandModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={quickBrandSubmitting}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Save & Select
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

