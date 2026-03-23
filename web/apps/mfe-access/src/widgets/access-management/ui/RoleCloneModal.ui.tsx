import React from 'react';
import { Modal, Switch } from '@mfe/design-system';
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
    <Modal
      open={open}
      title={t('access.clone.modal.title')}
      size="lg"
      onClose={() => onCancel()}
      footer={(
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="rounded-xl border border-border-subtle px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted"
            onClick={onCancel}
          >
            {t('access.clone.cancelText')}
          </button>
          <button
            type="button"
            className="rounded-xl bg-action-primary px-4 py-2 text-sm font-semibold text-action-primary-text shadow-sm hover:opacity-90 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={confirmLoading}
          >
            {confirmLoading ? `${t('access.clone.okText')}...` : t('access.clone.okText')}
          </button>
        </div>
      )}
    >
      <div className="flex flex-col gap-4">
        {role ? (
          <p className="text-sm text-text-subtle">{t('access.clone.modal.subtitle', { roleName: role.name })}</p>
        ) : null}
        <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
          {t('access.clone.nameLabel')}
          <input
            type="text"
            className={`rounded-xl border px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-selection-outline ${errors.name ? 'border-state-danger-border' : 'border-border-subtle'}`}
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
            className="rounded-xl border border-border-subtle px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-selection-outline"
            rows={3}
            value={formValues.description ?? ''}
            onChange={(event) => setFormValues((prev) => ({ ...prev, description: event.target.value }))}
            placeholder={t('access.clone.descriptionPlaceholder')}
          />
        </label>
        <div className="rounded-2xl border border-border-subtle bg-surface-muted px-4 py-3">
          <Switch
            label={t('access.clone.copyMemberCount')}
            description={t('access.clone.copyMemberTooltip')}
            checked={formValues.copyMemberCount}
            onCheckedChange={(checked) => setFormValues((prev) => ({ ...prev, copyMemberCount: checked }))}
            fullWidth
          />
        </div>
      </div>
    </Modal>
  );
};

export default RoleCloneModal;
