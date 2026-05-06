/**
 * Server-side fetch helper for Next.js Server Components.
 *
 * We use `fetch` (not axios) so Next can cache/revalidate it.
 *
 *   const products = await serverGet<Paginated<ApiProduct>>('/products', { tag: 'products' });
 */

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';

type Opts = {
  /** Seconds before Next revalidates this cache entry. */
  revalidate?: number;
  /** Next's fetch cache tag — call `revalidateTag(tag)` to bust. */
  tag?: string;
  /** Disable caching for this request. */
  noCache?: boolean;
};

export async function serverGet<T>(path: string, opts: Opts = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_URL}${path}`;
  const next: Record<string, unknown> = {};
  if (opts.revalidate !== undefined) next.revalidate = opts.revalidate;
  if (opts.tag) next.tags = [opts.tag];

  const init: RequestInit & { next?: typeof next } = {
    next,
    headers: { accept: 'application/json' },
  };
  if (opts.noCache) {
    init.cache = 'no-store';
  }

  const res = await fetch(url, init);
  if (!res.ok) {
    if (res.status === 404) {
      const err = new Error('Not found');
      (err as Error & { status?: number }).status = 404;
      throw err;
    }
    const body = await res.text().catch(() => '');
    throw new Error(`GET ${path} → ${res.status}: ${body.slice(0, 160)}`);
  }
  return res.json() as Promise<T>;
}

/** Like serverGet, but returns null on 404 rather than throwing. */
export async function serverGetOrNull<T>(path: string, opts: Opts = {}): Promise<T | null> {
  try {
    return await serverGet<T>(path, opts);
  } catch (err) {
    const e = err as Error & { status?: number };
    if (e.status === 404) return null;
    throw err;
  }
}
