import React from 'react';
import { UsersFilters } from '../../../features/user-management/model/user-management.types';
import { useUsersI18n } from '../../../i18n/useUsersI18n';

interface UsersFilterPanelProps {
  filters: UsersFilters;
  onChange: (next: UsersFilters) => void;
  onSubmit: () => void;
  loading?: boolean;
}

const UsersFilterPanel: React.FC<UsersFilterPanelProps> = ({ filters, onChange, onSubmit, loading }) => {
  const { t } = useUsersI18n();
  const [localFilters, setLocalFilters] = React.useState<UsersFilters>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateField = <K extends keyof UsersFilters>(key: K, value: UsersFilters[K]) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    onChange(localFilters);
    setTimeout(() => onSubmit(), 0);
  };

  const handleReset = () => {
    const defaults: UsersFilters = {
      search: '',
      status: 'ALL',
      role: 'ALL',
      moduleKey: '',
      moduleLevel: 'ALL',
    };
    setLocalFilters(defaults);
    onChange(defaults);
    setTimeout(() => onSubmit(), 0);
  };

  const statusOptions = React.useMemo(
    () => [
      { label: t('users.filters.status.all'), value: 'ALL' },
      { label: t('users.filters.status.active'), value: 'ACTIVE' },
      { label: t('users.filters.status.inactive'), value: 'INACTIVE' },
      { label: t('users.filters.status.invited'), value: 'INVITED' },
      { label: t('users.filters.status.suspended'), value: 'SUSPENDED' },
    ],
    [t],
  );

  const roleOptions = React.useMemo(
    () => [
      { label: t('users.filters.role.all'), value: 'ALL' },
      { label: t('users.filters.role.user'), value: 'USER' },
      { label: t('users.filters.role.admin'), value: 'ADMIN' },
    ],
    [t],
  );

  const moduleLevelOptions = React.useMemo(
    () => [
      { label: t('users.filters.moduleLevel.all'), value: 'ALL' },
      { label: t('users.filters.moduleLevel.view'), value: 'VIEW' },
      { label: t('users.filters.moduleLevel.edit'), value: 'EDIT' },
      { label: t('users.filters.moduleLevel.manage'), value: 'MANAGE' },
    ],
    [t],
  );

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-wrap items-end gap-3 rounded-2xl border border-border-subtle bg-surface-default p-4">
      <label className="flex flex-col text-xs font-semibold text-text-secondary">
        <span>{t('users.filters.search.label')}</span>
        <div className="flex gap-2">
          <input
            type="text"
            value={localFilters.search}
            onChange={(event) => updateField('search', event.target.value)}
            placeholder={t('users.filters.search.placeholder')}
            className="w-56 rounded-lg border border-border-subtle px-3 py-2 text-sm text-text-primary placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-selection-outline"
          />
          <button
            type="submit"
            className="rounded-lg bg-action-primary px-4 py-2 text-sm font-semibold text-action-primary-text shadow hover:opacity-90"
            disabled={loading}
          >
            {t('users.filters.search.button')}
          </button>
        </div>
      </label>
      <label className="flex flex-col text-xs font-semibold text-text-secondary">
        <span>{t('users.filters.status.label')}</span>
        <select
          className="min-w-[160px] rounded-lg border border-border-subtle bg-surface-default px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-selection-outline"
          value={localFilters.status}
          onChange={(event) => updateField('status', event.target.value as UsersFilters['status'])}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col text-xs font-semibold text-text-secondary">
        <span>{t('users.filters.role.label')}</span>
        <select
          className="min-w-[160px] rounded-lg border border-border-subtle bg-surface-default px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-selection-outline"
          value={localFilters.role}
          onChange={(event) => updateField('role', event.target.value as UsersFilters['role'])}
        >
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col text-xs font-semibold text-text-secondary">
        <span>{t('users.filters.moduleKey.label')}</span>
        <input
          type="text"
          className="min-w-[180px] rounded-lg border border-border-subtle px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-selection-outline"
          value={localFilters.moduleKey}
          onChange={(event) => updateField('moduleKey', event.target.value)}
          placeholder={t('users.filters.moduleKey.placeholder')}
        />
      </label>
      <label className="flex flex-col text-xs font-semibold text-text-secondary">
        <span>{t('users.filters.moduleLevel.label')}</span>
        <select
          className="min-w-[160px] rounded-lg border border-border-subtle bg-surface-default px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-selection-outline"
          value={localFilters.moduleLevel}
          onChange={(event) => updateField('moduleLevel', event.target.value as UsersFilters['moduleLevel'])}
        >
          {moduleLevelOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <div className="ml-auto flex flex-wrap gap-2">
        <button
          type="submit"
          className="rounded-lg bg-action-primary px-4 py-2 text-sm font-semibold text-action-primary-text shadow hover:opacity-90 disabled:opacity-50"
          disabled={loading}
        >
          {t('users.filters.apply')}
        </button>
        <button
          type="button"
          className="rounded-lg border border-border-subtle px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted"
          onClick={handleReset}
        >
          {t('users.filters.reset')}
        </button>
      </div>
    </form>
  );
};

export default UsersFilterPanel;
