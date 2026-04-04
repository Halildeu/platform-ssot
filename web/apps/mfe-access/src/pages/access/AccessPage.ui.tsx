import React from 'react';
import {
  Badge,
  Button,
  Modal,
  Segmented,
  Select,
  TextInput,
  PageLayout,
  createPageLayoutBreadcrumbItems,
  createPageLayoutPreset,
} from '@mfe/design-system';
import { trackAction, trackMutation, resolveTraceId } from '@mfe/shared-http';
import type { TelemetryEvent } from '@mfe/shared-types';
import { fetchPageLayout } from '@mfe/shared-http';
import type { PageLayoutManifest } from '@mfe/shared-types';
import { useQuery } from '@tanstack/react-query';
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
import CreateRoleModal from '../../widgets/access-management/ui/CreateRoleModal.ui';
import DeleteRoleModal from '../../widgets/access-management/ui/DeleteRoleModal.ui';
import { getShellServices } from '../../app/services/shell-services';
import { useAccessI18n } from '../../i18n/useAccessI18n';
import PermissionRegistryPanel from '../../widgets/permission-registry/PermissionRegistryPanel.ui';
import { isRuntimeDev, readRuntimeEnv } from '../../app/runtime/env';
import { getCompanies, type CompanyDto } from '../../entities/companies/api/companies.api';
import RelationshipGraph from '../../widgets/access-management/ui/RelationshipGraph.ui';
import PermissionMatrix from '../../widgets/access-management/ui/PermissionMatrix.ui';
import ExplainPanel from '../../widgets/access-management/ui/ExplainPanel.ui';
import ScopeAssignmentPanel from '../../widgets/access-management/ui/ScopeAssignmentPanel.ui';
import type { AccessLevel } from '../../features/access-management/model/access.types';

