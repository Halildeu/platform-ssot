/**
 * DesignLabEChartsPrintTheme — Print-Safe Grayscale + Pattern Theme
 *
 * Optimized for print and PDF export. All visual differentiation is
 * achieved via grayscale luminance + decal patterns, ensuring charts
 * remain readable on monochrome printers.
 *
 * Key design choices:
 *   - Monochrome palette only (no hue-based differentiation)
 *   - Decal patterns auto-applied to all area/bar/pie fills
 *   - No shadows, minimal border-radius
 *   - Larger text for print legibility (12pt minimum)
 *   - Transparent background (inherits paper color)
 *   - Animations disabled (static render for PDF)
 *
 * @see decisions/topics/chart-viz-engine-selection.v1.json (D-009)
 * @see colorblind-palettes.ts monochrome palette
 */

import { COLORBLIND_PALETTES } from './colorblind-palettes';
import { DECAL_PATTERNS } from './decal-patterns';

/* ------------------------------------------------------------------ */
/*  Print Theme Builder                                                */
/* ------------------------------------------------------------------ */

export interface PrintThemeOptions {
  /** Override font family for print. @default 'Georgia, Times, serif' */
  fontFamily?: string;
  /** Use patterns on area/bar fills for extra differentiation. @default true */
  useDecalPatterns?: boolean;
}

/**
 * Build a print-safe ECharts theme — grayscale only, pattern fills.
 *
 * Usage:
 * ```ts
 * const theme = buildDesignLabEChartsPrintTheme();
 * echarts.registerTheme('design-lab-print', theme);
 * ```
 */
export function buildDesignLabEChartsPrintTheme(options?: PrintThemeOptions): Record<string, unknown> {
  const {
    fontFamily = 'Georgia, "Times New Roman", Times, serif',
    useDecalPatterns = true,
  } = options ?? {};

  const textPrimary = '#000000';
  const textSecondary = '#333333';
  const textTertiary = '#666666';
  const borderDefault = '#000000';
  const borderLight = '#999999';

  const palette = COLORBLIND_PALETTES.monochrome;

  // Print decal patterns: darker for greyscale visibility
  const printDecals = useDecalPatterns
    ? DECAL_PATTERNS.map((p) => ({
        ...p,
        color: 'rgba(0,0,0,0.25)',
      }))
    : undefined;

  return {
    color: palette,
    backgroundColor: 'transparent',
    textStyle: {
      fontFamily,
      color: textPrimary,
      fontSize: 12,
    },
    title: {
      textStyle: {
        fontFamily,
        color: textPrimary,
        fontSize: 18,
        fontWeight: 700,
      },
      subtextStyle: {
        fontFamily,
        color: textSecondary,
        fontSize: 13,
        fontWeight: 400,
      },
      padding: [0, 0, 16, 0],
    },
    legend: {
      textStyle: {
        fontFamily,
        color: textPrimary,
        fontSize: 12,
      },
      pageTextStyle: { color: textSecondary },
      icon: 'roundRect',
      itemWidth: 14,
      itemHeight: 14,
      itemGap: 18,
    },
    tooltip: {
      // Tooltips invisible in print — but keep valid for screen preview
      backgroundColor: '#ffffff',
      borderColor: borderDefault,
      borderWidth: 1,
      textStyle: {
        fontFamily,
        color: textPrimary,
        fontSize: 12,
      },
      extraCssText: 'border-radius: 4px; padding: 8px 12px;',
    },
    categoryAxis: {
      axisLine: { lineStyle: { color: borderDefault, width: 1 } },
      axisTick: { lineStyle: { color: borderDefault, width: 1 } },
      axisLabel: { color: textPrimary, fontFamily, fontSize: 11 },
      splitLine: { lineStyle: { color: borderLight, type: 'dashed', width: 0.5 } },
      nameTextStyle: { color: textSecondary, fontFamily, fontSize: 11, fontWeight: 600 },
    },
    valueAxis: {
      axisLine: { show: true, lineStyle: { color: borderDefault, width: 1 } },
      axisTick: { show: true, lineStyle: { color: borderDefault } },
      axisLabel: { color: textPrimary, fontFamily, fontSize: 11 },
      splitLine: { lineStyle: { color: borderLight, type: 'dashed', width: 0.5 } },
      nameTextStyle: { color: textSecondary, fontFamily, fontSize: 11, fontWeight: 600 },
    },
    bar: {
      itemStyle: { borderRadius: 0, borderColor: borderDefault, borderWidth: 0.5 },
      barMaxWidth: 40,
    },
    line: {
      symbolSize: 6,
      symbol: 'circle',
      lineStyle: { width: 2 },
      smooth: false,
    },
    pie: {
      itemStyle: { borderColor: '#ffffff', borderWidth: 2 },
      label: { fontFamily, color: textPrimary, fontSize: 12 },
    },
    scatter: {
      symbolSize: 8,
      itemStyle: { borderColor: borderDefault, borderWidth: 1 },
    },
    gauge: {
      axisLine: { lineStyle: { color: [[1, borderLight]], width: 8 } },
      axisTick: { lineStyle: { color: textPrimary } },
      axisLabel: { color: textPrimary, fontSize: 11 },
      detail: { color: textPrimary, fontWeight: 700 },
    },
    radar: {
      axisLine: { lineStyle: { color: borderDefault } },
      splitLine: { lineStyle: { color: borderLight } },
      splitArea: { show: false },
      axisName: { color: textPrimary, fontWeight: 600 },
    },
    // Aria decal for pattern fills (print differentiation)
    ...(printDecals
      ? {
          aria: {
            enabled: true,
            decal: {
              show: true,
              decals: printDecals,
            },
          },
        }
      : {}),
    // No animations for print/PDF
    animation: false,
    animationDuration: 0,
    animationDurationUpdate: 0,
  };
}
