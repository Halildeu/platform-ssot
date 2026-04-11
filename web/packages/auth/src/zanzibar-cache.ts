/**
 * Object-level Zanzibar permission cache.
 *
 * Cache key: userId + tenant scope + relation + objectType + objectId + authzVersion.
 * TTL is backstop only (30s default). Primary invalidation is authzVersion-based:
 * when authzVersion changes, entire cache is purged.
 *
 * Design decision (CNS-20260411-005):
 * - /me snapshot is a bounded hint, NOT authoritative for object-level
 * - Authoritative path is checkPermission() via @mfe/shared-http
 * - authzVersion drives cache invalidation (not TTL alone)
 */

export interface ZanzibarCacheEntry {
  allowed: boolean;
  checkedAt: number;
  authzVersion: number;
}

export interface ZanzibarCacheConfig {
  ttlMs: number;
  maxEntries: number;
}

const DEFAULT_CONFIG: ZanzibarCacheConfig = {
  ttlMs: 30_000,
  maxEntries: 500,
};

function buildCacheKey(
  userId: string,
  relation: string,
  objectType: string,
  objectId: string,
): string {
  return `${userId}:${relation}:${objectType}:${objectId}`;
}

export function createZanzibarCache(config: Partial<ZanzibarCacheConfig> = {}) {
  const { ttlMs, maxEntries } = { ...DEFAULT_CONFIG, ...config };
  const store = new Map<string, ZanzibarCacheEntry>();
  let currentAuthzVersion = -1;

  return {
    /**
     * Get cached permission result.
     * Returns undefined on cache miss, stale TTL, or version mismatch.
     */
    get(
      userId: string,
      relation: string,
      objectType: string,
      objectId: string,
    ): boolean | undefined {
      const key = buildCacheKey(userId, relation, objectType, objectId);
      const entry = store.get(key);
      if (!entry) return undefined;

      // Version mismatch — stale
      if (entry.authzVersion !== currentAuthzVersion) {
        store.delete(key);
        return undefined;
      }

      // TTL backstop
      if (Date.now() - entry.checkedAt > ttlMs) {
        store.delete(key);
        return undefined;
      }

      return entry.allowed;
    },

    /**
     * Store permission check result.
     */
    set(
      userId: string,
      relation: string,
      objectType: string,
      objectId: string,
      allowed: boolean,
    ): void {
      const key = buildCacheKey(userId, relation, objectType, objectId);

      // Evict oldest if at capacity
      if (store.size >= maxEntries && !store.has(key)) {
        const firstKey = store.keys().next().value;
        if (firstKey !== undefined) store.delete(firstKey);
      }

      store.set(key, {
        allowed,
        checkedAt: Date.now(),
        authzVersion: currentAuthzVersion,
      });
    },

    /**
     * Update authzVersion. If version changed, purge entire cache.
     * Called by PermissionProvider on version poll.
     */
    updateVersion(newVersion: number): void {
      if (newVersion !== currentAuthzVersion && newVersion > 0) {
        store.clear();
        currentAuthzVersion = newVersion;
      }
    },

    /** Current cache size (for diagnostics). */
    get size() {
      return store.size;
    },

    /** Force clear all entries. */
    clear(): void {
      store.clear();
    },
  };
}

export type ZanzibarCache = ReturnType<typeof createZanzibarCache>;
