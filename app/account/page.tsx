"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import AccountShell from "@/components/AccountShell";
import { useMyOrders } from "@/lib/hooks";

function shortId(id: string) {
  return id.slice(-8).toUpperCase();
}

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString();
}

export default function OrdersPage() {
  const { data, isLoading, isError } = useMyOrders({ limit: 20 });

  return (
    <AccountShell title="My Account">
      <h2 className="font-semibold mb-4">Recent Orders</h2>
      {isLoading ? (
        <div className="text-sm text-neutral-500">Loading orders…</div>
      ) : isError ? (
        <div className="text-sm text-rose-600">Could not load orders. Try refreshing.</div>
      ) : !data || data.total === 0 ? (
        <div className="border border-neutral-200 p-10 text-center text-sm text-neutral-500">
          No orders yet.{" "}
          <Link href="/c/models" className="underline">
            Browse 3D Models
          </Link>
        </div>
      ) : (
        <div className="border border-neutral-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Order</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-5 py-3 font-medium">Items</th>
                <th className="text-left px-5 py-3 font-medium">Total</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((o) => (
                <tr key={o.id} className="border-t border-neutral-200 hover:bg-neutral-50">
                  <td className="px-5 py-3 font-medium">
                    <Link href={`/account/orders/${o.id}`} className="hover:underline">
                      {shortId(o.id)}
                    </Link>
                  </td>
                  <td className="px-5 py-3">{formatDate(o.createdAt)}</td>
                  <td className="px-5 py-3">{o.items.length}</td>
                  <td className="px-5 py-3">₹ {o.total.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs rounded-full px-2.5 py-0.5 ${
                        o.status === "paid"
                          ? "bg-emerald-50 text-emerald-700"
                          : o.status === "pending"
                          ? "bg-amber-50 text-amber-700"
                          : o.status === "refunded"
                          ? "bg-sky-50 text-sky-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/account/orders/${o.id}`} className="text-xs underline">
                        View
                      </Link>
                      {o.status === "paid" && o.downloadToken && (
                        <Link
                          href={`/account/downloads?token=${encodeURIComponent(o.downloadToken)}`}
                          className="text-xs underline flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" /> Download
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AccountShell>
  );
}
