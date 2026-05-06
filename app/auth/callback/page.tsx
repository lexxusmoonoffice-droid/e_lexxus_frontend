"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { setTokens } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-sm text-neutral-400">Signing you in…</div>}>
      <CallbackInner />
    </Suspense>
  );
}

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { refresh } = useAuth();

  useEffect(() => {
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const next = params.get("next") || "/account";
    const error = params.get("error");

    if (error || !accessToken || !refreshToken) {
      router.replace(`/login?error=${encodeURIComponent(error || "google_error")}`);
      return;
    }

    setTokens({ accessToken, refreshToken });
    refresh().then(() => router.replace(next));
  }, [params, router, refresh]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-neutral-500">Signing you in…</p>
      </div>
    </div>
  );
}
