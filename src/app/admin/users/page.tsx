"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  isHost: boolean;
  isAdmin: boolean;
  isBanned: boolean;
  verified: boolean;
  createdAt: string;
  _count: { properties: number; bookings: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = (q = "") => {
    setLoading(true);
    fetch(`/api/admin/users?search=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => { setUsers(data); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const patch = async (id: string, data: Record<string, boolean>) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Users</h2>

      <div className="flex gap-3 mb-6">
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load(search)}
        />
        <button
          onClick={() => load(search)}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Roles</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Activity</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className={u.isBanned ? "bg-red-50" : ""}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{u.name}</div>
                    <div className="text-gray-500">{u.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {u.isAdmin && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">Admin</span>}
                      {u.isHost && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">Host</span>}
                      {u.verified && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Verified</span>}
                      {u.isBanned && <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">Banned</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {u._count.properties} props · {u._count.bookings} bookings
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => patch(u.id, { isBanned: !u.isBanned })}
                        className={`px-2 py-1 text-xs rounded ${u.isBanned ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"}`}
                      >
                        {u.isBanned ? "Unban" : "Ban"}
                      </button>
                      <button
                        onClick={() => patch(u.id, { isHost: !u.isHost })}
                        className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        {u.isHost ? "Revoke Host" : "Make Host"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="text-center text-gray-500 py-8">No users found.</p>}
        </div>
      )}
    </div>
  );
}
