"use client";

import { useState, useEffect } from "react";
import { Inbox, RefreshCw, Mail, Phone, Building2 } from "lucide-react";
import { Button, Card, CardContent, Badge, Spinner } from "@/components/ui";

interface QuoteItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string | null;
  vehicleInfo?: string | null;
  partsList: string;
  status: "PENDING" | "QUOTED" | "CLOSED";
  notes?: string | null;
  createdAt: string;
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/quotes");
      if (res.ok) {
        setQuotes(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleUpdateStatus = async (id: string, status: "PENDING" | "QUOTED" | "CLOSED") => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/quotes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        await fetchQuotes();
      }
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-white">
            Quote Requests & Wholesale Inbox
          </h1>
          <p className="text-xs sm:text-sm text-brand-zinc-400 mt-1">
            Review custom auto parts inquiries, bulk quote requests, and workshop applications
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={fetchQuotes}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />}
        >
          Refresh
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 flex justify-center">
              <Spinner size="lg" color="amber" />
            </div>
          ) : quotes.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <Inbox className="w-10 h-10 text-brand-zinc-600 mx-auto" />
              <div className="text-base font-semibold text-brand-white">No quote requests yet</div>
              <p className="text-xs text-brand-zinc-500">
                When visitors submit wholesale inquiries, they will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-brand-zinc-800">
              {quotes.map((q) => (
                <div key={q.id} className="p-5 hover:bg-brand-zinc-800/20 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold text-sm text-brand-white">{q.name}</div>
                      {q.companyName && (
                        <div className="flex items-center gap-1 text-xs text-brand-zinc-400">
                          <Building2 className="w-3.5 h-3.5 text-brand-amber" />
                          <span>{q.companyName}</span>
                        </div>
                      )}
                      <Badge
                        size="sm"
                        variant={
                          q.status === "QUOTED"
                            ? "green"
                            : q.status === "CLOSED"
                            ? "zinc"
                            : "amber"
                        }
                      >
                        {q.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span className="text-[11px] text-brand-zinc-500">
                        {new Date(q.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex gap-1.5 ml-2">
                        {q.status !== "QUOTED" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={updatingId === q.id}
                            onClick={() => handleUpdateStatus(q.id, "QUOTED")}
                          >
                            Mark Quoted
                          </Button>
                        )}
                        {q.status !== "CLOSED" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={updatingId === q.id}
                            onClick={() => handleUpdateStatus(q.id, "CLOSED")}
                          >
                            Close
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-brand-zinc-400">
                    <div className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      <a href={`mailto:${q.email}`} className="hover:text-brand-amber underline">
                        {q.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      <a
                        href={`https://wa.me/${q.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        className="hover:text-brand-amber underline"
                      >
                        {q.phone}
                      </a>
                    </div>
                    {q.vehicleInfo && (
                      <div className="text-brand-zinc-300 font-medium">
                        Vehicle: {q.vehicleInfo}
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-lg bg-brand-zinc-800/60 border border-brand-zinc-700/60 text-xs text-brand-zinc-200 whitespace-pre-wrap">
                    {q.partsList}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
