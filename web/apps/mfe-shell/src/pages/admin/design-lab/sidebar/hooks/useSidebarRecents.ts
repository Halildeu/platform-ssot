import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { useLocation } from "react-router-dom";

const STORAGE_KEY = "design-lab-recents";
const MAX_ITEMS = 10;

export type RecentItem = {
  name: string;
  layer: string;
  path: string;
  visitedAt: number; // epoch ms
};

/* ------------------------------------------------------------------ */
/*  External store                                                     */
/* ------------------------------------------------------------------ */
let snapshot: RecentItem[] = load();
const listeners = new Set<() => void>();

function load(): RecentItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RecentItem[]) : [];
  } catch {
    return [];
  }
}

function persist(items: RecentItem[]) {
  snapshot = items;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot() {
  return snapshot;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */
export function useSidebarRecents() {
  const recents = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const track = useCallback((item: Omit<RecentItem, "visitedAt">) => {
    const now = Date.now();
    const filtered = snapshot.filter((r) => r.name !== item.name);
    const next = [{ ...item, visitedAt: now }, ...filtered].slice(0, MAX_ITEMS);
    persist(next);
  }, []);

  const clear = useCallback(() => persist([]), []);

  return useMemo(() => ({ recents, track, clear }), [recents, track, clear]);
}

/* ------------------------------------------------------------------ */
/*  Auto-track hook — call in sidebar orchestrator                     */
/* ------------------------------------------------------------------ */
export function useSidebarAutoTrack(
  resolveItem: (
    pathname: string,
  ) => { name: string; layer: string } | null,
) {
  const location = useLocation();
  const { track } = useSidebarRecents();

  useEffect(() => {
    const item = resolveItem(location.pathname);
    if (item) {
      track({ ...item, path: location.pathname });
    }
  }, [location.pathname, resolveItem, track]);
}

/* ------------------------------------------------------------------ */
/*  Relative time helper                                               */
/* ------------------------------------------------------------------ */
export function formatRelativeTime(epochMs: number): string {
  const diff = Date.now() - epochMs;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
