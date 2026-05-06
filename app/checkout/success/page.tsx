"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { CheckCircle, Download, Loader2, XCircle } from "lucide-react";
import { useOrderStatus } from "@/lib/hooks";
import { useCart } from "@/lib/cart";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sm text-neutral-400">Confirming…</div>}>
      <CheckoutSuccessInner />
    </Suspense>
  );
}

function CheckoutSuccessInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId") || undefined;
  const { clear } = useCart();
  const { data, isLoading } = useOrderStatus(orderId, !!orderId);
  const clearedRef = useRef(false);

  useEffect(() => {
    if (data?.status === "paid" && !clearedRef.current) {
      clearedRef.current = true;
      clear();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.status]);

  if (!orderId) {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Missing order reference</h1>
        <p className="text-sm text-neutral-500 mt-3">
          We couldn&apos;t find your order. Check your email for the confirmation link.
        </p>
        <Link href="/account" className="mt-6 inline-block underline">Go to account</Link>
      </div>
    );
  }

  if (isLoading || !data || data.status === "pending") {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-24 text-center">
        <Loader2 className="w-10 h-10 mx-auto text-neutral-400 animate-spin" />
        <h1 className="text-2xl font-semibold mt-6">Confirming your payment…</h1>
        <p className="text-sm text-neutral-500 mt-3">
          This usually takes a few seconds. Please don&apos;t close this page.
        </p>
      </div>
    );
  }

  if (data.status === "paid") {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-24 text-center">
        <CheckCircle className="w-14 h-14 mx-auto text-emerald-500" />
        <h1 className="text-3xl font-semibold mt-6">Payment successful</h1>
        <p className="text-sm text-neutral-500 mt-3">
          Thanks for your purchase. Your downloads are ready and we&apos;ve emailed you the link.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          {data.downloadToken && (
            <Link
              href={`/account/downloads?token=${encodeURIComponent(data.downloadToken)}`}
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 text-sm tracking-widest uppercase"
            >
              <Download className="w-4 h-4" /> Download now
            </Link>
          )}
          <Link
            href="/account"
            className="inline-flex items-center justify-center border border-neutral-300 px-6 py-3 text-sm tracking-widest uppercase hover:border-black"
          >
            View orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto px-4 py-24 text-center">
      <XCircle className="w-14 h-14 mx-auto text-rose-500" />
      <h1 className="text-3xl font-semibold mt-6 capitalize">Payment {data.status}</h1>
      <p className="text-sm text-neutral-500 mt-3">
        Your card was not charged. You can try again from your cart.
      </p>
      <button
        onClick={() => router.push("/checkout")}
        className="mt-6 inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 text-sm tracking-widest uppercase"
      >
        Try again
      </button>
    </div>
  );
}
