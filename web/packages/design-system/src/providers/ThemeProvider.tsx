/* ------------------------------------------------------------------ */
/*  ThemeProvider — theme switching, persistence, CSS var injection     */
/*                                                                     */
/*  Wraps the imperative theme-controller into a React context so      */
/*  any component can read / write the current theme axes.             */
/* ------------------------------------------------------------------ */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ThemeAxes, ThemeAppearance, ThemeDensity } from "../theme/core/semantic-theme";
import { DEFAULT_THEME_AXES, THEME_ATTRIBUTE_MAP } from "../theme/core/semantic-theme";

/* ---------- Storage ---------- */

const STORAGE_KEY = "themeAxes";

function loadStoredAxes(): Partial<ThemeAxes> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<ThemeAxes>) : {};
  } catch {
    return {};
  }
}

function persistAxes(axes: ThemeAxes) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(axes));
  } catch {
    /* ignore */
  }
}

/* ---------- DOM application ---------- */

function applyAxesToDom(axes: ThemeAxes) {
  const root = typeof document !== "undefined" ? document.documentElement : null;
  if (!root) return;

  for (const [key, attr] of Object.entries(THEME_ATTRIBUTE_MAP)) {
    root.setAttribute(attr, String(axes[key as keyof ThemeAxes]));
  }

  const isDark = axes.appearance === "dark" || axes.appearance === "high-contrast";
  root.setAttribute("data-mode", isDark ? "dark" : "light");
  root.style.setProperty("--overlay-intensity", String(axes.overlayIntensity));
  root.style.setProperty("--overlay-opacity", (axes.overlayOpacity / 100).toString());
}

/* ---------- Context ---------- */

export interface ThemeContextValue {
  axes: ThemeAxes;
  update: (patch: Partial<ThemeAxes>) => void;
  setAppearance: (v: ThemeAppearance) => void;
  setDensity: (v: ThemeDensity) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}

/* ---------- Provider ---------- */

export interface ThemeProviderProps {
  /** Override default axes */
  defaultAxes?: Partial<ThemeAxes>;
  children: React.ReactNode;
}

export function ThemeProvider({ defaultAxes, children }: ThemeProviderProps) {
  const [axes, setAxes] = useState<ThemeAxes>(() => ({
    ...DEFAULT_THEME_AXES,
    ...defaultAxes,
    ...loadStoredAxes(),
  }));

  const update = useCallback((patch: Partial<ThemeAxes>) => {
    setAxes((prev) => {
      const next = { ...prev, ...patch };
      applyAxesToDom(next);
      persistAxes(next);
      return next;
    });
  }, []);

  const setAppearance = useCallback(
    (v: ThemeAppearance) => update({ appearance: v }),
    [update],
  );

  const setDensity = useCallback(
    (v: ThemeDensity) => update({ density: v }),
    [update],
  );

  // Apply on mount
  useEffect(() => {
    applyAxesToDom(axes);
  }, []); // mount-only: axes applied once on initial render

  const value = useMemo<ThemeContextValue>(
    () => ({ axes, update, setAppearance, setDensity }),
    [axes, update, setAppearance, setDensity],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
