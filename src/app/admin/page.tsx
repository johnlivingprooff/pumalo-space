"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HomeIcon, PersonIcon, ReviewsIcon, ShieldIcon } from "./_icons";

interface Stats {
  users: number;
  properties: number;
  pendingVerifications: number;
  reviews: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  const cards = [
    {
      label: "Total Users",
      value: stats?.users,
      href: "/admin/users",
      icon: PersonIcon,
      gradient: "from-primary-400/20 to-primary-500/10",
      iconColor: "text-primary-500",
    },
    {
      label: "Properties",
      value: stats?.properties,
      href: "/admin/properties",
      icon: HomeIcon,
      gradient: "from-emerald-400/20 to-emerald-500/10",
      iconColor: "text-emerald-500",
    },
    {
      label: "Pending Verifications",
      value: stats?.pendingVerifications,
      href: "/admin/verifications",
      icon: ShieldIcon,
      gradient: "from-amber-400/20 to-amber-500/10",
      iconColor: "text-amber-500",
    },
    {
      label: "Reviews",
      value: stats?.reviews,
      href: "/admin/reviews",
      icon: ReviewsIcon,
      gradient: "from-purple-400/20 to-purple-500/10",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(
          ({ label, value, href, icon: Icon, gradient, iconColor }, idx) => (
            <Link
              key={href}
              href={href}
              className={`animate-slideUp group bg-white/60 backdrop-blur-xl border border-white/30 rounded-xl p-5 hover:bg-white/75 hover:scale-[1.02] hover:shadow-xl transition-all duration-200 ease-out shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]`}
              style={{
                animationDelay: `${idx * 80}ms`,
                animationFillMode: "both",
              }}
            >
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 ${iconColor}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {value ?? <span className="text-gray-300">--</span>}
              </p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </Link>
          ),
        )}
      </div>
    </div>
  );
}
