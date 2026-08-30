// Thin localStorage wrapper. Every cached entry is keyed by its own cache
// key + range, so switching day-ranges doesn't clobber other cached data.
// Guarded with try/catch since localStorage can throw (private browsing,
// storage disabled, quota exceeded) and a cache miss should never break
// the app.

export function readCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function writeCache(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore — caching is a nice-to-have, not required for the app to work
  }
}
