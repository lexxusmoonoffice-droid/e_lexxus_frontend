import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";
import { serverGetOrNull } from "@/lib/fetcher";
import { toLegacyProduct } from "@/lib/adapters";
import type { ApiBrand, ApiProduct, Paginated } from "@/lib/types";

export const revalidate = 300;

type Resp = { brand: ApiBrand; products: Paginated<ApiProduct> };

async function fetchBrand(slug: string) {
  return serverGetOrNull<Resp>(`/brands/${encodeURIComponent(slug)}`, { tag: "brands" });
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
): Promise<Metadata> {
  const res = await fetchBrand(params.slug);
  if (!res) return { title: "Brand not found — Lexxus" };
  return {
    title: `${res.brand.name} — Brand | Lexxus`,
    description: res.brand.description?.slice(0, 160) || `Products by ${res.brand.name}`,
  };
}

export default async function BrandDetailPage({ params }: { params: { slug: string } }) {
  const res = await fetchBrand(params.slug);
  if (!res) return notFound();
  const items = res.products.data.map(toLegacyProduct);

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">
      <div className="mb-10 p-10 bg-gradient-to-br from-neutral-900 to-neutral-700 text-white">
        <div className="text-xs tracking-widest opacity-70">LEXXUS BRAND</div>
        <h1 className="text-4xl font-bold tracking-wider mt-2">{res.brand.name.toUpperCase()}</h1>
        <p className="mt-4 max-w-xl text-sm opacity-80">
          Premium digital products crafted by {res.brand.name}.
        </p>
      </div>
      <PageHeader title={`Products by ${res.brand.name}`} />
      {items.length === 0 ? (
        <p className="text-neutral-500">No products yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
