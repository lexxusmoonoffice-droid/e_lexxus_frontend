"use client";

import { useEffect } from "react";
import { initSentry } from "@/lib/sentry";

/**
 * Runs once on the client. `initSentry()` is a no-op unless
 * NEXT_PUBLIC_SENTRY_DSN is set and `@sentry/nextjs` is installed.
 */
export default function SentryInit() {
  useEffect(() => {
    void initSentry();
  }, []);
  return null;
}
