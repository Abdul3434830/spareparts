"use client";

import { useState, useEffect } from "react";
import { Users, RefreshCw } from "lucide-react";
import { Button, Card, CardContent, Badge, Spinner } from "@/components/ui";

interface CustomerUser {
  id: string;
  name?: string | null;
  email: string;
  phone?: string | null;
  role: "CUSTOMER" | "WHOLESALE" | "ADMIN";
  isApproved: boolean;
  createdAt: string;
  _count: {
    orders: number;
    garage: number;
  };
}

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<CustomerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/customers");
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleWholesaleApproval = async (id: string, currentApproval: boolean) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/customers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isApproved: !currentApproval }),
      });
      if (res.ok) {
        await fetchUsers();
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
            Customers & Wholesale Accounts
          </h1>
          <p className="text-xs sm:text-sm text-brand-zinc-400 mt-1">
            Registered accounts, garage vehicles count, and wholesale discount tier approval
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={fetchUsers}
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
          ) : users.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <Users className="w-10 h-10 text-brand-zinc-600 mx-auto" />
              <div className="text-base font-semibold text-brand-white">No registered accounts</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-brand-zinc-800 bg-brand-zinc-800/40 text-brand-zinc-400">
                    <th className="py-3 px-4 font-semibold">User</th>
                    <th className="py-3 px-4 font-semibold">Role</th>
                    <th className="py-3 px-4 font-semibold">Wholesale Status</th>
                    <th className="py-3 px-4 font-semibold">Orders</th>
                    <th className="py-3 px-4 font-semibold">Garage</th>
                    <th className="py-3 px-4 font-semibold">Registered</th>
                    <th className="py-3 px-4 text-right font-semibold">Wholesale Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-zinc-800">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-brand-zinc-800/25 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-brand-white">{u.name || "Customer"}</div>
                        <div className="text-[11px] text-brand-zinc-400 flex items-center gap-2">
                          <span>{u.email}</span>
                          {u.phone && <span>• {u.phone}</span>}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <Badge
                          size="sm"
                          variant={
                            u.role === "ADMIN"
                              ? "amber"
                              : u.role === "WHOLESALE"
                              ? "purple"
                              : "zinc"
                          }
                        >
                          {u.role}
                        </Badge>
                      </td>

                      <td className="py-3 px-4">
                        {u.role === "WHOLESALE" ? (
                          <Badge size="sm" variant={u.isApproved ? "green" : "red"} dot>
                            {u.isApproved ? "Approved Wholesale" : "Pending Approval"}
                          </Badge>
                        ) : (
                          <span className="text-brand-zinc-500 text-[11px]">Retail Account</span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-semibold text-brand-zinc-300">
                        {u._count.orders} {u._count.orders === 1 ? "order" : "orders"}
                      </td>

                      <td className="py-3 px-4 text-brand-zinc-300">
                        {u._count.garage} cars
                      </td>

                      <td className="py-3 px-4 text-brand-zinc-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {u.role === "WHOLESALE" ? (
                          <Button
                            size="sm"
                            variant={u.isApproved ? "outline" : "primary"}
                            loading={updatingId === u.id}
                            onClick={() => handleToggleWholesaleApproval(u.id, u.isApproved)}
                          >
                            {u.isApproved ? "Revoke Access" : "Approve Wholesale"}
                          </Button>
                        ) : (
                          <span className="text-[11px] text-brand-zinc-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
