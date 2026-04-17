import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, Autocomplete, Badge, Button, Checkbox, DetailDrawer, Select, Switch, TextInput } from '@mfe/design-system';
import type { AutocompleteOption } from '@mfe/design-system';
import { usePermissions, useZanzibarAccess } from '@mfe/auth';
import type { AccessRole, AccessLevel } from '../../features/access-management/model/access.types';
import { getPermissions } from '../../entities/permissions/api/permissions.api';
import { api } from '@mfe/shared-http';
import { pushToast } from '../../shared/notifications';
import { ExplainPermissionModal } from '../explain-modal/ExplainPermissionModal';

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

// --- Types for permission catalog ---
interface CatalogModule { key: string; label: string; levels: string[]; }
interface CatalogAction { key: string; label: string; module: string; deniable: boolean; }
interface CatalogReport { key: string; label: string; module: string; }
interface CatalogPage { key: string; label: string; module: string; }
interface Catalog { modules: CatalogModule[]; actions: CatalogAction[]; reports: CatalogReport[]; pages: CatalogPage[]; }
interface RoleMember { userId: number; assignedAt?: string; }
interface Granule { type: string; key: string; grant: string; }

const LEVEL_OPTIONS: AccessLevel[] = ['NONE', 'VIEW', 'MANAGE'];
const levelVariant: Record<string, 'info' | 'warning' | 'error' | 'muted'> = { VIEW: 'info', MANAGE: 'error', NONE: 'muted' };

const isPersistedRoleId = (value: string | undefined) => /^\d+$/.test(String(value ?? ''));

const buildFallbackCatalog = (role: AccessRole | null): Catalog => ({
  modules: (role?.policies ?? []).map((policy) => ({
    key: policy.moduleKey,
    label: policy.moduleLabel,
    levels: ['NONE', 'VIEW', 'MANAGE'],
  })),
  actions: [],
  reports: [],
  pages: [],
});

