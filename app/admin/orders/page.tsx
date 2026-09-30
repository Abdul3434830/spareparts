"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Eye,
  RefreshCw,
  Receipt,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { Button, Input, Select, Card, CardContent, Badge, Spinner, Modal } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  id: string;
  name: string;
  partNumber: string;
  price: number;
  quantity: number;
  total: number;
}

interface OrderHistoryItem {
  id: string;
  status: string;
  note?: string | null;
  createdAt: string;
}

interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    streetAddress?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  fitmentConfirmed: boolean;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  trackingNumber?: string | null;
  bankTransferProofUrl?: string | null;
  notes?: string | null;
  createdAt: string;
  items: OrderItem[];
  statusHistory: OrderHistoryItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // Status Update State
  const [newStatus, setNewStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = statusFilter
        ? `/api/admin/orders?status=${statusFilter}`
        : "/api/admin/orders";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const openOrderDetail = (order: AdminOrder) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setTrackingNumber(order.trackingNumber || "");
    setStatusNote("");
  };

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedOrder.id,
          status: newStatus,
          trackingNumber: trackingNumber.trim() || null,
          note: statusNote.trim() || undefined,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedOrder(updated);
        await fetchOrders();
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-white">
            Orders & Shipments
          </h1>
          <p className="text-xs sm:text-sm text-brand-zinc-400 mt-1">
            Dispatch verification, vehicle fitment check, payment slips, and courier tracking
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={fetchOrders}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />}
        >
          Refresh
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {["", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(
          (status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === status
                  ? "bg-brand-amber text-brand-black"
                  : "bg-brand-zinc-800 text-brand-zinc-300 hover:bg-brand-zinc-700"
              }`}
            >
              {status || "All Orders"}
            </button>
          )
        )}
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 flex justify-center">
              <Spinner size="lg" color="amber" />
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <ShoppingBag className="w-10 h-10 text-brand-zinc-600 mx-auto" />
              <div className="text-base font-semibold text-brand-white">No orders found</div>
              <p className="text-xs text-brand-zinc-500">
                Customer purchases will appear here with live notification badges.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-brand-zinc-800 bg-brand-zinc-800/40 text-brand-zinc-400">
                    <th className="py-3 px-4 font-semibold">Order #</th>
                    <th className="py-3 px-4 font-semibold">Customer</th>
                    <th className="py-3 px-4 font-semibold">Items</th>
                    <th className="py-3 px-4 font-semibold">Total</th>
                    <th className="py-3 px-4 font-semibold">Payment</th>
                    <th className="py-3 px-4 font-semibold">Fitment</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-zinc-800">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-brand-zinc-800/25 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-brand-white">
                        {o.orderNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-brand-zinc-200">{o.customerName}</div>
                        <div className="text-[11px] text-brand-zinc-400">{o.customerPhone}</div>
                      </td>
                      <td className="py-3 px-4 text-brand-zinc-300">
                        {o.items.length} {o.items.length === 1 ? "part" : "parts"}
                      </td>
                      <td className="py-3 px-4 font-bold text-brand-amber font-heading">
                        {formatPrice(o.total)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge size="sm" variant="zinc">
                          {o.paymentMethod.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          size="sm"
                          variant={o.fitmentConfirmed ? "green" : "red"}
                          dot
                        >
                          {o.fitmentConfirmed ? "Confirmed" : "Unverified"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          size="sm"
                          variant={
                            o.status === "DELIVERED"
                              ? "green"
                              : o.status === "CANCELLED"
                              ? "red"
                              : "amber"
                          }
                        >
                          {o.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openOrderDetail(o)}
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                        >
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail & Status Update Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Management: ${selectedOrder.orderNumber}`}
          description={`Placed on ${new Date(selectedOrder.createdAt).toLocaleDateString()}`}
          size="lg"
        >
          <div className="space-y-6 py-2 max-h-[75vh] overflow-y-auto">
            {/* Status Update Control Box */}
            <div className="p-4 rounded-xl bg-brand-zinc-800 border border-brand-zinc-700 space-y-3">
              <div className="text-xs font-semibold text-brand-white">Update Dispatch Status</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="Order Status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  options={[
                    { label: "PENDING", value: "PENDING" },
                    { label: "CONFIRMED", value: "CONFIRMED" },
                    { label: "PROCESSING", value: "PROCESSING" },
                    { label: "SHIPPED", value: "SHIPPED" },
                    { label: "DELIVERED", value: "DELIVERED" },
                    { label: "CANCELLED", value: "CANCELLED" },
                  ]}
                />

                <Input
                  label="Courier Tracking Number"
                  placeholder="e.g. TCS-78901234 or LEOPARDS-456"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="text-xs font-mono"
                />
              </div>

              <Input
                label="Timeline Note (optional)"
                placeholder="e.g. Package dispatched via Leopard Express overnight"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="text-xs"
              />

              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="primary"
                  loading={isUpdating}
                  onClick={handleUpdateOrderStatus}
                >
                  Save Order Updates
                </Button>
              </div>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-brand-zinc-800/50 border border-brand-zinc-700/60 space-y-1.5">
                <div className="font-semibold text-brand-white flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-brand-amber" />
                  <span>Customer Details</span>
                </div>
                <div>{selectedOrder.customerName}</div>
                <div className="text-brand-zinc-400">{selectedOrder.customerEmail}</div>
                <div className="text-brand-zinc-400 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {selectedOrder.customerPhone}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-brand-zinc-800/50 border border-brand-zinc-700/60 space-y-1.5">
                <div className="font-semibold text-brand-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-amber" />
                  <span>Delivery Address</span>
                </div>
                <div>{selectedOrder.shippingAddress?.streetAddress || "Street Address"}</div>
                <div className="text-brand-zinc-400">
                  {selectedOrder.shippingAddress?.city || "City"},{" "}
                  {selectedOrder.shippingAddress?.postalCode || ""}
                </div>
              </div>
            </div>

            {/* Bank Transfer Receipt Slip Preview if present */}
            {selectedOrder.bankTransferProofUrl && (
              <div className="p-4 rounded-xl bg-brand-zinc-800/60 border border-brand-zinc-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-brand-white flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-brand-amber" />
                    <span>Bank Transfer Payment Proof (Vercel Blob)</span>
                  </div>
                  <a
                    href={selectedOrder.bankTransferProofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-brand-amber font-semibold hover:underline flex items-center gap-1"
                  >
                    View Original <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="max-h-48 rounded-lg overflow-hidden bg-brand-black flex items-center justify-center p-2">
                  <img
                    src={selectedOrder.bankTransferProofUrl}
                    alt="Payment Slip"
                    className="max-h-44 object-contain rounded"
                  />
                </div>
              </div>
            )}

            {/* Ordered Parts List */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-brand-zinc-400 uppercase tracking-wider">
                Order Items ({selectedOrder.items.length})
              </div>
              <div className="divide-y divide-brand-zinc-800 border border-brand-zinc-800 rounded-xl overflow-hidden bg-brand-zinc-900/40">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-brand-white">{item.name}</div>
                      <div className="text-[11px] text-brand-zinc-400 font-mono">
                        SKU: {item.partNumber} • Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="font-bold text-brand-amber font-heading">
                      {formatPrice(item.total)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Totals */}
            <div className="p-4 rounded-xl bg-brand-zinc-800/40 border border-brand-zinc-700/60 space-y-1.5 text-xs text-brand-zinc-300">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span>{formatPrice(selectedOrder.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-brand-white pt-2 border-t border-brand-zinc-700">
                <span>Total:</span>
                <span className="text-brand-amber font-heading">
                  {formatPrice(selectedOrder.total)}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
