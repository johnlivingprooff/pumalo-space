"use client";

import { useEffect, useState } from "react";

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
      .then((data) => { setItems(data); setLoading(false); });
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Host Verifications</h2>
      <p className="text-sm text-gray-500 mb-6">Showing hosts with status: Under Review</p>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
          No pending verifications 🎉
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((v) => (
            <div key={v.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900">{v.user.name}</p>
                  <p className="text-sm text-gray-500">{v.user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">{v.docCount} document(s) uploaded · Submitted {new Date(v.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs shrink-0">Under Review</span>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <input
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Rejection reason (optional)"
                  value={reason[v.id] ?? ""}
                  onChange={(e) => setReason((r) => ({ ...r, [v.id]: e.target.value }))}
                />
                <button onClick={() => act(v.id, "approve")} className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                  Approve
                </button>
                <button onClick={() => act(v.id, "needs_resubmission")} className="px-3 py-1.5 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600">
                  Needs Resubmission
                </button>
                <button onClick={() => act(v.id, "reject")} className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
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
