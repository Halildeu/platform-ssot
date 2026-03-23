import React from 'react';
import clsx from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { reportModules } from '../../modules';
import { ReportPage } from './ReportPage';
import { DynamicReportPage } from '../../modules/dynamic-report/DynamicReportPage';
import { useReportingI18n } from '../../i18n/useReportingI18n';
import {
  createDynamicReportModule,
  fetchReportList,
} from '../../modules/dynamic-report';
import { DashboardPage, fetchDashboardList } from '../../modules/dashboard';
import type { DashboardListItem } from '../../modules/dashboard';
import type { ReportListItem, DynamicReportFilters, DynamicReportRow } from '../../modules/dynamic-report';
import type { ReportModule } from '../../modules/types';

type AnyModule = ReportModule<any, any>;

type MergedModule = {
  module: AnyModule;
  isDynamic: boolean;
  isDashboard?: boolean;
  dashboardKey?: string;
  reportKey?: string;
  category?: string;
};

const resolveBasePath = (pathname: string): string => {
  if (pathname.startsWith('/admin/reports')) {
    return '/admin/reports';
  }
  return '/reports';
};

const getActiveRoute = (pathname: string, modules: MergedModule[]): string => {
  const base = resolveBasePath(pathname);
  const remainder = pathname.slice(base.length).replace(/^\//, '');
  if (!remainder || modules.length === 0) {
    return modules[0]?.module.route ?? '';
  }
  const [firstSegment] = remainder.split('/');
  return firstSegment || (modules[0]?.module.route ?? '');
};

const ReportingApp: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useReportingI18n();
  const basePath = resolveBasePath(location.pathname);

  const [dynamicReports, setDynamicReports] = React.useState<ReportListItem[]>([]);
  const [dashboards, setDashboards] = React.useState<DashboardListItem[]>([]);
  const [dynamicLoaded, setDynamicLoaded] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    Promise.all([
      fetchReportList().catch((err) => {
        console.warn('[mfe-reporting] dynamic report list fetch failed:', err);
        return [] as ReportListItem[];
      }),
      fetchDashboardList().catch((err) => {
        console.warn('[mfe-reporting] dashboard list fetch failed:', err);
        return [] as DashboardListItem[];
      }),
    ])
      .then(([reports, dashboardList]) => {
        if (active) {
          setDynamicReports(reports);
          setDashboards(dashboardList);
        }
      })
      .finally(() => {
        if (active) {
          setDynamicLoaded(true);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const mergedModules = React.useMemo<MergedModule[]>(() => {
    // Dashboard entries (appear first in nav)
    const dashboardEntries: MergedModule[] = dashboards.map((db) => ({
      module: {
        id: `dashboard-${db.key}`,
        sharedReportId: db.key as any,
        route: `dashboard-${db.key}`,
        titleKey: db.title,
        descriptionKey: db.description,
        breadcrumbKeys: [],
        navKey: db.title,
        createInitialFilters: () => ({}),
        renderFilters: () => null,
        getColumns: () => [],
        fetchRows: async () => ({ rows: [], total: 0 }),
      } as AnyModule,
      isDynamic: false,
      isDashboard: true,
      dashboardKey: db.key,
      category: db.category,
    }));

    const staticEntries: MergedModule[] = reportModules.map((mod) => ({
      module: mod as AnyModule,
      isDynamic: false,
    }));

    const staticRoutes = new Set(reportModules.map((m) => (m as AnyModule).route));
    const allRoutes = new Set([...staticRoutes, ...dashboardEntries.map((e) => e.module.route)]);
    const dynamicEntries: MergedModule[] = dynamicReports
      .filter((report) => !allRoutes.has(report.key))
      .map((report) => ({
        module: createDynamicReportModule(report) as AnyModule,
        isDynamic: true,
        reportKey: report.key,
        category: report.category,
      }));

    return [...dashboardEntries, ...staticEntries, ...dynamicEntries];
  }, [dynamicReports, dashboards]);

  const activeKey = getActiveRoute(location.pathname, mergedModules);
  const activeEntry = mergedModules.find((e) => e.module.route === activeKey) ?? mergedModules[0];

  React.useEffect(() => {
    if (!activeEntry) return;
    const expectedPath = `${basePath}/${activeEntry.module.route}`;
    if (!location.pathname.startsWith(expectedPath)) {
      navigate(expectedPath, { replace: true });
    }
  }, [activeEntry, basePath, location.pathname, navigate]);

  const groupedByCategory = React.useMemo(() => {
    const dashboardGroup: MergedModule[] = [];
    const staticGroup: MergedModule[] = [];
    const categoryMap = new Map<string, MergedModule[]>();

    for (const entry of mergedModules) {
      if (entry.isDashboard) {
        dashboardGroup.push(entry);
      } else if (!entry.isDynamic) {
        staticGroup.push(entry);
      } else {
        const cat = entry.category ?? 'Diğer';
        if (!categoryMap.has(cat)) {
          categoryMap.set(cat, []);
        }
        categoryMap.get(cat)!.push(entry);
      }
    }

    return { dashboardGroup, staticGroup, categories: categoryMap };
  }, [mergedModules]);

  if (!dynamicLoaded && mergedModules.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-10 w-full animate-pulse rounded-sm bg-surface-muted" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <nav className="flex flex-wrap items-center gap-1 border-b border-border-subtle pb-1">
        {groupedByCategory.dashboardGroup.map((entry) => (
          <NavButton
            key={entry.module.route}
            label={entry.module.navKey}
            isActive={entry.module.route === activeKey}
            onClick={() => navigate(`${basePath}/${entry.module.route}`)}
          />
        ))}

        {groupedByCategory.dashboardGroup.length > 0 && groupedByCategory.staticGroup.length > 0 && (
          <div className="mx-2 h-5 w-px bg-border-subtle" />
        )}

        {groupedByCategory.staticGroup.map((entry) => (
          <NavButton
            key={entry.module.route}
            label={t(entry.module.navKey)}
            isActive={entry.module.route === activeKey}
            onClick={() => navigate(`${basePath}/${entry.module.route}`)}
          />
        ))}

        {groupedByCategory.categories.size > 0 && groupedByCategory.staticGroup.length > 0 && (
          <div className="mx-2 h-5 w-px bg-border-subtle" />
        )}

        {Array.from(groupedByCategory.categories.entries()).map(([category, entries]) => (
          <React.Fragment key={category}>
            <span className="px-2 text-xs font-semibold uppercase tracking-wider text-text-subtle">
              {category}
            </span>
            {entries.map((entry) => (
              <NavButton
                key={entry.module.route}
                label={entry.module.navKey}
                isActive={entry.module.route === activeKey}
                onClick={() => navigate(`${basePath}/${entry.module.route}`)}
              />
            ))}
          </React.Fragment>
        ))}
      </nav>

      {activeEntry?.isDashboard ? (
        <DashboardPage dashboardKey={activeEntry.dashboardKey!} />
      ) : activeEntry?.isDynamic ? (
        <DynamicReportPage
          module={activeEntry.module as ReportModule<DynamicReportFilters, DynamicReportRow>}
          reportKey={activeEntry.reportKey!}
        />
      ) : activeEntry ? (
        <ReportPage module={activeEntry.module} />
      ) : null}
    </div>
  );
};

const NavButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      'border-b-2 px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'border-action-primary-border text-text-primary'
        : 'border-transparent text-text-subtle hover:text-text-secondary hover:border-border-subtle',
    )}
  >
    {label}
  </button>
);

export default ReportingApp;
