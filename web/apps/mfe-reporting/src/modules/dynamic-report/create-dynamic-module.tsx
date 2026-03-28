import React from 'react';
import type { ReportModule } from '../types';
import type { ColumnDef } from '../../grid';
import type { DynamicReportFilters, DynamicReportRow, ReportListItem } from './types';
import { fetchReportData, exportReportData } from './api';

export const createDynamicReportModule = (
  report: ReportListItem,
): ReportModule<DynamicReportFilters, DynamicReportRow> => {
  const moduleId = `reports.dynamic.${report.key}`;

  return {
    id: moduleId,
    sharedReportId: `dynamic:${report.key}` as any,
    route: report.key,
    navKey: report.title,
    titleKey: report.title,
    descriptionKey: report.description,
    breadcrumbKeys: [
      { key: 'reports.breadcrumb.root', to: '/reports' },
      { key: report.title },
    ],
    createInitialFilters: (context) => ({
      search: context?.searchParams?.get('search')?.trim() ?? '',
    }),
    renderFilters: ({ values, setFieldValue }) => {
      const inputClass =
        'w-full rounded-md border border-border-subtle bg-surface-default px-3 py-2 text-sm text-text-primary placeholder:text-text-subtle focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1';
      const labelClass =
        'flex flex-col gap-1 text-xs font-medium text-text-secondary min-w-[200px]';

      return (
        <label className={labelClass}>
          <span>Ara</span>
          <input
            data-testid="report-filter-search"
            className={inputClass}
            value={values.search ?? ''}
            placeholder="Arama..."
            onChange={(event) => setFieldValue('search', event.target.value)}
          />
        </label>
      );
    },
    getColumns: () => [] as ColumnDef[],
    fetchRows: (filters, request) =>
      fetchReportData(report.key, filters, request),
    exportRows: (filters, format) =>
      exportReportData(report.key, filters, format),
    renderDetail: (row) => {
      if (!row) {
        return <span>Detayları görmek için bir satır seçin.</span>;
      }
      const entries = Object.entries(row).filter(
        ([key]) => !key.startsWith('_') && key !== 'id',
      );
      return (
        <dl style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 8 }}>
          {entries.map(([key, value]) => (
            <React.Fragment key={key}>
              <dt style={{ fontWeight: 500 }}>{key}</dt>
              <dd>{value != null ? String(value) : '-'}</dd>
            </React.Fragment>
          ))}
        </dl>
      );
    },
  };
};
