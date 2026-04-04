/**
 * Dashboard Sharing — URL state serialization
 *
 * @see contract P7 DoD: "Dashboard sharing (URL state serialization)"
 */

import { serializeState, deserializeState } from './dashboard-state';
import type { DashboardState } from './dashboard-state';
import { useCallback } from 'react';

export interface ShareConfig {
  /** Base URL for sharing. @default current window.location.origin + pathname */
  baseUrl?: string;
  /** URL param name for state. @default 'share' */
  paramName?: string;
}

/**
 * Create a shareable URL with embedded dashboard state.
 */
export function createShareUrl(state: DashboardState, config?: ShareConfig): string {
  const base = config?.baseUrl ?? (typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '');
  const param = config?.paramName ?? 'share';
  const encoded = serializeState(state);
  return `${base}?${param}=${encodeURIComponent(encoded)}`;
}

/**
 * Parse dashboard state from a share URL.
 */
export function parseShareUrl(url: string, config?: ShareConfig): DashboardState | null {
  const param = config?.paramName ?? 'share';
  try {
    const u = new URL(url);
    const encoded = u.searchParams.get(param);
    if (!encoded) return null;
    return deserializeState(decodeURIComponent(encoded));
  } catch {
    return null;
  }
}

/**
 * Hook for dashboard sharing actions.
 */
export function useDashboardSharing(config?: ShareConfig) {
  const share = useCallback(
    async (state: DashboardState): Promise<string> => {
      const url = createShareUrl(state, config);

      // Try clipboard copy
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(url);
        } catch { /* clipboard not available */ }
      }

      return url;
    },
    [config],
  );

  const load = useCallback(
    (url?: string): DashboardState | null => {
      const target = url ?? (typeof window !== 'undefined' ? window.location.href : '');
      return parseShareUrl(target, config);
    },
    [config],
  );

  return { share, load };
}
