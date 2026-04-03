/**
 * Data Caching Types — Query result caching strategy.
 */

export interface CacheConfig {
  strategy: 'none' | 'ttl' | 'incremental' | 'materialized';
  ttlMinutes?: number;
  refreshSchedule?: string;
  maxCacheSize?: number;
}

export interface CacheEntry {
  queryHash: string;
  reportId: string;
  createdAt: string;
  expiresAt: string;
  rowCount: number;
  sizeBytes: number;
  hitCount: number;
}
