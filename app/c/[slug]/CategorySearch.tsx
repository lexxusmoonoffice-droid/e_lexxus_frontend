"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export default function CategorySearch({
  baseHref,
  selectedSub,
  initialQuery,
}: {
  baseHref: string;
  selectedSub: string;
  initialQuery: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (selectedSub) params.set("sub", selectedSub);
    const qs = params.toString();
    router.push(`${baseHref}${qs ? `?${qs}` : ""}`);
  }

  function clear() {
    setQuery("");
    const params = new URLSearchParams();
    if (selectedSub) params.set("sub", selectedSub);
    const qs = params.toString();
    router.push(`${baseHref}${qs ? `?${qs}` : ""}`);
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2 shrink-0">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search in this collection…"
          className="pl-9 pr-8 py-2 text-sm border border-neutral-300 rounded-lg w-64 outline-none focus:border-black transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="bg-black text-white px-4 py-2 text-xs font-medium rounded-lg hover:bg-neutral-800 transition-colors"
      >
        Search
      </button>
    </form>
  );
}
