import Link from "next/link";

const stats = [
  { value: "1,284+", label: "Premium Assets" },
  { value: "42", label: "Partner Brands" },
  { value: "78", label: "Countries Served" },
  { value: "612K+", label: "Downloads" },
];

const values = [
  {
    title: "Uncompromising Quality",
    desc: "Every asset is reviewed by our editorial team before it reaches the marketplace. We accept only production-ready files that meet our strict technical and aesthetic standards.",
  },
  {
    title: "Creator First",
    desc: "We believe the people behind the work deserve fair recognition and fair revenue. Our creator revenue split is among the highest in the industry.",
  },
  {
    title: "Design Intelligence",
    desc: "We build tools that understand the design workflow — from concept to render — so you spend less time searching and more time creating.",
  },
];

const team = [
  { name: "Aleksander Voss", role: "Founder & CEO", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80" },
  { name: "Mara Fontaine", role: "Head of Curation", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80" },
  { name: "Jin Park", role: "Lead Engineer", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80" },
  { name: "Sofia Reyes", role: "Creative Director", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80" },
];

const milestones = [
  { year: "2022", event: "Lexxus concept born from a frustration with low-quality 3D marketplaces." },
  { year: "2023", event: "Private beta launched with 12 founding brands and 200 curated assets." },
  { year: "2024", event: "Public launch. 10,000 users in the first 30 days." },
  { year: "2025", event: "Expanded to textures, scenes, and sets. Crossed 500K downloads." },
  { year: "2026", event: "Lexxus Studio plan launched for professional teams and agencies." },
];

const partners = [
  "Villevenete", "Polflex", "Arbore", "Wall Deco", "Marble Studio", "K_Design",
];

export default function AboutPage() {
  return (
    <div className="bg-white">

      {/* Hero with full-bleed image */}
      <section className="relative h-[92vh] min-h-[600px] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&q=90"
          alt="Lexxus studio"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8 pb-20 w-full">
          <span className="text-xs tracking-[0.4em] uppercase text-neutral-300">Est. 2022 — New York</span>
          <h1 className="text-6xl md:text-8xl font-bold text-white mt-4 leading-none tracking-tight max-w-3xl">
            The Standard<br />for Premium<br />3D Assets
          </h1>
          <p className="text-neutral-300 mt-6 text-lg max-w-xl leading-relaxed">
            Where the world's finest brands and most talented 3D artists meet the designers who bring spaces to life.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-neutral-950 text-white">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label} className="border-l border-neutral-700 pl-8 first:border-0 first:pl-0 md:first:border-l md:first:pl-8">
              <div className="text-5xl font-bold tracking-tight">{s.value}</div>
              <div className="text-xs text-neutral-400 mt-3 tracking-[0.25em] uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission split */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-28 grid md:grid-cols-2 gap-20 items-center">
        <div>
          <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">Our Mission</span>
          <h2 className="text-5xl font-bold mt-5 leading-tight">We exist to raise the bar.</h2>
          <div className="w-12 h-px bg-black mt-6 mb-8" />
          <p className="text-neutral-600 leading-relaxed text-lg">
            The 3D asset industry has long been plagued by inconsistency — files that don't open, textures that don't tile, models that look nothing like their previews. Lexxus was built as the antidote.
          </p>
          <p className="text-neutral-600 mt-5 leading-relaxed">
            Every product on our platform is tested, reviewed, and approved by our editorial team before it ever reaches a customer. We partner directly with the world's leading furniture, lighting, and decor brands to deliver assets that are not just beautiful — but accurate, licensed, and production-ready.
          </p>
          <Link href="/c/models" className="mt-10 inline-flex items-center gap-3 text-sm tracking-widest uppercase border-b border-black pb-1 hover:opacity-60 transition">
            Explore the Collection →
          </Link>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=85"
            alt="Design studio"
            className="w-full aspect-[4/5] object-cover"
          />
          <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-neutral-950 hidden md:flex items-center justify-center p-6">
            <p className="text-white text-xs leading-relaxed text-center tracking-wide">"Design is not just what it looks like. Design is how it works."</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-neutral-950 text-white py-28">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-[1fr_2fr] gap-16 items-start">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">Philosophy</span>
              <h2 className="text-5xl font-bold mt-5 leading-tight">What We<br />Stand For</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              {values.map((v, i) => (
                <div key={v.title} className="border-t border-neutral-700 pt-8">
                  <span className="text-xs text-neutral-500 tracking-widest">0{i + 1}</span>
                  <h3 className="text-xl font-semibold mt-4 mb-4">{v.title}</h3>
                  <p className="text-neutral-400 leading-relaxed text-sm">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Full-bleed image break */}
      <div className="h-[50vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1800&q=85"
          alt="Premium sofa"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Team */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-28">
        <div className="flex items-end justify-between mb-16">
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">The People</span>
            <h2 className="text-5xl font-bold mt-4">Meet the Team</h2>
          </div>
          <p className="hidden md:block text-neutral-500 max-w-xs text-sm leading-relaxed text-right">
            A small, focused team of designers, engineers, and curators obsessed with quality.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {team.map((t) => (
            <div key={t.name} className="group">
              <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition duration-700"
                />
              </div>
              <div className="mt-5">
                <div className="font-semibold tracking-wide">{t.name}</div>
                <div className="text-xs text-neutral-400 mt-1 tracking-widest uppercase">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="border-t border-b border-neutral-200 py-16">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 text-center mb-10">Trusted Partner Brands</p>
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-6">
            {partners.map((p) => (
              <span key={p} className="text-xl font-bold tracking-widest text-neutral-300 hover:text-black transition cursor-default uppercase">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-28">
        <div className="grid md:grid-cols-[1fr_2fr] gap-16">
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">Our Journey</span>
            <h2 className="text-5xl font-bold mt-5 leading-tight">Five Years<br />of Growth</h2>
          </div>
          <div>
            {milestones.map((m) => (
              <div key={m.year} className="flex gap-10 items-start border-t border-neutral-200 py-8 group">
                <div className="text-3xl font-bold text-neutral-200 group-hover:text-black transition w-20 shrink-0">{m.year}</div>
                <p className="text-neutral-600 leading-relaxed pt-1">{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1800&q=85"
          alt="Luxury interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8 py-32 text-white text-center">
          <span className="text-xs tracking-[0.4em] uppercase text-neutral-300">Join Lexxus</span>
          <h2 className="text-5xl md:text-6xl font-bold mt-5 max-w-2xl mx-auto leading-tight">Ready to elevate your work?</h2>
          <p className="text-neutral-300 mt-6 max-w-lg mx-auto leading-relaxed">
            Join thousands of designers and studios who trust Lexxus for their most important projects.
          </p>
          <div className="flex gap-4 justify-center mt-12 flex-wrap">
            <Link href="/models" className="bg-white text-black px-10 py-4 text-sm tracking-widest uppercase hover:bg-neutral-200 transition">
              Browse Assets
            </Link>
            <Link href="/pricing" className="border border-white px-10 py-4 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
