import React from 'react';
import type { AccessLevel } from '../../../features/access-management/model/access.types';

export interface BulkPermissionFormValues {
  moduleKey: string;
  level: AccessLevel;
}

interface BulkPermissionModalProps {
  open: boolean;
  roleCount: number;
  moduleOptions: Array<{ value: string; label: string }>;
  levelOptions: Array<{ value: AccessLevel; label: string }>;
  confirmLoading?: boolean;
  onSubmit: (values: BulkPermissionFormValues) => void;
  onCancel: () => void;
  t: (key: string, params?: Record<string, unknown>) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
}

type BulkPermissionFormState = {
  moduleKey: string;
  level: AccessLevel | '';
};

const BulkPermissionModal: React.FC<BulkPermissionModalProps> = ({
  open,
  roleCount,
  moduleOptions,
  levelOptions,
  confirmLoading,
  onSubmit,
  onCancel,
  t,
  formatNumber,
}) => {
  const [formValues, setFormValues] = React.useState<BulkPermissionFormState>({
    moduleKey: '',
    level: '',
  });
  const [errors, setErrors] = React.useState<{ moduleKey?: string; level?: string }>({});

  React.useEffect(() => {
    if (open) {
      setFormValues({ moduleKey: '', level: '' });
      setErrors({});
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const formattedCount = formatNumber(roleCount);

  const validate = () => {
    const nextErrors: { moduleKey?: string; level?: string } = {};
    if (!formValues.moduleKey) {
      nextErrors.moduleKey = t('access.bulk.moduleRequired');
    }
    if (!formValues.level) {
      nextErrors.level = t('access.bulk.levelRequired');
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }
    onSubmit({
      moduleKey: formValues.moduleKey,
      level: formValues.level as AccessLevel,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-surface-overlay"
        style={{
          backgroundColor: 'var(--surface-overlay-bg, rgba(15, 23, 42, 0.85))',
          opacity: 'var(--overlay-opacity, 0.9)',
        }}
        aria-hidden="true"
        onClick={onCancel}
      />
      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-surface-default p-6 shadow-2xl">
        <header className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">{t('access.bulk.modal.title')}</h2>
          </div>
          <button
            type="button"
            className="text-xl font-semibold text-text-subtle hover:text-text-secondary"
            aria-label={t('access.bulk.cancelText')}
            onClick={onCancel}
          >
            ×
          </button>
        </header>

        <div className="mb-5 rounded-2xl border border-state-info-border bg-state-info px-4 py-3 text-sm text-state-info-text">
          {t('access.bulk.info', { count: formattedCount })}
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
            {t('access.bulk.moduleLabel')}
            <select
              className={`rounded-2xl border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-selection-outline ${
                errors.moduleKey ? 'border-state-danger-border' : 'border-border-subtle'
              }`}
              value={formValues.moduleKey}
              onChange={(event) => setFormValues((prev) => ({ ...prev, moduleKey: event.target.value }))}
            >
              <option value="">{t('access.bulk.modulePlaceholder')}</option>
              {moduleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.moduleKey ? <span className="text-xs text-state-danger-text">{errors.moduleKey}</span> : null}
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
            {t('access.bulk.levelLabel')}
            <select
              className={`rounded-2xl border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-selection-outline ${
                errors.level ? 'border-state-danger-border' : 'border-border-subtle'
              }`}
              value={formValues.level}
              onChange={(event) =>
                setFormValues((prev) => ({ ...prev, level: event.target.value as AccessLevel | '' }))
              }
            >
              <option value="">{t('access.bulk.levelPlaceholder')}</option>
              {levelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.level ? <span className="text-xs text-state-danger-text">{errors.level}</span> : null}
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-xl border border-border-subtle px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted"
            onClick={onCancel}
          >
            {t('access.bulk.cancelText')}
          </button>
          <button
            type="button"
            className="rounded-xl bg-action-primary px-4 py-2 text-sm font-semibold text-action-primary-text shadow hover:opacity-90 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={confirmLoading}
          >
            {confirmLoading ? `${t('access.bulk.okText')}...` : t('access.bulk.okText')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkPermissionModal;
