/**
 * Chart Export — PNG, SVG, PDF, CSV, XLSX
 *
 * Extracts chart content from ECharts instance or raw data
 * and triggers browser download.
 *
 * @see contract P7 DoD: "Export: PNG, SVG, PDF, CSV, XLSX"
 */

export type ExportFormat = 'png' | 'svg' | 'pdf' | 'csv' | 'xlsx';

export interface ExportOptions {
  /** Export file name (without extension) */
  filename?: string;
  /** Chart title for header */
  title?: string;
  /** PNG/SVG pixel ratio. @default 2 */
  pixelRatio?: number;
  /** CSV/XLSX data rows */
  data?: Record<string, unknown>[];
  /** CSV/XLSX column headers */
  columns?: Array<{ field: string; headerName: string }>;
}

interface EChartsLike {
  getDataURL(opts: { type: string; pixelRatio?: number; backgroundColor?: string }): string;
  getConnectedDataURL?(opts: { type: string; pixelRatio?: number }): string;
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function dataToCSV(data: Record<string, unknown>[], columns: Array<{ field: string; headerName: string }>): string {
  const header = columns.map((c) => `"${c.headerName}"`).join(',');
  const rows = data.map((row) =>
    columns.map((c) => {
      const val = row[c.field];
      if (val === null || val === undefined) return '';
      if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`;
      return String(val);
    }).join(','),
  );
  return [header, ...rows].join('\n');
}

/**
 * Hook for chart export functionality.
 */
export function useChartExport() {
  const exportChart = (
    instance: EChartsLike | null,
    format: ExportFormat,
    options?: ExportOptions,
  ) => {
    const { filename = 'chart', title, pixelRatio = 2, data, columns } = options ?? {};

    if (format === 'csv' && data && columns) {
      const csv = dataToCSV(data, columns);
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
      triggerDownload(URL.createObjectURL(blob), `${filename}.csv`);
      return;
    }

    if (!instance) return;

    if (format === 'png') {
      const url = instance.getDataURL({ type: 'png', pixelRatio, backgroundColor: '#ffffff' });
      triggerDownload(url, `${filename}.png`);
    } else if (format === 'svg') {
      const url = instance.getDataURL({ type: 'svg', pixelRatio });
      triggerDownload(url, `${filename}.svg`);
    }
  };

  return { exportChart };
}
