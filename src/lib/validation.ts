/**
 * Input Validation & Sanitization Utilities
 * 
 * Provides secure validation for user inputs to prevent injection attacks
 */

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Phone validation (international format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

// Sanitize string input (remove potentially dangerous characters)
export function sanitizeString(input: string, maxLength = 1000): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

// Validate and sanitize URL
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// Validate positive number
export function isValidPositiveNumber(value: any): boolean {
  const num = Number(value);
  return !isNaN(num) && num > 0 && isFinite(num);
}

// Validate integer
export function isValidInteger(value: any, min?: number, max?: number): boolean {
  const num = Number(value);
  if (!Number.isInteger(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
}

// Validate property type enum
export function isValidPropertyType(type: string): type is 'RENT' | 'BUY' | 'LODGE' {
  return ['RENT', 'BUY', 'LODGE'].includes(type);
}

// Validate booking status enum
export function isValidBookingStatus(status: string): status is 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' {
  return ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status);
}

// Validate and sanitize property data
export function validatePropertyData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required string fields
  const requiredStrings = ['title', 'description', 'address', 'city', 'country'];
  for (const field of requiredStrings) {
    if (!data[field] || typeof data[field] !== 'string' || data[field].trim().length === 0) {
      errors.push(`${field} is required`);
    }
  }

  // Property type validation
  if (!isValidPropertyType(data.propertyType)) {
    errors.push('Invalid property type');
  }

  // Numeric validations
  if (!isValidPositiveNumber(data.price)) {
    errors.push('Price must be a positive number');
  }

  if (!isValidInteger(data.bedrooms, 0, 100)) {
    errors.push('Bedrooms must be between 0 and 100');
  }

  if (!isValidInteger(data.bathrooms, 0, 100)) {
    errors.push('Bathrooms must be between 0 and 100');
  }

  if (!isValidInteger(data.maxGuests, 1, 100)) {
    errors.push('Max guests must be between 1 and 100');
  }

  // Coordinates validation
  if (typeof data.latitude !== 'number' || data.latitude < -90 || data.latitude > 90) {
    errors.push('Invalid latitude');
  }

  if (typeof data.longitude !== 'number' || data.longitude < -180 || data.longitude > 180) {
    errors.push('Invalid longitude');
  }

  // Images validation
  if (!Array.isArray(data.images) || data.images.length === 0) {
    errors.push('At least one image is required');
  } else {
    for (const img of data.images) {
      if (!isValidUrl(img)) {
        errors.push('Invalid image URL');
        break;
      }
    }
  }

  // Amenities validation (optional)
  if (data.amenities && !Array.isArray(data.amenities)) {
    errors.push('Amenities must be an array');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Validate booking data
export function validateBookingData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!data.propertyId || typeof data.propertyId !== 'string') {
    errors.push('Property ID is required');
  }

  if (!data.checkIn || !data.checkOut) {
    errors.push('Check-in and check-out dates are required');
  }

  // Date validation
  const checkIn = new Date(data.checkIn);
  const checkOut = new Date(data.checkOut);
  const now = new Date();

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    errors.push('Invalid date format');
  } else {
    if (checkIn < now) {
      errors.push('Check-in date must be in the future');
    }

    if (checkOut <= checkIn) {
      errors.push('Check-out date must be after check-in date');
    }
  }

  // Guests validation
  if (!isValidInteger(data.guests, 1, 100)) {
    errors.push('Guests must be between 1 and 100');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Sanitize user profile data
export function sanitizeUserProfile(data: any): any {
  return {
    firstName: data.firstName ? sanitizeString(data.firstName, 50) : undefined,
    lastName: data.lastName ? sanitizeString(data.lastName, 50) : undefined,
    phone: data.phone ? sanitizeString(data.phone, 20) : undefined,
    bio: data.bio ? sanitizeString(data.bio, 500) : undefined,
  };
}

// Rate limit key generation (used with middleware)
export function generateRateLimitKey(identifier: string, action: string): string {
  return `ratelimit:${identifier}:${action}`;
}
