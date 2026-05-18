"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  users: number;
  properties: number;
  pendingVerifications: number;
  reviews: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
  }, []);

  const cards = [
    { label: "Total Users", value: stats?.users, href: "/admin/users", color: "bg-blue-500" },
    { label: "Properties", value: stats?.properties, href: "/admin/properties", color: "bg-green-500" },
    { label: "Pending Verifications", value: stats?.pendingVerifications, href: "/admin/verifications", color: "bg-yellow-500" },
    { label: "Reviews", value: stats?.reviews, href: "/admin/reviews", color: "bg-purple-500" },
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, href, color }) => (
          <Link key={href} href={href} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${color} rounded-lg mb-3`} />
            <p className="text-2xl font-bold text-gray-900">{value ?? "—"}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
