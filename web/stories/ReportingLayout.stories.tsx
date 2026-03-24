import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ReportPage } from '../apps/mfe-reporting/src/app/reporting/ReportPage';
import { ReportingProviders } from '../apps/mfe-reporting/src/app/reporting/ReportingProviders';
import type { ReportModule } from '../apps/mfe-reporting/src/modules/types';
import type { ColumnDef } from '../apps/mfe-reporting/src/grid';

type Filters = { query: string };
type Row = { id: number; name: string; status: string; updatedBy: string };

const mockModule: ReportModule<Filters, Row> = {
  id: 'reporting-demo',
  titleKey: 'reports.title.demo',
  descriptionKey: 'reports.description.demo',
  breadcrumbKeys: [{ key: 'reports.breadcrumb.home', to: '/' }, { key: 'reports.breadcrumb.demo', to: '/demo' }],
  createInitialFilters: ({ searchParams }) => ({
    query: searchParams.get('query') ?? '',
  }),
  renderFilters: ({ values, setFieldValue, t }) => (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-slate-700">
        {t('reports.filters.query')}
        <input
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-hidden focus:ring-2 focus:ring-brand-200"
          value={values.query}
          onChange={(event) => setFieldValue('query', event.target.value)}
          placeholder="Arama..."
        />
      </label>
    </div>
  ),
  getColumns: (t): ColumnDef[] => [
    { field: 'name', headerName: t('reports.columns.name'), width: 220 },
    { field: 'status', headerName: t('reports.columns.status'), width: 140 },
    { field: 'updatedBy', headerName: t('reports.columns.updatedBy'), width: 200 },
  ],
  fetchRows: async (filters) => {
    const rows: Row[] = [
      { id: 1, name: 'Haftalık Aktivite', status: 'AKTIF', updatedBy: 'cihan' },
      { id: 2, name: 'Raporlama Sağlık', status: 'BEKLEMEDE', updatedBy: 'elif' },
    ].filter((row) => row.name.toLowerCase().includes(filters.query.toLowerCase()));
    return { rows, total: rows.length };
  },
  renderDetail: (row, t) =>
    row ? (
      <div className="p-4">
        <p className="text-sm font-semibold">{row.name}</p>
        <p className="text-xs text-slate-500">{t('reports.columns.updatedBy')}: {row.updatedBy}</p>
      </div>
    ) : null,
};

export default {
  title: 'Reporting/Layout',
};

export const ReportPageLayout = () => (
  <MemoryRouter initialEntries={['/reports?query=']}>
    <ReportingProviders>
      <div className="min-h-screen bg-slate-50 p-6">
        <ReportPage module={mockModule} />
      </div>
    </ReportingProviders>
  </MemoryRouter>
);
