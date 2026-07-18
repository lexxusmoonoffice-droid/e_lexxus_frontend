"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Heart, Calendar, Bookmark } from "lucide-react";
import { Product } from "@/lib/data";
import { useCurrency } from "@/lib/currency";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";

export default function ProductCard({ p, variant = "standard" }: { p: Product; variant?: "standard" | "gallery" }) {
  const { toggle, has } = useWishlist();
  const { add } = useCart();
  const { user } = useAuth();
  const { format } = useCurrency();
  const router = useRouter();
  const wishlisted = has(p.id);

  function requireAuth(action: () => void) {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    action();
  }

  if (variant === "gallery") {
    return (
      <div className="break-inside-avoid bg-white border border-neutral-100 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 mb-5 relative group">
        <Link href={`/product/${p.slug}`} className="block">
          <div className="relative bg-neutral-50 overflow-hidden">
            {/* Natural ratio image */}
            <img
              src={p.image || "/placeholder.svg"}
              alt={p.name}
              className={`w-full h-auto object-cover transition duration-500 ${p.hoverImage ? "group-hover:opacity-0" : "group-hover:scale-105"}`}
            />
            {p.hoverImage && (
              <img
                src={p.hoverImage}
                alt={p.name}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-500"
              />
            )}
            
            {/* Format badges on overlay */}
            <div className="absolute bottom-2 left-2 flex gap-1 z-10 select-none">
              {p.formats && p.formats.length > 0 ? (
                p.formats.map((fmt) => (
                  <span key={fmt} className="bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 uppercase rounded-sm">
                    {fmt.replace(/^\./, "")}
                  </span>
                ))
              ) : (
                <span className="bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 uppercase rounded-sm">
                  MAX
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition duration-300">
              <button
                onClick={(e) => { e.preventDefault(); requireAuth(() => toggle(p)); }}
                className={`w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md transition ${wishlisted ? "text-red-500" : "text-neutral-500 hover:text-red-500"}`}
                aria-label="Toggle wishlist"
              >
                <Heart className="w-3.5 h-3.5" fill={wishlisted ? "currentColor" : "none"} />
              </button>
              <button
                onClick={(e) => { e.preventDefault(); requireAuth(() => add(p)); }}
                className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md text-neutral-500 hover:text-black transition"
                aria-label="Add to cart"
              >
                <Bookmark className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Link>
        <div className="p-3 bg-neutral-50/50 border-t border-neutral-100/40">
          <Link href={`/product/${p.slug}`} className="block">
            <h3 className="text-xs font-semibold text-neutral-800 hover:text-brand-accent line-clamp-2 transition leading-tight">
              {p.category ? `${p.category} | ` : ""}{p.name}
            </h3>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card group block relative bg-white border border-neutral-100 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <Link href={`/product/${p.slug}`} className="block">
        <div className="relative aspect-square bg-neutral-100 overflow-hidden">
          {/* Default image */}
          <img
            src={p.image || "/placeholder.svg"}
            alt={p.name}
            className={`w-full h-full object-cover transition duration-500 ${p.hoverImage ? "group-hover:opacity-0" : "group-hover:scale-105"}`}
          />
          {/* Hover image — only rendered when hoverImage is set */}
          {p.hoverImage && (
            <img
              src={p.hoverImage}
              alt={p.name}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-500"
            />
          )}
          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={(e) => { e.preventDefault(); requireAuth(() => toggle(p)); }}
              className={`w-8 h-8 bg-white rounded-full flex items-center justify-center shadow transition ${wishlisted ? "text-red-500" : "text-neutral-600 hover:text-red-500"}`}
              aria-label="Toggle wishlist"
            >
              <Heart className="w-4 h-4" fill={wishlisted ? "currentColor" : "none"} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); requireAuth(() => add(p)); }}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow text-neutral-600 hover:text-black transition"
              aria-label="Add to cart"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
      <Link href={`/product/${p.slug}`} className="block p-4">
        <h3 className="font-semibold text-sm">{p.name}</h3>
        <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-1.5">
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{p.views}</span>
          <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{p.likes}</span>
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{p.date}</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-neutral-600">{p.brand}</span>
          <span className="text-emerald-600 font-semibold text-sm">
            {p.price === 0 ? "Free" : format(p.price)}
          </span>
        </div>
      </Link>
    </div>
  );
}
