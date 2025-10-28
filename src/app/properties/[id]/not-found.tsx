import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <svg
            className="w-24 h-24 text-gray-400 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Property Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the property you're looking for. It may have been removed or is no longer available.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/properties">
            <Button variant="primary" size="lg">
              Browse All Properties
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
