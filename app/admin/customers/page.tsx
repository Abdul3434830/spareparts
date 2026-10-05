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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-white">
            Customer Accounts
          </h1>
          <p className="text-xs sm:text-sm text-brand-zinc-400 mt-1">
            Registered customer accounts, saved garage vehicles count, and order history
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
                    <th className="py-3 px-4 font-semibold">Customer</th>
                    <th className="py-3 px-4 font-semibold">Role</th>
                    <th className="py-3 px-4 font-semibold">Orders</th>
                    <th className="py-3 px-4 font-semibold">My Garage</th>
                    <th className="py-3 px-4 text-right font-semibold">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-zinc-800">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-brand-zinc-800/25 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-brand-white">{u.name || "Customer"}</div>
                        <div className="text-[11px] text-brand-zinc-400 flex items-center gap-2 mt-0.5">
                          <span>{u.email}</span>
                          {u.phone && <span>• {u.phone}</span>}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <Badge
                          size="sm"
                          variant={u.role === "ADMIN" ? "amber" : "zinc"}
                        >
                          {u.role}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 font-semibold text-brand-zinc-300">
                        {u._count.orders} {u._count.orders === 1 ? "order" : "orders"}
                      </td>

                      <td className="py-3 px-4 text-brand-zinc-300">
                        {u._count.garage} {u._count.garage === 1 ? "car" : "cars"}
                      </td>

                      <td className="py-3 px-4 text-right text-brand-zinc-400">
                        {new Date(u.createdAt).toLocaleDateString()}
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
