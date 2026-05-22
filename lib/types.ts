/**
 * Shapes returned by the backend API. Purely structural — no runtime
 * dependency on the backend package.
 */

export interface ApiBrand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  hero?: string;
  description?: string;
  country?: string;
}

export interface ApiProductPreview {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  price: number;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  parent?: string | null;
  image?: string;
  children?: ApiCategory[];
  previews?: ApiProductPreview[];
}

export interface ApiProduct {
  id: string;
  slug: string;
  title: string;
  description: string;
  brand?: ApiBrand | string | null;
  category?: ApiCategory | string;
  tags?: string[];
  price: number;
  currency?: string;
  isFree?: boolean;
  attributes?: {
    material?: string;
    style?: string;
    color?: string;
    dimensions?: { w?: number; l?: number; h?: number };
  };
  fileSizeMb?: number;
  formats?: string[];
  thumbnail?: string;
  hoverImage?: string;
  images?: string[];
  status?: string;
  publishedAt?: string;
  createdAt?: string;
  views?: number;
  likes?: number;
  downloadCount?: number;
  rating?: { avg: number; count: number };
}

export interface ApiBundle {
  id: string;
  slug: string;
  name: string;
  tag?: string;
  badge?: string;
  description?: string;
  image?: string;
  images?: string[];
  productIds?: ApiProduct[] | string[];
  bundlePrice: number;
  originalPrice: number;
  savingsPct: number;
  modelCount: number;
  fileSizeMb?: number;
  formats?: string[];
}

export interface ApiBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: string;
  author?: string;
  authorName?: string;
  tags?: string[];
  publishedAt?: string;
}

export interface ApiHeroSlide {
  id: string;
  order: number;
  active: boolean;
  img: string;
  tag?: string;
  title: [string, string];
  sub?: string;
  cta?: string;
  href?: string;
  accent?: string;
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'creator' | 'admin';
  verified: boolean;
  avatar?: string;
  bio?: string;
  status: string;
  createdAt: string;
}

export interface Paginated<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiOrderItem {
  type: 'product' | 'bundle';
  product?: ApiProduct | null;
  bundle?: ApiBundle | null;
  qty: number;
  priceAtPurchase: number;
  title?: string;
}

export interface ApiOrder {
  id: string;
  buyer: string | ApiUser;
  items: ApiOrderItem[];
  subtotal: number;
  tax?: number;
  total: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
  downloadToken?: string | null;
  tokenExpiresAt?: string | null;
  downloadCount?: number;
  downloadLimit?: number;
  billing?: { name?: string; email?: string; country?: string };
  createdAt: string;
  payment?: { paidAt?: string };
}
