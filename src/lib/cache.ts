/**
 * Simple In-Memory Cache for Performance Optimization
 * 
 * For production, consider using Redis or similar distributed cache
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class SimpleCache {
  private cache: Map<string, CacheEntry<any>>;
  private readonly defaultTTL: number;

  constructor(defaultTTL = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map();
    this.defaultTTL = defaultTTL;

    // Clean up expired entries every minute
    setInterval(() => {
      this.cleanup();
    }, 60 * 1000);
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { data, expiresAt });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  // Helper method for cache-or-fetch pattern
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    
    if (cached !== null) {
      return cached;
    }

    const data = await fetchFn();
    this.set(key, data, ttl);
    return data;
  }

  // Invalidate cache patterns (e.g., all user-* keys)
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

// Export singleton instance
export const cache = new SimpleCache();

// Cache key generators for consistency
export const cacheKeys = {
  property: (id: string) => `property:${id}`,
  properties: (filters: string) => `properties:${filters}`,
  userFavorites: (userId: string) => `favorites:${userId}`,
  userBookings: (userId: string) => `bookings:${userId}`,
  userProperties: (userId: string) => `user-properties:${userId}`,
  propertyReviews: (propertyId: string) => `reviews:${propertyId}`,
  featuredProperties: () => 'properties:featured',
  citiesList: () => 'cities:list',
};

// Cache invalidation helpers
export const invalidateCache = {
  property: (id: string) => {
    cache.delete(cacheKeys.property(id));
    cache.invalidatePattern(`^properties:`); // Invalidate all property lists
  },
  
  userFavorites: (userId: string) => {
    cache.delete(cacheKeys.userFavorites(userId));
  },
  
  userBookings: (userId: string) => {
    cache.delete(cacheKeys.userBookings(userId));
  },
  
  propertyReviews: (propertyId: string) => {
    cache.delete(cacheKeys.propertyReviews(propertyId));
    cache.delete(cacheKeys.property(propertyId)); // Also invalidate property (has review count)
  },
};
