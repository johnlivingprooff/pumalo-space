"use client";

import { useEffect, useState } from "react";
import {
  CheckIcon,
  RefreshIcon,
  ShieldIcon,
  VerificationsIcon,
  XIcon,
} from "../_icons";

interface Verification {
  id: string;
  verificationStatus: string;
  createdAt: string;
  docCount: number;
  user: { id: string; name: string; email: string; avatar: string | null };
}

export default function AdminVerificationsPage() {
  const [items, setItems] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/admin/verifications")
      .then((r) => r.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  const act = async (id: string, action: string) => {
    const res = await fetch(`/api/admin/verifications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reason: reason[id] }),
    });
    if (res.ok) setItems((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <VerificationsIcon className="w-6 h-6 text-primary-500" />
        <h2 className="text-2xl font-bold text-gray-900">Host Verifications</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Showing hosts with status: Under Review
      </p>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/40 backdrop-blur-lg border border-white/20 rounded-xl p-5 animate-pulse"
            >
              <div className="h-4 bg-gray-200/60 rounded w-48 mb-2" />
              <div className="h-3 bg-gray-200/40 rounded w-64" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white/40 backdrop-blur-xl border border-white/20 rounded-xl text-gray-400">
          <ShieldIcon className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-sm">No pending verifications.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((v) => (
            <div
              key={v.id}
              className="bg-white/50 backdrop-blur-xl border border-white/30 rounded-xl p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900">{v.user.name}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{v.user.email}</p>
                  <p className="text-xs text-gray-400 mt-1.5">
                    {v.docCount} document(s) uploaded &#183; Submitted{" "}
                    {new Date(v.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50/70 backdrop-blur-sm text-amber-700 rounded-lg text-xs font-medium border border-amber-200/30 shrink-0">
                  <RefreshIcon className="w-3 h-3" />
                  Under Review
                </span>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <input
                  className="flex-1 bg-white/50 backdrop-blur-lg border border-white/30 rounded-lg px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-400/50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                  placeholder="Rejection reason (optional)"
                  value={reason[v.id] ?? ""}
                  onChange={(e) =>
                    setReason((r) => ({ ...r, [v.id]: e.target.value }))
                  }
                />
                <button
                  type="button"
                  onClick={() => act(v.id, "approve")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/80 backdrop-blur-lg text-white text-sm rounded-lg hover:bg-emerald-500/90 transition-all duration-200"
                >
                  <CheckIcon className="w-4 h-4" />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => act(v.id, "needs_resubmission")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/80 backdrop-blur-lg text-white text-sm rounded-lg hover:bg-amber-500/90 transition-all duration-200"
                >
                  <RefreshIcon className="w-4 h-4" />
                  Needs Resubmission
                </button>
                <button
                  type="button"
                  onClick={() => act(v.id, "reject")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/80 backdrop-blur-lg text-white text-sm rounded-lg hover:bg-red-500/90 transition-all duration-200"
                >
                  <XIcon className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
