import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { TopCategoryId } from "../../reportingCategoryMap";

const STORAGE_KEY = "reporting-favorites";
const MAX_ITEMS = 20;

export type ReportingFavoriteItem = {
  id: string;
  title: string;
  topCategory: TopCategoryId;
  route: string;
};

/* ------------------------------------------------------------------ */
/*  External store — keeps all sidebar instances in sync               */
/* ------------------------------------------------------------------ */
let snapshot: ReportingFavoriteItem[] = load();
const listeners = new Set<() => void>();

function load(): ReportingFavoriteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ReportingFavoriteItem[]) : [];
  } catch {
    return [];
  }
}

function persist(items: ReportingFavoriteItem[]) {
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
export function useReportingSidebarFavorites() {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites],
  );

  const toggle = useCallback((item: ReportingFavoriteItem) => {
    const idx = snapshot.findIndex((f) => f.id === item.id);
    if (idx >= 0) {
      persist(snapshot.filter((_, i) => i !== idx));
    } else if (snapshot.length < MAX_ITEMS) {
      persist([item, ...snapshot]);
    }
  }, []);

  const reorder = useCallback((from: number, to: number) => {
    const next = [...snapshot];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    persist(next);
  }, []);

  const clear = useCallback(() => persist([]), []);

  return useMemo(
    () => ({ favorites, isFavorite, toggle, reorder, clear }),
    [favorites, isFavorite, toggle, reorder, clear],
  );
}
