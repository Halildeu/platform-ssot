import React, { useMemo } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@mfe/design-system';
import { useShellCommonI18n } from '../../app/i18n';
import keycloak from '../../app/auth/keycloakClient';
import { buildAppRedirectUri, isPermitAllMode } from '../../app/auth/auth-config';
import { useAppSelector } from '../../app/store/store.hooks';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useShellCommonI18n();
  const permitAllMode = isPermitAllMode();
  const { token, initialized } = useAppSelector((state) => state.auth);
  const redirectPath = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect');
    return redirect || '/';
  }, [location.search]);

  const handleCorporateLogin = () => {
    if (permitAllMode) {
      navigate(redirectPath);
      return;
    }
    const redirectUri = buildAppRedirectUri(`/login?redirect=${encodeURIComponent(redirectPath)}`);
    keycloak.login({ redirectUri }).catch((err) => console.error('[LoginPage] keycloak.login() failed:', err));
  };

  if (initialized && token) {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 px-6 py-10">
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-action-primary text-sm font-bold text-action-primary-text">
            LOGO
          </div>
          <div>
            <h1 className="text-lg font-semibold text-text-primary" data-testid="login-title">
              {t('auth.login.title')}
            </h1>
            <p className="text-xs text-text-secondary">
              {t('auth.login.description')}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {permitAllMode ? (
            <div
              data-testid="permitall-login-banner"
              className="rounded-2xl border border-border-subtle bg-surface-muted px-4 py-3 text-xs font-semibold text-text-secondary"
            >
              Dev/permitAll modunda oturum açmaya gerek yok, yönlendiriliyorsunuz.
              <Button
                type="button"
                className="mt-3 w-full bg-action-primary text-action-primary-text hover:opacity-90"
                onClick={handleCorporateLogin}
              >
                {t('auth.login.continue') || 'Devam Et'}
              </Button>
            </div>
          ) : (
            <>
              <Button
                type="button"
                className="flex w-full items-center justify-center bg-action-primary text-action-primary-text hover:opacity-90"
                onClick={handleCorporateLogin}
                data-testid="corporate-login-button"
              >
                {t('auth.login.submit')}
              </Button>
              <p className="text-xs text-text-subtle">
                {t('auth.login.keycloakInfo')}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
