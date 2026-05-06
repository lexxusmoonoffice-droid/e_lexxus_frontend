const heroStats = [
  { value: "284,520", label: "Total Downloads", change: "+18% this month" },
  { value: "1,284", label: "Premium Assets", change: "+42 this week" },
  { value: "42", label: "Partner Brands", change: "Across 14 countries" },
  { value: "612K", label: "Registered Users", change: "+2,400 this week" },
];

const topCategories = [
  { name: "Sofas & Seating", count: 312, pct: 85 },
  { name: "Lighting", count: 248, pct: 68 },
  { name: "Textures", count: 212, pct: 58 },
  { name: "Decor & Objects", count: 196, pct: 54 },
  { name: "Desks & Storage", count: 174, pct: 47 },
  { name: "Exterior Scenes", count: 142, pct: 39 },
];

const topCountries = [
  { country: "United States", pct: 28 },
  { country: "Germany", pct: 14 },
  { country: "United Kingdom", pct: 11 },
  { country: "France", pct: 9 },
  { country: "Netherlands", pct: 7 },
  { country: "Other", pct: 31 },
];

const monthlyDownloads = [
  { month: "Nov", val: 18400 },
  { month: "Dec", val: 22100 },
  { month: "Jan", val: 19800 },
  { month: "Feb", val: 24300 },
  { month: "Mar", val: 28900 },
  { month: "Apr", val: 31200 },
];

const highlights = [
  { value: "4.9 / 5", label: "Average product rating", sub: "Based on 8,400+ verified reviews" },
  { value: "< 2 min", label: "Average download time", sub: "Instant delivery on all plans" },
  { value: "99.98%", label: "Platform uptime", sub: "Last 12 months" },
  { value: "24 hrs", label: "Support response time", sub: "Pro & Studio subscribers" },
];

const maxVal = Math.max(...monthlyDownloads.map((m) => m.val));

export default function StatisticsPage() {
  return (
    <div className="bg-white">

      {/* Hero with image */}
      <section className="relative h-[65vh] min-h-[480px] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1800&q=90"
          alt="Platform statistics"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8 pb-16 w-full">
          <span className="text-xs tracking-[0.4em] uppercase text-neutral-300">Platform Insights</span>
          <h1 className="text-6xl md:text-7xl font-bold text-white mt-4 leading-none tracking-tight">
            Lexxus by<br />the Numbers
          </h1>
          <p className="text-neutral-300 mt-5 max-w-lg leading-relaxed">
            Transparent data on our platform's growth, usage, and community — updated monthly.
          </p>
        </div>
      </section>

      {/* Hero stats */}
      <section className="bg-neutral-950 text-white">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16 grid grid-cols-2 md:grid-cols-4">
          {heroStats.map((s, i) => (
            <div key={s.label} className={`p-8 ${i < 3 ? "md:border-r border-neutral-800" : ""}`}>
              <div className="text-5xl font-bold tracking-tight">{s.value}</div>
              <div className="text-xs text-neutral-400 mt-3 tracking-[0.25em] uppercase">{s.label}</div>
              <div className="text-xs text-emerald-400 mt-3 font-medium">{s.change}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-20 space-y-16">

        {/* Downloads chart */}
        <div className="border border-neutral-200 p-10">
          <div className="flex items-end justify-between mb-2 flex-wrap gap-4">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">Trend</span>
              <h2 className="text-3xl font-bold mt-2">Monthly Downloads</h2>
            </div>
            <span className="text-xs text-neutral-400 tracking-wide">Last 6 months</span>
          </div>
          <div className="flex items-end gap-4 mt-12 h-52">
            {monthlyDownloads.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-3">
                <span className="text-xs text-neutral-400">{(m.val / 1000).toFixed(1)}k</span>
                <div
                  className="w-full bg-neutral-950 hover:bg-neutral-700 transition"
                  style={{ height: `${(m.val / maxVal) * 180}px` }}
                />
                <span className="text-xs text-neutral-500 tracking-wide">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Top categories */}
          <div className="border border-neutral-200 p-10">
            <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">Breakdown</span>
            <h2 className="text-3xl font-bold mt-2 mb-10">Top Categories</h2>
            <div className="space-y-6">
              {topCategories.map((c) => (
                <div key={c.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-neutral-400">{c.count} assets</span>
                  </div>
                  <div className="h-1 bg-neutral-100 w-full">
                    <div className="h-full bg-neutral-950 transition-all duration-700" style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top countries */}
          <div className="border border-neutral-200 p-10">
            <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">Audience</span>
            <h2 className="text-3xl font-bold mt-2 mb-10">Top Countries</h2>
            <div className="space-y-6">
              {topCountries.map((c) => (
                <div key={c.country}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{c.country}</span>
                    <span className="text-neutral-400">{c.pct}%</span>
                  </div>
                  <div className="h-1 bg-neutral-100 w-full">
                    <div className="h-full bg-neutral-950 transition-all duration-700" style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-neutral-200">
          {highlights.map((h, i) => (
            <div key={h.label} className={`p-10 ${i < 3 ? "border-r border-neutral-200" : ""}`}>
              <div className="text-4xl font-bold tracking-tight">{h.value}</div>
              <div className="text-sm font-medium mt-4">{h.label}</div>
              <div className="text-xs text-neutral-400 mt-2 leading-relaxed">{h.sub}</div>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom image CTA */}
      <section className="relative overflow-hidden h-80">
        <img
          src="https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1800&q=85"
          alt="Lexxus collection"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative h-full flex items-center justify-center text-white text-center px-4">
          <div>
            <h3 className="text-4xl font-bold">Join a growing community</h3>
            <p className="text-neutral-300 mt-3">612,000+ designers already trust Lexxus.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
