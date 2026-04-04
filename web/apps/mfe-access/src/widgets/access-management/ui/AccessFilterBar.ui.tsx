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

const SEARCH_DEBOUNCE_MS = 300;

const AccessFilterBar: React.FC<AccessFilterBarProps> = ({ filters, modules, onChange, t }) => {
  const [searchValue, setSearchValue] = React.useState(filters.search);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const filtersRef = React.useRef(filters);
  filtersRef.current = filters;

  React.useEffect(() => {
    setSearchValue(filters.search);
  }, [filters.search]);

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange({ ...filtersRef.current, search: value });
    }, SEARCH_DEBOUNCE_MS);
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

  const handleModuleChange = (value: string) => {
    onChange({ ...filtersRef.current, moduleKey: value as AccessFilters['moduleKey'] });
  };

  const handleLevelChange = (value: AccessLevel | 'ALL') => {
    onChange({ ...filtersRef.current, level: value });
  };

  const handleReset = () => {
    setSearchValue('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onChange(defaultFilters);
  };

  return (
    <div
      data-testid="access-filter-bar"
      className="flex w-full flex-wrap items-end gap-3 rounded-2xl border border-border-subtle bg-surface-default/70 p-4 shadow-xs"
    >
      <div className="min-w-[240px] flex-1">
        <TextInput
          label={<span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{t('access.filter.searchPlaceholder')}</span>}
          data-testid="access-filter-search"
          placeholder={t('access.filter.searchPlaceholder')}
          value={searchValue}
          onValueChange={handleSearchChange}
          fullWidth
        />
      </div>
      <div className="min-w-[200px]">
        <Select
          label={<span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{t('access.filter.moduleAll')}</span>}
          data-testid="access-filter-module"
          value={filters.moduleKey}
          onValueChange={handleModuleChange}
          options={moduleOptions}
          fullWidth
        />
      </div>
      <label className="flex min-w-[320px] flex-col text-xs font-semibold uppercase tracking-wide text-text-secondary">
        <span>{t('access.filter.level.all')}</span>
        <Segmented
          items={accessLevels}
          value={filters.level}
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
      <div className="ml-auto">
        <Button
          type="button"
          variant="secondary"
          onClick={handleReset}
        >
          {t('access.filter.reset')}
        </Button>
      </div>
    </div>
  );
};

export default AccessFilterBar;
