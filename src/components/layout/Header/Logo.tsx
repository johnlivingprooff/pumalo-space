import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Logo: React.FC<{ collapsed?: boolean }> = ({ collapsed = false }) => {
  return (
    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <Image
        src="/logo_blue.png"
        alt="Pumalo Space Logo"
        width={collapsed ? 32 : 40}
        height={collapsed ? 32 : 40}
        className="object-contain"
      />
      {!collapsed && (
        <span className="text-xl font-bold text-primary-700">Pumalo Space</span>
      )}
    </Link>
  );
};
