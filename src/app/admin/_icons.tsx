import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

function BaseSVG(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
}

export function DashboardIcon(props: IconProps) {
  return (
    <BaseSVG {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </BaseSVG>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <BaseSVG {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </BaseSVG>
  );
}

export function PropertiesIcon(props: IconProps) {
  return (
    <BaseSVG {...props}>
      <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </BaseSVG>
  );
}

export function VerificationsIcon(props: IconProps) {
  return (
    <BaseSVG {...props}>
      <path d="M12 2 4 5.5v5.7c0 5.8 3.94 11.16 8 12.5 4.06-1.34 8-6.7 8-12.5V5.5L12 2z" />
      <path d="m9 12 2 2 4-4" />
    </BaseSVG>
  );
}

export function ReviewsIcon(props: IconProps) {
  return (
    <BaseSVG {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </BaseSVG>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <BaseSVG fill="currentColor" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </BaseSVG>
  );
}

export function StarOutlineIcon(props: IconProps) {
  return (
    <BaseSVG {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </BaseSVG>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <BaseSVG {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </BaseSVG>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <BaseSVG {...props}>
      <path d="M15 18 9 12l6-6" />
    </BaseSVG>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <BaseSVG {...props}>
      <path d="M20 6 9 17l-5-5" />
    </BaseSVG>
  );
}

export function XIcon(props: IconProps) {
  return (
    <BaseSVG {...props}>
      <path d="M18 6 6 18" />
      <path d="M6 6 18 18" />
    </BaseSVG>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <BaseSVG {...props}>
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </BaseSVG>
  );
}

export function BanIcon(props: IconProps) {
  return (
    <BaseSVG {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M4.93 4.93 19.07 19.07" />
    </BaseSVG>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <BaseSVG {...props}>
      <path d="M12 2 4 5.5v5.7c0 5.8 3.94 11.16 8 12.5 4.06-1.34 8-6.7 8-12.5V5.5L12 2z" />
    </BaseSVG>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <BaseSVG {...props}>
      <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
    </BaseSVG>
  );
}

export function PersonIcon(props: IconProps) {
  return (
    <BaseSVG {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </BaseSVG>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <BaseSVG {...props}>
      <path d="M21 12a9 9 0 1 1-9-9" />
      <path d="M21 3v6h-6" />
    </BaseSVG>
  );
}

export function FlagIcon(props: IconProps) {
  return (
    <BaseSVG {...props}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </BaseSVG>
  );
}
