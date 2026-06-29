const DEFAULT_TTL_MS = 5 * 60 * 1000;

const entries = new Map();

function now() {
  return Date.now();
}

export function getCachedRead(key) {
  const entry = entries.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt <= now()) {
    entries.delete(key);
    return undefined;
  }
  return entry.value;
}

export function setCachedRead(key, value, ttlMs = DEFAULT_TTL_MS) {
  entries.set(key, {
    value,
    expiresAt: now() + Math.max(1, ttlMs),
  });
  return value;
}

export async function cachedRead(key, loader, ttlMs = DEFAULT_TTL_MS) {
  const cached = getCachedRead(key);
  if (cached !== undefined) return cached;
  const value = await loader();
  return setCachedRead(key, value, ttlMs);
}

export function invalidateCachedRead(keyOrPrefix) {
  if (!keyOrPrefix) {
    entries.clear();
    return;
  }
  entries.delete(keyOrPrefix);
  for (const key of entries.keys()) {
    if (key.startsWith(keyOrPrefix)) entries.delete(key);
  }
}

export function userProfileCacheKey(uid) {
  return `userProfile:${uid}`;
}
