"use client";
import { useCurrency } from "@/lib/currency";

/**
 * Tiny client-component wrapper for displaying a price that respects
 * the user's selected currency. Use inside server components — they
 * can't call the `useCurrency` hook directly.
 *
 *   <Price inr={p.price} />
 *   <Price inr={p.price} freeLabel="Free" />
 */
export default function Price({
  inr,
  freeLabel,
  className,
}: {
  inr: number;
  freeLabel?: string;
  className?: string;
}) {
  const { format } = useCurrency();
  if (freeLabel && inr === 0) return <span className={className}>{freeLabel}</span>;
  return <span className={className}>{format(inr)}</span>;
}
