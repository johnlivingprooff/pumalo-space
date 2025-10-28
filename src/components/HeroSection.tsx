'use client';

import React from 'react';
import { Button } from './ui/Button';
import { AnimatedSearchInput } from './ui/AnimatedSearchInput';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative text-white">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
          alt="City buildings"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Find Your Perfect Space
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-blue-100">
            Discover amazing properties to rent, buy, or lodge
          </p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6">
            <div className="mb-4">
              <AnimatedSearchInput />
            </div>
            
            <Button variant="primary" size="lg" fullWidth>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Properties
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
