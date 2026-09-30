"use client";

import { useState } from "react";
import { Search, CheckCircle2, AlertCircle } from "lucide-react";
import { FitmentRecord } from "@/lib/fitment";
import { Input, EmptyState } from "@/components/ui";

interface CompatibilityTableProps {
  fitments: FitmentRecord[];
  productName: string;
}

export function CompatibilityTable({ fitments, productName }: CompatibilityTableProps) {
  const [filterQuery, setFilterQuery] = useState("");

  const filtered = fitments.filter((f) => {
    const q = filterQuery.toLowerCase();
    return (
      f.make.toLowerCase().includes(q) ||
      f.model.toLowerCase().includes(q) ||
      (f.engine && f.engine.toLowerCase().includes(q)) ||
      String(f.yearFrom).includes(q) ||
      String(f.yearTo).includes(q)
    );
  });

  if (fitments.length === 0) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Universal or Unspecified Application"
        description={`${productName} may fit various models. Contact our WhatsApp fitment team for exact chassis confirmation.`}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-brand-zinc-400">
          Showing <span className="text-brand-amber font-semibold">{filtered.length}</span> of{" "}
          <span>{fitments.length}</span> verified vehicle applications
        </div>
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search make, model, year..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            leftIcon={<Search className="w-3.5 h-3.5 text-brand-zinc-500" />}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-brand-zinc-800 bg-brand-zinc-900/60">
        <table className="w-full text-left text-xs">
          <thead className="bg-brand-zinc-800/80 text-brand-zinc-300 font-heading font-semibold uppercase tracking-wider border-b border-brand-zinc-700">
            <tr>
              <th className="px-4 py-3">Make</th>
              <th className="px-4 py-3">Model</th>
              <th className="px-4 py-3">Year Range</th>
              <th className="px-4 py-3">Engine / Trim</th>
              <th className="px-4 py-3">Fitment Notes</th>
              <th className="px-4 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-zinc-800/80">
            {filtered.map((item, idx) => (
              <tr
                key={idx}
                className="hover:bg-brand-zinc-800/40 transition-colors text-brand-zinc-300"
              >
                <td className="px-4 py-3 font-semibold text-brand-white">{item.make}</td>
                <td className="px-4 py-3 font-medium text-brand-zinc-200">{item.model}</td>
                <td className="px-4 py-3 text-brand-zinc-400 font-mono">
                  {item.yearFrom} – {item.yearTo}
                </td>
                <td className="px-4 py-3 text-brand-zinc-300">{item.engine || "All Engines"}</td>
                <td className="px-4 py-3 text-brand-zinc-400 italic">
                  {item.notes || "Standard fitment"}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
