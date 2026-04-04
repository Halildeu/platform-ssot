/**
 * Contract Tests: Dark Mode, High Contrast & Print Themes
 *
 * Validates:
 *   - Theme builder functions return valid ECharts theme objects
 *   - Color palettes, font families, and accessibility properties
 *   - Dark mode detection (isDarkMode)
 *   - Print theme disables animation and enables decal patterns
 *   - High contrast theme uses wider strokes and bolder text
 *   - Colorblind palette override works across all themes
 *
 * @see chart-viz-engine-selection D-009
 * @see contract P3-B DoD
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { buildDesignLabEChartsDarkTheme, isDarkMode } from '../theme/DesignLabEChartsDarkTheme';
import { buildDesignLabEChartsHighContrastTheme } from '../theme/DesignLabEChartsHighContrastTheme';
import { buildDesignLabEChartsPrintTheme } from '../theme/DesignLabEChartsPrintTheme';
import { buildDesignLabEChartsTheme } from '../theme/DesignLabEChartsTheme';
import { COLORBLIND_PALETTES } from '../theme/colorblind-palettes';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function assertThemeStructure(theme: Record<string, unknown>) {
  expect(theme).toBeDefined();
  expect(theme.color).toBeDefined();
  expect(Array.isArray(theme.color)).toBe(true);
  expect((theme.color as string[]).length).toBeGreaterThanOrEqual(8);
  expect(theme.textStyle).toBeDefined();
  expect(theme.title).toBeDefined();
  expect(theme.legend).toBeDefined();
  expect(theme.tooltip).toBeDefined();
  expect(theme.categoryAxis).toBeDefined();
  expect(theme.valueAxis).toBeDefined();
  expect(theme.bar).toBeDefined();
  expect(theme.line).toBeDefined();
  expect(theme.pie).toBeDefined();
  expect(theme.scatter).toBeDefined();
  expect(theme.backgroundColor).toBe('transparent');
}

function getTextColor(theme: Record<string, unknown>): string {
  return (theme.textStyle as Record<string, unknown>).color as string;
}

function getTitleFontWeight(theme: Record<string, unknown>): number {
  return ((theme.title as Record<string, unknown>).textStyle as Record<string, unknown>).fontWeight as number;
}

function getLineWidth(theme: Record<string, unknown>): number {
  return ((theme.line as Record<string, unknown>).lineStyle as Record<string, unknown>).width as number;
}

/* ================================================================== */
/*  Dark Theme                                                         */
/* ================================================================== */

describe('buildDesignLabEChartsDarkTheme', () => {
  it('returns a valid theme structure', () => {
    const theme = buildDesignLabEChartsDarkTheme();
    assertThemeStructure(theme);
  });

  it('uses brighter default palette colors for dark backgrounds', () => {
    const theme = buildDesignLabEChartsDarkTheme();
    const palette = theme.color as string[];
    // Default dark palette uses lighter shades (400-level Tailwind)
    expect(palette[0]).toBe('#60a5fa'); // lighter blue than light theme's #3b82f6
  });

  it('has light text for dark background', () => {
    const theme = buildDesignLabEChartsDarkTheme();
    expect(getTextColor(theme)).toBe('#e5e7eb');
  });

  it('tooltip has dark surface bg', () => {
    const theme = buildDesignLabEChartsDarkTheme();
    const tooltip = theme.tooltip as Record<string, unknown>;
    expect(tooltip.backgroundColor).toBe('#1f2937');
  });

  it('supports colorblind palette override', () => {
    const theme = buildDesignLabEChartsDarkTheme({ colorblindPalette: 'deuteranopia' });
    expect(theme.color).toEqual(COLORBLIND_PALETTES.deuteranopia);
  });

  it('supports font family override', () => {
    const theme = buildDesignLabEChartsDarkTheme({ fontFamily: 'Fira Code, monospace' });
    expect((theme.textStyle as Record<string, unknown>).fontFamily).toBe('Fira Code, monospace');
  });

  it('includes gauge and radar configs for enterprise charts', () => {
    const theme = buildDesignLabEChartsDarkTheme();
    expect(theme.gauge).toBeDefined();
    expect(theme.radar).toBeDefined();
  });

  it('splitLine has low opacity for dark mode subtlety', () => {
    const theme = buildDesignLabEChartsDarkTheme();
    const catAxis = theme.categoryAxis as Record<string, unknown>;
    const splitLine = (catAxis.splitLine as Record<string, unknown>).lineStyle as Record<string, unknown>;
    expect(splitLine.opacity).toBe(0.3);
  });
});

