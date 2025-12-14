import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from 'mfe-ui-kit';
import { useShellCommonI18n } from '../../app/i18n';

const UnauthorizedPage: React.FC = () => {
  const location = useLocation();
  const { t } = useShellCommonI18n();
  const fromPath = (location.state as { from?: string } | null)?.from ?? '/';

  return (
    <div className="mt-16 flex justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border border-border-subtle bg-surface-default p-6 shadow-sm">
        <h1 className="mb-3 text-xl font-semibold text-text-primary">
          {t('auth.unauthorized.title')}
        </h1>
        <p className="mb-4 text-sm text-text-secondary">
          {t('auth.unauthorized.description')}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button className="bg-action-primary text-action-primary-text hover:opacity-90">
            <Link to={fromPath}>{t('auth.unauthorized.back')}</Link>
          </Button>
          <Button className="bg-surface-muted text-text-secondary hover:bg-surface-default">
            <Link to="/">{t('auth.unauthorized.home')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
