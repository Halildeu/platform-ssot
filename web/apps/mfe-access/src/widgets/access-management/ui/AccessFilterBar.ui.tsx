import React from 'react';
import { Button, Segmented, Select, TextInput, createSegmentedPreset } from '@mfe/design-system';
import type { AccessFilters, AccessLevel } from '../../../features/access-management/model/access.types';

interface AccessFilterBarProps {
  filters: AccessFilters;
  modules: Map<string, string>;
  onChange: (next: AccessFilters) => void;
  t: (key: string, params?: Record<string, unknown>) => string;
}

const defaultFilters: AccessFilters = {
  search: '',
  moduleKey: 'ALL',
  level: 'ALL',
};

const AccessFilterBar: React.FC<AccessFilterBarProps> = ({ filters, modules, onChange, t }) => {
  const [localFilters, setLocalFilters] = React.useState<AccessFilters>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    onChange(localFilters);
  };

  const moduleOptions = React.useMemo(
    () => [
      { label: t('access.filter.moduleAll'), value: 'ALL' },
      ...Array.from(modules.entries()).map(([value, label]) => ({ value, label }))
    ],
    [modules, t]
  );

  const accessLevels = React.useMemo(
    () => [
      { label: t('access.filter.level.all'), value: 'ALL' as AccessFilters['level'], dataTestId: 'access-filter-level-all' },
      { label: t('access.filter.level.none'), value: 'NONE' as AccessFilters['level'], dataTestId: 'access-filter-level-none' },
      { label: t('access.filter.level.view'), value: 'VIEW' as AccessFilters['level'], dataTestId: 'access-filter-level-view' },
      { label: t('access.filter.level.edit'), value: 'EDIT' as AccessFilters['level'], dataTestId: 'access-filter-level-edit' },
      { label: t('access.filter.level.manage'), value: 'MANAGE' as AccessFilters['level'], dataTestId: 'access-filter-level-manage' },
    ],
    [t]
  );
  const levelSegmentedPreset = React.useMemo(
    () => ({
      ...createSegmentedPreset('filter_bar'),
      size: 'sm' as const,
      fullWidth: true,
    }),
    [],
  );

  const handleFieldChange = <K extends keyof AccessFilters>(key: K, value: AccessFilters[K]) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleLevelChange = (value: AccessLevel | 'ALL') => {
    handleFieldChange('level', value);
    onChange({ ...localFilters, level: value });
  };

  const handleReset = () => {
    setLocalFilters(defaultFilters);
    onChange(defaultFilters);
  };

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="access-filter-bar"
      className="flex w-full flex-wrap items-end gap-3 rounded-2xl border border-border-subtle bg-surface-default/70 p-4 shadow-sm"
    >
      <div className="min-w-[240px] flex-1">
        <TextInput
          label={<span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{t('access.filter.searchPlaceholder')}</span>}
          data-testid="access-filter-search"
          placeholder={t('access.filter.searchPlaceholder')}
          value={localFilters.search}
          onValueChange={(nextValue) => handleFieldChange('search', nextValue)}
          fullWidth
        />
      </div>
      <div className="min-w-[200px]">
        <Select
          label={<span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{t('access.filter.moduleAll')}</span>}
          data-testid="access-filter-module"
          value={localFilters.moduleKey}
          onValueChange={(nextValue) => {
            handleFieldChange('moduleKey', nextValue as AccessFilters['moduleKey']);
            onChange({ ...localFilters, moduleKey: nextValue as AccessFilters['moduleKey'] });
          }}
          options={moduleOptions}
          fullWidth
        />
      </div>
      <label className="flex min-w-[280px] flex-col text-xs font-semibold uppercase tracking-wide text-text-secondary">
        <span>{t('access.filter.level.all')}</span>
        <Segmented
          items={accessLevels}
          value={localFilters.level}
          ariaLabel={t('access.filter.level.all')}
          onValueChange={(nextValue) => handleLevelChange(nextValue as AccessLevel | 'ALL')}
          variant={levelSegmentedPreset.variant}
          shape={levelSegmentedPreset.shape}
          size={levelSegmentedPreset.size}
          iconPosition={levelSegmentedPreset.iconPosition}
          fullWidth={levelSegmentedPreset.fullWidth}
          className="mt-1 w-full"
          classes={{ list: 'w-full', item: 'min-w-0 flex-1', content: 'w-full' }}
        />
      </label>
      <div className="ml-auto flex flex-wrap gap-2">
        <Button
          type="submit"
          data-testid="access-filter-apply"
        >
          {t('access.filter.apply')}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleReset}
        >
          {t('access.filter.reset')}
        </Button>
      </div>
    </form>
  );
};

export default AccessFilterBar;
