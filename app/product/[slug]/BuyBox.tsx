"use client";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useAuth } from "@/lib/auth";
import { Product } from "@/lib/data";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag, Download, Zap, Heart } from "lucide-react";

export default function BuyBox({ product }: { product: Product }) {
  const { add } = useCart();
  const { toggle, has } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const wishlisted = has(product.id);

  function requireAuth(action: () => void) {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    action();
  }

  const buyNow = () => requireAuth(() => { add(product); router.push("/checkout"); });

  return (
    <div className="mt-4 space-y-2">
      <button onClick={buyNow} className="btn-primary w-full !py-3 text-base">
        <Zap className="w-4 h-4 mr-2" /> Buy Now
      </button>
      <button onClick={() => requireAuth(() => add(product))} className="btn-outline w-full">
        <ShoppingBag className="w-4 h-4 mr-2" /> Add to Cart
      </button>
      <button
        onClick={() => requireAuth(() => toggle(product))}
        className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm border transition ${
          wishlisted
            ? "border-red-400 text-red-500 bg-red-50 hover:bg-red-100"
            : "border-neutral-300 text-neutral-700 hover:border-black hover:text-black"
        }`}
      >
        <Heart className="w-4 h-4" fill={wishlisted ? "currentColor" : "none"} />
        {wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
      </button>
      {product.price === 0 && (
        <a href="#" className="w-full flex items-center justify-center gap-2 mt-2 text-sm text-emerald-700 font-medium underline">
          <Download className="w-4 h-4" /> Or download free preview
        </a>
      )}
    </div>
  );
}
