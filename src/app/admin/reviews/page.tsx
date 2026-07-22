"use client";

import { useEffect, useState } from "react";
import {
  ReviewsIcon,
  SearchIcon,
  StarIcon,
  StarOutlineIcon,
  TrashIcon,
} from "../_icons";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
  property: { id: string; title: string };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span
      className="inline-flex gap-0.5 text-amber-400"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {rating >= 1 ? (
        <StarIcon className="w-3.5 h-3.5" />
      ) : (
        <StarOutlineIcon className="w-3.5 h-3.5 text-amber-200" />
      )}
      {rating >= 2 ? (
        <StarIcon className="w-3.5 h-3.5" />
      ) : (
        <StarOutlineIcon className="w-3.5 h-3.5 text-amber-200" />
      )}
      {rating >= 3 ? (
        <StarIcon className="w-3.5 h-3.5" />
      ) : (
        <StarOutlineIcon className="w-3.5 h-3.5 text-amber-200" />
      )}
      {rating >= 4 ? (
        <StarIcon className="w-3.5 h-3.5" />
      ) : (
        <StarOutlineIcon className="w-3.5 h-3.5 text-amber-200" />
      )}
      {rating >= 5 ? (
        <StarIcon className="w-3.5 h-3.5" />
      ) : (
        <StarOutlineIcon className="w-3.5 h-3.5 text-amber-200" />
      )}
    </span>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = (q = "") => {
    setLoading(true);
    fetch(`/api/admin/reviews?search=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const deleteReview = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    const res = await fetch("/api/admin/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <ReviewsIcon className="w-6 h-6 text-primary-500" />
        <h2 className="text-2xl font-bold text-gray-900">Reviews Moderation</h2>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative w-72">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            className="w-full bg-white/50 backdrop-blur-lg border border-white/30 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-400/50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
            placeholder="Search review content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load(search)}
          />
        </div>
        <button
          type="button"
          onClick={() => load(search)}
          className="px-4 py-2 bg-primary-500/80 backdrop-blur-lg text-white text-sm rounded-lg hover:bg-primary-500/90 transition-all duration-200"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/40 backdrop-blur-lg border border-white/20 rounded-xl p-5 animate-pulse"
            >
              <div className="h-4 bg-gray-200/60 rounded w-32 mb-2" />
              <div className="h-3 bg-gray-200/40 rounded w-full mb-1" />
              <div className="h-3 bg-gray-200/40 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <ReviewsIcon className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-sm">No reviews found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="group bg-white/50 backdrop-blur-xl border border-white/30 rounded-xl p-5 hover:bg-white/65 transition-all duration-200 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]"
            >
              <div className="flex gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <StarRating rating={r.rating} />
                    <span className="text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                    {r.comment}
                  </p>
                  <p className="text-xs text-gray-400">
                    By{" "}
                    <span className="font-medium text-gray-500">
                      {r.user.name}
                    </span>{" "}
                    on{" "}
                    <span className="font-medium text-gray-500">
                      {r.property.title}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteReview(r.id)}
                  className="shrink-0 self-start inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-red-50/70 backdrop-blur-sm text-red-700 hover:bg-red-100/80 border border-red-200/30 transition-all duration-200 opacity-70 group-hover:opacity-100"
                >
                  <TrashIcon className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
