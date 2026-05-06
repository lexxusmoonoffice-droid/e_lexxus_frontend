"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// Base currency = INR (backend stores prices in rupees per ADR-0004).
// Multiply an INR amount by `rate` to convert to the target currency.
export const currencies = {
  INR: { symbol: "₹", rate: 1, label: "Indian Rupee" },
  USD: { symbol: "$", rate: 0.012, label: "US Dollar" },
  EUR: { symbol: "€", rate: 0.011, label: "Euro" },
  GBP: { symbol: "£", rate: 0.0095, label: "British Pound" },
} as const;

export type CurrencyCode = keyof typeof currencies;

const STORAGE_KEY = "lexxus.currency";

/** Pure formatter — accepts the currency code explicitly. */
export function formatPrice(inr: number, code: CurrencyCode = "INR") {
  const c = currencies[code];
  const value = inr * c.rate;
  return `${c.symbol} ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

type CurrencyCtx = {
  code: CurrencyCode;
  setCode: (next: CurrencyCode) => void;
  format: (inr: number) => string;
};

const Ctx = createContext<CurrencyCtx>({
  code: "INR",
  setCode: () => {},
  format: (n) => formatPrice(n, "INR"),
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [code, setCodeState] = useState<CurrencyCode>("INR");

  // Hydrate from localStorage on mount (client-only).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && saved in currencies) setCodeState(saved as CurrencyCode);
    } catch {
      /* ignore — SSR or storage disabled */
    }
  }, []);

  const setCode = useCallback((next: CurrencyCode) => {
    setCodeState(next);
    try { window.localStorage.setItem(STORAGE_KEY, next); } catch { /* ignore */ }
  }, []);

  const value = useMemo<CurrencyCtx>(
    () => ({ code, setCode, format: (n) => formatPrice(n, code) }),
    [code, setCode],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCurrency() {
  return useContext(Ctx);
}
