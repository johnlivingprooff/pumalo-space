/**
 * Lightweight in-memory rate limiter (sliding window).
 *
 * Foundational implementation for single-instance deployments. In production
 * with multiple server instances, swap this for a shared store (e.g. Redis)
 * backed by the same `allow(key, limit, windowMs)` contract.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Periodically evict expired buckets so the map never grows unbounded.
const CLEANUP_INTERVAL_MS = 60_000;
const MAX_BUCKETS = 10_000;

setInterval(() => {
  const now = Date.now();
  if (buckets.size < MAX_BUCKETS) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}, CLEANUP_INTERVAL_MS).unref?.();

export function allow(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;

  bucket.count += 1;
  return true;
}
