"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";
import Logo from "@/components/Logo";
import { apiPost, apiError } from "@/lib/api";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sm text-neutral-400">Loading…</div>}>
      <ResetPasswordInner />
    </Suspense>
  );
}

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!token) {
      setError("Missing reset token. Please use the link from your email.");
      return;
    }
    if (newPassword !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      await apiPost("/auth/reset-password", { token, newPassword });
      toast.success("Password updated — sign in with your new password");
      router.push("/login");
    } catch (err) {
      const msg = apiError(err, "Reset failed");
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
        <h1 className="text-2xl font-semibold text-center">Choose a new password</h1>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="text-xs text-neutral-600">New password</span>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-black"
            />
          </label>
          <label className="block">
            <span className="text-xs text-neutral-600">Confirm new password</span>
            <input
              type="password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-black"
            />
          </label>
          {error && <div className="text-xs text-rose-600">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-lg text-sm tracking-widest uppercase disabled:opacity-50"
          >
            {loading ? "Saving…" : "Update password"}
          </button>
          <div className="text-xs text-center text-neutral-500">
            <Link href="/login" className="underline">Back to sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
