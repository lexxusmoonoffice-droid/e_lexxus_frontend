/**
 * Adapters from the live API shape to the legacy `Product` / `Bundle`
 * shapes the existing components consume. Lets us re-wire pages
 * without rewriting every component that reads `.name` / `.image` /
 * `.date`.
 */

import type { ApiBrand, ApiBundle, ApiCategory, ApiProduct } from './types';
import type { Bundle, Product } from './data';
import { API_URL } from './fetcher';

function fixImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(url)) {
    return API_URL.replace(/\/api$/, '') + url.replace(/^https?:\/\/[^/]+/, '');
  }
  return url;
}

function nameOf(ref?: ApiBrand | ApiCategory | string | null): string {
  if (!ref) return '';
  if (typeof ref === 'string') return ref;
  return ref.name || '';
}

function formatDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}

export function toLegacyProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.title,
    brand: nameOf(p.brand),
    category: nameOf(p.category),
    price: p.price,
    image: fixImageUrl(p.thumbnail || p.images?.[0]),
    hoverImage: fixImageUrl(p.hoverImage) || undefined,
    images: (p.images || []).map(fixImageUrl),
    views: p.views || 0,
    likes: p.likes || 0,
    date: formatDate(p.publishedAt || p.createdAt),
    material: p.attributes?.material,
    style: p.attributes?.style,
    color: p.attributes?.color,
    description: p.description,
    dimensions: p.attributes?.dimensions as Product['dimensions'],
    fileSizeMb: p.fileSizeMb || 0,
  };
}

export function toLegacyBundle(b: ApiBundle): Bundle {
  const productIds = (b.productIds || []).map((p: ApiProduct | string) =>
    typeof p === 'string' ? p : p.id,
  );
  return {
    id: b.id,
    slug: b.slug,
    name: b.name,
    tag: b.tag || '',
    badge: b.badge,
    description: b.description || '',
    image: b.image || '',
    images: b.images || [],
    productIds,
    originalPrice: b.originalPrice,
    bundlePrice: b.bundlePrice,
    savings: b.savingsPct,
    modelCount: b.modelCount,
    fileSizeMb: b.fileSizeMb || 0,
    formats: b.formats || [],
  };
}
