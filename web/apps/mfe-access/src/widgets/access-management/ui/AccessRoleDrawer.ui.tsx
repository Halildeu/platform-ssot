import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DetailDrawer, Badge } from 'mfe-ui-kit';
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

const levelToneMap: Record<string, 'info' | 'warning' | 'danger' | 'default'> = {
  VIEW: 'info',
  EDIT: 'warning',
  MANAGE: 'danger',
};

const showToast = (type: 'success' | 'error', text: string) => {
  try {
    window.dispatchEvent(new CustomEvent('app:toast', { detail: { type, text } }));
  } catch {
    const method = type === 'error' ? 'error' : 'log';
    console[method](text);
  }
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
  const { data: permissionList = [] } = useQuery({
    queryKey: ['permissions'],
    queryFn: getPermissions,
    enabled: open && Boolean(role),
    staleTime: 60_000,
  });

  const rolePermissionIds = React.useMemo(
    () => (Array.isArray(role?.permissions) ? role.permissions : []),
    [role],
  );
  const [selectedPermissionIds, setSelectedPermissionIds] = React.useState<string[]>(
    rolePermissionIds,
  );

  React.useEffect(() => {
    setSelectedPermissionIds(rolePermissionIds);
  }, [rolePermissionIds]);

  if (!open || !role) {
    return null;
  }

  const togglePermission = (id: string) => {
    setSelectedPermissionIds((prev) => (prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]));
  };

  const handleSavePermissions = async () => {
    if (!role || !onPermissionsSave) {
      return;
    }
    try {
      await onPermissionsSave(role.id, selectedPermissionIds);
      showToast('success', 'Permissions updated');
    } catch (error) {
      const message = error instanceof Error ? error.message : t('auth.login.failed');
      showToast('error', message);
    }
  };

  const formattedMemberCount = formatNumber(role.memberCount);
  const formattedLastModified = formatDate(new Date(role.lastModifiedAt), {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      width={420}
      title={role.name}
      extra={(
        <button type="button" className="text-sm font-medium text-text-secondary hover:text-text-primary" onClick={onClose}>
          {t('access.clone.cancelText')}
        </button>
      )}
    >
      <div data-testid="access-role-drawer-content" className="flex flex-col gap-6">
        <p className="text-sm text-text-subtle">{role.description || t('access.drawer.noDescription')}</p>

        <dl className="space-y-3 rounded-2xl border border-border-subtle bg-surface-muted p-4 text-sm">
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
          {role.policies.length === 0 ? (
            <p className="text-sm text-text-subtle">{t('access.drawer.permissionsEmpty')}</p>
          ) : (
            <div className="flex flex-col gap-3">
              {role.policies.map((policy) => (
                <div key={`${role.id}-${policy.moduleKey}`} className="rounded-2xl border border-border-subtle p-4 shadow-sm">
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
                    <Badge tone={levelToneMap[policy.level] ?? 'default'}>
                      {t(`access.filter.level.${policy.level.toLowerCase()}`)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-base font-semibold text-text-primary">{t('access.drawer.permissionsTitle')} (IDs)</h3>
          <div className="flex flex-col gap-2">
            {permissionList.length === 0 ? (
              <p className="text-sm text-text-subtle">{t('access.drawer.permissionsEmpty')}</p>
            ) : (
              permissionList.map((perm) => {
                const id = String(perm.id ?? perm.code ?? '');
                if (!id) return null;
                const code = perm.code ?? id;
                return (
                  <label key={id} className="flex items-center gap-3 rounded-xl border border-border-subtle px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedPermissionIds.includes(id)}
                      onChange={() => togglePermission(id)}
                      className="h-4 w-4 accent-action-primary"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-text-primary">{code}</span>
                      {perm.moduleLabel ? (
                        <span className="text-xs text-text-subtle">{perm.moduleLabel}</span>
                      ) : null}
                    </div>
                  </label>
                );
              })
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              data-testid="access-role-drawer-save"
              className="rounded-xl bg-action-primary px-4 py-2 text-sm font-semibold text-action-primary-text shadow hover:opacity-90 disabled:opacity-50"
              onClick={handleSavePermissions}
              disabled={savingPermissions}
            >
              {savingPermissions ? t('common.loading') : t('common.save')}
            </button>
          </div>
        </section>

        <hr className="border-border-subtle" />
        <p className="text-xs text-text-subtle">{t('access.drawer.auditHint')}</p>
      </div>
    </DetailDrawer>
  );
};

export default AccessRoleDrawer;
