"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";
import Logo from "@/components/Logo";
import { useAuth } from "@/lib/auth";
import { apiPost, apiError, setTokens } from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";
import type { ApiUser } from "@/lib/types";

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sm text-neutral-400">Loading…</div>}>
      <LoginInner />
    </Suspense>
  );
}

type Tab = "password" | "otp";

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/account";
  const { login, refresh } = useAuth();

  const [tab, setTab] = useState<Tab>("password");

  // Password login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP state
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password login
  async function onPasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back");
      router.push(nextPath);
    } catch (err) {
      const msg = (err as Error).message || "Login failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  // Send OTP
  async function onSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiPost("/auth/send-otp", { email: otpEmail });
      setOtpSent(true);
      toast.success("OTP sent — check your email");
      // 60s cooldown before resend
      setResendCooldown(60);
      const t = setInterval(() => {
        setResendCooldown((c) => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; });
      }, 1000);
    } catch (err) {
      const msg = apiError(err, "Failed to send OTP");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  // Verify OTP
  async function onVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiPost<{ accessToken: string; refreshToken: string; user: ApiUser }>(
        "/auth/verify-otp",
        { email: otpEmail, otp },
      );
      setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken });
      await refresh();
      toast.success("Welcome back");
      router.push(nextPath);
    } catch (err) {
      const msg = apiError(err, "Invalid or expired code");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border border-neutral-200 p-8">
        <div className="flex justify-center mb-6"><Logo /></div>
        <h1 className="text-2xl font-semibold text-center">Sign in to Lexxus</h1>

        {/* Tabs */}
        <div className="mt-6 flex border border-neutral-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => { setTab("password"); setError(null); }}
            className={`flex-1 py-2 text-xs font-medium transition ${tab === "password" ? "bg-black text-white" : "hover:bg-neutral-50 text-neutral-600"}`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => { setTab("otp"); setError(null); }}
            className={`flex-1 py-2 text-xs font-medium transition ${tab === "otp" ? "bg-black text-white" : "hover:bg-neutral-50 text-neutral-600"}`}
          >
            OTP (Email Code)
          </button>
        </div>

        {/* Password form */}
        {tab === "password" && (
          <form className="mt-5 space-y-4" onSubmit={onPasswordSubmit}>
            <label className="block">
              <span className="text-xs text-neutral-600">Email</span>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-black"
              />
            </label>
            <label className="block">
              <span className="text-xs text-neutral-600">Password</span>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"} required minLength={8} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full border border-neutral-300 rounded-lg pl-3 pr-10 py-2.5 text-sm outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </label>
            {error && <div className="text-xs text-rose-600">{error}</div>}
            <button type="submit" disabled={loading}
              className="w-full bg-black text-white py-2.5 rounded-lg text-sm tracking-widest uppercase disabled:opacity-50">
              {loading ? "Signing in…" : "Sign in"}
            </button>
            <div className="text-xs text-center text-neutral-500">
              <Link href="/forgot-password" className="underline hover:text-black">Forgot password?</Link>
            </div>
          </form>
        )}

        {/* OTP form */}
        {tab === "otp" && (
          <div className="mt-5 space-y-4">
            {!otpSent ? (
              <form onSubmit={onSendOtp} className="space-y-4">
                <label className="block">
                  <span className="text-xs text-neutral-600">Email address</span>
                  <input
                    type="email" required value={otpEmail}
                    onChange={(e) => setOtpEmail(e.target.value)}
                    autoComplete="email" placeholder="you@example.com"
                    className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-black"
                  />
                </label>
                {error && <div className="text-xs text-rose-600">{error}</div>}
                <button type="submit" disabled={loading}
                  className="w-full bg-black text-white py-2.5 rounded-lg text-sm tracking-widest uppercase disabled:opacity-50">
                  {loading ? "Sending…" : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={onVerifyOtp} className="space-y-4">
                <p className="text-xs text-neutral-500 text-center">
                  A 6-digit code was sent to <strong>{otpEmail}</strong>
                </p>
                <label className="block">
                  <span className="text-xs text-neutral-600">Enter OTP</span>
                  <input
                    type="text" required inputMode="numeric" maxLength={6}
                    value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="••••••"
                    className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-black tracking-[0.5em] text-center font-mono"
                  />
                </label>
                {error && <div className="text-xs text-rose-600">{error}</div>}
                <button type="submit" disabled={loading}
                  className="w-full bg-black text-white py-2.5 rounded-lg text-sm tracking-widest uppercase disabled:opacity-50">
                  {loading ? "Verifying…" : "Verify & Sign in"}
                </button>
                <div className="text-xs text-center text-neutral-500">
                  {resendCooldown > 0 ? (
                    <span>Resend in {resendCooldown}s</span>
                  ) : (
                    <button type="button" onClick={onSendOtp} disabled={loading}
                      className="underline hover:text-black disabled:opacity-50">
                      Resend OTP
                    </button>
                  )}
                  {" · "}
                  <button type="button" onClick={() => { setOtpSent(false); setOtp(""); setError(null); }}
                    className="underline hover:text-black">
                    Change email
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-neutral-200" />
          <span className="text-xs text-neutral-400">or</span>
          <div className="flex-1 h-px bg-neutral-200" />
        </div>

        <a
          href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google?next=${encodeURIComponent(nextPath)}`}
          className="mt-4 w-full flex items-center justify-center gap-3 border border-neutral-300 py-2.5 rounded-lg text-sm hover:border-black transition"
        >
          <GoogleIcon />
          Continue with Google
        </a>

        <div className="mt-4 text-xs text-center text-neutral-500">
          New to Lexxus? <Link href="/signup" className="underline text-black">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
