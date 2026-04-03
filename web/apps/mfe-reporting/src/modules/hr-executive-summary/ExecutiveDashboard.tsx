import React from 'react';
import { DashboardPage } from '../dashboard';

const DASHBOARD_KEY = 'hr-executive-summary';

const DRILL_DOWN_PAGES = [
  { key: 'dashboard-hr-salary-analytics', label: 'Ücret Analitiği', icon: '💵', description: 'Departman, kıdem, eğitim bazlı ücret dağılımı' },
  { key: 'dashboard-hr-benefits-lite', label: 'Yan Haklar', icon: '🎁', description: 'Ek ödeme, sağlık sigortası, bonus analizi' },
  { key: 'dashboard-hr-equity-risk', label: 'İç Denge ve Risk', icon: '⚖️', description: 'Cinsiyet farkı, sıkışma, ayrılma riski' },
  { key: 'dashboard-hr-payroll-trends', label: 'Bordro Trendleri', icon: '📈', description: '24 aylık bordro, maliyet yapısı izleme' },
] as const;

const resolveBasePath = (): string => {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin/reports')) {
    return '/admin/reports';
  }
  return '/reports';
};

const ExecutiveDashboard: React.FC = () => {
  const handleNavigate = React.useCallback((pageKey: string) => {
    const basePath = resolveBasePath();
    window.location.href = `${basePath}/${pageKey}`;
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Dashboard */}
      <DashboardPage dashboardKey={DASHBOARD_KEY} />

      {/* Drill-down Navigation */}
      <div className="rounded-lg border border-border-subtle bg-surface-default p-4">
        <h3 className="mb-3 text-sm font-medium text-text-primary">Detay Sayfaları</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DRILL_DOWN_PAGES.map((page) => (
            <a
              key={page.key}
              href={`${resolveBasePath()}/${page.key}`}
              onClick={(e) => { e.preventDefault(); handleNavigate(page.key); }}
              className="flex items-start gap-3 rounded-lg border border-border-subtle bg-surface-primary p-3 text-left no-underline transition hover:border-action-primary/40 hover:shadow-sm"
            >
              <span className="text-2xl">{page.icon}</span>
              <div className="min-w-0">
                <div className="text-sm font-medium text-text-primary">{page.label}</div>
                <div className="mt-0.5 text-xs text-text-subtle">{page.description}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
