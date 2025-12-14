import React from 'react';
import type { ReportModule } from '../types';
import type { ColumnDef } from '../../grid';

type AuditFilters = {
  search: string;
  level: string;
};

type AuditRow = {
  id: string;
  userEmail: string;
  service: string;
  action: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  timestamp: string;
};

const LEVELS: Array<AuditRow['level']> = ['INFO', 'WARN', 'ERROR'];

const auditRows: AuditRow[] = Array.from({ length: 60 }).map((_, index) => ({
  id: `AUD-${index + 1}`,
  userEmail: `agent${index + 1}@example.com`,
  service: index % 2 === 0 ? 'user-service' : 'permission-service',
  action: index % 2 === 0 ? 'ROLE_UPDATE' : 'USER_RESET_PASSWORD',
  level: LEVELS[index % LEVELS.length],
  timestamp: new Date(Date.now() - index * 15 * 60 * 1000).toISOString(),
}));

export const auditReportModule: ReportModule<AuditFilters, AuditRow> = {
  id: 'reports.audit',
  route: 'audit',
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
  fetchRows: async (filters) => {
    const normalized = filters.search.trim().toLowerCase();
    await new Promise((resolve) => setTimeout(resolve, 120));
    const rows = auditRows.filter((row) => {
      if (filters.level !== 'ALL' && row.level !== filters.level) return false;
      if (!normalized) return true;
      return `${row.userEmail} ${row.action} ${row.service}`.toLowerCase().includes(normalized);
    });
    return { rows, total: rows.length };
  },
  renderDetail: (_row, t) => (
    <span>{t('reports.audit.comingSoon')}</span>
  ),
};
