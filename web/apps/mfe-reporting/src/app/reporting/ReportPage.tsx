import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  getSharedReport,
  getSharedReportExportMode,
} from '@platform/capabilities';
import {
  PageLayout,
  createPageLayoutBreadcrumbItems,
  createPageLayoutPreset,
} from '@mfe/design-system';
import { EntityGridTemplate, buildEntityGridQueryParams } from '../../grid';
import type { GridRequest, GridResponse, ColumnDef } from '../../grid';
import type { ColDef, IServerSideGetRowsParams } from 'ag-grid-community';
import { useReportingI18n } from '../../i18n/useReportingI18n';
import type { ReportModule } from '../../modules/types';
import { buildColDefs, buildDetailRenderer, buildProcessCellCallback } from '@mfe/design-system/advanced/data-grid';
import { getShellServices } from '../services/shell-services';

type ToastType = 'success' | 'error' | 'warning' | 'info';

const showToast = (type: ToastType, text: string) => {
  try {
    window.dispatchEvent(new CustomEvent('app:toast', { detail: { type, text } }));
  } catch {
    const method = type === 'error' ? 'error' : 'log';
    console[method](text);
  }
};

const normalizePermission = (value: string) => value.trim().toUpperCase();

const readCurrentPermissions = (): string[] => {
  try {
    const user = getShellServices().auth.getUser() as { permissions?: unknown } | null;
    if (!user || !Array.isArray(user.permissions)) {
      return [];
    }
    return user.permissions
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .map((item) => normalizePermission(item));
  } catch {
    return [];
  }
};

interface ReportPageProps<TFilters extends Record<string, unknown>, TRow> {
  module: ReportModule<TFilters, TRow>;
}

