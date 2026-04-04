import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge, Button, Checkbox, DetailDrawer, Dialog, Switch } from '@mfe/design-system';
import type { AccessRole } from '../../../features/access-management/model/access.types';
import { getPermissions } from '../../../entities/permissions/api/permissions.api';

interface AccessRoleDrawerProps {
  open: boolean;
  role: AccessRole | null;
  onClose: () => void;
  onPermissionsSave?: (roleId: string, permissionIds: string[]) => Promise<void>;
  savingPermissions?: boolean;
  t: (key: string, params?: Record<string, unknown>) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (value: Date | number, options?: Intl.DateTimeFormatOptions) => string;
}

const levelToneMap: Record<string, 'info' | 'warning' | 'error' | 'default'> = {
  VIEW: 'info',
  EDIT: 'warning',
  MANAGE: 'error',
};

const showToast = (type: 'success' | 'error', text: string) => {
  try {
    window.dispatchEvent(new CustomEvent('app:toast', { detail: { type, text } }));
  } catch {
    const method = type === 'error' ? 'error' : 'log';
    console[method](text);
  }
};

const setsEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  return b.every((id) => setA.has(id));
};

const AccessRoleDrawer: React.FC<AccessRoleDrawerProps> = ({
  open,
  role,
  onClose,
  onPermissionsSave,
  savingPermissions,
  t,
  formatNumber,
  formatDate,
}) => {
  const isOpen = open && Boolean(role);

  const { data: permissionList = [] } = useQuery({
    queryKey: ['permissions'],
    queryFn: getPermissions,
    enabled: isOpen,
    staleTime: 60_000,
  });

  const [selectedPermissionIds, setSelectedPermissionIds] = React.useState<string[]>(
    Array.isArray(role?.permissions) ? role.permissions : [],
  );
  const [initialPermissionIds, setInitialPermissionIds] = React.useState<string[]>([]);
  const [discardDialogOpen, setDiscardDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const perms = Array.isArray(role?.permissions) ? role.permissions : [];
    setSelectedPermissionIds(perms);
    setInitialPermissionIds(perms);
  }, [role]);

  const isDirty = !setsEqual(selectedPermissionIds, initialPermissionIds);

  React.useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const handleClose = () => {
    if (isDirty) {
      setDiscardDialogOpen(true);
    } else {
      onClose();
    }
  };

  const handleDiscardConfirm = () => {
    setDiscardDialogOpen(false);
    setSelectedPermissionIds(initialPermissionIds);
    onClose();
  };

  if (!isOpen || !role) {
    return null;
  }

  const handleSavePermissions = async () => {
    if (!role || !onPermissionsSave) return;
    try {
      await onPermissionsSave(role.id, selectedPermissionIds);
      setInitialPermissionIds(selectedPermissionIds);
      showToast('success', t('access.drawer.permissions.saveSuccess'));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('access.drawer.permissions.saveError');
      showToast('error', message);
    }
  };

  const formattedMemberCount = formatNumber(role.memberCount);
  const formattedLastModified = formatDate(new Date(role.lastModifiedAt), {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const permissionsByModule = React.useMemo(() => {
    const map = new Map<string, typeof permissionList>();
    for (const perm of permissionList) {
      const mod = perm.moduleKey ?? perm.moduleLabel ?? 'other';
      const list = map.get(mod) ?? [];
      list.push(perm);
      map.set(mod, list);
    }
    return map;
  }, [permissionList]);

  return (
    <>
      <DetailDrawer
        open={open}
        onClose={handleClose}
        title={role.name}
        actions={(
          <div className="flex items-center gap-2">
            {isDirty && (
              <Badge variant="warning" size="sm">{t('access.drawer.unsavedChanges')}</Badge>
            )}
            <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
              {t('access.clone.cancelText')}
            </Button>
          </div>
        )}
      >
        <div data-testid="access-role-drawer-content" className="flex flex-col gap-6">
          <p className="text-sm text-text-subtle">{role.description || t('access.drawer.noDescription')}</p>

          <dl className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-surface-muted p-4 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-text-subtle">{t('access.drawer.members')}</dt>
              <dd className="font-semibold text-text-primary">{formattedMemberCount}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-text-subtle">{t('access.drawer.systemRole')}</dt>
              <dd className="font-semibold text-text-primary">
                {role.isSystemRole
                  ? t('access.drawer.systemRole.yes')
                  : t('access.drawer.systemRole.no')}
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-text-subtle">{t('access.drawer.lastModified')}</dt>
              <dd className="font-semibold text-text-primary">{`${role.lastModifiedBy} · ${formattedLastModified}`}</dd>
            </div>
          </dl>

          <section className="flex flex-col gap-3">
            <h3 className="text-base font-semibold text-text-primary">{t('access.drawer.permissionsTitle')}</h3>
            {role.policies.length === 0 && permissionList.length === 0 ? (
              <p className="text-sm text-text-subtle">{t('access.drawer.permissionsEmpty')}</p>
            ) : (
              <div className="flex flex-col gap-3">
                {role.policies.map((policy) => {
                  const modulePerms = permissionsByModule.get(policy.moduleKey) ?? [];
                  return (
                    <div key={`${role.id}-${policy.moduleKey}`} className="rounded-2xl border border-border-subtle p-4 shadow-xs">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-text-primary">
                            {policy.moduleLabel ?? policy.moduleKey}
                          </p>
                          <p className="text-xs text-text-subtle">
                            {t('access.drawer.permissionUpdated', {
                              user: policy.updatedBy,
                              timestamp: formatDate(new Date(policy.lastUpdatedAt), {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              }),
                            })}
                          </p>
                        </div>
                        <Badge variant={levelToneMap[policy.level] ?? 'default'}>
                          {t(`access.filter.level.${policy.level.toLowerCase()}`)}
                        </Badge>
                      </div>
                      {modulePerms.length > 0 && (
                        <div className="mt-3 flex flex-col gap-2 border-t border-border-subtle pt-3">
                          {modulePerms.map((perm) => {
                            const id = String(perm.id ?? perm.code ?? '');
                            if (!id) return null;
                            const code = perm.code ?? id;
                            const isChecked = selectedPermissionIds.includes(id);
                            return (
                              <Switch
                                key={id}
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  setSelectedPermissionIds((prev) =>
                                    checked ? (prev.includes(id) ? prev : [...prev, id]) : prev.filter((pid) => pid !== id),
                                  );
                                }}
                                label={code}
                                description={perm.moduleLabel}
                                size="sm"
                                data-testid={`access-role-permission-${id}`}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleSavePermissions}
              loading={savingPermissions}
              loadingLabel={t('common.loading')}
              disabled={!isDirty}
              data-testid="access-role-drawer-save"
            >
              {t('common.save')}
            </Button>
          </div>

          <hr className="border-border-subtle" />
          <p className="text-xs text-text-subtle">{t('access.drawer.auditHint')}</p>
        </div>
      </DetailDrawer>

      <Dialog
        open={discardDialogOpen}
        onClose={() => setDiscardDialogOpen(false)}
        title={t('access.drawer.unsavedChanges')}
        size="sm"
        footer={(
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDiscardDialogOpen(false)}>
              {t('access.clone.cancelText')}
            </Button>
            <Button variant="danger" onClick={handleDiscardConfirm}>
              {t('access.drawer.discardConfirm')}
            </Button>
          </div>
        )}
      >
        <p className="text-sm text-text-secondary">{t('access.drawer.discardMessage')}</p>
      </Dialog>
    </>
  );
};

export default AccessRoleDrawer;
