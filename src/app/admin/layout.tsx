"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/properties", label: "Properties", icon: "🏠" },
  { href: "/admin/verifications", label: "Verifications", icon: "✅" },
  { href: "/admin/reviews", label: "Reviews", icon: "⭐" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="px-5 py-4 border-b border-gray-700">
          <Link href="/" className="text-sm text-gray-400 hover:text-white">← Back to site</Link>
          <h1 className="text-lg font-bold mt-1">Admin Panel</h1>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                  active ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <span>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
