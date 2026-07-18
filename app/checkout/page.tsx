"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

type ProviderInfo = {
  id: "zoho" | "stripe" | "razorpay" | "mock";
  label: string;
  enabled: boolean;
  reason?: string;
  keyId?: string;
};

type PaymentsAvailability = {
  enabled: boolean;
  provider: "zoho" | "stripe" | "razorpay" | "mock" | "unknown";
  reason: string;
  providers?: ProviderInfo[];
  keyId?: string; // Razorpay public key — only present when provider === 'razorpay'
};

type CreateOrderResponse = {
  orderId: string;
  paymentUrl: string | null;
  provider: string;
  razorpay?: {
    orderId: string;
    keyId: string;
    amount: number;   // paise
    currency: string;
  };
};

/* ── Razorpay types ── */
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("SSR"));
    if (window.Razorpay) return resolve();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
}

const PROVIDER_LABEL: Record<string, string> = {
  zoho: "Zoho Payments",
  stripe: "Stripe",
  razorpay: "Razorpay",
  mock: "Mock (dev)",
  unknown: "payment gateway",
};

export default function CheckoutPage() {
  const { items, total, clear: clearCart } = useCart();
  const { user, loading } = useAuth();
  const { format, code: currencyCode } = useCurrency();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("IN");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availability, setAvailability] = useState<PaymentsAvailability | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const iKey = useRef(idempotencyKey());

  useEffect(() => {
    if (user) {
      setName((n) => n || user.name || "");
      setEmail((e) => e || user.email || "");
    }
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    apiGet<PaymentsAvailability>("/payments/available")
      .then((r) => {
        if (cancelled) return;
        setAvailability(r);
        // Auto-select first ENABLED provider (prefer backend default).
        setSelectedProvider((prev) => {
          if (prev) return prev;
          const firstEnabled = r.providers?.find((p) => p.enabled);
          return firstEnabled?.id ?? r.provider ?? null;
        });
      })
      .catch(() => { if (!cancelled) setAvailability({ enabled: false, provider: "unknown", reason: "NETWORK" }); });
    return () => { cancelled = true; };
  }, []);

  const needsAuth = !loading && !user;
  const paymentsDisabled = availability !== null && !availability.enabled;
  // All providers (enabled + disabled/not-connected) — show all in selector
  const allProviders = availability?.providers ?? [];
  const enabledProviders = allProviders.filter((p) => p.enabled);
  const multiProvider = allProviders.length > 1;
  // Active provider: user selection (must be enabled) → first enabled → backend default
  const activeProvider =
    (selectedProvider && enabledProviders.find((p) => p.id === selectedProvider)
      ? selectedProvider
      : null) ??
    enabledProviders[0]?.id ??
    availability?.provider ??
    "zoho";
  const providerLabel = PROVIDER_LABEL[activeProvider] ?? activeProvider;

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (needsAuth) { router.push("/login?next=/checkout"); return; }
    if (items.length === 0) { setError("Your cart is empty."); return; }

    setSubmitting(true);
    try {
      const res = await apiPost<CreateOrderResponse>(
        "/payments/create-order",
        {
          billing: { name, email, country },
          currency: currencyCode,
          // Pass selected provider so backend routes to the right gateway.
          ...(activeProvider && activeProvider !== "unknown" && activeProvider !== "mock"
            ? { provider: activeProvider as "zoho" | "stripe" | "razorpay" }
            : {}),
        },
        { headers: { "Idempotency-Key": iKey.current } },
      );

      if (res.provider === "razorpay" && res.razorpay) {
        await openRazorpayWidget(res);
      } else if (res.paymentUrl) {
        // Zoho or Stripe — redirect to hosted checkout.
        window.location.href = res.paymentUrl;
      } else {
        throw new Error("No payment URL returned from server");
      }
    } catch (err) {
      const msg = apiError(err, "Checkout failed");
      setError(msg);
      toast.error(msg);
      setSubmitting(false);
    }
  }

  async function openRazorpayWidget(res: CreateOrderResponse) {
    if (!res.razorpay) return;
    await loadRazorpayScript();

    const rzp = new window.Razorpay({
      key: res.razorpay.keyId,
      amount: res.razorpay.amount,
      currency: res.razorpay.currency,
      order_id: res.razorpay.orderId,
      name: "Lexxus",
      description: `Order ${res.orderId}`,
      prefill: { name, email },
      theme: { color: "#000000" },
      handler: async function (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) {
        // Verify on the server and mark order paid.
        try {
          await apiPost("/payments/razorpay/verify", {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            orderId: res.orderId,
          });
          clearCart?.();
          router.push(`/checkout/success?orderId=${res.orderId}`);
        } catch (err) {
          const msg = apiError(err, "Payment verification failed");
          setError(msg);
          toast.error(msg);
          setSubmitting(false);
        }
      },
      modal: {
        ondismiss: () => {
          setSubmitting(false);
        },
      },
    });
    rzp.open();
  }

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
                <button onClick={() => window.location.reload()} className="inline-flex items-center bg-amber-700 text-white px-5 py-2 text-xs tracking-widest uppercase hover:bg-amber-800">
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
          <Link href="/login?next=/checkout" className="underline font-semibold">sign in</Link>{" "}
          or{" "}
          <Link href="/signup" className="underline font-semibold">create an account</Link>{" "}
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

          {/* Payment method selector — shown when there are multiple providers (even partially configured) */}
          {multiProvider && (
            <section className="border border-neutral-200 p-6">
              <h3 className="font-semibold mb-4">Payment method</h3>
              <div className="space-y-3">
                {allProviders.map((p) => (
                  <label
                    key={p.id}
                    className={`flex items-center gap-3 ${p.enabled ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                  >
                    <input
                      type="radio"
                      name="provider"
                      value={p.id}
                      disabled={!p.enabled}
                      checked={activeProvider === p.id}
                      onChange={() => p.enabled && setSelectedProvider(p.id)}
                      className="accent-black w-4 h-4"
                    />
                    <span className="text-sm font-medium flex items-center gap-2">
                      {PROVIDER_LABEL[p.id] ?? p.label}
                      {!p.enabled && (
                        <span className="text-[10px] font-semibold tracking-widest uppercase bg-amber-100 text-amber-700 border border-amber-300 px-2 py-0.5 rounded">
                          {p.reason === "KYC_PENDING" ? "KYC Pending" : "Not connected"}
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
              {allProviders.some((p) => !p.enabled && p.id === "zoho" && p.reason === "KYC_PENDING") && (
                <p className="mt-4 text-xs text-neutral-500">
                  Zoho Payments requires KYC verification before it can accept payments.{" "}
                  <a
                    href="https://payments.zoho.in"
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-neutral-700 hover:text-black"
                  >
                    Complete verification at payments.zoho.in
                  </a>
                  .
                </p>
              )}
              {allProviders.some((p) => !p.enabled && p.id === "zoho" && p.reason === "NOT_CONNECTED") && (
                <p className="mt-4 text-xs text-neutral-500">
                  To enable Zoho Payments, complete OAuth setup via{" "}
                  <a
                    href="http://localhost:5050/api/zoho/dev-connect"
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-neutral-700 hover:text-black"
                  >
                    Zoho Dev Connect
                  </a>
                  .
                </p>
              )}
            </section>
          )}

          <section className="border border-neutral-200 p-6 bg-neutral-50">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Secure payment via {providerLabel}
            </h3>
            <p className="text-xs text-neutral-600">
              {activeProvider === "razorpay"
                ? "A secure payment window will open. We never see your card details."
                : `You'll be redirected to ${providerLabel}'s secure hosted payment page. We never see your card details.`}
            </p>
          </section>

          {error && <div className="text-sm text-rose-600">{error}</div>}

          <button
            type="submit"
            disabled={submitting || items.length === 0 || availability === null}
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 text-sm tracking-widest uppercase disabled:opacity-50 w-full"
          >
            <ExternalLink className="w-4 h-4" />
            {submitting
              ? activeProvider === "razorpay" ? "Opening payment…" : "Creating order…"
              : availability === null
                ? "Checking payment…"
                : `Pay ${format(total)}`}
          </button>

          {/* Currency notice — tells the user which currency they'll be charged in */}
          <p className="text-[11px] text-neutral-500 text-center">
            {currencyCode === "USD"
              ? <>You will be charged in <span className="font-semibold text-neutral-700">USD</span> ({format(total)} · ₹{total.toLocaleString("en-IN")} equivalent).</>
              : <>You will be charged in <span className="font-semibold text-neutral-700">INR (₹)</span>.</>
            }{" "}
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline">Terms</Link>.
          </p>
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
  label, value, onChange, className = "", type = "text", required, maxLength,
}: {
  label: string; value: string; onChange: (v: string) => void;
  className?: string; type?: string; required?: boolean; maxLength?: number;
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
