import React, { useCallback, useMemo, useState, useEffect } from 'react';
import type {
  ColDef,
  GridReadyEvent,
  IServerSideGetRowsParams,
  GridOptions,
  ProcessCellForExportParams,
  AdvancedFilterModel as AgAdvancedFilterModel,
  ColumnApi,
} from 'ag-grid-community';
import type { GridExportConfig } from 'mfe_reporting/grid';
import { buildEntityGridQueryParams } from 'mfe_reporting/grid';
// Ağır AG Grid bağımlılıklarını ilk ekranda yüklememek için lazy-load
const EntityGridTemplate = React.lazy(() =>
  import('mfe_reporting/grid').then((m) => ({ default: m.EntityGridTemplate })),
);
import type { UserSummary, UserModuleAccessLevel } from '@mfe/shared-types';
import { Badge, type BadgeTone } from 'mfe-ui-kit';
import UserActions from './UserActions.ui';
import { fetchUsers } from '../../../entities/user/api/users.api';
import type { UsersQueryParams } from '../../../features/user-management/model/user-management.types';
import { useUsersI18n } from '../../../i18n/useUsersI18n';

declare global {
  interface Window {
    usersGridApi?: GridApi<UserSummary>;
    usersColumnApi?: ColumnApi<UserSummary>;
  }
}

type ToastType = 'success' | 'error' | 'warning';

const showToast = (type: ToastType, text: string) => {
  try {
    window.dispatchEvent(new CustomEvent('app:toast', { detail: { type, text } }));
  } catch {
    if (process.env.NODE_ENV !== 'production') {
      const fallback = type === 'error' ? 'error' : 'log';
      console[fallback](text);
    }
  }
};

const MODULE_LEVEL_LABELS: Record<UserModuleAccessLevel, string> = {
  NONE: 'users.filters.moduleLevel.none',
  VIEW: 'users.filters.moduleLevel.view',
  EDIT: 'users.filters.moduleLevel.edit',
  MANAGE: 'users.filters.moduleLevel.manage',
};

const MODULE_LEVEL_COLORS: Record<UserModuleAccessLevel, BadgeTone> = {
  NONE: 'muted',
  VIEW: 'info',
  EDIT: 'warning',
  MANAGE: 'danger',
};

const SERVER_CACHE_BLOCK_SIZE = 50;

const GRID_VARIANT_ID = 'mfe-users/users-grid';
const GRID_VARIANT_SCHEMA_VERSION = 1;

type GridApiWithOptions = GridApi<UserSummary> & {
  getGridOption?: (key: string) => unknown;
  setGridOption?: (key: string, value: unknown) => void;
  refreshServerSide?: (params?: { purge?: boolean }) => void;
};

type AdvancedJoinNode = {
  filterType: 'join';
  type?: 'AND' | 'OR';
  conditions?: AgAdvancedFilterModel[];
};

type AdvancedConditionNode = {
  colId?: string;
  type?: string;
  filter?: unknown;
  filterTo?: unknown;
};

type ServerSideRequestExtras = IServerSideGetRowsParams<UserSummary>['request'] & {
  advancedFilterModel?: AgAdvancedFilterModel | null;
  sortModel?: Array<{ colId?: string; sort?: 'asc' | 'desc' }>;
};

type ServerSideParamsWithCallbacks = IServerSideGetRowsParams<UserSummary> & {
  success?: (payload: { rowData: UserSummary[]; rowCount: number }) => void;
  successCallback?: (rowData: UserSummary[], rowCount: number) => void;
  fail?: () => void;
  failCallback?: () => void;
};

const isJoinNode = (node: AgAdvancedFilterModel | null | undefined): node is AdvancedJoinNode => {
  if (!node || typeof node !== 'object') {
    return false;
  }
  return (node as { filterType?: string }).filterType === 'join';
};

