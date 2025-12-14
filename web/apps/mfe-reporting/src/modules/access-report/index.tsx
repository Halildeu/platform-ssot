import React from 'react';
import type { ReportModule } from '../types';
import type { ColumnDef } from '../../grid';

type AccessFilters = {
  search: string;
};

type AccessRow = {
  id: string;
  roleName: string;
  memberCount: number;
  moduleSummary: string;
  updatedAt: string;
};

const mockRows: AccessRow[] = Array.from({ length: 40 }).map((_, index) => ({
  id: `ROLE-${index + 1}`,
  roleName: `Rol ${index + 1}`,
  memberCount: Math.floor(Math.random() * 80),
  moduleSummary: index % 2 === 0 ? 'Kullanıcı Yönetimi' : 'Audit + Erişim',
  updatedAt: new Date(Date.now() - index * 6 * 60 * 60 * 1000).toISOString(),
}));

export const accessReportModule: ReportModule<AccessFilters, AccessRow> = {
  id: 'reports.access',
  route: 'access',
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
  fetchRows: async (filters) => {
    const normalized = filters.search.trim().toLowerCase();
    await new Promise((resolve) => setTimeout(resolve, 150));
    const rows = normalized
      ? mockRows.filter((row) => row.roleName.toLowerCase().includes(normalized))
      : mockRows;
    return { rows, total: rows.length };
  },
  renderDetail: (_row, t) => (
    <span>{t('reports.access.comingSoon')}</span>
  ),
};
