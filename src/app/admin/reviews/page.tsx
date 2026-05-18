"use client";

import { useEffect, useState } from "react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
  property: { id: string; title: string };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = (q = "") => {
    setLoading(true);
    fetch(`/api/admin/reviews?search=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => { setReviews(data); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews Moderation</h2>

      <div className="flex gap-3 mb-6">
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search review content…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load(search)}
        />
        <button onClick={() => load(search)} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
          Search
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-yellow-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                  <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-800 mb-2">{r.comment}</p>
                <p className="text-xs text-gray-500">
                  By <span className="font-medium">{r.user.name}</span> on{" "}
                  <span className="font-medium">{r.property.title}</span>
                </p>
              </div>
              <button
                onClick={() => deleteReview(r.id)}
                className="shrink-0 px-3 py-1.5 bg-red-100 text-red-700 text-xs rounded-lg hover:bg-red-200 self-start"
              >
                Delete
              </button>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-center text-gray-500 py-8">No reviews found.</p>}
        </div>
      )}
    </div>
  );
}
