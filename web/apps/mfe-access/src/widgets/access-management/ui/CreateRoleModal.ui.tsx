import React from 'react';
import { Button, Dialog, TextInput } from '@mfe/design-system';

interface CreateRoleModalProps {
  open: boolean;
  confirmLoading?: boolean;
  onSubmit: (values: { name: string; description?: string }) => void;
  onCancel: () => void;
  t: (key: string, params?: Record<string, unknown>) => string;
}

const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  open,
  confirmLoading,
  onSubmit,
  onCancel,
  t,
}) => {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [errors, setErrors] = React.useState<{ name?: string }>({});

  React.useEffect(() => {
    if (open) {
      setName('');
      setDescription('');
      setErrors({});
    }
  }, [open]);

  const validate = (): boolean => {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 3) {
      setErrors({ name: t('access.create.nameMinLength') });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title={t('access.create.title')}
      size="lg"
      footer={(
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={confirmLoading}>
            {t('access.clone.cancelText')}
          </Button>
          <Button onClick={handleSubmit} loading={confirmLoading} disabled={!name.trim()}>
            {t('access.create.submitText')}
          </Button>
        </div>
      )}
    >
      <div className="flex flex-col gap-4">
        <TextInput
          label={t('access.create.nameLabel')}
          placeholder={t('access.create.namePlaceholder')}
          value={name}
          onValueChange={setName}
          error={errors.name}
          data-testid="create-role-name"
          autoFocus
          fullWidth
        />
        <TextInput
          label={t('access.create.descriptionLabel')}
          placeholder={t('access.create.descriptionPlaceholder')}
          value={description}
          onValueChange={setDescription}
          data-testid="create-role-description"
          fullWidth
        />
      </div>
    </Dialog>
  );
};

export default CreateRoleModal;
