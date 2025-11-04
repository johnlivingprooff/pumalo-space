'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Rent', href: '/properties?type=rent' },
  { label: 'Buy', href: '/properties?type=buy' },
  { label: 'Lodge', href: '/properties?type=lodge' },
];

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  
  return (
    <nav className="hidden md:flex items-center gap-6">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-base font-medium transition-colors ${
              isActive
                ? 'text-primary-700 border-b-2 border-primary-700'
                : 'text-gray-700 hover:text-primary-600'
            } py-1`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
