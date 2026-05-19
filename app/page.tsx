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

      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">Browse by Type</span>
            <h2 className="text-4xl font-bold mt-3">Explore the Collection</h2>
          </div>
        </div>
        <CategoryCarousel cards={collectionCards.length > 0 ? collectionCards : FALLBACK_COLLECTIONS} />
      </section>

      {featured.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">Hand-Picked</span>
              <h2 className="text-4xl font-bold mt-3">Featured Assets</h2>
            </div>
            <Link href="/c/models" className="text-xs tracking-widest uppercase border-b border-black pb-0.5 hover:opacity-60 transition">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featured.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>
      )}

      {trending.length > 0 && (
        <section className="bg-neutral-950 text-white py-20">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">Most Downloaded</span>
                <h2 className="text-4xl font-bold mt-3">Trending Now</h2>
              </div>
              <Link href="/c/models" className="text-xs tracking-widest uppercase border-b border-white pb-0.5 hover:opacity-60 transition">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {trending.map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`} className="group">
                  <div className="relative aspect-square overflow-hidden bg-neutral-800">
                    <img
                      src={p.image}
                      alt={p.name}
                      className={`w-full h-full object-cover transition duration-500 opacity-80 ${p.hoverImage ? "group-hover:opacity-0" : "group-hover:scale-105 group-hover:opacity-100"}`}
                    />
                    {p.hoverImage && (
                      <img
                        src={p.hoverImage}
                        alt={p.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-500"
                      />
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="text-xs text-neutral-500 tracking-wide">{p.brand}</div>
                    <div className="font-semibold mt-1 group-hover:opacity-70 transition">{p.name}</div>
                    <div className="text-emerald-400 text-sm font-semibold mt-1">
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
        <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">Just Added</span>
              <h2 className="text-4xl font-bold mt-3">New Arrivals</h2>
            </div>
            <Link href="/c/models" className="text-xs tracking-widest uppercase border-b border-black pb-0.5 hover:opacity-60 transition">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {newArrivals.map((p) => <ProductCard key={p.id} p={p} />)}
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
