"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { Product } from "./data";
import { useAuth } from "./auth";
import { apiPost, apiDelete, apiGet } from "./api";
import type { ApiProduct } from "./types";
import { toLegacyProduct } from "./adapters";
import toast from "react-hot-toast";

type WishlistCtx = {
  items: Product[];
  toggle: (p: Product) => void;
  has: (id: string) => boolean;
  remove: (id: string) => void;
};

const Ctx = createContext<WishlistCtx>({
  items: [],
  toggle: () => {},
  has: () => false,
  remove: () => {},
});

async function fetchServerWishlist(): Promise<Product[]> {
  const res = await apiGet<{ wishlist: { productIds?: ApiProduct[] } }>("/wishlist");
  return (res.wishlist?.productIds || []).map(toLegacyProduct);
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const { user } = useAuth();

  // Load from backend whenever user changes (login / logout)
  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }
    let cancelled = false;
    fetchServerWishlist()
      .then((data) => { if (!cancelled) setItems(data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [user]);

  const toggle = useCallback(async (p: Product) => {
    if (!user) return;
    const isWishlisted = items.some((i) => i.id === p.id);
    // Optimistic update
    setItems((prev) =>
      isWishlisted ? prev.filter((i) => i.id !== p.id) : [...prev, p]
    );
    try {
      if (isWishlisted) {
        await apiDelete(`/wishlist/product/${p.id}`);
        toast.success(`${p.name} removed from wishlist`);
      } else {
        await apiPost("/wishlist", { productId: p.id });
        toast.success(`${p.name} added to wishlist`);
      }
      const fresh = await fetchServerWishlist();
      setItems(fresh);
    } catch {
      // Revert on failure
      setItems((prev) =>
        isWishlisted ? [...prev, p] : prev.filter((i) => i.id !== p.id)
      );
      toast.error(isWishlisted ? "Failed to remove from wishlist" : "Failed to add to wishlist");
    }
  }, [user, items]);

  const remove = useCallback(async (id: string) => {
    if (!user) return;
    const isWishlisted = items.some((i) => i.id === id);
    if (!isWishlisted) return;
    // Optimistic update
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await apiDelete(`/wishlist/product/${id}`);
      const fresh = await fetchServerWishlist();
      setItems(fresh);
    } catch {
      // Revert on failure
      const found = items.find((i) => i.id === id);
      if (found) setItems((prev) => [...prev, found]);
    }
  }, [user, items]);

  const has = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  return <Ctx.Provider value={{ items, toggle, has, remove }}>{children}</Ctx.Provider>;
}

export function useWishlist() {
  return useContext(Ctx);
}
