import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store.hooks';
import { loginUser } from '../../features/auth/model/auth.slice';
import { createAuthSessionAuditNotification } from '../../features/auth/lib/session-audit-deeplink';
import { pushNotification, toggleOpen } from '../../features/notifications/model/notifications.slice';
import { Button } from '@mfe/design-system';
import { useShellCommonI18n } from '../i18n';
import { useThemeContext } from '../theme/theme-context.provider';

interface LoginPopoverProps {
  onClose: () => void;
  onNavigate?: () => void;
}

const LoginPopover: React.FC<LoginPopoverProps> = ({ onClose, onNavigate }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.auth);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useShellCommonI18n();
  const { axes } = useThemeContext();
  const overlayStyle = useMemo(
    () => ({
      backgroundColor:
        `color-mix(in srgb, var(--surface-overlay-bg) ${axes.overlayIntensity}%, transparent)`,
      opacity: axes.overlayOpacity / 100,
    }),
    [axes.overlayOpacity, axes.overlayIntensity],
  );

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    try {
      const payload = await dispatch(loginUser({ email, password })).unwrap();
      onClose();
      const notification = createAuthSessionAuditNotification({
        email: payload?.email ?? email,
        permissions: [
          ...(Array.isArray(payload?.permissions) ? payload.permissions : []),
          ...(Array.isArray(payload?.authzSnapshot?.permissions) ? payload.authzSnapshot.permissions : []),
        ],
        role: typeof payload?.role === 'string' ? payload.role : null,
      });
      if (notification) {
        dispatch(pushNotification(notification));
        dispatch(toggleOpen(true));
      }
    } catch {
      // Reducer state already carries the user-facing error message.
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[1400] bg-surface-overlay"
        style={overlayStyle}
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className="fixed top-16 right-6 z-[1450] w-80 rounded-2xl border border-border-subtle bg-surface-panel shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={t('auth.popover.title')}
      >
      <div className="flex items-center justify-between border-b border-border-subtle px-4 py-2">
        <p className="text-sm font-semibold text-text-primary">
          {t('auth.popover.title')}
        </p>
        <button
          type="button"
          className="text-xs font-medium text-text-subtle hover:text-text-secondary"
          onClick={() => {
            onClose();
            (onNavigate ?? (() => navigate('/login')))();
          }}
        >
          {t('auth.popover.fullscreen')}
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3 px-4 py-4">
        <div className="flex flex-col gap-1 text-xs font-medium text-text-secondary">
          <label htmlFor="login-popover-email">
            {t('auth.login.emailLabel')}
          </label>
          <input
            id="login-popover-email"
            type="email"
            autoComplete="username"
            placeholder={t('auth.login.emailPlaceholder')}
            className="h-9 rounded-md border border-border-subtle px-3 text-sm text-text-primary placeholder:text-text-subtle focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1 text-xs font-medium text-text-secondary">
          <label htmlFor="login-popover-password">
            {t('auth.login.passwordLabel')}
          </label>
          <input
            id="login-popover-password"
            type="password"
            autoComplete="current-password"
            placeholder={t('auth.login.passwordPlaceholder')}
            className="h-9 rounded-md border border-border-subtle px-3 text-sm text-text-primary placeholder:text-text-subtle focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <Button type="submit" className="w-full" disabled={status === 'loading'}>
          <span aria-hidden className="mr-1">🔑</span>
          <span>{t('auth.login.submit')}</span>
        </Button>

        {status === 'failed' && submitted && (
          <div className="mt-2 rounded-md border border-state-danger-border bg-state-danger-bg px-3 py-2 text-xs text-state-danger-text">
            {error || t('auth.login.failed')}
          </div>
        )}
        <div className="mt-2 text-center text-xs text-text-secondary">
          {t('auth.login.noAccount')}{' '}
          <Link
            to="/register"
            onClick={() => {
              onClose();
              navigate('/register');
            }}
            className="font-semibold text-action-primary-text hover:underline"
          >
            {t('auth.login.registerCta')}
          </Link>
        </div>
      </form>
      </div>
    </>
  );
};

export default LoginPopover;
