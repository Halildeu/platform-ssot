/**
 * Chart Theme Bridge — AG Charts + Design System Token Sync
 * Local copy for x-charts package (standalone, no subpath imports).
 */

export interface ChartThemeOverrides {
  common?: {
    title?: { fontFamily?: string; color?: string; fontSize?: number };
    subtitle?: { fontFamily?: string; color?: string };
    axes?: {
      category?: { label?: { color?: string; fontFamily?: string } };
      number?: { label?: { color?: string; fontFamily?: string } };
    };
    legend?: { item?: { label?: { color?: string; fontFamily?: string } } };
    padding?: { top?: number; right?: number; bottom?: number; left?: number };
  };
}

const getCSSVar = (varName: string, fallback: string): string => {
  if (typeof document === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return value || fallback;
};

export const getChartThemeOverrides = (): ChartThemeOverrides => {
  const fontFamily = getCSSVar('--font-family-sans', 'Inter, system-ui, sans-serif');
  const textPrimary = getCSSVar('--text-primary', '#1e293b');
  const textSecondary = getCSSVar('--text-secondary', '#64748b');

  return {
    common: {
      title: { fontFamily, color: textPrimary, fontSize: 16 },
      subtitle: { fontFamily, color: textSecondary },
      axes: {
        category: { label: { color: textSecondary, fontFamily } },
        number: { label: { color: textSecondary, fontFamily } },
      },
      legend: { item: { label: { color: textPrimary, fontFamily } } },
      padding: { top: 16, right: 16, bottom: 16, left: 16 },
    },
  };
};

export const getChartColorPalette = (): string[] => [
  getCSSVar('--action-primary', '#3b82f6'),
  getCSSVar('--state-success-text', '#16a34a'),
  getCSSVar('--state-warning-text', '#d97706'),
  getCSSVar('--state-error-text', '#dc2626'),
  getCSSVar('--state-info-text', '#0891b2'),
  getCSSVar('--action-secondary', '#8b5cf6'),
  '#f59e0b',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
];
