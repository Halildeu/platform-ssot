/**
 * RTL (Right-to-Left) Support — Research Spike + Basic Implementation
 *
 * ECharts has limited native RTL support. This module provides:
 *   1. RTL detection from DOM or locale
 *   2. ECharts option transforms for RTL layout
 *   3. CSS direction hints for chart containers
 *
 * Known limitations (documented per contract):
 *   - ECharts legend does not natively support RTL text alignment
 *   - Axis label positioning is partially RTL-aware
 *   - Full RTL (Arabic/Hebrew text shaping) deferred to P8
 *
 * @see ChartSpec.locale.rtl field
 * @see P8 DoD: "Full RTL implementation (Arabic, Hebrew layout)"
 */

/** RTL locale codes (BCP 47 language tags with inherent RTL direction) */
const RTL_LANGUAGES = new Set(['ar', 'he', 'fa', 'ur', 'ps', 'yi', 'ku']);

/**
 * Detect if a locale is RTL from its BCP 47 code.
 */
export function isRTLLocale(locale: string): boolean {
  const lang = locale.split('-')[0].toLowerCase();
  return RTL_LANGUAGES.has(lang);
}

/**
 * Detect RTL from the DOM `dir` attribute or locale.
 */
export function isRTL(locale?: string): boolean {
  if (typeof document !== 'undefined') {
    const dir = document.documentElement.getAttribute('dir');
    if (dir === 'rtl') return true;
    if (dir === 'ltr') return false;
  }
  return locale ? isRTLLocale(locale) : false;
}

/**
 * Apply RTL transforms to an ECharts option object.
 *
 * Mirrors:
 *   - x-axis label alignment
 *   - Legend position (right → left)
 *   - Title alignment
 *   - Tooltip position preference
 *
 * Does NOT handle:
 *   - Bidirectional text shaping (deferred to P8)
 *   - Complex Arabic/Hebrew ligatures in labels
 */
export function applyRTLTransforms(option: Record<string, unknown>): Record<string, unknown> {
  const rtlOption = { ...option };

  // Mirror title alignment
  if (rtlOption.title) {
    const title = { ...(rtlOption.title as Record<string, unknown>) };
    title.left = 'right';
    title.textAlign = 'right';
    rtlOption.title = title;
  }

  // Mirror legend position
  if (rtlOption.legend) {
    const legend = { ...(rtlOption.legend as Record<string, unknown>) };
    if (!legend.left && !legend.right) {
      legend.right = 0;
    }
    rtlOption.legend = legend;
  }

  // Mirror grid alignment
  if (rtlOption.grid) {
    const grid = { ...(rtlOption.grid as Record<string, unknown>) };
    const origLeft = grid.left;
    grid.left = grid.right ?? '10%';
    grid.right = origLeft ?? '10%';
    rtlOption.grid = grid;
  }

  return rtlOption;
}

/**
 * Get CSS direction styles for the chart container div.
 */
export function getRTLContainerStyle(rtl: boolean): React.CSSProperties {
  return rtl ? { direction: 'rtl' } : {};
}

// Type import only — no runtime React dependency in this file
import type React from 'react';
