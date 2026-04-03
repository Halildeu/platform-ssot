import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import type { SearchableItem } from './header-search.config';

const STORAGE_KEY = 'shell.recentPages';
const MAX_ENTRIES = 10;

interface RecentEntry {
  path: string;
  ts: number;
}

function readRecent(): RecentEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRecent(entries: RecentEntry[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch { /* storage full or unavailable */ }
}

/**
 * Track recent page visits and expose them as searchable items.
 * Writes to localStorage on every pathname change (deduped, max 10).
 */
export function useRecentPages(): { recentPages: SearchableItem[] } {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!pathname || pathname === '/login' || pathname === '/register' || pathname === '/unauthorized') return;
    const entries = readRecent();
    const filtered = entries.filter((e) => e.path !== pathname);
    filtered.unshift({ path: pathname, ts: Date.now() });
    writeRecent(filtered);
  }, [pathname]);

  const recentPages = useMemo<SearchableItem[]>(() => {
    const entries = readRecent();
    return entries.slice(0, 5).map((entry, i) => ({
      id: `recent-${i}`,
      titleKey: entry.path,
      group: 'navigation' as const,
      path: entry.path,
      keywords: [entry.path],
    }));
  }, [pathname]);

  return { recentPages };
}
