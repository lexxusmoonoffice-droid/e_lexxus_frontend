import type { MetadataRoute } from "next";
import { serverGet } from "@/lib/fetcher";
import type { ApiBlogPost, ApiBrand, ApiBundle, ApiCategory, ApiProduct, Paginated } from "@/lib/types";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function safeList<T>(path: string): Promise<T[]> {
  try {
    const res = await serverGet<Paginated<T>>(path);
    return res.data;
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, bundles, brands, blog, categories] = await Promise.all([
    safeList<ApiProduct>("/products?limit=500"),
    safeList<ApiBundle>("/bundles?limit=200"),
    safeList<ApiBrand>("/brands?limit=200"),
    safeList<ApiBlogPost>("/blog?limit=200"),
    safeList<ApiCategory & { children?: ApiCategory[] }>("/categories"),
  ]);

  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, priority: 1.0 },
    { url: `${SITE}/bundles`, lastModified: now, priority: 0.9 },
    { url: `${SITE}/brands`, lastModified: now, priority: 0.7 },
    { url: `${SITE}/blog`, lastModified: now, priority: 0.7 },
    { url: `${SITE}/about`, lastModified: now, priority: 0.3 },
    { url: `${SITE}/pricing`, lastModified: now, priority: 0.4 },
    { url: `${SITE}/faq`, lastModified: now, priority: 0.4 },
    { url: `${SITE}/license`, lastModified: now, priority: 0.3 },
    { url: `${SITE}/terms`, lastModified: now, priority: 0.3 },
    { url: `${SITE}/privacy`, lastModified: now, priority: 0.3 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.flatMap((c) => {
    const parent = { url: `${SITE}/c/${c.slug}`, lastModified: now, priority: c.parent ? 0.7 : 0.9 };
    const kids = (c.children || []).map((ch) => ({
      url: `${SITE}/c/${c.slug}?sub=${encodeURIComponent(ch.slug)}`,
      lastModified: now,
      priority: 0.6,
    }));
    return [parent, ...kids];
  });

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...products.map((p) => ({
      url: `${SITE}/product/${p.slug}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : now,
      priority: 0.8,
    })),
    ...bundles.map((b) => ({
      url: `${SITE}/bundles/${b.slug}`,
      lastModified: now,
      priority: 0.8,
    })),
    ...brands.map((b) => ({
      url: `${SITE}/brands/${b.slug}`,
      lastModified: now,
      priority: 0.6,
    })),
    ...blog.map((b) => ({
      url: `${SITE}/blog/${b.slug}`,
      lastModified: b.publishedAt ? new Date(b.publishedAt) : now,
      priority: 0.5,
    })),
  ];

  return [...staticRoutes, ...categoryRoutes, ...dynamicRoutes];
}
