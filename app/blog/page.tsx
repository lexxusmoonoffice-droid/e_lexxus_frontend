import Link from "next/link";
import { serverGet } from "@/lib/fetcher";
import type { ApiBlogPost, Paginated } from "@/lib/types";

export const revalidate = 60;
export const metadata = {
  title: "Journal — Lexxus",
  description: "Stories, craft and inspiration from the Lexxus team.",
};

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}

export default async function BlogPage() {
  const res = await serverGet<Paginated<ApiBlogPost>>("/blog?limit=48", { tag: "blog" }).catch(
    () => ({ data: [], page: 1, limit: 48, total: 0, pages: 0 }) as Paginated<ApiBlogPost>,
  );
  const posts = res.data;
  const [featured, ...rest] = posts;

  return (
    <div className="bg-white">
      <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1800&q=90"
          alt="Lexxus Journal"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8 pb-16 w-full">
          <span className="text-xs tracking-[0.4em] uppercase text-neutral-300">Lexxus Journal</span>
          <h1 className="text-6xl md:text-7xl font-bold text-white mt-4 leading-none tracking-tight max-w-3xl">
            Stories, Craft<br />&amp; Inspiration
          </h1>
          <p className="text-neutral-300 mt-5 max-w-lg leading-relaxed">
            Deep dives into the brands, artists, and ideas shaping the world of 3D design.
          </p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-20">
        {posts.length === 0 ? (
          <div className="text-center py-24 text-neutral-400">
            <p className="text-lg font-medium">No posts yet</p>
            <p className="text-sm mt-2">Our writers are brewing something good.</p>
          </div>
        ) : (
          <>
            {featured && (
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid md:grid-cols-2 gap-0 overflow-hidden mb-20 border border-neutral-200 hover:shadow-2xl transition duration-500"
              >
                <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                </div>
                <div className="p-12 flex flex-col justify-center bg-white">
                  <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-400">Featured Story</span>
                  <div className="w-8 h-px bg-black mt-4 mb-6" />
                  <h2 className="text-3xl font-bold leading-tight group-hover:opacity-70 transition">{featured.title}</h2>
                  <p className="text-neutral-500 mt-5 leading-relaxed">{featured.excerpt}</p>
                  <div className="flex items-center gap-6 mt-10">
                    <span className="text-xs text-neutral-400 tracking-wide">{formatDate(featured.publishedAt)}</span>
                    <span className="text-xs tracking-[0.25em] uppercase border-b border-black pb-0.5">Read Article →</span>
                  </div>
                </div>
              </Link>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {rest.map((b) => (
                <Link key={b.slug} href={`/blog/${b.slug}`} className="group">
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                  </div>
                  <div className="pt-6">
                    <span className="text-[10px] tracking-[0.35em] uppercase text-neutral-400">Lexxus Journal</span>
                    <h3 className="font-bold text-xl mt-3 leading-snug group-hover:opacity-60 transition">{b.title}</h3>
                    <p className="text-sm text-neutral-500 mt-3 line-clamp-2 leading-relaxed">{b.excerpt}</p>
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-100">
                      <span className="text-xs text-neutral-400">{formatDate(b.publishedAt)}</span>
                      <span className="text-xs tracking-[0.25em] uppercase border-b border-black pb-0.5">Read →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
