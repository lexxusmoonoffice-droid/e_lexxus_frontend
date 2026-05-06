import Link from "next/link";
import { Check, X } from "lucide-react";

const licenses = [
  {
    name: "Standard",
    price: "Included with Pro",
    badge: "Most Common",
    desc: "For individual designers and small studios using assets in client renders and personal projects.",
    allowed: [
      "Unlimited personal projects",
      "Commercial renders & visualizations",
      "Client deliverables (rendered images)",
      "Portfolio and promotional use",
      "Up to 500,000 impressions per project",
    ],
    notAllowed: [
      "Resale of raw asset files",
      "Use in products for resale (prints, merchandise)",
      "Broadcast or film production",
      "Sublicensing to third parties",
    ],
  },
  {
    name: "Extended",
    price: "Included with Studio",
    badge: "For Teams",
    desc: "For agencies, studios, and professionals who need maximum flexibility across all commercial applications.",
    allowed: [
      "Everything in Standard",
      "Unlimited commercial impressions",
      "Use in products for resale (prints, merchandise)",
      "Broadcast, film, and advertising production",
      "Multi-seat team usage",
      "White-label client deliverables",
    ],
    notAllowed: [
      "Resale of raw asset files",
      "Sublicensing to third parties",
    ],
  },
  {
    name: "Editorial",
    price: "Available on request",
    badge: "Press & Media",
    desc: "For journalists, publishers, and media organizations using assets in editorial contexts.",
    allowed: [
      "Editorial articles and blog posts",
      "News and press publications",
      "Educational materials",
      "Non-commercial research",
    ],
    notAllowed: [
      "Commercial advertising",
      "Products for resale",
      "Client deliverables",
      "Broadcast production",
    ],
  },
];

const faqs = [
  { q: "Can I use assets across multiple projects?", a: "Yes. All licenses grant unlimited project usage within the permitted use cases. There is no per-project fee." },
  { q: "What counts as a 'render'?", a: "A render is any still image or animation produced using the asset. Rendered outputs are yours to use commercially under the applicable license." },
  { q: "Can I modify the assets?", a: "Yes. You may modify, adapt, and combine assets for your projects. You may not resell or redistribute the modified source files." },
  { q: "Do licenses expire?", a: "No. Once purchased or included in your plan, licenses are perpetual. If your subscription lapses, you retain the license for assets downloaded during your active period." },
  { q: "What if I need a custom license?", a: "Contact our partnerships team at licensing@lexxus.com for custom arrangements including broadcast, film, or large-scale commercial use." },
];

export default function LicensePage() {
  return (
    <div className="bg-white">

      {/* Hero with image */}
      <section className="relative h-[60vh] min-h-[440px] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1800&q=90"
          alt="License Terms"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8 pb-16 w-full">
          <span className="text-xs tracking-[0.4em] uppercase text-neutral-300">Legal</span>
          <h1 className="text-6xl md:text-7xl font-bold text-white mt-4 leading-none tracking-tight">
            License Terms
          </h1>
          <p className="text-neutral-300 mt-5 max-w-lg leading-relaxed">
            Clear, simple licensing for every use case. Know exactly what you can do with every asset you download.
          </p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-24">

        {/* Intro */}
        <div className="max-w-3xl mb-20">
          <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">Overview</span>
          <h2 className="text-4xl font-bold mt-4 mb-6">Three Licenses. Total Clarity.</h2>
          <p className="text-neutral-600 leading-relaxed text-lg">
            Every asset on Lexxus is sold under one of three license tiers. Your license is determined by your subscription plan and is clearly indicated on each product page before purchase.
          </p>
        </div>

        {/* License cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {licenses.map((l, i) => (
            <div key={l.name} className={`border p-10 flex flex-col ${i === 1 ? "border-black bg-neutral-950 text-white" : "border-neutral-200"}`}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className={`text-[10px] tracking-[0.3em] uppercase ${i === 1 ? "text-neutral-400" : "text-neutral-400"}`}>{l.badge}</span>
                  <h3 className="text-3xl font-bold mt-1">{l.name}</h3>
                </div>
              </div>
              <p className={`text-sm leading-relaxed mb-2 ${i === 1 ? "text-neutral-400" : "text-neutral-500"}`}>{l.price}</p>
              <p className={`text-sm leading-relaxed mb-8 ${i === 1 ? "text-neutral-300" : "text-neutral-600"}`}>{l.desc}</p>

              <div className="space-y-3 mb-8">
                {l.allowed.map((a) => (
                  <div key={a} className="flex items-start gap-3 text-sm">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${i === 1 ? "text-emerald-400" : "text-emerald-600"}`} />
                    <span className={i === 1 ? "text-neutral-300" : "text-neutral-700"}>{a}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-neutral-700/30 mt-auto">
                {l.notAllowed.map((a) => (
                  <div key={a} className="flex items-start gap-3 text-sm">
                    <X className={`w-4 h-4 shrink-0 mt-0.5 ${i === 1 ? "text-neutral-500" : "text-neutral-400"}`} />
                    <span className={i === 1 ? "text-neutral-500" : "text-neutral-400"}>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison note */}
        <div className="bg-neutral-50 border border-neutral-200 p-10 mb-24">
          <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold">Not sure which license you need?</h3>
              <p className="text-neutral-600 mt-3 leading-relaxed">
                The Standard license covers the vast majority of design and visualization work. If you're producing content for broadcast, film, or large-scale advertising, you'll need the Extended license. When in doubt, contact us.
              </p>
            </div>
            <Link
              href="/pricing"
              className="whitespace-nowrap bg-black text-white px-10 py-4 text-sm tracking-widest uppercase hover:bg-neutral-800 transition"
            >
              View Plans
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl">
          <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">Common Questions</span>
          <h2 className="text-4xl font-bold mt-4 mb-12">License FAQ</h2>
          <div className="space-y-0">
            {faqs.map((f) => (
              <div key={f.q} className="border-t border-neutral-200 py-8">
                <h4 className="font-semibold mb-3">{f.q}</h4>
                <p className="text-sm text-neutral-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="relative overflow-hidden mt-24">
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=85"
            alt="License"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/75" />
          <div className="relative py-20 px-8 text-white text-center">
            <h3 className="text-4xl font-bold">Need a custom license?</h3>
            <p className="text-neutral-300 mt-4 max-w-md mx-auto leading-relaxed">
              For broadcast, film, or enterprise use cases, our team can arrange a custom licensing agreement.
            </p>
            <Link
              href="/feedback"
              className="mt-8 inline-flex items-center gap-2 border border-white px-10 py-4 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition"
            >
              Contact Licensing Team
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
