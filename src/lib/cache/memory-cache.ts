import { LRUCache } from "lru-cache";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache = new LRUCache<string, any>({
  max: parseInt(process.env.CACHE_MAX_ENTRIES || "5000", 10),
});

export function cacheGet<T>(key: string): T | undefined {
  return cache.get(key) as T | undefined;
}

export function cacheSet<T>(key: string, value: T, ttl: number): void {
  cache.set(key, value, { ttl });
}

export function cacheDelete(key: string): void {
  cache.delete(key);
}

export function withCache<T>(
  key: string,
  ttl: number,
  fn: () => Promise<T>
): Promise<T> {
  const cached = cacheGet<T>(key);
  if (cached !== undefined) return Promise.resolve(cached);
  return fn().then((result) => {
    cacheSet(key, result, ttl);
    return result;
  });
}
