"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { apiPost, apiError } from "@/lib/api";

type State = { kind: "verifying" } | { kind: "ok" } | { kind: "fail"; message: string };

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sm text-neutral-400">Loading…</div>}>
      <VerifyEmailInner />
    </Suspense>
  );
}

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [state, setState] = useState<State>({ kind: "verifying" });

  useEffect(() => {
    let cancelled = false;
    async function go() {
      if (!token) {
        setState({ kind: "fail", message: "Missing verification token." });
        return;
      }
      try {
        await apiPost("/auth/verify-email", { token });
        if (!cancelled) setState({ kind: "ok" });
      } catch (err) {
        if (!cancelled) setState({ kind: "fail", message: apiError(err, "Verification failed") });
      }
    }
    go();
    return () => { cancelled = true; };
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border border-neutral-200 p-8 text-center">
        <div className="flex justify-center mb-6"><Logo /></div>
        {state.kind === "verifying" && (
          <>
            <h1 className="text-2xl font-semibold">Verifying…</h1>
            <p className="text-sm text-neutral-500 mt-3">
              Just a moment while we check your link.
            </p>
          </>
        )}
        {state.kind === "ok" && (
          <>
            <h1 className="text-2xl font-semibold">Email verified 🎉</h1>
            <p className="text-sm text-neutral-500 mt-3">
              Your account is ready. You can now sign in and start downloading.
            </p>
            <Link
              href="/login"
              className="inline-block mt-6 bg-black text-white px-8 py-2.5 rounded-lg text-sm tracking-widest uppercase"
            >
              Sign in
            </Link>
          </>
        )}
        {state.kind === "fail" && (
          <>
            <h1 className="text-2xl font-semibold">Verification failed</h1>
            <p className="text-sm text-rose-600 mt-3">{state.message}</p>
            <Link
              href="/login"
              className="inline-block mt-6 border border-neutral-300 px-6 py-2 text-sm hover:border-black"
            >
              Back to sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
