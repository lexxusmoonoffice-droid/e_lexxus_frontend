"use client";

import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Product image gallery — main image with clickable thumbnails plus a
 * lightbox (click the main image to zoom, arrow keys to navigate).
 */
export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const safeImages = images.length > 0 ? images : ["/placeholder.svg"];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  // Reset the active slide if the product changes while this instance lives.
  useEffect(() => {
    if (active >= safeImages.length) setActive(0);
  }, [safeImages.length, active]);

  // Keyboard navigation when the lightbox is open.
  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(false);
      else if (e.key === "ArrowRight") setActive((i) => (i + 1) % safeImages.length);
      else if (e.key === "ArrowLeft") setActive((i) => (i - 1 + safeImages.length) % safeImages.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, safeImages.length]);

  return (
    <>
      <button
        type="button"
        onClick={() => setLightbox(true)}
        className="block w-full aspect-[4/3] bg-neutral-100 overflow-hidden cursor-zoom-in"
        aria-label="Open full-size image"
      >
        <img src={safeImages[active]} alt={alt} className="w-full h-full object-cover" />
      </button>

      {safeImages.length > 1 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {safeImages.slice(0, 8).map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-pressed={i === active}
              className={`w-16 h-16 shrink-0 bg-neutral-100 rounded-md overflow-hidden border-2 transition ${
                i === active ? "border-black" : "border-transparent hover:border-neutral-400"
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightbox(false); }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setActive((i) => (i - 1 + safeImages.length) % safeImages.length); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setActive((i) => (i + 1) % safeImages.length); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
          <img
            src={safeImages[active]}
            alt={alt}
            className="max-w-[90vw] max-h-[88vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {safeImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-xs tracking-widest">
              {active + 1} / {safeImages.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
