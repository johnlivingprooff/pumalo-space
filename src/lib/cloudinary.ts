/**
 * Cloudinary Utility Functions
 * 
 * Helper functions to work with Cloudinary images in Pumalo Space
 */

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';

/**
 * Build a Cloudinary URL with transformations
 * 
 * @param publicId - The Cloudinary public ID (e.g., "pumalo/properties/apartment-1")
 * @param transformations - Optional transformations (e.g., "w_800,h_600,c_fill,q_auto")
 * @returns Complete Cloudinary URL
 */
export function buildCloudinaryUrl(
  publicId: string,
  transformations?: string
): string {
  if (!CLOUDINARY_CLOUD_NAME) {
    console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set in environment variables');
    return publicId; // Return as-is if no cloud name
  }

  // If it's already a full URL, return it
  if (publicId.startsWith('http://') || publicId.startsWith('https://')) {
    return publicId;
  }

  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  
  if (transformations) {
    return `${baseUrl}/${transformations}/${publicId}`;
  }
  
  return `${baseUrl}/${publicId}`;
}

/**
 * Get optimized property image URL
 * 
 * @param publicId - Cloudinary public ID
 * @param size - Image size preset ('thumbnail', 'card', 'detail', 'full')
 * @returns Optimized Cloudinary URL
 */
export function getPropertyImageUrl(
  publicId: string,
  size: 'thumbnail' | 'card' | 'detail' | 'full' = 'card'
): string {
  const transformations: Record<typeof size, string> = {
    thumbnail: 'w_300,h_200,c_fill,q_auto,f_auto',
    card: 'w_600,h_400,c_fill,q_auto,f_auto',
    detail: 'w_1200,h_800,c_fill,q_auto,f_auto',
    full: 'w_1920,q_auto,f_auto',
  };

  return buildCloudinaryUrl(publicId, transformations[size]);
}

/**
 * Get optimized destination/city image URL
 * 
 * @param publicId - Cloudinary public ID
 * @returns Optimized Cloudinary URL
 */
export function getDestinationImageUrl(publicId: string): string {
  return buildCloudinaryUrl(publicId, 'w_500,h_300,c_fill,q_auto,f_auto');
}

/**
 * Get user profile image URL with face detection
 * 
 * @param publicId - Cloudinary public ID
 * @param size - Image size in pixels (default: 150)
 * @returns Optimized Cloudinary URL with face crop
 */
export function getUserImageUrl(publicId: string, size = 150): string {
  return buildCloudinaryUrl(
    publicId,
    `w_${size},h_${size},c_thumb,g_face,q_auto,f_auto`
  );
}

/**
 * Get placeholder image URL
 * Uses Cloudinary's sample images or a gray placeholder
 */
export function getPlaceholderImageUrl(type: 'property' | 'user' | 'destination' = 'property'): string {
  if (!CLOUDINARY_CLOUD_NAME) {
    // Return a data URL placeholder if Cloudinary is not configured
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%239ca3af" font-family="sans-serif" font-size="18"%3ENo Image%3C/text%3E%3C/svg%3E';
  }

  const placeholders = {
    property: 'samples/landscapes/architecture-signs',
    user: 'samples/people/boy-snow-hoodie',
    destination: 'samples/landscapes/beach-boat',
  };

  return buildCloudinaryUrl(placeholders[type], 'w_600,h_400,c_fill,q_auto,f_auto');
}

/**
 * Convert a local path to potential Cloudinary public ID
 * Useful for migrating from local images
 * 
 * @param localPath - Local path like "/images/properties/apartment-1.jpg"
 * @returns Cloudinary public ID like "pumalo/properties/apartment-1"
 */
export function localPathToPublicId(localPath: string): string {
  // Remove leading slash and file extension
  let publicId = localPath.replace(/^\//, '').replace(/\.[^.]+$/, '');
  
  // Replace /images/ with /pumalo/
  publicId = publicId.replace(/^images\//, 'pumalo/');
  
  return publicId;
}

/**
 * Validate if a string is a valid Cloudinary URL or public ID
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com') || url.includes('res.cloudinary');
}

/**
 * Extract public ID from Cloudinary URL
 */
export function extractPublicId(cloudinaryUrl: string): string | null {
  const match = cloudinaryUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return match ? match[1] : null;
}
