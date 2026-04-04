import React from 'react';
import { Badge, Button, Segmented } from '@mfe/design-system';
import type { AccessLevel, AccessRole } from '../../../features/access-management/model/access.types';

interface PermissionMatrixProps {
  roles: AccessRole[];
  modules: Map<string, string>;
  onLevelChange: (roleId: string, moduleKey: string, level: AccessLevel) => void;
  onSaveAll: () => void;
  saving?: boolean;
  t: (key: string, params?: Record<string, unknown>) => string;
}

type MatrixChange = { roleId: string; moduleKey: string; level: AccessLevel };

const LEVEL_OPTIONS: AccessLevel[] = ['NONE', 'VIEW', 'EDIT', 'MANAGE'];

const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
  roles,
  modules,
  onLevelChange,
  onSaveAll,
  saving,
  t,
}) => {
  const [changes, setChanges] = React.useState<Map<string, MatrixChange>>(new Map());
  const moduleEntries = React.useMemo(() => Array.from(modules.entries()), [modules]);

  const getLevel = (role: AccessRole, moduleKey: string): AccessLevel => {
    const changeKey = `${role.id}:${moduleKey}`;
    const change = changes.get(changeKey);
    if (change) return change.level;
    const policy = role.policies.find((p) => p.moduleKey === moduleKey);
    return policy?.level ?? 'NONE';
  };

  const handleChange = (roleId: string, moduleKey: string, level: AccessLevel) => {
    const key = `${roleId}:${moduleKey}`;
    setChanges((prev) => {
      const next = new Map(prev);
      next.set(key, { roleId, moduleKey, level });
      return next;
    });
    onLevelChange(roleId, moduleKey, level);
  };

  const handleSaveAll = () => {
    onSaveAll();
    setChanges(new Map());
  };

  const levelItems = React.useMemo(
    () =>
      LEVEL_OPTIONS.map((level) => ({
        value: level,
        label: t(`access.filter.level.${level.toLowerCase()}`),
      })),
    [t],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary">{t('access.matrix.title')}</h3>
        <div className="flex items-center gap-2">
          {changes.size > 0 && (
            <Badge variant="warning" size="sm">
              {t('access.matrix.changed', { count: changes.size })}
            </Badge>
          )}
          <Button
            onClick={handleSaveAll}
            disabled={changes.size === 0}
            loading={saving}
            size="sm"
          >
            {t('access.matrix.saveAll')}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border-subtle">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle bg-surface-muted">
              <th className="sticky left-0 z-10 bg-surface-muted px-4 py-3 text-left text-xs font-semibold uppercase text-text-subtle">
                {t('access.grid.columns.name')}
              </th>
              {moduleEntries.map(([key, label]) => (
                <th
                  key={key}
                  className="px-3 py-3 text-center text-xs font-semibold uppercase text-text-subtle"
                  style={{ minWidth: 200 }}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {roles.map((role) => (
              <tr key={role.id} className="hover:bg-surface-muted/50">
                <td className="sticky left-0 z-10 bg-surface-default px-4 py-3 font-medium text-text-primary">
                  {role.name}
                  {role.isSystemRole && (
                    <Badge variant="default" size="sm" className="ml-2">system</Badge>
                  )}
                </td>
                {moduleEntries.map(([moduleKey]) => (
                  <td key={moduleKey} className="px-2 py-2 text-center">
                    <Segmented
                      items={levelItems}
                      value={getLevel(role, moduleKey)}
                      onValueChange={(v) => handleChange(role.id, moduleKey, v as AccessLevel)}
                      size="sm"
                      fullWidth
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionMatrix;
