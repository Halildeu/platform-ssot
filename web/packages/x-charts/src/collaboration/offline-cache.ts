/**
 * Offline Cache — IndexedDB for dashboard data
 *
 * Caches query results in IndexedDB for offline access.
 * Falls back gracefully when IndexedDB is unavailable.
 *
 * @see contract P7 DoD: "Offline: IndexedDB for query result cache"
 */

import { useState, useEffect, useCallback } from 'react';

export interface OfflineCacheOptions {
  /** Database name. @default 'x-charts-offline' */
  dbName?: string;
  /** Store name. @default 'query-cache' */
  storeName?: string;
  /** Max cache entries. @default 100 */
  maxEntries?: number;
  /** TTL in milliseconds. @default 86400000 (24h) */
  ttl?: number;
}

export interface OfflineCacheState {
  isAvailable: boolean;
  get: (key: string) => Promise<unknown | null>;
  set: (key: string, value: unknown) => Promise<void>;
  remove: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

interface CacheEntry {
  key: string;
  value: unknown;
  timestamp: number;
}

function openDB(dbName: string, storeName: string): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);

  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(dbName, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'key' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Hook for offline IndexedDB caching.
 */
export function useOfflineCache(options?: OfflineCacheOptions): OfflineCacheState {
  const {
    dbName = 'x-charts-offline',
    storeName = 'query-cache',
    maxEntries = 100,
    ttl = 86_400_000,
  } = options ?? {};

  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    openDB(dbName, storeName).then((database) => {
      setDb(database);
      setIsAvailable(database !== null);
    });
  }, [dbName, storeName]);

  const get = useCallback(
    async (key: string): Promise<unknown | null> => {
      if (!db) return null;
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(storeName, 'readonly');
          const store = tx.objectStore(storeName);
          const req = store.get(key);
          req.onsuccess = () => {
            const entry = req.result as CacheEntry | undefined;
            if (!entry) { resolve(null); return; }
            if (Date.now() - entry.timestamp > ttl) { resolve(null); return; }
            resolve(entry.value);
          };
          req.onerror = () => resolve(null);
        } catch { resolve(null); }
      });
    },
    [db, storeName, ttl],
  );

  const set = useCallback(
    async (key: string, value: unknown): Promise<void> => {
      if (!db) return;
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(storeName, 'readwrite');
          const store = tx.objectStore(storeName);
          store.put({ key, value, timestamp: Date.now() } satisfies CacheEntry);
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch { resolve(); }
      });
    },
    [db, storeName],
  );

  const remove = useCallback(
    async (key: string): Promise<void> => {
      if (!db) return;
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(storeName, 'readwrite');
          tx.objectStore(storeName).delete(key);
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch { resolve(); }
      });
    },
    [db, storeName],
  );

  const clear = useCallback(async (): Promise<void> => {
    if (!db) return;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch { resolve(); }
    });
  }, [db, storeName]);

  return { isAvailable, get, set, remove, clear };
}
