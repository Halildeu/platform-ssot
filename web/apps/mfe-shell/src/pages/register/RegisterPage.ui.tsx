import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store/store.hooks';
import { registerUser, resetRegistrationStatus } from '../../features/auth/model/auth.slice';
import { Button } from '@mfe/design-system';
import { useShellCommonI18n } from '../../app/i18n';

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const [formValues, setFormValues] = useState<RegisterFormValues>({
    name: '',
    email: '',
    password: '',
  });
  const [passwordValue, setPasswordValue] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { registrationStatus, error, lastRegisteredEmail } = useAppSelector((state) => state.auth);
  const { t } = useShellCommonI18n();

  const handleFinish = (values: RegisterFormValues) => {
    setSuccessMessage('');
    dispatch(registerUser(values));
  };

  const passwordChecks = useMemo(() => ({
    length: passwordValue.length >= 8,
    uppercase: /[A-Z]/.test(passwordValue),
    lowercase: /[a-z]/.test(passwordValue),
    number: /[0-9]/.test(passwordValue),
    special: /[^A-Za-z0-9]/.test(passwordValue),
  }), [passwordValue]);

  const requirements = useMemo(
    () => [
      {
        key: 'length',
        label: t('auth.register.requirement.length'),
        short: '8+',
        fulfilled: passwordChecks.length,
      },
      {
        key: 'uppercase',
        label: t('auth.register.requirement.uppercase'),
        short: 'A',
        fulfilled: passwordChecks.uppercase,
      },
      {
        key: 'lowercase',
        label: t('auth.register.requirement.lowercase'),
        short: 'a',
        fulfilled: passwordChecks.lowercase,
      },
      {
        key: 'number',
        label: t('auth.register.requirement.number'),
        short: '0-9',
        fulfilled: passwordChecks.number,
      },
      {
        key: 'special',
        label: t('auth.register.requirement.special'),
        short: '#',
        fulfilled: passwordChecks.special,
      },
    ],
    [t, passwordChecks],
  );

  useEffect(() => {
    if (registrationStatus === 'succeeded') {
      const registeredEmail = lastRegisteredEmail ?? formValues.email;
      setSuccessMessage(t('auth.register.success'));
      setFormValues({ name: '', email: '', password: '' });
      setPasswordValue('');
      const timer = setTimeout(() => {
        navigate('/login', { state: { email: registeredEmail } });
      }, 3000);
      return () => {
        clearTimeout(timer);
        dispatch(resetRegistrationStatus());
      };
    }
  }, [registrationStatus, navigate, lastRegisteredEmail, dispatch, formValues.email, t]);

  const handleChange =
    (field: keyof RegisterFormValues): React.ChangeEventHandler<HTMLInputElement> =>
      (event) => {
        const value = event.target.value;
        setFormValues((prev) => ({ ...prev, [field]: value }));
        if (field === 'password') {
          setPasswordValue(value);
        }
      };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    handleFinish(formValues);
  };

  return (
    <div className="mx-auto max-w-md px-6 py-8">
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-6 shadow-xs">
        <h1 className="mb-4 text-xl font-semibold text-text-primary">{t('auth.register.title')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1 text-xs font-medium text-text-secondary">
            <label htmlFor="register-name">{t('auth.register.nameLabel')}</label>
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              placeholder={t('auth.register.namePlaceholder')}
              className="h-9 rounded-md border border-border-subtle px-3 text-sm text-text-primary placeholder:text-text-subtle focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
              value={formValues.name}
              onChange={handleChange('name')}
            />
          </div>

          <div className="flex flex-col gap-1 text-xs font-medium text-text-secondary">
            <label htmlFor="register-email">{t('auth.register.emailLabel')}</label>
            <input
              id="register-email"
              type="email"
              autoComplete="username"
              placeholder={t('auth.register.emailPlaceholder')}
              className="h-9 rounded-md border border-border-subtle px-3 text-sm text-text-primary placeholder:text-text-subtle focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
              value={formValues.email}
              onChange={handleChange('email')}
            />
          </div>

          <div className="flex flex-col gap-1 text-xs font-medium text-text-secondary">
            <label htmlFor="register-password">{t('auth.register.passwordLabel')}</label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              placeholder={t('auth.register.passwordPlaceholder')}
              className="h-9 rounded-md border border-border-subtle px-3 text-sm text-text-primary placeholder:text-text-subtle focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
              value={formValues.password}
              onChange={handleChange('password')}
            />
          </div>

          <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
            {requirements.map((rule) => (
              <span
                key={rule.key}
                title={rule.label}
                className={`inline-flex min-w-[44px] items-center justify-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                  rule.fulfilled
                    ? 'border-state-success-border text-state-success-text'
                    : 'border-state-danger-border text-state-danger-text'
                }`}
              >
                {rule.short}
              </span>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              className="min-w-[160px] bg-action-primary text-action-primary-text hover:opacity-90 disabled:opacity-60"
              disabled={registrationStatus === 'loading'}
            >
              {t('auth.register.submit')}
            </Button>
          </div>
        </form>

        {registrationStatus === 'failed' && (
          <div className="mt-4 rounded-md border border-state-danger-border bg-state-danger-bg px-3 py-2 text-xs text-state-danger-text">
            {error || t('auth.register.failed')}
          </div>
        )}
        {successMessage && (
          <div className="mt-4 rounded-md border border-state-success-border bg-state-success-bg px-3 py-2 text-xs text-state-success-text">
            {successMessage}
          </div>
        )}

        <p className="mt-4 text-center text-xs text-text-secondary">
          {t('auth.register.hasAccount')}{' '}
          <Link to="/login" className="font-semibold text-action-primary-text hover:underline">
            {t('auth.register.loginCta')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