type ActiveTab = 'roles' | 'matrix' | 'graph';

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
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<ActiveTab>('roles');
  const [explainOpen, setExplainOpen] = React.useState(false);
  const [scopeOpen, setScopeOpen] = React.useState(false);
  const [matrixChanges, setMatrixChanges] = React.useState<Map<string, { roleId: string; moduleKey: string; level: AccessLevel }>>(new Map());
  const [matrixSaving, setMatrixSaving] = React.useState(false);
  const [pageLayout, setPageLayout] = React.useState<PageLayoutManifest | null>(null);
  const {
    roles,
    modules,
    total,
    cloneRole,
    bulkUpdateRoles,
    createRoleMutation,
    deleteRoleMutation,
    roleCloneMutation,
    updateRolePermissionsMutation,
  } = useAccessRoles(filters);
  const shellServices = React.useMemo(() => {
    try {
      return getShellServices();
    } catch (error: unknown) {
      if (isRuntimeDev()) {
        console.debug('[mfe-access] Shell servislerine erişilemedi:', error);
      }
      return null;
    }
  }, []);
  const { t, ready, formatNumber, formatDate } = useAccessI18n();
  const authUser = React.useMemo(() => {
    try {
      const user = shellServices?.auth.getUser() as { superAdmin?: boolean } | null;
      return user ?? { superAdmin: false };
    } catch {
      return { superAdmin: false };
    }
  }, [shellServices]);
  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies,
    staleTime: 120_000,
  });
  const [activeCompanyId, setActiveCompanyId] = React.useState<string>('');

  const companyOptions = React.useMemo(
    () => [
      { value: '', label: t('access.scope.allCompanies') },
      ...companies.map((c: CompanyDto) => ({ value: String(c.id), label: c.name })),
    ],
    [companies, t],
  );

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

  // Always use manifest keys (pageLayout may return non-existent keys like access.roles.title)
  const layoutTitle = t(accessRolesPageManifest.layout.title);
  const layoutDescription = accessRolesPageManifest.layout.description
    ? t(accessRolesPageManifest.layout.description)
    : undefined;
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

  const actionButtons = (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => { emitActionTelemetry('create-role'); setCreateModalOpen(true); }}
      >
        {t('access.actions.create')}
      </Button>
      <Button
        variant="secondary"
        disabled={selectionCount !== 1}
        onClick={() => { emitActionTelemetry('clone-role'); setCloneModalOpen(true); }}
      >
        {t('access.actions.clone')}
      </Button>
      <Button
        variant="secondary"
        disabled={selectionCount === 0}
        onClick={() => { emitActionTelemetry('bulk-permission'); setBulkModalOpen(true); }}
      >
        {t('access.actions.bulk')}
      </Button>
      <Button
        variant="secondary"
        disabled={selectionCount !== 1 || (singleSelectedRole?.isSystemRole ?? false)}
        onClick={() => { emitActionTelemetry('delete-role'); setDeleteModalOpen(true); }}
      >
        {t('access.actions.delete')}
      </Button>
    </div>
  );

  // Variant dialog state
  const [variantNameDialogOpen, setVariantNameDialogOpen] = React.useState(false);
  const [variantNameInput, setVariantNameInput] = React.useState('');
  const [variantNameMode, setVariantNameMode] = React.useState<'save' | 'saveAs'>('save');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);

  const handleSaveVariant = React.useCallback(() => {
    if (selectedVariantId) {
      updateSelectedVariant();
      showToast('success', t('access.variants.updated'));
    } else {
      setVariantNameMode('save');
      setVariantNameInput('');
      setVariantNameDialogOpen(true);
    }
  }, [selectedVariantId, t, updateSelectedVariant]);

  const handleSaveAsVariant = React.useCallback(() => {
    setVariantNameMode('saveAs');
    setVariantNameInput('');
    setVariantNameDialogOpen(true);
  }, []);

  const handleVariantNameConfirm = React.useCallback(() => {
    const name = variantNameInput.trim();
    if (!name) return;
    saveAsVariant(name);
    showToast('success', t('access.variants.saved'));
    setVariantNameDialogOpen(false);
  }, [variantNameInput, saveAsVariant, t]);

  const handleDeleteVariant = React.useCallback(() => {
    if (!selectedVariantId) return;
    setDeleteConfirmOpen(true);
  }, [selectedVariantId]);

  const handleDeleteVariantConfirm = React.useCallback(() => {
    if (!selectedVariantId) return;
    deleteVariant(selectedVariantId);
    showToast('success', t('access.variants.deleted'));
    setDeleteConfirmOpen(false);
  }, [deleteVariant, selectedVariantId, t]);

  const filterBar = React.useMemo(
    () => (
      <div className="flex flex-col gap-2">
        <AccessFilterBar filters={filters} modules={modules} onChange={setFilters} t={t} />
        {(selectedVariantId || isDirty) && (
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
        )}
      </div>
    ),
    [
      filters,
      modules,
      selectedVariantId,
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
          actions={actionButtons}
          headerExtra={
            <div className="flex items-center gap-2">
              {authUser?.superAdmin && (
                <Badge variant="info" size="sm">{t('access.scope.superAdmin')}</Badge>
              )}
              {companies.length > 1 && (
                <Select
                  options={companyOptions}
                  value={activeCompanyId}
                  onValueChange={setActiveCompanyId}
                  size="sm"
                  fullWidth={false}
                  data-testid="access-company-scope-select"
                />
              )}
              {companies.length === 1 && (
                <Badge variant="default" size="sm">{companies[0].name}</Badge>
              )}
            </div>
          }
          secondaryNav={
            <div className="flex items-center justify-between">
              <Segmented
                items={[
                  { value: 'roles', label: t('access.breadcrumb.roles') },
                  { value: 'matrix', label: t('access.matrix.title') },
                  { value: 'graph', label: t('access.graph.title') },
                ]}
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as ActiveTab)}
                size="sm"
              />
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setScopeOpen(true)}>
                  {t('access.scope.title')}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setExplainOpen(true)}>
                  {t('access.explain.title')}
                </Button>
              </div>
            </div>
          }
          filterBar={activeTab === 'roles' ? filterBar : undefined}
        >
          {activeTab === 'roles' && (
            <div className="flex flex-col gap-6">
              <div className="rounded-3xl border border-border-subtle bg-surface-default p-6 shadow-xs">
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
          )}

          {activeTab === 'matrix' && (
            <div className="rounded-3xl border border-border-subtle bg-surface-default p-6 shadow-xs">
              <PermissionMatrix
                roles={roles}
                modules={modules}
                saving={matrixSaving}
                onLevelChange={(roleId, moduleKey, level) => {
                  setMatrixChanges((prev) => {
                    const next = new Map(prev);
                    next.set(`${roleId}:${moduleKey}`, { roleId, moduleKey, level });
                    return next;
                  });
                }}
                onSaveAll={async () => {
                  if (matrixChanges.size === 0) return;
                  setMatrixSaving(true);
                  try {
                    const grouped = new Map<string, { moduleKey: string; level: AccessLevel }[]>();
                    for (const change of matrixChanges.values()) {
                      const list = grouped.get(change.roleId) ?? [];
                      list.push({ moduleKey: change.moduleKey, level: change.level });
                      grouped.set(change.roleId, list);
                    }
                    for (const [roleId, changes] of grouped) {
                      for (const { moduleKey, moduleLabel, level } of changes.map(c => ({
                        ...c,
                        moduleLabel: modules.get(c.moduleKey) ?? c.moduleKey,
                      }))) {
                        await bulkUpdateRoles({
                          roleIds: [roleId],
                          moduleKey,
                          moduleLabel,
                          level,
                        });
                      }
                    }
                    setMatrixChanges(new Map());
                    showToast('success', t('access.matrix.saveAll'));
                  } catch (error: unknown) {
                    const msg = error instanceof Error ? error.message : 'Save failed';
                    showToast('error', msg);
                  } finally {
                    setMatrixSaving(false);
                  }
                }}
                t={t}
              />
            </div>
          )}

          {activeTab === 'graph' && (
            <div className="rounded-3xl border border-border-subtle bg-surface-default p-6 shadow-xs">
              <RelationshipGraph t={t} />
            </div>
          )}
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
          } catch (error: unknown) {
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
        confirmLoading={roleCloneMutation.isPending}
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
          } catch (error: unknown) {
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

      <CreateRoleModal
        open={createModalOpen}
        confirmLoading={createRoleMutation.isPending}
        onCancel={() => setCreateModalOpen(false)}
        t={t}
        onSubmit={async (values) => {
          try {
            const created = await createRoleMutation.mutateAsync(values);
            setCreateModalOpen(false);
            setSelectedRole(created);
            setSelectedRoleIds([created.id]);
            showToast('success', t('access.notifications.createSuccess'));
          } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : t('access.notifications.createError');
            showToast('error', msg);
          }
        }}
      />

      <DeleteRoleModal
        open={deleteModalOpen}
        role={singleSelectedRole}
        confirmLoading={deleteRoleMutation.isPending}
        onCancel={() => setDeleteModalOpen(false)}
        t={t}
        onConfirm={async (roleId) => {
          try {
            await deleteRoleMutation.mutateAsync(roleId);
            setDeleteModalOpen(false);
            setSelectedRole(null);
            setSelectedRoleIds([]);
            showToast('success', t('access.notifications.deleteSuccess'));
          } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : t('access.notifications.deleteError');
            showToast('error', msg);
          }
        }}
      />

      <ExplainPanel
        open={explainOpen}
        onClose={() => setExplainOpen(false)}
        modules={modules}
        t={t}
      />

      <ScopeAssignmentPanel
        open={scopeOpen}
        userId={singleSelectedRole ? singleSelectedRole.id : null}
        userName={singleSelectedRole?.name}
        onClose={() => setScopeOpen(false)}
        t={t}
      />

      {/* Variant Name Dialog */}
      <Modal
        open={variantNameDialogOpen}
        onClose={() => setVariantNameDialogOpen(false)}
        title={t('access.variants.promptName')}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setVariantNameDialogOpen(false)}>
              {t('access.actions.cancel')}
            </Button>
            <Button onClick={handleVariantNameConfirm} disabled={!variantNameInput.trim()}>
              {t('access.actions.save')}
            </Button>
          </>
        }
      >
        <TextInput
          value={variantNameInput}
          onChange={(e) => setVariantNameInput(typeof e === 'string' ? e : e.target.value)}
          placeholder={t('access.variants.promptPlaceholder')}
          autoFocus
        />
      </Modal>

      {/* Delete Variant Confirm Dialog */}
      <Modal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title={t('access.variants.deleteConfirm.title')}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)}>
              {t('access.actions.cancel')}
            </Button>
            <Button variant="danger" onClick={handleDeleteVariantConfirm}>
              {t('access.actions.delete')}
            </Button>
          </>
        }
      >
        <p className="text-sm text-text-secondary">{t('access.variants.deleteConfirm.content')}</p>
      </Modal>
    </>
  );
};

export default AccessPage;
