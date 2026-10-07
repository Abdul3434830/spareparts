"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Edit2, Check, X, ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Badge, Spinner } from "@/components/ui";

interface SubcategoryItem {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  _count?: { subcategoryProducts: number };
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sortOrder: number;
  subcategories: SubcategoryItem[];
  _count?: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Add Subcategory State
  const [addingSubParentId, setAddingSubParentId] = useState<string | null>(null);
  const [newSubName, setNewSubName] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const startEdit = (cat: CategoryItem | SubcategoryItem, desc?: string | null) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditDesc(desc || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDesc("");
  };

  const saveEdit = async (id: string) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name: editName.trim(),
          description: editDesc.trim() || null,
        }),
      });
      if (res.ok) {
        cancelEdit();
        await fetchCategories();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSubcategory = async (parentId: string) => {
    if (!newSubName.trim()) return;
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSubName.trim(),
          parentId,
        }),
      });
      if (res.ok) {
        setNewSubName("");
        setAddingSubParentId(null);
        await fetchCategories();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id: string, name: string, isSub: boolean) => {
    const confirmMsg = isSub
      ? `Delete subcategory "${name}"? It will be removed from products and the website.`
      : `Delete category "${name}"? WARNING: All products and subcategories in this category will be permanently deleted from the database and website!`;
    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchCategories();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete");
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
            Categories & Subcategories
          </h1>
          <p className="text-xs sm:text-sm text-brand-zinc-400 mt-1">
            Manage the 12 automotive categories, descriptions, and custom subcategory entries
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={fetchCategories}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />}
        >
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Seeded Categories Hierarchy</span>
            <Badge variant="amber">12 Master Categories</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 flex justify-center">
              <Spinner size="lg" color="amber" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-xs text-brand-zinc-500">
              No categories found. Run database seed to initialize.
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((cat, idx) => {
                const isExpanded = expandedId === cat.id;
                const isEditing = editingId === cat.id;

                return (
                  <div
                    key={cat.id}
                    className="border border-brand-zinc-800 rounded-xl bg-brand-zinc-800/30 overflow-hidden"
                  >
                    {/* Category Header Row */}
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : cat.id)}
                          className="p-1 text-brand-zinc-400 hover:text-brand-white transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-brand-amber" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>

                        <div className="w-7 h-7 rounded-lg bg-brand-zinc-800 border border-brand-zinc-700 flex items-center justify-center text-xs font-bold text-brand-amber shrink-0">
                          {idx + 1}
                        </div>

                        {isEditing ? (
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="text-xs py-1"
                            />
                            <Input
                              value={editDesc}
                              placeholder="Description"
                              onChange={(e) => setEditDesc(e.target.value)}
                              className="text-xs py-1"
                            />
                            <button
                              type="button"
                              onClick={() => saveEdit(cat.id)}
                              className="p-1.5 text-green-400 hover:bg-brand-zinc-700 rounded-md"
                              disabled={isSaving}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="p-1.5 text-brand-zinc-400 hover:bg-brand-zinc-700 rounded-md"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div className="font-semibold text-sm text-brand-white flex items-center gap-2">
                              <span>{cat.name}</span>
                              <span className="text-xs text-brand-zinc-500 font-mono">
                                /{cat.slug}
                              </span>
                            </div>
                            {cat.description && (
                              <p className="text-xs text-brand-zinc-400 mt-0.5">
                                {cat.description}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {!isEditing && (
                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <Badge size="sm" variant="zinc">
                            {cat.subcategories.length} subcategories
                          </Badge>
                          <Badge size="sm" variant="amber">
                            {cat._count?.products || 0} products
                          </Badge>
                          <button
                            type="button"
                            onClick={() => startEdit(cat, cat.description)}
                            className="p-1.5 text-brand-zinc-400 hover:text-brand-amber rounded-md transition-colors"
                            title="Edit Category"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id, cat.name, false)}
                            className="p-1.5 text-brand-zinc-500 hover:text-rose-400 rounded-md transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Subcategories Accordion Content */}
                    {isExpanded && (
                      <div className="bg-brand-zinc-900/60 p-4 border-t border-brand-zinc-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-semibold text-brand-zinc-400 uppercase tracking-wider">
                            Subcategories for {cat.name}
                          </div>
                          <button
                            type="button"
                            onClick={() => setAddingSubParentId(cat.id)}
                            className="inline-flex items-center gap-1 text-xs text-brand-amber font-semibold hover:underline"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add Subcategory
                          </button>
                        </div>

                        {addingSubParentId === cat.id && (
                          <div className="flex items-center gap-2 p-3 bg-brand-zinc-800 rounded-lg border border-brand-zinc-700">
                            <Input
                              placeholder="Subcategory name (e.g. Brake Caliper Paint)"
                              value={newSubName}
                              onChange={(e) => setNewSubName(e.target.value)}
                              className="text-xs"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="primary"
                              onClick={() => handleAddSubcategory(cat.id)}
                            >
                              Save
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setAddingSubParentId(null);
                                setNewSubName("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {cat.subcategories.map((sub) => (
                            <div
                              key={sub.id}
                              className="p-2.5 rounded-lg bg-brand-zinc-800/40 border border-brand-zinc-700/40 flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-semibold text-brand-zinc-200">
                                  {sub.name}
                                </span>
                                <div className="text-[10px] text-brand-zinc-500 font-mono">
                                  /{sub.slug}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-brand-zinc-400">
                                  {sub._count?.subcategoryProducts || 0} parts
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCategory(sub.id, sub.name, true)}
                                  className="p-1 text-brand-zinc-500 hover:text-rose-400 rounded transition-colors"
                                  title="Delete Subcategory"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
