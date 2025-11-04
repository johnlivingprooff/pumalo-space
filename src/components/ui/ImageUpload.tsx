'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  folder?: string;
}

/**
 * Image Upload Component
 * 
 * Allows users to upload images to Cloudinary.
 * Used for property listings, user profiles, etc.
 * 
 * Setup Required:
 * 1. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to .env
 * 2. Create upload preset in Cloudinary (Settings → Upload)
 * 3. Set preset to "Unsigned" mode
 */
export function ImageUpload({
  value = [],
  onChange,
  maxImages = 5,
  folder = 'pumalo/properties',
}: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>(value);

  // Sync with parent value when it changes (important for edit forms)
  useEffect(() => {
    setUploadedImages(value);
  }, [value]);

  const handleUpload = (result: any) => {
    // Handle both single and batch uploads
    if (result.info && result.info.secure_url) {
      const newUrl = result.info.secure_url;
      const updatedImages = [...uploadedImages, newUrl];
      setUploadedImages(updatedImages);
      onChange(updatedImages);
    }
  };

  const handleBatchUpload = (results: any) => {
    // If multiple files are uploaded at once
    if (Array.isArray(results)) {
      const newUrls = results
        .map(r => r.info?.secure_url)
        .filter(Boolean);
      const updatedImages = [...uploadedImages, ...newUrls];
      setUploadedImages(updatedImages);
      onChange(updatedImages);
    }
  };

  const handleRemove = (urlToRemove: string) => {
    const updatedImages = uploadedImages.filter((url) => url !== urlToRemove);
    setUploadedImages(updatedImages);
    onChange(updatedImages);
  };

  const canUploadMore = uploadedImages.length < maxImages;

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((url, index) => (
            <div key={url} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
              <Image
                src={url}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Main Image
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {canUploadMore && (
        <CldUploadWidget
          uploadPreset="pumalo_uploads"
          options={{
            folder,
            multiple: true,
            maxFiles: maxImages,
            resourceType: 'image',
            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
            maxFileSize: 5000000, // 5MB per image
            sources: ['local', 'url', 'camera'],
            showSkipCropButton: false,
            cropping: false,
          }}
          onSuccess={handleUpload}
          onQueuesEnd={(result: any) => {
            // This is called when all files in the queue are uploaded
            if (result.info && Array.isArray(result.info.files)) {
              handleBatchUpload(result.info.files);
            }
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
            >
              <div className="flex flex-col items-center gap-2">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <p className="text-sm font-medium text-gray-700">
                  Click to upload images
                </p>
                <p className="text-xs text-gray-500">
                  {uploadedImages.length} / {maxImages} images uploaded
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  You can select up to {maxImages - uploadedImages.length} more image{maxImages - uploadedImages.length !== 1 ? 's' : ''} at once
                </p>
              </div>
            </button>
          )}
        </CldUploadWidget>
      )}

      {/* Instructions */}
      {uploadedImages.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>📝 Note:</strong> Upload high-quality images of your property. 
            The first image will be the main display image.
          </p>
        </div>
      )}
    </div>
  );
}
