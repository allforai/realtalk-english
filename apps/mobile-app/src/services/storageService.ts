// Source: design.md Section 6.1 -- AsyncStorage helpers with TTL
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // milliseconds
}

/**
 * Store data with a TTL (time-to-live).
 *
 * @param key  - AsyncStorage key
 * @param data - Data to cache
 * @param ttlMs - Time-to-live in milliseconds
 */
export async function setWithTTL<T>(
  key: string,
  data: T,
  ttlMs: number,
): Promise<void> {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    ttl: ttlMs,
  };
  await AsyncStorage.setItem(key, JSON.stringify(entry));
}

/**
 * Get cached data if not expired.
 *
 * @param key - AsyncStorage key
 * @returns The cached data, or null if expired or missing
 */
export async function getWithTTL<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;

  try {
    const entry = JSON.parse(raw) as CacheEntry<T>;
    const elapsed = Date.now() - entry.timestamp;
    if (elapsed > entry.ttl) {
      // Expired -- clean up
      await AsyncStorage.removeItem(key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

/**
 * Remove a cached item.
 */
export async function removeCache(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

/**
 * Clear all cached items matching a prefix.
 */
export async function clearCacheByPrefix(prefix: string): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const matching = keys.filter((k) => k.startsWith(prefix));
  if (matching.length > 0) {
    await AsyncStorage.multiRemove(matching);
  }
}
