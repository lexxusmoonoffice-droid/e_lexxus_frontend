import Link from "next/link";
import { XCircle } from "lucide-react";

export const metadata = { title: "Checkout cancelled — Lexxus" };

export default function CheckoutCancelPage() {
  return (
    <div className="max-w-[600px] mx-auto px-4 py-24 text-center">
      <XCircle className="w-14 h-14 mx-auto text-neutral-400" />
      <h1 className="text-3xl font-semibold mt-6">Checkout cancelled</h1>
      <p className="text-sm text-neutral-500 mt-3">
        Your cart is still here if you want to try again.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/checkout"
          className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 text-sm tracking-widest uppercase"
        >
          Back to checkout
        </Link>
        <Link
          href="/c/models"
          className="inline-flex items-center justify-center border border-neutral-300 px-6 py-3 text-sm tracking-widest uppercase hover:border-black"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
