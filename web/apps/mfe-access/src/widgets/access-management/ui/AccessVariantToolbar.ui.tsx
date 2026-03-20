import React from 'react';
import { Button, Select } from '@mfe/design-system';

export interface AccessVariantOption {
  value: string;
  label: string;
}

interface AccessVariantToolbarProps {
  selectedVariantId: string | null;
  variantOptions: AccessVariantOption[];
  isDirty: boolean;
  onSelectVariant: (value: string | null) => void;
  onSaveVariant: () => void;
  onSaveAsVariant: () => void;
  onDeleteVariant: () => void;
  t: (key: string, params?: Record<string, unknown>) => string;
}

const AccessVariantToolbar: React.FC<AccessVariantToolbarProps> = ({
  selectedVariantId,
  variantOptions,
  isDirty,
  onSelectVariant,
  onSaveVariant,
  onSaveAsVariant,
  onDeleteVariant,
  t,
}) => {
  const saveLabel = selectedVariantId
    ? isDirty
      ? t('access.variants.saveChanges')
      : t('access.variants.save')
    : t('access.variants.save');

  return (
    <div data-testid="access-variant-toolbar" className="flex flex-wrap items-center gap-2 text-text-secondary">
      <Select
        className="min-w-[220px]"
        value={selectedVariantId ?? ''}
        onValueChange={(value) => onSelectVariant(value || null)}
        options={variantOptions}
        clearable
        emptyOptionLabel={t('access.variants.selectPlaceholder')}
        aria-label={t('access.variants.selectPlaceholder')}
      />
      <Button
        type="button"
        onClick={onSaveVariant}
        variant={selectedVariantId && !isDirty ? 'secondary' : 'primary'}
      >
        {saveLabel}
      </Button>
      <Button type="button" onClick={onSaveAsVariant} variant="secondary">
        {t('access.variants.saveAs')}
      </Button>
      <Button
        type="button"
        onClick={onDeleteVariant}
        disabled={!selectedVariantId}
        variant="secondary"
        className="border-state-danger-border text-state-danger-text hover:bg-state-danger-bg"
      >
        {t('access.variants.delete')}
      </Button>
      {isDirty ? (
        <span className="text-sm italic text-text-subtle">{t('access.variants.unsavedChanges')}</span>
      ) : null}
    </div>
  );
};

export default AccessVariantToolbar;