const RoleDrawer: React.FC<RoleDrawerProps> = ({
  open, mode, role, onClose, onSavePermissions, onCreateRole,
  savingPermissions, creatingRole, t, formatNumber, formatDate,
}) => {
  const queryClient = useQueryClient();
  const [createName, setCreateName] = React.useState('');
  const [createDesc, setCreateDesc] = React.useState('');

  // Faz 4 Explain UX: target of the "Why?" button the user clicked.
  // Null => modal closed. Set => modal opens and auto-fetches /v1/authz/explain.
  const [explainTarget, setExplainTarget] = React.useState<{
    type: 'MODULE' | 'ACTION' | 'REPORT';
    key: string;
    label: string;
  } | null>(null);

  // Current user for the explain call (admin debugging own permission set; STORY-0318 §6).
  const { authz } = usePermissions();
  const currentUserId =
    (authz as { userId?: string | number } | null | undefined)?.userId ?? null;

  // Stable httpPost reference — ExplainPermissionModal (now from @mfe/auth)
  // takes httpPost as a prop. Inline arrow would recreate explain() identity
  // every render and re-fire the auto-fetch effect (P1.1 loop root cause).
  const explainHttpPost = React.useCallback(
    (url: string, body: unknown) => api.post(url, body),
    [],
  );

  // Zanzibar object-level access check: can current user edit the ACCESS module?
  const { access: editAccess } = useZanzibarAccess('can_edit', 'module', 'ACCESS');

  // --- Catalog query ---
  // Codex CNS thread 019d9a28 Tur 14-15: persisted role için fallback YASAK.
  // Eski davranış: catalog fetch pending iken `buildFallbackCatalog(role)` render
  // edilir → fallback'in moduleKey'i `label.toUpperCase()` (örn. "RAPORLAMA")
  // geldiği için explain-trigger setExplainTarget({key: mod.key="RAPORLAMA",...})
  // ile yanlış key kilitlenir. Race'i kapatmak için:
  //   1) queryFn persisted role'de fallback dönmesin, backend response döner.
  //   2) Render'da `catalog = catalogQuery.data` sadece (fallback yok).
  //   3) Catalog henüz yüklenmediyse module/action/report bölümleri ve explain
  //      butonları render edilmesin (loading UI).
  const catalogQuery = useQuery({
    queryKey: ['permission-catalog'],
    queryFn: async () => {
      const res = await api.get('/v1/authz/catalog');
      return res.data as Catalog;
    },
    enabled: open && mode === 'view' && isPersistedRoleId(role?.id),
    staleTime: 120_000,
  });

  // --- Members query ---
  const membersQuery = useQuery({
    queryKey: ['role-members', role?.id],
    queryFn: async () => {
      if (!isPersistedRoleId(role?.id)) {
        return [] as RoleMember[];
      }
      const res = await api.get(`/v1/roles/${role!.id}/members`);
      return res.data as RoleMember[];
    },
    enabled: open && mode === 'view' && !!role,
  });

  // --- Granule state ---
  const [moduleGrants, setModuleGrants] = React.useState<Record<string, string>>({});
  const [actionGrants, setActionGrants] = React.useState<Record<string, string>>({});
  const [reportGrants, setReportGrants] = React.useState<Record<string, string>>({});
  const [pageGrants, setPageGrants] = React.useState<Record<string, string>>({});
  const [dirty, setDirty] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<AutocompleteOption | null>(null);
  const [userSearchOptions, setUserSearchOptions] = React.useState<AutocompleteOption[]>([]);
  const [userSearchLoading, setUserSearchLoading] = React.useState(false);
  // Raw input text for the user search Autocomplete, kept separate from
  // `selectedUser` so that typing does not clear the input every keystroke
  // (the component is controlled and matched=null keystrokes would otherwise
  // reset the displayed value). Cleared only after a successful add or a
  // duplicate-check rejection (P1.7 Codex verdict).
  const [userSearchValue, setUserSearchValue] = React.useState('');

  // Init from role granules (fetch full 5-type permission list)
  const roleGranulesQuery = useQuery({
    queryKey: ['role-granules', role?.id],
    queryFn: async () => {
      if (!isPersistedRoleId(role?.id)) return null;
      const res = await api.get(`/v1/roles/${role!.id}`);
      const data = res.data as any;
      return (data?.policies ?? data?.permissions ?? []) as Granule[];
    },
    enabled: open && mode === 'view' && !!role && isPersistedRoleId(role?.id),
  });

  React.useEffect(() => {
    if (!role) return;
    const mods: Record<string, string> = {};
    const acts: Record<string, string> = {};
    const reps: Record<string, string> = {};
    const pgs: Record<string, string> = {};

    // Init from fetched granules if available
    const granules = roleGranulesQuery.data;
    if (granules && granules.length > 0) {
      for (const g of granules) {
        switch (g.type?.toUpperCase()) {
          case 'MODULE': mods[g.key] = g.grant; break;
          case 'ACTION': acts[g.key] = g.grant; break;
          case 'REPORT': reps[g.key] = g.grant; break;
          case 'PAGE': pgs[g.key] = g.grant; break;
        }
      }
    } else {
      // Fallback to legacy policies
      for (const p of role.policies) { mods[p.moduleKey] = p.level; }
    }

    setModuleGrants(mods);
    setActionGrants(acts);
    setReportGrants(reps);
    setPageGrants(pgs);
    setDirty(false);
  }, [role, roleGranulesQuery.data]);

  // --- User search handler ---
  // Threshold 3 (P1.7 user feedback): 2-char queries return too many matches in
  // staging, degrading autocomplete UX. Autocomplete component already debounces
  // onSearch by 250ms (design-system/Autocomplete.tsx:188), so no extra debounce
  // here. Queries shorter than 3 chars clear the dropdown.
  const handleUserSearch = React.useCallback(async (query: string) => {
    if (query.length < 3) { setUserSearchOptions([]); return; }
    setUserSearchLoading(true);
    try {
      const res = await api.get('/v1/users', { params: { search: query, pageSize: 10 } });
      const items = res.data?.items ?? res.data?.content ?? [];
      setUserSearchOptions(
        items.map((u: { id: string | number; fullName?: string; name?: string; email?: string }) => ({
          value: String(u.id),
          label: `${u.fullName ?? u.name ?? ''} (${u.email ?? ''})`.trim(),
        })),
      );
    } catch {
      setUserSearchOptions([]);
    } finally {
      setUserSearchLoading(false);
    }
  }, []);

  // --- Save granules mutation ---
  const saveGranulesMutation = useMutation({
    mutationFn: async () => {
      if (!isPersistedRoleId(role?.id)) return;
      const granules: Granule[] = [];
      for (const [key, grant] of Object.entries(moduleGrants)) {
        if (grant !== 'NONE') granules.push({ type: 'module', key, grant });
      }
      for (const [key, grant] of Object.entries(actionGrants)) {
        granules.push({ type: 'action', key, grant });
      }
      for (const [key, grant] of Object.entries(reportGrants)) {
        granules.push({ type: 'report', key, grant });
      }
      for (const [key, grant] of Object.entries(pageGrants)) {
        granules.push({ type: 'page', key, grant });
      }
      await api.put(`/v1/roles/${role!.id}/granules`, { permissions: granules });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setDirty(false);
      pushToast('success', t('access.notifications.permissionSaveSuccess'));
    },
    onError: (err: Error) => {
      pushToast('error', err.message || t('access.notifications.permissionSaveError'));
    },
  });

  // --- Add member mutation ---
  const addMemberMutation = useMutation({
    mutationFn: async (userId: number) => {
      if (!isPersistedRoleId(role?.id)) return;
      await api.post(`/v1/roles/${role!.id}/members`, { userIds: [userId] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-members', role?.id] });
      setSelectedUser(null);
      setUserSearchOptions([]);
      setUserSearchValue('');
      pushToast('success', t('access.notifications.memberAddSuccess'));
    },
    onError: (err: Error) => {
      pushToast('error', err.message || t('access.notifications.memberAddError'));
    },
  });

  // --- Remove member mutation ---
  const removeMemberMutation = useMutation({
    mutationFn: async (userId: number) => {
      if (!isPersistedRoleId(role?.id)) return;
      await api.delete(`/v1/roles/${role!.id}/members/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-members', role?.id] });
      pushToast('success', t('access.notifications.memberRemoveSuccess'));
    },
    onError: (err: Error) => {
      pushToast('error', err.message || t('access.notifications.memberRemoveError'));
    },
  });

  // Reset on mode change
  React.useEffect(() => {
    if (mode === 'create') { setCreateName(''); setCreateDesc(''); }
  }, [mode, open]);

  const handleCreate = async () => {
    if (!onCreateRole || !createName.trim()) return;
    await onCreateRole({ name: createName.trim(), description: createDesc.trim() || undefined });
  };

  // --- Create mode ---
  if (mode === 'create') {
    return (
      <DetailDrawer open={open} onClose={onClose} title={t('access.create.title')} size="lg">
        <div className="flex flex-col gap-5 p-1">
          <TextInput label={t('access.create.nameLabel')} placeholder={t('access.create.namePlaceholder')}
            value={createName} onValueChange={setCreateName} autoFocus fullWidth />
          <TextInput label={t('access.create.descriptionLabel')} placeholder={t('access.create.descriptionPlaceholder')}
            value={createDesc} onValueChange={setCreateDesc} fullWidth />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={onClose}>{t('access.clone.cancelText')}</Button>
            <Button onClick={handleCreate} loading={creatingRole} disabled={createName.trim().length < 3}>{t('access.create.submitText')}</Button>
          </div>
        </div>
      </DetailDrawer>
    );
  }

  if (!role) return null;

  // Codex Tur 15 verdict: persisted role → backend catalog zorunlu, fallback yok.
  // non-persisted (new role create) akışında fallback `role.policies` kullanılabilir.
  const persistedRole = isPersistedRoleId(role?.id);
  const catalog = persistedRole
    ? (catalogQuery.data ?? null)
    : buildFallbackCatalog(role);
  const members = membersQuery.data ?? [];

  // Persisted role + catalog henüz yüklenmedi (veya hata): loading/error state
  // — module/explain listesi render edilmesin, yanlış key kilitlenmesin.
  if (persistedRole && !catalog) {
    return (
      <DetailDrawer
        open={open}
        onClose={onClose}
        title={role.name}
        subtitle={role.description || t('access.drawer.noDescription')}
        size="lg"
      >
        <div className="flex flex-col gap-3 py-6">
          {catalogQuery.isError ? (
            <Alert variant="error" title={t('access.drawer.catalogErrorTitle') || 'Katalog yüklenemedi'}>
              {String(catalogQuery.error ?? 'Unknown error')}
            </Alert>
          ) : (
            <div className="text-sm text-text-subtle" data-testid="role-drawer-catalog-loading">
              {t('access.drawer.catalogLoading') || 'Yetki katalogu yükleniyor…'}
            </div>
          )}
        </div>
      </DetailDrawer>
    );
  }

  // --- Helpers ---
  const setModule = (key: string, level: string) => {
    setModuleGrants(prev => ({ ...prev, [key]: level }));
    setDirty(true);
  };

  const toggleAction = (key: string, grant: 'ALLOW' | 'DENY') => {
    setActionGrants(prev => {
      const current = prev[key];
      if (current === grant) { const next = { ...prev }; delete next[key]; return next; }
      return { ...prev, [key]: grant };
    });
    setDirty(true);
  };

  const toggleReport = (key: string) => {
    setReportGrants(prev => {
      if (prev[key]) { const next = { ...prev }; delete next[key]; return next; }
      return { ...prev, [key]: 'ALLOW' };
    });
    setDirty(true);
  };

  const togglePage = (key: string) => {
    setPageGrants(prev => {
      if (prev[key]) { const next = { ...prev }; delete next[key]; return next; }
      return { ...prev, [key]: 'ALLOW' };
    });
    setDirty(true);
  };

  return (
    <DetailDrawer
      open={open} onClose={onClose} title={role.name}
      subtitle={role.description || t('access.drawer.noDescription')}
      tags={
        <div className="flex gap-2">
          {role.isSystemRole && <Badge variant="default" size="sm">{t('access.drawer.systemRole')}</Badge>}
          <Badge variant="info" size="sm">{formatNumber(role.memberCount)} {t('access.drawer.members')}</Badge>
          {dirty && <Badge variant="warning" size="sm">{t('access.drawer.unsavedChanges')}</Badge>}
        </div>
      }
      size="lg"
    >
      <div className="flex flex-col gap-5">
        {/* --- MODÜLLER --- */}
        <h3 className="text-sm font-semibold uppercase tracking-wide text-text-subtle">{t('access.drawer.modulesTitle')}</h3>
        <div className="flex flex-col gap-2">
          {(catalog?.modules ?? []).map(mod => (
            <div key={mod.key} className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface-muted/50 px-4 py-3">
              <span className="text-sm font-medium text-text-primary">{mod.label}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setExplainTarget({ type: 'MODULE', key: mod.key, label: mod.label })}
                  aria-label={t('access.explainModal.triggerAria', { label: mod.label })}
                  title={t('access.explainModal.triggerTitle')}
                  data-testid={`explain-trigger-module-${mod.key}`}
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-border-subtle text-xs text-text-subtle hover:bg-surface-default hover:text-text-primary"
                >
                  ?
                </button>
                <select
                  className="rounded-lg border border-border-subtle bg-surface-default px-3 py-1.5 text-sm"
                  value={moduleGrants[mod.key] ?? 'NONE'}
                  onChange={e => setModule(mod.key, e.target.value)}
                >
                  {LEVEL_OPTIONS.map(level => (
                    <option key={level} value={level}>{level === 'NONE' ? '—' : level === 'VIEW' ? t('access.drawer.levelView') : t('access.drawer.levelManage')}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        <hr className="border-border-subtle" />

        {/* --- AKSİYONLAR --- */}
        <h3 className="text-sm font-semibold uppercase tracking-wide text-text-subtle">{t('access.drawer.actionsTitle')}</h3>
        <div className="flex flex-col gap-2">
          {(catalog?.actions ?? []).map(action => {
            const grant = actionGrants[action.key];
            const isAllow = grant === 'ALLOW';
            const isDeny = grant === 'DENY';
            return (
              <div key={action.key} className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface-muted/50 px-4 py-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-text-primary">{action.label}</span>
                  <span className="text-xs text-text-subtle">{action.module}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setExplainTarget({ type: 'ACTION', key: action.key, label: action.label })}
                    aria-label={t('access.explainModal.triggerAria', { label: action.label })}
                    title={t('access.explainModal.triggerTitle')}
                    data-testid={`explain-trigger-action-${action.key}`}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-border-subtle text-xs text-text-subtle hover:bg-surface-default hover:text-text-primary"
                  >
                    ?
                  </button>
                  <Checkbox label={t('access.drawer.allowLabel')} checked={isAllow} onChange={() => toggleAction(action.key, 'ALLOW')} size="sm" />
                  {action.deniable && (
                    <Checkbox
                      label={t('access.drawer.denyLabel')}
                      checked={isDeny}
                      onChange={() => toggleAction(action.key, 'DENY')}
                      size="sm"
                      className={isDeny ? 'text-state-danger-text' : ''}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <hr className="border-border-subtle" />

        {/* --- RAPORLAR --- */}
        <h3 className="text-sm font-semibold uppercase tracking-wide text-text-subtle">{t('access.drawer.reportsTitle')}</h3>
        <div className="flex flex-col gap-2">
          {(catalog?.reports ?? []).map(report => (
            <div key={report.key} className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface-muted/50 px-4 py-2">
              <Checkbox label={report.label}
                checked={!!reportGrants[report.key]}
                onChange={() => toggleReport(report.key)} size="sm"
                description={report.module} />
              <button
                type="button"
                onClick={() => setExplainTarget({ type: 'REPORT', key: report.key, label: report.label })}
                aria-label={t('access.explainModal.triggerAria', { label: report.label })}
                title={t('access.explainModal.triggerTitle')}
                data-testid={`explain-trigger-report-${report.key}`}
                className="flex h-6 w-6 items-center justify-center rounded-full border border-border-subtle text-xs text-text-subtle hover:bg-surface-default hover:text-text-primary"
              >
                ?
              </button>
            </div>
          ))}
        </div>

        <hr className="border-border-subtle" />

        {/* --- SAYFALAR (only rendered when catalog has pages) --- */}
        {(catalog?.pages ?? []).length > 0 && (
          <>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-text-subtle">{t('access.drawer.pagesTitle')}</h3>
            <div className="flex flex-col gap-2">
              {catalog!.pages.map(page => (
                <Checkbox key={page.key} label={page.label}
                  checked={!!pageGrants[page.key]}
                  onChange={() => togglePage(page.key)} size="sm"
                  description={page.module} />
              ))}
            </div>
            <hr className="border-border-subtle" />
          </>
        )}

        {/* --- ATANMIŞ KİŞİLER --- */}
        <h3 className="text-sm font-semibold uppercase tracking-wide text-text-subtle">
          {t('access.drawer.membersTitle')} ({members.length})
        </h3>
        <div className="flex flex-col gap-2">
          {members.map(member => (
            <div key={member.userId} className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface-muted/50 px-4 py-2">
              <span className="text-sm text-text-primary">Kullanıcı #{member.userId}</span>
              <button type="button" onClick={() => {
                  if (confirm(t('access.notifications.memberRemoveConfirm', { userName: `#${member.userId}` }))) {
                    removeMemberMutation.mutate(member.userId);
                  }
                }}
                className="text-xs text-state-danger-text hover:underline">Kaldır</button>
            </div>
          ))}
          {members.length === 0 && <p className="text-xs text-text-subtle">Henüz atanmış kişi yok.</p>}

          {/* Kişi ekle — P1.7: auto-add on selection, no button.
              Autocomplete.onChange fires on BOTH typing and explicit selection
              (design-system/Autocomplete.tsx:219). `userSearchValue` holds the
              raw input text (every keystroke); `selectedUser` is set only when
              a matched option comes through (explicit dropdown pick). Auto-add
              fires only for matched picks, with duplicate + pending guards. */}
          <div className="flex items-center gap-2 mt-2">
            <Autocomplete
              placeholder={t('access.drawer.userSearchPlaceholder')}
              options={userSearchOptions}
              onSearch={handleUserSearch}
              loading={userSearchLoading || addMemberMutation.isPending}
              value={userSearchValue}
              onChange={(val) => {
                setUserSearchValue(val);
                const matched = userSearchOptions.find(o => o.value === val);
                setSelectedUser(matched ?? null);
                if (!matched) return;                          // typing in progress
                if (addMemberMutation.isPending) return;        // previous add still running
                const userId = Number(matched.value);
                if (members.some(m => m.userId === userId)) {
                  pushToast(
                    'warning',
                    t('access.notifications.memberAlreadyExists', { userName: matched.label }),
                  );
                  setSelectedUser(null);
                  setUserSearchValue('');
                  return;
                }
                addMemberMutation.mutate(userId);
              }}
              allowCustomValue={false}
              fullWidth
            />
          </div>
        </div>

        <hr className="border-border-subtle" />

        {/* --- FOOTER --- */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>{t('access.clone.cancelText')}</Button>
          <Button
            onClick={() => saveGranulesMutation.mutate()}
            loading={saveGranulesMutation.isPending}
            disabled={!dirty}
            access={editAccess}
            accessReason={editAccess !== 'full' ? t('access.drawer.noEditPermission') : undefined}
          >
            {t('common.save')}
          </Button>
        </div>
      </div>

      {/* Faz 4 Explain UX: per-permission "Why?" modal. Portal-based, auto-fetches on open. */}
      {explainTarget && (
        <ExplainPermissionModal
          open={!!explainTarget}
          onClose={() => setExplainTarget(null)}
          userId={currentUserId != null ? String(currentUserId) : null}
          permissionType={explainTarget.type}
          permissionKey={explainTarget.key}
          permissionLabel={explainTarget.label}
          httpPost={explainHttpPost}
          t={t}
        />
      )}
    </DetailDrawer>
  );
};

export default RoleDrawer;
