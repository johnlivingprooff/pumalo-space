'use client';

import Link from 'next/link';

interface EditPropertyLinkProps {
  propertyId: string;
}

export function EditPropertyLink({ propertyId }: EditPropertyLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/host/listings/${propertyId}/edit`;
  };

  return (
    <button
      onClick={handleClick}
      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
    >
      Edit
    </button>
  );
}
