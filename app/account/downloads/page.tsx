"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";
import { Download, ExternalLink, Loader2 } from "lucide-react";
import AccountShell from "@/components/AccountShell";
import { useMyDownloads, useDownloadInfo, useDownloadSlot, type DownloadItem } from "@/lib/hooks";
import { apiPost, apiError } from "@/lib/api";

type ItemRow = {
  orderId: string;
  type: string;
  product?: { title?: string; thumbnail?: string; fileSizeMb?: number } | null;
  bundle?: { name?: string; image?: string; fileSizeMb?: number } | null;
  qty: number;
  downloadToken: string;
  tokenExpiresAt?: string;
  downloadCount: number;
  downloadLimit: number;
  purchasedAt?: string;
};

export default function DownloadsPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sm text-neutral-400">Loading…</div>}>
      <DownloadsInner />
    </Suspense>
  );
}

function DownloadsInner() {
  const { data, isLoading, isError, refetch } = useMyDownloads();
  const searchParams = useSearchParams();
  const activeToken = searchParams.get("token") || undefined;

  // View-only: does NOT consume a download slot
  const { data: info, isLoading: infoLoading } = useDownloadInfo(activeToken);

  // Actual download: consumes one slot, returns signed URLs
  const downloadSlot = useDownloadSlot(activeToken);
  const [signedItems, setSignedItems] = useState<Array<Record<string, unknown>> | null>(null);

  async function handleDownload() {
    try {
      const res = await downloadSlot.mutateAsync();
      setSignedItems(res.items as Array<Record<string, unknown>>);
      await refetch();
    } catch (err) {
      toast.error(apiError(err, "Download failed"));
    }
  }

  async function resend(token: string) {
    try {
      await apiPost(`/downloads/${token}/resend`, {});
      toast.success("Download email sent");
    } catch (err) {
      toast.error(apiError(err, "Could not resend"));
    }
  }

  const rows = (data?.data || []) as unknown as ItemRow[];

  return (
    <AccountShell title="My Account">
      <h2 className="font-semibold mb-4">Your Downloads</h2>

      {/* ── Active token section ── */}
      {activeToken && (
        <section className="mb-8 border border-emerald-200 bg-emerald-50 p-6 rounded-lg">
          {infoLoading ? (
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Loader2 className="w-4 h-4 animate-spin" /> Verifying token…
            </div>
          ) : info ? (
            <>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">Ready to download</h3>
                  <p className="text-xs text-neutral-600 mt-1">
                    <span className="font-medium text-emerald-700">{info.order.remaining}</span> of{" "}
                    {info.order.downloadLimit} downloads remaining.
                    {" "}Each download link is valid for ~5 minutes.
                  </p>
                </div>
                {info.order.remaining > 0 && (
                  <button
                    onClick={handleDownload}
                    disabled={downloadSlot.isPending}
                    className="inline-flex items-center gap-2 bg-black text-white text-sm px-5 py-2.5 rounded disabled:opacity-50"
                  >
                    {downloadSlot.isPending ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
                    ) : (
                      <><Download className="w-4 h-4" /> Download files</>
                    )}
                  </button>
                )}
                {info.order.remaining === 0 && (
                  <span className="text-xs text-rose-600 font-medium">Download limit reached</span>
                )}
              </div>

              {/* Products in this order */}
              <div className="space-y-2 mb-4">
                {info.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.thumbnail && (
                      <img src={item.thumbnail} alt={item.title || item.name} className="w-10 h-10 rounded object-cover" />
                    )}
                    <div className="text-sm">
                      <span className="font-medium">{item.title || item.name}</span>
                      {item.hasFile === false && (
                        <span className="ml-2 text-xs text-amber-600">(file not yet attached)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Signed URLs after clicking Download */}
              {signedItems && signedItems.length > 0 && (
                <div className="border-t border-emerald-300 pt-4 mt-2 space-y-2">
                  <p className="text-xs text-neutral-500 mb-2">Links are valid for ~5 minutes:</p>
                  {signedItems.map((it, i) => (
                    <SignedRow key={i} item={it} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-rose-600">Invalid or expired download token.</p>
          )}
        </section>
      )}

      {/* ── All purchases list ── */}
      {isLoading ? (
        <div className="text-sm text-neutral-500">Loading downloads…</div>
      ) : isError ? (
        <div className="text-sm text-rose-600">Could not load downloads.</div>
      ) : rows.length === 0 ? (
        <div className="border border-neutral-200 p-10 text-center text-sm text-neutral-500 rounded-lg">
          Nothing to download yet.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r, i) => {
            const title = r.product?.title || r.bundle?.name || "Purchase";
            const img = r.product?.thumbnail || r.bundle?.image || "";
            const size = r.product?.fileSizeMb || r.bundle?.fileSizeMb || 0;
            const remaining = Math.max(0, (r.downloadLimit || 5) - (r.downloadCount || 0));
            const isActive = r.downloadToken === activeToken;
            return (
              <div
                key={`${r.orderId}-${i}`}
                className={`flex items-center gap-4 border p-4 rounded-lg ${isActive ? "border-emerald-400 bg-emerald-50" : "border-neutral-200"}`}
              >
                {img && <img src={img} alt={title} className="w-16 h-16 rounded object-cover" />}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{title}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    {r.type} · {size} Mb
                  </div>
                  <div className={`text-xs mt-0.5 font-medium ${remaining === 0 ? "text-rose-500" : "text-emerald-600"}`}>
                    {remaining === 0 ? "No downloads left" : `${remaining} download${remaining !== 1 ? "s" : ""} left`}
                  </div>
                </div>
                <a
                  href={`/account/downloads?token=${encodeURIComponent(r.downloadToken)}`}
                  className="inline-flex items-center gap-1 bg-black text-white text-xs px-4 py-2 rounded"
                >
                  <Download className="w-3.5 h-3.5" /> Open
                </a>
                <button
                  onClick={() => resend(r.downloadToken)}
                  className="text-xs underline text-neutral-500 hover:text-black"
                >
                  Email me
                </button>
              </div>
            );
          })}
        </div>
      )}
    </AccountShell>
  );
}

function SignedRow({ item }: { item: Record<string, unknown> }) {
  if (item.type === "bundle") {
    const products = (item.products as Array<{ title: string; url: string | null }>) || [];
    return (
      <div className="space-y-1.5">
        <div className="text-xs font-semibold text-neutral-700">{String(item.name || "Bundle")}</div>
        {products.map((p, i) => (
          <DownloadLink key={i} title={p.title} url={p.url} />
        ))}
      </div>
    );
  }
  return <DownloadLink title={String(item.title || "Product")} url={item.url as string | null} />;
}

function DownloadLink({ title, url }: { title: string; url: string | null }) {
  if (!url) {
    return (
      <div className="text-xs text-amber-600">
        {title} — file not yet attached by the creator
      </div>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 text-sm text-emerald-700 font-medium underline hover:text-emerald-900"
    >
      <ExternalLink className="w-3.5 h-3.5" /> {title}
    </a>
  );
}
