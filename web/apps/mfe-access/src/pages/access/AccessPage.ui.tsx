import React from 'react';
import {
  Button,
  PageLayout,
  createPageLayoutBreadcrumbItems,
  createPageLayoutPreset,
} from '@mfe/design-system';
import { trackAction, trackMutation, resolveTraceId } from '@mfe/shared-http';
import type { TelemetryEvent } from '@mfe/shared-types';
import { fetchPageLayout } from '@mfe/shared-http';
import type { PageLayoutManifest } from '@mfe/shared-types';
import type { AccessFilters, AccessRole } from '../../features/access-management/model/access.types';
import { useAccessRoles } from '../../features/access-management/model/use-access-roles.model';
import AccessFilterBar from '../../widgets/access-management/ui/AccessFilterBar.ui';
import AccessGrid from '../../widgets/access-management/ui/AccessGrid.ui';
import AccessRoleDrawer from '../../widgets/access-management/ui/AccessRoleDrawer.ui';
import AccessVariantToolbar from '../../widgets/access-management/ui/AccessVariantToolbar.ui';
import { accessRolesPageManifest } from '../../manifest/access/roles-page.manifest';
import { useAccessVariants } from '../../features/access-management/model/use-access-variants.model';
import RoleCloneModal from '../../widgets/access-management/ui/RoleCloneModal.ui';
import BulkPermissionModal from '../../widgets/access-management/ui/BulkPermissionModal.ui';
import { getShellServices } from '../../app/services/shell-services';
import { useAccessI18n } from '../../i18n/useAccessI18n';
import PermissionRegistryPanel from '../../widgets/permission-registry/PermissionRegistryPanel.ui';
import { isRuntimeDev, readRuntimeEnv } from '../../app/runtime/env';

type ToastType = 'success' | 'error' | 'warning' | 'info';

const showToast = (type: ToastType, text: string) => {
  try {
    window.dispatchEvent(new CustomEvent('app:toast', { detail: { type, text } }));
  } catch {
    const method = type === 'error' ? 'error' : 'log';
    console[method](text);
  }
};

const defaultFilters: AccessFilters = {
  search: '',
  moduleKey: 'ALL',
  level: 'ALL',
};

const GRID_ID = 'mfe-access/roles';

