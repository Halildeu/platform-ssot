"use client";

/* ------------------------------------------------------------------ */
/*  @mfe/design-system — Unified design system                         */
/*                                                                     */
/*  Tiered barrel export:                                              */
/*    tokens/      — color, spacing, radius, typography, motion, z     */
/*    theme/       — light, dark, adapters (ui, grid, chart)           */
/*    providers/   — DesignSystemProvider, ThemeProvider, Locale, Dir   */
/*    primitives/  — Button, Text, Input, Badge, ...                   */
/*    components/  — DatePicker, Tabs, Accordion, ...                  */
/*    patterns/    — PageHeader, FormDrawer, DetailDrawer, ...         */
/*    advanced/    — EntityGrid, AG Grid, Charts, ...                  */
/* ------------------------------------------------------------------ */

/* ---- Utils ---- */
export { cn } from "./utils";

/* ---- Access Control ---- */
export {
  resolveAccessState,
  shouldBlockInteraction,
  withAccessGuard,
} from "./internal/access-controller";
export type {
  AccessLevel,
  AccessControlledProps,
  AccessResolution,
} from "./internal/access-controller";

/* ---- Tokens ---- */
export * from "./tokens";

/* ---- Theme ---- */
export * from "./theme";

/* ---- Providers ---- */
export * from "./providers";

/* ---- Hooks ---- */
export { useBreakpoint, BREAKPOINTS } from "./hooks/useBreakpoint";
export type { BreakpointKey, UseBreakpointReturn } from "./hooks/useBreakpoint";
export { useDownloadWithProgress } from "./hooks/useDownloadWithProgress";
export type { DownloadWithProgressOptions, DownloadProgressEvent } from "./hooks/useDownloadWithProgress";

/* ---- Primitives ---- */
export * from "./primitives";

/* ---- Components ---- */
export * from "./components";

/* ---- Patterns ---- */
export * from "./patterns";

/* ---- Advanced ---- */
// Re-exported from barrel for backward compatibility.
// For tree-shaking, prefer deep imports: "@mfe/design-system/advanced/data-grid"
export * from "./advanced";

/* ---- Icons ---- */
// For tree-shaking, prefer deep imports: "@mfe/design-system/icons"
export * from "./icons";

/* ---- Lib (utilities) ---- */
export * from "./lib";

/* ---- A11y (Accessibility Engine) ---- */
export * from "./a11y";

/* ---- Performance ---- */
export * from "./performance";

/* ---- MCP (Model Context Protocol) ---- */
export * from "./mcp";
