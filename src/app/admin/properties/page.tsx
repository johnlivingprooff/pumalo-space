"use client";

import { useEffect, useState } from "react";

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
      .then((data) => { setProperties(data); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const toggleFeatured = async (id: string, featured: boolean) => {
    const res = await fetch(`/api/admin/properties/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured }),
    });
    if (res.ok) {
      setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, featured } : p)));
    }
  };

  const deleteProperty = async (id: string) => {
    if (!confirm("Delete this property? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
    if (res.ok) setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Properties</h2>

      <div className="flex gap-3 mb-6">
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by title or city…"
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
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Property</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Host</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Stats</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{p.title}</div>
                    <div className="text-gray-500">{p.city}, {p.country} · {p.propertyType}</div>
                    <div className="text-gray-400">KSH {p.price.toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-900">{p.host.name}</div>
                    <div className="text-gray-500">{p.host.email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {p._count.reviews} reviews · {p._count.bookings} bookings
                    {p.featured && <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">Featured</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleFeatured(p.id, !p.featured)}
                        className={`px-2 py-1 text-xs rounded ${p.featured ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"}`}
                      >
                        {p.featured ? "Unfeature" : "Feature"}
                      </button>
                      <button
                        onClick={() => deleteProperty(p.id)}
                        className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {properties.length === 0 && <p className="text-center text-gray-500 py-8">No properties found.</p>}
        </div>
      )}
    </div>
  );
}
