import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data";

const filters = ["All", "Sofas", "Chairs", "Desks", "Decor", "Exterior", "Interior"];

const showcaseProjects = [
  {
    title: "The Milan Residence",
    category: "Interior Visualization",
    img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=85",
    tags: ["Villevenete", "Marble Studio"],
    size: "large",
  },
  {
    title: "Oslo Studio Loft",
    category: "Architectural Render",
    img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=85",
    tags: ["Arbore", "Polflex"],
    size: "small",
  },
  {
    title: "Kyoto Zen Garden",
    category: "Exterior Scene",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=85",
    tags: ["K_Design"],
    size: "small",
  },
  {
    title: "Neoclassical Bath Suite",
    category: "Interior Scene",
    img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=85",
    tags: ["Marble Studio"],
    size: "small",
  },
  {
    title: "Scandinavian Living",
    category: "Interior Visualization",
    img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=85",
    tags: ["Villevenete"],
    size: "small",
  },
];

export default function PortfolioPage() {
  return (
    <div className="bg-white">

      {/* Hero with image */}
      <section className="relative h-[75vh] min-h-[520px] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1800&q=90"
          alt="Portfolio"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8 pb-16 w-full">
          <span className="text-xs tracking-[0.4em] uppercase text-neutral-300">Lexxus Portfolio</span>
          <h1 className="text-6xl md:text-7xl font-bold text-white mt-4 leading-none tracking-tight max-w-3xl">
            Work That<br />Speaks for Itself
          </h1>
          <p className="text-neutral-300 mt-5 max-w-lg leading-relaxed">
            A curated selection of projects created using Lexxus assets — from residential interiors to large-scale architectural visualizations.
          </p>
        </div>
      </section>

      {/* Showcase — masonry-style grid */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-24">
        <div className="flex items-end justify-between mb-14">
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">Featured Projects</span>
            <h2 className="text-5xl font-bold mt-4">Selected Works</h2>
          </div>
          <p className="hidden md:block text-neutral-400 text-sm max-w-xs text-right leading-relaxed">
            Projects submitted by studios and independent designers using Lexxus assets.
          </p>
        </div>

        {/* Large + small grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Large featured */}
          <div className="group overflow-hidden border border-neutral-200 hover:shadow-2xl transition duration-500">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={showcaseProjects[0].img}
                alt={showcaseProjects[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
            </div>
            <div className="p-8">
              <span className="text-[10px] tracking-[0.35em] uppercase text-neutral-400">{showcaseProjects[0].category}</span>
              <h3 className="font-bold text-2xl mt-2">{showcaseProjects[0].title}</h3>
              <div className="flex gap-2 mt-4 flex-wrap">
                {showcaseProjects[0].tags.map((t) => (
                  <span key={t} className="text-[10px] border border-neutral-200 px-3 py-1 tracking-widest uppercase text-neutral-500">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* 2x2 small grid */}
          <div className="grid grid-cols-2 gap-6">
            {showcaseProjects.slice(1).map((p) => (
              <div key={p.title} className="group overflow-hidden border border-neutral-200 hover:shadow-xl transition duration-500">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                </div>
                <div className="p-5">
                  <span className="text-[9px] tracking-[0.3em] uppercase text-neutral-400">{p.category}</span>
                  <h3 className="font-semibold text-sm mt-1">{p.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider image */}
      <div className="h-[40vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=1800&q=85"
          alt="Design detail"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product grid */}
      <section className="bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-24">
          <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">Asset Library</span>
              <h2 className="text-5xl font-bold mt-4">All Products</h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {filters.map((f, i) => (
                <button
                  key={f}
                  className={`px-5 py-2 text-xs tracking-widest uppercase border transition ${
                    i === 0 ? "bg-black text-white border-black" : "border-neutral-300 text-neutral-500 hover:border-black hover:text-black"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
          <div className="text-center mt-14">
            <Link
              href="/c/models"
              className="inline-flex items-center gap-2 border border-black px-12 py-4 text-sm tracking-widest uppercase hover:bg-black hover:text-white transition"
            >
              View Full Catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* Submit CTA */}
      <section className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1800&q=85"
          alt="Submit your work"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8 py-28 text-white text-center">
          <span className="text-xs tracking-[0.4em] uppercase text-neutral-300">Collaborate</span>
          <h2 className="text-5xl font-bold mt-5">Submit Your Work</h2>
          <p className="text-neutral-300 mt-5 max-w-md mx-auto leading-relaxed">
            Are you a studio or independent artist using Lexxus assets? We'd love to feature your project.
          </p>
          <Link
            href="/feedback"
            className="mt-10 inline-flex items-center gap-2 border border-white px-10 py-4 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition"
          >
            Get in Touch
          </Link>
        </div>
      </section>

    </div>
  );
}
