// Simple in-memory server cache with TTL. Useful for caching DB-heavy API responses
// in a single-process environment (dev or small deployments). Not a replacement
// for a distributed cache, but it reduces repeated DB hits during active usage.

type CacheEntry = {
  value: any;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry>();

export function setCache(key: string, value: any, ttlSeconds = 60) {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  cache.set(key, { value, expiresAt });
}

export function getCache<T = any>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value as T;
}

export function clearCache(key?: string) {
  if (key) cache.delete(key);
  else cache.clear();
}

export default { getCache, setCache, clearCache };
