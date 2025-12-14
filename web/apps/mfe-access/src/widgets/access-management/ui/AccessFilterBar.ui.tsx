import React from 'react';
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
      { label: t('access.filter.level.all'), value: 'ALL' as AccessFilters['level'] },
      { label: t('access.filter.level.none'), value: 'NONE' as AccessFilters['level'] },
      { label: t('access.filter.level.view'), value: 'VIEW' as AccessFilters['level'] },
      { label: t('access.filter.level.edit'), value: 'EDIT' as AccessFilters['level'] },
      { label: t('access.filter.level.manage'), value: 'MANAGE' as AccessFilters['level'] },
    ],
    [t]
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
      className="flex w-full flex-wrap items-end gap-3 rounded-2xl border border-border-subtle bg-surface-default bg-opacity-70 p-4 shadow-sm"
    >
      <label className="flex flex-1 flex-col text-xs font-semibold uppercase tracking-wide text-text-secondary">
        <span>{t('access.filter.searchPlaceholder')}</span>
        <input
          type="text"
          className="mt-1 w-full rounded-xl border border-border-subtle px-3 py-2 text-sm text-text-primary placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-selection-outline"
          placeholder={t('access.filter.searchPlaceholder')}
          value={localFilters.search}
          onChange={(event) => handleFieldChange('search', event.target.value)}
        />
      </label>
      <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-text-secondary">
        <span>{t('access.filter.moduleAll')}</span>
        <select
          className="mt-1 min-w-[200px] rounded-xl border border-border-subtle bg-surface-default px-3 py-2 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-selection-outline"
          value={localFilters.moduleKey}
          onChange={(event) => {
            handleFieldChange('moduleKey', event.target.value);
            onChange({ ...localFilters, moduleKey: event.target.value });
          }}
        >
          {moduleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-text-secondary">
        <span>{t('access.filter.level.all')}</span>
        <select
          className="mt-1 min-w-[180px] rounded-xl border border-border-subtle bg-surface-default px-3 py-2 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-selection-outline"
          value={localFilters.level}
          onChange={(event) => handleLevelChange(event.target.value as AccessLevel | 'ALL')}
        >
          {accessLevels.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <div className="ml-auto flex flex-wrap gap-2">
        <button
          type="submit"
          className="rounded-xl bg-action-primary px-4 py-2 text-sm font-semibold text-action-primary-text shadow hover:opacity-90"
        >
          {t('access.filter.apply')}
        </button>
        <button
          type="button"
          className="rounded-xl border border-border-subtle px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted"
          onClick={handleReset}
        >
          {t('access.filter.reset')}
        </button>
      </div>
    </form>
  );
};

export default AccessFilterBar;
