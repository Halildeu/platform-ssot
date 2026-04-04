/**
 * Dashboard State Persistence — URL + localStorage
 *
 * Syncs dashboard filter/zoom/selection state to URL params
 * and localStorage for session persistence.
 *
 * @see contract P7 DoD
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

export interface DashboardState {
  filters: Record<string, unknown>;
  zoom?: { start: number; end: number };
  selectedSeries?: string[];
  timeRange?: string;
  layout?: string;
}

export interface DashboardStateOptions {
  /** Dashboard ID for localStorage key */
  dashboardId: string;
  /** Sync to URL search params. @default true */
  syncUrl?: boolean;
  /** Sync to localStorage. @default true */
  syncStorage?: boolean;
  /** URL param prefix. @default 'ds_' */
  paramPrefix?: string;
}

const STORAGE_PREFIX = 'x-charts-dashboard-';

/** Serialize state to base64 URL-safe string */
export function serializeState(state: DashboardState): string {
  try {
    return btoa(JSON.stringify(state));
  } catch {
    return '';
  }
}

/** Deserialize state from base64 string */
export function deserializeState(encoded: string): DashboardState | null {
  try {
    return JSON.parse(atob(encoded)) as DashboardState;
  } catch {
    return null;
  }
}

export function useDashboardState(options: DashboardStateOptions) {
  const { dashboardId, syncUrl = true, syncStorage = true, paramPrefix = 'ds_' } = options;

  // Load initial state from URL or localStorage
  const initial = useMemo((): DashboardState => {
    if (typeof window === 'undefined') return { filters: {} };

    // Try URL first
    if (syncUrl) {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get(`${paramPrefix}state`);
      if (encoded) {
        const parsed = deserializeState(encoded);
        if (parsed) return parsed;
      }
    }

    // Try localStorage
    if (syncStorage) {
      try {
        const stored = localStorage.getItem(`${STORAGE_PREFIX}${dashboardId}`);
        if (stored) return JSON.parse(stored) as DashboardState;
      } catch { /* ignore */ }
    }

    return { filters: {} };
  }, [dashboardId, syncUrl, syncStorage, paramPrefix]);

  const [state, setState] = useState<DashboardState>(initial);

  // Persist to localStorage on change
  useEffect(() => {
    if (!syncStorage || typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${dashboardId}`, JSON.stringify(state));
    } catch { /* quota exceeded */ }
  }, [state, dashboardId, syncStorage]);

  // Sync to URL on change
  useEffect(() => {
    if (!syncUrl || typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const encoded = serializeState(state);
    if (encoded) {
      params.set(`${paramPrefix}state`, encoded);
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [state, syncUrl, paramPrefix]);

  const updateFilters = useCallback((filters: Record<string, unknown>) => {
    setState((prev) => ({ ...prev, filters: { ...prev.filters, ...filters } }));
  }, []);

  const updateZoom = useCallback((zoom: { start: number; end: number }) => {
    setState((prev) => ({ ...prev, zoom }));
  }, []);

  const reset = useCallback(() => {
    setState({ filters: {} });
    if (syncStorage) {
      try { localStorage.removeItem(`${STORAGE_PREFIX}${dashboardId}`); } catch { /* */ }
    }
  }, [dashboardId, syncStorage]);

  return { state, setState, updateFilters, updateZoom, reset };
}