const AccessPage: React.FC = () => {
  const [filters, setFilters] = React.useState<AccessFilters>(defaultFilters);
  const [selectedRole, setSelectedRole] = React.useState<AccessRole | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = React.useState<string[]>([]);
  const [cloneModalOpen, setCloneModalOpen] = React.useState(false);
  const [bulkModalOpen, setBulkModalOpen] = React.useState(false);
  const [pageLayout, setPageLayout] = React.useState<PageLayoutManifest | null>(null);
  const {
    roles,
    modules,
    total,
    cloneRole,
    bulkUpdateRoles,
    updateRolePermissionsMutation,
  } = useAccessRoles(filters);
  const shellServices = React.useMemo(() => {
    try {
      return getShellServices();
    } catch (error) {
      if (isRuntimeDev()) {
        console.debug('[mfe-access] Shell servislerine erişilemedi:', error);
      }
      return null;
    }
  }, []);
  const { t, ready, formatNumber, formatDate } = useAccessI18n();

  const applyFilters = React.useCallback((next: AccessFilters) => {
    setFilters(next);
  }, []);

  const {
    variants,
    selectedVariantId,
    isDirty,
    selectVariant,
    saveAsVariant,
    updateSelectedVariant,
    deleteVariant,
  } = useAccessVariants(GRID_ID, filters, applyFilters);

  const emitMutationTelemetry = React.useCallback(
    (mutationName: string, status: 'success' | 'error', durationMs: number, auditId?: string, tags?: Record<string, string | number | boolean>) => {
      const traceId = resolveTraceId() ?? undefined;
      const event: TelemetryEvent = {
        eventType: 'telemetry',
        eventName: 'mutation_commit',
        timestamp: new Date().toISOString(),
        traceId,
        context: {
          app: 'mfe-access',
          env: (readRuntimeEnv('APP_ENVIRONMENT', 'local') as TelemetryEvent['context']['env']),
          version: readRuntimeEnv('APP_RELEASE', 'dev'),
          tags: { route: '/access/roles', mutationName, ...(tags ?? {}) },
        },
        metrics: { durationMs },
        audit: auditId ? { auditId, action: mutationName } : undefined,
      };
      void trackMutation(event);
    },
    [],
  );

  const moduleOptions = React.useMemo(
    () => Array.from(modules.entries()).map(([value, label]) => ({ value, label })),
    [modules],
  );

  const levelOptions = React.useMemo(
    () => [
      { value: 'NONE' as const, label: t('access.filter.level.none') },
      { value: 'VIEW' as const, label: t('access.filter.level.view') },
      { value: 'EDIT' as const, label: t('access.filter.level.edit') },
      { value: 'MANAGE' as const, label: t('access.filter.level.manage') },
    ],
    [t],
  );
  const variantOptions = React.useMemo(
    () => variants.map((variant) => ({ value: variant.id, label: variant.name })),
    [variants],
  );

  React.useEffect(() => {
    fetchPageLayout('access')
      .then(setPageLayout)
      .catch(() => setPageLayout(null));
  }, []);

  const columns = React.useMemo(() => accessRolesPageManifest.grid.columns, []);
  const translatedColumns = React.useMemo(
    () =>
      columns.map((column) => ({
        ...column,
        headerName: t(column.headerName),
      })),
    [columns, t],
  );

  const layoutTitle = t(pageLayout?.title ?? accessRolesPageManifest.layout.title);
  const descriptionKey = pageLayout?.description ?? accessRolesPageManifest.layout.description;
  const layoutDescription = descriptionKey ? t(descriptionKey) : undefined;
  const breadcrumbs = createPageLayoutBreadcrumbItems(
    (accessRolesPageManifest.layout.breadcrumbItems ?? []).map((item) => ({
      ...item,
      title: t(item.title as string),
    })),
  );
  const pageLayoutPreset = createPageLayoutPreset({
    preset: 'content-only',
    pageWidth: 'full',
  });

  const selectionCount = selectedRoleIds.length;
  const singleSelectedRole = React.useMemo(() => {
    if (selectionCount !== 1) {
      return null;
    }
    const [roleId] = selectedRoleIds;
    return roles.find((role) => role.id === roleId) ?? null;
  }, [roles, selectionCount, selectedRoleIds]);

  const emitActionTelemetry = React.useCallback((actionId: string) => {
    const traceId = resolveTraceId() ?? undefined;
    const event: TelemetryEvent = {
      eventType: 'telemetry',
      eventName: 'action_click',
      timestamp: new Date().toISOString(),
      traceId,
      context: {
        app: 'mfe-access',
        env: (readRuntimeEnv('APP_ENVIRONMENT', 'local') as TelemetryEvent['context']['env']),
        version: readRuntimeEnv('APP_RELEASE', 'dev'),
        tags: { actionId, route: '/access/roles' },
      },
      payload: { route: '/access/roles' },
    };
    void trackAction(event);
  }, []);

  const actionButtons = React.useMemo(() => {
    if (!accessRolesPageManifest.actions) {
      return null;
    }
    return accessRolesPageManifest.actions.map((action) => {
      const requires = action.requiresSelection ?? 'none';
      let disabled = Boolean(action.isComingSoon);
      if (!disabled) {
        if (requires === 'single') {
          disabled = selectionCount !== 1;
        } else if (requires === 'multi') {
          disabled = selectionCount === 0;
        }
      }

      const activateAction = () => {
        if (disabled) {
          return;
        }
        emitActionTelemetry(action.key);
        if (action.key === 'clone-role') {
          setCloneModalOpen(true);
          return;
        }
        if (action.key === 'bulk-permission') {
          setBulkModalOpen(true);
          return;
        }
      };

      const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) {
          return;
        }
        if (action.key !== 'clone-role' && action.key !== 'bulk-permission') {
          return;
        }
        // Grid seçimi toolbar click'inde düşse bile aksiyon state'i yakalansın.
        event.preventDefault();
        activateAction();
      };

      const handleClick = () => {
        activateAction();
      };

      const label = t(action.label);
      const tooltip = action.tooltip ? t(action.tooltip) : undefined;

      return (
        <Button
          key={action.key}
          type="button"
          title={tooltip}
          disabled={disabled}
          onMouseDown={handleMouseDown}
          onClick={handleClick}
          variant={action.intent === 'primary' ? 'primary' : 'secondary'}
        >
          {label}
        </Button>
      );
    });
  }, [accessRolesPageManifest.actions, emitActionTelemetry, selectionCount, t]);

  const handleSaveVariant = React.useCallback(() => {
    if (selectedVariantId) {
      updateSelectedVariant();
      showToast('success', t('access.variants.updated'));
    } else {
      const name = window.prompt(
        t('access.variants.promptName'),
        t('access.variants.promptPlaceholder'),
      );
      if (!name || name.trim().length === 0) {
        return;
      }
      saveAsVariant(name.trim());
      showToast('success', t('access.variants.saved'));
    }
  }, [saveAsVariant, selectedVariantId, t, updateSelectedVariant]);

  const handleSaveAsVariant = React.useCallback(() => {
    const name = window.prompt(
      t('access.variants.promptName'),
      t('access.variants.promptPlaceholder'),
    );
    if (!name || name.trim().length === 0) {
      return;
    }
    saveAsVariant(name.trim());
    showToast('success', t('access.variants.saved'));
  }, [saveAsVariant, t]);

  const handleDeleteVariant = React.useCallback(() => {
    if (!selectedVariantId) {
      return;
    }
    const confirmed = window.confirm(t('access.variants.deleteConfirm.content'));
    if (!confirmed) {
      return;
    }
    deleteVariant(selectedVariantId);
    showToast('success', t('access.variants.deleted'));
  }, [deleteVariant, selectedVariantId, t]);

  const filterBar = React.useMemo(
    () => (
      <div className="flex flex-col gap-3">
        <AccessFilterBar filters={filters} modules={modules} onChange={setFilters} t={t} />
        <AccessVariantToolbar
          selectedVariantId={selectedVariantId}
          variantOptions={variantOptions}
          isDirty={isDirty}
          onSelectVariant={selectVariant}
          onSaveVariant={handleSaveVariant}
          onSaveAsVariant={handleSaveAsVariant}
          onDeleteVariant={handleDeleteVariant}
          t={t}
        />
      </div>
    ),
    [
      filters,
      modules,
      selectedVariantId,
      variants,
      variantOptions,
      selectVariant,
      handleDeleteVariant,
      handleSaveAsVariant,
      handleSaveVariant,
      isDirty,
      t,
    ],
  );

  if (!ready) {
    return null;
  }

  return (
    <>
      <div data-testid="access-roles-page">
        <PageLayout
          {...pageLayoutPreset}
          title={layoutTitle}
          description={layoutDescription}
          breadcrumbItems={breadcrumbs}
          actions={actionButtons ? <div className="flex flex-wrap gap-2">{actionButtons}</div> : undefined}
          filterBar={filterBar}
        >
          <div className="space-y-6">
            <div className="rounded-3xl border border-border-subtle bg-surface-default p-6 shadow-sm">
              <p className="text-sm text-text-subtle">
                {t('access.metrics.activeRoleCount', { count: formatNumber(total) })}
              </p>
              {roles.length > 0 ? (
                <AccessGrid
                  rows={roles}
                  columns={translatedColumns}
                  onSelect={setSelectedRole}
                  selectedRoleIds={selectedRoleIds}
                  onSelectionChange={setSelectedRoleIds}
                  t={t}
                  formatNumber={formatNumber}
                  formatDate={formatDate}
                />
              ) : (
                <div className="mt-12 text-center text-text-subtle">
                  <p>{t('access.empty.noResults')}</p>
                </div>
              )}
            </div>

            <PermissionRegistryPanel t={t} formatDate={formatDate} />
          </div>
        </PageLayout>
      </div>

      <AccessRoleDrawer
        open={Boolean(selectedRole)}
        role={selectedRole}
        onClose={() => setSelectedRole(null)}
        onPermissionsSave={async (roleId, permissionIds) => {
          const startedAt = performance.now();
          try {
            const response = await updateRolePermissionsMutation.mutateAsync({ id: roleId, permissionIds });
            const durationMs = performance.now() - startedAt;
            const auditId = (response as { auditId?: string } | undefined)?.auditId;
            emitMutationTelemetry('update_role_permissions', 'success', durationMs, auditId, {
              roleId,
              permissionCount: permissionIds.length,
            });
          } catch (error) {
            const durationMs = performance.now() - startedAt;
            emitMutationTelemetry('update_role_permissions', 'error', durationMs, undefined, { roleId });
            throw error;
          }
          setSelectedRole((prev) => (prev && prev.id === roleId ? { ...prev, permissions: permissionIds } : prev));
        }}
        savingPermissions={updateRolePermissionsMutation.isPending}
        t={t}
        formatNumber={formatNumber}
        formatDate={formatDate}
      />

      <RoleCloneModal
        open={cloneModalOpen}
        role={singleSelectedRole}
        onCancel={() => setCloneModalOpen(false)}
        t={t}
        onSubmit={async (values) => {
          if (!singleSelectedRole) {
            setCloneModalOpen(false);
            showToast('warning', t('access.notifications.cloneMissingSelection'));
            return;
          }
          try {
            const result = await cloneRole({
              sourceRoleId: singleSelectedRole.id,
              name: values.name,
              description: values.description,
              copyMemberCount: values.copyMemberCount,
            });
            setCloneModalOpen(false);
            setSelectedRole(result.role);
            setSelectedRoleIds([result.role.id]);
            showToast('success', t('access.notifications.cloneSuccess.title'));
            shellServices?.notify.push({
              message: t('access.notifications.cloneSuccess.title'),
              description: t('access.notifications.cloneSuccess.description', { auditId: result.auditId }),
              type: 'success',
              meta: {
                auditId: result.auditId,
                correlationId: result.auditId,
                route: '/audit/events',
                action: 'access.clone',
                roleId: result.role.id,
                open: true,
              },
            });
            shellServices?.telemetry.emit({
              type: 'access.clone_role',
              payload: {
                auditId: result.auditId,
                correlationId: result.auditId,
                roleId: result.role.id,
              },
            });
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : t('access.notifications.cloneError');
            showToast('error', errorMessage);
          }
        }}
      />

      <BulkPermissionModal
        open={bulkModalOpen}
        roleCount={selectedRoleIds.length}
        moduleOptions={moduleOptions}
        levelOptions={levelOptions}
        onCancel={() => setBulkModalOpen(false)}
        t={t}
        formatNumber={formatNumber}
        onSubmit={(values) => {
          if (selectedRoleIds.length === 0) {
            setBulkModalOpen(false);
            return;
          }
          const moduleLabel =
            moduleOptions.find((option) => option.value === values.moduleKey)?.label ?? values.moduleKey;
          const result = bulkUpdateRoles({
            roleIds: selectedRoleIds,
            moduleKey: values.moduleKey,
            moduleLabel,
            level: values.level,
          });
          setBulkModalOpen(false);
          if (result.updatedRoleIds.length === 0) {
            showToast('info', t('access.notifications.bulkNoop'));
            return;
          }
          showToast('success', t('access.notifications.bulkSuccess.title'));
          shellServices?.notify.push({
            message: t('access.notifications.bulkSuccess.title'),
            description: t('access.notifications.bulkSuccess.description', {
              auditId: result.auditId,
              count: formatNumber(result.updatedRoleIds.length),
            }),
            type: 'success',
            meta: {
              auditId: result.auditId,
              correlationId: result.auditId,
              route: '/audit/events',
              action: 'access.bulk_permission',
              affectedRoles: result.updatedRoleIds,
              open: true,
            },
          });
          shellServices?.telemetry.emit({
            type: 'access.bulk_update_permissions',
            payload: {
              auditId: result.auditId,
              correlationId: result.auditId,
              roleIds: result.updatedRoleIds,
              moduleKey: values.moduleKey,
              level: values.level,
            },
          });
        }}
      />
    </>
  );
};

export default AccessPage;
