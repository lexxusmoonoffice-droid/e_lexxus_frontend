"use client";

import Link from "next/link";
import AccountShell from "@/components/AccountShell";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/lib/wishlist";

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <AccountShell title="My Account">
      <h2 className="font-semibold mb-4">Your Wishlist</h2>
      {items.length === 0 ? (
        <div className="border border-neutral-200 p-10 text-center text-sm text-neutral-500">
          Your wishlist is empty.{" "}
          <Link href="/c/models" className="underline">Browse 3D Models</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </AccountShell>
  );
}
