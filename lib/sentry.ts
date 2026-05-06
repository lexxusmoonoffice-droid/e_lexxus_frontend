/**
 * Sentry hook — documented stub.
 *
 * The SDK isn't installed by default to keep the dep tree lean.
 * When you're ready to ship:
 *
 *   npm install @sentry/nextjs
 *
 * Then replace the TODO block inside `initSentry()` with a real
 * `Sentry.init(...)` call, and swap `captureError` to delegate to
 * `Sentry.captureException`.
 *
 * Using `NEXT_PUBLIC_SENTRY_DSN` as the env var matches the backend
 * config so both processes share one DSN variable.
 */

let inited = false;

export async function initSentry(): Promise<void> {
  if (inited) return;
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;
  // TODO(sentry): install `@sentry/nextjs` then replace this block:
  //
  //   import * as Sentry from "@sentry/nextjs";
  //   Sentry.init({
  //     dsn,
  //     environment: process.env.NODE_ENV,
  //     tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  //   });
  //
  // eslint-disable-next-line no-console
  console.info("[sentry] DSN set but SDK not installed — skipping init");
  inited = true;
}

export async function captureError(
  _err: unknown,
  _extra?: Record<string, unknown>,
): Promise<void> {
  // Becomes `Sentry.captureException(err, { extra })` once the SDK is wired.
}