export function ReportPage<TFilters extends Record<string, unknown>, TRow>({ module }: ReportPageProps<TFilters, TRow>) {
  const { t, ready } = useReportingI18n();
  const location = useLocation();
  const sharedReport = React.useMemo(() => {
    try {
      return getSharedReport(module.sharedReportId);
    } catch {
      // Dynamic reports use synthetic sharedReportId (e.g. 'dynamic:key') not in registry
      return null;
    }
  }, [module.sharedReportId]);
  const exportMode = (() => {
    try { return getSharedReportExportMode(module.sharedReportId, 'web'); }
    catch { return 'client' as const; }
  })();
  const searchParams = React.useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialFiltersFromSearch = React.useMemo(
    () => module.createInitialFilters({ searchParams }),
    [module, searchParams],
  );
  const [filters, setFilters] = React.useState<TFilters>(initialFiltersFromSearch);
  const [reloadSignal, setReloadSignal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);
  const initialFilterSyncRef = React.useRef(true);
  const permissions = React.useMemo(() => readCurrentPermissions(), [location.key, location.pathname]);
  const exportEnabled =
    exportMode !== 'none' &&
    typeof module.exportRows === 'function' &&
    (!sharedReport?.exportPermissionCode ||
      permissions.includes(normalizePermission(sharedReport.exportPermissionCode)));

  React.useEffect(() => {
    if (initialFilterSyncRef.current) {
      initialFilterSyncRef.current = false;
      return;
    }
    setFilters(initialFiltersFromSearch);
    setReloadSignal((value) => value + 1);
  }, [initialFiltersFromSearch]);

  /* ---- Column definitions — metadata-first, fallback to legacy ---- */
  const columns = React.useMemo<ColumnDef<TRow>[]>(() => {
    /* NEW path: declarative metadata → auto-generated ColDef */
    if (module.getColumnMeta) {
      return buildColDefs<TRow>(module.getColumnMeta(), t, 'tr-TR');
    }
    /* LEGACY path: module provides full ColumnDef with manual renderers */
    return module.getColumns(t);
  }, [module, t, ready]);

  const colDefs = React.useMemo<ColDef<TRow>[]>(
    () =>
      columns.map((c) => {
        const colDef: ColDef<TRow> = {
          field: c.field,
          headerName: c.headerName ?? c.field,
          width: c.width,
          minWidth: c.minWidth,
          flex: c.flex ?? undefined,
          filter:
            c.filter !== undefined
              ? c.filter
              : c.filterType === 'number'
                ? 'agNumberColumnFilter'
                : c.filterType === 'date'
                  ? 'agDateColumnFilter'
                  : c.filterType === 'set'
                    ? 'agSetColumnFilter'
                    : 'agTextColumnFilter',
        };
        if (c.sortable !== undefined) colDef.sortable = c.sortable;
        if (c.floatingFilter !== undefined) colDef.floatingFilter = c.floatingFilter;
        if (c.pinned) colDef.pinned = c.pinned;
        if (c.wrapText !== undefined) colDef.wrapText = c.wrapText;
        if (c.autoHeight !== undefined) colDef.autoHeight = c.autoHeight;
        if (c.cellRenderer) colDef.cellRenderer = c.cellRenderer;
        if (c.valueFormatter) colDef.valueFormatter = c.valueFormatter as ColDef<TRow>['valueFormatter'];
        if (c.valueGetter) colDef.valueGetter = c.valueGetter as ColDef<TRow>['valueGetter'];
        if (c.filterParams) colDef.filterParams = c.filterParams;
        if (c.cellClass) colDef.cellClass = c.cellClass;
        return colDef;
      }),
    [columns],
  );

  const createServerSideDatasource = React.useCallback(
    () => ({
      getRows: async (params: IServerSideGetRowsParams) => {
        setLoading(true);
        try {
          const baseParams = buildEntityGridQueryParams({
            request: params.request,
            quickFilterText: (params.request as { quickFilterText?: string }).quickFilterText ?? '',
          });
          const sortModelFromHelper = (baseParams.sort ?? '')
            .split(';')
            .map((s) => {
              const [colId, dir] = s.split(',');
              if (!colId || !dir) return null;
              return { colId, sort: dir as 'asc' | 'desc' };
            })
            .filter(Boolean) as { colId: string; sort: 'asc' | 'desc' }[];

          const req: GridRequest = {
            page: baseParams.page,
            pageSize: baseParams.pageSize,
            sortModel:
              sortModelFromHelper.length > 0
                ? sortModelFromHelper
                : Array.isArray(params.request.sortModel)
                  ? params.request.sortModel.map((s) => ({ colId: s.colId, sort: s.sort }))
                  : undefined,
            filterModel: params.request.filterModel ?? undefined,
            quickFilter: baseParams.search,
            advancedFilter: baseParams.advancedFilter,
          };
          const res: GridResponse<TRow> = await module.fetchRows(filters, req);
          params.success({ rowData: res.rows, rowCount: res.total });
        } catch (error: unknown) {
          params.fail?.();
          const messageText = error instanceof Error ? error.message : 'Veriler yüklenemedi.';
          showToast('error', messageText);
        } finally {
          setLoading(false);
        }
      },
    }),
    [filters, module],
  );

  const breadcrumbItems = createPageLayoutBreadcrumbItems(
    module.breadcrumbKeys.map((item) => ({
      title: t(item.key),
      path: item.to,
    })),
  );
  const pageLayoutPreset = createPageLayoutPreset({
    preset: 'content-only',
    pageWidth: 'full',
  });

  const initialVariantId = searchParams.get('variant') ?? undefined;

  const localeText = React.useMemo(() => {
    const groupPanel = t('shared.grid.groupPanel');
    return {
      rowGroupPanel: groupPanel,
      dropZoneColumnGroup: groupPanel,
      rowGroupColumnsEmptyMessage: groupPanel,
      dragHereToSetColumnRowGroup: groupPanel,
      dragHereToSetRowGroup: groupPanel,
      filters: t('shared.grid.filters'),
      columns: t('shared.grid.columns'),
    } as Record<string, string>;
  }, [t]);

  if (!ready) {
    return (
      <div className="rounded-3xl border border-border-subtle bg-surface-default p-6 shadow-xs">
        <div className="h-4 w-36 animate-pulse rounded-full bg-surface-muted" />
      </div>
    );
  }

  return (
    <div data-testid={`report-page-${module.route}`}>
      <PageLayout
        {...pageLayoutPreset}
        title={t(module.titleKey)}
        description={t(module.descriptionKey)}
        breadcrumbItems={breadcrumbItems}
        fullHeight
        descriptionRevealOnHover
      >
        {module.renderDashboard ? module.renderDashboard(t) : null}

        <EntityGridTemplate<TRow>
          key={reloadSignal}
          gridId={module.id}
          gridSchemaVersion={1}
          initialVariantId={initialVariantId}
          columnDefs={colDefs}
          dataSourceMode="server"
          createServerSideDatasource={() => createServerSideDatasource()}
          detailDrawer={
            module.getColumnMeta
              ? (row) => buildDetailRenderer(module.getColumnMeta!())(row as Record<string, unknown> | null, t)
              : module.renderDetail
                ? (row) => module.renderDetail?.(row, t)
                : undefined
          }
          localeText={localeText}
          quickFilterLabel={t(module.titleKey)}
          quickFilterPlaceholder={t('reports.filters.search.placeholder') || 'Tüm sütunlarda ara...'}
          resetFiltersLabel={t('reports.filters.reset')}
          exportConfig={exportEnabled && typeof module.exportRows === 'function' ? {
            fileBaseName: module.route,
            sheetName: t(module.titleKey),
            ...(module.getColumnMeta ? {
              processCellCallback: buildProcessCellCallback(module.getColumnMeta(), t),
            } : {}),
          } : undefined}
          onServerExport={exportEnabled && typeof module.exportRows === 'function' ? async (format) => {
            setExporting(true);
            try {
              const result = await module.exportRows!(filters, format === 'excel' ? 'csv' : 'csv');
              const objectUrl = window.URL.createObjectURL(result.blob);
              const anchor = document.createElement('a');
              anchor.href = objectUrl;
              anchor.download = result.filename;
              document.body.appendChild(anchor);
              anchor.click();
              document.body.removeChild(anchor);
              window.URL.revokeObjectURL(objectUrl);
              showToast('success', 'Export indirilmeye basladi.');
            } catch (error: unknown) {
              showToast('error', error instanceof Error ? error.message : 'Export baslatilamadi.');
            } finally {
              setExporting(false);
            }
          } : undefined}
        />
      </PageLayout>
    </div>
  );
}
