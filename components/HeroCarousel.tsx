"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useHeroSlides } from "@/lib/hooks";

const DURATION = 7000; // ms per slide

type Slide = {
  img: string;
  tag: string;
  index: string;
  title: [string, string];
  sub: string;
  cta: string;
  href: string;
  accent: string;
};

const FALLBACK_SLIDES: Slide[] = [
  {
    img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&q=95",
    tag: "Spring Collection — 2026",
    index: "01",
    title: ["Where Craft", "Meets Precision"],
    sub: "Premium 3D assets from the world's most respected furniture and design brands.",
    cta: "Explore Models",
    href: "/c/models",
    accent: "Villevenete · Polflex · Arbore",
  },
  {
    img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1800&q=95",
    tag: "Featured Brand — Villevenete",
    index: "02",
    title: ["Timeless Forms,", "Digital Fidelity"],
    sub: "Every curve, every stitch — reproduced with obsessive accuracy for your renders.",
    cta: "Shop Sofas",
    href: "/c/models",
    accent: "Sofas · Seating · Upholstery",
  },
];

export default function HeroCarousel() {
  const { data } = useHeroSlides();
  const live = data?.data;
  const slides: Slide[] =
    live && live.length > 0
      ? live.map((s, i) => ({
          img: s.img,
          tag: s.tag || "",
          index: String(i + 1).padStart(2, "0"),
          title: (s.title || ["", ""]) as [string, string],
          sub: s.sub || "",
          cta: s.cta || "Explore",
          href: s.href || "/",
          accent: s.accent || "",
        }))
      : FALLBACK_SLIDES;

  return <HeroCarouselInner slides={slides} />;
}

function HeroCarouselInner({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [key, setKey] = useState(0); // forces re-mount for animation reset
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  const goTo = useCallback((idx: number) => {
    const next = (idx + slides.length) % slides.length;
    setPrev(current);
    setCurrent(next);
    setKey((k) => k + 1);
    setProgress(0);
    startRef.current = performance.now();
  }, [current]);

  // Progress bar via rAF
  useEffect(() => {
    startRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      setProgress(Math.min((elapsed / DURATION) * 100, 100));
      if (elapsed < DURATION) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [key]);

  // Auto-advance
  useEffect(() => {
    timerRef.current = setTimeout(() => goTo(current + 1), DURATION);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [key]);

  const s = slides[current];

  return (
    <section className="relative overflow-hidden bg-neutral-950 select-none" style={{ height: "calc(100vh - 120px)", minHeight: "500px", maxHeight: "860px" }}>

      {/* ── Background images ── */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          {/* Ken-Burns only on active slide — re-keyed so it restarts */}
          {i === current && (
            <img
              key={key}
              src={slide.img}
              alt=""
              className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
              style={{ animationDuration: `${DURATION + 1000}ms` }}
            />
          )}
          {i !== current && (
            <img src={slide.img} alt="" className="absolute inset-0 w-full h-full object-cover scale-105" />
          )}
        </div>
      ))}

      {/* ── Gradient overlays ── */}
      <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

      {/* ── Decorative vertical line ── */}
      <div className="absolute left-[calc(50%-1px)] top-0 bottom-0 z-20 w-px bg-white/5 hidden lg:block pointer-events-none" />

      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 z-30 max-w-[1400px] mx-auto px-4 lg:px-8 pt-8 flex items-center justify-between">
        <span
          key={`tag-${key}`}
          className="text-[10px] tracking-[0.4em] uppercase text-neutral-300 animate-fade-in opacity-0"
          style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
        >
          {s.tag}
        </span>
        <div className="flex items-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="group flex items-center gap-2"
              aria-label={`Go to slide ${i + 1}`}
            >
              <span className={`text-[10px] tracking-widest transition-colors ${i === current ? "text-white" : "text-white/30 group-hover:text-white/60"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`block h-px transition-all duration-500 ${i === current ? "w-8 bg-white" : "w-3 bg-white/30 group-hover:bg-white/60"}`} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="absolute inset-0 z-30 max-w-[1400px] mx-auto px-4 lg:px-8 flex flex-col justify-end pb-24">

        {/* Accent tag */}
        <div
          key={`accent-${key}`}
          className="flex items-center gap-3 mb-6 animate-slide-in-left opacity-0"
          style={{ animationDelay: "0.05s", animationFillMode: "forwards" }}
        >
          <span className="block w-0 h-px bg-white/50 animate-line-grow" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }} />
          <span className="text-[10px] tracking-[0.35em] uppercase text-white/50">{s.accent}</span>
        </div>

        {/* Headline — each line staggers */}
        <div className="overflow-hidden">
          {s.title.map((line, i) => (
            <div key={`${key}-line-${i}`} className="overflow-hidden">
              <h1
                className="text-[clamp(3rem,8vw,7rem)] font-bold text-white leading-none tracking-tight animate-fade-up opacity-0"
                style={{ animationDelay: `${0.15 + i * 0.12}s`, animationFillMode: "forwards" }}
              >
                {line}
              </h1>
            </div>
          ))}
        </div>

        {/* Sub + CTA row */}
        <div className="mt-8 flex flex-col md:flex-row md:items-end gap-8 md:gap-16">
          <p
            key={`sub-${key}`}
            className="text-neutral-300 max-w-sm leading-relaxed animate-fade-up opacity-0"
            style={{ animationDelay: "0.42s", animationFillMode: "forwards" }}
          >
            {s.sub}
          </p>
          <div
            key={`cta-${key}`}
            className="flex items-center gap-5 animate-fade-up opacity-0"
            style={{ animationDelay: "0.54s", animationFillMode: "forwards" }}
          >
            <Link
              href={s.href}
              className="group inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-neutral-100 transition-colors"
            >
              {s.cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors"
            >
              View Pricing <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex items-center gap-8">

          {/* Progress bar */}
          <div className="flex-1 max-w-xs h-px bg-white/15 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-white transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Slide counter */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-white text-sm font-semibold tracking-widest">{s.index}</span>
            <span className="text-white/30 text-xs">/</span>
            <span className="text-white/30 text-xs tracking-widest">{String(slides.length).padStart(2, "0")}</span>
          </div>

          {/* Prev / Next */}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => goTo(current - 1)}
              className="w-11 h-11 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition group"
              aria-label="Previous slide"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => goTo(current + 1)}
              className="w-11 h-11 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition group"
              aria-label="Next slide"
            >
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Right-side thumbnail strip (desktop) ── */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col gap-3">
        {slides.map((slide, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`relative overflow-hidden transition-all duration-500 ${
              i === current ? "w-20 h-16 opacity-100 ring-1 ring-white" : "w-16 h-12 opacity-40 hover:opacity-70"
            }`}
          >
            <img src={slide.img} alt="" className="w-full h-full object-cover" />
            {i === current && (
              <div className="absolute inset-0 bg-white/10" />
            )}
          </button>
        ))}
      </div>

    </section>
  );
}
