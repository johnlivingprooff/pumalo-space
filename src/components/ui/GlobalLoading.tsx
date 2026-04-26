'use client';

import { useEffect, useState } from 'react';

export function GlobalLoading() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // This will handle the loading state during navigation
    const handleStart = () => setIsLoading(true);
    const handleEnd = () => setIsLoading(false);

    // Listen for navigation events
    window.addEventListener('beforeunload', handleStart);
    
    // For client-side navigation, we can use a timeout-based approach
    // since turbopack doesn't expose a direct API
    
    return () => {
      window.removeEventListener('beforeunload', handleStart);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-gray-50">
      <div className="min-h-screen">
        {/* Header Skeleton */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              </div>
            </aside>
            <main className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}