"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type FiltersBarProps = {
  cities: string[];
  selected: {
    type?: string;
    city?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    bathrooms?: string;
  };
};

function Pill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        `inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ` +
        (active
          ? "bg-primary-600 text-white border-primary-600 hover:bg-primary-700"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50")
      }
    >
      {children}
    </button>
  );
}

export const FiltersBar: React.FC<FiltersBarProps> = ({ cities, selected }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    // Reset pagination if any future page param exists
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const toggleParam = (key: string, value: string) => {
    const current = searchParams?.get(key);
    if (current === value) {
      setParam(key, undefined);
    } else {
      setParam(key, value);
    }
  };

  // Predefined price ranges (KSH)
  const priceRanges = [
    { label: "Any", min: undefined as string | undefined, max: undefined as string | undefined },
    { label: "0 - 20k", min: "0", max: "20000" },
    { label: "20k - 50k", min: "20000", max: "50000" },
    { label: "50k - 100k", min: "50000", max: "100000" },
    { label: "100k+", min: "100000", max: undefined },
  ];

  const isPriceActive = (min?: string, max?: string) => {
    const curMin = selected.minPrice || undefined;
    const curMax = selected.maxPrice || undefined;
    return (curMin ?? undefined) === (min ?? undefined) && (curMax ?? undefined) === (max ?? undefined);
  };

  const applyPrice = (min?: string, max?: string) => {
    if (!min && !max) {
      setParam("minPrice", undefined);
      setParam("maxPrice", undefined);
      return;
    }
    setParam("minPrice", min);
    setParam("maxPrice", max);
  };

  // Compute current price dropdown value string from selected min/max
  const getPriceValue = () => {
    const curMin = selected.minPrice || undefined;
    const curMax = selected.maxPrice || undefined;
    if (!curMin && !curMax) return "";
    if (curMin === "0" && curMax === "20000") return "0-20000";
    if (curMin === "20000" && curMax === "50000") return "20000-50000";
    if (curMin === "50000" && curMax === "100000") return "50000-100000";
    if (curMin === "100000" && !curMax) return "100000-";
    return ""; // fallback to Any if values don't match preset
  };

  const onPriceChange = (value: string) => {
    switch (value) {
      case "0-20000":
        applyPrice("0", "20000");
        break;
      case "20000-50000":
        applyPrice("20000", "50000");
        break;
      case "50000-100000":
        applyPrice("50000", "100000");
        break;
      case "100000-":
        applyPrice("100000", undefined);
        break;
      default:
        applyPrice(undefined, undefined);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Filters</h2>
        <button
          type="button"
          onClick={() => router.push(pathname)}
          className="text-sm text-gray-600 hover:text-gray-900 underline"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-5">
        {/* Type - Pills */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Type</p>
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { key: "rent", label: "Rent" },
              { key: "buy", label: "Buy" },
              { key: "lodge", label: "Lodge" },
            ].map((opt) => (
              <Pill key={opt.key} active={(selected.type || "") === opt.key} onClick={() => toggleParam("type", opt.key)}>
                {opt.label}
              </Pill>
            ))}
          </div>
        </div>

        {/* City - Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider" htmlFor="filter-city">
            City
          </label>
          <select
            id="filter-city"
            value={selected.city || ""}
            onChange={(e) => setParam("city", e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-600"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Bedrooms - Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider" htmlFor="filter-bedrooms">
            Bedrooms (minimum)
          </label>
          <select
            id="filter-bedrooms"
            value={selected.bedrooms || ""}
            onChange={(e) => setParam("bedrooms", e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-600"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>

        {/* Bathrooms - Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider" htmlFor="filter-bathrooms">
            Bathrooms (minimum)
          </label>
          <select
            id="filter-bathrooms"
            value={selected.bathrooms || ""}
            onChange={(e) => setParam("bathrooms", e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-600"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
          </select>
        </div>

        {/* Price - Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider" htmlFor="filter-price">
            Price Range (KSH)
          </label>
          <select
            id="filter-price"
            value={getPriceValue()}
            onChange={(e) => onPriceChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-600"
          >
            <option value="">Any</option>
            <option value="0-20000">0 - 20k</option>
            <option value="20000-50000">20k - 50k</option>
            <option value="50000-100000">50k - 100k</option>
            <option value="100000-">100k+</option>
          </select>
        </div>
      </div>
    </div>
  );
};
