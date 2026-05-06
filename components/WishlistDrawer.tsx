"use client";
import { X, Heart, Trash2, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";
import { useCurrency } from "@/lib/currency";

export default function WishlistDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, toggle } = useWishlist();
  const { add } = useCart();
  const { format } = useCurrency();

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            <span className="font-semibold tracking-wide">Wishlist</span>
            {items.length > 0 && (
              <span className="bg-black text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">{items.length}</span>
            )}
          </div>
          <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 text-neutral-400">
              <Heart className="w-12 h-12 opacity-20" />
              <p className="text-sm">Your wishlist is empty</p>
              <button onClick={onClose} className="text-xs border border-neutral-300 px-6 py-2 hover:border-black hover:text-black transition">
                Discover Assets
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b border-neutral-100 pb-4">
                <div className="w-20 h-20 bg-neutral-100 shrink-0 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{item.brand}</p>
                  <p className="text-sm font-semibold mt-1">{format(item.price)}</p>
                  <button
                    onClick={() => add(item)}
                    className="mt-2 flex items-center gap-1.5 text-xs border border-neutral-300 px-3 py-1 hover:border-black hover:text-black transition"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    Add to Cart
                  </button>
                </div>
                <button onClick={() => toggle(item)} className="p-1 text-neutral-400 hover:text-black transition self-start">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-neutral-200">
            <button
              onClick={() => { items.forEach((i) => add(i)); onClose(); }}
              className="block w-full bg-black text-white text-center py-3 text-sm tracking-widest uppercase hover:bg-neutral-800 transition"
            >
              Add All to Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
