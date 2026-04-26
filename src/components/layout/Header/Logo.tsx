import React from 'react';
import Link from 'next/link';

export const Logo: React.FC = () => {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="relative w-10 h-10 overflow-hidden transition-all duration-300 group-hover:w-32">
        <img 
          src="/home-svg.svg" 
          alt="Pumalo" 
          className="w-10 h-10 object-contain"
        />
        <span className="absolute inset-0 flex items-center pl-11 text-xl font-bold text-gray-900 opacity-0 translate-x-[-20px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap">
          Pumalo
        </span>
      </div>
    </Link>
  );
};
