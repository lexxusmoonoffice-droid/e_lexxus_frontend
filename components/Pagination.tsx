import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseHref: string;
  currentParams: Record<string, any>;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseHref,
  currentParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getHref = (p: number) => {
    const params = new URLSearchParams();
    Object.entries(currentParams).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "" && key !== "page") {
        params.set(key, String(val));
      }
    });
    if (p > 1) {
      params.set("page", String(p));
    }
    const qs = params.toString();
    return qs ? `${baseHref}?${qs}` : baseHref;
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const leftLimit = currentPage - delta;
      const rightLimit = currentPage + delta;

      pages.push(1);

      if (leftLimit > 2) {
        pages.push("...");
      } else if (leftLimit === 2) {
        pages.push(2);
      }

      const start = Math.max(leftLimit > 2 ? leftLimit : 2, 2);
      const end = Math.min(rightLimit < totalPages - 1 ? rightLimit : totalPages - 1, totalPages - 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (rightLimit < totalPages - 1) {
        pages.push("...");
      } else if (rightLimit === totalPages - 1) {
        pages.push(totalPages - 1);
      }

      pages.push(totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-12 py-4 border-t border-neutral-100">
      {/* Previous button */}
      {currentPage > 1 ? (
        <Link
          href={getHref(currentPage - 1)}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-neutral-300 hover:bg-black hover:text-white hover:border-black transition text-neutral-600"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-neutral-200 text-neutral-300 cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" />
        </span>
      )}

      {/* Page numbers */}
      {pageNumbers.map((p, idx) => {
        if (p === "...") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="inline-flex items-center justify-center w-8 h-8 text-xs text-neutral-400 font-semibold"
            >
              ...
            </span>
          );
        }

        const pageNum = p as number;
        const active = pageNum === currentPage;

        return (
          <Link
            key={`page-${pageNum}`}
            href={getHref(pageNum)}
            className={`inline-flex items-center justify-center w-8 h-8 rounded-full border text-xs font-semibold transition ${
              active
                ? "bg-black text-white border-black"
                : "border-neutral-300 text-neutral-600 hover:bg-black hover:text-white hover:border-black"
            }`}
          >
            {pageNum}
          </Link>
        );
      })}

      {/* Next button */}
      {currentPage < totalPages ? (
        <Link
          href={getHref(currentPage + 1)}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-neutral-300 hover:bg-black hover:text-white hover:border-black transition text-neutral-600"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-neutral-200 text-neutral-300 cursor-not-allowed">
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}
