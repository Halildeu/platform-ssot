import React from 'react';
import { Badge } from '@mfe/design-system';
import {
  permissionRegistry,
  permissionRegistryVersion,
  permissionRegistryGeneratedAt,
  type PermissionRegistryEntry,
} from '../../data/permissionRegistry.generated';

type PermissionRegistryPanelProps = {
  t: (key: string, values?: Record<string, unknown>) => string;
  formatDate: (value: Date | number) => string;
};

const toValidDate = (value: string | number | Date): Date | null => {
  const parsed =
    value instanceof Date
      ? value
      : typeof value === 'number'
        ? new Date(value)
        : new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const PermissionRegistryPanel: React.FC<PermissionRegistryPanelProps> = ({ t, formatDate }) => {
  const { activeCount, deprecatedCount } = React.useMemo(() => {
    let active = 0;
    let deprecated = 0;
    for (const entry of permissionRegistry) {
      if (entry.status === 'active') {
        active += 1;
      } else {
        deprecated += 1;
      }
    }
    return { activeCount: active, deprecatedCount: deprecated };
  }, []);

  const generatedDateLabel = React.useMemo(() => {
    const parsed = permissionRegistryGeneratedAt
      ? toValidDate(permissionRegistryGeneratedAt)
      : null;
    const label = parsed ? formatDate(parsed) : '—';
    return t('access.registry.legend', { generatedAt: label });
  }, [formatDate, t]);

  const renderSunset = (entry: PermissionRegistryEntry) => {
    if (!entry.sunsetAt) {
      return t('access.registry.sunset.tbd');
    }
    const parsed = toValidDate(entry.sunsetAt);
    if (!parsed) {
      return t('access.registry.sunset.tbd');
    }
    return formatDate(parsed);
  };

  return (
    <section
      data-testid="access-permission-registry"
      className="rounded-3xl border border-border-subtle bg-surface-default p-6 shadow-xs"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">{t('access.registry.title')}</h2>
          <p className="text-sm text-text-secondary">
            {t('access.registry.subtitle', { version: permissionRegistryVersion })}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="rounded-2xl border border-border-subtle bg-surface-muted px-4 py-2 text-center">
            <div className="text-[0.7rem] uppercase text-text-subtle">
              {t('access.registry.summary.active')}
            </div>
            <div className="text-2xl font-semibold text-text-primary">{activeCount}</div>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface-muted px-4 py-2 text-center">
            <div className="text-[0.7rem] uppercase text-text-subtle">
              {t('access.registry.summary.deprecated')}
            </div>
            <div className="text-2xl font-semibold text-text-primary">{deprecatedCount}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="text-xs uppercase text-text-subtle">
              <th className="py-2 pr-4">{t('access.registry.columns.key')}</th>
              <th className="py-2 pr-4">{t('access.registry.columns.module')}</th>
              <th className="py-2 pr-4">{t('access.registry.columns.owner')}</th>
              <th className="py-2 pr-4">{t('access.registry.columns.status')}</th>
              <th className="py-2 pr-4">{t('access.registry.columns.sunset')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {permissionRegistry.map((entry) => (
              <tr key={entry.key} className="align-top">
                <td className="py-3 pr-4">
                  <div className="font-mono text-sm text-text-primary">{entry.key}</div>
                  <p className="text-xs text-text-secondary">{entry.description}</p>
                </td>
                <td className="py-3 pr-4 text-text-primary">{entry.module}</td>
                <td className="py-3 pr-4 text-text-primary">{entry.owner}</td>
                <td className="py-3 pr-4">
                  <Badge variant={entry.status === 'active' ? 'success' : 'warning'}>
                    {entry.status === 'active'
                      ? t('access.registry.status.active')
                      : t('access.registry.status.deprecated')}
                  </Badge>
                </td>
                <td className="py-3 pr-4 text-text-primary">{renderSunset(entry)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-text-subtle">{generatedDateLabel}</p>
    </section>
  );
};

export default PermissionRegistryPanel;
