"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import Logo from "@/components/Logo";
import { apiPost, apiError } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiPost("/auth/forgot-password", { email });
      setSubmitted(true);
    } catch (err) {
      toast.error(apiError(err, "Something went wrong"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border border-neutral-200 p-8">
        <div className="flex justify-center mb-6"><Logo /></div>
        <h1 className="text-2xl font-semibold text-center">Reset your password</h1>
        {submitted ? (
          <div className="mt-6 text-sm text-neutral-600 text-center space-y-3">
            <p>
              If an account exists for <strong>{email}</strong>, we&apos;ve sent a reset link.
              The link expires in 1 hour.
            </p>
            <p>
              <Link href="/login" className="underline">Back to sign in</Link>
            </p>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <label className="block">
              <span className="text-xs text-neutral-600">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-black"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2.5 rounded-lg text-sm tracking-widest uppercase disabled:opacity-50"
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>
            <div className="text-xs text-center text-neutral-500">
              <Link href="/login" className="underline">Back to sign in</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
