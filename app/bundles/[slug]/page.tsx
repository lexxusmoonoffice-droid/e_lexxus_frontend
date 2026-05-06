import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Package, Download, Check, Shield, Zap } from "lucide-react";
import BundleBuyBox from "./BundleBuyBox";
import { serverGetOrNull, serverGet } from "@/lib/fetcher";
import { toLegacyBundle, toLegacyProduct } from "@/lib/adapters";
import Price from "@/components/Price";
import type { ApiBundle, ApiProduct, Paginated } from "@/lib/types";

export const revalidate = 300;

async function fetchBundle(slug: string) {
  return serverGetOrNull<{ bundle: ApiBundle }>(
    `/bundles/${encodeURIComponent(slug)}`,
    { tag: "bundles" },
  );
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
): Promise<Metadata> {
  const res = await fetchBundle(params.slug);
  if (!res) return { title: "Bundle not found — Lexxus" };
  return {
    title: `${res.bundle.name} — Bundle | Lexxus`,
    description: res.bundle.description?.slice(0, 160),
    openGraph: {
      title: res.bundle.name,
      description: res.bundle.description?.slice(0, 160),
      images: res.bundle.image ? [{ url: res.bundle.image }] : undefined,
    },
  };
}

export default async function BundleDetailPage({ params }: { params: { slug: string } }) {
  const res = await fetchBundle(params.slug);
  if (!res) return notFound();
  const bundle = toLegacyBundle(res.bundle);
  const includedProducts = ((res.bundle.productIds || []) as ApiProduct[])
    .filter((p): p is ApiProduct => typeof p !== "string")
    .map(toLegacyProduct);

  const othersRaw = await serverGet<Paginated<ApiBundle>>("/bundles?limit=4", { tag: "bundles" })
    .catch(() => ({ data: [], page: 1, limit: 4, total: 0, pages: 0 }) as Paginated<ApiBundle>);
  const otherBundles = othersRaw.data
    .map(toLegacyBundle)
    .filter((b) => b.id !== bundle.id)
    .slice(0, 3);

  const bundleImages = bundle.images.length > 0 ? bundle.images : [bundle.image];

  return (
    <div className="bg-white">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 pt-6 pb-2">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Link href="/" className="hover:text-black transition">Home</Link>
          <span>/</span>
          <Link href="/bundles" className="hover:text-black transition">Bundles</Link>
          <span>/</span>
          <span className="text-black">{bundle.name}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_400px] gap-12">
          <div>
            <div className="aspect-[16/10] overflow-hidden bg-neutral-100 relative">
              <img src={bundleImages[0]} alt={bundle.name} className="w-full h-full object-cover" />
              {bundle.badge && (
                <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5">
                  {bundle.badge}
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-3 mt-3">
              {bundleImages.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className={`aspect-square overflow-hidden border-2 cursor-pointer transition ${
                    i === 0 ? "border-black" : "border-transparent hover:border-neutral-300"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {includedProducts.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-2">What&apos;s Included</h2>
                <div className="w-8 h-px bg-black mb-8" />
                <div className="grid sm:grid-cols-2 gap-4">
                  {includedProducts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/product/${p.slug}`}
                      className="group flex gap-4 border border-neutral-200 p-4 hover:border-black hover:shadow-md transition"
                    >
                      <div className="w-20 h-20 shrink-0 overflow-hidden bg-neutral-100">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] tracking-widest uppercase text-neutral-400">{p.brand}</div>
                        <div className="font-semibold text-sm mt-1 truncate">{p.name}</div>
                        <div className="text-xs text-neutral-400 mt-1">{p.category} · {p.fileSizeMb} Mb</div>
                        <div className="text-xs text-neutral-400 mt-1 line-through"><Price inr={p.price} /></div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-2">About This Bundle</h2>
              <div className="w-8 h-px bg-black mb-6" />
              <p className="text-neutral-600 leading-relaxed">{bundle.description}</p>
            </div>

            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              {[
                { label: "Models Included", value: `${bundle.modelCount} assets` },
                { label: "Total File Size", value: `${(bundle.fileSizeMb || 0).toLocaleString()} Mb` },
                { label: "File Formats", value: (bundle.formats || []).join(", ") },
                { label: "License", value: "Standard Commercial" },
                { label: "Delivery", value: "Instant ZIP download" },
                { label: "Re-downloads", value: "Unlimited" },
              ].map((s) => (
                <div key={s.label} className="flex justify-between border-b border-neutral-100 py-3 text-sm">
                  <span className="text-neutral-500">{s.label}</span>
                  <span className="font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          <aside>
            <div className="sticky top-28">
              <div className="border border-neutral-200 p-6">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h1 className="text-xl font-bold leading-tight">{bundle.name}</h1>
                  {bundle.tag && (
                    <span className="text-[10px] bg-black text-white px-2 py-1 tracking-widest uppercase shrink-0">
                      {bundle.tag}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-3 text-xs text-neutral-400">
                  <Package className="w-3.5 h-3.5" />
                  <span>{bundle.modelCount} models · {(bundle.fileSizeMb || 0).toLocaleString()} Mb</span>
                </div>

                <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200">
                  <div className="text-xs text-emerald-700 font-semibold tracking-wide">Bundle Savings</div>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-3xl font-bold text-emerald-600"><Price inr={bundle.bundlePrice} /></span>
                    <span className="text-sm text-neutral-400 line-through"><Price inr={bundle.originalPrice} /></span>
                  </div>
                  <div className="text-xs text-emerald-600 mt-1">
                    You save <Price inr={bundle.originalPrice - bundle.bundlePrice} /> ({bundle.savings}%)
                  </div>
                </div>

                <BundleBuyBox bundle={bundle} />

                <div className="mt-5 space-y-2.5">
                  {[
                    { icon: Shield, text: "Secure checkout via Zoho Payments" },
                    { icon: Download, text: "Instant ZIP download" },
                    { icon: Zap, text: "Production-ready files" },
                    { icon: Check, text: "Commercial license included" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 text-xs text-neutral-500">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-5 border-t border-neutral-100 text-xs text-neutral-400 text-center">
                  <Link href="/license" className="underline hover:text-black transition">License Terms</Link>
                  {" · "}
                  <Link href="/faq" className="underline hover:text-black transition">FAQ</Link>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {otherBundles.length > 0 && (
          <section className="mt-24">
            <h2 className="text-2xl font-bold mb-2">More Bundles</h2>
            <div className="w-8 h-px bg-black mb-8" />
            <div className="grid md:grid-cols-3 gap-6">
              {otherBundles.map((b) => (
                <Link key={b.id} href={`/bundles/${b.slug}`} className="group border border-neutral-200 overflow-hidden hover:shadow-xl transition duration-500">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={b.image} alt={b.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                  </div>
                  <div className="p-6">
                    <div className="text-[10px] tracking-widest uppercase text-neutral-400">{b.tag}</div>
                    <h3 className="font-bold text-lg mt-1">{b.name}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-emerald-600 font-bold"><Price inr={b.bundlePrice} /></span>
                      <span className="text-xs text-neutral-400 line-through"><Price inr={b.originalPrice} /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