/* ================================================================== */
/*  isDarkMode detection                                               */
/* ================================================================== */

describe('isDarkMode', () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    window.matchMedia = originalMatchMedia;
  });

  it('returns true when data-theme="dark"', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    expect(isDarkMode()).toBe(true);
  });

  it('returns false when data-theme="light"', () => {
    document.documentElement.setAttribute('data-theme', 'light');
    expect(isDarkMode()).toBe(false);
  });

  it('returns false when no data-theme and prefers-color-scheme is light', () => {
    document.documentElement.removeAttribute('data-theme');
    window.matchMedia = ((query: string) => ({ matches: false, media: query })) as typeof window.matchMedia;
    expect(isDarkMode()).toBe(false);
  });

  it('returns true when no data-theme but prefers-color-scheme is dark', () => {
    document.documentElement.removeAttribute('data-theme');
    window.matchMedia = ((query: string) => ({ matches: true, media: query })) as typeof window.matchMedia;
    expect(isDarkMode()).toBe(true);
  });
});

/* ================================================================== */
/*  High Contrast Theme                                                */
/* ================================================================== */

describe('buildDesignLabEChartsHighContrastTheme', () => {
  it('returns a valid theme structure', () => {
    const theme = buildDesignLabEChartsHighContrastTheme();
    assertThemeStructure(theme);
  });

  it('uses black text on light mode (maximum contrast)', () => {
    const theme = buildDesignLabEChartsHighContrastTheme({ dark: false });
    expect(getTextColor(theme)).toBe('#000000');
  });

  it('uses white text on dark mode', () => {
    const theme = buildDesignLabEChartsHighContrastTheme({ dark: true });
    expect(getTextColor(theme)).toBe('#ffffff');
  });

  it('uses bolder title weight than standard theme', () => {
    const hcTheme = buildDesignLabEChartsHighContrastTheme();
    const stdTheme = buildDesignLabEChartsTheme();
    expect(getTitleFontWeight(hcTheme)).toBeGreaterThanOrEqual(getTitleFontWeight(stdTheme));
  });

  it('uses wider line strokes than standard theme', () => {
    const hcTheme = buildDesignLabEChartsHighContrastTheme();
    const stdTheme = buildDesignLabEChartsTheme();
    expect(getLineWidth(hcTheme)).toBeGreaterThan(getLineWidth(stdTheme));
  });

  it('categoryAxis line is visible with width 2', () => {
    const theme = buildDesignLabEChartsHighContrastTheme();
    const catAxis = theme.categoryAxis as Record<string, unknown>;
    const axisLine = (catAxis.axisLine as Record<string, unknown>).lineStyle as Record<string, unknown>;
    expect(axisLine.width).toBe(2);
  });

  it('valueAxis is visible (unlike standard theme)', () => {
    const theme = buildDesignLabEChartsHighContrastTheme();
    const valAxis = theme.valueAxis as Record<string, unknown>;
    expect((valAxis.axisLine as Record<string, unknown>).show).toBe(true);
    expect((valAxis.axisTick as Record<string, unknown>).show).toBe(true);
  });

  it('supports colorblind palette override', () => {
    const theme = buildDesignLabEChartsHighContrastTheme({ colorblindPalette: 'tritanopia' });
    expect(theme.color).toEqual(COLORBLIND_PALETTES.tritanopia);
  });

  it('scatter has border for visibility', () => {
    const theme = buildDesignLabEChartsHighContrastTheme();
    const scatter = theme.scatter as Record<string, unknown>;
    expect((scatter.itemStyle as Record<string, unknown>).borderWidth).toBe(1);
  });
});

/* ================================================================== */
/*  Print Theme                                                        */
/* ================================================================== */

