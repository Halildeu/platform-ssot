import React from 'react';
import { Button, Modal, Segmented, Select, createSegmentedPreset } from '@mfe/design-system';
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
  const levelSegmentedPreset = React.useMemo(
    () => ({
      ...createSegmentedPreset('filter_bar'),
      size: 'sm' as const,
      fullWidth: true,
    }),
    [],
  );
  const levelSegmentedItems = React.useMemo(
    () => levelOptions.map((option) => ({
      value: option.value,
      label: option.label,
      dataTestId: `bulk-permission-level-${String(option.value).toLowerCase()}`,
    })),
    [levelOptions],
  );

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
    <Modal
      open={open}
      title={t('access.bulk.modal.title')}
      size="lg"
      onClose={() => onCancel()}
      footer={(
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            {t('access.bulk.cancelText')}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            loading={confirmLoading}
            loadingLabel={`${t('access.bulk.okText')}...`}
          >
            {t('access.bulk.okText')}
          </Button>
        </div>
      )}
    >
      <div className="space-y-5">
        <div className="mb-5 rounded-2xl border border-state-info-border bg-state-info px-4 py-3 text-sm text-state-info-text">
          {t('access.bulk.info', { count: formattedCount })}
        </div>

        <div className="flex flex-col gap-4">
          <Select
            data-testid="bulk-permission-module"
            value={formValues.moduleKey}
            onChange={(e) => setFormValues((prev) => ({ ...prev, moduleKey: e.target.value }))}
            options={moduleOptions}
            placeholder={t('access.bulk.modulePlaceholder')}
            error={errors.moduleKey}
            fullWidth
          />

          <label className="flex flex-col gap-1 text-sm font-semibold text-text-secondary">
            {t('access.bulk.levelLabel')}
            <Segmented
              items={levelSegmentedItems}
              value={formValues.level}
              ariaLabel={t('access.bulk.levelLabel')}
              onValueChange={(nextValue) =>
                setFormValues((prev) => ({ ...prev, level: nextValue as AccessLevel | '' }))
              }
              appearance={levelSegmentedPreset.appearance}
              shape={levelSegmentedPreset.shape}
              size={levelSegmentedPreset.size}
              iconPosition={levelSegmentedPreset.iconPosition}
              fullWidth={levelSegmentedPreset.fullWidth}
              className={`w-full ${errors.level ? 'rounded-2xl ring-1 ring-state-danger-border' : ''}`}
              classes={{ list: 'w-full', item: 'min-w-0 flex-1', content: 'w-full' }}
            />
            {errors.level ? <span className="text-xs text-state-danger-text">{errors.level}</span> : null}
          </label>
        </div>
      </div>
    </Modal>
  );
};

export default BulkPermissionModal;
