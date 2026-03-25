import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  getSharedReport,
  getSharedReportDataMode,
  getSharedReportExportMode,
  isSharedReportFavorite,
  listSharedReportFilters,
  listSharedReportSavedFilters,
  supportsSharedReportFavorites,
  supportsSharedReportSavedFilters,
} from '@platform/capabilities';
import {
  PageLayout,
  ReportFilterPanel,
  createPageLayoutBreadcrumbItems,
  createPageLayoutPreset,
} from '@mfe/design-system';
import { EntityGridTemplate, buildEntityGridQueryParams } from '../../grid';
import type { GridRequest, GridResponse, ColumnDef } from '../../grid';
import type { ColDef, IServerSideGetRowsParams } from 'ag-grid-community';
import { useReportingI18n } from '../../i18n/useReportingI18n';
import type { ReportModule } from '../../modules/types';
import { getShellServices } from '../services/shell-services';
import {
  readReportPreferences,
  removeReportFilterPresetPersisted,
  saveReportFilterPresetPersisted,
  syncReportPreferencesFromServer,
  toggleFavoriteReportPersisted,
} from '../../lib/report-preferences/report-preferences';

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
  const sharedReport = React.useMemo(() => getSharedReport(module.sharedReportId), [module.sharedReportId]);
  const webDataMode = getSharedReportDataMode(module.sharedReportId, 'web');
  const exportMode = getSharedReportExportMode(module.sharedReportId, 'web');
  const searchParams = React.useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialFiltersFromSearch = React.useMemo(
    () => module.createInitialFilters({ searchParams }),
    [module, searchParams],
  );
  const [filters, setFilters] = React.useState<TFilters>(initialFiltersFromSearch);
  const [reloadSignal, setReloadSignal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);
  const [preferences, setPreferences] = React.useState(() => readReportPreferences());
  const initialFilterSyncRef = React.useRef(true);
  const favoriteEnabled = supportsSharedReportFavorites(module.sharedReportId, 'web');
  const savedFiltersEnabled = supportsSharedReportSavedFilters(module.sharedReportId, 'web');
  const filterParity = React.useMemo(() => listSharedReportFilters(module.sharedReportId), [module.sharedReportId]);
  const permissions = React.useMemo(() => readCurrentPermissions(), [location.key, location.pathname]);
  const exportEnabled =
    exportMode !== 'none' &&
    typeof module.exportRows === 'function' &&
    (!sharedReport.exportPermissionCode ||
      permissions.includes(normalizePermission(sharedReport.exportPermissionCode)));
  const favoriteActive = React.useMemo(
    () => isSharedReportFavorite(preferences, module.sharedReportId),
    [module.sharedReportId, preferences],
  );
  const savedPresets = React.useMemo(
    () => listSharedReportSavedFilters(preferences, module.sharedReportId, 'web'),
    [module.sharedReportId, preferences],
  );

  React.useEffect(() => {
    if (initialFilterSyncRef.current) {
      initialFilterSyncRef.current = false;
      return;
    }
    setFilters(initialFiltersFromSearch);
    setReloadSignal((value) => value + 1);
  }, [initialFiltersFromSearch]);

  React.useEffect(() => {
    let active = true;

    const hydratePreferences = async () => {
      const next = await syncReportPreferencesFromServer('web');
      if (!active) {
        return;
      }
      setPreferences(next);
    };

    void hydratePreferences();

    return () => {
      active = false;
    };
  }, []);

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

  const handleToggleFavorite = React.useCallback(async () => {
    if (!favoriteEnabled) {
      showToast('warning', 'Bu rapor kanali favori islemine acik degil.');
      return;
    }

    const next = await toggleFavoriteReportPersisted(module.sharedReportId);
    setPreferences(next);
    showToast('success', favoriteActive ? 'Rapor favorilerden cikarildi.' : 'Rapor favorilere eklendi.');
  }, [favoriteActive, favoriteEnabled, module.sharedReportId]);

  const handleSavePreset = React.useCallback(async () => {
    if (!savedFiltersEnabled) {
      showToast('warning', 'Kayitli filtre bu kanalda aktif degil.');
      return;
    }

    const { preset, snapshot } = await saveReportFilterPresetPersisted(
      module.sharedReportId,
      'web',
      filters as Record<string, unknown>,
    );
    setPreferences(snapshot);
    showToast('success', `${preset.name} kaydedildi.`);
  }, [filters, module.sharedReportId, savedFiltersEnabled]);

  const handleApplyPreset = React.useCallback(
    (presetId: string) => {
      const preset = savedPresets.find((item) => item.id === presetId);
      if (!preset) {
        return;
      }
      setFilters({
        ...module.createInitialFilters({ searchParams }),
        ...(preset.values as TFilters),
      });
      setReloadSignal((value) => value + 1);
      showToast('success', `${preset.name} uygulandi.`);
    },
    [module, savedPresets, searchParams],
  );

  const handleRemovePreset = React.useCallback(async (presetId: string) => {
    const next = await removeReportFilterPresetPersisted(module.sharedReportId, 'web', presetId);
    setPreferences(next);
    showToast('info', 'Kayitli filtre kaldirildi.');
  }, [module.sharedReportId]);

  const handleExport = React.useCallback(async () => {
    if (!exportEnabled || typeof module.exportRows !== 'function') {
      showToast(
        'warning',
        sharedReport.exportPermissionCode
          ? `Export icin ${sharedReport.exportPermissionCode} izni gerekli.`
          : 'Bu rapor icin export henuz aktif degil.',
      );
      return;
    }

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
      showToast('success', 'Export indirilmeye basladi.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Export baslatilamadi.';
      showToast('error', message);
    } finally {
      setExporting(false);
    }
  }, [exportEnabled, filters, module, sharedReport.exportPermissionCode]);

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
        <div className="rounded-3xl border border-border-subtle bg-surface-default p-6 shadow-xs">
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-border-subtle bg-surface-muted px-4 py-3 text-sm text-text-secondary">
            <span className="font-semibold text-text-primary">{sharedReport.title}</span>
            <span>izin: {sharedReport.permissionCode}</span>
            <span>kanal: web</span>
            <span>
              veri modu: {webDataMode === 'live' ? 'canli' : webDataMode === 'mock' ? 'mock' : 'bilinmiyor'}
            </span>
            <span>favori: {favoriteEnabled ? 'acik' : 'kapali'}</span>
            <span>kayitli filtre: {savedFiltersEnabled ? `${savedPresets.length} preset` : 'kapali'}</span>
            <span>
              export:{' '}
              {exportMode === 'none'
                ? 'kapali'
                : exportEnabled
                  ? exportMode === 'download'
                    ? 'indirilebilir'
                    : 'job'
                  : 'yetki gerekli'}
            </span>
            {webDataMode === 'mock' ? (
              <span className="font-semibold text-status-warning">
                Bu web modulu su an mock veri kullaniyor; mobil tarafi canli endpoint ile ilerliyor.
              </span>
            ) : null}
          </div>
          <div className="mb-4 flex flex-wrap gap-2 rounded-2xl border border-border-subtle bg-surface-default px-4 py-3 text-sm text-text-secondary">
            {filterParity.map((item) => (
              <span
                key={item.key}
                className="rounded-full border border-border-subtle bg-surface-muted px-3 py-1"
              >
                {item.label}: {item.supportedChannels.join(' / ')}
              </span>
            ))}
            {filterParity.length === 0 ? <span>Bu rapor icin parity filtresi tanimli degil.</span> : null}
          </div>
          {savedFiltersEnabled ? (
            <div className="mb-4 flex flex-wrap gap-2 rounded-2xl border border-border-subtle bg-surface-default px-4 py-3 text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">Kayitli filtreler</span>
              {savedPresets.map((preset) => (
                <div key={preset.id} className="flex items-center gap-2 rounded-full border border-border-subtle px-3 py-1">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(preset.id)}
                    className="font-semibold text-text-primary"
                  >
                    {preset.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleRemovePreset(preset.id)}
                    className="text-text-subtle"
                    aria-label={`${preset.name} sil`}
                  >
                    x
                  </button>
                </div>
              ))}
              {savedPresets.length === 0 ? <span>Henuz preset kaydedilmedi.</span> : null}
            </div>
          ) : null}
          <ReportFilterPanel
            loading={loading}
            onSubmit={handleSubmit}
            onReset={handleReset}
            submitLabel={t('reports.filters.apply')}
            resetLabel={t('reports.filters.reset')}
            testId="report-filter-panel"
            submitTestId="report-filter-submit"
            resetTestId="report-filter-reset"
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
            detailDrawer={module.renderDetail ? (row) => module.renderDetail?.(row, t) : undefined}
            toolbarExtras={(
              <div className="flex flex-wrap gap-2">
                {favoriteEnabled ? (
                  <button
                    type="button"
                    onClick={() => void handleToggleFavorite()}
                    className="rounded-xl border border-border-subtle px-4 py-2 text-sm font-semibold text-text-secondary transition hover:bg-surface-muted"
                  >
                    {favoriteActive ? 'Favoriden cikar' : 'Favoriye ekle'}
                  </button>
                ) : null}
                {savedFiltersEnabled ? (
                  <button
                    type="button"
                    onClick={() => void handleSavePreset()}
                    className="rounded-xl border border-border-subtle px-4 py-2 text-sm font-semibold text-text-secondary transition hover:bg-surface-muted"
                  >
                    Filtreyi kaydet
                  </button>
                ) : null}
                  <button
                    type="button"
                    onClick={() => void handleExport()}
                    disabled={!exportEnabled || exporting}
                    className="rounded-xl border border-border-subtle px-4 py-2 text-sm font-semibold text-text-subtle disabled:opacity-60"
                  >
                  {exporting ? 'Export hazirlaniyor...' : t('reports.toolbar.exportCsv')}
                </button>
              </div>
            )}
          />
        </div>
      </PageLayout>
    </div>
  );
}
