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

  const setParams = (entries: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams?.toString());
    Object.entries(entries).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
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

  const applyPrice = (min?: string, max?: string) => {
    if (!min && !max) {
      setParams({ minPrice: undefined, maxPrice: undefined });
      return;
    }
    setParams({ minPrice: min, maxPrice: max });
  };

  // Local state for debounced min/max numeric inputs
  const [minPriceInput, setMinPriceInput] = React.useState<string>(selected.minPrice || "");
  const [maxPriceInput, setMaxPriceInput] = React.useState<string>(selected.maxPrice || "");

  // Keep inputs in sync with URL changes
  React.useEffect(() => {
    setMinPriceInput(selected.minPrice || "");
  }, [selected.minPrice]);
  React.useEffect(() => {
    setMaxPriceInput(selected.maxPrice || "");
  }, [selected.maxPrice]);

  // Validation helper message for price
  const [priceHelp, setPriceHelp] = React.useState<string>("");

  // Debounce URL updates when typing
  React.useEffect(() => {
    const handle = setTimeout(() => {
      const sanitize = (val: string): string | undefined => {
        const trimmed = val.trim();
        if (trimmed === "") return undefined;
        const n = Number(trimmed);
        if (isNaN(n) || n < 0) return undefined;
        return String(Math.floor(n));
      };
      const min = sanitize(minPriceInput);
      const max = sanitize(maxPriceInput);
      if (min && max) {
        const minN = Number(min);
        const maxN = Number(max);
        if (maxN < minN) {
          // Auto-correct: set max = min and show helper text
          setParams({ minPrice: String(minN), maxPrice: String(minN) });
          setPriceHelp("Max adjusted to match Min");
          return;
        }
      }
      setPriceHelp("");
      setParams({ minPrice: min, maxPrice: max });
    }, 400);
    return () => clearTimeout(handle);
  }, [minPriceInput, maxPriceInput]);

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

        {/* Price - Min/Max Numeric Inputs */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Price Range (KSH)</p>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={1000}
              placeholder="Min"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-600 placeholder:text-gray-400"
            />
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={1000}
              placeholder="Max"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-600 placeholder:text-gray-400"
            />
          </div>
          {priceHelp && (
            <p className="text-xs text-amber-600 mt-1">{priceHelp}</p>
          )}
        </div>
      </div>
    </div>
  );
};
