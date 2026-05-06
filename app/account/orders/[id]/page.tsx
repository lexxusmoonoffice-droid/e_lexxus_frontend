"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Download, Package, Calendar, User as UserIcon } from "lucide-react";
import AccountShell from "@/components/AccountShell";
import { useMyOrder, apiError } from "@/lib/hooks";

function shortId(id: string) {
  return id.slice(-8).toUpperCase();
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

function statusClasses(status: string) {
  switch (status) {
    case "paid":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "refunded":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "failed":
    case "cancelled":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-neutral-100 text-neutral-700 border-neutral-200";
  }
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { data, isLoading, isError, error } = useMyOrder(id);

  if (isLoading) {
    return (
      <AccountShell title="Order">
        <div className="text-sm text-neutral-500">Loading…</div>
      </AccountShell>
    );
  }

  if (isError || !data?.order) {
    return (
      <AccountShell title="Order not found">
        <div className="border border-neutral-200 p-10 text-center">
          <p className="text-sm text-neutral-600">{apiError(error, "Order not found")}</p>
          <Link href="/account" className="mt-4 inline-block underline text-sm">← Back to orders</Link>
        </div>
      </AccountShell>
    );
  }

  const o = data.order;
  const downloadable = o.status === "paid" && !!o.downloadToken;
  const remaining =
    typeof o.downloadLimit === "number" && typeof o.downloadCount === "number"
      ? Math.max(0, o.downloadLimit - o.downloadCount)
      : undefined;
  const limitReached = remaining === 0;
  const tokenExpired = !!(o.tokenExpiresAt && new Date(o.tokenExpiresAt).getTime() < Date.now());
  const canDownload = downloadable && !limitReached && !tokenExpired;
  const showRefundedNotice = o.status === "refunded";

  return (
    <AccountShell title={`Order ${shortId(o.id)}`}>
      <Link href="/account" className="text-xs text-neutral-500 hover:text-black inline-flex items-center gap-1 mb-5">
        <ArrowLeft className="w-3 h-3" /> All orders
      </Link>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className={`text-xs uppercase tracking-widest border rounded-full px-3 py-1 ${statusClasses(o.status)}`}>
          {o.status}
        </span>
        <span className="text-xs text-neutral-500 inline-flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" /> Placed {formatDate(o.createdAt)}
        </span>
        {o.payment?.paidAt && (
          <span className="text-xs text-neutral-500">Paid {formatDate(o.payment.paidAt)}</span>
        )}
      </div>

      {showRefundedNotice && (
        <div className="mb-6 border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
          This order was refunded. Download links have been revoked.
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <section>
          <h3 className="font-semibold text-sm mb-3 inline-flex items-center gap-2">
            <Package className="w-4 h-4" /> Items ({o.items.length})
          </h3>
          <ul className="border border-neutral-200 divide-y divide-neutral-200">
            {o.items.map((it, idx) => {
              const thumb = it.product?.thumbnail || it.bundle?.image;
              const title = it.product?.title || it.bundle?.name || it.title || "Item";
              const slug = it.product?.slug
                ? `/product/${it.product.slug}`
                : it.bundle?.slug
                  ? `/bundles/${it.bundle.slug}`
                  : null;
              return (
                <li key={idx} className="flex items-center gap-4 p-4">
                  {thumb ? (
                    <img src={thumb} alt="" className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <div className="w-16 h-16 bg-neutral-100 rounded" />
                  )}
                  <div className="flex-1 min-w-0">
                    {slug ? (
                      <Link href={slug} className="font-medium text-sm hover:underline truncate block">
                        {title}
                      </Link>
                    ) : (
                      <span className="font-medium text-sm truncate block">{title}</span>
                    )}
                    <div className="text-xs text-neutral-500 mt-0.5">
                      {it.type === "bundle" ? "Bundle" : "3D Model"} · Qty {it.qty}
                    </div>
                  </div>
                  <div className="text-sm font-semibold whitespace-nowrap">
                    {o.currency === "INR" ? "₹" : ""}
                    {(it.priceAtPurchase * it.qty).toLocaleString("en-IN")}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <aside className="space-y-6">
          <section className="border border-neutral-200 p-5">
            <h3 className="font-semibold text-sm mb-3">Totals</h3>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-neutral-500">Subtotal</span>
              <span>₹ {o.subtotal.toLocaleString("en-IN")}</span>
            </div>
            {typeof o.tax === "number" && o.tax > 0 && (
              <div className="flex justify-between text-sm mb-1">
                <span className="text-neutral-500">Tax</span>
                <span>₹ {o.tax.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="border-t border-neutral-200 my-3" />
            <div className="flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span>₹ {o.total.toLocaleString("en-IN")}</span>
            </div>
          </section>

          {o.billing && (o.billing.name || o.billing.email) && (
            <section className="border border-neutral-200 p-5">
              <h3 className="font-semibold text-sm mb-3 inline-flex items-center gap-2">
                <UserIcon className="w-4 h-4" /> Billing
              </h3>
              <div className="text-sm text-neutral-700 space-y-0.5">
                {o.billing.name && <div>{o.billing.name}</div>}
                {o.billing.email && <div className="text-neutral-500">{o.billing.email}</div>}
                {o.billing.country && <div className="text-neutral-500">{o.billing.country}</div>}
              </div>
            </section>
          )}

          {downloadable ? (
            <section className={`border p-5 ${canDownload ? "border-emerald-200 bg-emerald-50" : "border-neutral-200 bg-neutral-50"}`}>
              <h3 className={`font-semibold text-sm mb-1 ${canDownload ? "text-emerald-900" : "text-neutral-700"}`}>
                {canDownload ? "Your downloads are ready" : limitReached ? "Download limit reached" : "Download link expired"}
              </h3>
              <p className={`text-xs mb-3 ${canDownload ? "text-emerald-800/80" : "text-neutral-500"}`}>
                {typeof remaining === "number" && (
                  <>
                    {remaining} of {o.downloadLimit} download{o.downloadLimit === 1 ? "" : "s"} remaining
                    {o.tokenExpiresAt && <> · expires {formatDate(o.tokenExpiresAt)}</>}
                  </>
                )}
                {limitReached && !tokenExpired && <> · contact support if you need more</>}
              </p>
              {canDownload ? (
                <Link
                  href={`/account/downloads?token=${encodeURIComponent(o.downloadToken || "")}`}
                  className="inline-flex items-center gap-2 bg-emerald-700 text-white px-5 py-2 text-xs tracking-widest uppercase hover:bg-emerald-800"
                >
                  <Download className="w-3.5 h-3.5" /> Download files
                </Link>
              ) : (
                <span className="inline-flex items-center gap-2 bg-neutral-300 text-neutral-600 px-5 py-2 text-xs tracking-widest uppercase cursor-not-allowed">
                  <Download className="w-3.5 h-3.5" /> Download files
                </span>
              )}
            </section>
          ) : o.status === "pending" ? (
            <section className="border border-amber-200 bg-amber-50 p-5">
              <h3 className="font-semibold text-sm mb-1 text-amber-900">Payment pending</h3>
              <p className="text-xs text-amber-800/80">
                Complete your payment to unlock downloads. If you left the payment page by accident, try checking out again.
              </p>
            </section>
          ) : null}
        </aside>
      </div>
    </AccountShell>
  );
}
