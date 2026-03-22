import React, { useMemo, useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@mfe/design-system';
import { useShellCommonI18n } from '../../app/i18n';
import keycloak from '../../app/auth/keycloakClient';
import { buildAppRedirectUri, isPermitAllMode, authConfig } from '../../app/auth/auth-config';
import { useAppSelector, useAppDispatch } from '../../app/store/store.hooks';
import { setKeycloakSession, setAuthInitialized } from '../../features/auth/model/auth.slice';

/**
 * LoginPage — Kendi temamızda login
 *
 * İki mod:
 * 1. Direct Grant: Username/password formu shell içinde,
 *    Keycloak token endpoint'ine POST → token alınır
 * 2. SSO Redirect: "Kurumsal SSO ile Giriş" butonu →
 *    Keycloak login sayfasına redirect (fallback)
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { t } = useShellCommonI18n();
  const permitAllMode = isPermitAllMode();
  const { token, initialized } = useAppSelector((state) => state.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectPath = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect');
    return redirect || '/';
  }, [location.search]);

  // Direct Grant login — kendi temamızda username/password
  const handleDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Kullanıcı adı ve şifre gereklidir.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const tokenUrl = `${authConfig.keycloak.url}/realms/${authConfig.keycloak.realm}/protocol/openid-connect/token`;
      const body = new URLSearchParams({
        grant_type: 'password',
        client_id: authConfig.keycloak.clientId,
        username: username.trim(),
        password,
        scope: 'openid profile email',
      });

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      const data = await response.json();

      if (data.access_token) {
        // Token alındı — Redux store'a kaydet
        dispatch(
          setKeycloakSession({
            token: data.access_token,
            profile: undefined, // Profile bootstrap'ta çözülecek
            expiresAt: data.expires_in
              ? Date.now() + data.expires_in * 1000
              : null,
          }),
        );
        dispatch(setAuthInitialized(true));
        navigate(redirectPath, { replace: true });
      } else {
        const msg = data.error_description || data.error || 'Giriş başarısız.';
        if (msg.includes('Invalid user credentials') || msg.includes('invalid_grant')) {
          setError('Kullanıcı adı veya şifre hatalı.');
        } else if (msg.includes('Account disabled') || msg.includes('Account is not fully set up')) {
          setError('Hesap devre dışı veya kurulumu tamamlanmamış.');
        } else {
          setError(msg);
        }
      }
    } catch (err) {
      console.error('[LoginPage] Direct login failed:', err);
      setError('Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  // SSO Redirect — Keycloak login sayfasına yönlendir (fallback)
  const handleSSOLogin = () => {
    const redirectUri = buildAppRedirectUri(`/login?redirect=${encodeURIComponent(redirectPath)}`);
    keycloak.login({ redirectUri }).catch((err) =>
      console.error('[LoginPage] keycloak.login() failed:', err),
    );
  };

  // PermitAll mode — doğrudan geç
  const handlePermitAllLogin = () => {
    navigate(redirectPath);
  };

  if (initialized && token) {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border-subtle bg-surface-default p-8 shadow-sm">
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-action-primary text-sm font-bold text-action-primary-text shadow-sm">
              S
            </div>
            <div>
              <h1 className="text-xl font-semibold text-text-primary">
                {t('auth.login.title') || 'Giriş Yap'}
              </h1>
              <p className="text-xs text-text-secondary">
                Kurumsal hesabınızla oturum açın
              </p>
            </div>
          </div>

          {permitAllMode ? (
            /* PermitAll Mode */
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-3">
              <p className="text-xs font-medium text-emerald-700">
                Geliştirme modunda oturum açmaya gerek yok.
              </p>
              <Button
                type="button"
                className="mt-3 w-full bg-action-primary text-action-primary-text hover:opacity-90"
                onClick={handlePermitAllLogin}
              >
                Devam Et
              </Button>
            </div>
          ) : (
            <>
              {/* Direct Login Form */}
              <form onSubmit={handleDirectLogin} className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="login-username"
                    className="mb-1.5 block text-xs font-medium text-text-primary"
                  >
                    E-posta veya Kullanıcı Adı
                  </label>
                  <input
                    id="login-username"
                    type="text"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(''); }}
                    placeholder="admin@example.com"
                    autoComplete="username"
                    autoFocus
                    className="w-full rounded-lg border border-border-subtle bg-surface-default px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-action-primary focus:outline-none focus:ring-2 focus:ring-action-primary/20"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="login-password"
                    className="mb-1.5 block text-xs font-medium text-text-primary"
                  >
                    Şifre
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-border-subtle bg-surface-default px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-action-primary focus:outline-none focus:ring-2 focus:ring-action-primary/20"
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-action-primary text-action-primary-text hover:opacity-90 disabled:opacity-50"
                  disabled={loading}
                  data-testid="direct-login-button"
                >
                  {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                </Button>
              </form>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-border-subtle" />
                <span className="text-[10px] font-medium uppercase tracking-widest text-text-tertiary">
                  veya
                </span>
                <div className="h-px flex-1 bg-border-subtle" />
              </div>

              {/* SSO Fallback */}
              <button
                type="button"
                onClick={handleSSOLogin}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border-subtle bg-surface-muted px-4 py-2.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-canvas"
                data-testid="sso-login-button"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Kurumsal SSO ile Giriş
              </button>

              <p className="mt-4 text-center text-[10px] text-text-tertiary">
                SSO ile giriş yapıldığında Keycloak oturum sayfasına yönlendirilirsiniz.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
