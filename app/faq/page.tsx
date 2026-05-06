"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, Minus } from "lucide-react";

const faqGroups = [
  {
    group: "Purchasing & Downloads",
    items: [
      { q: "How do I download my purchased files?", a: "After a successful purchase you'll land on the confirmation page with an immediate ZIP download link. You can also re-download any asset from My Account → Downloads at any time within your active subscription period." },
      { q: "Which file formats are included?", a: "Most 3D models include .max (3ds Max), .fbx, .obj, and SketchUp formats. Scenes include full PBR texture sets. Specific formats are listed on each product page before purchase." },
      { q: "Can I preview a file before buying?", a: "Yes — every product page includes a 360° turntable preview, multiple render angles, and a technical spec sheet including polygon count, texture resolution, and included formats." },
      { q: "Are there free assets available?", a: "Yes. We offer a rotating selection of free assets each month. Free assets require a registered account but no payment method." },
    ],
  },
  {
    group: "Licensing",
    items: [
      { q: "What license do I receive with my purchase?", a: "Pro plan subscribers receive a Standard Commercial License covering unlimited personal and commercial renders. Studio plan subscribers receive an Extended Commercial License covering resale of rendered images and client deliverables." },
      { q: "Can I use assets in client projects?", a: "Yes, under both Standard and Extended licenses. The Extended license additionally covers use in products for resale (e.g., printed materials, stock imagery)." },
      { q: "Can I share or redistribute the raw files?", a: "No. Redistribution, resale, or sharing of the original asset files is strictly prohibited under all license tiers." },
    ],
  },
  {
    group: "Billing & Refunds",
    items: [
      { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, American Express, PayPal, and UPI. All transactions are processed securely via Stripe." },
      { q: "Can I get a refund?", a: "Digital downloads are eligible for a full refund within 14 days if the file is technically broken or materially different from the product description. Refunds are not issued for change of mind on digital goods." },
      { q: "How does the subscription work?", a: "Subscriptions are billed monthly or annually. You can cancel at any time from Account → Settings. Cancellation takes effect at the end of the current billing period." },
    ],
  },
  {
    group: "Technical Support",
    items: [
      { q: "What software do I need to open the files?", a: "3ds Max 2020+ for .max files. Any DCC application (Blender, Cinema 4D, Maya) for .fbx and .obj. SketchUp 2019+ for .skp files." },
      { q: "Are textures included?", a: "Yes. All models include PBR texture sets (Albedo, Normal, Roughness, Metallic, AO) at a minimum of 2K resolution. Many premium assets include 4K and 8K variants." },
      { q: "Do you offer technical support?", a: "Yes. Pro and Studio subscribers have access to our technical support team via email with a 24-hour response SLA. Free users can access our community forum." },
    ],
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-neutral-200 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left gap-6"
      >
        <span className="font-medium">{q}</span>
        <span className="shrink-0 w-6 h-6 border border-neutral-300 flex items-center justify-center">
          {open ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
        </span>
      </button>
      {open && (
        <p className="text-sm text-neutral-500 leading-relaxed pb-6 max-w-2xl">{a}</p>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="bg-white">

      {/* Hero with image */}
      <section className="relative h-[60vh] min-h-[440px] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&q=90"
          alt="FAQ"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8 pb-16 w-full">
          <span className="text-xs tracking-[0.4em] uppercase text-neutral-300">Support</span>
          <h1 className="text-6xl md:text-7xl font-bold text-white mt-4 leading-none tracking-tight">
            Frequently<br />Asked Questions
          </h1>
          <p className="text-neutral-300 mt-5 max-w-lg leading-relaxed">
            Everything you need to know about purchasing, licensing, billing, and technical support.
          </p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-20 grid md:grid-cols-[260px_1fr] gap-20">

        {/* Sticky sidebar */}
        <aside className="hidden md:block">
          <div className="sticky top-28 space-y-1">
            <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-6">Jump to</p>
            {faqGroups.map((g) => (
              <a
                key={g.group}
                href={`#${g.group.replace(/\s+/g, "-")}`}
                className="block text-sm text-neutral-500 hover:text-black py-2 border-l-2 border-transparent hover:border-black pl-4 transition"
              >
                {g.group}
              </a>
            ))}
            <div className="pt-8 border-t border-neutral-200 mt-8">
              <p className="text-xs text-neutral-400 leading-relaxed">Can't find your answer?</p>
              <Link href="/feedback" className="mt-3 inline-block text-xs tracking-widest uppercase border-b border-black pb-0.5 hover:opacity-60 transition">
                Contact Support →
              </Link>
            </div>
          </div>
        </aside>

        {/* FAQ content */}
        <div className="space-y-16">
          {faqGroups.map((g) => (
            <div key={g.group} id={g.group.replace(/\s+/g, "-")}>
              <h2 className="text-2xl font-bold mb-2">{g.group}</h2>
              <div className="w-8 h-px bg-black mb-8" />
              <div>
                {g.items.map((item) => (
                  <AccordionItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}

          {/* Still need help */}
          <div className="relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=85"
              alt="Support"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-neutral-950/90" />
            <div className="relative p-12 text-white">
              <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">Still need help?</span>
              <h3 className="text-3xl font-bold mt-4">Talk to our team</h3>
              <p className="text-neutral-400 mt-3 leading-relaxed max-w-md">
                Our support team is available Monday–Friday, 9am–6pm EST. We typically respond within a few hours.
              </p>
              <Link
                href="/feedback"
                className="mt-8 inline-flex items-center gap-2 border border-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
