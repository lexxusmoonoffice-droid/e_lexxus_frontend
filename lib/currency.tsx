"use client";

/**
 * Currency system — ADR-0004.
 *
 * Prices in the DB are always stored in INR.
 * On mount we auto-detect the visitor's country via ipapi.co:
 *   • India  (IN) → INR  — charged in ₹
 *   • Anyone else → USD  — charged in $
 *
 * No manual selector is shown.  The detected value is persisted to
 * localStorage so subsequent page loads are instant (no flash).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* ── Supported currencies (INR + USD only) ───────────────────────────────── */

export const currencies = {
  INR: { symbol: "₹", rate: 1,     label: "Indian Rupee", decimals: 0 },
  USD: { symbol: "$", rate: 0.012, label: "US Dollar",    decimals: 2 },
} as const;

export type CurrencyCode = keyof typeof currencies;

const STORAGE_KEY = "lexxus.currency";
const DETECT_TTL  = 24 * 60 * 60 * 1000; // re-detect after 24 h

/* ── Pure formatter ──────────────────────────────────────────────────────── */

/**
 * Convert an INR amount to the target currency and format it.
 * INR → no decimals (₹1,299); USD → 2 decimals ($15.59).
 */
export function formatPrice(inr: number, code: CurrencyCode = "INR"): string {
  const c = currencies[code];
  const value = inr * c.rate;
  return `${c.symbol}${value.toLocaleString(undefined, {
    minimumFractionDigits: c.decimals,
    maximumFractionDigits: c.decimals,
  })}`;
}

/**
 * Returns the raw converted amount (not formatted) for use in API calls.
 */
export function convertAmount(inr: number, code: CurrencyCode): number {
  return inr * currencies[code].rate;
}

/* ── Context ─────────────────────────────────────────────────────────────── */

type CurrencyCtx = {
  code: CurrencyCode;
  /** true while the geo-detect fetch is in-flight (first visit only) */
  detecting: boolean;
  format: (inr: number) => string;
  /** Converts an INR amount to the active currency amount (for API calls) */
  convert: (inr: number) => number;
};

const Ctx = createContext<CurrencyCtx>({
  code: "INR",
  detecting: false,
  format:  (n) => formatPrice(n, "INR"),
  convert: (n) => n,
});

/* ── Provider ────────────────────────────────────────────────────────────── */

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [code,      setCode]      = useState<CurrencyCode>("INR");
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    // 1. If we already have a recently-detected value, use it.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { code: CurrencyCode; ts: number };
        if (parsed.code in currencies && Date.now() - parsed.ts < DETECT_TTL) {
          setCode(parsed.code);
          return; // skip geo-detect
        }
      }
    } catch { /* corrupt storage — fall through */ }

    // 2. Detect via ipapi.co (free, no key required, ~50k req/day).
    setDetecting(true);
    fetch("https://ipapi.co/country/", { cache: "no-store" })
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((country) => {
        const detected: CurrencyCode = country.trim() === "IN" ? "INR" : "USD";
        setCode(detected);
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ code: detected, ts: Date.now() }),
        );
      })
      .catch(() => {
        // Network error or blocked — default to INR (safe for the business).
        setCode("INR");
      })
      .finally(() => setDetecting(false));
  }, []);

  const value = useMemo<CurrencyCtx>(
    () => ({
      code,
      detecting,
      format:  (n) => formatPrice(n, code),
      convert: (n) => convertAmount(n, code),
    }),
    [code, detecting],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCurrency() {
  return useContext(Ctx);
}
