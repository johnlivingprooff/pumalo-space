'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useUser } from '@stackframe/stack';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

export const UserMenu: React.FC = () => {
  const user = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHost, setIsHost] = useState(false);

  // Memoize user avatar URL to prevent recalculation
  const avatarUrl = useMemo(() => {
    if (imageError || !user?.profileImageUrl) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&background=3B82F6&color=fff`;
    }
    return user.profileImageUrl;
  }, [user?.profileImageUrl, user?.displayName, imageError]);

  // Fetch user's host status with caching
  useEffect(() => {
    if (user?.id) {
      // Check if we already have the status in session storage
      const cachedStatus = sessionStorage.getItem(`host-status-${user.id}`);
      if (cachedStatus !== null) {
        setIsHost(cachedStatus === 'true');
        return;
      }

      fetch(`/api/user/host-status?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          const hostStatus = data.isHost || false;
          setIsHost(hostStatus);
          sessionStorage.setItem(`host-status-${user.id}`, String(hostStatus));
        })
        .catch(() => setIsHost(false));
    }
  }, [user?.id]);

  // Memoize toggle function
  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  // Memoize sign out handler
  const handleSignOut = useCallback(async () => {
    if (user) {
      await user.signOut();
      sessionStorage.clear(); // Clear cached data
    }
  }, [user]);
  
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
        onClick={toggleDropdown}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <img 
          src={avatarUrl}
          alt={user.displayName || 'User'} 
          className="w-8 h-8 rounded-full object-cover"
          onError={() => setImageError(true)}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
        />
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
            href={isHost ? '/host/listings' : '/host/onboarding'}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsDropdownOpen(false)}
          >
            {isHost ? 'My Listings' : 'Become a Host'}
          </Link>
          
          <div className="border-t border-gray-200 my-2" />
          
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};
