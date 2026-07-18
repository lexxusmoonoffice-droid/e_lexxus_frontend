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
import { useWishlist } from "./wishlist";
import { apiPost, apiDelete, apiGet } from "./api";
import type { ApiProduct } from "./types";
import { toLegacyProduct } from "./adapters";
import toast from "react-hot-toast";

type CartItem = Product & { qty: number };
type CartCtx = {
  items: CartItem[];
  add: (p: Product) => void;
  remove: (id: string) => void;
  clear: () => void;
  total: number;
  syncing: boolean;
};

const Ctx = createContext<CartCtx>({
  items: [],
  add: () => {},
  remove: () => {},
  clear: () => {},
  total: 0,
  syncing: false,
});

async function fetchServerCart(): Promise<CartItem[]> {
  const res = await apiGet<{ cart: { items: Array<{ product?: ApiProduct; qty: number }> } }>("/cart");
  return (res.cart?.items || [])
    .filter((i) => !!i.product)
    .map((i) => ({ ...toLegacyProduct(i.product as ApiProduct), qty: i.qty }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [syncing, setSyncing] = useState(false);
  const { user } = useAuth();
  const { remove: removeFromWishlist } = useWishlist();

  // Load from backend whenever user changes (login / logout)
  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }
    let cancelled = false;
    setSyncing(true);
    fetchServerCart()
      .then((data) => { if (!cancelled) setItems(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setSyncing(false); });
    return () => { cancelled = true; };
  }, [user]);

  const add = useCallback(async (p: Product) => {
    if (!user) return;

    // Remove from wishlist if present
    removeFromWishlist(p.id);

    const existing = items.find((i) => i.id === p.id);
    if (existing) {
      toast.success(`${p.name} is already in your cart`);
      return;
    }

    // Optimistic update
    setItems((prev) => [...prev, { ...p, qty: 1 }]);
    try {
      await apiPost("/cart/items", { productId: p.id, qty: 1 });
      const fresh = await fetchServerCart();
      setItems(fresh);
      toast.success(`${p.name} added to cart`);
    } catch {
      // Revert on failure
      setItems((prev) => prev.filter((i) => i.id !== p.id));
      toast.error("Failed to add to cart");
    }
  }, [user, items, removeFromWishlist]);

  const remove = useCallback(async (id: string) => {
    if (!user) return;
    const snapshot = items;
    const removed = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await apiDelete(`/cart/items/product/${id}`);
      toast.success(removed ? `${removed.name} removed from cart` : "Item removed from cart");
    } catch {
      setItems(snapshot);
      toast.error("Failed to remove item");
    }
  }, [user, items]);

  const clear = useCallback(async () => {
    if (!user) return;
    const snapshot = items;
    setItems([]);
    try {
      await apiDelete("/cart");
      toast.success("Cart cleared");
    } catch {
      setItems(snapshot);
      toast.error("Failed to clear cart");
    }
  }, [user, items]);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <Ctx.Provider value={{ items, add, remove, clear, total, syncing }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  return useContext(Ctx);
}
