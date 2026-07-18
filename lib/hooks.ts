"use client";

/**
 * TanStack Query hooks wrapping the backend API.
 * Used by Client Components that need to read/mutate data.
 * Server Components should use `serverGet` from lib/fetcher.ts instead.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPut, apiPatch, apiDelete, apiError } from "./api";
import type {
  ApiBlogPost,
  ApiBrand,
  ApiBundle,
  ApiCategory,
  ApiHeroSlide,
  ApiOrder,
  ApiProduct,
  ApiUser,
  Paginated,
} from "./types";

/* ─── products ───────────────────────────────────────────── */

export function useProducts(params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: ["products", "list", params],
    queryFn: () => apiGet<Paginated<ApiProduct>>("/products", params),
  });
}

export function useProduct(slug?: string) {
  return useQuery({
    queryKey: ["products", "detail", slug],
    queryFn: () => apiGet<{ product: ApiProduct; related: ApiProduct[] }>(`/products/${slug}`),
    enabled: !!slug,
    staleTime: 5 * 60_000,
  });
}

export function useFeaturedProducts(limit = 12) {
  return useQuery({
    queryKey: ["products", "featured", limit],
    queryFn: () => apiGet<{ data: ApiProduct[] }>(`/products/featured`, { limit }),
  });
}

export function useTrendingProducts(limit = 12) {
  return useQuery({
    queryKey: ["products", "trending", limit],
    queryFn: () => apiGet<{ data: ApiProduct[] }>(`/products/trending`, { limit }),
  });
}

export function useNewArrivals(limit = 12) {
  return useQuery({
    queryKey: ["products", "new", limit],
    queryFn: () => apiGet<{ data: ApiProduct[] }>(`/products/new-arrivals`, { limit }),
  });
}

/* ─── categories / brands / bundles / blog / hero ─────────── */

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => apiGet<{ data: ApiCategory[] }>("/categories"),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
}

export function useCategoriesWithPreviews() {
  return useQuery({
    queryKey: ["categories", "with-previews"],
    queryFn: () => apiGet<{ data: ApiCategory[] }>("/categories/tree-with-previews"),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
}

export function useSearchSuggestions(q: string) {
  return useQuery({
    queryKey: ["search", "suggestions", q],
    queryFn: () => apiGet<{ products: ApiProduct[]; bundles: ApiProduct[]; q: string }>("/search", { q, limit: 6 }),
    enabled: q.length >= 2,
    staleTime: 30_000,
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => apiGet<Paginated<ApiBrand>>("/brands", { limit: 100 }),
    staleTime: 60 * 60_000,
  });
}

export function useBundles() {
  return useQuery({
    queryKey: ["bundles", "list"],
    queryFn: () => apiGet<Paginated<ApiBundle>>("/bundles"),
  });
}

export function useBundle(slug?: string) {
  return useQuery({
    queryKey: ["bundles", "detail", slug],
    queryFn: () => apiGet<{ bundle: ApiBundle }>(`/bundles/${slug}`),
    enabled: !!slug,
  });
}

export function useBlogPosts(params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: ["blog", "list", params],
    queryFn: () => apiGet<Paginated<ApiBlogPost>>("/blog", params),
  });
}

export function useHeroSlides() {
  return useQuery({
    queryKey: ["hero-slides"],
    queryFn: () => apiGet<{ data: ApiHeroSlide[] }>("/hero-slides"),
    staleTime: 60 * 60_000,
  });
}

export function useCurrencyRates() {
  return useQuery({
    queryKey: ["currency"],
    queryFn: () => apiGet<{ base: string; rates: Record<string, number> }>("/currency/rates"),
    staleTime: 24 * 60 * 60_000,
  });
}

/* ─── user orders + downloads ────────────────────────────── */

export function useMyOrders(params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => apiGet<Paginated<ApiOrder>>("/orders", params),
  });
}

export function useMyOrder(id?: string) {
  return useQuery({
    queryKey: ["orders", "detail", id],
    queryFn: () => apiGet<{ order: ApiOrder }>(`/orders/${id}`),
    enabled: !!id,
  });
}

export function useMyDownloads() {
  return useQuery({
    queryKey: ["downloads"],
    queryFn: () => apiGet<{ data: Array<Record<string, unknown>> }>("/downloads"),
  });
}

/* ─── mutations ──────────────────────────────────────────── */

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<ApiUser>) => apiPost<{ user: ApiUser }>("/users/me", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
}

/** Shape returned by POST /payments/create-order for all providers */
export type CreateOrderResult = {
  orderId: string;
  /** Zoho: hosted checkout URL; null for widget-based providers */
  paymentUrl: string | null;
  provider: "zoho" | "stripe" | "razorpay" | "mock" | string;
  /** Razorpay widget payload — only present when provider === "razorpay" */
  razorpay?: {
    orderId: string;   // Razorpay order ID (prefix: order_)
    keyId: string;     // public key — safe to use in browser
    amount: number;    // amount in paise
    currency: string;  // e.g. "INR"
  };
  /** Stripe: client secret for Stripe.js confirmPayment */
  stripeClientSecret?: string;
};

