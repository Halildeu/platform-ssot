import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createZanzibarCache } from '../zanzibar-cache';

describe('ZanzibarCache', () => {
  let cache: ReturnType<typeof createZanzibarCache>;

  beforeEach(() => {
    cache = createZanzibarCache({ ttlMs: 5000, maxEntries: 10 });
    cache.updateVersion(1);
  });

  it('returns undefined on cache miss', () => {
    expect(cache.get('user1', 'can_view', 'report', 'r1')).toBeUndefined();
  });

  it('stores and retrieves a value', () => {
    cache.set('user1', 'can_view', 'report', 'r1', true);
    expect(cache.get('user1', 'can_view', 'report', 'r1')).toBe(true);
  });

  it('stores denied result', () => {
    cache.set('user1', 'can_edit', 'company', '42', false);
    expect(cache.get('user1', 'can_edit', 'company', '42')).toBe(false);
  });

  it('purges entire cache on version change', () => {
    cache.set('user1', 'can_view', 'report', 'r1', true);
    cache.set('user1', 'can_edit', 'report', 'r2', false);
    expect(cache.size).toBe(2);

    cache.updateVersion(2);
    expect(cache.size).toBe(0);
    expect(cache.get('user1', 'can_view', 'report', 'r1')).toBeUndefined();
  });

  it('does not purge on same version update', () => {
    cache.set('user1', 'can_view', 'report', 'r1', true);
    cache.updateVersion(1); // same version
    expect(cache.size).toBe(1);
    expect(cache.get('user1', 'can_view', 'report', 'r1')).toBe(true);
  });

  it('returns undefined after TTL expires', () => {
    vi.useFakeTimers();
    cache.set('user1', 'can_view', 'report', 'r1', true);
    expect(cache.get('user1', 'can_view', 'report', 'r1')).toBe(true);

    vi.advanceTimersByTime(6000); // past 5s TTL
    expect(cache.get('user1', 'can_view', 'report', 'r1')).toBeUndefined();
    vi.useRealTimers();
  });

  it('evicts oldest entry when maxEntries reached', () => {
    for (let i = 0; i < 10; i++) {
      cache.set('user1', 'can_view', 'report', `r${i}`, true);
    }
    expect(cache.size).toBe(10);

    // Add one more — should evict first entry
    cache.set('user1', 'can_view', 'report', 'r10', true);
    expect(cache.size).toBe(10);
    expect(cache.get('user1', 'can_view', 'report', 'r0')).toBeUndefined();
    expect(cache.get('user1', 'can_view', 'report', 'r10')).toBe(true);
  });

  it('clear() empties all entries', () => {
    cache.set('user1', 'can_view', 'report', 'r1', true);
    cache.set('user1', 'can_edit', 'report', 'r2', false);
    cache.clear();
    expect(cache.size).toBe(0);
  });

  it('different users get different cache entries', () => {
    cache.set('user1', 'can_view', 'report', 'r1', true);
    cache.set('user2', 'can_view', 'report', 'r1', false);
    expect(cache.get('user1', 'can_view', 'report', 'r1')).toBe(true);
    expect(cache.get('user2', 'can_view', 'report', 'r1')).toBe(false);
  });
});
