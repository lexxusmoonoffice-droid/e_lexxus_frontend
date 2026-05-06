import Link from "next/link";
import { Package, ArrowRight, Check } from "lucide-react";
import { serverGet } from "@/lib/fetcher";
import { toLegacyBundle } from "@/lib/adapters";
import type { ApiBundle, Paginated } from "@/lib/types";

export const revalidate = 300;

export const metadata = {
  title: "Model Bundles — Lexxus",
  description: "Curated collections of premium 3D assets at a significant discount.",
};

const perks = [
  "All models in one ZIP download",
  "Save up to 40% vs buying individually",
  "Same formats as individual products",
  "Perpetual license included",
  "Re-download any time from your account",
];

export default async function BundlesPage() {
  const raw = await serverGet<Paginated<ApiBundle>>("/bundles?limit=48", { tag: "bundles" }).catch(
    () => ({ data: [], page: 1, limit: 48, total: 0, pages: 0 }) as Paginated<ApiBundle>,
  );
  const bundles = raw.data.map(toLegacyBundle);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative h-[65vh] min-h-[480px] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1800&q=90"
          alt="Model Bundles"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8 pb-16 w-full">
          <span className="text-xs tracking-[0.4em] uppercase text-neutral-300">Exclusive Offer</span>
          <h1 className="text-6xl md:text-7xl font-bold text-white mt-4 leading-none tracking-tight max-w-3xl">
            Model Bundles.<br />More for Less.
          </h1>
          <p className="text-neutral-300 mt-5 max-w-xl leading-relaxed text-lg">
            Curated collections of premium 3D assets sold together at a significant discount. One purchase, one download, everything you need.
          </p>
        </div>
      </section>

      <section className="bg-neutral-950 text-white border-b border-neutral-800">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-5 flex flex-wrap gap-x-10 gap-y-3 items-center justify-center md:justify-start">
          {perks.map((p) => (
            <div key={p} className="flex items-center gap-2 text-xs text-neutral-300">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              {p}
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">All Bundles</span>
            <h2 className="text-4xl font-bold mt-3">{bundles.length} Curated Collections</h2>
          </div>
        </div>

        {bundles.length === 0 ? (
          <div className="text-center py-24 text-neutral-400">
            <p className="text-lg font-medium">No bundles available yet</p>
            <p className="text-sm mt-2">Check back soon — new bundles are added regularly.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {bundles.map((b) => (
              <Link
                key={b.id}
                href={`/bundles/${b.slug}`}
                className="group border border-neutral-200 overflow-hidden hover:shadow-2xl transition duration-500 flex flex-col"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
                  <img src={b.image} alt={b.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-white text-black text-[10px] font-semibold tracking-widest uppercase px-3 py-1">{b.tag}</span>
                    {b.badge && (
                      <span className="bg-emerald-500 text-white text-[10px] font-semibold tracking-widest uppercase px-3 py-1">{b.badge}</span>
                    )}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/80 text-white text-xs font-bold tracking-wide px-3 py-1.5">
                    Save {b.savings}%
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold leading-tight">{b.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400">
                        <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5" />{b.modelCount} models</span>
                        <span>{(b.fileSizeMb || 0).toLocaleString()} Mb total</span>
                        <span>{(b.formats || []).join(", ")}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-neutral-400 line-through">$ {b.originalPrice.toLocaleString()}</div>
                      <div className="text-2xl font-bold text-emerald-600 mt-0.5">$ {b.bundlePrice.toLocaleString()}</div>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-500 mt-4 leading-relaxed line-clamp-2">{b.description}</p>

                  <div className="mt-6 pt-5 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">{b.modelCount} assets included</span>
                    <span className="flex items-center gap-2 text-xs tracking-widest uppercase font-semibold group-hover:gap-3 transition-all">
                      View Bundle <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {bundles.length > 0 && (
        <section className="bg-neutral-950 text-white py-20">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">Why Bundles?</span>
              <h2 className="text-4xl font-bold mt-4 leading-tight">The smartest way<br />to build your library.</h2>
              <p className="text-neutral-400 mt-5 leading-relaxed">
                Instead of purchasing assets one by one, bundles give you a complete, cohesive set of models curated by our editorial team — at a price that makes sense for serious studios.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  "Handpicked for visual and stylistic coherence",
                  "Instant single-ZIP delivery",
                  "Up to 40% off individual prices",
                  "Extended commercial license available",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-neutral-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {bundles.slice(0, 4).map((b) => (
                <div key={b.id} className="aspect-square overflow-hidden">
                  <img src={b.image} alt={b.name} className="w-full h-full object-cover opacity-70 hover:opacity-100 transition" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
