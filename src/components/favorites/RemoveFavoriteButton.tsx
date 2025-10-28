"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export function RemoveFavoriteButton({ propertyId }: { propertyId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onRemove = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/favorites?propertyId=${propertyId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to remove');
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to remove');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onRemove}
        disabled={loading}
        className="px-3 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-60"
      >
        {loading ? 'Removing…' : 'Remove'}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