export function useCreateOrder() {
  return useMutation({
    mutationFn: (body: { billing: { country: string; name?: string; email?: string }; provider?: string }) =>
      apiPost<CreateOrderResult>(
        "/payments/create-order",
        body,
        { headers: { "Idempotency-Key": cryptoRandom() } },
      ),
    onError: (err) => {
      throw new Error(apiError(err, "Checkout failed"));
    },
  });
}

export function useOrderStatus(orderId?: string, enabled = true, stripeSessionId?: string) {
  return useQuery({
    queryKey: ["payments", "order-status", orderId, stripeSessionId],
    queryFn: () =>
      apiGet<{ id: string; status: string; downloadToken: string | null; paidAt?: string }>(
        `/payments/order/${orderId}/status`,
        // Pass Stripe session_id so the backend can verify directly
        // when webhooks can't reach localhost (local dev fallback).
        stripeSessionId ? { session_id: stripeSessionId } : undefined,
      ),
    enabled: !!orderId && enabled,
    refetchInterval: (query) => {
      const d = query.state.data as { status?: string } | undefined;
      return d && d.status !== "pending" ? false : 3000;
    },
  });
}

export type DownloadItem = {
  type: "product" | "bundle";
  productId?: string;
  title?: string;
  thumbnail?: string;
  hasFile?: boolean;
  sizeMb?: number | null;
  formats?: string[];
  // bundle fields
  bundleId?: string;
  name?: string;
  image?: string;
  products?: Array<{ productId: string; title: string; thumbnail?: string; hasFile: boolean }>;
};

export type DownloadInfo = {
  order: {
    id: string;
    purchasedAt: string;
    downloadCount: number;
    downloadLimit: number;
    remaining: number;
    tokenExpiresAt: string;
  };
  items: DownloadItem[];
};

/** GET /downloads/:token — view only, does NOT decrement the download count */
export function useDownloadInfo(token?: string) {
  return useQuery({
    queryKey: ["downloads", "info", token],
    queryFn: () => apiGet<DownloadInfo>(`/downloads/${token}`),
    enabled: !!token,
  });
}

/** POST /downloads/:token/use — actually uses one download slot, returns signed URLs */
export function useDownloadSlot(token?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiPost<{ order: DownloadInfo["order"]; items: Array<Record<string, unknown>> }>(`/downloads/${token}/use`, {}),
    onSuccess: () => {
      // Refresh the info view so remaining count updates immediately
      qc.invalidateQueries({ queryKey: ["downloads", "info", token] });
      qc.invalidateQueries({ queryKey: ["downloads", "list"] });
    },
  });
}

type ApiReview = {
  id: string;
  product: string;
  user?: { id: string; name: string };
  rating: number;
  comment?: string;
  createdAt: string;
};

export function useProductReviews(slug: string | undefined) {
  return useQuery({
    queryKey: ["reviews", slug],
    queryFn: () =>
      apiGet<{ data: ApiReview[]; total: number; page: number; limit: number; pages: number }>(
        `/products/${encodeURIComponent(slug || "")}/reviews`,
      ),
    enabled: !!slug,
    staleTime: 30_000,
  });
}

export function usePostReview(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { rating: number; comment?: string }) =>
      apiPost(`/reviews`, { ...body, productId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products", "detail"] });
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

type MyReview = Omit<ApiReview, "product"> & {
  product?: { id: string; title: string; slug: string; thumbnail?: string } | string;
};

export function useMyReviews() {
  return useQuery({
    queryKey: ["reviews", "mine"],
    queryFn: () =>
      apiGet<{ data: MyReview[]; total: number; page: number; limit: number; pages: number }>(
        `/reviews/mine`,
      ),
    staleTime: 30_000,
  });
}

export function useUpdateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: { rating?: number; comment?: string } }) =>
      apiPut(`/reviews/${id}`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
      qc.invalidateQueries({ queryKey: ["products", "detail"] });
    },
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete(`/reviews/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
      qc.invalidateQueries({ queryKey: ["products", "detail"] });
    },
  });
}

export function useSubmitInquiry() {
  return useMutation({
    mutationFn: (body: {
      firstName: string;
      lastName: string;
      email: string;
      topic: string;
      subject: string;
      message: string;
    }) => apiPost<{ inquiry: any }>("/inquiries", body),
  });
}

/* tiny helper — avoid importing uuid into the browser bundle */
function cryptoRandom() {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `k-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/* re-export for convenience */
export { apiGet, apiPost, apiPatch, apiDelete, apiError };
