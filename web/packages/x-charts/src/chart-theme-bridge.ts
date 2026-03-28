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
  const textPrimary = getCSSVar('--text-primary', 'var(--text-primary)');
  const textSecondary = getCSSVar('--text-secondary', 'var(--text-secondary)');

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
  getCSSVar('--action-primary', 'var(--action-primary)'),
  getCSSVar('--state-success-text', 'var(--state-success-text)'),
  getCSSVar('--state-warning-text', 'var(--state-warning-text)'),
  getCSSVar('--state-error-text', 'var(--state-danger-text)'),
  getCSSVar('--state-info-text', 'var(--state-info-text)'),
  getCSSVar('--action-secondary', 'var(--action-primary)'),
  'var(--state-warning-text)',
  'var(--state-danger-text)',
  'var(--state-info-text)',
  'var(--state-success-text)',
];
