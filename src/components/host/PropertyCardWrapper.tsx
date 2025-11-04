'use client';

import Link from 'next/link';

interface PropertyCardWrapperProps {
  propertyId: string;
  children: React.ReactNode;
}

export function PropertyCardWrapper({ propertyId, children }: PropertyCardWrapperProps) {
  return (
    <Link
      href={`/host/listings/${propertyId}`}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow block"
    >
      {children}
    </Link>
  );
}
