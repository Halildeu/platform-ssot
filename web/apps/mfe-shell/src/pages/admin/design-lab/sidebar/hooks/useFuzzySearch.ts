import { useMemo, useState, useCallback, useRef, useEffect } from "react";

const STORAGE_KEY = "design-lab-recent-searches";
const MAX_RECENT = 5;

export type HighlightRange = [start: number, end: number];

export type FuzzyResult<T> = {
  item: T;
  score: number;
  ranges: HighlightRange[];
};

/* ------------------------------------------------------------------ */
/*  Fuzzy match — no external dependency                               */
/*  Scores: exact prefix > substring > character-skip (fuzzy)          */
/* ------------------------------------------------------------------ */
function fuzzyMatch(query: string, target: string): { score: number; ranges: HighlightRange[] } | null {
  const q = query.toLowerCase();
  const t = target.toLowerCase();

  // Exact prefix match (highest score)
  if (t.startsWith(q)) {
    return { score: 100, ranges: [[0, q.length]] };
  }

  // Substring match
  const subIdx = t.indexOf(q);
  if (subIdx >= 0) {
    return { score: 80 - subIdx, ranges: [[subIdx, subIdx + q.length]] };
  }

  // Fuzzy character match (each query char must appear in order)
  const ranges: HighlightRange[] = [];
  let qi = 0;
  let lastMatchIdx = -1;
  let gapPenalty = 0;

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      if (ranges.length > 0 && ranges[ranges.length - 1][1] === ti) {
        // Extend previous range (consecutive chars)
        ranges[ranges.length - 1][1] = ti + 1;
      } else {
        ranges.push([ti, ti + 1]);
        if (lastMatchIdx >= 0) gapPenalty += ti - lastMatchIdx - 1;
      }
      lastMatchIdx = ti;
      qi++;
    }
  }

  if (qi < q.length) return null; // Not all chars matched

  const score = Math.max(1, 60 - gapPenalty * 3 - (ranges[0]?.[0] ?? 0) * 2);
  return { score, ranges };
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */
export function useFuzzySearch<T extends { name: string }>(
  items: T[],
  options?: { minScore?: number; debounceMs?: number },
) {
  const { minScore = 10, debounceMs = 150 } = options ?? {};
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounce
  useEffect(() => {
    timerRef.current = setTimeout(() => setDebouncedQuery(query), debounceMs);
    return () => clearTimeout(timerRef.current);
  }, [query, debounceMs]);

  // Search
  const results = useMemo<FuzzyResult<T>[]>(() => {
    if (!debouncedQuery.trim()) return [];

    const matches: FuzzyResult<T>[] = [];
    for (const item of items) {
      const match = fuzzyMatch(debouncedQuery, item.name);
      if (match && match.score >= minScore) {
        matches.push({ item, ...match });
      }
    }

    return matches.sort((a, b) => b.score - a.score);
  }, [items, debouncedQuery, minScore]);

  // Recent searches
  const recentSearches = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  }, []);

  const saveSearch = useCallback((q: string) => {
    if (!q.trim()) return;
    try {
      const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
      const next = [q, ...prev.filter((s) => s !== q)].slice(0, MAX_RECENT);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* noop */
    }
  }, []);

  const clear = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
  }, []);

  const isSearching = debouncedQuery.trim().length > 0;

  return useMemo(
    () => ({
      query,
      setQuery,
      results,
      isSearching,
      clear,
      recentSearches,
      saveSearch,
    }),
    [query, setQuery, results, isSearching, clear, recentSearches, saveSearch],
  );
}

/* ------------------------------------------------------------------ */
/*  Highlight helper — renders text with <mark> tags for ranges        */
/* ------------------------------------------------------------------ */
export function highlightText(
  text: string,
  ranges: HighlightRange[],
): Array<{ text: string; highlighted: boolean }> {
  if (!ranges.length) return [{ text, highlighted: false }];

  const parts: Array<{ text: string; highlighted: boolean }> = [];
  let cursor = 0;

  for (const [start, end] of ranges) {
    if (cursor < start) {
      parts.push({ text: text.slice(cursor, start), highlighted: false });
    }
    parts.push({ text: text.slice(start, end), highlighted: true });
    cursor = end;
  }

  if (cursor < text.length) {
    parts.push({ text: text.slice(cursor), highlighted: false });
  }

  return parts;
}
