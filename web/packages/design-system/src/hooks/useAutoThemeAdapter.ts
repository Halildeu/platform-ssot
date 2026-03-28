/* ------------------------------------------------------------------ */
/*  useAutoThemeAdapter — auto-sync theme to AG Grid & Chart adapters  */
/*                                                                     */
/*  Reads CSS custom properties from the DOM and returns adapter       */
/*  configs that update automatically when theme axes change.          */
/*  Uses MutationObserver on <html> to detect data-* attribute changes.*/
/* ------------------------------------------------------------------ */

import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import type { GridThemeParams } from "../theme/adapters/grid-adapter";
import type { ChartColorConfig } from "../theme/adapters/chart-adapter";

/* ---- CSS variable reader ---- */

const getCSSVar = (name: string, fallback = ""): string => {
  if (typeof document === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
};

/* ---- Adapter builders (read from DOM CSS vars) ---- */

export function cssVarsToGridTheme(): GridThemeParams {
  return {
    headerBackgroundColor: getCSSVar("--surface-muted-bg", "#f8f9fa"),
    headerForegroundColor: getCSSVar("--text-primary", "#1e293b"),
    backgroundColor: getCSSVar("--surface-default-bg", "#ffffff"),
    foregroundColor: getCSSVar("--text-primary", "#1e293b"),
    borderColor: getCSSVar("--border-subtle", "#e2e8f0"),
    rowHoverColor: getCSSVar("--surface-muted-bg", "#f8f9fa"),
    selectedRowBackgroundColor: getCSSVar("--state-info-bg", "#eff6ff"),
    oddRowBackgroundColor: getCSSVar("--surface-default-bg", "#ffffff"),
    fontSize: "13px",
    headerFontSize: "12px",
  };
}

export function cssVarsToChartColors(): ChartColorConfig {
  return {
    primaryColor: getCSSVar("--action-primary-bg", "#3b82f6"),
    backgroundColor: getCSSVar("--surface-default-bg", "#ffffff"),
    textColor: getCSSVar("--text-primary", "#1e293b"),
    gridColor: getCSSVar("--border-subtle", "#e2e8f0"),
    tooltipBg: getCSSVar("--surface-raised-bg", "#ffffff"),
    tooltipText: getCSSVar("--text-primary", "#1e293b"),
    series: [
      getCSSVar("--action-primary-bg", "#3b82f6"),
      getCSSVar("--state-success-text", "#16a34a"),
      getCSSVar("--state-warning-text", "#d97706"),
      getCSSVar("--state-danger-text", "#dc2626"),
      getCSSVar("--state-info-text", "#2563eb"),
      getCSSVar("--text-secondary", "#64748b"),
    ],
  };
}

/* ---- External store for theme attribute changes ---- */

type ThemeSnapshot = number; // monotonic counter

let _snapshot: ThemeSnapshot = 0;
const _listeners = new Set<() => void>();
let _observerActive = false;

function setupObserver() {
  if (_observerActive || typeof document === "undefined") return;
  _observerActive = true;

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const observer = new MutationObserver(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      _snapshot++;
      _listeners.forEach((fn) => fn());
    }, 100);
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [
      "data-theme",
      "data-mode",
      "data-radius",
      "data-density",
      "data-elevation",
      "data-motion",
      "data-accent",
      "data-surface-tone",
      "data-table-surface-tone",
      "style",
    ],
  });
}

function subscribe(listener: () => void): () => void {
  setupObserver();
  _listeners.add(listener);
  return () => {
    _listeners.delete(listener);
  };
}

function getSnapshot(): ThemeSnapshot {
  return _snapshot;
}

function getServerSnapshot(): ThemeSnapshot {
  return 0;
}

/* ---- Hook ---- */

export interface AutoThemeAdapterResult {
  gridTheme: GridThemeParams;
  chartColors: ChartColorConfig;
}

/**
 * Hook that returns AG Grid and Chart theme configs derived from CSS custom
 * properties. Automatically re-computes when theme attributes change on <html>.
 *
 * @example
 * ```tsx
 * const { gridTheme, chartColors } = useAutoThemeAdapter();
 * <AgGridReact theme={gridTheme} />
 * ```
 */
export function useAutoThemeAdapter(): AutoThemeAdapterResult {
  const version = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const gridTheme = useMemo(() => cssVarsToGridTheme(), [version]);
  const chartColors = useMemo(() => cssVarsToChartColors(), [version]);

  return { gridTheme, chartColors };
}

export default useAutoThemeAdapter;
