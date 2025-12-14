import React from 'react';
import type { AccessRole } from '../../../features/access-management/model/access.types';

export interface RoleCloneFormValues {
  name: string;
  description?: string;
  copyMemberCount: boolean;
}

interface RoleCloneModalProps {
  open: boolean;
  role: AccessRole | null;
  confirmLoading?: boolean;
  onSubmit: (values: RoleCloneFormValues) => void;
  onCancel: () => void;
  t: (key: string, params?: Record<string, unknown>) => string;
}

const RoleCloneModal: React.FC<RoleCloneModalProps> = ({ open, role, confirmLoading, onSubmit, onCancel, t }) => {
  const [formValues, setFormValues] = React.useState<RoleCloneFormValues>({
    name: '',
    description: '',
    copyMemberCount: false,
  });
  const [errors, setErrors] = React.useState<{ name?: string }>({});

  React.useEffect(() => {
    if (open && role) {
      setFormValues({
        name: t('access.clone.nameSuggestion', { roleName: role.name }),
        description: role.description ?? '',
        copyMemberCount: false,
      });
      setErrors({});
    } else if (!open) {
      setFormValues({ name: '', description: '', copyMemberCount: false });
      setErrors({});
    }
  }, [open, role, t]);

  if (!open) {
    return null;
  }

  const validate = () => {
    const nextErrors: { name?: string } = {};
    const trimmed = formValues.name.trim();
    if (!trimmed) {
      nextErrors.name = t('access.clone.nameRequired');
    } else if (trimmed.length < 3) {
      nextErrors.name = t('access.clone.nameMin');
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }
    onSubmit({
      name: formValues.name.trim(),
      description: formValues.description?.trim() || undefined,
      copyMemberCount: formValues.copyMemberCount,
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
        aria-label={t('access.clone.cancelText')}
        onClick={onCancel}
      />
      <div className="relative z-10 w-full max-w-xl rounded-3xl bg-surface-default p-6 shadow-2xl">
        <header className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">{t('access.clone.modal.title')}</h2>
            {role ? (
              <p className="text-sm text-text-subtle">{t('access.clone.modal.subtitle', { roleName: role.name })}</p>
            ) : null}
          </div>
          <button type="button" className="text-text-subtle hover:text-text-secondary" onClick={onCancel}>
            ×
          </button>
        </header>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
            {t('access.clone.nameLabel')}
            <input
              type="text"
              className={`rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-selection-outline ${errors.name ? 'border-state-danger-border' : 'border-border-subtle'}`}
              value={formValues.name}
              onChange={(event) => setFormValues((prev) => ({ ...prev, name: event.target.value }))}
              placeholder={t('access.clone.namePlaceholder')}
              autoFocus
            />
            {errors.name ? <span className="text-xs text-state-danger-text">{errors.name}</span> : null}
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
            {t('access.clone.descriptionLabel') ?? 'Açıklama'}
            <textarea
              className="rounded-xl border border-border-subtle px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-selection-outline"
              rows={3}
              value={formValues.description ?? ''}
              onChange={(event) => setFormValues((prev) => ({ ...prev, description: event.target.value }))}
              placeholder={t('access.clone.descriptionPlaceholder')}
            />
          </label>
          <label className="flex items-center justify-between rounded-2xl border border-border-subtle bg-surface-muted px-4 py-3 text-sm">
            <div>
              <p className="font-semibold text-text-primary">{t('access.clone.copyMemberCount')}</p>
              <p className="text-xs text-text-subtle">{t('access.clone.copyMemberTooltip')}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={formValues.copyMemberCount}
              onClick={() => setFormValues((prev) => ({ ...prev, copyMemberCount: !prev.copyMemberCount }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${formValues.copyMemberCount ? 'bg-action-primary' : 'bg-border-subtle'}`}
            >
              <span className="inline-block h-5 w-5 transform rounded-full bg-surface-default transition" style={{ transform: formValues.copyMemberCount ? 'translateX(20px)' : 'translateX(2px)' }} />
            </button>
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-xl border border-border-subtle px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted"
            onClick={onCancel}
          >
            {t('access.clone.cancelText')}
          </button>
          <button
            type="button"
            className="rounded-xl bg-action-primary px-4 py-2 text-sm font-semibold text-action-primary-text shadow hover:opacity-90 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={confirmLoading}
          >
            {confirmLoading ? `${t('access.clone.okText')}...` : t('access.clone.okText')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleCloneModal;
