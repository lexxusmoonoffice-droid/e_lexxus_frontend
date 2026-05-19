"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Download, XCircle } from "lucide-react";
import { useOrderStatus } from "@/lib/hooks";
import { useCart } from "@/lib/cart";

/* ─── inline keyframe styles ──────────────────────────────────────────── */
const STYLES = `
@keyframes popIn {
  0%   { transform: scale(0.4); opacity: 0; }
  60%  { transform: scale(1.15); opacity: 1; }
  80%  { transform: scale(0.95); }
  100% { transform: scale(1); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
  40%            { transform: scale(1);   opacity: 1;   }
}
@keyframes ringPulse {
  0%   { transform: scale(0.85); opacity: 0.7; }
  50%  { transform: scale(1.15); opacity: 0.2; }
  100% { transform: scale(0.85); opacity: 0.7; }
}
@keyframes checkDraw {
  from { stroke-dashoffset: 80; }
  to   { stroke-dashoffset: 0; }
}
.anim-pop    { animation: popIn  0.55s cubic-bezier(.3,1.6,.5,1) forwards; }
.anim-up1    { opacity: 0; animation: fadeUp 0.45s 0.3s ease-out forwards; }
.anim-up2    { opacity: 0; animation: fadeUp 0.45s 0.5s ease-out forwards; }
.anim-up3    { opacity: 0; animation: fadeUp 0.45s 0.7s ease-out forwards; }
.ring-pulse  { animation: ringPulse 2.2s ease-in-out infinite; }
.check-draw  { stroke-dasharray: 80; stroke-dashoffset: 80; animation: checkDraw 0.5s 0.2s ease-out forwards; }
.dot1 { animation: bounce 1.4s 0s   infinite ease-in-out; }
.dot2 { animation: bounce 1.4s 0.2s infinite ease-in-out; }
.dot3 { animation: bounce 1.4s 0.4s infinite ease-in-out; }
`;

/* ─── Confetti ─────────────────────────────────────────────────────────── */
const COLORS = ["#10b981","#3b82f6","#f59e0b","#ef4444","#8b5cf6","#ec4899","#14b8a6","#f97316"];
type Particle = { x: number; y: number; vx: number; vy: number; size: number; color: string; shape: "rect"|"circle"; angle: number; spin: number; };

function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const particles = useRef<Particle[]>([]);

  const launch = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width  = window.innerWidth;
    const H = canvas.height = window.innerHeight;
    particles.current = Array.from({ length: 160 }, () => ({
      x:      W * (0.25 + Math.random() * 0.5),
      y:      H * 0.42,
      vx:     (Math.random() - 0.5) * 14,
      vy:     -(Math.random() * 18 + 8),
      size:   Math.random() * 7 + 4,
      color:  COLORS[Math.floor(Math.random() * COLORS.length)],
      shape:  Math.random() > 0.4 ? "rect" : "circle",
      angle:  Math.random() * Math.PI * 2,
      spin:   (Math.random() - 0.5) * 0.2,
    }));

    let frame = 0;
    const tick = () => {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of particles.current) {
        p.vy += 0.45;          // gravity
        p.vx *= 0.99;          // drag
        p.x  += p.vx;
        p.y  += p.vy;
        p.angle += p.spin;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - frame / 240);
        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      frame++;
      if (frame < 260) rafRef.current = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, W, H);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (active) launch();
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, launch]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:50 }}
    />
  );
}

/* ─── SuccessCard ──────────────────────────────────────────────────────── */
function SuccessCard({ downloadToken }: { downloadToken: string | null }) {
  const [confetti, setConfetti] = useState(false);
  useEffect(() => { setConfetti(true); }, []);

  return (
    <>
      <Confetti active={confetti} />
      <div className="max-w-[600px] mx-auto px-4 py-20 text-center">

        {/* animated checkmark */}
        <div className="relative inline-flex items-center justify-center w-28 h-28 mb-8">
          {/* pulsing ring */}
          <span
            className="ring-pulse absolute inset-0 rounded-full border-2 border-emerald-400"
            style={{ borderColor:"#10b981" }}
          />
          {/* icon circle */}
          <span className="anim-pop absolute inset-2 rounded-full bg-emerald-50 flex items-center justify-center">
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="26" r="24" fill="#d1fae5" />
              <polyline
                className="check-draw"
                points="14,27 22,35 38,18"
                stroke="#059669"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </span>
        </div>

        <h1 className="anim-up1 text-3xl font-bold tracking-tight">
          Payment successful 🎉
        </h1>
        <p className="anim-up2 mt-3 text-neutral-500 text-sm leading-relaxed max-w-[420px] mx-auto">
          Thank you for your purchase! Your downloads are ready and we&apos;ve
          sent a confirmation link to your email.
        </p>

        <div className="anim-up3 mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          {downloadToken && (
            <Link
              href={`/account/downloads?token=${encodeURIComponent(downloadToken)}`}
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 transition-colors text-white px-7 py-3 text-sm tracking-widest uppercase font-semibold rounded-sm"
            >
              <Download className="w-4 h-4" /> Download now
            </Link>
          )}
          <Link
            href="/account"
            className="inline-flex items-center justify-center border border-neutral-300 hover:border-black transition-colors px-7 py-3 text-sm tracking-widest uppercase rounded-sm"
          >
            View orders
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center text-neutral-400 hover:text-neutral-700 transition-colors px-4 py-3 text-sm underline-offset-4 hover:underline"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </>
  );
}

