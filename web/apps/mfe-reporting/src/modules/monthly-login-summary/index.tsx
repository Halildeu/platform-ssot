import React from 'react';
import { getSharedReport } from '@platform/capabilities';
import type { ReportModule } from '../types';
import type { ColumnMeta } from '@mfe/design-system/advanced/data-grid';
import type { MonthlyLoginFilters, MonthlyLoginRow } from './types';
import { fetchMonthlyLoginReport } from './api';

const sharedReport = getSharedReport('monthly-login-summary');

export const monthlyLoginModule: ReportModule<MonthlyLoginFilters, MonthlyLoginRow> = {
  id: sharedReport.webModuleId,
  sharedReportId: sharedReport.id,
  route: sharedReport.webRouteSegment,
  navKey: 'reports.nav.monthlyLogin',
  titleKey: 'reports.monthlyLogin.title',
  descriptionKey: 'reports.monthlyLogin.description',
  breadcrumbKeys: [
    { key: 'reports.breadcrumb.root', to: '/reports' },
    { key: 'reports.monthlyLogin.breadcrumb' },
  ],
  createInitialFilters: (context) => {
    const searchParams = context?.searchParams;
    const searchQuery = searchParams?.get('search')?.trim() ?? '';
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return {
      search: searchQuery,
      month: currentMonth,
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
          <span>{t('reports.monthlyLogin.filters.month')}</span>
          <input
            data-testid="report-filter-month"
            type="month"
            className={inputClass}
            value={values.month ?? ''}
            onChange={(event) => setFieldValue('month', event.target.value)}
          />
        </label>
      </>
    );
  },
  getColumnMeta: (): ColumnMeta[] => [
    { field: 'fullName', headerNameKey: 'reports.monthlyLogin.columns.fullName', columnType: 'bold-text', minWidth: 180, flex: 1.4 },
    { field: 'email', headerNameKey: 'reports.monthlyLogin.columns.email', columnType: 'text', minWidth: 220, flex: 1.6 },
    {
      field: 'role', headerNameKey: 'reports.monthlyLogin.columns.role', columnType: 'badge', width: 140,
      variantMap: { ADMIN: 'danger', USER: 'info' },
      defaultVariant: 'info',
      labelMap: { ADMIN: 'shared.role.admin', USER: 'shared.role.user' },
      filterValues: ['ADMIN', 'USER'],
    },
    {
      field: 'status', headerNameKey: 'reports.monthlyLogin.columns.status', columnType: 'status', width: 140,
      statusMap: {
        ACTIVE: { variant: 'success', labelKey: 'shared.status.active' },
        INACTIVE: { variant: 'muted', labelKey: 'shared.status.inactive' },
      },
    },
    { field: 'lastLoginAt', headerNameKey: 'reports.monthlyLogin.columns.lastLoginAt', columnType: 'date', width: 180 },
    { field: 'createdAt', headerNameKey: 'reports.monthlyLogin.columns.createdAt', columnType: 'date', width: 180 },
  ],
  getColumns: () => [],
  fetchRows: (filters, request) => fetchMonthlyLoginReport(filters, request),
};
