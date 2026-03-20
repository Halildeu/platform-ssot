import React from 'react';
import { getSharedReport } from '@platform/capabilities';
import type { ReportModule } from '../types';
import { fetchAccessReport } from './api';
import type { AccessFilters, AccessRow } from './types';
import type { ColumnDef } from '../../grid';

const sharedReport = getSharedReport('roles-access');

export const accessReportModule: ReportModule<AccessFilters, AccessRow> = {
  id: sharedReport.webModuleId,
  sharedReportId: sharedReport.id,
  route: sharedReport.webRouteSegment,
  navKey: 'reports.nav.access',
  titleKey: 'reports.access.title',
  descriptionKey: 'reports.access.description',
  breadcrumbKeys: [
    { key: 'reports.breadcrumb.root', to: '/reports' },
    { key: 'reports.access.breadcrumb' },
  ],
  createInitialFilters: () => ({
    search: '',
  }),
  renderFilters: ({ values, setFieldValue, t }) => {
    const inputClass =
      'w-full min-w-[200px] rounded-md border border-border-subtle bg-surface-default px-3 py-2 text-sm text-text-primary placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-selection-outline focus:ring-offset-1';
    const labelClass = 'flex flex-col gap-1 text-xs font-medium text-text-secondary';

    return (
      <label className={labelClass}>
        <span>{t('reports.filters.search.placeholder')}</span>
        <input
          className={inputClass}
          value={values.search ?? ''}
          placeholder={t('reports.filters.search.placeholder')}
          onChange={(event) => setFieldValue('search', event.target.value)}
        />
      </label>
    );
  },
  getColumns: (t) =>
    [
      { headerName: t('reports.access.columns.roleName'), field: 'roleName', flex: 1.4 },
      { headerName: t('reports.access.columns.memberCount'), field: 'memberCount', width: 140 },
      { headerName: t('reports.access.columns.moduleSummary'), field: 'moduleSummary', flex: 1.6 },
      { headerName: t('reports.access.columns.updatedAt'), field: 'updatedAt', flex: 1 },
    ] as ColumnDef<AccessRow>[],
  fetchRows: (filters, request) => fetchAccessReport(filters, request),
  renderDetail: (row, t) => {
    if (!row) {
      return <span>{t('reports.detail.empty')}</span>;
    }
    return (
      <dl style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 8 }}>
        <dt>ID</dt>
        <dd>{row.id}</dd>
        <dt>{t('reports.access.columns.roleName')}</dt>
        <dd>{row.roleName}</dd>
        <dt>{t('reports.access.columns.memberCount')}</dt>
        <dd>{row.memberCount}</dd>
        <dt>Izin sayisi</dt>
        <dd>{row.permissionCount}</dd>
        <dt>{t('reports.access.columns.moduleSummary')}</dt>
        <dd>{row.moduleSummary}</dd>
        <dt>Aciklama</dt>
        <dd>{row.description ?? '-'}</dd>
        <dt>{t('reports.access.columns.updatedAt')}</dt>
        <dd>{row.updatedAt || '-'}</dd>
      </dl>
    );
  },
};
