import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { serverGetOrNull } from "@/lib/fetcher";
import type { ApiBlogPost } from "@/lib/types";

export const revalidate = 300;

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}

async function fetchPost(slug: string) {
  return serverGetOrNull<{ post: ApiBlogPost }>(`/blog/${encodeURIComponent(slug)}`, { tag: "blog" });
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
): Promise<Metadata> {
  const res = await fetchPost(params.slug);
  if (!res) return { title: "Article not found — Lexxus" };
  return {
    title: `${res.post.title} | Lexxus Journal`,
    description: res.post.excerpt?.slice(0, 160),
    openGraph: {
      title: res.post.title,
      description: res.post.excerpt?.slice(0, 160),
      images: res.post.image ? [{ url: res.post.image }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const res = await fetchPost(params.slug);
  if (!res) return notFound();
  const post = res.post;

  return (
    <article className="max-w-[800px] mx-auto px-4 py-12">
      <div className="text-xs font-bold tracking-wider text-neutral-500">LEXXUS JOURNAL</div>
      <h1 className="text-4xl font-semibold mt-3">{post.title}</h1>
      <div className="text-sm text-neutral-500 mt-3">
        {post.authorName || "Lexxus Team"} · {formatDate(post.publishedAt)}
      </div>
      {post.image && (
        <div className="aspect-[16/9] bg-neutral-100 mt-8 overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="prose mt-10 text-neutral-700 leading-relaxed">
        {post.excerpt && <p className="text-lg text-neutral-500">{post.excerpt}</p>}
        {post.content ? (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        ) : (
          <p>Full article coming soon.</p>
        )}
      </div>
    </article>
  );
}
