import React from 'react';
import { getSharedReport } from '@platform/capabilities';
import type { ReportModule } from '../types';
import type { ColumnMeta } from '../column-system';
import { exportAuditReport, fetchAuditReport } from './api';
import type { AuditFilters, AuditRow } from './types';

const LEVELS: Array<AuditRow['level']> = ['INFO', 'WARN', 'ERROR'];

const sharedReport = getSharedReport('audit-activity');

export const auditReportModule: ReportModule<AuditFilters, AuditRow> = {
  id: sharedReport.webModuleId,
  sharedReportId: sharedReport.id,
  route: sharedReport.webRouteSegment,
  navKey: 'reports.nav.audit',
  titleKey: 'reports.audit.title',
  descriptionKey: 'reports.audit.description',
  breadcrumbKeys: [
    { key: 'reports.breadcrumb.root', to: '/reports' },
    { key: 'reports.audit.breadcrumb' },
  ],
  createInitialFilters: () => ({ search: '', level: 'ALL' }),
  renderFilters: ({ values, setFieldValue, t }) => {
    const inputClass =
      'w-full rounded-md border border-border-subtle bg-surface-default px-3 py-2 text-sm text-text-primary placeholder:text-text-subtle focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1';
    const labelClass = 'flex flex-col gap-1 text-xs font-medium text-text-secondary min-w-[200px]';
    return (
      <>
        <label className={labelClass}>
          <span>{t('reports.filters.search.placeholder')}</span>
          <input
            className={inputClass}
            value={values.search ?? ''}
            placeholder={t('reports.filters.search.placeholder')}
            onChange={(event) => setFieldValue('search', event.target.value)}
          />
        </label>
        <label className={labelClass}>
          <span>{t('reports.filters.level.placeholder')}</span>
          <select
            className={inputClass}
            value={values.level ?? 'ALL'}
            onChange={(event) => setFieldValue('level', event.target.value)}
          >
            <option value="ALL">{t('reports.filters.all')}</option>
            {LEVELS.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </label>
      </>
    );
  },
  getColumnMeta: (): ColumnMeta[] => [
    { field: 'id', headerNameKey: 'reports.audit.columns.eventId', columnType: 'text', width: 140 },
    { field: 'userEmail', headerNameKey: 'reports.audit.columns.userEmail', columnType: 'text', flex: 1.4 },
    { field: 'service', headerNameKey: 'reports.audit.columns.service', columnType: 'text', flex: 1 },
    { field: 'action', headerNameKey: 'reports.audit.columns.action', columnType: 'text', flex: 1.2 },
    {
      field: 'level', headerNameKey: 'reports.audit.columns.level', columnType: 'badge', width: 120,
      variantMap: { INFO: 'info', WARN: 'warning', ERROR: 'danger' },
      defaultVariant: 'default',
      filterValues: ['INFO', 'WARN', 'ERROR'],
    },
    { field: 'timestamp', headerNameKey: 'reports.audit.columns.timestamp', columnType: 'date', flex: 1.2 },
  ],
  getColumns: () => [],
  fetchRows: (filters, request) => fetchAuditReport(filters, request),
  exportRows: (filters, format) => exportAuditReport(filters, format),
};