/* ─── PendingScreen (H-2 fix: 5-min timeout → "still processing") ──────── */
function PendingScreen() {
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 5 * 60 * 1000); // 5 min
    return () => clearTimeout(t);
  }, []);

  if (timedOut) {
    return (
      <div className="max-w-[560px] mx-auto px-4 py-24 text-center">
        <div className="text-4xl mb-6">⏳</div>
        <h1 className="text-2xl font-semibold">Still processing…</h1>
        <p className="text-sm text-neutral-500 mt-3 leading-relaxed">
          Your payment is taking longer than usual. Check your email — we&apos;ll
          send a confirmation as soon as it clears.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/account"
            className="inline-flex items-center justify-center border border-neutral-300 hover:border-black transition-colors px-6 py-3 text-sm tracking-widest uppercase"
          >
            My orders
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center justify-center text-neutral-400 hover:text-neutral-700 transition-colors px-4 py-3 text-sm hover:underline underline-offset-4"
          >
            Back to cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[560px] mx-auto px-4 py-24 text-center">
      {/* bouncing dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <span className="dot1 inline-block w-3 h-3 rounded-full bg-neutral-400" />
        <span className="dot2 inline-block w-3 h-3 rounded-full bg-neutral-400" />
        <span className="dot3 inline-block w-3 h-3 rounded-full bg-neutral-400" />
      </div>
      <h1 className="text-2xl font-semibold">Confirming your payment…</h1>
      <p className="text-sm text-neutral-500 mt-3">
        This usually takes a few seconds. Please don&apos;t close this page.
      </p>
    </div>
  );
}

/* ─── FailedScreen ──────────────────────────────────────────────────────── */
function FailedScreen({ status }: { status: string }) {
  const router = useRouter();
  return (
    <div className="max-w-[560px] mx-auto px-4 py-24 text-center">
      <div className="anim-pop inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-50 mb-8">
        <XCircle className="w-10 h-10 text-rose-500" />
      </div>
      <h1 className="anim-up1 text-3xl font-semibold capitalize">
        Payment {status}
      </h1>
      <p className="anim-up2 text-sm text-neutral-500 mt-3">
        Your card was not charged. You can try again from your cart.
      </p>
      <div className="anim-up3 mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => router.push("/checkout")}
          className="inline-flex items-center justify-center bg-black hover:bg-neutral-800 transition-colors text-white px-7 py-3 text-sm tracking-widest uppercase"
        >
          Try again
        </button>
        <Link
          href="/cart"
          className="inline-flex items-center justify-center border border-neutral-300 hover:border-black transition-colors px-7 py-3 text-sm tracking-widest uppercase"
        >
          Back to cart
        </Link>
      </div>
    </div>
  );
}

/* ─── NoOrderScreen ─────────────────────────────────────────────────────── */
function NoOrderScreen() {
  return (
    <div className="max-w-[560px] mx-auto px-4 py-24 text-center">
      <div className="text-5xl mb-6">🔍</div>
      <h1 className="text-2xl font-semibold">Missing order reference</h1>
      <p className="text-sm text-neutral-500 mt-3">
        We couldn&apos;t find your order. Check your email for the confirmation link.
      </p>
      <Link href="/account" className="mt-6 inline-block text-sm underline underline-offset-4">
        Go to my account
      </Link>
    </div>
  );
}

/* ─── Inner (reads search params — must be wrapped in Suspense) ─────────── */
function CheckoutSuccessInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || undefined;
  // Stripe appends ?session_id=cs_test_... to the success URL — pass it
  // to the status hook so the backend can verify the session directly
  // (fallback for local dev where webhooks can't reach localhost).
  const stripeSessionId = searchParams.get("session_id") || undefined;
  const { clear } = useCart();
  const { data, isLoading } = useOrderStatus(orderId, !!orderId, stripeSessionId);
  const clearedRef = useRef(false);

  useEffect(() => {
    if (data?.status === "paid" && !clearedRef.current) {
      clearedRef.current = true;
      clear();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.status]);

  if (!orderId) return <NoOrderScreen />;
  if (isLoading || !data || data.status === "pending") return <PendingScreen />;
  if (data.status === "paid") return <SuccessCard downloadToken={data.downloadToken} />;
  return <FailedScreen status={data.status} />;
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function CheckoutSuccessPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Suspense fallback={
        <div className="py-24 text-center text-sm text-neutral-400">
          Confirming…
        </div>
      }>
        <CheckoutSuccessInner />
      </Suspense>
    </>
  );
}
