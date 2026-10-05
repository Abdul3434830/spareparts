"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  RefreshCw,
  Receipt,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  MessageSquare,
  Building2,
  Smartphone,
  Wallet,
  RotateCcw,
  AlertCircle,
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
    street?: string;
    city?: string;
    state?: string;
    province?: string;
    postalCode?: string;
  };
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  transactionId?: string | null;
  senderAccount?: string | null;
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
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [copiedTid, setCopiedTid] = useState(false);

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
    setNewPaymentStatus(order.paymentStatus || "PENDING");
    setTrackingNumber(order.trackingNumber || "");
    setStatusNote("");
    setCopiedTid(false);
  };

  const copyTidToClipboard = (tid: string) => {
    navigator.clipboard.writeText(tid);
    setCopiedTid(true);
    setTimeout(() => setCopiedTid(false), 2000);
  };

  const handleUpdateOrderStatus = async (
    overrideStatus?: string,
    overridePaymentStatus?: string,
    customNote?: string
  ) => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      const finalStatus = overrideStatus || newStatus;
      const finalPaymentStatus = overridePaymentStatus || newPaymentStatus;

      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedOrder.id,
          status: finalStatus,
          paymentStatus: finalPaymentStatus,
          trackingNumber: trackingNumber.trim() || null,
          note:
            customNote ||
            statusNote.trim() ||
            `Updated by admin to ${finalStatus} (Payment: ${finalPaymentStatus})`,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedOrder(updated);
        setNewStatus(updated.status);
        setNewPaymentStatus(updated.paymentStatus);
        await fetchOrders();
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const formatPaymentMethodName = (method: string) => {
    switch (method) {
      case "BANK_TRANSFER":
        return "Meezan Bank";
      case "EASYPAISA":
        return "Easypaisa";
      case "JAZZ_CASH":
        return "JazzCash";
      case "CASH_ON_DELIVERY":
        return "COD";
      default:
        return method.replace(/_/g, " ");
    }
  };

  const formatWhatsAppUrl = (phone: string, orderNumber: string) => {
    let cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "92" + cleanPhone.slice(1);
    }
    const message = `Hello! This is CARS SPARE PARTS regarding your Order #${orderNumber}.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-white">
            Orders & Shipments
          </h1>
          <p className="text-xs sm:text-sm text-brand-zinc-400 mt-1">
            Payment verification (Meezan Bank, Easypaisa, JazzCash), TID inspection, vehicle fitment check, and courier dispatch
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
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === status
                  ? "bg-brand-amber text-brand-black shadow-md shadow-brand-amber/10"
                  : "bg-brand-zinc-800 text-brand-zinc-400 hover:text-brand-white hover:bg-brand-zinc-700"
              }`}
            >
              {status === "" ? "All Orders" : status}
            </button>
          )
        )}
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center">
              <Spinner size="lg" color="amber" />
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <p className="text-sm font-semibold text-brand-zinc-300">No orders found</p>
              <p className="text-xs text-brand-zinc-500">
                Customer purchases will appear here with live payment notification badges.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-brand-zinc-800 bg-brand-zinc-800/40 text-brand-zinc-400">
                    <th className="py-3 px-4 font-semibold">Order #</th>
                    <th className="py-3 px-4 font-semibold">Customer</th>
                    <th className="py-3 px-4 font-semibold">Total</th>
                    <th className="py-3 px-4 font-semibold">Payment Method</th>
                    <th className="py-3 px-4 font-semibold">Transaction ID (TID)</th>
                    <th className="py-3 px-4 font-semibold">Payment Status</th>
                    <th className="py-3 px-4 font-semibold">Order Status</th>
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
                      <td className="py-3 px-4 font-bold text-brand-amber font-heading">
                        {formatPrice(o.total)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge size="sm" variant="zinc">
                          {formatPaymentMethodName(o.paymentMethod)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {o.transactionId ? (
                          <span className="font-mono text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                            {o.transactionId}
                          </span>
                        ) : (
                          <span className="text-brand-zinc-500 italic">None</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          size="sm"
                          variant={
                            o.paymentStatus === "PAID"
                              ? "green"
                              : o.paymentStatus === "FAILED"
                              ? "red"
                              : "amber"
                          }
                          dot
                        >
                          {o.paymentStatus || "PENDING"}
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
            {/* Payment Verification & Quick Confirmation Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-brand-zinc-900 to-brand-zinc-950 border border-brand-zinc-700 space-y-4 shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-brand-zinc-800">
                <div className="flex items-center gap-2">
                  {selectedOrder.paymentMethod === "BANK_TRANSFER" ? (
                    <Building2 className="w-4 h-4 text-brand-amber" />
                  ) : selectedOrder.paymentMethod === "EASYPAISA" ? (
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Wallet className="w-4 h-4 text-amber-400" />
                  )}
                  <span className="font-heading font-bold text-xs text-brand-white uppercase tracking-wider">
                    Payment Verification
                  </span>
                </div>

                <Badge
                  size="sm"
                  variant={
                    selectedOrder.paymentStatus === "PAID"
                      ? "green"
                      : selectedOrder.paymentStatus === "FAILED"
                      ? "red"
                      : "amber"
                  }
                  dot
                >
                  Payment: {selectedOrder.paymentStatus || "PENDING"}
                </Badge>
              </div>

              {/* TID and Method Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-brand-black/60 border border-brand-zinc-800 space-y-1">
                  <div className="text-[11px] text-brand-zinc-400">Payment Channel</div>
                  <div className="font-bold text-brand-white text-sm">
                    {formatPaymentMethodName(selectedOrder.paymentMethod)}
                  </div>
                  {selectedOrder.senderAccount && (
                    <div className="text-[11px] text-brand-zinc-400">
                      Sender Info: <span className="text-brand-zinc-200">{selectedOrder.senderAccount}</span>
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-brand-black/60 border border-brand-zinc-800 space-y-1">
                  <div className="text-[11px] text-brand-zinc-400">Transaction ID (TID)</div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-emerald-400 text-sm tracking-wide">
                      {selectedOrder.transactionId || "No TID Provided"}
                    </span>
                    {selectedOrder.transactionId && (
                      <button
                        type="button"
                        onClick={() => copyTidToClipboard(selectedOrder.transactionId!)}
                        className="px-2 py-1 rounded bg-brand-zinc-800 hover:bg-brand-zinc-700 text-brand-zinc-300 transition-colors flex items-center gap-1 text-[11px]"
                      >
                        {copiedTid ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedTid ? "Copied" : "Copy"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 1-Click Action Buttons for Admin */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-brand-zinc-800">
                <Button
                  size="sm"
                  variant="primary"
                  loading={isUpdating}
                  onClick={() =>
                    handleUpdateOrderStatus(
                      "CONFIRMED",
                      "PAID",
                      `Payment confirmed & received via ${selectedOrder.paymentMethod}. TID: ${selectedOrder.transactionId || "verified"}`
                    )
                  }
                  leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Confirm Payment (Mark Received & Confirm Order)
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  loading={isUpdating}
                  onClick={() =>
                    handleUpdateOrderStatus(
                      selectedOrder.status,
                      "FAILED",
                      "Payment marked as failed / not received by admin"
                    )
                  }
                  leftIcon={<XCircle className="w-3.5 h-3.5 text-rose-400" />}
                  className="text-xs text-rose-400 border-rose-500/30 hover:bg-rose-950/30"
                >
                  Mark Payment Failed
                </Button>

                {selectedOrder.status !== "CANCELLED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    loading={isUpdating}
                    onClick={() => {
                      const totalUnits = selectedOrder.items.reduce((acc, it) => acc + it.quantity, 0);
                      if (
                        window.confirm(
                          `Cancel Order #${selectedOrder.orderNumber}?\n\nThis will automatically restore ${totalUnits} unit(s) of reserved stock back into product inventory.`
                        )
                      ) {
                        handleUpdateOrderStatus(
                          "CANCELLED",
                          selectedOrder.paymentStatus === "PAID" ? "REFUNDED" : "FAILED",
                          "Order cancelled by admin. Reserved stock has been automatically restored to inventory."
                        );
                      }
                    }}
                    leftIcon={<RotateCcw className="w-3.5 h-3.5 text-rose-400" />}
                    className="text-xs text-rose-400 border-rose-500/30 hover:bg-rose-950/30"
                  >
                    Cancel Order & Restock
                  </Button>
                )}

                <a
                  href={formatWhatsAppUrl(selectedOrder.customerPhone, selectedOrder.orderNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto"
                >
                  <Button
                    size="sm"
                    variant="secondary"
                    className="text-xs text-emerald-400 hover:bg-emerald-950/40 border-emerald-500/30"
                    leftIcon={<MessageSquare className="w-3.5 h-3.5 text-emerald-400" />}
                  >
                    WhatsApp Customer
                  </Button>
                </a>
              </div>
            </div>

            {/* Status Update Control Box */}
            <div className="p-4 rounded-xl bg-brand-zinc-800 border border-brand-zinc-700 space-y-3">
              <div className="text-xs font-semibold text-brand-white">Order Status & Courier Tracking</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

                <Select
                  label="Payment Status"
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value)}
                  options={[
                    { label: "PENDING", value: "PENDING" },
                    { label: "PAID", value: "PAID" },
                    { label: "FAILED", value: "FAILED" },
                    { label: "REFUNDED", value: "REFUNDED" },
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

              {newStatus === "CANCELLED" && selectedOrder.status !== "CANCELLED" && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <div>
                    <strong>Automatic Stock Restock:</strong> Changing status to <strong>CANCELLED</strong> will automatically add back{" "}
                    <span className="font-bold underline">
                      {selectedOrder.items.reduce((acc, it) => acc + it.quantity, 0)} reserved item(s)
                    </span>{" "}
                    to the product inventory.
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="primary"
                  loading={isUpdating}
                  onClick={() => handleUpdateOrderStatus()}
                >
                  Save Status Updates
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
                <div>
                  {selectedOrder.shippingAddress?.streetAddress ||
                    selectedOrder.shippingAddress?.street ||
                    "Street Address"}
                </div>
                <div className="text-brand-zinc-400">
                  {selectedOrder.shippingAddress?.city || "City"},{" "}
                  {selectedOrder.shippingAddress?.province ||
                    selectedOrder.shippingAddress?.state ||
                    ""}{" "}
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
                    <span>Payment Screenshot Proof</span>
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
                <div className="max-h-56 rounded-lg overflow-hidden bg-brand-black flex items-center justify-center p-2">
                  <img
                    src={selectedOrder.bankTransferProofUrl}
                    alt="Payment Slip"
                    className="max-h-52 object-contain rounded"
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
