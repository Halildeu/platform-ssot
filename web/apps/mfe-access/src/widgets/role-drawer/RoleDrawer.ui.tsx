import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge, Button, DetailDrawer, Select, Switch, TextInput } from '@mfe/design-system';
import type { AccessRole, AccessLevel } from '../../features/access-management/model/access.types';
import { getPermissions } from '../../entities/permissions/api/permissions.api';

interface RoleDrawerProps {
  open: boolean;
  mode: 'view' | 'create';
  role: AccessRole | null;
  onClose: () => void;
  onSavePermissions?: (roleId: string, permissionIds: string[]) => Promise<void>;
  onCreateRole?: (values: { name: string; description?: string }) => Promise<void>;
  savingPermissions?: boolean;
  creatingRole?: boolean;
  t: (key: string, params?: Record<string, unknown>) => string;
  formatNumber: (value: number) => string;
  formatDate: (value: Date | number, options?: Intl.DateTimeFormatOptions) => string;
}

const LEVEL_OPTIONS: AccessLevel[] = ['NONE', 'VIEW', 'EDIT', 'MANAGE'];

const levelVariant: Record<string, 'info' | 'warning' | 'error' | 'muted'> = {
  VIEW: 'info',
  EDIT: 'warning',
  MANAGE: 'error',
  NONE: 'muted',
};

const setsEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  const s = new Set(a);
  return b.every((id) => s.has(id));
};

const RoleDrawer: React.FC<RoleDrawerProps> = ({
  open,
  mode,
  role,
  onClose,
  onSavePermissions,
  onCreateRole,
  savingPermissions,
  creatingRole,
  t,
  formatNumber,
  formatDate,
}) => {
  // Create mode state
  const [createName, setCreateName] = React.useState('');
  const [createDesc, setCreateDesc] = React.useState('');

  // View mode state
  const { data: permissionList = [] } = useQuery({
    queryKey: ['permissions'],
    queryFn: getPermissions,
    enabled: open && mode === 'view',
    staleTime: 60_000,
  });

  const [selectedPermIds, setSelectedPermIds] = React.useState<string[]>([]);
  const [initialPermIds, setInitialPermIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (mode === 'create') {
      setCreateName('');
      setCreateDesc('');
    }
  }, [mode, open]);

  React.useEffect(() => {
    const perms = Array.isArray(role?.permissions) ? role.permissions : [];
    setSelectedPermIds(perms);
    setInitialPermIds(perms);
  }, [role]);

  const isDirty = mode === 'view' && !setsEqual(selectedPermIds, initialPermIds);

  const permsByModule = React.useMemo(() => {
    const map = new Map<string, typeof permissionList>();
    for (const perm of permissionList) {
      const mod = perm.moduleKey ?? 'other';
      const list = map.get(mod) ?? [];
      list.push(perm);
      map.set(mod, list);
    }
    return map;
  }, [permissionList]);

  const handleSave = async () => {
    if (!role || !onSavePermissions) return;
    await onSavePermissions(role.id, selectedPermIds);
    setInitialPermIds(selectedPermIds);
  };

  const handleCreate = async () => {
    if (!onCreateRole || !createName.trim()) return;
    await onCreateRole({
      name: createName.trim(),
      description: createDesc.trim() || undefined,
    });
  };

  if (mode === 'create') {
    return (
      <DetailDrawer
        open={open}
        onClose={onClose}
        title={t('access.create.title')}
        size="lg"
      >
        <div className="flex flex-col gap-5 p-1">
          <TextInput
            label={t('access.create.nameLabel')}
            placeholder={t('access.create.namePlaceholder')}
            value={createName}
            onValueChange={setCreateName}
            autoFocus
            fullWidth
          />
          <TextInput
            label={t('access.create.descriptionLabel')}
            placeholder={t('access.create.descriptionPlaceholder')}
            value={createDesc}
            onValueChange={setCreateDesc}
            fullWidth
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={onClose}>{t('access.clone.cancelText')}</Button>
            <Button
              onClick={handleCreate}
              loading={creatingRole}
              disabled={createName.trim().length < 3}
            >
              {t('access.create.submitText')}
            </Button>
          </div>
        </div>
      </DetailDrawer>
    );
  }

  if (!role) return null;

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      title={role.name}
      subtitle={role.description || t('access.drawer.noDescription')}
      tags={
        <div className="flex gap-2">
          {role.isSystemRole && <Badge variant="default" size="sm">{t('access.drawer.systemRole')}</Badge>}
          <Badge variant="info" size="sm">{formatNumber(role.memberCount)} {t('access.drawer.members')}</Badge>
          {isDirty && <Badge variant="warning" size="sm">{t('access.drawer.unsavedChanges')}</Badge>}
        </div>
      }
      size="lg"
    >
      <div className="flex flex-col gap-5">
        {/* Meta */}
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-text-subtle">{t('access.drawer.lastModified')}</dt>
            <dd className="font-medium text-text-primary">
              {role.lastModifiedBy} · {formatDate(new Date(role.lastModifiedAt), { dateStyle: 'medium', timeStyle: 'short' })}
            </dd>
          </div>
        </dl>

        <hr className="border-border-subtle" />

        {/* Module permissions */}
        <h3 className="text-sm font-semibold uppercase tracking-wide text-text-subtle">
          {t('access.drawer.permissionsTitle')}
        </h3>

        <div className="flex flex-col gap-3">
          {role.policies.map((policy) => {
            const modulePerms = permsByModule.get(policy.moduleKey) ?? [];
            return (
              <div
                key={policy.moduleKey}
                className="rounded-xl border border-border-subtle bg-surface-muted/50 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-primary">
                    {policy.moduleLabel ?? policy.moduleKey}
                  </span>
                  <Badge variant={levelVariant[policy.level] ?? 'muted'} size="sm">
                    {t(`access.filter.level.${policy.level.toLowerCase()}`)}
                  </Badge>
                </div>

                {modulePerms.length > 0 && (
                  <div className="mt-3 flex flex-col gap-2">
                    {modulePerms.map((perm) => {
                      const id = String(perm.id ?? perm.code ?? '');
                      if (!id) return null;
                      return (
                        <Switch
                          key={id}
                          checked={selectedPermIds.includes(id)}
                          onCheckedChange={(checked) => {
                            setSelectedPermIds((prev) =>
                              checked
                                ? prev.includes(id) ? prev : [...prev, id]
                                : prev.filter((p) => p !== id),
                            );
                          }}
                          label={perm.code ?? id}
                          description={perm.moduleLabel}
                          size="sm"
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {role.policies.length === 0 && (
            <p className="py-4 text-center text-sm text-text-subtle">
              {t('access.drawer.permissionsEmpty')}
            </p>
          )}
        </div>

        {/* Save */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>{t('access.clone.cancelText')}</Button>
          <Button
            onClick={handleSave}
            loading={savingPermissions}
            disabled={!isDirty}
          >
            {t('common.save')}
          </Button>
        </div>
      </div>
    </DetailDrawer>
  );
};

export default RoleDrawer;
