import React, { useEffect, useMemo, useState } from 'react';
import { UserDetail, UserModulePermission, UserModuleAccessLevel } from '@mfe/shared-types';
import { useUserMutations } from '../../../features/user-management/model/use-users-query.model';
import { PERMISSIONS } from '../../../features/user-management/lib/permissions.constants';
import { useAuthorization } from '../../../features/user-management/model/use-authorization.model';
import { DetailDrawer } from '@mfe/design-system';
import { useUsersI18n } from '../../../i18n/useUsersI18n';
import { pushToast } from '../../../shared/notifications';

const badgeBaseClass =
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold leading-tight';
const badgeToneClass: Record<string, string> = {
  default: 'border-border-subtle bg-surface-muted text-text-secondary',
  blue: 'border-state-info-border bg-state-info text-state-info-text',
  gold: 'border-state-warning-border bg-state-warning-bg text-state-warning-text',
  red: 'border-state-danger-border bg-state-danger-bg text-state-danger-text',
  success: 'border-state-success-border bg-state-success-bg text-state-success-text',
  warning: 'border-state-warning-border bg-state-warning-bg text-state-warning-text',
  error: 'border-state-danger-border bg-state-danger-bg text-state-danger-text',
};

const getBadgeClass = (tone: string) => `${badgeBaseClass} ${badgeToneClass[tone] ?? badgeToneClass.default}`;

interface UserDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  user: UserDetail | null;
}

const roleOptions = [
  { labelKey: 'users.filters.role.user', value: 'USER' },
  { labelKey: 'users.filters.role.admin', value: 'ADMIN' },
];

const MODULE_LEVEL_LABEL_KEYS: Record<UserModuleAccessLevel, string> = {
  NONE: 'users.filters.moduleLevel.none',
  VIEW: 'users.filters.moduleLevel.view',
  EDIT: 'users.filters.moduleLevel.edit',
  MANAGE: 'users.filters.moduleLevel.manage',
};

const MODULE_LEVEL_DESCRIPTION_KEYS: Record<UserModuleAccessLevel, string> = {
  NONE: 'users.detail.moduleLevelDescription.none',
  VIEW: 'users.detail.moduleLevelDescription.view',
  EDIT: 'users.detail.moduleLevelDescription.edit',
  MANAGE: 'users.detail.moduleLevelDescription.manage',
};

const MODULE_LEVEL_COLORS: Record<UserModuleAccessLevel, string> = {
  NONE: 'default',
  VIEW: 'blue',
  EDIT: 'gold',
  MANAGE: 'red',
};

const MODULE_LEVEL_OPTIONS_MAP: Record<string, UserModuleAccessLevel[]> = {
  USER_MANAGEMENT: ['NONE', 'VIEW', 'EDIT', 'MANAGE'],
  PURCHASE: ['NONE', 'MANAGE'],
  WAREHOUSE: ['NONE', 'MANAGE'],
};

const getModuleSelectOptions = (moduleKey: string) => {
  const levels = MODULE_LEVEL_OPTIONS_MAP[moduleKey] ?? ['NONE', 'VIEW', 'MANAGE'];
  return levels.map((level) => ({
    labelKey: MODULE_LEVEL_LABEL_KEYS[level],
    value: level,
  }));
};

