/**
 * Design Lab Analytics — tracks usage patterns
 *
 * Captures:
 * - Page views (which components are viewed most)
 * - Search queries (what people look for)
 * - Time on page (engagement)
 * - Quality tab views (which quality metrics matter)
 * - Copy-to-clipboard actions (code snippets)
 *
 * Privacy-first: no PII, aggregate only, localStorage
 */

import { useCallback, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export interface AnalyticsEvent {
  type: "page_view" | "search" | "copy_snippet" | "quality_view" | "api_view";
  target: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface _TopItem<_T extends string> {
  [key: string]: unknown;
}

interface TopViewedItem {
  name: string;
  views: number;
}

interface TopSearchedItem {
  query: string;
  count: number;
}

interface EngagementSummary {
  totalViews: number;
  uniqueComponents: number;
  avgTimeMs: number;
}

/* ------------------------------------------------------------------ */
/*  Storage helpers                                                     */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "mfe-designlab-analytics";
const MAX_EVENTS = 10_000;

function readEvents(): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeEvents(events: AnalyticsEvent[]): void {
  try {
    // Keep only most recent events to bound storage
    const trimmed = events.length > MAX_EVENTS ? events.slice(-MAX_EVENTS) : events;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage full — silently skip
  }
}

/* ------------------------------------------------------------------ */
/*  Hook                                                                */
/* ------------------------------------------------------------------ */

export function useDesignLabAnalytics(): {
  track: (event: AnalyticsEvent) => void;
  getTopViewed: (limit?: number) => TopViewedItem[];
  getTopSearched: (limit?: number) => TopSearchedItem[];
  getEngagement: () => EngagementSummary;
  export: () => AnalyticsEvent[];
} {
  // Track page entry time for engagement calculation
  const pageEntryRef = useRef<number>(Date.now());

  const track = useCallback((event: AnalyticsEvent) => {
    const events = readEvents();
    events.push({
      ...event,
      timestamp: event.timestamp || new Date().toISOString(),
    });
    writeEvents(events);
  }, []);

  const getTopViewed = useCallback((limit = 10): TopViewedItem[] => {
    const events = readEvents();
    const counts = new Map<string, number>();

    for (const ev of events) {
      if (ev.type === "page_view") {
        counts.set(ev.target, (counts.get(ev.target) ?? 0) + 1);
      }
    }

    return Array.from(counts.entries())
      .map(([name, views]) => ({ name, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }, []);

  const getTopSearched = useCallback((limit = 10): TopSearchedItem[] => {
    const events = readEvents();
    const counts = new Map<string, number>();

    for (const ev of events) {
      if (ev.type === "search" && ev.target) {
        const query = ev.target.toLowerCase().trim();
        if (query) counts.set(query, (counts.get(query) ?? 0) + 1);
      }
    }

    return Array.from(counts.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }, []);

  const getEngagement = useCallback((): EngagementSummary => {
    const events = readEvents();
    const pageViews = events.filter((e) => e.type === "page_view");
    const uniqueTargets = new Set(pageViews.map((e) => e.target));

    // Estimate average time by looking at consecutive page_view timestamps
    let totalTime = 0;
    let timeCount = 0;

    for (let i = 1; i < pageViews.length; i++) {
      const curr = new Date(pageViews[i].timestamp).getTime();
      const prev = new Date(pageViews[i - 1].timestamp).getTime();
      const diff = curr - prev;
      // Only count reasonable session gaps (< 30 min)
      if (diff > 0 && diff < 30 * 60 * 1000) {
        totalTime += diff;
        timeCount++;
      }
    }

    return {
      totalViews: pageViews.length,
      uniqueComponents: uniqueTargets.size,
      avgTimeMs: timeCount > 0 ? Math.round(totalTime / timeCount) : 0,
    };
  }, []);

  const exportEvents = useCallback((): AnalyticsEvent[] => {
    return readEvents();
  }, []);

  return {
    track,
    getTopViewed,
    getTopSearched,
    getEngagement,
    export: exportEvents,
  };
}
