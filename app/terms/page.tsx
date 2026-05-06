import Link from "next/link";

const sections = [
  {
    title: "Acceptance of Terms",
    content: [
      "By accessing or using Lexxus, you confirm that you are at least 18 years of age and have the legal capacity to enter into a binding agreement.",
      "If you are using Lexxus on behalf of a company or organization, you represent that you have authority to bind that entity to these terms.",
      "We reserve the right to update these terms at any time. Continued use of the platform after changes constitutes acceptance of the revised terms.",
    ],
  },
  {
    title: "Accounts",
    content: [
      "You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.",
      "You must provide accurate and complete information when creating an account.",
      "You may not share your account with others or create multiple accounts for the purpose of circumventing restrictions.",
      "We reserve the right to suspend or terminate accounts that violate these terms.",
    ],
  },
  {
    title: "Purchases & Payments",
    content: [
      "All digital products are delivered instantly upon successful payment confirmation.",
      "Prices are displayed in USD unless you have selected an alternative currency. Currency conversion rates are indicative only.",
      "All transactions are processed securely by Stripe. Lexxus does not store payment card information.",
      "Subscription fees are billed in advance on a monthly or annual basis depending on your selected plan.",
    ],
  },
  {
    title: "Refund Policy",
    content: [
      "Digital downloads are eligible for a full refund within 14 days if the file is technically broken or materially different from the product description.",
      "Refunds are not issued for change of mind, incompatibility with software not listed in the product specifications, or user error.",
      "To request a refund, contact support@lexxus.com with your order number and a description of the issue.",
      "Approved refunds are processed within 5–10 business days to the original payment method.",
    ],
  },
  {
    title: "Intellectual Property",
    content: [
      "All content on Lexxus — including product assets, imagery, text, and code — is owned by Lexxus or its content partners and is protected by copyright law.",
      "Purchasing an asset grants you a license to use it as described in the License Terms. It does not transfer ownership or copyright.",
      "You may not reproduce, distribute, or create derivative works from Lexxus platform content without explicit written permission.",
    ],
  },
  {
    title: "Prohibited Use",
    content: [
      "You may not use Lexxus for any unlawful purpose or in violation of any applicable laws or regulations.",
      "You may not resell, sublicense, or redistribute purchased digital assets outside the terms of the granted license.",
      "You may not attempt to reverse-engineer, scrape, or extract data from the Lexxus platform.",
      "You may not upload, post, or transmit any content that is harmful, offensive, or infringes on the rights of others.",
    ],
  },
  {
    title: "Limitation of Liability",
    content: [
      "Lexxus provides the platform and digital products 'as is' without warranties of any kind, express or implied.",
      "To the maximum extent permitted by law, Lexxus shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.",
      "Our total liability to you for any claim shall not exceed the amount you paid to Lexxus in the 12 months preceding the claim.",
    ],
  },
  {
    title: "Governing Law",
    content: [
      "These terms are governed by the laws of the State of New York, United States, without regard to conflict of law principles.",
      "Any disputes arising from these terms shall be resolved through binding arbitration in New York, NY.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="bg-white">

      {/* Hero with image */}
      <section className="relative h-[55vh] min-h-[400px] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1800&q=90"
          alt="Terms of Service"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8 pb-16 w-full">
          <span className="text-xs tracking-[0.4em] uppercase text-neutral-300">Legal</span>
          <h1 className="text-6xl md:text-7xl font-bold text-white mt-4 leading-none tracking-tight">
            Terms of Service
          </h1>
          <p className="text-neutral-300 mt-5 max-w-lg leading-relaxed">
            Last updated: April 2026. Please read these terms carefully before using Lexxus.
          </p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-20 grid md:grid-cols-[240px_1fr] gap-20">

        {/* Sticky TOC */}
        <aside className="hidden md:block">
          <div className="sticky top-28">
            <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-6">Contents</p>
            <nav className="space-y-1">
              {sections.map((s) => (
                <a
                  key={s.title}
                  href={`#${s.title.replace(/\s+/g, "-")}`}
                  className="block text-sm text-neutral-500 hover:text-black py-1.5 border-l-2 border-transparent hover:border-black pl-4 transition"
                >
                  {s.title}
                </a>
              ))}
            </nav>
            <div className="mt-10 pt-8 border-t border-neutral-200">
              <p className="text-xs text-neutral-400 leading-relaxed">Questions about these terms?</p>
              <Link href="/feedback" className="mt-2 inline-block text-xs tracking-widest uppercase border-b border-black pb-0.5 hover:opacity-60 transition">
                Contact Us →
              </Link>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="space-y-14">
          <div className="bg-neutral-50 border border-neutral-200 p-8">
            <p className="text-sm text-neutral-600 leading-relaxed">
              These Terms of Service ("Terms") govern your access to and use of the Lexxus platform operated by Lexxus LLC. By creating an account or making a purchase, you agree to be bound by these Terms.
            </p>
          </div>

          {sections.map((s) => (
            <div key={s.title} id={s.title.replace(/\s+/g, "-")}>
              <h2 className="text-2xl font-bold mb-2">{s.title}</h2>
              <div className="w-8 h-px bg-black mb-6" />
              <ul className="space-y-3">
                {s.content.map((c, i) => (
                  <li key={i} className="flex gap-4 text-sm text-neutral-600 leading-relaxed">
                    <span className="text-neutral-300 shrink-0 mt-0.5">—</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="bg-neutral-950 text-white p-10">
            <h3 className="text-xl font-bold">Questions About These Terms?</h3>
            <p className="text-neutral-400 mt-3 leading-relaxed text-sm">
              Contact our legal team at{" "}
              <a href="mailto:legal@lexxus.com" className="text-white underline">legal@lexxus.com</a>{" "}
              or write to: Lexxus LLC, 340 Pine Street, New York, NY 10001.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
