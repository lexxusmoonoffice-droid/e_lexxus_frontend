import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryCarousel from "@/components/CategoryCarousel";
import { serverGet } from "@/lib/fetcher";
import { toLegacyBundle, toLegacyProduct } from "@/lib/adapters";
import type { ApiBundle, ApiCategory, ApiProduct, Paginated } from "@/lib/types";
import { ArrowRight, Shield, Download, Star, Zap, Package } from "lucide-react";
import Price from "@/components/Price";

// Revalidate the homepage every minute so newly-published products surface.
export const revalidate = 60;

const trustBadges = [
  { icon: Shield, label: "Secure Checkout", sub: "256-bit SSL encryption" },
  { icon: Download, label: "Instant Download", sub: "Delivered in seconds" },
  { icon: Star, label: "Curated Quality", sub: "Editorial review on every asset" },
  { icon: Zap, label: "Production Ready", sub: "Tested in 3ds Max, Blender & more" },
];

// Fallback image per top-level category slug (only kicks in when the
// category doesn't define its own image yet).
const COLLECTION_IMAGE_FALLBACK: Record<string, string> = {
  models: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85",
  scenes: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=85",
  sets: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=85",
  textures: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=85",
};
const DEFAULT_COLLECTION_IMAGE =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=85";

const FALLBACK_COLLECTIONS = [
  { name: "3D Models", count: "Collection", img: COLLECTION_IMAGE_FALLBACK.models, href: "/c/models" },
  { name: "Scenes", count: "Collection", img: COLLECTION_IMAGE_FALLBACK.scenes, href: "/c/scenes" },
  { name: "Sets", count: "Collection", img: COLLECTION_IMAGE_FALLBACK.sets, href: "/c/sets" },
  { name: "Textures", count: "Collection", img: COLLECTION_IMAGE_FALLBACK.textures, href: "/c/textures" },
];

