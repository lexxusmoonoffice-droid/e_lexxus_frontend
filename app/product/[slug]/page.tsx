import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import BuyBox from "./BuyBox";
import Reviews from "./Reviews";
import Gallery from "./Gallery";
import { serverGetOrNull } from "@/lib/fetcher";
import { toLegacyProduct } from "@/lib/adapters";
import Price from "@/components/Price";
import BackButton from "@/components/BackButton";
import ShareButton from "./ShareButton";
import type { ApiProduct } from "@/lib/types";

export const revalidate = 300; // 5 min

type Detail = { product: ApiProduct; related: ApiProduct[] };

async function fetchDetail(slug: string): Promise<Detail | null> {
  return serverGetOrNull<Detail>(`/products/${encodeURIComponent(slug)}`, { tag: "products" });
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
): Promise<Metadata> {
  const d = await fetchDetail(params.slug);
  if (!d) return { title: "Not found — Lexxus" };
  const p = toLegacyProduct(d.product);
  return {
    title: `${p.name} — ${p.brand} | Lexxus`,
    description: p.description?.slice(0, 160),
    openGraph: {
      title: `${p.name} — ${p.brand}`,
      description: p.description?.slice(0, 160),
      images: p.image ? [{ url: p.image }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const d = await fetchDetail(params.slug);
  if (!d) return notFound();
  const p = toLegacyProduct(d.product);
  const images = [...p.images.filter(Boolean), ...(p.image ? [p.image] : [])].filter(
    (v, i, a) => a.indexOf(v) === i
  );

  // Load all products in the same subcategory or category
  const categoryObj = d.product.category;
  const categorySlug = typeof categoryObj === "object" && categoryObj ? categoryObj.slug : "";
  const subCategoryObj = d.product.subCategory;
  const subCategorySlug = typeof subCategoryObj === "object" && subCategoryObj ? subCategoryObj.slug : "";

  let relatedProductsRaw: { data: ApiProduct[] } = { data: [] };
  try {
    const queryParams = new URLSearchParams();
    if (subCategorySlug) {
      queryParams.set("subCategory", subCategorySlug);
    } else if (categorySlug) {
      queryParams.set("category", categorySlug);
    }
    queryParams.set("limit", "100");
    relatedProductsRaw = await serverGetOrNull<{ data: ApiProduct[] }>(`/products?${queryParams.toString()}`, { tag: "products" }) || { data: [] };
  } catch (err) {
    console.error("Failed to load subcategory products:", err);
  }

  const related = relatedProductsRaw.data
    .filter((rp) => rp.id !== d.product.id)
    .map(toLegacyProduct);

  return (
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8">
      <BackButton />
      <div className="text-xs text-neutral-500 mb-6">
        lexxus.com / {p.category} / {p.name}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
        <div>
          <Gallery images={images} alt={p.name} />

          <div className="mt-10">
                        <h1 className="text-2xl font-semibold break-all">3D Model — {p.name}</h1>
            <table className="mt-6 text-sm">
              <tbody>
                                <Row k="Category" v={p.category} />
                {p.material && <Row k="Material" v={p.material} />}
                {p.style && <Row k="Style" v={p.style} />}
                {p.color && <Row k="Color" v={p.color} />}
                <Row k="File size" v={`${p.fileSizeMb} Mb`} />
              </tbody>
            </table>
            <div
              className="text-sm text-neutral-700 leading-relaxed mt-6 max-w-2xl prose prose-sm"
              dangerouslySetInnerHTML={{ __html: p.description || "" }}
            />
            {p.dimensions && (
              <div className="text-sm text-neutral-700 mt-4">
                Width — {p.dimensions.w} cm
                <br />
                Length — {p.dimensions.l} cm
                <br />
                Height — {p.dimensions.h} cm
              </div>
            )}
          </div>
        </div>

        <aside>
          <div className="sticky top-28">
            <div className="border border-neutral-200 p-5">
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold tracking-widest">{p.brand.toUpperCase()}</div>
                <div className="flex items-center text-neutral-500">
                  <ShareButton productName={p.name} />
                </div>
              </div>
                            <h1 className="mt-4 text-lg font-bold text-neutral-800 break-all">{p.name}</h1>

              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                {p.price === 0
                  ? "Free download: this 3D Model is provided by a Premium Brand."
                  : "Premium digital product. Instant download after purchase."}
              </div>

              <div className="mt-5 flex items-end justify-between">
                <div>
                  <div className="text-xs text-neutral-500">Price</div>
                  <div className="text-3xl font-bold text-emerald-600">
                    <Price inr={p.price} freeLabel="Free" />
                  </div>
                </div>
                <div className="text-right text-xs text-neutral-500">
                  <div>File size</div>
                  <div className="font-semibold text-neutral-800">{p.fileSizeMb} Mb</div>
                </div>
              </div>

              <BuyBox product={p} />

              <div className="mt-4 text-xs text-neutral-500">
                Secure checkout · Instant download ·{" "}
                <Link href="/license" className="underline">
                  License info
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <Reviews
        productId={d.product.id}
        slug={d.product.slug}
        initialAvg={d.product.rating?.avg}
        initialCount={d.product.rating?.count}
      />

      {related.length > 0 && (
        <section className="mt-20 border-t border-neutral-100 pt-12">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Related Assets</span>
            <h2 className="text-2xl font-bold text-neutral-800 mt-1">You may also like</h2>
          </div>
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-5 space-y-5">
            {related.map((r) => (
              <ProductCard key={r.id} p={r} variant="gallery" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <tr>
      <td className="font-semibold py-1 pr-8">{k}</td>
      <td className="text-neutral-700 underline decoration-dotted">{v}</td>
    </tr>
  );
}
