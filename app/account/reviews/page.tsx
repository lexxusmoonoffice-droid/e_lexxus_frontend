"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { Star, Trash2, Edit } from "lucide-react";
import AccountShell from "@/components/AccountShell";
import {
  useMyReviews,
  useUpdateReview,
  useDeleteReview,
  apiError,
} from "@/lib/hooks";

export default function MyReviewsPage() {
  const { data, isLoading } = useMyReviews();
  const updateM = useUpdateReview();
  const deleteM = useDeleteReview();
  const [editingId, setEditingId] = useState<string | null>(null);

  const reviews = data?.data || [];

  async function onDelete(id: string) {
    if (!confirm("Delete this review? This can't be undone.")) return;
    try {
      await deleteM.mutateAsync(id);
      toast.success("Review deleted");
    } catch (err) {
      toast.error(apiError(err, "Couldn't delete"));
    }
  }

  return (
    <AccountShell title="My reviews">
      {isLoading ? (
        <div className="text-sm text-neutral-500">Loading…</div>
      ) : reviews.length === 0 ? (
        <div className="border border-neutral-200 p-10 text-center text-sm text-neutral-500">
          You haven&apos;t reviewed anything yet. After you purchase something, its page will let you leave a review.
        </div>
      ) : (
        <ul className="space-y-5">
          {reviews.map((r) => {
            const product = typeof r.product === "object" ? r.product : undefined;
            const editing = editingId === r.id;
            return (
              <li key={r.id} className="border border-neutral-200 p-5">
                <div className="flex items-start gap-4">
                  {product?.thumbnail ? (
                    <img src={product.thumbnail} alt="" className="w-20 h-20 object-cover rounded" />
                  ) : (
                    <div className="w-20 h-20 bg-neutral-100 rounded" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        {product ? (
                          <Link href={`/product/${product.slug}`} className="font-semibold hover:underline">
                            {product.title}
                          </Link>
                        ) : (
                          <span className="font-semibold text-neutral-400">Deleted product</span>
                        )}
                        <div className="text-xs text-neutral-500 mt-0.5">
                          Reviewed on {new Date(r.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {!editing && (
                        <div className="flex gap-3 text-xs">
                          <button onClick={() => setEditingId(r.id)} className="inline-flex items-center gap-1 underline">
                            <Edit className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => onDelete(r.id)}
                            className="inline-flex items-center gap-1 text-rose-600 underline disabled:opacity-50"
                            disabled={deleteM.isPending}
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {editing ? (
                      <EditForm
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
                      <>
                        <div className="mt-2 flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star
                              key={n}
                              className={`w-4 h-4 ${n <= r.rating ? "text-amber-400 fill-amber-400" : "text-neutral-300"}`}
                            />
                          ))}
                        </div>
                        {r.comment && (
                          <p className="text-sm text-neutral-700 mt-3 leading-relaxed">{r.comment}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </AccountShell>
  );
}

function EditForm({
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
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Your rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="p-0.5"
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
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
        placeholder="Update your review…"
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
            {busy ? "Saving…" : "Save changes"}
          </button>
          <button onClick={onCancel} className="border border-neutral-300 px-4 py-1.5 text-xs tracking-widest uppercase">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
