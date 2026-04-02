import React from 'react';
import { getSharedReport } from '@platform/capabilities';
import type { ReportModule } from '../types';
import type { ColumnMeta } from '@mfe/design-system/advanced/data-grid';
import type { HrCompensationFilters, HrCompensationRow } from './types';
import { fetchCompensationRows } from './api';
import CompensationDashboard from './CompensationDashboard';

const sharedReport = getSharedReport('hr-compensation');

export const hrCompensationModule: ReportModule<HrCompensationFilters, HrCompensationRow> = {
  id: sharedReport.webModuleId,
  sharedReportId: sharedReport.id,
  route: sharedReport.webRouteSegment,
  navKey: 'reports.nav.hrCompensation',
  titleKey: 'reports.hrCompensation.title',
  descriptionKey: 'reports.hrCompensation.description',
  breadcrumbKeys: [
    { key: 'reports.breadcrumb.root', to: '/reports' },
    { key: 'reports.hrCompensation.breadcrumb' },
  ],
  createInitialFilters: (context) => {
    const sp = context?.searchParams;
    return {
      search: sp?.get('search')?.trim() ?? '',
      department: sp?.get('department')?.trim() ?? 'all',
      company: sp?.get('company')?.trim() ?? 'all',
      collarType: sp?.get('collarType')?.trim() ?? 'all',
      gender: sp?.get('gender')?.trim() ?? 'all',
      education: sp?.get('education')?.trim() ?? 'all',
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
            placeholder={t('reports.hrCompensation.filters.searchPlaceholder')}
            onChange={(e) => setFieldValue('search', e.target.value)}
          />
        </label>
        <label className={labelClass}>
          <span>{t('reports.hrCompensation.filters.department')}</span>
          <select data-testid="report-filter-department" className={inputClass} value={values.department ?? 'all'} onChange={(e) => setFieldValue('department', e.target.value)}>
            <option value="all">{t('reports.filters.all')}</option>
          </select>
        </label>
        <label className={labelClass}>
          <span>{t('reports.hrCompensation.filters.collarType')}</span>
          <select data-testid="report-filter-collar" className={inputClass} value={values.collarType ?? 'all'} onChange={(e) => setFieldValue('collarType', e.target.value)}>
            <option value="all">{t('reports.filters.all')}</option>
            <option value="1">{t('reports.hrCompensation.collarType.white')}</option>
            <option value="2">{t('reports.hrCompensation.collarType.blue')}</option>
          </select>
        </label>
        <label className={labelClass}>
          <span>{t('reports.hrCompensation.filters.gender')}</span>
          <select data-testid="report-filter-gender" className={inputClass} value={values.gender ?? 'all'} onChange={(e) => setFieldValue('gender', e.target.value)}>
            <option value="all">{t('reports.filters.all')}</option>
            <option value="1">Erkek</option>
            <option value="0">Kadin</option>
          </select>
        </label>
        <label className={labelClass}>
          <span>{t('reports.hrCompensation.filters.education')}</span>
          <select data-testid="report-filter-education" className={inputClass} value={values.education ?? 'all'} onChange={(e) => setFieldValue('education', e.target.value)}>
            <option value="all">{t('reports.filters.all')}</option>
            <option value="Lise">Lise</option>
            <option value="Onlisans">Onlisans</option>
            <option value="Lisans">Lisans</option>
            <option value="Yuksek Lisans">Yuksek Lisans</option>
            <option value="Doktora">Doktora</option>
          </select>
        </label>
      </>
    );
  },
  getColumnMeta: (): ColumnMeta[] => [
    { field: 'EMPLOYEE_ID', headerNameKey: 'reports.hrCompensation.columns.employeeId', columnType: 'number', width: 90 },
    { field: 'FULL_NAME', headerNameKey: 'reports.hrCompensation.columns.fullName', columnType: 'bold-text', minWidth: 180, flex: 1.4 },
    { field: 'DEPARTMENT_NAME', headerNameKey: 'reports.hrCompensation.columns.department', columnType: 'text', width: 150 },
    { field: 'POSITION_NAME', headerNameKey: 'reports.hrCompensation.columns.position', columnType: 'text', width: 160 },
    { field: 'BRANCH_NAME', headerNameKey: 'reports.hrCompensation.columns.branch', columnType: 'text', width: 120 },
    { field: 'COMPANY_NAME', headerNameKey: 'reports.hrCompensation.columns.company', columnType: 'text', width: 130 },
    {
      field: 'COLLAR_TYPE', headerNameKey: 'reports.hrCompensation.columns.collarType', columnType: 'badge', width: 90,
      variantMap: { 1: 'info', 2: 'warning' },
      labelMap: { 1: 'reports.hrCompensation.collarType.white', 2: 'reports.hrCompensation.collarType.blue' },
      defaultVariant: 'default',
    },
    {
      field: 'GENDER', headerNameKey: 'reports.hrCompensation.columns.gender', columnType: 'badge', width: 80,
      variantMap: { 0: 'primary', 1: 'info' },
      labelMap: { 0: 'reports.hrCompensation.gender.female', 1: 'reports.hrCompensation.gender.male' },
      defaultVariant: 'default',
    },
    { field: 'EDUCATION', headerNameKey: 'reports.hrCompensation.columns.education', columnType: 'text', width: 120 },
    { field: 'TENURE_YEARS', headerNameKey: 'reports.hrCompensation.columns.tenure', columnType: 'number', width: 90 },
    { field: 'AGE', headerNameKey: 'reports.hrCompensation.columns.age', columnType: 'number', width: 60 },
    { field: 'GROSS_SALARY', headerNameKey: 'reports.hrCompensation.columns.grossSalary', columnType: 'currency', currencyCode: 'TRY', decimals: 0, width: 140 },
    { field: 'NET_SALARY', headerNameKey: 'reports.hrCompensation.columns.netSalary', columnType: 'currency', currencyCode: 'TRY', decimals: 0, width: 140 },
    { field: 'TOTAL_EMPLOYER_COST', headerNameKey: 'reports.hrCompensation.columns.employerCost', columnType: 'currency', currencyCode: 'TRY', decimals: 0, width: 150 },
    { field: 'SSK_EMPLOYER', headerNameKey: 'reports.hrCompensation.columns.sskEmployer', columnType: 'currency', currencyCode: 'TRY', decimals: 0, width: 130 },
    { field: 'INCOME_TAX', headerNameKey: 'reports.hrCompensation.columns.incomeTax', columnType: 'currency', currencyCode: 'TRY', decimals: 0, width: 130 },
    { field: 'OVERTIME_PAY', headerNameKey: 'reports.hrCompensation.columns.overtime', columnType: 'currency', currencyCode: 'TRY', decimals: 0, width: 120 },
    { field: 'SEVERANCE_AMOUNT', headerNameKey: 'reports.hrCompensation.columns.severance', columnType: 'currency', currencyCode: 'TRY', decimals: 0, width: 140 },
    {
      field: 'IS_CRITICAL', headerNameKey: 'reports.hrCompensation.columns.critical', columnType: 'boolean', width: 90,
    },
  ],
  getColumns: () => [],
  fetchRows: (filters, request) => fetchCompensationRows(filters, request),
  renderDashboard: () => <CompensationDashboard />,
};
