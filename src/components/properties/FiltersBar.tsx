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

  const sections = [
    {
      title: "Type",
      content: (
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
      ),
    },
    {
      title: "City",
      content: (
        <div className="flex items-center gap-2 overflow-x-auto">
          <Pill active={!selected.city} onClick={() => setParam("city", undefined)}>
            Any
          </Pill>
          {cities.map((city) => (
            <Pill key={city} active={selected.city === city} onClick={() => toggleParam("city", city)}>
              {city}
            </Pill>
          ))}
        </div>
      ),
    },
    {
      title: "Bedrooms",
      content: (
        <div className="flex items-center gap-2 overflow-x-auto">
          <Pill active={!selected.bedrooms} onClick={() => setParam("bedrooms", undefined)}>
            Any
          </Pill>
          {["1", "2", "3", "4"].map((num) => (
            <Pill key={num} active={selected.bedrooms === num} onClick={() => toggleParam("bedrooms", num)}>
              {num}+
            </Pill>
          ))}
        </div>
      ),
    },
    {
      title: "Bathrooms",
      content: (
        <div className="flex items-center gap-2 overflow-x-auto">
          <Pill active={!selected.bathrooms} onClick={() => setParam("bathrooms", undefined)}>
            Any
          </Pill>
          {["1", "2", "3"].map((num) => (
            <Pill key={num} active={selected.bathrooms === num} onClick={() => toggleParam("bathrooms", num)}>
              {num}+
            </Pill>
          ))}
        </div>
      ),
    },
    {
      title: "Price",
      content: (
        <div className="flex items-center gap-2 overflow-x-auto">
          {priceRanges.map((range) => (
            <Pill
              key={range.label}
              active={isPriceActive(range.min, range.max)}
              onClick={() => applyPrice(range.min, range.max)}
            >
              {range.label}
            </Pill>
          ))}
        </div>
      ),
    },
  ];

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
      <div className="space-y-4">
        {sections.map((sec) => (
          <div key={sec.title} className="space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{sec.title}</p>
            {sec.content}
          </div>
        ))}
      </div>
    </div>
  );
};
