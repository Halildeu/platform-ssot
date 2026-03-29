import React from 'react';
import {
  PageLayout,
  ReportFilterPanel,
  createPageLayoutBreadcrumbItems,
  createPageLayoutPreset,
} from '@mfe/design-system';
import { EntityGridTemplate, buildEntityGridQueryParams } from '../../grid';
import type { GridRequest, GridResponse } from '../../grid';
import type { ColDef, IServerSideGetRowsParams } from 'ag-grid-community';
import type { ReportModule } from '../types';
import { fetchReportMetadata } from './api';
import type { DynamicReportFilters, DynamicReportRow, ReportColumnMeta } from './types';

type ToastType = 'success' | 'error' | 'warning' | 'info';

const showToast = (type: ToastType, text: string) => {
  try {
    window.dispatchEvent(new CustomEvent('app:toast', { detail: { type, text } }));
  } catch {
    const method = type === 'error' ? 'error' : 'log';
    console[method](text);
  }
};

const mapColumnType = (type: string): string => {
  switch (type) {
    case 'number':
      return 'agNumberColumnFilter';
    case 'date':
      return 'agDateColumnFilter';
    default:
      return 'agTextColumnFilter';
  }
};

interface DynamicReportPageProps {
  module: ReportModule<DynamicReportFilters, DynamicReportRow>;
  reportKey: string;
}

export const DynamicReportPage: React.FC<DynamicReportPageProps> = ({ module, reportKey }) => {
  const [filters, setFilters] = React.useState<DynamicReportFilters>(() =>
    module.createInitialFilters(),
  );
  const [reloadSignal, setReloadSignal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);
  const [columnMeta, setColumnMeta] = React.useState<ReportColumnMeta[]>([]);
  const [metaLoading, setMetaLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    setMetaLoading(true);
    fetchReportMetadata(reportKey)
      .then((meta) => {
        if (active) {
          setColumnMeta(meta.columns);
        }
      })
      .catch((err) => {
        if (active) {
          console.warn('[dynamic-report] metadata fetch failed:', err);
        }
      })
      .finally(() => {
        if (active) {
          setMetaLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [reportKey]);

  const handleSubmit = React.useCallback(() => {
    setReloadSignal((v) => v + 1);
  }, []);

  const handleReset = React.useCallback(() => {
    setFilters(module.createInitialFilters());
    setReloadSignal((v) => v + 1);
  }, [module]);

  const setFilterFieldValue = React.useCallback(
    <K extends keyof DynamicReportFilters>(key: K, value: DynamicReportFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const colDefs = React.useMemo<ColDef[]>(
    () =>
      columnMeta.map((col) => ({
        field: col.field,
        headerName: col.headerName,
        width: col.width,
        filter: mapColumnType(col.type),
      })),
    [columnMeta],
  );

  const createServerSideDatasource = React.useCallback(
    () => ({
      getRows: async (params: IServerSideGetRowsParams) => {
        setLoading(true);
        try {
          const baseParams = buildEntityGridQueryParams({
            request: params.request,
            quickFilterText:
              (params.request as { quickFilterText?: string }).quickFilterText ?? '',
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
            filterModel: (params.request.filterModel as Record<string, unknown>) ?? undefined,
            quickFilter: baseParams.search,
            advancedFilter: baseParams.advancedFilter,
          };
          const res: GridResponse<DynamicReportRow> = await module.fetchRows(filters, req);
          params.success({ rowData: res.rows, rowCount: res.total });
        } catch (error: unknown) {
          params.fail?.();
          const messageText =
            error instanceof Error ? error.message : 'Veriler yüklenemedi.';
          showToast('error', messageText);
        } finally {
          setLoading(false);
        }
      },
    }),
    [filters, module],
  );

  const handleExport = React.useCallback(async () => {
    if (typeof module.exportRows !== 'function') return;
    setExporting(true);
    try {
      const result = await module.exportRows(filters, 'csv');
      const objectUrl = window.URL.createObjectURL(result.blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = result.filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(objectUrl);
      showToast('success', 'Export indirilmeye başladı.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Export başlatılamadı.';
      showToast('error', message);
    } finally {
      setExporting(false);
    }
  }, [filters, module]);

  const breadcrumbItems = createPageLayoutBreadcrumbItems(
    module.breadcrumbKeys.map((item) => ({
      title: item.key,
      path: item.to,
    })),
  );

  const pageLayoutPreset = createPageLayoutPreset({
    preset: 'content-only',
    pageWidth: 'full',
  });

  if (metaLoading) {
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
        title={module.titleKey}
        description={module.descriptionKey}
        breadcrumbItems={breadcrumbItems}
        actions={
          <button
            type="button"
            onClick={() => setReloadSignal((v) => v + 1)}
            className="rounded-xl border border-border-subtle px-4 py-2 text-sm font-semibold text-text-secondary transition hover:bg-surface-muted"
          >
            Yenile
          </button>
        }
      >
        <div className="rounded-3xl border border-border-subtle bg-surface-default p-6 shadow-xs">
          <ReportFilterPanel
            loading={loading}
            onSubmit={handleSubmit}
            onReset={handleReset}
            submitLabel="Filtreleri uygula"
            resetLabel="Sıfırla"
            testId="report-filter-panel"
            submitTestId="report-filter-submit"
            resetTestId="report-filter-reset"
          >
            {module.renderFilters({
              values: filters,
              setFieldValue: setFilterFieldValue,
              submit: handleSubmit,
              t: (key: string) => key,
            })}
          </ReportFilterPanel>

          <EntityGridTemplate<DynamicReportRow>
            key={reloadSignal}
            gridId={module.id}
            gridSchemaVersion={1}
            columnDefs={colDefs}
            dataSourceMode="server"
            createServerSideDatasource={() => createServerSideDatasource()}
            detailDrawer={
              module.renderDetail
                ? (row: DynamicReportRow | null) => module.renderDetail?.(row, (k: string) => k)
                : undefined
            }
            toolbarExtras={
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void handleExport()}
                  disabled={exporting || typeof module.exportRows !== 'function'}
                  className="rounded-xl border border-border-subtle px-4 py-2 text-sm font-semibold text-text-subtle disabled:opacity-60"
                >
                  {exporting ? 'Export hazırlanıyor...' : 'CSV İndir'}
                </button>
              </div>
            }
          />
        </div>
      </PageLayout>
    </div>
  );
};
