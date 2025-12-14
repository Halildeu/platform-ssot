import React from 'react';
import { useLocation } from 'react-router-dom';
import { PageLayout, ReportFilterPanel } from 'mfe-ui-kit';
import { EntityGridTemplate, buildEntityGridQueryParams } from '../../grid';
import type { GridRequest, GridResponse, ColumnDef } from '../../grid';
import type { ColDef, IServerSideGetRowsParams } from 'ag-grid-community';
import { useReportingI18n } from '../../i18n/useReportingI18n';
import type { ReportModule } from '../../modules/types';

type ToastType = 'success' | 'error' | 'warning' | 'info';

const showToast = (type: ToastType, text: string) => {
  try {
    window.dispatchEvent(new CustomEvent('app:toast', { detail: { type, text } }));
  } catch {
    const method = type === 'error' ? 'error' : 'log';
    console[method](text);
  }
};

interface ReportPageProps<TFilters extends Record<string, unknown>, TRow> {
  module: ReportModule<TFilters, TRow>;
}

export function ReportPage<TFilters extends Record<string, unknown>, TRow>({ module }: ReportPageProps<TFilters, TRow>) {
  const { t, ready } = useReportingI18n();
  const location = useLocation();
  const searchParams = React.useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialFiltersFromSearch = React.useMemo(
    () => module.createInitialFilters({ searchParams }),
    [module, searchParams],
  );
  const [filters, setFilters] = React.useState<TFilters>(initialFiltersFromSearch);
  const [reloadSignal, setReloadSignal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const initialFilterSyncRef = React.useRef(true);

  React.useEffect(() => {
    if (initialFilterSyncRef.current) {
      initialFilterSyncRef.current = false;
      return;
    }
    setFilters(initialFiltersFromSearch);
    setReloadSignal((value) => value + 1);
  }, [initialFiltersFromSearch]);

  const handleSubmit = React.useCallback(() => {
    setReloadSignal((value) => value + 1);
  }, []);

  const handleReset = React.useCallback(() => {
    const defaults = module.createInitialFilters({ searchParams });
    setFilters(defaults);
    setReloadSignal((value) => value + 1);
  }, [module, searchParams]);

  const setFilterFieldValue = React.useCallback(
    <K extends keyof TFilters>(key: K, value: TFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const columns = React.useMemo<ColumnDef[]>(() => module.getColumns(t), [module, t]);
  const colDefs = React.useMemo<ColDef<TRow>[]>(
    () =>
      columns.map((c) => ({
        field: c.field,
        headerName: c.headerName ?? c.field,
        width: c.width,
        flex: c.flex ?? undefined,
        filter:
          c.filterType === 'number'
            ? 'agNumberColumnFilter'
            : c.filterType === 'date'
              ? 'agDateColumnFilter'
              : c.filterType === 'set'
                ? 'agSetColumnFilter'
                : 'agTextColumnFilter',
      })),
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
        } catch (error) {
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

  const breadcrumbItems = module.breadcrumbKeys.map((item) => ({
    title: t(item.key),
    path: item.to,
  }));

  const initialVariantId = searchParams.get('variant') ?? undefined;

  if (!ready) {
    return (
      <div className="rounded-3xl border border-border-subtle bg-surface-default p-6 shadow-sm">
        <div className="h-4 w-36 animate-pulse rounded-full bg-surface-muted" />
      </div>
    );
  }

  return (
    <PageLayout
      title={t(module.titleKey)}
      description={t(module.descriptionKey)}
      breadcrumbItems={breadcrumbItems}
      actions={(
        <button
          type="button"
          onClick={() => setReloadSignal((value) => value + 1)}
          className="rounded-xl border border-border-subtle px-4 py-2 text-sm font-semibold text-text-secondary transition hover:bg-surface-muted"
        >
          {t('reports.toolbar.refresh')}
        </button>
      )}
      fullHeight
      descriptionRevealOnHover
    >
      <div className="rounded-3xl border border-border-subtle bg-surface-default p-6 shadow-sm">
        <ReportFilterPanel
          loading={loading}
          onSubmit={handleSubmit}
          onReset={handleReset}
          submitLabel={t('reports.filters.apply')}
          resetLabel={t('reports.filters.reset')}
        >
          {module.renderFilters({
            values: filters,
            setFieldValue: setFilterFieldValue,
            submit: handleSubmit,
            t,
          })}
        </ReportFilterPanel>

        <EntityGridTemplate<TRow>
          key={reloadSignal}
          gridId={module.id}
          gridSchemaVersion={1}
          initialVariantId={initialVariantId}
          columnDefs={colDefs}
          dataSourceMode="server"
          createServerSideDatasource={() => createServerSideDatasource()}
          toolbarExtras={(
            <button
              type="button"
              disabled
              className="rounded-xl border border-border-subtle px-4 py-2 text-sm font-semibold text-text-subtle"
            >
              {t('reports.toolbar.exportCsv')}
            </button>
          )}
        />
      </div>
    </PageLayout>
  );
}
