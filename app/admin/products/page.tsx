"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Download,
  Upload,
  Trash2,
  Edit,
  CheckCircle2,
  Package,
  FileSpreadsheet,
} from "lucide-react";
import { Button, Input, Card, CardContent, Badge, Spinner, Modal } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

interface ProductSummary {
  id: string;
  name: string;
  partNumber: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  published: boolean;
  featured: boolean;
  bestseller: boolean;
  brand: { id: string; name: string };
  category: { id: string; name: string };
  images: { id: string; url: string; isPrimary: boolean }[];
  _count: { fitments: number };
}

interface ImportReport {
  summary: {
    created: number;
    updated: number;
    failed: number;
  };
  errors?: {
    row: number;
    partNumber?: string;
    reason: string;
  }[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lowStockFilter, setLowStockFilter] = useState(false);

  // CSV Import Modal State
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importReport, setImportReport] = useState<ImportReport | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });
      if (search) params.set("q", search);
      if (lowStockFilter) params.set("lowStock", "true");

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, lowStockFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete product "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImportCsv = async () => {
    if (!csvFile) return;
    setIsImporting(true);
    setImportReport(null);

    try {
      const text = await csvFile.text();
      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvContent: text }),
      });

      const json = await res.json();
      if (res.ok) {
        setImportReport(json);
        await fetchProducts();
      } else {
        alert(json.error || "Failed to process CSV file");
      }
    } catch (err) {
      alert((err as Error).message || "Import error");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-white">
            Products Catalog
          </h1>
          <p className="text-xs sm:text-sm text-brand-zinc-400 mt-1">
            Manage spare parts inventory, pricing, vehicle fitments, and bulk CSV operations
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <a href="/api/admin/products/export" download>
            <Button variant="secondary" size="sm" leftIcon={<Download className="w-4 h-4" />}>
              Export CSV
            </Button>
          </a>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setImportReport(null);
              setCsvFile(null);
              setIsImportOpen(true);
            }}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Import CSV
          </Button>
          <Link href="/admin/products/new">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row items-center justify-between gap-3"
          >
            <div className="w-full sm:max-w-md">
              <Input
                placeholder="Search by part number, name, or OEM number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-brand-zinc-400" />}
                className="text-xs"
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <label className="flex items-center gap-2 text-xs text-brand-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lowStockFilter}
                  onChange={(e) => {
                    setLowStockFilter(e.target.checked);
                    setPage(1);
                  }}
                  className="rounded border-brand-zinc-700 text-brand-amber focus:ring-brand-amber bg-brand-zinc-800"
                />
                <span>Low Stock Only (&le; 5)</span>
              </label>
              <Button type="submit" size="sm" variant="secondary">
                Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 flex justify-center">
              <Spinner size="lg" color="amber" />
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <Package className="w-10 h-10 text-brand-zinc-600 mx-auto" />
              <div className="text-base font-semibold text-brand-white">No products found</div>
              <p className="text-xs text-brand-zinc-500 max-w-sm mx-auto">
                No items match your criteria. Add new products manually or upload a CSV catalog.
              </p>
              <Link href="/admin/products/new">
                <Button variant="primary" size="sm" className="mt-2">
                  Create First Product
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-brand-zinc-800 bg-brand-zinc-800/40 text-brand-zinc-400">
                    <th className="py-3 px-4 font-semibold">Product</th>
                    <th className="py-3 px-4 font-semibold">SKU / OEM</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Retail Price</th>
                    <th className="py-3 px-4 font-semibold">Stock</th>
                    <th className="py-3 px-4 font-semibold">Fitments</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-zinc-800">
                  {products.map((p) => {
                    const primaryImage = p.images.find((i) => i.isPrimary) || p.images[0];
                    const isLow = p.stock <= p.lowStockThreshold;

                    return (
                      <tr key={p.id} className="hover:bg-brand-zinc-800/25 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-brand-zinc-800 border border-brand-zinc-700 flex items-center justify-center shrink-0 overflow-hidden">
                              {primaryImage ? (
                                <img
                                  src={primaryImage.url}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-5 h-5 text-brand-zinc-600" />
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-brand-white max-w-xs truncate">
                                {p.name}
                              </div>
                              <div className="text-[11px] text-brand-zinc-400">{p.brand.name}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono text-brand-zinc-300">
                          <div>{p.partNumber}</div>
                        </td>

                        <td className="py-3 px-4 text-brand-zinc-300">
                          {p.category.name}
                        </td>

                        <td className="py-3 px-4 font-bold text-brand-amber font-heading">
                          {formatPrice(p.price)}
                        </td>

                        <td className="py-3 px-4">
                          <Badge size="sm" variant={isLow ? "red" : "zinc"} dot={isLow}>
                            {p.stock} units
                          </Badge>
                        </td>

                        <td className="py-3 px-4 text-brand-zinc-300">
                          <span className="text-[11px] font-semibold">
                            {p._count.fitments} {p._count.fitments === 1 ? "car" : "cars"}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <Badge size="sm" variant={p.published ? "green" : "zinc"}>
                            {p.published ? "Published" : "Draft"}
                          </Badge>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Link href={`/admin/products/${p.id}`}>
                              <button
                                type="button"
                                className="p-1.5 text-brand-zinc-400 hover:text-brand-amber rounded transition-colors"
                                title="Edit Product"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 text-brand-zinc-400 hover:text-red-400 rounded transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-brand-zinc-800 flex items-center justify-between text-xs">
              <span className="text-brand-zinc-400">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CSV Import Modal */}
      <Modal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Bulk CSV Catalog Import"
        description="Upload a CSV with PartNumber, Name, Brand, Category, Price, and Stock columns. Processed safely in chunks."
      >
        <div className="space-y-4 py-2">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-8 border-2 border-dashed border-brand-zinc-700 hover:border-brand-amber rounded-xl text-center cursor-pointer transition-colors"
          >
            <FileSpreadsheet className="w-10 h-10 text-brand-amber mx-auto mb-2" />
            <div className="text-xs font-semibold text-brand-white">
              {csvFile ? csvFile.name : "Click to select CSV file"}
            </div>
            <p className="text-[11px] text-brand-zinc-500 mt-1">
              Supports .csv format with standard UTF-8 encoding
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </div>

          {importReport && (
            <div className="p-4 rounded-xl bg-brand-zinc-800 border border-brand-zinc-700 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Import Completed!</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 text-center font-mono">
                <div className="p-2 rounded bg-brand-zinc-900">
                  <div className="text-green-400 font-bold">{importReport.summary.created}</div>
                  <div className="text-[10px] text-brand-zinc-400">Created</div>
                </div>
                <div className="p-2 rounded bg-brand-zinc-900">
                  <div className="text-brand-amber font-bold">{importReport.summary.updated}</div>
                  <div className="text-[10px] text-brand-zinc-400">Updated</div>
                </div>
                <div className="p-2 rounded bg-brand-zinc-900">
                  <div className="text-red-400 font-bold">{importReport.summary.failed}</div>
                  <div className="text-[10px] text-brand-zinc-400">Failed</div>
                </div>
              </div>

              {importReport.errors && importReport.errors.length > 0 && (
                <div className="max-h-32 overflow-y-auto space-y-1 pt-2 border-t border-brand-zinc-700">
                  <div className="text-[11px] font-semibold text-red-400">Row Errors:</div>
                  {importReport.errors.map((err, idx: number) => (
                    <div key={idx} className="text-[10px] text-brand-zinc-400">
                      Row {err.row} ({err.partNumber}): {err.reason}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-brand-zinc-800">
            <Button variant="secondary" onClick={() => setIsImportOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              disabled={!csvFile}
              loading={isImporting}
              onClick={handleImportCsv}
            >
              Start Processing
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
