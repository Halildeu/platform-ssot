import React from 'react';
import { Modal, Switch, TextInput, Button } from '@mfe/design-system';
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
    if (!validate()) return;
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
      onClose={onCancel}
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>
            {t('access.clone.cancelText')}
          </Button>
          <Button onClick={handleSubmit} loading={confirmLoading} disabled={confirmLoading}>
            {t('access.clone.okText')}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {role && (
          <p className="text-sm text-text-subtle">
            {t('access.clone.modal.subtitle', { roleName: role.name })}
          </p>
        )}
        <TextInput
          label={t('access.clone.nameLabel')}
          value={formValues.name}
          onChange={(e) => setFormValues((prev) => ({ ...prev, name: typeof e === 'string' ? e : e.target.value }))}
          placeholder={t('access.clone.namePlaceholder')}
          error={errors.name}
          autoFocus
        />
        <TextInput
          label={t('access.clone.descriptionLabel') ?? 'Açıklama'}
          value={formValues.description ?? ''}
          onChange={(e) => setFormValues((prev) => ({ ...prev, description: typeof e === 'string' ? e : e.target.value }))}
          placeholder={t('access.clone.descriptionPlaceholder')}
          multiline
          rows={3}
        />
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
