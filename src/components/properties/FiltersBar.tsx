"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useState } from "react";

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

const PRICE_MIN = 0;
const PRICE_MAX = 1000000;
const DEFAULT_MIN = 10000;
const DEFAULT_MAX = 650000;

const formatPrice = (val: number) => {
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
  return String(val);
};

function Pill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
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

function CollapsibleGroup({
  title,
  defaultOpen = false,
  count,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  count?: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3 px-1 text-left"
      >
        <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          {title}
          {count !== undefined && count > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold">
              {count}
            </span>
          )}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? "max-h-96 pb-3" : "max-h-0"
        }`}
      >
        <div className="px-1">{children}</div>
      </div>
    </div>
  );
}

function FilterIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
      />
    </svg>
  );
}

export const FiltersBar: React.FC<FiltersBarProps> = ({ cities, selected }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCount = [selected.type, selected.city, selected.minPrice, selected.bedrooms, selected.bathrooms]
    .filter(Boolean).length;

  const setParam = useCallback(
    (key: string, value?: string) => {
      const params = new URLSearchParams(searchParams?.toString());
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete("page");
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const setParams = useCallback(
    (entries: Record<string, string | undefined>) => {
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
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const toggleParam = useCallback(
    (key: string, value: string) => {
      const current = searchParams?.get(key);
      if (current === value) {
        setParam(key, undefined);
      } else {
        setParam(key, value);
      }
    },
    [searchParams, setParam],
  );

  const [minSlider, setMinSlider] = React.useState<number>(
    selected.minPrice ? Number(selected.minPrice) : DEFAULT_MIN,
  );
  const [maxSlider, setMaxSlider] = React.useState<number>(
    selected.maxPrice ? Number(selected.maxPrice) : DEFAULT_MAX,
  );

  React.useEffect(() => {
    setMinSlider(selected.minPrice ? Number(selected.minPrice) : DEFAULT_MIN);
    setMaxSlider(selected.maxPrice ? Number(selected.maxPrice) : DEFAULT_MAX);
  }, [selected.minPrice, selected.maxPrice]);

  React.useEffect(() => {
    const handle = setTimeout(() => {
      const min = minSlider === DEFAULT_MIN ? undefined : String(minSlider);
      const max = maxSlider === DEFAULT_MAX ? undefined : String(maxSlider);
      setParams({ minPrice: min, maxPrice: max });
    }, 300);
    return () => clearTimeout(handle);
  }, [minSlider, maxSlider, setParams]);

  const handleMinChange = (val: number) => {
    setMinSlider(Math.max(PRICE_MIN, Math.min(val, maxSlider)));
  };

  const handleMaxChange = (val: number) => {
    setMaxSlider(Math.min(PRICE_MAX, Math.max(val, minSlider)));
  };

  const filterContent = (
    <>
      <CollapsibleGroup title="Type" count={selected.type ? 1 : undefined}>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: "rent", label: "Rent" },
            { key: "buy", label: "Buy" },
            { key: "lodge", label: "Lodge" },
          ].map((opt) => (
            <Pill
              key={opt.key}
              active={(selected.type || "") === opt.key}
              onClick={() => toggleParam("type", opt.key)}
            >
              {opt.label}
            </Pill>
          ))}
        </div>
      </CollapsibleGroup>

      <CollapsibleGroup title="City" count={selected.city ? 1 : undefined}>
        <select
          id="filter-city"
          value={selected.city || ""}
          onChange={(e) => setParam("city", e.target.value || undefined)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-700 text-sm"
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </CollapsibleGroup>

      <CollapsibleGroup title="Bedrooms" count={selected.bedrooms ? 1 : undefined}>
        <select
          id="filter-bedrooms"
          value={selected.bedrooms || ""}
          onChange={(e) => setParam("bedrooms", e.target.value || undefined)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-700 text-sm"
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </CollapsibleGroup>

      <CollapsibleGroup title="Bathrooms" count={selected.bathrooms ? 1 : undefined}>
        <select
          id="filter-bathrooms"
          value={selected.bathrooms || ""}
          onChange={(e) => setParam("bathrooms", e.target.value || undefined)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-700 text-sm"
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>
      </CollapsibleGroup>

      <CollapsibleGroup title="Price Range" count={selected.minPrice || selected.maxPrice ? 1 : undefined}>
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-sm text-gray-700">
            <span className="font-medium">{formatPrice(minSlider)}</span>
            <span className="text-gray-400">—</span>
            <span className="font-medium">{formatPrice(maxSlider)}</span>
          </div>
          <div className="relative pt-2 pb-1">
            <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-200 rounded-full -translate-y-1/2" />
            <div
              className="absolute top-1/2 h-1.5 bg-primary-600 rounded-full -translate-y-1/2"
              style={{
                left: `${((minSlider - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
                right: `${100 - ((maxSlider - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
              }}
            />
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
      </CollapsibleGroup>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            type="button"
            onClick={() => router.push(pathname, { scroll: false })}
            className="text-sm text-gray-500 hover:text-gray-900 underline"
          >
            Clear all
          </button>
        </div>
        <div className="space-y-1">{filterContent}</div>
      </div>

      {/* Mobile filter toggle button */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
        >
          <FilterIcon />
          <span className="text-sm font-medium">Filters</span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-gray-900 text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile overlay + bottom sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl flex flex-col max-h-[80vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Filters</h2>
              <button
                type="button"
                onClick={() => router.push(pathname, { scroll: false })}
                className="text-sm text-gray-500 hover:text-gray-900 underline"
              >
                Clear all
              </button>
            </div>
            {/* Scrollable content */}
            <div className="overflow-y-auto px-5 py-2 flex-1">
              {filterContent}
            </div>
            {/* Done button */}
            <div className="px-5 pb-5 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-full bg-primary-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