const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({ open, onClose, user }) => {
  const { t, locale } = useUsersI18n();
  const storedScope = React.useMemo(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem('halo.scope') : null;
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (typeof parsed !== 'object' || parsed === null) {
        return {};
      }
      return parsed as { companyId?: string | number; projectId?: string | number; warehouseId?: string | number };
    } catch (error) {
      console.warn('Scope bilgisi okunamadı', error);
      return {};
    }
  }, []);

  const { updateRoleMutation, updateModuleMutation, revokeModuleMutation, toggleStatusMutation, updateSessionTimeoutMutation } = useUserMutations({
    companyId: storedScope.companyId,
    projectId: storedScope.projectId,
    warehouseId: storedScope.warehouseId,
  });
  const { hasPermission, userId: currentUserId, role: currentRole } = useAuthorization();

  const canEditRole = hasPermission('EDIT_USERS') || hasPermission(PERMISSIONS.USER_MANAGEMENT_EDIT);
  const canEditSessionTimeout = canEditRole;
  const canToggleStatus = hasPermission(PERMISSIONS.USER_MANAGEMENT_TOGGLE_STATUS);
  const canEditUserModule = hasPermission('EDIT_USERS') || hasPermission(PERMISSIONS.USER_MANAGEMENT_EDIT);

  const statusToneMap: Record<string, string> = {
    ACTIVE: 'success',
    INACTIVE: 'default',
    INVITED: 'warning',
    SUSPENDED: 'error',
  };

  const modulePermissions = user?.modulePermissions ?? [];
  const [updatingModuleKey, setUpdatingModuleKey] = useState<string | null>(null);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState<number>(user?.sessionTimeoutMinutes ?? 15);

  useEffect(() => {
    setSessionTimeoutMinutes(user?.sessionTimeoutMinutes ?? 15);
  }, [user?.sessionTimeoutMinutes]);

  const handleSessionTimeoutSave = async () => {
    if (!user) {
      return;
    }
    const nextValue = Number(sessionTimeoutMinutes);
    if (!Number.isFinite(nextValue) || nextValue < 1) {
      pushToast('warning', t('users.detail.sessionTimeout.minWarning'));
      return;
    }
    if (user.sessionTimeoutMinutes === nextValue) {
      pushToast('info', t('users.detail.sessionTimeout.noChange'));
      return;
    }
    try {
      await updateSessionTimeoutMutation.mutateAsync({
        userId: user.id,
        sessionTimeoutMinutes: Math.round(nextValue),
      });
      setSessionTimeoutMinutes(Math.round(nextValue));
      pushToast('success', t('users.detail.sessionTimeout.updated'));
    } catch {
      pushToast('error', t('users.detail.sessionTimeout.updateFailed'));
    }
  };

  const isAdmin = currentRole?.toUpperCase() === 'ADMIN';

  const getTargetCompanyId = (permission: UserModulePermission) => {
    if (permission.companyId !== undefined && permission.companyId !== null) {
      return String(permission.companyId);
    }
    return undefined;
  };

  const canEditModulePermission = (permission: UserModulePermission) => {
    if (permission.moduleKey === 'USER_MANAGEMENT') {
      return canEditUserModule && isAdmin;
    }
    return canEditUserModule;
  };

  const formattedLastLogin = useMemo(() => {
    if (!user?.lastLoginAt) {
      return t('shell.header.neverLoggedIn');
    }
    try {
      const date = new Date(user.lastLoginAt);
      let localeCode: string | undefined;
      switch (locale) {
        case 'tr':
          localeCode = 'tr-TR';
          break;
        case 'en':
          localeCode = 'en-US';
          break;
        case 'de':
          localeCode = 'de-DE';
          break;
        case 'es':
          localeCode = 'es-ES';
          break;
        default:
          localeCode = undefined;
      }
      return localeCode ? date.toLocaleString(localeCode) : date.toLocaleString();
    } catch {
      return String(user?.lastLoginAt ?? '');
    }
  }, [user?.lastLoginAt, locale, t]);

  if (!user) {
    return null;
  }

  const handleRoleChange = async (role: string) => {
    try {
      await updateRoleMutation.mutateAsync({ userId: user.id, role });
      pushToast('success', t('users.detail.roleUpdated'));
    } catch (error) {
      pushToast('error', (error as Error).message);
    }
  };

  const handleModuleLevelChange = async (permission: UserModulePermission, nextLevel: UserModuleAccessLevel) => {
    const performerId = currentUserId ?? '0';
    const companyIdValue = getTargetCompanyId(permission);
    setUpdatingModuleKey(permission.moduleKey);
    try {
      if (nextLevel === 'NONE') {
        if (permission.assignmentId) {
          await revokeModuleMutation.mutateAsync({ assignmentId: permission.assignmentId, performedBy: performerId });
          const moduleName = permission.moduleLabel ?? permission.moduleKey;
          pushToast(
            'success',
            t('users.detail.modulePermission.removed').replace('{module}', moduleName),
          );
        } else {
          pushToast('info', t('users.detail.modulePermission.noActive'));
        }
      } else {
        await updateModuleMutation.mutateAsync({
          userId: user.id,
          moduleKey: permission.moduleKey,
          level: nextLevel,
          performedBy: performerId,
          companyId: companyIdValue,
          allowGlobalScope: permission.moduleKey === 'USER_MANAGEMENT' && isAdmin,
        });
        const moduleName = permission.moduleLabel ?? permission.moduleKey;
        pushToast(
          'success',
          t('users.detail.modulePermission.updated').replace('{module}', moduleName),
        );
      }
    } catch (error) {
      pushToast('error', (error as Error).message);
    } finally {
      setUpdatingModuleKey(null);
    }
  };

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      width={480}
      title={`${t('users.detail.title')} · ${user.fullName}`}
      extra={(
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-semibold text-text-secondary hover:text-text-primary"
        >
          {t('shell.launcher.close')}
        </button>
      )}
    >
      <div className="flex flex-col gap-6">
        <section>
          <h3 className="text-base font-semibold text-text-primary">
            {t('users.detail.section.profile')}
          </h3>
          <dl className="flex flex-col mt-3 gap-3 rounded-2xl border border-border-subtle bg-surface-muted p-4 text-sm">
            <div className="flex items-start justify-between gap-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-subtle">
                {t('users.grid.columns.fullName')}
              </dt>
              <dd className="text-text-primary">{user.fullName}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-subtle">
                {t('users.grid.columns.email')}
              </dt>
              <dd className="text-text-primary">{user.email}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-subtle">
                {t('users.grid.columns.role')}
              </dt>
              <dd>
                {canEditRole ? (
                  <select
                    className="min-w-[160px] rounded-xl border border-border-subtle bg-surface-default px-3 py-2 text-sm font-medium text-text-primary focus:outline-hidden focus:ring-2 focus:ring-selection-outline"
                    value={user.role}
                    onChange={(event) => handleRoleChange(event.target.value)}
                  >
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {t(option.labelKey)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={getBadgeClass('blue')}>{user.role}</span>
                )}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-subtle">
                {t('users.grid.columns.sessionTimeoutMinutes')}
              </dt>
              <dd>
                {canEditSessionTimeout ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      max={1440}
                      value={sessionTimeoutMinutes}
                      onChange={(event) => setSessionTimeoutMinutes(Number(event.target.value))}
                      className="w-24 rounded-xl border border-border-subtle px-3 py-2 text-sm text-text-primary focus:outline-hidden focus:ring-2 focus:ring-selection-outline"
                    />
                    <button
                      type="button"
                      onClick={handleSessionTimeoutSave}
                      disabled={
                        updateSessionTimeoutMutation.isPending
                        || Math.round(sessionTimeoutMinutes ?? 0) === Math.round(user.sessionTimeoutMinutes ?? 15)
                      }
                      className="rounded-xl bg-action-primary px-4 py-2 text-sm font-semibold text-action-primary-text shadow-sm hover:opacity-90 disabled:opacity-50"
                    >
                      {updateSessionTimeoutMutation.isPending
                        ? t('users.detail.sessionTimeout.saving')
                        : t('users.detail.sessionTimeout.save')}
                    </button>
                  </div>
                ) : (
                  <span className="text-text-secondary">
                    {user.sessionTimeoutMinutes ?? 15} {t('users.detail.sessionTimeout.unit')}
                  </span>
                )}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-subtle">
                {t('users.grid.columns.status')}
              </dt>
              <dd className="flex items-center gap-3">
                <span className={getBadgeClass(statusToneMap[user.status] ?? 'default')}>{user.status}</span>
                {canToggleStatus && (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={user.status === 'ACTIVE'}
                    disabled={toggleStatusMutation.isPending}
                    onClick={async () => {
                      try {
                        const nextEnabled = user.status !== 'ACTIVE';
                        const result = await toggleStatusMutation.mutateAsync({
                          userId: user.id,
                          enabled: nextEnabled,
                        });
                        const auditId = result?.auditId;
                        pushToast('success', t('users.actions.status.success'), auditId
                          ? {
                            description: t('users.notifications.activation.description', { auditId }),
                            meta: {
                              auditId,
                              route: '/audit/events',
                              action: 'users.toggle_activation',
                              userId: user.id,
                              targetStatus: nextEnabled ? 'ACTIVE' : 'INACTIVE',
                            },
                            openInCenter: true,
                          }
                          : undefined);
                      } catch (error) {
                        pushToast('error', (error as Error).message);
                      }
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      user.status === 'ACTIVE' ? 'bg-action-primary' : 'bg-border-subtle'
                    } ${toggleStatusMutation.isPending ? 'opacity-60' : ''}`}
                  >
                    <span
                      className="inline-block h-5 w-5 transform rounded-full bg-surface-default transition"
                      style={{ transform: user.status === 'ACTIVE' ? 'translateX(20px)' : 'translateX(2px)' }}
                    />
                  </button>
                )}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-subtle">
                {t('users.grid.columns.lastLoginAt')}
              </dt>
              <dd className="text-text-secondary">{formattedLastLogin}</dd>
            </div>
          </dl>
        </section>

        <hr className="border-border-subtle" />

        <section>
          <h3 className="text-base font-semibold text-text-primary">
            {t('users.detail.section.permissions')}
          </h3>
          <div className="mt-4 flex flex-col gap-4">
            {modulePermissions.length === 0 && (
              <p className="text-sm text-text-subtle">
                {t('users.detail.noModulePermissions')}
              </p>
            )}

            {modulePermissions.map((permission) => {
              const options = getModuleSelectOptions(permission.moduleKey);
              const canEditThisModule = canEditModulePermission(permission);
              const isUpdatingThisModule = updatingModuleKey === permission.moduleKey;
              const levelLabelKey = MODULE_LEVEL_LABEL_KEYS[permission.level];
              const levelDescriptionKey = MODULE_LEVEL_DESCRIPTION_KEYS[permission.level];
              const levelLabel = levelLabelKey ? t(levelLabelKey) : permission.level;
              const levelDescription = levelDescriptionKey ? t(levelDescriptionKey) : '';
              const warningTestId = `module-warning-${permission.moduleKey.toLowerCase()}`;
              const showNoneWarning = permission.level === 'NONE';
              const showScopeHint = permission.moduleKey === 'USER_MANAGEMENT';

              return (
                <div
                  key={`${permission.moduleKey}-${permission.assignmentId ?? permission.level}`}
                  className="grid gap-4 rounded-2xl border border-border-subtle bg-surface-default p-5 shadow-xs md:grid-cols-[1fr_auto]"
                >
                  <div className="flex flex-col gap-2">
                    <div className="text-base font-semibold text-text-primary">
                      {permission.moduleLabel ?? permission.moduleKey}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={getBadgeClass(MODULE_LEVEL_COLORS[permission.level] ?? 'default')}>
                        {levelLabel}
                      </span>
                      <span className="text-xs text-text-subtle">{levelDescription}</span>
                    </div>
                    <p className="text-sm text-text-subtle">
                      {permission.permissions?.length
                        ? permission.permissions.join(', ')
                        : t('users.detail.noPermissionDetails')}
                    </p>
                    {!canEditThisModule && canEditUserModule && permission.moduleKey === 'USER_MANAGEMENT' && (
                      <p className="text-xs text-text-subtle">
                        {t('users.detail.scopeMissingHint')}
                      </p>
                    )}
                  </div>
                  {canEditThisModule && (
                    <div className="flex flex-col gap-2">
                      <select
                        className="h-10 min-w-[180px] rounded-xl border border-border-subtle bg-surface-default px-3 py-2 text-sm font-medium text-text-primary focus:outline-hidden focus:ring-2 focus:ring-selection-outline disabled:cursor-not-allowed disabled:opacity-50"
                        value={permission.level}
                        onChange={(event) =>
                          handleModuleLevelChange(permission, event.target.value as UserModuleAccessLevel)
                        }
                        disabled={
                          isUpdatingThisModule || updateModuleMutation.isPending || revokeModuleMutation.isPending
                        }
                      >
                        {options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {t(option.labelKey)}
                          </option>
                        ))}
                      </select>
	                      {(showNoneWarning || showScopeHint) && (
	                        <div
	                          data-testid={warningTestId}
	                          className="rounded-xl border border-status-warning-border bg-status-warning px-3 py-2 text-xs font-semibold text-status-warning-text"
	                        >
	                          {showNoneWarning
	                            ? t('users.detail.noAccessWarning')
	                            : t('users.detail.userManagementScopeHint')}
                        </div>
                      )}
                      {isUpdatingThisModule && (
                        <span className="inline-flex items-center gap-2 text-xs text-text-subtle">
                        <span className="inline-flex h-4 w-4 animate-spin rounded-full border border-border-subtle border-t-action-primary-border" />
                          {t('users.detail.modulePermission.updating')}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <hr className="border-border-subtle" />

        <section>
          <h3 className="text-base font-semibold text-text-primary">
            {t('users.detail.section.quickActions')}
          </h3>
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              className="rounded-xl border border-dashed border-border-subtle px-4 py-2 text-sm font-semibold text-text-secondary"
              disabled
            >
              {t('users.detail.quickActions.noteSoon')}
            </button>
          </div>
        </section>
      </div>
    </DetailDrawer>
  );
};

export default UserDetailDrawer;
