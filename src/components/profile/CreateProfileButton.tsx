'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function CreateProfileButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/create-profile', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create profile');
      }

      // Refresh the page to show the newly created profile
      router.refresh();
    } catch (err) {
      setError('Failed to create profile. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="primary"
        size="lg"
        onClick={handleCreateProfile}
        disabled={isLoading}
      >
        {isLoading ? 'Creating Profile...' : 'Create Profile'}
      </Button>
      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
    </div>
  );
}