interface UsersGridProps {
  onSelectUser: (user: UserSummary) => void;
  isFullscreen?: boolean;
  onGridReady?: (event: GridReadyEvent<UserSummary>) => void;
  onLoadingChange?: (loading: boolean) => void;
}

const UsersGrid: React.FC<UsersGridProps> = ({
  onSelectUser,
  isFullscreen = false,
  onGridReady: onGridReadyProp,
  onLoadingChange,
}) => {
  const { t, locale } = useUsersI18n();
  const [dataSourceMode, setDataSourceMode] = useState<'server' | 'client'>('server');
  const [clientRows, setClientRows] = useState<UserSummary[]>([]);
  const debugLog = useCallback(
    (...args: unknown[]) => {
      if (process.env.NODE_ENV !== 'production') {
        console.debug('[UsersGrid]', ...args);
      }
    },
    [],
  );
  const formatModulePermissions = useCallback(
    (permissions?: UserSummary['modulePermissions']) => {
      if (!permissions?.length) {
        return '';
      }
      return permissions
        .map((permission) => {
          const levelKey = MODULE_LEVEL_LABELS[permission.level];
          const levelLabel = levelKey ? t(levelKey) : permission.level;
          return `${permission.moduleLabel ?? permission.moduleKey} (${levelLabel})`;
        })
        .join(', ');
    },
    [t, locale],
  );

  const columnDefs = useMemo<ColDef<UserSummary>[]>(() => [
    {
      headerName: t('users.grid.columns.fullName'),
      field: 'fullName',
      minWidth: 180,
      filter: 'agTextColumnFilter',
      cellRenderer: ({ data }) => (
        <span className="font-semibold text-text-primary">{data?.fullName ?? '-'}</span>
      ),
    },
    {
      headerName: t('users.grid.columns.email'),
      field: 'email',
      minWidth: 220,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: t('users.grid.columns.role'),
      field: 'role',
      width: 140,
      filter: 'agSetColumnFilter',
      filterParams: {
        // SSRM'de değer listesini stabil tutmak için olası rollerin tamamını sağlayın
        values: ['ADMIN', 'USER'],
        valueFormatter: ({ value }: { value: unknown }) => {
          if (typeof value !== 'string') return String(value ?? '');
          const upper = value.toUpperCase();
          if (upper === 'USER') return t('users.filters.role.user');
          if (upper === 'ADMIN') return t('users.filters.role.admin');
          return value;
        },
        suppressSyncValuesAfterDataChange: true,
      },
      valueFormatter: ({ value }) => {
        if (typeof value !== 'string') return value;
        const upper = value.toUpperCase();
        if (upper === 'USER') return t('users.filters.role.user');
        if (upper === 'ADMIN') return t('users.filters.role.admin');
        return value;
      },
      cellRenderer: ({ value }) => {
        const formatted =
          typeof value === 'string' && value.toUpperCase() === 'USER'
            ? t('users.filters.role.user')
            : value;
        const tone = typeof value === 'string' && value.toUpperCase() === 'ADMIN' ? 'danger' : 'info';
        return <Badge tone={tone}>{formatted}</Badge>;
      },
    },
    {
      headerName: t('users.grid.columns.status'),
      field: 'status',
      width: 140,
      filter: 'agSetColumnFilter',
      filterParams: {
        values: ['ACTIVE', 'INACTIVE', 'INVITED', 'SUSPENDED'],
        suppressSyncValuesAfterDataChange: true,
      },
      cellRenderer: ({ value }) => {
        const colorMap: Record<string, string> = {
          ACTIVE: 'success',
          INACTIVE: 'muted',
          INVITED: 'warning',
          SUSPENDED: 'danger',
        };
        return <Badge tone={colorMap[value] ?? 'default'}>{value}</Badge>;
      },
    },
    {
      headerName: t('users.grid.columns.sessionTimeoutMinutes'),
      field: 'sessionTimeoutMinutes',
      width: 160,
      filter: 'agNumberColumnFilter',
      valueFormatter: ({ value }) => {
        if (typeof value === 'number' && Number.isFinite(value)) {
          return `${value} dk`;
        }
        return '-';
      },
    },
    {
      headerName: t('users.grid.columns.modulePermissions'),
      field: 'modulePermissions',
      minWidth: 240,
      filter: 'agTextColumnFilter',
      wrapText: true,
      autoHeight: false,
      valueGetter: ({ data }) => formatModulePermissions(data?.modulePermissions),
      cellRenderer: ({ data }) => {
        if (!data?.modulePermissions?.length) {
          return <span className="text-sm text-text-subtle">{t('users.filters.moduleLevel.none')}</span>;
        }
        return (
          <div className="flex flex-wrap gap-2">
            {data.modulePermissions.map((permission) => {
              const levelLabel = MODULE_LEVEL_LABELS[permission.level] ?? permission.level;
              const levelColor = MODULE_LEVEL_COLORS[permission.level] ?? 'default';
              return (
                <Badge
                  key={`${permission.moduleKey}-${permission.level}`}
                  tone={levelColor}
                  title={`Modül: ${permission.moduleLabel ?? permission.moduleKey}`}
                >
                  {permission.moduleLabel ?? permission.moduleKey} - {levelLabel}
                </Badge>
              );
            })}
          </div>
        );
      },
    },
    {
      headerName: t('users.grid.columns.lastLoginAt'),
      field: 'lastLoginAt',
      width: 180,
      filter: 'agDateColumnFilter',
      filterValueGetter: ({ data }) => (data?.lastLoginAt ? new Date(data.lastLoginAt).getTime() : null),
      cellRenderer: ({ value }) => {
        if (!value) {
          return t('shell.header.neverLoggedIn');
        }
        try {
          const date = new Date(value);
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
          return String(value);
        }
      },
    },
    {
      headerName: t('users.grid.columns.actions'),
      field: 'id',
      width: 120,
      sortable: false,
      filter: false,
      floatingFilter: false,
      cellRenderer: ({ data }) =>
        data ? <UserActions user={data} onSelect={() => onSelectUser(data)} /> : null,
      pinned: 'right',
    },
  ], [formatModulePermissions, onSelectUser, t, locale]);

  const gridOptions = useMemo<GridOptions<UserSummary>>(
    () => ({
      cellSelection: true,
      multiSortKey: 'ctrl',
      rowGroupPanelShow: 'always',
      // AG Grid v34: cacheBlockSize sadece serverSide row modelde geçerli
      ...(dataSourceMode === 'server'
        ? { cacheBlockSize: SERVER_CACHE_BLOCK_SIZE, maxBlocksInCache: 1, blockLoadDebounceMillis: 25 }
        : {}),
    }),
    [dataSourceMode],
  );

  const exportConfig = useMemo<GridExportConfig<UserSummary>>(
    () => ({
      fileBaseName: 'kullanicilar',
      sheetName: 'Kullanıcılar',
      processCellCallback: (params: ProcessCellForExportParams<UserSummary>) => {
        if (params.column?.getColId() === 'modulePermissions') {
          return formatModulePermissions(params.node?.data?.modulePermissions);
        }
        return params.value;
      },
      csvColumnSeparator: ';',
      csvBom: true,
    }),
    [formatModulePermissions],
  );

  const localeText = useMemo(() => {
    // Tüm diller için gelişmiş filtre ve yan panel metinlerini i18n üzerinden veriyoruz
    const groupText = t('users.grid.locale.groupPanel');
    const valueText = t('users.grid.locale.valuePanel');
    return {
      // Grup paneli
      rowGroupPanel: groupText,
      dropZoneColumnGroup: groupText,
      rowGroupColumnsEmptyMessage: groupText,
      dragHereToSetColumnRowGroup: groupText,
      dragHereToSetRowGroup: groupText,
      dropZoneColumnValue: valueText,
      // Yan panel başlıkları
      filters: t('users.grid.locale.filters'),
      columns: t('users.grid.locale.columns'),
      // Gelişmiş filtre
      advancedFilter: t('users.grid.locale.advancedFilter'),
      advancedFilterBuilder: t('users.grid.locale.advancedFilterBuilder'),
      advancedFilterButtonTooltip: t('users.grid.locale.advancedFilterButtonTooltip'),
      advancedFilterBuilderAdd: t('users.grid.locale.advancedFilterBuilderAdd'),
      advancedFilterBuilderRemove: t('users.grid.locale.advancedFilterBuilderRemove'),
      advancedFilterJoinOperator: t('users.grid.locale.advancedFilterJoinOperator'),
      advancedFilterAnd: t('users.grid.locale.advancedFilterAnd'),
      advancedFilterOr: t('users.grid.locale.advancedFilterOr'),
      advancedFilterValidationMissingColumn: t('users.grid.locale.advancedFilterValidationMissingColumn'),
      advancedFilterValidationMissingOption: t('users.grid.locale.advancedFilterValidationMissingOption'),
      advancedFilterValidationMissingValue: t('users.grid.locale.advancedFilterValidationMissingValue'),
      advancedFilterApply: t('users.grid.locale.advancedFilterApply'),
    } as Record<string, string>;
  }, [t]);

  const mapAdvancedFilterModel = useCallback(
    (model: AgAdvancedFilterModel | null | undefined) => {
      if (!model) return null;

      const fieldMap: Record<string, string> = {
        fullName: 'name',
        email: 'email',
        role: 'role',
        lastLoginAt: 'lastLogin',
        sessionTimeoutMinutes: 'sessionTimeoutMinutes',
      };

      type BackendOp =
        | 'equals'
        | 'notEqual'
        | 'contains'
        | 'notContains'
        | 'lessThan'
        | 'greaterThan'
        | 'inRange';

      const mapOp = (type: string | undefined): BackendOp | null => {
        switch (type) {
          case 'equals':
          case 'notEqual':
          case 'contains':
          case 'notContains':
          case 'lessThan':
          case 'greaterThan':
          case 'inRange':
            return type;
          case 'lessThanOrEqual':
            return 'lessThan';
          case 'greaterThanOrEqual':
            return 'greaterThan';
          default:
            return null;
        }
      };

      const conditions: { field: string; op: BackendOp; value?: unknown; value2?: unknown }[] = [];

      const visit = (node: AgAdvancedFilterModel | null | undefined) => {
        if (!node) return;
        if (isJoinNode(node)) {
          (node.conditions ?? []).forEach((child) => visit(child));
          return;
        }
        const conditionNode = node as AdvancedConditionNode;
        const colId = conditionNode.colId;
        if (!colId) return;
        const backendField = fieldMap[colId];
        if (!backendField) return;
        const op = mapOp(conditionNode.type);
        if (!op) return;
        const value = conditionNode.filter;
        const value2 = conditionNode.filterTo;
        const condition: { field: string; op: BackendOp; value?: unknown; value2?: unknown } = {
          field: backendField,
          op,
        };
        if (value !== undefined) {
          condition.value = value;
        }
        if (op === 'inRange' && value2 !== undefined) {
          condition.value2 = value2;
        }
        conditions.push(condition);
      };

      visit(model);

      if (conditions.length === 0) {
        return null;
      }

      const logic = isJoinNode(model) && model.type === 'OR' ? 'or' : 'and';

      return {
        logic,
        conditions,
      };
    },
    [],
  );

  const createServerSideDatasource = useCallback(
    ({ gridApi }: { gridApi: GridApi<UserSummary> }) => {
      // Aynı aralık/sort/filter için eşzamanlı çağrıları tek backend isteğine indirger
      const inFlight = new Map<string, IServerSideGetRowsParams<UserSummary>[]>();
      const buildKey = (req: IServerSideGetRowsParams<UserSummary>['request']) =>
        JSON.stringify({ s: req.startRow, e: req.endRow, f: req.filterModel ?? {}, o: req.sortModel ?? [] });

      const ssrmSuccessFor = (p: IServerSideGetRowsParams<UserSummary>, items: UserSummary[], total: number) => {
        const paramsWithCallbacks = p as ServerSideParamsWithCallbacks;
        if (typeof paramsWithCallbacks.success === 'function') {
          paramsWithCallbacks.success({ rowData: items, rowCount: total });
          return;
        }
        if (typeof paramsWithCallbacks.successCallback === 'function') {
          paramsWithCallbacks.successCallback(items, total);
          return;
        }
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[UsersGrid] SSRM success handler not found');
        }
      };
      const ssrmFailFor = (p: IServerSideGetRowsParams<UserSummary>) => {
        const paramsWithCallbacks = p as ServerSideParamsWithCallbacks;
        if (typeof paramsWithCallbacks.fail === 'function') {
          paramsWithCallbacks.fail();
          return;
        }
        if (typeof paramsWithCallbacks.failCallback === 'function') {
          paramsWithCallbacks.failCallback();
          return;
        }
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[UsersGrid] SSRM fail handler not found');
        }
      };

      return {
        getRows: async (params: IServerSideGetRowsParams<UserSummary>) => {
          const requestedBlockSize = params.request.endRow - params.request.startRow;
          const effectiveBlockSize = Number.isFinite(requestedBlockSize) && requestedBlockSize > 0
            ? requestedBlockSize
            : SERVER_CACHE_BLOCK_SIZE;
          const startRow = params.request.startRow ?? 0;
          const pageNumber = Math.floor(startRow / effectiveBlockSize) + 1;
          const requestLabel = `${pageNumber}:${effectiveBlockSize}:${startRow}-${params.request.endRow ?? startRow + effectiveBlockSize}`;

          const key = buildKey(params.request);
          if (inFlight.has(key)) {
            inFlight.get(key)!.push(params);
            if (process.env.NODE_ENV !== 'production') {
              console.debug('[UsersGrid] server:getRows:coalesced', requestLabel);
            }
            return;
          }
          inFlight.set(key, [params]);

          // Quick filter metnini grid options'tan çek (SSRM global arama desteği)
          const apiWithOptions = gridApi as GridApiWithOptions;
          const quickFilterText = typeof apiWithOptions.getGridOption === 'function'
            ? apiWithOptions.getGridOption('quickFilterText') ?? ''
            : '';

          debugLog('server:getRows:start', requestLabel, {
            request: params.request,
            effectiveBlockSize,
            pageNumber,
            quickFilterText,
          });
          onLoadingChange?.(true);
          try {
            const requestExtras = params.request as ServerSideRequestExtras;
            const agAdvancedFilterModel = requestExtras.advancedFilterModel ?? null;

            const baseParams = buildEntityGridQueryParams({
              request: params.request,
              quickFilterText,
              mapAdvancedFilter: mapAdvancedFilterModel,
              mapFilterModel: (model) => {
                const next: Partial<UsersQueryParams> = {};
                const statusFilter = (model as typeof params.request.filterModel).status as { values?: unknown[] } | undefined;
                if (statusFilter?.values && statusFilter.values.length > 0) {
                  next.status = String(statusFilter.values[0]) as UsersQueryParams['status'];
                }
                const roleFilter = (model as typeof params.request.filterModel).role as { values?: unknown[] } | undefined;
                if (roleFilter?.values && roleFilter.values.length > 0) {
                  next.role = String(roleFilter.values[0]) as UsersQueryParams['role'];
                }
                const nameFilter = (model as typeof params.request.filterModel).fullName as { filter?: unknown } | undefined;
                const emailFilter = (model as typeof params.request.filterModel).email as { filter?: unknown } | undefined;
                const textFilterValue = nameFilter?.filter ?? emailFilter?.filter;
                if (typeof textFilterValue === 'string' && textFilterValue.trim().length > 0) {
                  next.search = textFilterValue.trim();
                }
                return next;
              },
            }) as UsersQueryParams;

            // Helper sort/advanced/search hesaplamalarını yaptı; domain ekleri yoksa temizle
            // Advanced filter modelini encode edemedi ise fallback
            if (baseParams.advancedFilter === undefined && agAdvancedFilterModel) {
              const backendAdvancedFilter = mapAdvancedFilterModel(agAdvancedFilterModel);
              if (backendAdvancedFilter) {
                try {
                  baseParams.advancedFilter = encodeURIComponent(JSON.stringify(backendAdvancedFilter));
                } catch (encodeError) {
                  debugLog('server:getRows:advancedFilterEncodeError', encodeError);
                }
              }
            }

            const response = await fetchUsers(baseParams);
            const reason = response.meta?.reason;
            if (reason === 'unauthorized') {
              debugLog('server:getRows:unauthorized', requestLabel, { queryParams: baseParams });
              showToast('warning', 'Kullanıcı verilerini görmek için yetkiniz bulunmuyor.');
              const batch = inFlight.get(key) ?? [];
              batch.forEach((p) => ssrmSuccessFor(p, [], 0));
              return;
            }
            if (reason === 'network-error') {
              debugLog('server:getRows:network-error', requestLabel, { queryParams: baseParams });
              showToast('error', 'Kullanıcı listesi alınamadı. Lütfen bağlantınızı kontrol edin.');
              const batch = inFlight.get(key) ?? [];
              batch.forEach((p) => ssrmFailFor(p));
              return;
            }
            const items = response.items ?? [];
            const total = response.total ?? items.length;
            debugLog('server:getRows:success', requestLabel, {
              queryParams: baseParams,
              returnedItems: items.length,
              total,
            });
            const batch = inFlight.get(key) ?? [];
            batch.forEach((p) => ssrmSuccessFor(p, items, total));
          } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
              console.error('Kullanıcılar yüklenirken hata oluştu', error);
            }
            debugLog('server:getRows:error', requestLabel, error);
            showToast('error', error instanceof Error ? error.message : 'Kullanıcılar yüklenirken hata oluştu.');
            const batch = inFlight.get(key) ?? [];
            batch.forEach((p) => ssrmFailFor(p));
          } finally {
            onLoadingChange?.(false);
            inFlight.delete(key);
            debugLog('server:getRows:complete', requestLabel);
          }
        },
      };
    },
    [debugLog, onLoadingChange],
  );

  const handleGridReady = useCallback(
    (event: GridReadyEvent<UserSummary>) => {
      // Runtime debug: grid API'yi pencereden erişilebilir yap
      try {
        window.usersGridApi = event.api;
        window.usersColumnApi = event.columnApi;
        const apiWithOptions = event.api as GridApiWithOptions;
        debugLog('gridReady', {
          serverMode: dataSourceMode === 'server',
          hasSetServerSideDatasource: typeof apiWithOptions.setGridOption === 'function',
          rowModelType: apiWithOptions.getGridOption?.('rowModelType'),
        });
      } catch {
        // no-op: debug için pencere ataması başarısız olabilir
      }
      onGridReadyProp?.(event);
    },
    [onGridReadyProp, debugLog, dataSourceMode],
  );

  const loadClientData = useCallback(async () => {
    onLoadingChange?.(true);
    try {
      // Client modda tüm kullanıcıları çekmek için limitsiz çağrı yapıyoruz (pageSize=0 -> backend unpaged)
      const response = await fetchUsers({ page: 1, pageSize: 0 });
      if (response.meta?.reason === 'unauthorized') {
        showToast('warning', 'Kullanıcı verilerine erişim yetkisi bulunmuyor.');
      }
      if (response.meta?.reason === 'network-error') {
        showToast('error', 'Kullanıcı verileri sunucudan alınamadı.');
      }
      setClientRows(response.items ?? []);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Kullanıcılar yüklenirken hata oluştu (client mode)', error);
      }
      showToast('error', error instanceof Error ? error.message : 'Kullanıcı verileri yüklenemedi.');
    } finally {
      onLoadingChange?.(false);
    }
  }, [onLoadingChange]);

  useEffect(() => {
    if (dataSourceMode === 'client') {
      loadClientData();
    }
  }, [dataSourceMode, loadClientData]);

  const modeSelector = useMemo(
    () => (
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <span className="font-semibold text-text-primary">{t('users.grid.mode.label')}</span>
        <select
          className="rounded-xl border border-border-subtle bg-surface-default px-3 py-1 text-sm font-medium text-text-secondary shadow-sm focus:outline-none focus:ring-2 focus:ring-selection-outline"
          value={dataSourceMode}
          onChange={(event) => setDataSourceMode(event.target.value as 'server' | 'client')}
        >
          <option value="server">{t('users.grid.mode.server')}</option>
          <option value="client">{t('users.grid.mode.client')}</option>
        </select>
      </div>
    ),
    [dataSourceMode, t],
  );

  const handleStreamingCsv = useCallback(() => {
    // Backend streaming export: tüm kayıtları CSV olarak indirir
    const url = '/api/users/export.csv';
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const toolbarExtrasWithExport = useMemo(
    () => (
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-action-primary bg-action-primary px-3 py-2 text-sm font-semibold text-action-primary-text shadow-sm hover:bg-action-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-selection-outline focus-visible:ring-offset-1 disabled:opacity-60"
          onClick={handleStreamingCsv}
          title="Streaming CSV (Tüm Kayıt) — sunucudan limitsiz indirme"
        >
          Streaming CSV (Tüm Kayıt)
        </button>
        {modeSelector}
      </div>
    ),
    [handleStreamingCsv, modeSelector],
  );

  const handleRequestFullscreen = useCallback(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const root = document.documentElement;
    if (!document.fullscreenElement) {
      root.requestFullscreen?.().catch(() => {
        // noop
      });
    } else {
      document.exitFullscreen?.().catch(() => {
        // noop
      });
    }
  }, []);

  return (
    <React.Suspense fallback={<div style={{ height: 320 }} />}>
      <EntityGridTemplate<UserSummary>
        gridId={GRID_VARIANT_ID}
      gridSchemaVersion={GRID_VARIANT_SCHEMA_VERSION}
      columnDefs={columnDefs}
      gridOptions={gridOptions}
      exportConfig={exportConfig}
      onRowDoubleClick={onSelectUser}
      isFullscreen={isFullscreen}
      onRequestFullscreen={handleRequestFullscreen}
      dataSourceMode={dataSourceMode}
      rowData={dataSourceMode === 'client' ? clientRows : undefined}
      total={dataSourceMode === 'client' ? clientRows.length : undefined}
      createServerSideDatasource={dataSourceMode === 'server' ? createServerSideDatasource : undefined}
      onGridReady={handleGridReady}
      toolbarExtras={toolbarExtrasWithExport}
      themeLabel={t('users.grid.themeLabel')}
      quickFilterLabel={t('users.grid.quickFilterLabel')}
      variantLabel={t('users.grid.variantLabel')}
      quickFilterPlaceholder={t('users.grid.quickFilterPlaceholder')}
      fullscreenTooltip={t('users.grid.fullscreenTooltip')}
      resetFiltersLabel={t('users.grid.toolbar.resetFilters')}
      excelVisibleLabel={t('users.grid.toolbar.excelVisible')}
      excelAllLabel={t('users.grid.toolbar.excelAll')}
      csvVisibleLabel={t('users.grid.toolbar.csvVisible')}
      csvAllLabel={t('users.grid.toolbar.csvAll')}
        localeText={localeText}
      />
    </React.Suspense>
  );
};

export default UsersGrid;
