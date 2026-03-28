/**
 * @mfe/design-system/server
 *
 * Server-safe exports for React Server Components (RSC).
 * This entry point contains NO "use client" directive and can be
 * imported directly in server components without creating a client boundary.
 *
 * Includes: tokens, theme constants, icons, pure utilities, presentational components.
 * Does NOT include: interactive components, providers, hooks, theme-controller,
 *                    or browser-dependent code (document, window, localStorage).
 */

// ── Tokens (pure data, zero runtime) ────────────────────────────────
export * from './tokens';

// ── Theme constants & pure data (no browser APIs) ───────────────────
export { lightTheme } from './theme/core/light';
export { darkTheme } from './theme/core/dark';
export {
  DEFAULT_THEME_AXES,
  THEME_ATTRIBUTE_MAP,
} from './theme/core/semantic-theme';
export type {
  ThemeAppearance,
  ThemeDensity,
  ThemeRadius,
  ThemeElevation,
  ThemeMotion,
  ThemeContrastRatio,
  ThemeAccent,
  ThemeSurfaceTone,
  TableSurfaceTone,
  ThemeAxes,
} from './theme/core/semantic-theme';

// Theme contract (pure functions, lazy JSON load with fallback)
export { getThemeContract, resolveThemeModeKey } from './theme/core/theme-contract';
export type { ThemeContract } from './theme/core/theme-contract';

// Theme adapters — pure mapping functions (no DOM access)
export { tokenSetToCss } from './theme/adapters/ui-adapter';
export { tokenSetToGridTheme } from './theme/adapters/grid-adapter';
export type { GridThemeParams } from './theme/adapters/grid-adapter';
export { tokenSetToChartColors } from './theme/adapters/chart-adapter';
export type { ChartColorConfig } from './theme/adapters/chart-adapter';

// ── Icons (SVG components, server-renderable) ───────────────────────
export * from './icons';

// ── Utilities (pure functions) ──────────────────────────────────────
export { cn } from './utils/cn';
