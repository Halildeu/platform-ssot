import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { useLocation } from "react-router-dom";
import type { TopCategoryId } from "../../reportingCategoryMap";

const STORAGE_KEY = "reporting-recents";
const MAX_ITEMS = 10;

export type ReportingRecentItem = {
  id: string;
  title: string;
  topCategory: TopCategoryId;
  route: string;
  visitedAt: number;
};

/* ------------------------------------------------------------------ */
/*  External store                                                     */
/* ------------------------------------------------------------------ */
let snapshot: ReportingRecentItem[] = load();
const listeners = new Set<() => void>();

function load(): ReportingRecentItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ReportingRecentItem[]) : [];
  } catch {
    return [];
  }
}

function persist(items: ReportingRecentItem[]) {
  snapshot = items;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

function getSnapshot() {
  return snapshot;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */
export function useReportingSidebarRecents() {
  const recents = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const track = useCallback(
    (item: Omit<ReportingRecentItem, "visitedAt">) => {
      const now = Date.now();
      const filtered = snapshot.filter((r) => r.id !== item.id);
      const next = [{ ...item, visitedAt: now }, ...filtered].slice(0, MAX_ITEMS);
      persist(next);
    },
    [],
  );

  const clear = useCallback(() => persist([]), []);

  return useMemo(() => ({ recents, track, clear }), [recents, track, clear]);
}

/* ------------------------------------------------------------------ */
/*  Auto-track hook                                                    */
/* ------------------------------------------------------------------ */
export function useReportingSidebarAutoTrack(
  resolveItem: (pathname: string) => Omit<ReportingRecentItem, "visitedAt"> | null,
) {
  const location = useLocation();
  const { track } = useReportingSidebarRecents();

  useEffect(() => {
    const item = resolveItem(location.pathname);
    if (item) track(item);
  }, [location.pathname, resolveItem, track]);
}

/* ------------------------------------------------------------------ */
/*  Relative time helper                                               */
/* ------------------------------------------------------------------ */
export function formatRelativeTime(epochMs: number): string {
  const diff = Date.now() - epochMs;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "az once";
  if (mins < 60) return `${mins}dk once`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}sa once`;
  const days = Math.floor(hours / 24);
  return `${days}g once`;
}
