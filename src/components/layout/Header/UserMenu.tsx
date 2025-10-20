'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@stackframe/stack';
import { Button } from '@/components/ui/Button';

export const UserMenu: React.FC = () => {
  const user = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/sign-in">
          <Button variant="ghost" size="sm">
            Log In
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button variant="primary" size="sm">
            Sign Up
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        {user.profileImageUrl ? (
          <img 
            src={user.profileImageUrl} 
            alt={user.displayName || 'User'} 
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
            {user.displayName?.charAt(0).toUpperCase() || user.primaryEmail?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">{user.displayName || 'User'}</p>
            <p className="text-xs text-gray-500">{user.primaryEmail}</p>
          </div>
          
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsDropdownOpen(false)}
          >
            Profile
          </Link>
          <Link
            href="/favorites"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsDropdownOpen(false)}
          >
            Favorites
          </Link>
          <Link
            href="/bookings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsDropdownOpen(false)}
          >
            My Bookings
          </Link>
          
          <div className="border-t border-gray-200 my-2" />
          
          <Link
            href="/host/dashboard"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsDropdownOpen(false)}
          >
            Become a Host
          </Link>
          
          <div className="border-t border-gray-200 my-2" />
          
          <button
            onClick={async () => {
              await user.signOut();
              setIsDropdownOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};
