import React from 'react';
import {
  PageLayout,
  createPageLayoutBreadcrumbItems,
  createPageLayoutPreset,
} from '@mfe/design-system';
import { UserDetail, UserSummary, TelemetryEvent } from '@mfe/shared-types';
import { fetchPageLayout, trackAction, resolveTraceId } from '@mfe/shared-http';
import type { PageLayoutManifest } from '@mfe/shared-types';
import type { GridApi } from 'ag-grid-community';
import { useUserDetailQuery } from '../../features/user-management/model/use-users-query.model';
import UsersGrid from '../../widgets/user-management/ui/UsersGrid.ui';
import UserDetailDrawer from '../../widgets/user-management/ui/UserDetailDrawer.ui';
import { usersPageManifest } from '../../manifest/users/users-page.manifest';
import { useUsersI18n } from '../../i18n/useUsersI18n';

interface UsersPageProps {
  isFullscreen?: boolean;
}

type GridApiWithInternals = GridApi<UserSummary> & {
  getGridOption?: (key: string) => unknown;
  refreshClientSideRowModel?: (step?: string) => void;
  refreshServerSide?: (params?: { purge?: boolean }) => void;
};

const GRID_TEST_ID = 'users-grid-root';

const UsersPage: React.FC<UsersPageProps> = ({ isFullscreen = false }) => {
  const [selectedUserSummary, setSelectedUserSummary] = React.useState<UserSummary | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [pageLayout, setPageLayout] = React.useState<PageLayoutManifest | null>(null);
  const gridApiRef = React.useRef<GridApi<UserSummary> | null>(null);
  const { t } = useUsersI18n();
  React.useEffect(() => {
    // Manifest runtime entegrasyonu: gateway'den PageLayout çek.
    fetchPageLayout('users')
      .then(setPageLayout)
      .catch(() => {
        // Manifest endpoint'e ulaşılamazsa mevcut yerel manifest ile devam et.
        setPageLayout(null);
      });
  }, []);

  const pageBreadcrumbItems = React.useMemo(
    () => createPageLayoutBreadcrumbItems(
      (usersPageManifest.layout.breadcrumbItems ?? []).map((item) => ({
        ...item,
        title: t(item.title as string),
      })),
    ),
    [t],
  );
  const pageLayoutPreset = React.useMemo(
    () => createPageLayoutPreset({ preset: 'content-only', pageWidth: 'full' }),
    [],
  );
  const pageTitle = t((pageLayout?.title ?? usersPageManifest.layout.title) as string);
  const pageDescription = t((pageLayout?.description ?? usersPageManifest.layout.description) as string);

  const { data: selectedUserDetail, isLoading: isDetailLoading } = useUserDetailQuery(
    selectedUserSummary ? { id: selectedUserSummary.id, email: selectedUserSummary.email } : null,
  );
  const mergedUserDetail = React.useMemo(() => {
    if (selectedUserDetail) {
      return selectedUserDetail;
    }
    if (!selectedUserSummary) {
      return null;
    }
    return {
      ...selectedUserSummary,
      modulePermissions: selectedUserSummary.modulePermissions ?? [],
      lastLoginAt: selectedUserSummary.lastLoginAt ?? null,
      createdAt: selectedUserSummary.createdAt ?? null,
      status: selectedUserSummary.status,
      sessionTimeoutMinutes: selectedUserSummary.sessionTimeoutMinutes ?? 15,
      phoneNumber: undefined,
      title: undefined,
      locale: undefined,
      timezone: undefined,
      notes: undefined,
    } as UserDetail;
  }, [selectedUserDetail, selectedUserSummary]);

  const refreshServerData = React.useCallback((api: GridApi<UserSummary> | null | undefined) => {
    if (!api) return;

    const extendedApi = api as GridApiWithInternals;
    const getOption = extendedApi.getGridOption?.bind(api);
    const rowModelType = typeof getOption === 'function' ? getOption('rowModelType') : undefined;

    // ServerSide ise SSRM store'u yenile
    if (rowModelType === 'serverSide') {
      if (typeof api.refreshServerSideStore === 'function') {
        api.refreshServerSideStore({ purge: true });
        return;
      }
      extendedApi.refreshServerSide?.({ purge: true });
      return;
    }

    // ClientSide ise client row model'i tazele
    extendedApi.refreshClientSideRowModel?.('filter');
  }, []);

  const handleRefreshUsers = React.useCallback(() => {
    if (!gridApiRef.current) {
      return;
    }
    const traceId = resolveTraceId() ?? undefined;
    const actionEvent: TelemetryEvent = {
      eventType: 'telemetry',
      eventName: 'action_click',
      timestamp: new Date().toISOString(),
      traceId,
      context: {
        app: 'mfe-users',
        env: (process.env.APP_ENVIRONMENT as TelemetryEvent['context']['env']) || 'local',
        version: process.env.APP_RELEASE || 'dev',
        tags: { actionId: 'users_refresh', route: '/admin/users' },
      },
      payload: { route: '/admin/users' },
    };
    void trackAction(actionEvent);
    setIsLoading(true);
    refreshServerData(gridApiRef.current);
  }, [refreshServerData]);

  const handleCloseDrawer = () => {
    setSelectedUserSummary(null);
  };

  const actionContent = React.useMemo(
    () => (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleRefreshUsers}
          disabled={!gridApiRef.current || isLoading}
          className="rounded-xl bg-action-primary px-4 py-2 text-sm font-semibold text-action-primary-text shadow-xs transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t('users.actions.refresh')}
        </button>
        {isLoading && (
          <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-border-subtle border-t-action-primary" />
        )}
      </div>
    ),
    [handleRefreshUsers, isLoading, t],
  );

  return (
    <>
      {isFullscreen ? (
        <div
          className="flex h-screen w-full flex-col gap-4 bg-surface-default px-4 py-4"
          data-testid={GRID_TEST_ID}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRefreshUsers}
              disabled={!gridApiRef.current || isLoading}
              className="rounded-xl bg-action-primary px-4 py-2 text-sm font-semibold text-action-primary-text shadow-xs transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t('users.actions.refresh')}
            </button>
            {isLoading && (
              <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-border-subtle border-t-action-primary" />
            )}
          </div>
          <UsersGrid
            onSelectUser={setSelectedUserSummary}
            isFullscreen
            onGridReady={(event) => {
              // İlk bağlamada AG Grid zaten SSRM yüklemeyi tetikler; ekstra refresh gereksiz.
              gridApiRef.current = event.api;
            }}
            onLoadingChange={setIsLoading}
          />
        </div>
      ) : (
        <PageLayout
          {...pageLayoutPreset}
          title={pageTitle}
          description={pageDescription}
          breadcrumbItems={pageBreadcrumbItems}
          actions={actionContent}
          contentClassName="!px-0 !py-4"
          classes={{ header: '!px-6 overflow-hidden !rounded-2xl !border !border-border-subtle shadow-sm' }}
        >
          <div
            className="overflow-hidden !rounded-2xl border border-border-subtle bg-surface-default shadow-sm"
            data-testid={GRID_TEST_ID}
          >
            <UsersGrid
              onSelectUser={setSelectedUserSummary}
              onGridReady={(event) => {
                // İlk bağlamada AG Grid zaten SSRM yüklemeyi tetikler; ekstra refresh gereksiz.
                gridApiRef.current = event.api;
              }}
              onLoadingChange={setIsLoading}
            />
          </div>
        </PageLayout>
      )}

      <UserDetailDrawer
        open={Boolean(selectedUserSummary)}
        onClose={handleCloseDrawer}
        user={mergedUserDetail}
      />
      {(isDetailLoading && selectedUserSummary) && (
        <div className="fixed bottom-6 right-6 rounded-full border border-border-subtle bg-surface-default/90 p-3 shadow-lg">
          <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-border-subtle border-t-action-primary" />
        </div>
      )}
    </>
  );
};

export default UsersPage;
