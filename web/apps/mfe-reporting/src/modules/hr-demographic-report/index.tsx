import React from 'react';
import { getSharedReport } from '@platform/capabilities';
import type { ReportModule } from '../types';
import type { HrDemographicFilters, HrDemographicRow } from './types';
import type { ColumnDef } from '../../grid';
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
          <input
            data-testid="report-filter-search"
            className={inputClass}
            value={values.search ?? ''}
            placeholder={t('reports.hrDemographic.filters.searchPlaceholder')}
            onChange={(event) => setFieldValue('search', event.target.value)}
          />
        </label>
        <label className={labelClass}>
          <span>{t('reports.hrDemographic.filters.department')}</span>
          <select
            data-testid="report-filter-department"
            className={inputClass}
            value={values.department ?? 'all'}
            onChange={(event) => setFieldValue('department', event.target.value)}
          >
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
          <select
            data-testid="report-filter-location"
            className={inputClass}
            value={values.location ?? 'all'}
            onChange={(event) => setFieldValue('location', event.target.value)}
          >
            <option value="all">{t('reports.filters.all')}</option>
            <option value="İstanbul">İstanbul</option>
            <option value="Ankara">Ankara</option>
            <option value="İzmir">İzmir</option>
          </select>
        </label>
        <label className={labelClass}>
          <span>{t('reports.hrDemographic.filters.gender')}</span>
          <select
            data-testid="report-filter-gender"
            className={inputClass}
            value={values.gender ?? 'all'}
            onChange={(event) => setFieldValue('gender', event.target.value)}
          >
            <option value="all">{t('reports.filters.all')}</option>
            <option value="Erkek">Erkek</option>
            <option value="Kadın">Kadın</option>
          </select>
        </label>
        <label className={labelClass}>
          <span>{t('reports.hrDemographic.filters.employmentType')}</span>
          <select
            data-testid="report-filter-employment-type"
            className={inputClass}
            value={values.employmentType ?? 'all'}
            onChange={(event) => setFieldValue('employmentType', event.target.value)}
          >
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
  getColumns: (t) =>
    [
      { headerName: t('reports.hrDemographic.columns.fullName'), field: 'fullName', flex: 1.4 },
      { headerName: t('reports.hrDemographic.columns.department'), field: 'department', width: 150 },
      { headerName: t('reports.hrDemographic.columns.position'), field: 'position', flex: 1.2 },
      { headerName: t('reports.hrDemographic.columns.gender'), field: 'gender', width: 90 },
      { headerName: t('reports.hrDemographic.columns.age'), field: 'age', width: 70, filterType: 'number' },
      { headerName: t('reports.hrDemographic.columns.education'), field: 'education', width: 130 },
      { headerName: t('reports.hrDemographic.columns.employmentType'), field: 'employmentType', width: 120 },
      { headerName: t('reports.hrDemographic.columns.location'), field: 'location', width: 100 },
      { headerName: t('reports.hrDemographic.columns.tenureYears'), field: 'tenureYears', width: 90, filterType: 'number' },
      { headerName: t('reports.hrDemographic.columns.hireDate'), field: 'hireDate', width: 110, filterType: 'date' },
      { headerName: t('reports.hrDemographic.columns.generation'), field: 'generation', width: 110 },
    ] as ColumnDef[],
  fetchRows: (filters, request) => fetchHrDemographicRows(filters, request),
  renderDashboard: () => <DemographicDashboard />,
  renderDetail: (row, t) => {
    if (!row) {
      return <span>{t('reports.detail.empty')}</span>;
    }
    return (
      <dl style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 8 }}>
        <dt>ID</dt>
        <dd>{row.id}</dd>
        <dt>{t('reports.hrDemographic.columns.fullName')}</dt>
        <dd>{row.fullName}</dd>
        <dt>{t('reports.hrDemographic.columns.department')}</dt>
        <dd>{row.department}</dd>
        <dt>{t('reports.hrDemographic.columns.position')}</dt>
        <dd>{row.position}</dd>
        <dt>{t('reports.hrDemographic.columns.gender')}</dt>
        <dd>{row.gender}</dd>
        <dt>{t('reports.hrDemographic.columns.age')}</dt>
        <dd>{row.age}</dd>
        <dt>{t('reports.hrDemographic.columns.education')}</dt>
        <dd>{row.education}</dd>
        <dt>{t('reports.hrDemographic.columns.employmentType')}</dt>
        <dd>{row.employmentType}</dd>
        <dt>{t('reports.hrDemographic.columns.location')}</dt>
        <dd>{row.location}</dd>
        <dt>{t('reports.hrDemographic.columns.hireDate')}</dt>
        <dd>{row.hireDate}</dd>
        <dt>{t('reports.hrDemographic.columns.tenureYears')}</dt>
        <dd>{row.tenureYears} yıl</dd>
        <dt>{t('reports.hrDemographic.columns.generation')}</dt>
        <dd>{row.generation}</dd>
        <dt>{t('reports.hrDemographic.columns.maritalStatus')}</dt>
        <dd>{row.maritalStatus}</dd>
        <dt>{t('reports.hrDemographic.columns.militaryStatus')}</dt>
        <dd>{row.militaryStatus}</dd>
        <dt>{t('reports.hrDemographic.columns.isManager')}</dt>
        <dd>{row.isManager ? 'Evet' : 'Hayır'}</dd>
        <dt>{t('reports.hrDemographic.columns.hasDisability')}</dt>
        <dd>{row.hasDisability ? 'Evet' : 'Hayır'}</dd>
        <dt>{t('reports.hrDemographic.columns.ethicsTraining')}</dt>
        <dd>{row.ethicsTrainingComplete ? 'Tamamlandı' : 'Beklemede'}</dd>
      </dl>
    );
  },
};
