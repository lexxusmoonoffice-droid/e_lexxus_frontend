"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  img: string;
  title?: string;
  sub?: string;
  href?: string;
}

const CATEGORY_SLIDES: Record<string, Slide[]> = {
  models: [
    {
      img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&q=90",
      title: "Premium 3D Models Collection",
      sub: "Production-ready furniture, lighting, and decor assets."
    },
    {
      img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1800&q=90",
      title: "Obsessive Detail & Fidelity",
      sub: "Hand-crafted assets with high resolution maps."
    },
    {
      img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1800&q=90",
      title: "V-Ray & Corona Compatibility",
      sub: "Pre-configured shaders and materials for instant rendering."
    }
  ],
  scenes: [
    {
      img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1800&q=90",
      title: "Complete 3D Scenes",
      sub: "Fully staged interior and exterior visualizer templates."
    },
    {
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=90",
      title: "Staged Lighting & Camera Setups",
      sub: "Learn industry lighting styles directly from original staging."
    }
  ],
  default: [
    {
      img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&q=90",
      title: "Exclusive Design Resources",
      sub: "Explore global assets curated for architects and designers."
    },
    {
      img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1800&q=90",
      title: "Daily VIP Updates",
      sub: "Get access to thousands of free and premium models."
    }
  ]
};

export default function CategoryBannerSlider({
  slug,
  categoryName,
  initialBanners,
}: {
  slug: string;
  categoryName: string;
  initialBanners?: Slide[];
}) {
  const slides = (initialBanners && initialBanners.length > 0)
    ? initialBanners
    : (CATEGORY_SLIDES[slug] || CATEGORY_SLIDES.default);

  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length]);

  const prevSlide = () => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrent((c) => (c + 1) % slides.length);
  };

  return (
    <div className="relative h-48 md:h-64 w-full bg-neutral-900 overflow-hidden group select-none">
      {/* Slides */}
      {slides.map((slide, i) => {
        const content = (
          <>
            <img src={slide.img} alt="" className="w-full h-full object-cover brightness-[0.7]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20 max-w-xl text-white">
              <span className="text-[10px] font-bold tracking-widest uppercase text-brand-accent mb-2 block">
                {categoryName}
              </span>
              {slide.title && (
                <h1 className="text-xl md:text-3xl font-extrabold tracking-tight drop-shadow-sm mb-1.5">
                  {slide.title}
                </h1>
              )}
              {slide.sub && (
                <p className="text-xs text-neutral-300 drop-shadow-sm max-w-md hidden md:block">
                  {slide.sub}
                </p>
              )}
            </div>
          </>
        );

        if (slide.href) {
          return (
            <Link
              key={i}
              href={slide.href}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out block ${
                i === current ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {content}
            </Link>
          );
        }

        return (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {content}
          </div>
        );
      })}

      {/* Nav Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Indicator dots */}
      <div className="absolute bottom-4 right-6 md:right-10 z-20 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "bg-brand-accent w-4" : "bg-white/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
