"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type CategoryCard = {
  name: string;
  count: string;
  img: string;
  href: string;
};

export default function CategoryCarousel({ cards }: { cards: CategoryCard[] }) {
  if (cards.length <= 4) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <CategoryCard key={c.name} card={c} />
        ))}
      </div>
    );
  }

  // Duplicate for seamless infinite loop. translateX(-50%) scrolls exactly one set.
  const doubled = [...cards, ...cards];
  const duration = cards.length * 5; // 5s per card

  return (
    <div className="overflow-hidden cat-outer">
      <style>{`
        @keyframes cat-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .cat-strip {
          animation: cat-scroll ${duration}s linear infinite;
        }
        .cat-outer:hover .cat-strip {
          animation-play-state: paused;
        }
      `}</style>
      <div className="cat-strip flex gap-4">
        {doubled.map((c, i) => (
          <div key={i} className="flex-shrink-0 w-[calc(50vw-16px)] sm:w-72 md:w-80 lg:w-[338px]">
            <CategoryCard card={c} />
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryCard({ card }: { card: CategoryCard }) {
  return (
    <Link href={card.href} className="group relative overflow-hidden aspect-[3/4] block">
      <img
        src={card.img}
        alt={card.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="text-[10px] tracking-[0.3em] uppercase text-neutral-300">{card.count}</div>
        <div className="text-white font-bold text-xl mt-1">{card.name}</div>
        <div className="flex items-center gap-2 mt-3 text-xs text-white/70 group-hover:text-white transition">
          Shop Now <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </Link>
  );
}
