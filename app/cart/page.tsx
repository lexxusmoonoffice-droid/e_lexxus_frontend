"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useCurrency } from "@/lib/currency";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, remove, total } = useCart();
  const { user, loading } = useAuth();
  const { format } = useCurrency();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?next=/cart");
    }
  }, [loading, user, router]);

  if (loading || !user) return null;

  if (items.length === 0) {
    return (
      <div className="max-w-[900px] mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-semibold">Your cart is empty</h1>
        <p className="text-neutral-600 mt-3">Discover premium 3D models and digital assets.</p>
        <Link href="/c/models" className="btn-primary mt-8 inline-flex">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-10">
      <h1 className="text-3xl font-semibold mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-4">
          {items.map((i) => (
            <div key={i.id} className="flex gap-4 p-4 border border-neutral-200">
              <img src={i.image} className="w-28 h-28 object-cover rounded-lg" />
              <div className="flex-1">
                <div className="font-semibold">{i.name}</div>
                <div className="text-xs text-neutral-500">{i.brand} · {i.category}</div>
                <div className="text-xs text-neutral-500 mt-1">Qty: {i.qty}</div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => remove(i.id)} className="text-neutral-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="font-semibold text-emerald-600">{format(i.price * i.qty)}</div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit border border-neutral-200 p-6">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="flex justify-between text-sm mb-2"><span>Subtotal</span><span>{format(total)}</span></div>
          <div className="flex justify-between text-sm mb-2"><span>Tax</span><span>{format(total * 0.1)}</span></div>
          <div className="border-t border-neutral-200 my-4" />
          <div className="flex justify-between font-semibold mb-6"><span>Total</span><span>{format(total * 1.1)}</span></div>
          <Link href="/checkout" className="btn-primary w-full">Checkout</Link>
        </aside>
      </div>
    </div>
  );
}
