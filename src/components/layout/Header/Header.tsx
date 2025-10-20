'use client';

import React, { useState, Suspense } from 'react';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { UserMenu } from './UserMenu';
import { Input } from '@/components/ui/Input';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white transition-shadow ${
        isScrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>
          
          {/* Navigation - Desktop */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-8">
            <Navigation />
          </div>
          
          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search properties..."
              leftIcon={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
              fullWidth
            />
          </div>
          
          {/* User Menu - Desktop */}
          <div className="hidden md:flex flex-shrink-0">
            <Suspense fallback={
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
              </div>
            }>
              <UserMenu />
            </Suspense>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-4">
            {/* Search - Mobile */}
            <Input
              type="search"
              placeholder="Search properties..."
              leftIcon={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
              fullWidth
            />
            
            {/* Navigation - Mobile */}
            <nav className="flex flex-col gap-2">
              <a href="/rent" className="px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                Rent
              </a>
              <a href="/buy" className="px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                Buy
              </a>
              <a href="/lodge" className="px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                Lodge
              </a>
            </nav>
            
            {/* User Menu - Mobile */}
            <div className="pt-4 border-t border-gray-200">
              <Suspense fallback={
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                </div>
              }>
                <UserMenu />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
