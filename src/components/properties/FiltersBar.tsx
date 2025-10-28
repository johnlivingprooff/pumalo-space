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

  // Price slider configuration
  const PRICE_MIN = 0;
  const PRICE_MAX = 1000000;
  const DEFAULT_MIN = 10000;
  const DEFAULT_MAX = 650000;

  // Local state for slider values
  const [minSlider, setMinSlider] = React.useState<number>(
    selected.minPrice ? Number(selected.minPrice) : DEFAULT_MIN
  );
  const [maxSlider, setMaxSlider] = React.useState<number>(
    selected.maxPrice ? Number(selected.maxPrice) : DEFAULT_MAX
  );

  // Sync local slider with URL params
  React.useEffect(() => {
    setMinSlider(selected.minPrice ? Number(selected.minPrice) : DEFAULT_MIN);
  }, [selected.minPrice]);
  React.useEffect(() => {
    setMaxSlider(selected.maxPrice ? Number(selected.maxPrice) : DEFAULT_MAX);
  }, [selected.maxPrice]);

  // Debounced URL update for slider changes
  React.useEffect(() => {
    const handle = setTimeout(() => {
      const min = minSlider === DEFAULT_MIN ? undefined : String(minSlider);
      const max = maxSlider === DEFAULT_MAX ? undefined : String(maxSlider);
      setParams({ minPrice: min, maxPrice: max });
    }, 300);
    return () => clearTimeout(handle);
  }, [minSlider, maxSlider]);

  const handleMinChange = (val: number) => {
    const clamped = Math.max(PRICE_MIN, Math.min(val, maxSlider));
    setMinSlider(clamped);
  };

  const handleMaxChange = (val: number) => {
    const clamped = Math.min(PRICE_MAX, Math.max(val, minSlider));
    setMaxSlider(clamped);
  };

  const formatPrice = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
    return String(val);
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

        {/* Price - Dual-thumb Range Slider */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Price Range (KSH)</p>
          
          {/* Display current values */}
          <div className="flex items-center justify-between text-sm text-gray-700">
            <span className="font-medium">{formatPrice(minSlider)}</span>
            <span className="text-gray-400">—</span>
            <span className="font-medium">{formatPrice(maxSlider)}</span>
          </div>

          {/* Dual-thumb slider */}
          <div className="relative pt-2 pb-1">
            {/* Track background */}
            <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-200 rounded-full -translate-y-1/2" />
            
            {/* Active range highlight */}
            <div
              className="absolute top-1/2 h-1.5 bg-primary-600 rounded-full -translate-y-1/2"
              style={{
                left: `${((minSlider - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
                right: `${100 - ((maxSlider - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
              }}
            />

            {/* Min slider thumb */}
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={10000}
              value={minSlider}
              onChange={(e) => handleMinChange(Number(e.target.value))}
              className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
              style={{ zIndex: minSlider > maxSlider - 50000 ? 5 : 3 }}
            />

            {/* Max slider thumb */}
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={10000}
              value={maxSlider}
              onChange={(e) => handleMaxChange(Number(e.target.value))}
              className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
              style={{ zIndex: 4 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
