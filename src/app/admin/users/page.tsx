"use client";

import { useEffect, useState } from "react";
import {
  BanIcon,
  CheckIcon,
  RefreshIcon,
  SearchIcon,
  ShieldIcon,
  UsersIcon,
} from "../_icons";

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
  const [syncing, setSyncing] = useState(false);

  const load = (q = "") => {
    setLoading(true);
    fetch(`/api/admin/users?search=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const syncUsers = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/sync-users", { method: "POST" });
      const result = await res.json();
      if (res.ok) {
        load(search);
      }
    } finally {
      setSyncing(false);
    }
  };

  const patch = async (id: string, data: Record<string, boolean>) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...updated } : u)),
      );
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <UsersIcon className="w-6 h-6 text-primary-500" />
        <h2 className="text-2xl font-bold text-gray-900">Users</h2>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative w-72">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            className="w-full bg-white/50 backdrop-blur-lg border border-white/30 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-400/50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
            placeholder="Search by name or email..."
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
        <button
          type="button"
          onClick={syncUsers}
          disabled={syncing}
          className="px-4 py-2 bg-white/60 backdrop-blur-lg border border-white/30 text-gray-700 text-sm rounded-lg hover:bg-white/80 transition-all duration-200 disabled:opacity-50 inline-flex items-center gap-2"
        >
          <RefreshIcon
            className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`}
          />
          {syncing ? "Syncing..." : "Sync Users"}
        </button>
      </div>

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
      ) : (
        <div className="bg-white/50 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/20 bg-white/30 backdrop-blur-md">
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                  User
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Roles
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Activity
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {users.map((u) => (
                <tr
                  key={u.id}
                  className={`transition-colors duration-150 ${u.isBanned ? "bg-red-50/40" : "hover:bg-white/30"}`}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{u.name}</div>
                    <div className="text-gray-500 text-xs mt-0.5">
                      {u.email}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {u.isAdmin && (
                        <span className="px-2 py-0.5 bg-purple-100/70 backdrop-blur-sm text-purple-700 rounded text-xs font-medium">
                          Admin
                        </span>
                      )}
                      {u.isHost && (
                        <span className="px-2 py-0.5 bg-blue-100/70 backdrop-blur-sm text-blue-700 rounded text-xs font-medium">
                          Host
                        </span>
                      )}
                      {u.verified && (
                        <span className="px-2 py-0.5 bg-green-100/70 backdrop-blur-sm text-green-700 rounded text-xs font-medium">
                          Verified
                        </span>
                      )}
                      {u.isBanned && (
                        <span className="px-2 py-0.5 bg-red-100/70 backdrop-blur-sm text-red-700 rounded text-xs font-medium">
                          Banned
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {u._count.properties} properties &#183; {u._count.bookings}{" "}
                    bookings
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => patch(u.id, { isBanned: !u.isBanned })}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg transition-all duration-200 ${
                          u.isBanned
                            ? "bg-green-50/70 backdrop-blur-sm text-green-700 hover:bg-green-100/80 border border-green-200/30"
                            : "bg-red-50/70 backdrop-blur-sm text-red-700 hover:bg-red-100/80 border border-red-200/30"
                        }`}
                      >
                        {u.isBanned ? (
                          <CheckIcon className="w-3 h-3" />
                        ) : (
                          <BanIcon className="w-3 h-3" />
                        )}
                        {u.isBanned ? "Unban" : "Ban"}
                      </button>
                      <button
                        type="button"
                        onClick={() => patch(u.id, { isHost: !u.isHost })}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-blue-50/70 backdrop-blur-sm text-blue-700 hover:bg-blue-100/80 border border-blue-200/30 transition-all duration-200"
                      >
                        {u.isHost ? "Revoke Host" : "Make Host"}
                      </button>
                      <button
                        type="button"
                        onClick={() => patch(u.id, { isAdmin: !u.isAdmin })}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-purple-50/70 backdrop-blur-sm text-purple-700 hover:bg-purple-100/80 border border-purple-200/30 transition-all duration-200"
                      >
                        <ShieldIcon className="w-3 h-3" />
                        {u.isAdmin ? "Revoke Admin" : "Make Admin"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <UsersIcon className="w-12 h-12 mb-3 opacity-40" />
              <p className="text-sm">No users found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
