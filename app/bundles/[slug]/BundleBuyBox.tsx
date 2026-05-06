"use client";
import { useCart } from "@/lib/cart";
import { Bundle, products } from "@/lib/data";
import { useRouter } from "next/navigation";
import { ShoppingBag, Zap } from "lucide-react";

export default function BundleBuyBox({ bundle }: { bundle: Bundle }) {
  const { add } = useCart();
  const router = useRouter();

  // Represent the bundle as a synthetic product for the cart
  const addBundleToCart = () => {
    const syntheticProduct = {
      id: `bundle-${bundle.id}`,
      slug: `bundles/${bundle.slug}`,
      name: bundle.name,
      brand: "Lexxus Bundle",
      category: "Bundle",
      price: bundle.bundlePrice,
      image: bundle.image,
      images: bundle.images,
      views: 0,
      likes: 0,
      date: new Date().toLocaleDateString("en-GB").replace(/\//g, "."),
      description: bundle.description,
      fileSizeMb: bundle.fileSizeMb,
    };
    add(syntheticProduct);
  };

  const buyNow = () => {
    addBundleToCart();
    router.push("/checkout");
  };

  return (
    <div className="mt-5 space-y-2">
      <button
        onClick={buyNow}
        className="w-full bg-black text-white py-4 text-sm tracking-widest uppercase hover:bg-neutral-800 transition flex items-center justify-center gap-2"
      >
        <Zap className="w-4 h-4" /> Buy Bundle Now
      </button>
      <button
        onClick={addBundleToCart}
        className="w-full border border-neutral-300 py-3.5 text-sm tracking-widest uppercase hover:border-black transition flex items-center justify-center gap-2"
      >
        <ShoppingBag className="w-4 h-4" /> Add to Cart
      </button>
    </div>
  );
}
