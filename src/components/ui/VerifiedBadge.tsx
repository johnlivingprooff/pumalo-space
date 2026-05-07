import React from "react";

interface VerifiedBadgeProps {
  /** "sm" for property cards, "md" for modals/sidebars, "lg" for profile pages */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { icon: "w-3.5 h-3.5", text: "text-xs", gap: "gap-0.5", px: "px-1.5 py-0.5" },
  md: { icon: "w-4 h-4",   text: "text-sm", gap: "gap-1",   px: "px-2 py-0.5"   },
  lg: { icon: "w-5 h-5",   text: "text-sm", gap: "gap-1.5", px: "px-2.5 py-1"   },
};

export function VerifiedBadge({ size = "md", className = "" }: VerifiedBadgeProps) {
  const s = sizes[size];
  return (
    <span
      className={`inline-flex items-center ${s.gap} ${s.px} bg-blue-50 text-blue-700 rounded-full font-medium ${s.text} ${className}`}
      title="Verified by Pumalo Space"
    >
      <svg className={`${s.icon} flex-shrink-0`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      {size !== "sm" && <span>Verified</span>}
    </span>
  );
}
