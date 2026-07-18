"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Star, Trash2, Edit } from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  useProductReviews,
  usePostReview,
  useUpdateReview,
  useDeleteReview,
  apiError,
} from "@/lib/hooks";

type Props = {
  productId: string;
  slug: string;
  /** Pre-rendered aggregate from the product detail (falls back to live). */
  initialAvg?: number;
  initialCount?: number;
};

export default function Reviews({ productId, slug, initialAvg, initialCount }: Props) {
  const { user } = useAuth();
  const { data, isLoading } = useProductReviews(slug);
  const post = usePostReview(productId);
  const updateM = useUpdateReview();
  const deleteM = useDeleteReview();
  const [editingId, setEditingId] = useState<string | null>(null);

  const reviews = data?.data || [];
  const aggregate = useMemo(() => {
    if (reviews.length === 0) {
      return {
        avg: typeof initialAvg === "number" ? initialAvg : 0,
        count: typeof initialCount === "number" ? initialCount : 0,
      };
    }
    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    return { avg: sum / reviews.length, count: reviews.length };
  }, [reviews, initialAvg, initialCount]);

    const userAlreadyReviewed = !!(user && reviews.find((r) => r.user?.id === user.id));

  if (!isLoading && reviews.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 border-t border-neutral-200 pt-10">
      <div className="flex items-baseline justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-semibold">Reviews</h2>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <StarRow value={aggregate.avg} />
          <span className="font-semibold text-neutral-800">{aggregate.avg.toFixed(1)}</span>
          <span>({aggregate.count} review{aggregate.count === 1 ? "" : "s"})</span>
        </div>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <p className="text-sm text-neutral-400">Loading reviews…</p>
        ) : (
          <ul className="space-y-6">
            {reviews.map((r) => {
              const isMine = !!(user && r.user?.id === user.id);
              const editing = editingId === r.id;
              return (
                <li key={r.id} className="border-b border-neutral-100 pb-6 last:border-b-0">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-semibold">
                      {(r.user?.name || "?").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {r.user?.name || "Anonymous"}
                        {isMine && <span className="ml-2 text-[10px] tracking-widest uppercase text-neutral-400">you</span>}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <StarRow value={r.rating} />
                        <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {isMine && !editing && (
                      <div className="flex gap-3 text-xs">
                        <button onClick={() => setEditingId(r.id)} className="inline-flex items-center gap-1 underline">
                          <Edit className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (!confirm("Delete your review?")) return;
                            try {
                              await deleteM.mutateAsync(r.id);
                              toast.success("Review deleted");
                            } catch (err) {
                              toast.error(apiError(err, "Couldn't delete"));
                            }
                          }}
                          disabled={deleteM.isPending}
                          className="inline-flex items-center gap-1 text-rose-600 underline disabled:opacity-50"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                  {editing ? (
                    <InlineEdit
                      initialRating={r.rating}
                      initialComment={r.comment || ""}
                      busy={updateM.isPending}
                      onCancel={() => setEditingId(null)}
                      onSave={async ({ rating, comment }) => {
                        try {
                          await updateM.mutateAsync({ id: r.id, body: { rating, comment } });
                          toast.success("Review updated");
                          setEditingId(null);
                        } catch (err) {
                          toast.error(apiError(err, "Save failed"));
                        }
                      }}
                    />
                  ) : (
                    r.comment && <p className="text-sm text-neutral-700 mt-3 leading-relaxed">{r.comment}</p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

function ReviewForm({ onSubmit, busy }: { onSubmit: (v: { rating: number; comment: string }) => Promise<void>; busy: boolean }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const commentError = comment.length > 2000 ? "Max 2000 characters" : null;
  const ratingError = rating === 0 ? "Pick a rating" : null;
  const hasErrors = !!ratingError || !!commentError;

  const shown = hoverRating || rating;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (hasErrors) return;
    await onSubmit({ rating, comment: comment.trim() });
    setRating(0);
    setComment("");
  }

  return (
    <form onSubmit={submit} className="mt-6 border border-neutral-200 p-5 rounded-lg">
      <div className="text-sm font-semibold mb-2">Write a review</div>
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Your rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            className="p-0.5 transition"
          >
            <Star
              className={`w-6 h-6 ${n <= shown ? "text-amber-400 fill-amber-400" : "text-neutral-300"}`}
            />
          </button>
        ))}
        <span className="text-xs text-neutral-500 ml-2">{rating > 0 ? `${rating} / 5` : "Pick a rating"}</span>
      </div>
      {ratingError && rating === 0 && comment && <p className="text-xs text-rose-600 mt-1">{ratingError}</p>}
      <textarea
        className={`input mt-3 min-h-[80px] ${commentError ? "border-rose-500" : ""}`}
        placeholder="Share your thoughts (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={2000}
      />
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-neutral-400">{comment.length}/2000 characters</p>
        {commentError && <p className="text-xs text-rose-600">{commentError}</p>}
      </div>
      <button
        type="submit"
        disabled={busy || hasErrors}
        className="mt-3 inline-flex items-center bg-black text-white px-5 py-2 text-xs tracking-widest uppercase disabled:opacity-50"
      >
        {busy ? "Posting…" : "Post review"}
      </button>
    </form>
  );
}

function InlineEdit({
  initialRating,
  initialComment,
  busy,
  onCancel,
  onSave,
}: {
  initialRating: number;
  initialComment: string;
  busy: boolean;
  onCancel: () => void;
  onSave: (v: { rating: number; comment: string }) => Promise<void>;
}) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(initialComment);
  const shown = hover || rating;
  const commentError = comment.length > 2000 ? "Max 2000 characters" : null;
  const ratingError = rating < 1 ? "Pick a rating" : null;
  const disabled = !!commentError || !!ratingError;
  return (
    <div className="mt-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            className="p-0.5"
          >
            <Star className={`w-5 h-5 ${n <= shown ? "text-amber-400 fill-amber-400" : "text-neutral-300"}`} />
          </button>
        ))}
        <span className="text-xs text-neutral-500 ml-2">{rating} / 5</span>
      </div>
      <textarea
        className={`input mt-3 min-h-[80px] ${commentError ? "border-rose-500" : ""}`}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={2000}
      />
      <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
        <p className="text-xs text-neutral-400">{comment.length}/2000</p>
        {commentError && <p className="text-xs text-rose-600">{commentError}</p>}
        <div className="flex gap-2">
          <button
            onClick={() => onSave({ rating, comment: comment.trim() })}
            disabled={busy || disabled}
            className="bg-black text-white px-4 py-1.5 text-xs tracking-widest uppercase disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save"}
          </button>
          <button onClick={onCancel} className="border border-neutral-300 px-4 py-1.5 text-xs tracking-widest uppercase">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function StarRow({ value }: { value: number }) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <span className="inline-flex" aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = rounded >= n;
        const half = !filled && rounded >= n - 0.5;
        return (
          <span key={n} className="relative inline-block w-4 h-4">
            <Star className="absolute inset-0 w-4 h-4 text-neutral-300" />
            {(filled || half) && (
              <Star
                className="absolute inset-0 w-4 h-4 text-amber-400 fill-amber-400"
                style={half ? { clipPath: "inset(0 50% 0 0)" } : undefined}
              />
            )}
          </span>
        );
      })}
    </span>
  );
}
