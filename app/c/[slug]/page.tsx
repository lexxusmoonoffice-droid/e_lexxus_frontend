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
import CategoryBannerSlider from "@/components/CategoryBannerSlider";
import { serverGet, serverGetOrNull } from "@/lib/fetcher";
import { toLegacyProduct } from "@/lib/adapters";
import CategorySearch from "./CategorySearch";
import Pagination from "@/components/Pagination";
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
  const currentPage = parseInt(searchParams?.page || "1", 10) || 1;
  const limit = 48;

  let productsRes: Paginated<ApiProduct>;
  if (selectedSub) {
    // Use subCategory param so the backend can match both:
    //   - old products: category = subcatId (direct)
    //   - new products: subCategory = subcatId, category = parentId
    productsRes = await fetchProducts({ subCategory: selectedSub, q: query, page: currentPage, limit });
  } else {
    productsRes = await fetchProducts({ category: category.slug, q: query, page: currentPage, limit });
  }

  const products = productsRes.data.map(toLegacyProduct);
  const baseHref = `/c/${category.slug}`;
  const hasChildren = (children?.length || 0) > 0;
  const activeSub = children?.find((c) => c.slug === selectedSub);

    return (
    <div>
            <CategoryBannerSlider
        slug={category.slug}
        categoryName={category.name}
        initialBanners={category.banners}
      />

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
              Lexxus / {category.name}
              {activeSub && (
                <>
                  {" / "}
                  {activeSub.name}
                </>
              )}
            </div>
            <h1 className="text-2xl font-bold mt-1 text-neutral-800">
              {query ? `Results for "${query}"` : category.name}
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              {productsRes.total} product{productsRes.total !== 1 ? "s" : ""} available
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

        {/* Product masonry gallery grid */}
        {products.length === 0 ? (
          <div className="text-center py-24 text-neutral-400 bg-white border border-neutral-100 rounded-xl p-8 shadow-sm">
            <p className="text-sm font-semibold">No products found</p>
            <p className="text-xs mt-1">
              {query
                ? "Try a different search term."
                : selectedSub
                  ? "Try clearing this filter or pick a different category."
                  : "Check back soon — new drops arrive weekly."}
            </p>
            <Link
              href={baseHref}
              className="mt-6 inline-block bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-6 py-2 text-xs font-semibold rounded-lg transition"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <>
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-5 space-y-5">
              {products.map((p) => (
                <ProductCard key={p.id} p={p} variant="gallery" />
              ))}
            </div>
            <Pagination
              currentPage={productsRes.page}
              totalPages={productsRes.pages}
              baseHref={baseHref}
              currentParams={{ q: query, sub: selectedSub }}
            />
          </>
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
