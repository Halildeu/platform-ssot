import React from 'react';
import clsx from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { reportModules } from '../../modules';
import { ReportPage } from './ReportPage';
import { useReportingI18n } from '../../i18n/useReportingI18n';

const resolveBasePath = (pathname: string): string => {
  if (pathname.startsWith('/admin/reports')) {
    return '/admin/reports';
  }
  return '/reports';
};

const getActiveRoute = (pathname: string): string => {
  const base = resolveBasePath(pathname);
  const remainder = pathname.slice(base.length).replace(/^\//, '');
  if (!remainder) {
    return reportModules[0].route;
  }
  const [firstSegment] = remainder.split('/');
  return firstSegment || reportModules[0].route;
};

const ReportingApp: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useReportingI18n();
  const basePath = resolveBasePath(location.pathname);
  const activeKey = getActiveRoute(location.pathname);
  const activeModule = reportModules.find((module) => module.route === activeKey) ?? reportModules[0];

  React.useEffect(() => {
    const expectedPath = `${basePath}/${activeKey}`;
    if (!location.pathname.startsWith(expectedPath)) {
      navigate(expectedPath, { replace: true });
    }
  }, [activeKey, basePath, location.pathname, navigate]);

  return (
    <div className="flex flex-col gap-4">
      <nav className="flex flex-wrap gap-2 border-b border-border-subtle">
        {reportModules.map((module) => {
          const isActive = module.route === activeKey;
          return (
            <button
              key={module.route}
              type="button"
              onClick={() => navigate(`${basePath}/${module.route}`)}
              className={clsx(
                'border-b-2 px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'border-action-primary-border text-text-primary'
                  : 'border-transparent text-text-subtle hover:text-text-secondary hover:border-border-subtle',
              )}
            >
              {t(module.navKey)}
            </button>
          );
        })}
      </nav>
      <ReportPage module={activeModule} />
    </div>
  );
};

export default ReportingApp;
