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
    headerBackgroundColor: getCSSVar("--surface-muted-bg", "var(--surface-muted)"),
    headerForegroundColor: getCSSVar("--text-primary", "var(--text-primary)"),
    backgroundColor: getCSSVar("--surface-default-bg", "var(--surface-default)"),
    foregroundColor: getCSSVar("--text-primary", "var(--text-primary)"),
    borderColor: getCSSVar("--border-subtle", "var(--border-subtle)"),
    rowHoverColor: getCSSVar("--surface-muted-bg", "var(--surface-muted)"),
    selectedRowBackgroundColor: getCSSVar("--state-info-bg", "var(--state-info-bg)"),
    oddRowBackgroundColor: getCSSVar("--surface-default-bg", "var(--surface-default)"),
    fontSize: "13px",
    headerFontSize: "12px",
  };
}

export function cssVarsToChartColors(): ChartColorConfig {
  return {
    primaryColor: getCSSVar("--action-primary-bg", "var(--action-primary)"),
    backgroundColor: getCSSVar("--surface-default-bg", "var(--surface-default)"),
    textColor: getCSSVar("--text-primary", "var(--text-primary)"),
    gridColor: getCSSVar("--border-subtle", "var(--border-subtle)"),
    tooltipBg: getCSSVar("--surface-raised-bg", "var(--surface-default)"),
    tooltipText: getCSSVar("--text-primary", "var(--text-primary)"),
    series: [
      getCSSVar("--action-primary-bg", "var(--action-primary)"),
      getCSSVar("--state-success-text", "var(--state-success-text)"),
      getCSSVar("--state-warning-text", "var(--state-warning-text)"),
      getCSSVar("--state-danger-text", "var(--state-danger-text)"),
      getCSSVar("--state-info-text", "var(--action-primary)"),
      getCSSVar("--text-secondary", "var(--text-secondary)"),
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