describe('buildDesignLabEChartsPrintTheme', () => {
  it('returns a valid theme structure', () => {
    const theme = buildDesignLabEChartsPrintTheme();
    assertThemeStructure(theme);
  });

  it('uses monochrome palette', () => {
    const theme = buildDesignLabEChartsPrintTheme();
    expect(theme.color).toEqual(COLORBLIND_PALETTES.monochrome);
  });

  it('uses serif font family for print legibility', () => {
    const theme = buildDesignLabEChartsPrintTheme();
    const fontFamily = (theme.textStyle as Record<string, unknown>).fontFamily as string;
    expect(fontFamily).toContain('Georgia');
  });

  it('disables all animation', () => {
    const theme = buildDesignLabEChartsPrintTheme();
    expect(theme.animation).toBe(false);
    expect(theme.animationDuration).toBe(0);
    expect(theme.animationDurationUpdate).toBe(0);
  });

  it('enables aria decal patterns by default', () => {
    const theme = buildDesignLabEChartsPrintTheme();
    expect(theme.aria).toBeDefined();
    const aria = theme.aria as Record<string, unknown>;
    expect(aria.enabled).toBe(true);
    const decal = aria.decal as Record<string, unknown>;
    expect(decal.show).toBe(true);
    expect(Array.isArray(decal.decals)).toBe(true);
    expect((decal.decals as unknown[]).length).toBe(8);
  });

  it('decal patterns have print-visible opacity', () => {
    const theme = buildDesignLabEChartsPrintTheme();
    const aria = theme.aria as Record<string, unknown>;
    const decal = aria.decal as Record<string, unknown>;
    const patterns = decal.decals as Array<Record<string, unknown>>;
    for (const p of patterns) {
      expect(p.color).toBe('rgba(0,0,0,0.25)');
    }
  });

  it('can disable decal patterns', () => {
    const theme = buildDesignLabEChartsPrintTheme({ useDecalPatterns: false });
    expect(theme.aria).toBeUndefined();
  });

  it('supports font family override', () => {
    const theme = buildDesignLabEChartsPrintTheme({ fontFamily: 'Courier New, monospace' });
    expect((theme.textStyle as Record<string, unknown>).fontFamily).toBe('Courier New, monospace');
  });

  it('bar has no border-radius (flat for print)', () => {
    const theme = buildDesignLabEChartsPrintTheme();
    const bar = theme.bar as Record<string, unknown>;
    expect((bar.itemStyle as Record<string, unknown>).borderRadius).toBe(0);
  });

  it('uses black text for maximum print contrast', () => {
    const theme = buildDesignLabEChartsPrintTheme();
    expect(getTextColor(theme)).toBe('#000000');
  });
});

/* ================================================================== */
/*  Cross-Theme Consistency                                            */
/* ================================================================== */

describe('Cross-Theme Consistency', () => {
  it('all themes produce same structure keys', () => {
    const light = buildDesignLabEChartsTheme();
    const dark = buildDesignLabEChartsDarkTheme();
    const hc = buildDesignLabEChartsHighContrastTheme();
    const print = buildDesignLabEChartsPrintTheme();

    const commonKeys = ['color', 'backgroundColor', 'textStyle', 'title', 'legend', 'tooltip',
      'categoryAxis', 'valueAxis', 'bar', 'line', 'pie', 'scatter'];

    for (const key of commonKeys) {
      expect(light).toHaveProperty(key);
      expect(dark).toHaveProperty(key);
      expect(hc).toHaveProperty(key);
      expect(print).toHaveProperty(key);
    }
  });

  it('all themes have 8+ palette colors', () => {
    const themes = [
      buildDesignLabEChartsTheme(),
      buildDesignLabEChartsDarkTheme(),
      buildDesignLabEChartsHighContrastTheme(),
      buildDesignLabEChartsPrintTheme(),
    ];
    for (const t of themes) {
      expect((t.color as string[]).length).toBeGreaterThanOrEqual(8);
    }
  });

  it('all themes use transparent background', () => {
    const themes = [
      buildDesignLabEChartsTheme(),
      buildDesignLabEChartsDarkTheme(),
      buildDesignLabEChartsHighContrastTheme(),
      buildDesignLabEChartsPrintTheme(),
    ];
    for (const t of themes) {
      expect(t.backgroundColor).toBe('transparent');
    }
  });
});
