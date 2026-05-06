"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Lock, ExternalLink, AlertCircle } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useCurrency } from "@/lib/currency";
import { apiGet, apiPost, apiError } from "@/lib/api";

function idempotencyKey() {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `k-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

type PaymentsAvailability = { enabled: boolean; provider: string; reason: string };

export default function CheckoutPage() {
  const { items, total } = useCart();
  const { user, loading } = useAuth();
  const { format } = useCurrency();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("IN");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availability, setAvailability] = useState<PaymentsAvailability | null>(null);

  useEffect(() => {
    if (user) {
      setName((n) => n || user.name || "");
      setEmail((e) => e || user.email || "");
    }
  }, [user]);

  // Pre-check whether the payment gateway is connected before the user
  // fills the form. Shows a clear "unavailable" card instead of letting
  // them submit and hit a 503.
  useEffect(() => {
    let cancelled = false;
    apiGet<PaymentsAvailability>("/payments/available")
      .then((r) => { if (!cancelled) setAvailability(r); })
      .catch(() => { if (!cancelled) setAvailability({ enabled: false, provider: "unknown", reason: "NETWORK" }); });
    return () => { cancelled = true; };
  }, []);

  const needsAuth = !loading && !user;
  const paymentsDisabled = availability !== null && !availability.enabled;

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (needsAuth) {
      router.push("/login?next=/checkout");
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiPost<{ orderId: string; paymentUrl: string }>(
        "/payments/create-order",
        { billing: { name, email, country } },
        { headers: { "Idempotency-Key": idempotencyKey() } },
      );
      // Redirect to Zoho hosted checkout.
      if (typeof window !== "undefined") window.location.href = res.paymentUrl;
    } catch (err) {
      const msg = apiError(err, "Checkout failed");
      setError(msg);
      toast.error(msg);
      setSubmitting(false);
    }
  }

  // Payments are off — show a friendly full-width card and hide the form.
  if (paymentsDisabled) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 lg:px-8 py-16">
        <h1 className="text-3xl font-semibold mb-8">Checkout</h1>
        <div className="border border-amber-300 bg-amber-50 p-8 rounded-lg">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="font-semibold text-amber-900 text-lg">Payments are temporarily unavailable</h2>
              <p className="text-sm text-amber-900 mt-2">
                Our payment gateway isn&apos;t ready right now. Your cart is saved — come back soon or contact support.
              </p>
              <div className="mt-5 flex gap-3">
                <Link href="/cart" className="inline-flex items-center border border-amber-700 text-amber-900 px-5 py-2 text-xs tracking-widest uppercase hover:bg-amber-100">
                  Back to cart
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center bg-amber-700 text-white px-5 py-2 text-xs tracking-widest uppercase hover:bg-amber-800"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 lg:px-8 py-10">
      <h1 className="text-3xl font-semibold mb-8">Checkout</h1>

      {needsAuth && (
        <div className="mb-6 p-4 border border-amber-300 bg-amber-50 text-sm text-amber-900">
          Please{" "}
          <Link href="/login?next=/checkout" className="underline font-semibold">
            sign in
          </Link>{" "}
          or{" "}
          <Link href="/signup" className="underline font-semibold">
            create an account
          </Link>{" "}
          to complete checkout.
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_380px] gap-10">
        <form onSubmit={pay} className="space-y-6">
          <section className="border border-neutral-200 p-6">
            <h3 className="font-semibold mb-4">Billing details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name" className="col-span-2" value={name} onChange={setName} required />
              <Field label="Email" type="email" className="col-span-2" value={email} onChange={setEmail} required />
              <Field label="Country (2-letter code)" className="col-span-2" value={country} onChange={(v) => setCountry(v.toUpperCase())} required maxLength={2} />
            </div>
          </section>

          <section className="border border-neutral-200 p-6 bg-neutral-50">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Lock className="w-4 h-4" /> Secure payment via Zoho</h3>
            <p className="text-xs text-neutral-600">
              You&apos;ll be redirected to Zoho&apos;s secure hosted payment page to complete
              your purchase. We never see your card details.
            </p>
          </section>

          {error && <div className="text-sm text-rose-600">{error}</div>}

          <button
            type="submit"
            disabled={submitting || items.length === 0 || availability === null}
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 text-sm tracking-widest uppercase disabled:opacity-50 w-full"
          >
            <ExternalLink className="w-4 h-4" />
            {submitting ? "Creating order…" : availability === null ? "Checking payment…" : `Pay ${format(total)}`}
          </button>
          <div className="text-[11px] text-neutral-500 text-center">
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline">Terms</Link>.
          </div>
        </form>

        <aside className="h-fit border border-neutral-200 p-6">
          <h3 className="font-semibold mb-4">Order summary</h3>
          {items.length === 0 ? (
            <div className="text-sm text-neutral-500">Your cart is empty.</div>
          ) : (
            items.map((i) => (
              <div key={i.id} className="flex gap-3 mb-3">
                <img src={i.image} alt={i.name} className="w-14 h-14 rounded object-cover" />
                <div className="flex-1 text-sm min-w-0">
                  <div className="font-medium truncate">{i.name}</div>
                  <div className="text-xs text-neutral-500">Qty {i.qty}</div>
                </div>
                <div className="text-sm font-semibold">{format(i.price * i.qty)}</div>
              </div>
            ))
          )}
          <div className="border-t border-neutral-200 my-4" />
          <div className="flex justify-between font-semibold mt-3">
            <span>Total</span>
            <span>{format(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  className = "",
  type = "text",
  required,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs text-neutral-600">{label}</span>
      <input
        type={type}
        required={required}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-black"
      />
    </label>
  );
}