async function safe<T>(p: Promise<T>, fallback: T): Promise<T> {
  try {
    return await p;
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  const [featuredRaw, trendingRaw, newRaw, bundlesRaw, categoriesRaw] = await Promise.all([
    safe(serverGet<{ data: ApiProduct[] }>("/products/featured?limit=4", { tag: "products" }), { data: [] }),
    safe(serverGet<{ data: ApiProduct[] }>("/products/trending?limit=4", { tag: "products" }), { data: [] }),
    safe(serverGet<{ data: ApiProduct[] }>("/products/new-arrivals?limit=4", { tag: "products" }), { data: [] }),
    safe(
      serverGet<Paginated<ApiBundle>>("/bundles?limit=2", { tag: "bundles" }),
      { data: [], page: 1, limit: 2, total: 0, pages: 0 } as Paginated<ApiBundle>,
    ),
    safe(
      serverGet<{ data: (ApiCategory & { image?: string; productCount?: number; children?: (ApiCategory & { productCount?: number })[] })[] }>("/categories", { tag: "categories" }),
      { data: [] },
    ),
  ]);

  const featured = featuredRaw.data.map(toLegacyProduct);
  const trending = trendingRaw.data.map(toLegacyProduct);
  const newArrivals = newRaw.data.map(toLegacyProduct);
  const bundles = bundlesRaw.data.map(toLegacyBundle);

  // Top-level categories become the "Browse by Type" cards. Each card
  // links to the dynamic /c/:slug page. Count includes all subcategories.
  const collectionCards = categoriesRaw.data
    .filter((c) => !c.parent)
    .map((c) => {
      const childTotal = (c.children || []).reduce((s, ch) => s + (ch.productCount ?? 0), 0);
      const total = (c.productCount ?? 0) + childTotal;
      return {
        name: c.name,
        count: total > 0 ? `${total} assets` : "Collection",
        img: c.image || COLLECTION_IMAGE_FALLBACK[c.slug] || DEFAULT_COLLECTION_IMAGE,
        href: `/c/${c.slug}`,
      };
    });

  return (
    <div className="bg-white">
      <HeroCarousel />

      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-neutral-200">
          {trustBadges.map((b) => (
            <div key={b.label} className="flex items-center gap-4 px-6 first:pl-0 last:pr-0">
              <b.icon className="w-5 h-5 shrink-0 text-neutral-600" />
              <div>
                <div className="text-xs font-semibold tracking-wide">{b.label}</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 border-b border-neutral-100 overflow-hidden bg-neutral-50/50">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 mb-8">
          <span className="text-xs tracking-[0.3em] uppercase text-neutral-400 font-semibold">Browse by Type</span>
          <h2 className="text-4xl font-bold mt-3">Explore the Collection</h2>
        </div>
        
        {/* Collection Marquee (Slow LTR) */}
        <div className="marquee-container relative w-full overflow-x-hidden flex py-2">
          <div className="animate-marquee-slow-ltr flex">
            {[...(collectionCards.length > 0 ? collectionCards : FALLBACK_COLLECTIONS), ...(collectionCards.length > 0 ? collectionCards : FALLBACK_COLLECTIONS), ...(collectionCards.length > 0 ? collectionCards : FALLBACK_COLLECTIONS), ...(collectionCards.length > 0 ? collectionCards : FALLBACK_COLLECTIONS)].map((c, i) => (
              <Link key={i} href={c.href} className="group flex-shrink-0 flex items-center gap-4 bg-white border border-neutral-200/80 pl-4 pr-8 py-3 rounded-full hover:border-black hover:shadow-sm transition select-none mx-3 min-w-[220px]">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-neutral-100">
                  <img src={c.img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                </div>
                <div>
                  <div className="font-bold text-neutral-800 text-xs truncate max-w-[120px]">{c.name}</div>
                  <div className="text-[9px] text-neutral-400 font-bold tracking-wider uppercase mt-0.5">{c.count}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="py-20 border-b border-neutral-100 overflow-hidden bg-white">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8 mb-8 flex justify-between items-end">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-neutral-400 font-semibold">Hand-Picked</span>
              <h2 className="text-4xl font-bold mt-3">Featured Assets</h2>
            </div>
            <Link href="/c/models" className="text-xs tracking-widest uppercase border-b border-black pb-0.5 hover:opacity-60 transition">
              View All →
            </Link>
          </div>

          {/* Featured Marquee (Standard RTL) */}
          <div className="marquee-container relative w-full overflow-x-hidden flex py-4">
            <div className="animate-marquee-rtl flex">
              {[...featured, ...featured, ...featured, ...featured].map((p, i) => (
                <div key={i} className="flex-shrink-0 w-64 mx-4 hover:-translate-y-1 transition duration-300">
                  <ProductCard p={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {trending.length > 0 && (
        <section className="bg-neutral-950 text-white py-20 overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8 mb-8 flex justify-between items-end">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-neutral-400 font-semibold">Most Downloaded</span>
              <h2 className="text-4xl font-bold mt-3">Trending Now</h2>
            </div>
            <Link href="/c/models" className="text-xs tracking-widest uppercase border-b border-white pb-0.5 hover:opacity-60 transition">
              View All →
            </Link>
          </div>

          {/* Trending Marquee (Fast RTL with Premium Dark Glass Cards) */}
          <div className="marquee-container relative w-full overflow-x-hidden flex py-4">
            <div className="animate-marquee-fast-rtl flex">
              {[...trending, ...trending, ...trending, ...trending].map((p, i) => (
                <Link key={i} href={`/product/${p.slug}`} className="group flex-shrink-0 w-64 mx-4 bg-neutral-900/40 border border-neutral-850 hover:border-neutral-700 rounded-xl overflow-hidden hover:shadow-lg transition duration-300">
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
                    <img src={p.image} className="w-full h-full object-cover transition duration-500 opacity-80 group-hover:opacity-100 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <div className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold">{p.brand}</div>
                    <h3 className="font-bold text-white text-xs mt-1 truncate">{p.name}</h3>
                    <div className="text-emerald-400 text-xs font-bold mt-2">
                      <Price inr={p.price} freeLabel="Free" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="py-20 border-b border-neutral-100 overflow-hidden bg-white">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8 mb-8 flex justify-between items-end">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-neutral-400 font-semibold">Just Added</span>
              <h2 className="text-4xl font-bold mt-3">New Arrivals</h2>
            </div>
            <Link href="/c/models" className="text-xs tracking-widest uppercase border-b border-black pb-0.5 hover:opacity-60 transition">
              View All →
            </Link>
          </div>

          {/* New Arrivals Marquee (Slow LTR) */}
          <div className="marquee-container relative w-full overflow-x-hidden flex py-4">
            <div className="animate-marquee-slow-ltr flex">
              {[...newArrivals, ...newArrivals, ...newArrivals, ...newArrivals].map((p, i) => (
                <div key={i} className="flex-shrink-0 w-64 mx-4 hover:-translate-y-1 transition duration-300">
                  <ProductCard p={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {bundles.length > 0 && (
        <section className="bg-neutral-950 text-white py-20">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">Save up to 40%</span>
                <h2 className="text-4xl font-bold mt-3">Model Bundles</h2>
                <p className="text-neutral-400 mt-3 max-w-lg leading-relaxed text-sm">
                  Curated collections of premium 3D assets sold together at a significant discount. One purchase, one download.
                </p>
              </div>
              <Link href="/bundles" className="text-xs tracking-widest uppercase border-b border-white pb-0.5 hover:opacity-60 transition whitespace-nowrap">
                All Bundles →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {bundles.map((b) => (
                <Link key={b.id} href={`/bundles/${b.slug}`} className="group border border-neutral-800 overflow-hidden hover:border-neutral-500 transition duration-300">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img src={b.image} alt={b.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-white text-black text-[10px] font-bold tracking-widest uppercase px-3 py-1">{b.tag}</span>
                      {b.badge && <span className="bg-emerald-500 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1">{b.badge}</span>}
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/80 text-white text-xs font-bold px-3 py-1.5">Save {b.savings}%</div>
                  </div>
                  <div className="p-6 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg">{b.name}</h3>
                      <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
                        <span className="flex items-center gap-1"><Package className="w-3 h-3" />{b.modelCount} models</span>
                        <span>{(b.formats || []).join(", ")}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-neutral-500 line-through"><Price inr={b.originalPrice} /></div>
                      <div className="text-xl font-bold text-emerald-400"><Price inr={b.bundlePrice} /></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/bundles" className="inline-flex items-center gap-3 border border-neutral-700 px-10 py-4 text-sm tracking-widest uppercase hover:border-white hover:text-white transition">
                View All Bundles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
