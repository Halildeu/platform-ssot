import React from 'react';
import { getSharedReport } from '@platform/capabilities';
import type { ReportModule } from '../types';
import { exportAuditReport, fetchAuditReport } from './api';
import type { AuditFilters, AuditRow } from './types';
import type { ColumnDef } from '../../grid';

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
  createInitialFilters: () => ({
    search: '',
    level: 'ALL',
  }),
  renderFilters: ({ values, setFieldValue, t }) => {
    const inputClass =
      'w-full rounded-md border border-border-subtle bg-surface-default px-3 py-2 text-sm text-text-primary placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-selection-outline focus:ring-offset-1';
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
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>
      </>
    );
  },
  getColumns: (t) =>
    [
      { headerName: t('reports.audit.columns.eventId'), field: 'id', width: 140 },
      { headerName: t('reports.audit.columns.userEmail'), field: 'userEmail', flex: 1.4 },
      { headerName: t('reports.audit.columns.service'), field: 'service', flex: 1 },
      { headerName: t('reports.audit.columns.action'), field: 'action', flex: 1.2 },
      { headerName: t('reports.audit.columns.level'), field: 'level', width: 120 },
      { headerName: t('reports.audit.columns.timestamp'), field: 'timestamp', flex: 1.2 },
    ] as ColumnDef<AuditRow>[],
  fetchRows: (filters, request) => fetchAuditReport(filters, request),
  exportRows: (filters, format) => exportAuditReport(filters, format),
  renderDetail: (row, t) => {
    if (!row) {
      return <span>{t('reports.detail.empty')}</span>;
    }
    return (
      <dl style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 8 }}>
        <dt>{t('reports.audit.columns.eventId')}</dt>
        <dd>{row.id}</dd>
        <dt>{t('reports.audit.columns.userEmail')}</dt>
        <dd>{row.userEmail}</dd>
        <dt>{t('reports.audit.columns.service')}</dt>
        <dd>{row.service}</dd>
        <dt>{t('reports.audit.columns.action')}</dt>
        <dd>{row.action}</dd>
        <dt>{t('reports.audit.columns.level')}</dt>
        <dd>{row.level}</dd>
        <dt>{t('reports.audit.columns.timestamp')}</dt>
        <dd>{row.timestamp}</dd>
        <dt>Correlation id</dt>
        <dd>{row.correlationId ?? '-'}</dd>
        <dt>Detay</dt>
        <dd>{row.details ?? '-'}</dd>
      </dl>
    );
  },
};
