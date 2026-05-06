import Link from "next/link";

const sections = [
  {
    title: "Information We Collect",
    content: [
      "Account registration details including name, email address, and password (stored as a secure hash).",
      "Order history, download records, and subscription status.",
      "Payment information — processed exclusively by Stripe. Lexxus never stores raw card data.",
      "Usage analytics including pages visited, search queries, and feature interactions, collected in aggregate and anonymized form.",
      "Device and browser information for security and fraud prevention purposes.",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "To fulfill purchases, deliver digital downloads, and manage your account.",
      "To send transactional emails such as order confirmations, download links, and billing receipts.",
      "To communicate important updates about your account, subscription, or changes to our policies.",
      "To improve the platform through aggregate analytics — we never sell individual user data.",
      "To detect and prevent fraudulent activity and unauthorized access.",
    ],
  },
  {
    title: "Data Sharing",
    content: [
      "We do not sell, rent, or trade your personal information to third parties.",
      "We share data only with trusted service providers (Stripe for payments, Vercel for hosting) under strict data processing agreements.",
      "We may disclose information if required by law or to protect the rights and safety of Lexxus and its users.",
    ],
  },
  {
    title: "Cookies & Tracking",
    content: [
      "We use essential cookies to maintain your session and authentication state.",
      "Analytics cookies (opt-out available) help us understand how users interact with the platform.",
      "We do not use advertising or cross-site tracking cookies.",
    ],
  },
  {
    title: "Data Retention",
    content: [
      "Account data is retained for as long as your account is active.",
      "Order and download records are retained for 7 years for legal and tax compliance.",
      "You may request deletion of your account and associated data at any time.",
    ],
  },
  {
    title: "Your Rights",
    content: [
      "Access: Request a copy of all personal data we hold about you.",
      "Correction: Request correction of inaccurate or incomplete data.",
      "Deletion: Request deletion of your account and personal data.",
      "Portability: Request an export of your data in a machine-readable format.",
      "To exercise any of these rights, contact us at privacy@lexxus.com.",
    ],
  },
  {
    title: "Security",
    content: [
      "All data is transmitted over HTTPS with TLS 1.3 encryption.",
      "Passwords are hashed using bcrypt with a minimum cost factor of 12.",
      "We conduct regular security audits and penetration testing.",
      "In the event of a data breach, affected users will be notified within 72 hours.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-white">

      {/* Hero with image */}
      <section className="relative h-[55vh] min-h-[400px] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1800&q=90"
          alt="Privacy Policy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8 pb-16 w-full">
          <span className="text-xs tracking-[0.4em] uppercase text-neutral-300">Legal</span>
          <h1 className="text-6xl md:text-7xl font-bold text-white mt-4 leading-none tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-neutral-300 mt-5 max-w-lg leading-relaxed">
            Last updated: April 2026. We are committed to protecting your privacy and being transparent about how we handle your data.
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
              <p className="text-xs text-neutral-400 leading-relaxed">Questions about your data?</p>
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
              This Privacy Policy describes how Lexxus LLC ("Lexxus", "we", "us") collects, uses, and protects information about you when you use our platform at lexxus.com. By using Lexxus, you agree to the practices described in this policy.
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
            <h3 className="text-xl font-bold">Contact Our Privacy Team</h3>
            <p className="text-neutral-400 mt-3 leading-relaxed text-sm">
              For any privacy-related requests or questions, contact us at{" "}
              <a href="mailto:privacy@lexxus.com" className="text-white underline">privacy@lexxus.com</a>{" "}
              or write to: Lexxus LLC, 340 Pine Street, New York, NY 10001.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
