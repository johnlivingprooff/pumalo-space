'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface DeletePropertyButtonProps {
  propertyId: string;
  propertyTitle: string;
}

export function DeletePropertyButton({ propertyId, propertyTitle }: DeletePropertyButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${propertyTitle}"? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/properties/${propertyId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          router.push('/host/listings');
        } else {
          const errorData = await response.json();
          alert(`Failed to delete property: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property. Please try again.');
      }
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
      onClick={handleDelete}
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      Delete Property
    </Button>
  );
}