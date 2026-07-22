"use client";

import { useEffect, useState } from "react";
import { FlagIcon, PropertiesIcon, SearchIcon, TrashIcon } from "../_icons";

interface Property {
  id: string;
  title: string;
  city: string;
  country: string;
  propertyType: string;
  price: number;
  featured: boolean;
  createdAt: string;
  host: { id: string; name: string; email: string };
  _count: { reviews: number; bookings: number };
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = (q = "") => {
    setLoading(true);
    fetch(`/api/admin/properties?search=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => {
        setProperties(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const toggleFeatured = async (id: string, featured: boolean) => {
    const res = await fetch(`/api/admin/properties/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured }),
    });
    if (res.ok) {
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured } : p)),
      );
    }
  };

  const deleteProperty = async (id: string) => {
    if (!confirm("Delete this property? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/properties/${id}`, {
      method: "DELETE",
    });
    if (res.ok) setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <PropertiesIcon className="w-6 h-6 text-primary-500" />
        <h2 className="text-2xl font-bold text-gray-900">Properties</h2>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative w-72">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            className="w-full bg-white/50 backdrop-blur-lg border border-white/30 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-400/50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
            placeholder="Search by title or city..."
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
                  Property
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Host
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Stats
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {properties.map((p) => (
                <tr
                  key={p.id}
                  className="transition-colors duration-150 hover:bg-white/30"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{p.title}</div>
                    <div className="text-gray-500 text-xs mt-0.5">
                      {p.city}, {p.country} &#183; {p.propertyType}
                    </div>
                    <div className="text-gray-400 text-xs mt-0.5">
                      KSH {p.price.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-900 text-sm">{p.host.name}</div>
                    <div className="text-gray-500 text-xs mt-0.5">
                      {p.host.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {p._count.reviews} reviews &#183; {p._count.bookings}{" "}
                    bookings
                    {p.featured && (
                      <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100/70 backdrop-blur-sm text-amber-700 rounded text-xs font-medium">
                        <FlagIcon className="w-3 h-3" />
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(p.id, !p.featured)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg transition-all duration-200 ${
                          p.featured
                            ? "bg-gray-50/70 backdrop-blur-sm text-gray-600 hover:bg-gray-100/80 border border-gray-200/30"
                            : "bg-amber-50/70 backdrop-blur-sm text-amber-700 hover:bg-amber-100/80 border border-amber-200/30"
                        }`}
                      >
                        <FlagIcon className="w-3 h-3" />
                        {p.featured ? "Unfeature" : "Feature"}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProperty(p.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-red-50/70 backdrop-blur-sm text-red-700 hover:bg-red-100/80 border border-red-200/30 transition-all duration-200"
                      >
                        <TrashIcon className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {properties.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <PropertiesIcon className="w-12 h-12 mb-3 opacity-40" />
              <p className="text-sm">No properties found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
