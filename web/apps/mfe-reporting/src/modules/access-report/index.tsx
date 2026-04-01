import React from 'react';
import { getSharedReport } from '@platform/capabilities';
import type { ReportModule } from '../types';
import type { ColumnMeta } from '../column-system';
import { fetchAccessReport } from './api';
import type { AccessFilters, AccessRow } from './types';

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
  createInitialFilters: () => ({ search: '' }),
  renderFilters: ({ values, setFieldValue, t }) => (
    <label className="flex flex-col gap-1 text-xs font-medium text-text-secondary">
      <span>{t('reports.filters.search.placeholder')}</span>
      <input
        className="w-full min-w-[200px] rounded-md border border-border-subtle bg-surface-default px-3 py-2 text-sm text-text-primary placeholder:text-text-subtle focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
        value={values.search ?? ''}
        placeholder={t('reports.filters.search.placeholder')}
        onChange={(event) => setFieldValue('search', event.target.value)}
      />
    </label>
  ),
  getColumnMeta: (): ColumnMeta[] => [
    { field: 'roleName', headerNameKey: 'reports.access.columns.roleName', columnType: 'bold-text', flex: 1.4 },
    { field: 'memberCount', headerNameKey: 'reports.access.columns.memberCount', columnType: 'number', width: 140 },
    { field: 'moduleSummary', headerNameKey: 'reports.access.columns.moduleSummary', columnType: 'text', flex: 1.6 },
    { field: 'updatedAt', headerNameKey: 'reports.access.columns.updatedAt', columnType: 'date', flex: 1 },
  ],
  getColumns: () => [],
  fetchRows: (filters, request) => fetchAccessReport(filters, request),
};
