/**
 * Decal/Texture Patterns for Accessibility
 *
 * ECharts 5+ supports decal patterns natively via the aria.decal option.
 * These patterns provide visual differentiation beyond color, helping
 * colorblind users and improving print readability.
 *
 * Usage: Applied automatically when ChartSpec.accessibility.decal_patterns = true
 */

export interface DecalPattern {
  symbol: string;
  symbolSize: number;
  rotation: number;
  color: string;
  dashArrayX?: number[];
  dashArrayY?: number[];
}

/**
 * 8 distinct decal patterns — enough for most chart series.
 * Pattern order matches palette order for consistent mapping.
 */
export const DECAL_PATTERNS: DecalPattern[] = [
  { symbol: 'rect', symbolSize: 1, rotation: 0, color: 'rgba(0,0,0,0.15)' },
  { symbol: 'circle', symbolSize: 1, rotation: 0, color: 'rgba(0,0,0,0.15)' },
  { symbol: 'rect', symbolSize: 1, rotation: Math.PI / 4, color: 'rgba(0,0,0,0.15)' },
  { symbol: 'triangle', symbolSize: 1, rotation: 0, color: 'rgba(0,0,0,0.15)' },
  { symbol: 'diamond', symbolSize: 1, rotation: 0, color: 'rgba(0,0,0,0.15)' },
  { symbol: 'rect', symbolSize: 1, rotation: -Math.PI / 4, color: 'rgba(0,0,0,0.15)' },
  { symbol: 'circle', symbolSize: 0.7, rotation: 0, color: 'rgba(0,0,0,0.1)' },
  { symbol: 'rect', symbolSize: 0.5, rotation: Math.PI / 6, color: 'rgba(0,0,0,0.12)' },
];
