import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "design-lab-favorites";
const MAX_ITEMS = 20;

type FavoriteItem = { name: string; layer: string; path: string };

/* ------------------------------------------------------------------ */
/*  Tiny external store so all sidebar instances stay in sync          */
/* ------------------------------------------------------------------ */
let snapshot: FavoriteItem[] = load();
const listeners = new Set<() => void>();

function load(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FavoriteItem[]) : [];
  } catch {
    return [];
  }
}

function persist(items: FavoriteItem[]) {
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
export function useSidebarFavorites() {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const isFavorite = useCallback(
    (name: string) => favorites.some((f) => f.name === name),
    [favorites],
  );

  const toggle = useCallback(
    (item: FavoriteItem) => {
      const exists = snapshot.findIndex((f) => f.name === item.name);
      if (exists >= 0) {
        persist(snapshot.filter((_, i) => i !== exists));
      } else if (snapshot.length < MAX_ITEMS) {
        persist([item, ...snapshot]);
      }
    },
    [],
  );

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
