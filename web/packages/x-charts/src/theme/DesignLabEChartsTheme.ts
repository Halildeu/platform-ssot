/**
 * DesignLabEChartsTheme — Design Token → ECharts Theme Adapter
 *
 * Maps Design Lab tokens (CSS custom properties from figma.tokens.json)
 * to ECharts theme format. This is the SINGLE integration point for
 * visual consistency between the design system and ECharts rendering.
 *
 * @see decisions/topics/chart-viz-engine-selection.v1.json (D-009)
 * @see chart-theme-bridge.ts (AG Charts version — reference for token names)
 */

import type { ColorblindPalette } from '../spec/ChartSpec';
import { COLORBLIND_PALETTES } from './colorblind-palettes';

/* ------------------------------------------------------------------ */
/*  CSS Variable Reader                                                */
/* ------------------------------------------------------------------ */

const getCSSVar = (varName: string, fallback: string): string => {
  if (typeof document === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return value || fallback;
};

/* ------------------------------------------------------------------ */
/*  ECharts Theme Object Builder                                       */
/* ------------------------------------------------------------------ */

export interface DesignLabThemeOptions {
  /** Colorblind-safe palette selection. @default 'default' */
  colorblindPalette?: ColorblindPalette;
  /** Enable dark mode. Auto-detected from data-theme attribute if not set. */
  dark?: boolean;
  /** Override font family. */
  fontFamily?: string;
}

/**
 * Build an ECharts theme object from Design Lab CSS custom properties.
 *
 * Usage:
 * ```ts
 * const theme = buildDesignLabEChartsTheme();
 * echarts.registerTheme('design-lab', theme);
 * ```
 */
export function buildDesignLabEChartsTheme(options?: DesignLabThemeOptions): Record<string, unknown> {
  const {
    colorblindPalette = 'default',
    fontFamily: fontFamilyOverride,
  } = options ?? {};

  // Read tokens
  const fontFamily = fontFamilyOverride ?? getCSSVar('--font-family-sans', 'Inter, system-ui, sans-serif');
  const textPrimary = getCSSVar('--text-primary', '#1a1a2e');
  const textSecondary = getCSSVar('--text-secondary', '#6b7280');
  const textTertiary = getCSSVar('--text-tertiary', '#9ca3af');
  const bgSurface = getCSSVar('--bg-surface', '#ffffff');
  const bgMuted = getCSSVar('--bg-muted', '#f9fafb');
  const borderDefault = getCSSVar('--border-default', '#e5e7eb');
  const actionPrimary = getCSSVar('--action-primary', '#3b82f6');

  // Color palette
  const palette = colorblindPalette === 'default'
    ? [
        getCSSVar('--action-primary', '#3b82f6'),
        getCSSVar('--state-success-text', '#22c55e'),
        getCSSVar('--state-warning-text', '#f59e0b'),
        getCSSVar('--state-error-text', '#ef4444'),
        getCSSVar('--state-info-text', '#06b6d4'),
        getCSSVar('--action-secondary', '#8b5cf6'),
        '#ec4899', '#14b8a6', '#f97316', '#6366f1',
      ]
    : COLORBLIND_PALETTES[colorblindPalette] ?? COLORBLIND_PALETTES.deuteranopia;

  return {
    color: palette,
    backgroundColor: 'transparent',
    textStyle: {
      fontFamily,
      color: textPrimary,
    },
    title: {
      textStyle: {
        fontFamily,
        color: textPrimary,
        fontSize: 16,
        fontWeight: 600,
      },
      subtextStyle: {
        fontFamily,
        color: textSecondary,
        fontSize: 13,
      },
      padding: [0, 0, 12, 0],
    },
    legend: {
      textStyle: {
        fontFamily,
        color: textPrimary,
        fontSize: 12,
      },
      pageTextStyle: { color: textSecondary },
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 16,
    },
    tooltip: {
      backgroundColor: bgSurface,
      borderColor: borderDefault,
      borderWidth: 1,
      textStyle: {
        fontFamily,
        color: textPrimary,
        fontSize: 13,
      },
      extraCssText: 'box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;',
    },
    categoryAxis: {
      axisLine: { lineStyle: { color: borderDefault } },
      axisTick: { lineStyle: { color: borderDefault } },
      axisLabel: { color: textSecondary, fontFamily, fontSize: 11 },
      splitLine: { lineStyle: { color: bgMuted, type: 'dashed' } },
      nameTextStyle: { color: textTertiary, fontFamily, fontSize: 11 },
    },
    valueAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: textSecondary, fontFamily, fontSize: 11 },
      splitLine: { lineStyle: { color: bgMuted, type: 'dashed' } },
      nameTextStyle: { color: textTertiary, fontFamily, fontSize: 11 },
    },
    bar: {
      itemStyle: { borderRadius: [4, 4, 0, 0] },
      barMaxWidth: 40,
    },
    line: {
      symbolSize: 6,
      symbol: 'circle',
      lineStyle: { width: 2 },
      smooth: false,
    },
    pie: {
      itemStyle: { borderColor: bgSurface, borderWidth: 2 },
      label: { fontFamily, color: textPrimary, fontSize: 12 },
    },
    scatter: {
      symbolSize: 8,
    },
    // Animation defaults (overridden by ChartSpec.animation)
    animationDuration: 500,
    animationEasing: 'cubicOut',
    animationDurationUpdate: 300,
  };
}
