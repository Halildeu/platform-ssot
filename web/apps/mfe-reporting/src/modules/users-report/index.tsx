import React from 'react';
import type { ReportModule } from '../types';
import type { UsersReportFilters, UsersReportRow } from './types';
import type { ColumnDef } from '../../grid';
import { fetchUsersReport } from './api';

const ALLOWED_STATUSES: Array<UsersReportFilters['status']> = [
  'ALL',
  'ACTIVE',
  'INACTIVE',
  'INVITED',
  'SUSPENDED',
];

export const usersReportModule: ReportModule<UsersReportFilters, UsersReportRow> = {
  id: 'reports.users',
  route: 'users',
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
      'w-full rounded-md border border-border-subtle bg-surface-default px-3 py-2 text-sm text-text-primary placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-selection-outline focus:ring-offset-1';
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
  getColumns: (t) =>
    [
      { headerName: t('reports.users.columns.fullName'), field: 'fullName', flex: 1.4 },
      { headerName: t('reports.users.columns.email'), field: 'email', flex: 1.6 },
      { headerName: t('reports.users.columns.role'), field: 'role', width: 140 },
      { headerName: t('reports.users.columns.status'), field: 'status', width: 140 },
      { headerName: t('reports.users.columns.lastLoginAt'), field: 'lastLoginAt', flex: 1.2 },
      { headerName: t('reports.users.columns.createdAt'), field: 'createdAt', flex: 1.2 },
    ] as ColumnDef<UsersReportRow>[],
  fetchRows: (filters, request) => fetchUsersReport(filters, request),
  renderDetail: (row, t) => {
    if (!row) {
      return <span>{t('reports.detail.empty')}</span>;
    }
    return (
      <dl style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 8 }}>
        <dt>ID</dt>
        <dd>{row.id}</dd>
        <dt>{t('reports.users.columns.fullName')}</dt>
        <dd>{row.fullName}</dd>
        <dt>{t('reports.users.columns.email')}</dt>
        <dd>{row.email}</dd>
        <dt>{t('reports.users.columns.role')}</dt>
        <dd>{row.role}</dd>
        <dt>{t('reports.users.columns.status')}</dt>
        <dd>{row.status}</dd>
        <dt>{t('reports.users.columns.lastLoginAt')}</dt>
        <dd>{row.lastLoginAt ?? '-'}</dd>
        <dt>{t('reports.users.columns.createdAt')}</dt>
        <dd>{row.createdAt ?? '-'}</dd>
      </dl>
    );
  },
};
