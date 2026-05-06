import Link from "next/link";
import { serverGet } from "@/lib/fetcher";
import type { ApiBrand, Paginated } from "@/lib/types";

export const revalidate = 3600;
export const metadata = {
  title: "Brands — Lexxus",
  description: "Explore every partner brand selling on Lexxus.",
};

export default async function BrandsPage() {
  const res = await serverGet<Paginated<ApiBrand>>("/brands?limit=100", { tag: "brands" }).catch(
    () => ({ data: [], page: 1, limit: 100, total: 0, pages: 0 }) as Paginated<ApiBrand>,
  );
  const brands = res.data;

  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-12">
      <h1 className="text-3xl font-semibold mb-8">Brands</h1>
      {brands.length === 0 ? (
        <div className="text-center py-24 text-neutral-400 text-sm">
          No brands available yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {brands.map((b) => (
            <Link
              key={b.id}
              href={`/brands/${b.slug}`}
              className="border border-neutral-200 p-8 text-center hover:border-black transition"
            >
              <div className="text-xl font-bold tracking-wider">{b.name.toUpperCase()}</div>
              <div className="text-xs text-neutral-500 mt-2">Premium 3D Brand</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
