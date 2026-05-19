/**
 * Dynamic collection/category page.
 *
 *   /c/:slug           top-level category — renders child pills + products
 *                      across the whole subtree (backend widens the filter
 *                      to include descendants).
 *   /c/:slug?sub=xxx   child-filter pill active — product grid narrows to
 *                      just that child (a direct /products?category=xxx).
 *   /c/<sub-slug>      deep-linkable sub category — also supported; shows
 *                      sibling pills when it has a parent.
 *
 * Server Component. Caches the tree for 5 min. 404s cleanly when the slug
 * doesn't resolve.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { serverGet, serverGetOrNull } from "@/lib/fetcher";
import { toLegacyProduct } from "@/lib/adapters";
import CategorySearch from "./CategorySearch";
import type { ApiCategory, ApiProduct, Paginated } from "@/lib/types";

export const revalidate = 300;

type Props = {
  params: { slug: string };
  searchParams: { q?: string; sub?: string; page?: string };
};

type CategoryDetail = {
  category: ApiCategory & { parent?: string | null };
  children: ApiCategory[];
  products: Paginated<ApiProduct>;
};

async function fetchCategory(slug: string) {
  return serverGetOrNull<CategoryDetail>(`/categories/${slug}`, { tag: `category:${slug}` });
}

async function fetchProducts(params: Record<string, unknown>) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") qs.set(k, String(v));
  });
  try {
    return await serverGet<Paginated<ApiProduct>>(`/products?${qs.toString()}`, { tag: "products" });
  } catch {
    return { data: [], page: 1, limit: 24, total: 0, pages: 0 } as Paginated<ApiProduct>;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const detail = await fetchCategory(params.slug);
  if (!detail) return { title: "Collection — Lexxus" };
  const name = detail.category.name;
  return {
    title: `${name} — Lexxus`,
    description: `Browse premium ${name.toLowerCase()} assets on Lexxus.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const detail = await fetchCategory(params.slug);
  if (!detail) notFound();

  const { category, children } = detail;
  const query = searchParams?.q || "";
  const selectedSub = searchParams?.sub || "";

  let productsRes: Paginated<ApiProduct>;
  if (selectedSub) {
    productsRes = await fetchProducts({ category: selectedSub, q: query, limit: 48 });
  } else if (query) {
    productsRes = await fetchProducts({ category: category.slug, q: query, limit: 48 });
  } else {
    productsRes = detail.products;
  }

  const products = productsRes.data.map(toLegacyProduct);
  const baseHref = `/c/${category.slug}`;
  const hasChildren = (children?.length || 0) > 0;
  const activeSub = children?.find((c) => c.slug === selectedSub);

  return (
    <div>
      {/* Category banner (shown only when there's a category image) */}
      {category.image && (
        <div className="relative h-48 md:h-64 overflow-hidden bg-neutral-100">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 px-4 lg:px-8 pb-6 max-w-[1400px] mx-auto w-full">
            <h1 className="text-3xl font-semibold text-white">{category.name}</h1>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <div className="text-xs text-neutral-500">
              Lexxus / {category.name}
              {activeSub && (
                <>
                  {" / "}
                  {activeSub.name}
                </>
              )}
            </div>
            {!category.image && (
              <h1 className="text-3xl font-semibold mt-1">
                {query ? `Results for "${query}"` : category.name}
              </h1>
            )}
            {query && category.image && (
              <p className="text-lg font-medium mt-1">Results for &ldquo;{query}&rdquo;</p>
            )}
            <p className="text-sm text-neutral-500 mt-1">
              {productsRes.total} product{productsRes.total !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Search box */}
          <CategorySearch
            baseHref={baseHref}
            selectedSub={selectedSub}
            initialQuery={query}
          />
        </div>

        {/* Subcategory filter pills */}
        {hasChildren && (
          <div className="flex flex-wrap gap-2 mb-8">
            <PillLink
              label="All"
              href={`${baseHref}${query ? `?q=${encodeURIComponent(query)}` : ""}`}
              active={!selectedSub}
            />
            {children!.map((ch) => (
              <PillLink
                key={ch.id}
                label={ch.name}
                href={`${baseHref}?${query ? `q=${encodeURIComponent(query)}&` : ""}sub=${encodeURIComponent(ch.slug)}`}
                active={selectedSub === ch.slug}
                image={ch.image}
              />
            ))}
          </div>
        )}

        {/* Product grid */}
        {products.length === 0 ? (
          <div className="text-center py-24 text-neutral-400">
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm mt-2">
              {query
                ? "Try a different search term."
                : selectedSub
                  ? "Try clearing this filter or pick a different category."
                  : "Check back soon — new drops arrive weekly."}
            </p>
            <Link
              href={baseHref}
              className="mt-6 inline-block border border-neutral-300 px-6 py-2 text-sm hover:border-black hover:text-black transition"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PillLink({
  label,
  href,
  active,
  image,
}: {
  label: string;
  href: string;
  active: boolean;
  image?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition ${
        active
          ? "bg-black text-white border-black"
          : "border-neutral-300 hover:bg-black hover:text-white"
      }`}
    >
      {image && (
        <img
          src={image}
          alt=""
          className={`w-4 h-4 rounded-full object-cover ${active ? "opacity-90" : "opacity-70"}`}
        />
      )}
      {label}
    </Link>
  );
}
