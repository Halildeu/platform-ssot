import React from 'react';
import { getSharedReport } from '@platform/capabilities';
import type { ReportModule } from '../types';
import type { ColumnMeta } from '@mfe/design-system/advanced/data-grid';
import type { UsersReportFilters, UsersReportRow } from './types';
import { fetchUsersReport } from './api';

const ALLOWED_STATUSES: Array<UsersReportFilters['status']> = [
  'ALL',
  'ACTIVE',
  'INACTIVE',
  'INVITED',
  'SUSPENDED',
];

const sharedReport = getSharedReport('users-overview');

export const usersReportModule: ReportModule<UsersReportFilters, UsersReportRow> = {
  id: sharedReport.webModuleId,
  sharedReportId: sharedReport.id,
  route: sharedReport.webRouteSegment,
  navKey: 'reports.nav.users',
  titleKey: 'reports.users.title',
  descriptionKey: 'reports.users.description',
  breadcrumbKeys: [
    { key: 'reports.breadcrumb.root', to: '/reports' },
    { key: 'reports.users.breadcrumb' },
  ],
  createInitialFilters: (context) => {
    const searchParams = context?.searchParams;
    const searchQuery = searchParams?.get('search')?.trim() ?? '';
    const userIdQuery = searchParams?.get('userId')?.trim() ?? '';
    const statusParam = (searchParams?.get('status') ?? '').toUpperCase();
    const status = ALLOWED_STATUSES.includes(statusParam as UsersReportFilters['status'])
      ? (statusParam as UsersReportFilters['status'])
      : 'ALL';
    return {
      search: searchQuery || userIdQuery,
      status,
    };
  },
  renderFilters: ({ values, setFieldValue, t }) => {
    const inputClass =
      'w-full rounded-md border border-border-subtle bg-surface-default px-3 py-2 text-sm text-text-primary placeholder:text-text-subtle focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1';
    const labelClass = 'flex flex-col gap-1 text-xs font-medium text-text-secondary min-w-[200px]';

    return (
      <>
        <label className={labelClass}>
          <span>{t('reports.filters.search.placeholder')}</span>
          <input
            data-testid="report-filter-search"
            className={inputClass}
            value={values.search ?? ''}
            placeholder={t('reports.filters.search.placeholder')}
            onChange={(event) => setFieldValue('search', event.target.value)}
          />
        </label>
        <label className={labelClass}>
          <span>{t('reports.filters.status.placeholder')}</span>
          <select
            data-testid="report-filter-status"
            className={inputClass}
            value={values.status ?? 'ALL'}
            onChange={(event) => setFieldValue('status', event.target.value as UsersReportFilters['status'])}
          >
            <option value="ALL">{t('reports.filters.all')}</option>
            <option value="ACTIVE">{t('reports.status.active')}</option>
            <option value="INACTIVE">{t('reports.status.inactive')}</option>
            <option value="INVITED">{t('reports.status.invited')}</option>
            <option value="SUSPENDED">{t('reports.status.suspended')}</option>
          </select>
        </label>
      </>
    );
  },
  /* Declarative column metadata — skeleton auto-generates renderers */
  getColumnMeta: (): ColumnMeta[] => [
    { field: 'fullName', headerNameKey: 'reports.users.columns.fullName', columnType: 'bold-text', minWidth: 180, flex: 1.4 },
    { field: 'email', headerNameKey: 'reports.users.columns.email', columnType: 'text', minWidth: 220, flex: 1.6 },
    {
      field: 'role', headerNameKey: 'reports.users.columns.role', columnType: 'badge', width: 140,
      variantMap: { ADMIN: 'danger', USER: 'info' },
      defaultVariant: 'info',
      labelMap: { ADMIN: 'shared.role.admin', USER: 'shared.role.user' },
      filterValues: ['ADMIN', 'USER'],
    },
    {
      field: 'status', headerNameKey: 'reports.users.columns.status', columnType: 'status', width: 140,
      statusMap: {
        ACTIVE: { variant: 'success', labelKey: 'shared.status.active' },
        INACTIVE: { variant: 'muted', labelKey: 'shared.status.inactive' },
        INVITED: { variant: 'warning', labelKey: 'shared.status.invited' },
        SUSPENDED: { variant: 'danger', labelKey: 'shared.status.suspended' },
      },
    },
    { field: 'lastLoginAt', headerNameKey: 'reports.users.columns.lastLoginAt', columnType: 'date', width: 180 },
    { field: 'createdAt', headerNameKey: 'reports.users.columns.createdAt', columnType: 'date', width: 180 },
  ],
  getColumns: () => [],
  fetchRows: (filters, request) => fetchUsersReport(filters, request),
};
