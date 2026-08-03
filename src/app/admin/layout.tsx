"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeftIcon,
  DashboardIcon,
  PropertiesIcon,
  ReviewsIcon,
  UsersIcon,
  VerificationsIcon,
} from "./_icons";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: DashboardIcon },
  { href: "/admin/users", label: "Users", icon: UsersIcon },
  { href: "/admin/properties", label: "Properties", icon: PropertiesIcon },
  {
    href: "/admin/verifications",
    label: "Identity Verifications",
    icon: VerificationsIcon,
  },
  {
    href: "/admin/verifications/properties",
    label: "Property Verifications",
    icon: VerificationsIcon,
  },
  { href: "/admin/reviews", label: "Reviews", icon: ReviewsIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <style>{`footer { display: none !important; }`}</style>
      <div
        className="flex min-h-screen"
        style={{
          background:
            "linear-gradient(180deg, #ffffff 0%, #ffffff 85%, #fef3c7 100%)",
        }}
      >
        <aside className="w-56 bg-white/50 backdrop-blur-2xl border-r border-white/30 flex flex-col shrink-0 shadow-[0_0_30px_-10px_rgba(0,0,0,0.08)]">
          <div className="px-5 py-4 border-b border-white/20">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronLeftIcon className="w-3 h-3" />
              Back to site
            </Link>
            <h1 className="text-lg font-bold text-gray-900 mt-1">
              Admin Panel
            </h1>
          </div>
          <nav className="flex-1 py-4 space-y-0.5 px-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200 ${
                    active
                      ? "bg-white/70 backdrop-blur-xl shadow-sm border border-white/40 text-primary-600 font-medium"
                      : "text-gray-500 hover:bg-white/40 hover:backdrop-blur-lg hover:text-gray-700 border border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </>
  );
}
