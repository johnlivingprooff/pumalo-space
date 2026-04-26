import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <img 
            src="/home-svg.svg" 
            alt="Broken House" 
            className="w-64 h-64 object-contain"
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops! Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          It looks like this property is under renovation. We couldn't find the page you were looking for.
        </p>
        <Link 
          href="/" 
          className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}