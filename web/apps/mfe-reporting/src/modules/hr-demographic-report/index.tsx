import React from 'react';
import { getSharedReport } from '@platform/capabilities';
import type { ReportModule } from '../types';
import type { ColumnMeta } from '../column-system';
import type { HrDemographicFilters, HrDemographicRow } from './types';
import { fetchHrDemographicRows } from './api';
import DemographicDashboard from './DemographicDashboard';

const sharedReport = getSharedReport('hr-demografik-yapi');

export const hrDemographicReportModule: ReportModule<HrDemographicFilters, HrDemographicRow> = {
  id: sharedReport.webModuleId,
  sharedReportId: sharedReport.id,
  route: sharedReport.webRouteSegment,
  navKey: 'reports.nav.hrDemographic',
  titleKey: 'reports.hrDemographic.title',
  descriptionKey: 'reports.hrDemographic.description',
  breadcrumbKeys: [
    { key: 'reports.breadcrumb.root', to: '/reports' },
    { key: 'reports.hrDemographic.breadcrumb' },
  ],
  createInitialFilters: (context) => {
    const searchParams = context?.searchParams;
    return {
      search: searchParams?.get('search')?.trim() ?? '',
      department: searchParams?.get('department')?.trim() ?? 'all',
      location: searchParams?.get('location')?.trim() ?? 'all',
      employmentType: searchParams?.get('employmentType')?.trim() ?? 'all',
      gender: searchParams?.get('gender')?.trim() ?? 'all',
      ageGroup: searchParams?.get('ageGroup')?.trim() ?? 'all',
      dateRange: null,
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
          <input data-testid="report-filter-search" className={inputClass} value={values.search ?? ''} placeholder={t('reports.hrDemographic.filters.searchPlaceholder')} onChange={(e) => setFieldValue('search', e.target.value)} />
        </label>
        <label className={labelClass}>
          <span>{t('reports.hrDemographic.filters.department')}</span>
          <select data-testid="report-filter-department" className={inputClass} value={values.department ?? 'all'} onChange={(e) => setFieldValue('department', e.target.value)}>
            <option value="all">{t('reports.filters.all')}</option>
            <option value="Finans">Finans</option>
            <option value="İnsan Kaynakları">İnsan Kaynakları</option>
            <option value="Bilgi Teknolojileri">Bilgi Teknolojileri</option>
            <option value="Satış">Satış</option>
            <option value="Pazarlama">Pazarlama</option>
            <option value="Üretim">Üretim</option>
            <option value="Hukuk">Hukuk</option>
            <option value="Lojistik">Lojistik</option>
          </select>
        </label>
        <label className={labelClass}>
          <span>{t('reports.hrDemographic.filters.location')}</span>
          <select data-testid="report-filter-location" className={inputClass} value={values.location ?? 'all'} onChange={(e) => setFieldValue('location', e.target.value)}>
            <option value="all">{t('reports.filters.all')}</option>
            <option value="İstanbul">İstanbul</option>
            <option value="Ankara">Ankara</option>
            <option value="İzmir">İzmir</option>
          </select>
        </label>
        <label className={labelClass}>
          <span>{t('reports.hrDemographic.filters.gender')}</span>
          <select data-testid="report-filter-gender" className={inputClass} value={values.gender ?? 'all'} onChange={(e) => setFieldValue('gender', e.target.value)}>
            <option value="all">{t('reports.filters.all')}</option>
            <option value="Erkek">Erkek</option>
            <option value="Kadın">Kadın</option>
          </select>
        </label>
        <label className={labelClass}>
          <span>{t('reports.hrDemographic.filters.employmentType')}</span>
          <select data-testid="report-filter-employment-type" className={inputClass} value={values.employmentType ?? 'all'} onChange={(e) => setFieldValue('employmentType', e.target.value)}>
            <option value="all">{t('reports.filters.all')}</option>
            <option value="Tam Zamanlı">Tam Zamanlı</option>
            <option value="Yarı Zamanlı">Yarı Zamanlı</option>
            <option value="Sözleşmeli">Sözleşmeli</option>
            <option value="Stajyer">Stajyer</option>
          </select>
        </label>
      </>
    );
  },
  getColumnMeta: (): ColumnMeta[] => [
    { field: 'fullName', headerNameKey: 'reports.hrDemographic.columns.fullName', columnType: 'bold-text', flex: 1.4 },
    { field: 'department', headerNameKey: 'reports.hrDemographic.columns.department', columnType: 'text', width: 150 },
    { field: 'position', headerNameKey: 'reports.hrDemographic.columns.position', columnType: 'text', flex: 1.2 },
    {
      field: 'gender', headerNameKey: 'reports.hrDemographic.columns.gender', columnType: 'badge', width: 90,
      variantMap: { Erkek: 'info', Kadın: 'primary' }, defaultVariant: 'default',
    },
    { field: 'age', headerNameKey: 'reports.hrDemographic.columns.age', columnType: 'number', width: 70 },
    { field: 'education', headerNameKey: 'reports.hrDemographic.columns.education', columnType: 'text', width: 130 },
    {
      field: 'employmentType', headerNameKey: 'reports.hrDemographic.columns.employmentType', columnType: 'badge', width: 120,
      variantMap: { 'Tam Zamanlı': 'success', 'Yarı Zamanlı': 'warning', 'Sözleşmeli': 'info', 'Stajyer': 'muted' },
      defaultVariant: 'default',
    },
    { field: 'location', headerNameKey: 'reports.hrDemographic.columns.location', columnType: 'text', width: 100 },
    { field: 'tenureYears', headerNameKey: 'reports.hrDemographic.columns.tenureYears', columnType: 'number', width: 90, suffix: 'yıl' },
    { field: 'hireDate', headerNameKey: 'reports.hrDemographic.columns.hireDate', columnType: 'date', width: 110, format: 'short' },
    { field: 'generation', headerNameKey: 'reports.hrDemographic.columns.generation', columnType: 'text', width: 110 },
  ],
  getColumns: () => [],
  fetchRows: (filters, request) => fetchHrDemographicRows(filters, request),
  renderDashboard: () => <DemographicDashboard />,
  renderDetail: (row, t) => {
    if (!row) return <span>{t('reports.detail.empty')}</span>;
    return (
      <dl style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 8 }}>
        <dt>ID</dt><dd>{row.id}</dd>
        <dt>{t('reports.hrDemographic.columns.fullName')}</dt><dd>{row.fullName}</dd>
        <dt>{t('reports.hrDemographic.columns.department')}</dt><dd>{row.department}</dd>
        <dt>{t('reports.hrDemographic.columns.position')}</dt><dd>{row.position}</dd>
        <dt>{t('reports.hrDemographic.columns.gender')}</dt><dd>{row.gender}</dd>
        <dt>{t('reports.hrDemographic.columns.age')}</dt><dd>{row.age}</dd>
        <dt>{t('reports.hrDemographic.columns.education')}</dt><dd>{row.education}</dd>
        <dt>{t('reports.hrDemographic.columns.employmentType')}</dt><dd>{row.employmentType}</dd>
        <dt>{t('reports.hrDemographic.columns.location')}</dt><dd>{row.location}</dd>
        <dt>{t('reports.hrDemographic.columns.hireDate')}</dt><dd>{row.hireDate}</dd>
        <dt>{t('reports.hrDemographic.columns.tenureYears')}</dt><dd>{row.tenureYears} yıl</dd>
        <dt>{t('reports.hrDemographic.columns.generation')}</dt><dd>{row.generation}</dd>
        <dt>{t('reports.hrDemographic.columns.maritalStatus')}</dt><dd>{row.maritalStatus}</dd>
        <dt>{t('reports.hrDemographic.columns.militaryStatus')}</dt><dd>{row.militaryStatus}</dd>
        <dt>{t('reports.hrDemographic.columns.isManager')}</dt><dd>{row.isManager ? 'Evet' : 'Hayır'}</dd>
        <dt>{t('reports.hrDemographic.columns.hasDisability')}</dt><dd>{row.hasDisability ? 'Evet' : 'Hayır'}</dd>
        <dt>{t('reports.hrDemographic.columns.ethicsTraining')}</dt><dd>{row.ethicsTrainingComplete ? 'Tamamlandı' : 'Beklemede'}</dd>
      </dl>
    );
  },
};
