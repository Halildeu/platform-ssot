import React from 'react';
import type { ReportModule } from '../types';
import type { ExecutiveSummaryFilters } from './types';
import ExecutiveDashboard from './ExecutiveDashboard';

export const hrExecutiveSummaryModule: ReportModule<ExecutiveSummaryFilters, Record<string, unknown>> = {
  id: 'reports.hr-executive-summary',
  sharedReportId: 'hr-executive-summary' as any,
  route: 'hr-executive-summary',
  navKey: 'Yönetici Özeti',
  titleKey: 'Yönetici Özeti',
  descriptionKey: 'Üst yönetim tek bakışta: toplam maliyet, turnover, kişi başı maliyet, cinsiyet farkı ve risk alarmları.',
  breadcrumbKeys: [
    { key: 'reports.breadcrumb.root', to: '/reports' },
    { key: 'Yönetici Özeti' },
  ],
  createInitialFilters: () => ({}),
  renderFilters: () => null,
  getColumnMeta: () => [],
  getColumns: () => [],
  fetchRows: async () => ({ rows: [], total: 0 }),
  renderDashboard: () => <ExecutiveDashboard />,
};
