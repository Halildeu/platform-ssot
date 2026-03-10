import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type {
  ColDef,
  ColumnApi,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  ProcessCellForExportParams,
  SideBarDef,
  ExcelExportParams,
} from 'ag-grid-community';
import type { ExcelStyle } from 'ag-grid-enterprise';
// Theming API (v33+)
import { themeQuartz, themeBalham, themeAlpine, themeMaterial } from 'ag-grid-community';
import { ServerSideRowModelModule, ServerSideRowModelApiModule } from 'ag-grid-enterprise';
import type { GridVariant, GridVariantState } from '@mfe/shared-types';
import {
  useGridVariants,
  compareGridVariants,
  toggleVariantDefault,
} from '../../lib/grid-variants';
import type { ThemeAxes, ThemeDensity } from '../../runtime/theme-controller';
import { getThemeAxes, subscribeThemeAxes } from '../../runtime/theme-controller';

const DEFAULT_THEME_OPTIONS = [
  { label: 'Quartz', value: 'quartz' },
  { label: 'Balham', value: 'balham' },
  { label: 'Material', value: 'material' },
  { label: 'Alpine', value: 'alpine' },
] as const;

const DEFAULT_PAGE_SIZE_OPTIONS = [25, 50, 100, 250, 500, 1000, 5000, 10000, 50000, 100000];
const DEFAULT_VARIANT_NAME = 'Adsız Varyant';

type ThemeValue = typeof DEFAULT_THEME_OPTIONS[number]['value'];

const DENSITY_ROW_HEIGHT: Record<ThemeDensity, number> = {
  comfortable: 56,
  compact: 42,
};

const toolbarLabelClass = 'flex flex-col gap-1 text-xs font-medium text-text-secondary min-w-[180px]';
const toolbarSelectClass =
  'w-full rounded-md border border-border-default bg-surface-panel px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-[var(--accent-focus)] focus:ring-offset-1';
const toolbarInputClass =
  'w-full rounded-md border border-border-default bg-surface-panel px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-[var(--accent-focus)] focus:ring-offset-1';
const toolbarIconButtonClass =
  'inline-flex h-9 w-9 items-center justify-center rounded-md border border-border-default bg-surface-panel text-text-secondary hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-focus)] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50';
const toolbarSecondaryButtonClass =
  'inline-flex items-center justify-center rounded-md border border-border-default bg-surface-panel px-3 py-2 text-sm font-semibold text-text-primary hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-focus)] focus-visible:ring-offset-1 disabled:opacity-60';
const variantButtonClass =
  'inline-flex items-center gap-2 rounded-md border border-border-subtle bg-surface-panel px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-focus)] focus-visible:ring-offset-1 disabled:opacity-50';
const variantPrimaryButtonClass =
  'inline-flex items-center gap-2 rounded-md bg-[var(--accent-primary)] px-3 py-1.5 text-xs font-semibold text-text-inverse shadow-sm hover:bg-[var(--accent-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-focus)] focus-visible:ring-offset-1 disabled:opacity-60';
const variantIconButtonClass =
  'inline-flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle bg-surface-panel text-text-secondary hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-focus)] focus-visible:ring-offset-1';
const variantTagClass =
  'inline-flex items-center gap-1 rounded-full border border-border-subtle px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-secondary bg-surface-panel';
const densityToggleButtonBaseClass =
  'inline-flex min-w-[96px] items-center justify-center rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-focus)] focus-visible:ring-offset-1';
const densityToggleActiveClass = 'border-selection bg-selection text-text-inverse';
const densityToggleInactiveClass =
  'border-border-subtle bg-surface-panel text-text-secondary hover:bg-surface-muted';

const iconClassName = 'text-[14px] leading-none';

const IconDownload: React.FC = () => <span aria-hidden className={iconClassName}>⬇</span>;
const IconFileExcel: React.FC = () => <span aria-hidden className={iconClassName}>📊</span>;
const IconFileText: React.FC = () => <span aria-hidden className={iconClassName}>📄</span>;
const IconReload: React.FC = () => <span aria-hidden className={iconClassName}>⟳</span>;
const IconSettings: React.FC = () => <span aria-hidden className={iconClassName}>⚙</span>;
const IconSave: React.FC = () => <span aria-hidden className={iconClassName}>💾</span>;
const IconDelete: React.FC = () => <span aria-hidden className={iconClassName}>🗑</span>;
const IconPlus: React.FC = () => <span aria-hidden className={iconClassName}>+</span>;
const IconFullscreen: React.FC = () => <span aria-hidden className={iconClassName}>⛶</span>;
const IconEdit: React.FC = () => <span aria-hidden className={iconClassName}>✏</span>;
const IconGlobal: React.FC = () => <span aria-hidden className={iconClassName}>🌐</span>;
const IconStarFilled: React.FC = () => <span aria-hidden className={iconClassName}>★</span>;
const IconStarOutlined: React.FC = () => <span aria-hidden className={iconClassName}>☆</span>;
const IconUser: React.FC = () => <span aria-hidden className={iconClassName}>👤</span>;
const IconUserSwitch: React.FC = () => <span aria-hidden className={iconClassName}>⇄</span>;
const IconCheckCircle: React.FC = () => <span aria-hidden className={iconClassName}>✔</span>;
const IconDown: React.FC = () => <span aria-hidden className={iconClassName}>▾</span>;
const IconUp: React.FC = () => <span aria-hidden className={iconClassName}>▴</span>;
const IconEllipsis: React.FC = () => <span aria-hidden className={iconClassName}>⋯</span>;

type ToastKind = 'success' | 'error' | 'warning';

type ToastMessage = {
  id: string;
  kind: ToastKind;
  text: string;
};

const toastStylesByKind: Record<ToastKind, string> = {
  success: 'border border-state-success-border bg-state-success text-state-success-text',
  error: 'border border-state-danger-border bg-state-danger text-state-danger-text',
  warning: 'border border-state-warning-border bg-state-warning text-state-warning-text',
};

type SwitchControlProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
};

const SwitchControl: React.FC<SwitchControlProps> = ({ checked, onChange, disabled, loading, label }) => {
  const handleToggle = () => {
    if (disabled || loading) {
      return;
    }
    onChange(!checked);
  };
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={handleToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-[var(--accent-primary)]' : 'bg-border-subtle'
      } ${disabled || loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
    >
      <span
        className="inline-block h-5 w-5 transform rounded-full bg-surface transition"
        style={{ transform: checked ? 'translateX(20px)' : 'translateX(2px)' }}
      />
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-semibold text-text-secondary">
          …
        </span>
      )}
    </button>
  );
};

type EntityGridApi<RowData extends Record<string, unknown>> = GridApi<RowData> & {
  setGridOption?: (key: string, value: unknown) => void;
  getGridOption?: (key: string) => unknown;
  refreshServerSideStore?: (params?: { purge?: boolean }) => void;
  refreshClientSideRowModel?: (step?: 'filter' | 'sort' | 'group' | 'pivot') => void;
  getColumnState?: () => GridVariantState['columnState'] | null;
  applyColumnState?: (params: { state?: GridVariantState['columnState']; applyOrder?: boolean }) => boolean;
  setFilterModel?: (model: GridVariantState['filterModel'] | null) => void;
  getFilterModel?: () => GridVariantState['filterModel'] | null;
  setAdvancedFilterModel?: (model: GridVariantState['advancedFilterModel'] | null) => void;
  getAdvancedFilterModel?: () => GridVariantState['advancedFilterModel'] | null;
  setSortModel?: (model: GridVariantState['sortModel'] | null) => void;
  getSortModel?: () => GridVariantState['sortModel'] | null;
  setPivotMode?: (enabled: boolean) => void;
  isPivotMode?: () => boolean;
  onFilterChanged?: () => void;
  serverSideExcelExport?: (params: Record<string, unknown>) => void;
  exportDataAsExcel?: (params?: Record<string, unknown>) => void;
  exportDataAsCsv?: (params?: Record<string, unknown>) => void;
  setQuickFilter?: (value?: string) => void;
  addEventListener?: (type: string, listener: (...args: unknown[]) => void) => void;
  removeEventListener?: (type: string, listener: (...args: unknown[]) => void) => void;
};

export interface GridExportConfig<RowData> {
  fileBaseName: string;
  sheetName?: string;
  processCellCallback?: (params: ProcessCellForExportParams<RowData>) => unknown;
  csvFileBaseName?: string;
  csvColumnSeparator?: string;
  csvBom?: boolean;
}

export interface EntityGridTemplateProps<RowData extends Record<string, unknown>> {
  gridId: string;
  gridSchemaVersion: number;
  rowData?: RowData[];
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  columnDefs: ColDef<RowData>[];
  defaultColDef?: ColDef<RowData>;
  gridOptions?: GridOptions<RowData>;
  sideBar?: SideBarDef;
  localeText?: Record<string, string>;
  excelStyles?: ExcelStyle[];
  overlayLoadingTemplate?: string;
  overlayNoRowsTemplate?: string;
  rowHeight?: number;
  onGridReady?: (params: GridReadyEvent<RowData>) => void;
  onRowDoubleClick?: (row: RowData) => void;
  isFullscreen?: boolean;
  onRequestFullscreen?: () => void;
  toolbarExtras?: React.ReactNode;
  exportConfig?: GridExportConfig<RowData>;
  quickFilterPlaceholder?: string;
  initialTheme?: ThemeValue;
  themeOptions?: readonly { label: string; value: ThemeValue }[];
  pageSizeOptions?: number[];
  pageSizeSelectId?: string;
  quickFilterInitialValue?: string;
  initialVariantId?: string;
  formatNumber?: (value: number) => string;
  themeLabel?: string;
  quickFilterLabel?: string;
  variantLabel?: string;
  densityToggleLabel?: string;
  comfortableDensityLabel?: string;
  compactDensityLabel?: string;
  densityResetLabel?: string;
  fullscreenTooltip?: string;
  resetFiltersLabel?: string;
  excelVisibleLabel?: string;
  excelAllLabel?: string;
  csvVisibleLabel?: string;
  csvAllLabel?: string;
  variantModalTitle?: string;
  variantNewButtonLabel?: string;
  variantNamePlaceholder?: string;
  rowSelection?: GridOptions<RowData>['rowSelection'];
  dataSourceMode?: 'server' | 'client';
  createServerSideDatasource?: (params: { gridApi: GridApi<RowData>; columnApi: ColumnApi<RowData> }) => IServerSideDatasource | null | undefined;
  onEffectiveModeChange?: (mode: 'server' | 'client') => void;
}

const normalizeVariantName = (value: unknown): string => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : DEFAULT_VARIANT_NAME;
  }
  if (value === null || value === undefined) {
    return DEFAULT_VARIANT_NAME;
  }
  const stringified = String(value).trim();
  return stringified.length > 0 ? stringified : DEFAULT_VARIANT_NAME;
};

const getVariantTimestamp = (variant: GridVariant): number => {
  const timestamps = [variant.updatedAt, variant.createdAt].map((value) => {
    if (!value) {
      return 0;
    }
    const time = new Date(value).getTime();
    return Number.isFinite(time) ? time : 0;
  });
  return Math.max(0, ...timestamps);
};

const getFullscreenParamName = (gridId: string) =>
  `${gridId.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'grid'}-fullscreen`;

const resolveThemeObject = (value: ThemeValue) => {
  switch (value) {
    case 'quartz':
      return themeQuartz;
    case 'balham':
      return themeBalham;
    case 'alpine':
      return themeAlpine;
    case 'material':
      return themeMaterial;
    default:
      return themeQuartz;
  }
};

export function EntityGridTemplate<RowData extends Record<string, unknown> = Record<string, unknown>>({
  gridId,
  gridSchemaVersion,
  rowData = [],
  total = 0,
  page = 1,
  pageSize = 25,
  onPageChange = () => {},
  columnDefs,
  defaultColDef,
  gridOptions,
  sideBar,
  localeText,
  excelStyles,
  overlayLoadingTemplate = "<span class='ag-overlay-loading-center'>Veriler yükleniyor...</span>",
  overlayNoRowsTemplate = "<span class='ag-overlay-loading-center'>Kayıt bulunamadı</span>",
  rowHeight,
  onGridReady,
  onRowDoubleClick,
  isFullscreen = false,
  onRequestFullscreen,
  toolbarExtras,
  exportConfig,
  quickFilterPlaceholder = 'Tüm sütunlarda ara...',
  // Theming API: quartz varsayılan
  initialTheme = 'quartz',
  themeOptions = DEFAULT_THEME_OPTIONS,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  pageSizeSelectId,
  quickFilterInitialValue = '',
  initialVariantId,
  formatNumber = (value: number) => value.toLocaleString('tr-TR'),
  themeLabel = 'Tema',
  quickFilterLabel = 'Filtre',
  variantLabel = 'Varyant',
  densityToggleLabel = 'Satır yoğunluğu',
  comfortableDensityLabel = 'Konforlu',
  compactDensityLabel = 'Sıkı',
  densityResetLabel = 'Global ayarı kullan',
  fullscreenTooltip = 'Yeni sekmede tam ekran aç',
  resetFiltersLabel = 'Filtreleri Sıfırla',
  excelVisibleLabel = 'Excel (Görünür)',
  excelAllLabel = 'Excel (Tümü)',
  csvVisibleLabel = 'CSV (Görünür)',
  csvAllLabel = 'CSV (Tümü)',
  variantModalTitle = 'Varyant Yönetimi',
  variantNewButtonLabel = 'Yeni varyant oluştur',
  variantNamePlaceholder = 'Yeni varyant adı',
  rowSelection = {
    mode: 'multiRow',
    enableClickSelection: false,
  },
  dataSourceMode = 'server',
  createServerSideDatasource,
  onEffectiveModeChange,
}: EntityGridTemplateProps<RowData>) {
  const [gridApi, setGridApi] = useState<EntityGridApi<RowData> | null>(null);
  const columnApiRef = useRef<ColumnApi<RowData> | null>(null);
  const serverDataSourceRef = useRef<IServerSideDatasource | null>(null);
  // Mod geçişlerinde filtre/sort durumunu korumak için hafıza
  const savedFilterModelRef = useRef<GridVariantState['filterModel'] | null>(null);
  const savedSortModelRef = useRef<GridVariantState['sortModel'] | null>(null);
  const [gridTheme, setGridTheme] = useState<ThemeValue>(initialTheme);
  const [clientRowData, setClientRowData] = useState<RowData[]>(() => (rowData ?? []).slice());
  const [quickFilterValue, setQuickFilterValue] = useState(quickFilterInitialValue ?? '');
  const [themeAxesState, setThemeAxesState] = useState<ThemeAxes>(() => getThemeAxes());
  const [gridDensityOverride, setGridDensityOverride] = useState<ThemeDensity | null>(null);
  useEffect(() => {
    const unsubscribe = subscribeThemeAxes(setThemeAxesState);
    return () => {
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    setGridDensityOverride((current) => {
      if (current !== null && current === themeAxesState.density) {
        return null;
      }
      return current;
    });
  }, [themeAxesState.density]);
  const effectiveDensity = gridDensityOverride ?? themeAxesState.density;
  const resolvedRowHeight =
    typeof rowHeight === 'number' ? rowHeight : DENSITY_ROW_HEIGHT[effectiveDensity];
  const {
    variants,
    isLoading: variantsLoading,
    isFetching: variantsFetching,
    createVariant: createVariantAsync,
    updateVariant: updateVariantAsync,
    deleteVariant: deleteVariantAsync,
    updateVariantPreference: updateVariantPreferenceAsync,
    createStatus,
    updateStatus,
    deleteStatus,
    preferenceStatus,
  } = useGridVariants(gridId);
  const [activeVariantId, setActiveVariantId] = useState<string | null>(null);
  const appliedVariantRef = useRef<string | null>(null);
  const initialVariantAppliedRef = useRef<string | null>(null);
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug('[EntityGridTemplate] variants', gridId, variants.map((variant) => ({
        id: variant.id,
        name: variant.name,
        isGlobal: variant.isGlobal,
        isGlobalDefault: variant.isGlobalDefault,
        isUserDefault: variant.isUserDefault,
        isUserSelected: variant.isUserSelected,
      })));
    }
  }, [variants, gridId]);
  const [isVariantManagerOpen, setVariantManagerOpen] = useState(false);
  const [newVariantName, setNewVariantName] = useState('');
  const [newVariantDefault, setNewVariantDefault] = useState(false);
  const [isNewVariantOpen, setNewVariantOpen] = useState(false);
  const [newVariantGlobal, setNewVariantGlobal] = useState(false);
  const [newVariantGlobalDefault, setNewVariantGlobalDefault] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const removeToast = useCallback((toastId: string) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== toastId));
    const timeoutId = toastTimeoutsRef.current[toastId];
    if (timeoutId) {
      clearTimeout(timeoutId);
      delete toastTimeoutsRef.current[toastId];
    }
  }, []);
  const pushToast = useCallback(
    (kind: ToastKind, text: string) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setToasts((previous) => [...previous, { id, kind, text }]);
      if (typeof window !== 'undefined') {
        const timeoutId = window.setTimeout(() => {
          removeToast(id);
        }, 4000);
        toastTimeoutsRef.current[id] = timeoutId;
      }
    },
    [removeToast],
  );
  useEffect(
    () => () => {
      Object.values(toastTimeoutsRef.current).forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      toastTimeoutsRef.current = {};
    },
    [],
  );
  const [variantMenuOpenId, setVariantMenuOpenId] = useState<string | null>(null);
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const handleCloseMenus = () => {
      setVariantMenuOpenId(null);
    };
    document.addEventListener('click', handleCloseMenus);
    return () => {
      document.removeEventListener('click', handleCloseMenus);
    };
  }, []);
  const generatedSelectIdRef = useRef(
    pageSizeSelectId ?? `entity-grid-page-size-${Math.random().toString(36).slice(2, 9)}`,
  );
  const resolvedPageSizeSelectId = pageSizeSelectId ?? generatedSelectIdRef.current;
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [editingVariantName, setEditingVariantName] = useState('');
  const [expandedVariantId, setExpandedVariantId] = useState<string | null>(null);
  const [preferenceTargetId, setPreferenceTargetId] = useState<string | null>(null);
  const isUsingGlobalDensity = gridDensityOverride === null;
  const comfortableSelected = effectiveDensity === 'comfortable';
  const compactSelected = effectiveDensity === 'compact';
  const comfortableButtonClass = `${densityToggleButtonBaseClass} ${
    comfortableSelected ? densityToggleActiveClass : densityToggleInactiveClass
  }`;
  const compactButtonClass = `${densityToggleButtonBaseClass} ${
    compactSelected ? densityToggleActiveClass : densityToggleInactiveClass
  }`;
  const densityStatusMessage = isUsingGlobalDensity
    ? 'Global yoğunluk uygulanıyor.'
    : 'Bu grid özel yoğunluk kullanıyor.';
  const handleLocalDensitySelect = useCallback(
    (density: ThemeDensity) => {
      setGridDensityOverride((current) => {
        if (density === themeAxesState.density) {
          return null;
        }
        if (current === density) {
          return current;
        }
        return density;
      });
    },
    [themeAxesState.density],
  );
  const handleLocalDensityReset = useCallback(() => {
    setGridDensityOverride(null);
  }, []);
  const gridScopeAttributes = useMemo<Record<string, string>>(
    () => ({
      'data-theme-scope': 'entity-grid',
      'data-grid-theme': gridTheme,
      'data-appearance': themeAxesState.appearance,
      'data-radius': themeAxesState.radius,
      'data-elevation': themeAxesState.elevation,
      'data-motion': themeAxesState.motion,
      'data-density': effectiveDensity,
      'data-table-surface-tone': themeAxesState.tableSurfaceTone,
    }),
    [
      gridTheme,
      themeAxesState.appearance,
      themeAxesState.radius,
      themeAxesState.elevation,
      themeAxesState.motion,
      themeAxesState.tableSurfaceTone,
      effectiveDensity,
    ],
  );

  const exportBaseName = exportConfig?.fileBaseName ?? 'veriler';
  const exportSheetName = exportConfig?.sheetName ?? 'Veriler';
  const exportProcessCellCallback = exportConfig?.processCellCallback;
  const csvBaseName = exportConfig?.csvFileBaseName ?? exportBaseName;
  const csvSeparator = exportConfig?.csvColumnSeparator ?? ';';
  const csvBom = exportConfig?.csvBom ?? true;
  const isServerMode = dataSourceMode === 'server';
  const showQuickFilter = true;

  useEffect(() => {
    if (dataSourceMode === 'client') {
      setClientRowData((rowData ?? []).slice());
    }
  }, [rowData, dataSourceMode]);

  useEffect(() => {
    onEffectiveModeChange?.(dataSourceMode);
  }, [dataSourceMode, onEffectiveModeChange]);

  const isCreatingVariant = createStatus === 'pending';
  const isUpdatingVariant = updateStatus === 'pending';
  const isDeletingVariant = deleteStatus === 'pending';
  const isUpdatingPreference = preferenceStatus === 'pending';

  const resolvedDefaultColDef = useMemo<ColDef<RowData>>(
    () => ({
      sortable: true,
      filter: 'agMultiColumnFilter',
      floatingFilter: true,
      resizable: true,
      minWidth: 150,
      flex: 1,
      menuTabs: ['generalMenuTab', 'filterMenuTab', 'columnsMenuTab'],
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
      allowedAggFuncs: ['sum', 'avg', 'min', 'max', 'count'],
      ...defaultColDef,
    }),
    [defaultColDef],
  );

  const enableAdvancedFilter = gridOptions?.enableAdvancedFilter ?? true;

  const defaultSideBar = useMemo<SideBarDef>(
    () => {
      const columnsPanel = {
        id: 'columns',
        labelDefault: 'Kolonlar',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        minWidth: 200,
        maxWidth: 400,
      } as const;

      if (enableAdvancedFilter) {
        return {
          toolPanels: [columnsPanel],
          defaultToolPanel: 'columns',
          position: 'right',
        };
      }

      return {
        toolPanels: [
          {
            id: 'filters',
            labelDefault: 'Filtreler',
            labelKey: 'filters',
            iconKey: 'filter',
            toolPanel: 'agFiltersToolPanel',
          },
          columnsPanel,
        ],
        defaultToolPanel: 'filters',
        position: 'right',
      };
    },
    [enableAdvancedFilter],
  );

  const resolvedSideBar = useMemo<SideBarDef>(() => {
    const base = sideBar ?? defaultSideBar;

    if (!enableAdvancedFilter || !base.toolPanels || base.toolPanels.length === 0) {
      return base;
    }

    const filteredPanels = base.toolPanels.filter((panel) => {
      if (typeof panel === 'string') {
        return panel !== 'filters';
      }
      return panel.toolPanel !== 'agFiltersToolPanel' && panel.id !== 'filters';
    });

    if (filteredPanels.length === base.toolPanels.length) {
      return base;
    }

    if (filteredPanels.length === 0) {
      return defaultSideBar;
    }

    const defaultToolPanel = base.defaultToolPanel;
    const hasDefaultToolPanel = filteredPanels.some((panel) => {
      if (typeof panel === 'string') {
        return panel === defaultToolPanel;
      }
      return panel.id === defaultToolPanel;
    });

    const nextDefaultToolPanel = hasDefaultToolPanel
      ? defaultToolPanel
      : typeof filteredPanels[0] === 'string'
        ? filteredPanels[0]
        : filteredPanels[0].id;

    return {
      ...base,
      toolPanels: filteredPanels,
      defaultToolPanel: nextDefaultToolPanel,
    };
  }, [sideBar, defaultSideBar, enableAdvancedFilter]);

  const defaultLocaleText = useMemo(
    () => ({
      selectAll: 'Tümünü seç',
      searchOoo: 'Ara...',
      filterOoo: 'Filtre... ',
      blanks: '(Boş)',
      noRowsToShow: 'Gösterilecek satır yok',
      loadingOoo: 'Yükleniyor...'
        ,
      // Sayfalama / gezinme
      page: 'Sayfa',
      more: 'Daha fazla',
      to: '-',
      of: 'toplam',
      next: 'Sonraki',
      last: 'Son',
      first: 'İlk',
      previous: 'Önceki',
      columns: 'Sütunlar',
      filters: 'Filtreler',
      collapseAll: 'Tümünü daralt',
      expandAll: 'Tümünü genişlet',
      pinColumn: 'Sütunu sabitle',
      autosizeThiscolumn: 'Bu sütunu otomatik boyutlandır',
      autosizeAllColumns: 'Tüm sütunları otomatik boyutlandır',
      groupBy: 'Grupla',
      resetColumns: 'Sütunları sıfırla',
      resetFilters: 'Filtreleri sıfırla',
      toolPanelButton: 'Araç Paneli',
      columnMenuPin: 'Sabitlenmiş',
      columnMenuValue: 'Değerler',
      columnMenuGroup: 'Gruplar',
      columnMenuSort: 'Sıralama',
      columnMenuFilter: 'Filtre',
      applyFilter: 'Uygula',
      clearFilter: 'Temizle',
      clearFilters: 'Tüm filtreleri temizle',
      // Koşul metinleri
      equals: 'Eşittir',
      notEqual: 'Eşit değil',
      lessThan: 'Küçüktür',
      lessThanOrEqual: 'Küçük veya eşit',
      greaterThan: 'Büyüktür',
      greaterThanOrEqual: 'Büyük veya eşit',
      inRange: 'Arasında',
      contains: 'İçerir',
      notContains: 'İçermez',
      startsWith: 'İle başlar',
      endsWith: 'İle biter',
      blank: 'Boş',
      notBlank: 'Boş değil',
      andCondition: 'Ve',
      orCondition: 'Veya',
      rowGroupPanel: 'Gruplar',
      dropZoneColumnGroup: 'Gruplamak için sütunları buraya sürükleyin',
      rowGroupColumnsEmptyMessage: 'Gruplamak için sütunları buraya sürükleyin',
      dragHereToSetColumnRowGroup: 'Gruplamak için sütunları buraya sürükleyin',
      dragHereToSetRowGroup: 'Gruplamak için sütunları buraya sürükleyin',
      dragHereToSetColumnValues: 'Değerler için sütunları buraya sürükleyin',
      dropZoneColumnValue: 'Değerler için sütunları buraya sürükleyin',
      // Gelişmiş filtre (Advanced Filter)
      advancedFilter: 'Gelişmiş filtre',
      advancedFilterBuilder: 'Gelişmiş filtre',
      advancedFilterButtonTooltip: 'Gelişmiş filtreyi aç',
      advancedFilterBuilderAdd: 'Koşul ekle',
      advancedFilterBuilderRemove: 'Kaldır',
      advancedFilterJoinOperator: 'Bağlaç',
      advancedFilterAnd: 'VE',
      advancedFilterOr: 'VEYA',
      advancedFilterValidationMissingColumn: 'Sütun seçin',
      advancedFilterValidationMissingOption: 'Operatör seçin',
      advancedFilterValidationMissingValue: 'Değer girin',
      advancedFilterApply: 'Uygula',
    }),
    [],
  );

  const resolvedLocaleText = localeText ?? defaultLocaleText;

  const resolvedExcelStyles = useMemo<ExcelStyle[] | undefined>(() => {
    if (excelStyles) {
      return excelStyles;
    }
    return undefined;
  }, [excelStyles]);

  const resolvedGetRowId = useMemo<GridOptions<RowData>['getRowId']>(() => {
    if (gridOptions?.getRowId) {
      return gridOptions.getRowId;
    }
    if (!isServerMode) {
      return undefined;
    }
    return (params) => {
      const data = params.data as Record<string, unknown> | null | undefined;
      if (data && typeof data === 'object') {
        const candidate =
          data.id
          ?? data.uuid
          ?? data.key
          ?? (typeof data['rowId'] !== 'undefined' ? data['rowId'] : undefined);
        if (candidate !== undefined && candidate !== null) {
          return String(candidate);
        }
      }
      if (typeof params.node?.id === 'string') {
        return params.node.id;
      }
      if (typeof params.node?.rowIndex === 'number') {
        return `row-${params.node.rowIndex}`;
      }
      return Math.random().toString(36).slice(2);
    };
  }, [gridOptions, isServerMode]);

  const resolvedGridOptions = useMemo<GridOptions<RowData>>(() => {
    const base: GridOptions<RowData> = {
      // Theming API (v33+): theme nesnesi verilmelidir (string yerine)
      theme: resolveThemeObject(gridTheme),
      enableAdvancedFilter,
      defaultExcelExportParams: {
        sheetName: exportSheetName,
        suppressTextAsCDATA: true,
      },
      popupParent: typeof document !== 'undefined' ? document.body : undefined,
    };
    if (resolvedGetRowId) {
      base.getRowId = resolvedGetRowId;
    }
    if (!gridOptions) {
      return base;
    }
    const merged: GridOptions<RowData> = {
      ...base,
      ...gridOptions,
      theme: resolveThemeObject(gridTheme),
      defaultExcelExportParams: {
        ...base.defaultExcelExportParams,
        ...gridOptions.defaultExcelExportParams,
      },
      popupParent: base.popupParent,
    };
    if (resolvedGetRowId) {
      merged.getRowId = resolvedGetRowId;
    }
    return merged;
  }, [gridOptions, gridTheme, exportSheetName, resolvedGetRowId, enableAdvancedFilter]);

  const themeClassName = useMemo(() => `ag-theme-${gridTheme}`, [gridTheme]);

  const agModules = useMemo(
    () => (isServerMode ? [ServerSideRowModelModule, ServerSideRowModelApiModule] : undefined),
    [isServerMode],
  );

  // Tema değiştikçe Theming API temayı runtime'da güncelle
  useEffect(() => {
    if (!gridApi) return;
    gridApi.setGridOption?.('theme', resolveThemeObject(gridTheme));
  }, [gridApi, gridTheme]);

  const resolvedPageSizeOptions = useMemo(
    () =>
      Array.from(new Set([...pageSizeOptions, Math.max(1, pageSize)])).sort((a, b) => a - b),
    [pageSizeOptions, pageSize],
  );

  const effectiveTotal = isServerMode ? total : clientRowData.length;

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(effectiveTotal > 0 ? effectiveTotal / Math.max(1, pageSize) : 1)),
    [effectiveTotal, pageSize],
  );
  const hasData = effectiveTotal > 0;
  const currentPage = hasData ? Math.min(page, totalPages) : 0;
  const recordStart = hasData ? (currentPage - 1) * pageSize + 1 : 0;
  const recordEnd = hasData ? Math.min(effectiveTotal, currentPage * pageSize) : 0;
  const canGoPrevious = hasData && currentPage > 1;
  const canGoNext = hasData && currentPage < totalPages;

  const gridContainerStyle = useMemo<React.CSSProperties>(
    () => ({
      flex: isFullscreen ? 1 : undefined,
      minHeight: isFullscreen ? 360 : 520,
      height: isFullscreen ? '100%' : 520,
      marginTop: isFullscreen ? 16 : 0,
    }),
    [isFullscreen],
  );

  useEffect(() => {
    if (isServerMode) {
      return;
    }
    if (!hasData) {
      if (page !== 1) {
        onPageChange(1, pageSize);
      }
      return;
    }
    if (page > totalPages) {
      onPageChange(totalPages, pageSize);
    }
  }, [hasData, page, pageSize, totalPages, onPageChange, isServerMode]);

  useEffect(() => {
    if (variantsFetching || !activeVariantId) {
      return;
    }
    if (!variants.some((variant) => variant.id === activeVariantId)) {
      setActiveVariantId(null);
      appliedVariantRef.current = null;
    }
  }, [variants, activeVariantId, variantsFetching]);

  const handleQuickFilterChange = useCallback(
    (value: string) => {
      setQuickFilterValue(value);
      if (isServerMode) {
        gridApi?.refreshServerSideStore?.({ purge: true });
        return;
      }
      gridApi?.setGridOption?.('quickFilterText', value);
    },
    [gridApi, isServerMode],
  );

  const collectGridState = useCallback((): GridVariantState | null => {
    if (!gridApi) {
      pushToast('warning', 'Tablo henüz hazır değil.');
      return null;
    }
    const columnState = gridApi.getColumnState?.() ?? [];
    const filterModel = gridApi.getFilterModel?.() ?? null;
    const sortModel = gridApi.getSortModel?.() ?? [];
    const pivotMode = gridApi.isPivotMode?.() ?? false;
    const quickFilterText = gridApi.getGridOption?.('quickFilterText') ?? '';

    return {
      columnState,
      filterModel: filterModel ?? null,
      advancedFilterModel: gridApi.getAdvancedFilterModel?.() ?? null,
      sortModel,
      pivotMode,
      quickFilterText,
    };
  }, [gridApi, pushToast]);

  const applyVariant = useCallback(
    (variant: GridVariant) => {
      if (!gridApi) {
        setActiveVariantId(variant.id);
        return;
      }
      const state = variant.state ?? {};
      try {
        if (state.columnState) {
          gridApi.applyColumnState({ state: state.columnState, applyOrder: true });
        }
        if (state.filterModel !== undefined) {
          gridApi.setFilterModel?.(state.filterModel ?? null);
        }
        if (state.advancedFilterModel !== undefined) {
          gridApi.setAdvancedFilterModel?.(state.advancedFilterModel ?? null);
        }
        if (state.sortModel !== undefined) {
          gridApi.setSortModel?.(state.sortModel ?? []);
        }
        if (state.pivotMode !== undefined) {
          gridApi.setPivotMode?.(Boolean(state.pivotMode));
        }
        if (state.quickFilterText !== undefined) {
          handleQuickFilterChange(state.quickFilterText ?? '');
        }
        gridApi.onFilterChanged?.();
        if (!isServerMode) {
          gridApi.refreshClientSideRowModel?.('filter');
        }
        setActiveVariantId(variant.id);
        appliedVariantRef.current = variant.id;
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Varyant durumu uygulanamadı, varsayılan görünüme dönülüyor.', error);
        }
        pushToast('error', 'Kayıtlı tablo görünümü bozuk olduğu için uygulanamadı.');
        appliedVariantRef.current = null;
        setActiveVariantId(null);
      }
    },
    [gridApi, handleQuickFilterChange, isServerMode, pushToast],
  );

  useEffect(() => {
    if (!gridApi || variants.length === 0 || variantsFetching) {
      return;
    }
    const appliedId = appliedVariantRef.current;
    if (activeVariantId && activeVariantId !== appliedId) {
      const desiredVariant = variants.find((variant) => variant.id === activeVariantId && variant.isCompatible);
      if (desiredVariant) {
        applyVariant(desiredVariant);
        return;
      }
    }
    if (appliedId) {
      const appliedVariant = variants.find((variant) => variant.id === appliedId && variant.isCompatible);
      if (appliedVariant) {
        return;
      }
      appliedVariantRef.current = null;
    }
    const userGlobalDefault = variants.find(
      (variant) => variant.isGlobal && variant.isUserDefault && variant.isCompatible,
    );
    if (userGlobalDefault) {
      applyVariant(userGlobalDefault);
      return;
    }
    const personalDefault = variants.find(
      (variant) => !variant.isGlobal && variant.isUserDefault && variant.isCompatible,
    );
    if (personalDefault) {
      applyVariant(personalDefault);
      return;
    }
    const globalDefaultVariant = variants.find(
      (variant) => variant.isGlobal && variant.isGlobalDefault && variant.isCompatible,
    );
    if (globalDefaultVariant) {
      applyVariant(globalDefaultVariant);
      return;
    }
    const latestPersonalVariant = variants
      .filter((variant) => !variant.isGlobal && variant.isCompatible)
      .reduce<GridVariant | undefined>((latest, candidate) => {
        if (!latest) {
          return candidate;
        }
        return getVariantTimestamp(candidate) >= getVariantTimestamp(latest) ? candidate : latest;
      }, undefined);
    if (latestPersonalVariant) {
      applyVariant(latestPersonalVariant);
      return;
    }
    const firstCompatible = variants.find((variant) => variant.isCompatible);
    if (firstCompatible) {
      applyVariant(firstCompatible);
    }
  }, [gridApi, variants, applyVariant, variantsFetching, activeVariantId]);

  useEffect(() => {
    if (!isVariantManagerOpen) {
      setEditingVariantId(null);
      setEditingVariantName('');
    }
  }, [isVariantManagerOpen]);

  useEffect(() => {
    if (editingVariantId && !variants.some((variant) => variant.id === editingVariantId)) {
      setEditingVariantId(null);
      setEditingVariantName('');
    }
  }, [editingVariantId, variants]);

  const handleGoToPage = useCallback(
    (targetPage: number) => {
      if (isServerMode) {
        return;
      }
      const boundedPage = Math.min(Math.max(1, targetPage), totalPages);
      if (boundedPage !== page) {
        onPageChange(boundedPage, pageSize);
      }
    },
    [isServerMode, onPageChange, page, pageSize, totalPages],
  );

  const handleFirstPage = useCallback(() => handleGoToPage(1), [handleGoToPage]);
  const handlePreviousPage = useCallback(() => handleGoToPage(page - 1), [handleGoToPage, page]);
  const handleNextPage = useCallback(() => handleGoToPage(page + 1), [handleGoToPage, page]);
  const handleLastPage = useCallback(() => handleGoToPage(totalPages), [handleGoToPage, totalPages]);

  const handleOpenFullscreen = useCallback(() => {
    if (onRequestFullscreen) {
      onRequestFullscreen();
      return;
    }
    if (typeof window === 'undefined') {
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set(getFullscreenParamName(gridId), '1');
    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  }, [onRequestFullscreen, gridId]);

  const gridInstanceKey = useMemo(() => `${gridId}-${dataSourceMode}`, [gridId, dataSourceMode]);

  const handleGridReady = useCallback(
    (params: GridReadyEvent<RowData>) => {
      const enhancedApi = params.api as EntityGridApi<RowData>;
      setGridApi(enhancedApi);
      columnApiRef.current = params.columnApi;

      if (savedFilterModelRef.current) {
        enhancedApi.setFilterModel?.(savedFilterModelRef.current);
      }
      if (savedSortModelRef.current) {
        enhancedApi.setSortModel?.(savedSortModelRef.current);
      }

      const updateSavedState = () => {
        savedFilterModelRef.current = enhancedApi.getFilterModel?.() ?? null;
        savedSortModelRef.current = enhancedApi.getSortModel?.() ?? null;
      };
      enhancedApi.addEventListener?.('filterChanged', updateSavedState);
      enhancedApi.addEventListener?.('sortChanged', updateSavedState);

      if (quickFilterInitialValue) {
        setQuickFilterValue(quickFilterInitialValue);
        if (isServerMode) {
          enhancedApi.refreshServerSideStore?.({ purge: true });
        } else {
          enhancedApi.setGridOption?.('quickFilterText', quickFilterInitialValue);
        }
      }

      if (
        dataSourceMode === 'server' &&
        createServerSideDatasource &&
        !serverDataSourceRef.current &&
        typeof enhancedApi.setGridOption === 'function' &&
        enhancedApi.getGridOption?.('rowModelType') === 'serverSide'
      ) {
        const dataSource = createServerSideDatasource({
          gridApi: enhancedApi,
          columnApi: params.columnApi,
        });
        if (dataSource) {
          serverDataSourceRef.current = dataSource;
          enhancedApi.setGridOption?.('serverSideDatasource', dataSource);
          if (process.env.NODE_ENV !== 'production') {
            console.debug('[EntityGridTemplate] datasource attached (onGridReady) — not a fetch; grid will request data next');
          }
        }
      }

      if (dataSourceMode === 'client') {
        setClientRowData((rowData ?? []).slice());
      }

      onGridReady?.({ ...params, api: enhancedApi });
    },
    [dataSourceMode, quickFilterInitialValue, onGridReady, rowData, createServerSideDatasource, isServerMode],
  );

  // Mod değişiminde SSRM datasource referansını sıfırla.
  // Server -> Client geçişinde Grid rowModel değişir; yeniden Server'a dönünce datasource tekrar bağlanmalıdır.
  useEffect(() => {
    if (!isServerMode) {
      serverDataSourceRef.current = null;
    }
  }, [isServerMode]);

  useEffect(() => {
    if (!isServerMode) {
      return;
    }
    if (!gridApi || !columnApiRef.current) {
      return;
    }
    if (!createServerSideDatasource) {
      return;
    }
    // Eğer onGridReady içinde datasource bağlandıysa burada hiçbir şey yapma
    if (serverDataSourceRef.current) return;
    const dataSource = createServerSideDatasource({
      gridApi,
      columnApi: columnApiRef.current,
    });
    if (dataSource && dataSource !== serverDataSourceRef.current) {
      serverDataSourceRef.current = dataSource;
      // İlk bağlama (effect): sadece datasource'u set et; AG Grid yüklemeyi başlatır
      gridApi.setGridOption?.('serverSideDatasource', dataSource);
      if (process.env.NODE_ENV !== 'production') {
        console.debug('[EntityGridTemplate] datasource reattached (effect) — not a fetch; grid will request data next');
      }
    }
  }, [isServerMode, gridApi, createServerSideDatasource]);

  const handleExcelExport = useCallback(
    (scope: 'visible' | 'all') => {
      if (!gridApi) {
        pushToast('warning', 'Tablo henüz hazır değil.');
        return;
      }
      const exportParams: ExcelExportParams<RowData> = {
        fileName: scope === 'all' ? `${exportBaseName}_tum.xlsx` : `${exportBaseName}_gorunur.xlsx`,
        sheetName: exportSheetName,
        allColumns: scope === 'all',
        processCellCallback: exportProcessCellCallback,
        // Bazı AG Grid sürümlerinde tüm satırlar için açık parametre
        exportAllRows: true,
      };
      const serverSideExporter = gridApi.serverSideExcelExport;
      gridApi.refreshServerSideStore?.({ purge: false });
      if (isServerMode && typeof serverSideExporter === 'function') {
        try {
          serverSideExporter(exportParams);
          if (process.env.NODE_ENV !== 'production') {
            console.debug('[EntityGridTemplate] serverSideExcelExport invoked', { exportParams });
          }
        } catch (err) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('[EntityGridTemplate] serverSideExcelExport failed, falling back to client export', err);
          }
          gridApi.exportDataAsExcel(exportParams);
        }
        return;
      }
      gridApi.exportDataAsExcel(exportParams);
    },
    [gridApi, exportBaseName, exportSheetName, exportProcessCellCallback, isServerMode, pushToast],
  );

  const handleCsvExport = useCallback(
    (scope: 'visible' | 'all') => {
      if (!gridApi) {
        pushToast('warning', 'Tablo henüz hazır değil.');
        return;
      }
      gridApi.exportDataAsCsv({
        fileName: scope === 'all' ? `${csvBaseName}_tum.csv` : `${csvBaseName}_gorunur.csv`,
        allColumns: scope === 'all',
        onlySelected: false,
        columnSeparator: csvSeparator,
        bom: csvBom,
        processCellCallback: exportProcessCellCallback,
      });
    },
    [gridApi, csvBaseName, csvSeparator, csvBom, exportProcessCellCallback, pushToast],
  );

  const handleThemeChange = useCallback((value: ThemeValue) => {
    setGridTheme(value);
  }, []);

  const handlePageSizeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (isServerMode) {
        return;
      }
      const parsed = Number(event.target.value);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        return;
      }
      onPageChange(1, parsed);
    },
    [isServerMode, onPageChange],
  );

  const handleResetFilters = useCallback(() => {
    if (!gridApi) {
      pushToast('warning', 'Tablo henüz hazır değil.');
      return;
    }
    gridApi.setFilterModel(null);
    gridApi.setAdvancedFilterModel?.(null);
    gridApi.onFilterChanged?.();
    if (!isServerMode) {
      gridApi.refreshClientSideRowModel?.('filter');
      gridApi.setGridOption?.('quickFilterText', '');
    }
    setQuickFilterValue('');
    pushToast('success', 'Filtreler sıfırlandı.');
  }, [gridApi, isServerMode, pushToast]);

  const activeVariant = useMemo(
    () => (activeVariantId ? variants.find((variant) => variant.id === activeVariantId) : undefined),
    [variants, activeVariantId],
  );

  const personalVariants = useMemo(
    () =>
      variants
        .filter((variant) => !variant.isGlobal)
        .slice()
        .sort(compareGridVariants),
    [variants],
  );

  const globalVariants = useMemo(
    () =>
      variants
        .filter((variant) => variant.isGlobal)
        .slice()
        .sort(compareGridVariants),
    [variants],
  );

  const variantOptions = useMemo(
    () =>
      variants.map((variant) => ({
        value: variant.id,
        label: `${normalizeVariantName(variant.name)}`
          + `${variant.isGlobal ? ' (Global)' : ''}`
          + `${variant.isGlobalDefault ? ' (Global Varsayılan)' : ''}`
          + `${!variant.isGlobal && variant.isUserDefault ? ' (Varsayılan)' : ''}`
          + `${variant.isCompatible ? '' : ' (Uyumsuz)'}`,
        disabled: !variant.isCompatible,
      })),
    [variants],
  );

  const handleVariantSelect = useCallback(
    (variantId?: string) => {
      void (async () => {
        if (!variantId) {
          const previousVariantId = appliedVariantRef.current;
          setActiveVariantId(null);
          appliedVariantRef.current = null;
          setEditingVariantId(null);
          setEditingVariantName('');
          if (!previousVariantId) {
            return;
          }
          setPreferenceTargetId(previousVariantId);
          try {
            await updateVariantPreferenceAsync({
              variantId: previousVariantId,
              isSelected: false,
            });
          } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
              console.error('Varyant tercihi sıfırlanamadı', error);
            }
          } finally {
            setPreferenceTargetId(null);
          }
          return;
        }
        const variant = variants.find((item) => item.id === variantId);
        if (!variant) {
          pushToast('warning', 'Seçilen varyant bulunamadı.');
          return;
        }
        if (!variant.isCompatible) {
          pushToast('warning', 'Bu varyant mevcut tablo yapısıyla uyumsuz.');
          return;
        }
        const previousVariantId = appliedVariantRef.current;
        setEditingVariantId(null);
        setEditingVariantName('');
        setPreferenceTargetId(variant.id);
        applyVariant(variant);
        try {
          await updateVariantPreferenceAsync({
            variantId: variant.id,
            isSelected: true,
          });
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            console.error('Varyant tercihi güncellenemedi', error);
          }
          pushToast('error', error instanceof Error ? error.message : 'Varyant tercihi güncellenemedi.');
          const fallback =
            previousVariantId && previousVariantId !== variant.id
              ? variants.find((item) => item.id === previousVariantId && item.isCompatible)
              : null;
          if (fallback) {
            applyVariant(fallback);
          } else {
            const nextId = previousVariantId ?? null;
            setActiveVariantId(nextId);
            appliedVariantRef.current = nextId;
          }
        } finally {
          setPreferenceTargetId(null);
        }
      })();
    },
    [variants, applyVariant, updateVariantPreferenceAsync, pushToast],
  );

  useEffect(() => {
    if (!initialVariantId) {
      initialVariantAppliedRef.current = null;
      return;
    }
    if (initialVariantAppliedRef.current === initialVariantId) {
      return;
    }
    const targetExists = variants.some(
      (variant) => variant.id === initialVariantId && variant.isCompatible,
    );
    if (!targetExists) {
      return;
    }
    initialVariantAppliedRef.current = initialVariantId;
    handleVariantSelect(initialVariantId);
  }, [initialVariantId, variants, handleVariantSelect]);

  const handleOpenVariantManager = useCallback(() => {
    setNewVariantName('');
    setNewVariantDefault(false);
    setEditingVariantId(null);
    setEditingVariantName('');
    setNewVariantGlobal(false);
    setNewVariantGlobalDefault(false);
    setNewVariantOpen(false);
    setExpandedVariantId(null);
    setVariantMenuOpenId(null);
    setVariantManagerOpen(true);
  }, []);

  const handleCloseVariantManager = useCallback(() => {
    if (isCreatingVariant || isUpdatingVariant || isDeletingVariant) {
      return;
    }
    setVariantManagerOpen(false);
    setNewVariantName('');
    setNewVariantDefault(false);
    setEditingVariantId(null);
    setEditingVariantName('');
    setNewVariantGlobal(false);
    setNewVariantGlobalDefault(false);
    setNewVariantOpen(false);
    setExpandedVariantId(null);
    setVariantMenuOpenId(null);
  }, [isCreatingVariant, isUpdatingVariant, isDeletingVariant]);

  const handleSaveVariantState = useCallback(
    async (variant: GridVariant) => {
      if (!variant.isCompatible) {
        pushToast('warning', 'Bu varyant uyumsuz olduğu için kaydedilemez.');
        return;
      }
      const state = collectGridState();
      if (!state) {
        return;
      }
      try {
        await updateVariantAsync({
          id: variant.id,
          state,
          schemaVersion: gridSchemaVersion,
        });
        pushToast('success', 'Varyant kaydedildi.');
        appliedVariantRef.current = variant.id;
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Varyant kaydedilemedi', error);
        }
        pushToast('error', error instanceof Error ? error.message : 'Varyant kaydedilemedi.');
      }
    },
    [collectGridState, updateVariantAsync, gridSchemaVersion, pushToast],
  );

  const handleStartVariantRename = useCallback((variant: GridVariant) => {
    setEditingVariantId(variant.id);
    setEditingVariantName(normalizeVariantName(variant.name));
  }, []);

  const handleCancelVariantRename = useCallback(() => {
    setEditingVariantId(null);
    setEditingVariantName('');
  }, []);

  const handleConfirmVariantRename = useCallback(
    async (variant: GridVariant) => {
      const trimmed = (editingVariantName || '').trim();
      if (!trimmed) {
        pushToast('warning', 'Varyant adı boş olamaz.');
        return;
      }
      const currentName = normalizeVariantName(variant.name);
      if (trimmed === currentName) {
        handleCancelVariantRename();
        return;
      }
      try {
        await updateVariantAsync({ id: variant.id, name: trimmed });
        pushToast('success', 'Varyant adı güncellendi.');
        handleCancelVariantRename();
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Varyant adı güncellenemedi', error);
        }
        pushToast('error', error instanceof Error ? error.message : 'Varyant adı güncellenemedi.');
      }
    },
    [editingVariantName, updateVariantAsync, handleCancelVariantRename, pushToast],
  );

  const handleToggleGlobalVariant = useCallback(
    async (variant: GridVariant) => {
      const nextGlobal = !variant.isGlobal;
      try {
        await updateVariantAsync({
          id: variant.id,
          isGlobal: nextGlobal,
          isGlobalDefault: nextGlobal ? variant.isGlobalDefault : false,
        });
        pushToast('success', nextGlobal ? 'Varyant global olarak paylaşıldı.' : 'Varyant artık yalnızca size özel.');
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Varyant güncellenemedi', error);
        }
        pushToast('error', error instanceof Error ? error.message : 'Varyant global durumu güncellenemedi.');
      }
    },
    [updateVariantAsync, pushToast],
  );

  const handleToggleGlobalDefault = useCallback(
    async (variant: GridVariant) => {
      const nextGlobalDefault = !variant.isGlobalDefault;
      try {
        await updateVariantAsync({
          id: variant.id,
          isGlobal: nextGlobalDefault ? true : variant.isGlobal,
          isGlobalDefault: nextGlobalDefault,
        });
        pushToast('success', nextGlobalDefault ? 'Global varsayılan güncellendi.' : 'Global varsayılan kaldırıldı.');
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Global varsayılan güncellenemedi', error);
        }
        pushToast('error', error instanceof Error ? error.message : 'Global varsayılan güncellenemedi.');
      }
    },
    [updateVariantAsync, pushToast],
  );

  const handleCancelNewVariant = useCallback(() => {
    if (isCreatingVariant) {
      return;
    }
    setNewVariantOpen(false);
    setNewVariantName('');
    setNewVariantDefault(false);
    setNewVariantGlobal(false);
    setNewVariantGlobalDefault(false);
  }, [isCreatingVariant]);

  const handleStartNewVariant = useCallback(() => {
    setNewVariantName('');
    setNewVariantDefault(false);
    setNewVariantGlobal(false);
    setNewVariantGlobalDefault(false);
    setNewVariantOpen(true);
  }, []);

  const handleCreateNewVariant = useCallback(async () => {
    if (!newVariantName.trim()) {
      pushToast('warning', 'Yeni varyant adı boş olamaz.');
      return;
    }
    const state = collectGridState();
    if (!state) {
      return;
    }
    try {
      const created = await createVariantAsync({
        gridId,
        name: newVariantName.trim(),
        isDefault: newVariantDefault,
        isGlobal: newVariantGlobal || newVariantGlobalDefault,
        isGlobalDefault: newVariantGlobalDefault,
        schemaVersion: gridSchemaVersion,
        state,
      });
      pushToast('success', 'Varyant oluşturuldu.');
      setNewVariantName('');
      setNewVariantDefault(false);
      setNewVariantGlobal(false);
      setNewVariantGlobalDefault(false);
      setNewVariantOpen(false);
      setActiveVariantId(created.id);
      appliedVariantRef.current = created.id;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Varyant oluşturulamadı', error);
      }
      pushToast('error', error instanceof Error ? error.message : 'Varyant oluşturulamadı.');
    }
  }, [
    collectGridState,
    createVariantAsync,
    gridId,
    gridSchemaVersion,
    newVariantDefault,
    newVariantGlobal,
    newVariantGlobalDefault,
    newVariantName,
    pushToast,
  ]);

  const handleSetDefaultVariantFor = useCallback(
    async (variant: GridVariant, makeDefault: boolean) => {
      if ((variant.isUserDefault ?? false) === makeDefault) {
        return;
      }
      setPreferenceTargetId(variant.id);
      try {
        const updated = await toggleVariantDefault(variant, makeDefault, {
          updateVariant: updateVariantAsync,
          updatePreference: updateVariantPreferenceAsync,
        });
        pushToast('success', 
          makeDefault ? 'Varsayılan görünüm olarak işaretlendi.' : 'Varsayılan görünümden çıkarıldı.',
        );
        appliedVariantRef.current = updated.id;
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Varsayılan durum değiştirilemedi', error);
        }
        pushToast('error', error instanceof Error ? error.message : 'Varsayılan durum güncellenemedi.');
      } finally {
        setPreferenceTargetId(null);
      }
    },
    [updateVariantAsync, updateVariantPreferenceAsync, pushToast],
  );

  const handleSetUserDefaultForGlobal = useCallback(
    async (variant: GridVariant, makeDefault: boolean) => {
      if ((variant.isUserDefault ?? false) === makeDefault) {
        return;
      }
      setPreferenceTargetId(variant.id);
      try {
        const updated = await updateVariantPreferenceAsync({
          variantId: variant.id,
          isDefault: makeDefault,
          isSelected: makeDefault || undefined,
        });
        pushToast('success', 
          makeDefault ? 'Global varyant varsayılanınız oldu.' : 'Global varyant varsayılanınızdan çıkarıldı.',
        );
        appliedVariantRef.current = updated.id;
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Varyant tercihi güncellenemedi', error);
        }
        pushToast('error', error instanceof Error ? error.message : 'Varyant tercihi güncellenemedi.');
      } finally {
        setPreferenceTargetId(null);
      }
    },
    [updateVariantPreferenceAsync, pushToast],
  );

  const handleDeleteVariant = useCallback(
    async (variant: GridVariant) => {
      const confirmed = window.confirm(
        `${normalizeVariantName(variant.name)} adlı görünümü silmek istediğinize emin misiniz?`,
      );
      if (!confirmed) {
        return;
      }
      try {
        await deleteVariantAsync(variant.id);
        pushToast('success', 'Varyant silindi.');
        if (activeVariantId === variant.id) {
          setActiveVariantId(null);
          appliedVariantRef.current = null;
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Varyant silinemedi', error);
        }
        pushToast('error', error instanceof Error ? error.message : 'Varyant silinemedi.');
      }
    },
    [deleteVariantAsync, activeVariantId, pushToast],
  );

  const renderVariantRow = useCallback(
    (variant: GridVariant) => {
      const isActive = activeVariant?.id === variant.id;
      const isEditing = editingVariantId === variant.id;
      const isExpanded = expandedVariantId === variant.id;
      const displayName = normalizeVariantName(variant.name);
      const saveCurrentDisabled = !variant.isCompatible || isUpdatingVariant;
      const isRenameDisabled = editingVariantName.trim().length === 0;
      const isMenuOpen = variantMenuOpenId === variant.id;

      const menuItems = [
        {
          key: 'select',
          label: 'Görünümü uygula',
          icon: <IconCheckCircle />,
          disabled: !variant.isCompatible,
        },
        {
          key: 'rename',
          label: 'Yeniden adlandır',
          icon: <IconEdit />,
        },
        {
          key: variant.isUserDefault ? 'unsetDefault' : 'setDefault',
          label: variant.isUserDefault ? 'Varsayılanımdan çıkar' : 'Varsayılanım yap',
          icon: variant.isUserDefault ? <IconStarOutlined /> : <IconStarFilled />,
          disabled: isUpdatingPreference && preferenceTargetId === variant.id,
        },
        variant.isGlobal
          ? {
              key: variant.isGlobalDefault ? 'unsetGlobalDefault' : 'setGlobalDefault',
              label: variant.isGlobalDefault ? 'Global varsayılanı kaldır' : 'Global varsayılan yap',
              icon: <IconGlobal />,
            }
          : {
              key: 'toggleGlobal',
              label: variant.isGlobal ? 'Kişisele taşı' : 'Globale taşı',
              icon: variant.isGlobal ? <IconUserSwitch /> : <IconGlobal />,
            },
        { key: 'divider', label: '-' },
        {
          key: 'delete',
          label: 'Sil',
          icon: <IconDelete />,
          danger: true,
        },
      ] as const;

      const handleMenuClick = (key: string) => {
        if (key === 'select') {
          applyVariant(variant);
          return;
        }
        if (key === 'rename') {
          handleStartVariantRename(variant);
          return;
        }
        if (key === 'setDefault') {
          handleSetDefaultVariantFor(variant, true);
          return;
        }
        if (key === 'unsetDefault') {
          handleSetDefaultVariantFor(variant, false);
          return;
        }
        if (key === 'setGlobalDefault') {
          handleToggleGlobalDefault(variant);
          return;
        }
        if (key === 'unsetGlobalDefault') {
          handleToggleGlobalDefault(variant);
          return;
        }
        if (key === 'toggleGlobal') {
          handleToggleGlobalVariant(variant);
          return;
        }
        if (key === 'delete') {
          handleDeleteVariant(variant);
        }
      };

      return (
        <div
          key={variant.id}
          className={`rounded-2xl border p-4 transition ${
            isActive ? 'border-border-bold bg-surface-panel' : 'border-border-subtle bg-surface'
          }`}
          style={{ boxShadow: isActive ? 'var(--elevation-surface)' : 'var(--elevation-overlay)' }}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {isEditing ? (
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    className={`${toolbarInputClass} max-w-xs`}
                    value={editingVariantName}
                    onChange={(event) => setEditingVariantName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handleConfirmVariantRename(variant);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className={variantPrimaryButtonClass}
                    onClick={() => handleConfirmVariantRename(variant)}
                    disabled={isRenameDisabled || isUpdatingVariant}
                  >
                    <IconSave /> Kaydet
                  </button>
                  <button
                    type="button"
                    className={variantButtonClass}
                    onClick={handleCancelVariantRename}
                    disabled={isUpdatingVariant}
                  >
                    Vazgeç
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex max-w-full items-center truncate rounded-xl border border-border-subtle bg-selection px-3 py-1 text-sm font-semibold text-text-primary">
                    {displayName}
                  </span>
                  {isActive && (
                    <span className={`${variantTagClass} border-state-success-border bg-state-success text-state-success-text`}>
                      <IconCheckCircle /> Şu an seçili
                    </span>
                  )}
                  {variant.isGlobal ? (
                    <span className={`${variantTagClass} border-state-info-border bg-state-info text-state-info-text`}>
                      <IconGlobal /> {variant.isGlobalDefault ? 'Herkese Açık · Varsayılan' : 'Herkese Açık'}
                    </span>
                  ) : (
                    <span className={`${variantTagClass} border-border-subtle bg-surface-muted text-text-secondary`}>
                      <IconUser /> Kişisel
                    </span>
                  )}
                  {variant.isUserDefault && (
                    <span className={`${variantTagClass} border-state-warning-border bg-state-warning text-state-warning-text`}>
                      <IconStarFilled /> Kişisel Varsayılanım
                    </span>
                  )}
                  {variant.isUserSelected && !variant.isUserDefault && (
                    <span className={`${variantTagClass} border-selection bg-selection text-text-primary`}>Son kullanılan</span>
                  )}
                  {!variant.isCompatible && (
                    <span className={`${variantTagClass} border-state-danger-border bg-state-danger text-state-danger-text`}>Uyumsuz</span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={variantIconButtonClass}
                onClick={() => setExpandedVariantId((prev) => (prev === variant.id ? null : variant.id))}
                title={isExpanded ? 'Detayları gizle' : 'Detayları göster'}
                aria-label={isExpanded ? 'Detayları gizle' : 'Detayları göster'}
              >
                {isExpanded ? <IconUp /> : <IconDown />}
              </button>
              <div className="relative" onClick={(event) => event.stopPropagation()}>
                <button
                  type="button"
                  className={variantIconButtonClass}
                  onClick={(event) => {
                    event.stopPropagation();
                    setVariantMenuOpenId((prev) => (prev === variant.id ? null : variant.id));
                  }}
                  aria-label="Varyant işlemleri"
                  title="Varyant işlemleri"
                >
                  <IconEllipsis />
                </button>
                {isMenuOpen && (
                  <div
                    className="absolute right-0 top-10 z-20 w-56 rounded-2xl border border-border-subtle bg-surface-panel p-1"
                    style={{ boxShadow: 'var(--elevation-overlay)' }}
                  >
                    {menuItems.map((item) =>
                      item.key === 'divider' ? (
                        <div key="divider" className="my-1 border-t border-border-subtle" />
                      ) : (
                        <button
                          key={item.key}
                          type="button"
                          className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                            item.danger ? 'text-state-danger-text hover:bg-state-danger' : 'text-text-primary hover:bg-surface-muted'
                          } ${item.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                          disabled={item.disabled}
                          onClick={() => {
                            handleMenuClick(item.key);
                            setVariantMenuOpenId(null);
                          }}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {isExpanded && (
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className={variantButtonClass}
                  onClick={() => handleToggleGlobalVariant(variant)}
                  disabled={isUpdatingVariant}
                  title={variant.isGlobal ? 'Bu varyantı kişisel alana taşı' : 'Bu varyantı tüm kullanıcılara aç'}
                >
                  {variant.isGlobal ? <IconUserSwitch /> : <IconGlobal />}
                  {variant.isGlobal ? 'Kişisele taşı' : 'Globale taşı'}
                </button>
                <button
                  type="button"
                  className={variantButtonClass}
                  onClick={() => handleSaveVariantState(variant)}
                  disabled={saveCurrentDisabled}
                  title="Güncel tablo düzenini bu varyanta kaydet"
                >
                  <IconSave />
                  Durumu kaydet
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                <SwitchControl
                  checked={Boolean(variant.isUserDefault)}
                  onChange={(checked) => {
                    if (variant.isGlobal) {
                      handleSetUserDefaultForGlobal(variant, checked);
                    } else {
                      handleSetDefaultVariantFor(variant, checked);
                    }
                  }}
                  loading={isUpdatingPreference && preferenceTargetId === variant.id}
                  label="Kişisel varsayılanım"
                />
                <span className="text-xs font-medium">Kişisel varsayılanım</span>
              </div>

              {variant.isGlobal && (
                <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                  <SwitchControl
                    checked={variant.isGlobalDefault}
                    onChange={() => handleToggleGlobalDefault(variant)}
                    loading={isUpdatingVariant}
                    label="Global varsayılan"
                  />
                  <span className="text-xs font-medium">Global varsayılan</span>
                </div>
              )}
            </div>
          )}
        </div>
      );
    },
    [
      activeVariant,
      applyVariant,
      editingVariantId,
      editingVariantName,
      expandedVariantId,
      handleCancelVariantRename,
      handleConfirmVariantRename,
      handleDeleteVariant,
      handleSaveVariantState,
      handleSetDefaultVariantFor,
      handleSetUserDefaultForGlobal,
      handleStartVariantRename,
      handleToggleGlobalDefault,
      handleToggleGlobalVariant,
      isUpdatingPreference,
      isUpdatingVariant,
      preferenceTargetId,
      variantMenuOpenId,
    ],
  );

  const renderNewVariantRow = useCallback(() => {
    if (!isNewVariantOpen) {
      return (
        <button
          key="new-variant-button"
          type="button"
          className={`${variantButtonClass} border-dashed`}
          onClick={handleStartNewVariant}
        >
          <IconPlus />
          {variantNewButtonLabel}
        </button>
      );
    }

    return (
      <div
        key="new-variant"
        className="flex flex-wrap items-center gap-3"
      >
        <input
          placeholder={variantNamePlaceholder}
          value={newVariantName}
          onChange={(event) => setNewVariantName(event.target.value)}
          maxLength={120}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleCreateNewVariant();
            }
          }}
          disabled={isCreatingVariant}
          className={`${toolbarInputClass} flex-1`}
        />
        <div className="flex items-center gap-2 text-text-subtle">
          <button
            type="button"
            className={`${variantIconButtonClass} ${
              newVariantGlobal ? 'border-state-info-border bg-state-info text-state-info-text' : ''
            }`}
            onClick={() => {
              if (isCreatingVariant) return;
              const next = !newVariantGlobal;
              setNewVariantGlobal(next);
              if (!next) {
                setNewVariantGlobalDefault(false);
              }
            }}
            title={newVariantGlobal ? 'Kişisel varyanta dönüştür' : 'Global varyant yap'}
            disabled={isCreatingVariant}
          >
            {newVariantGlobal ? <IconUserSwitch /> : <IconGlobal />}
          </button>
          <button
            type="button"
            className={`${variantIconButtonClass} ${
              newVariantGlobalDefault ? 'border-state-warning-border bg-state-warning text-state-warning-text' : ''
            }`}
            onClick={() => {
              if (isCreatingVariant) return;
              const next = !newVariantGlobalDefault;
              setNewVariantGlobalDefault(next);
              if (next) {
                setNewVariantGlobal(true);
              }
            }}
            title={newVariantGlobalDefault ? 'Global varsayılanı kaldır' : 'Global varsayılan yap'}
            disabled={isCreatingVariant}
          >
            {newVariantGlobalDefault ? <IconStarFilled /> : <IconStarOutlined />}
          </button>
          <button
            type="button"
            className={`${variantIconButtonClass} ${
              newVariantDefault ? 'border-state-success-border bg-state-success text-state-success-text' : ''
            }`}
            onClick={() => {
              if (isCreatingVariant) return;
              setNewVariantDefault((prev) => !prev);
            }}
            title={newVariantDefault ? 'Kişisel varsayılanı kaldır' : 'Kişisel varsayılan yap'}
            disabled={isCreatingVariant}
          >
            {newVariantDefault ? <IconStarFilled /> : <IconStarOutlined />}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={variantPrimaryButtonClass}
            onClick={handleCreateNewVariant}
            disabled={!newVariantName.trim() || isCreatingVariant}
            title="Kaydet"
          >
            <IconSave />
          </button>
          <button
            type="button"
            className={variantButtonClass}
            onClick={handleCancelNewVariant}
            disabled={isCreatingVariant}
          >
            Vazgeç
          </button>
        </div>
      </div>
    );
  }, [
    handleCancelNewVariant,
    handleCreateNewVariant,
    handleStartNewVariant,
    isCreatingVariant,
    isNewVariantOpen,
    newVariantDefault,
    newVariantGlobal,
    newVariantGlobalDefault,
    newVariantName,
    variantNamePlaceholder,
    variantNewButtonLabel,
  ]);

  return (
    <>
      <div
        {...gridScopeAttributes}
        style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: isFullscreen ? 1 : undefined, height: isFullscreen ? '100%' : 'auto' }}
      >
        <div
          className={`flex flex-wrap items-center gap-3 ${isFullscreen ? 'max-w-[640px]' : ''}`}
        >
        <button
          type="button"
          className={toolbarIconButtonClass}
          onClick={handleOpenFullscreen}
          title={fullscreenTooltip}
          aria-label={fullscreenTooltip}
        >
          <IconFullscreen />
        </button>

        <label className={toolbarLabelClass}>
          <span>{themeLabel}</span>
          <select
            className={toolbarSelectClass}
            value={gridTheme}
            onChange={(event) => handleThemeChange(event.target.value as ThemeValue)}
            aria-label={themeLabel}
          >
            {themeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className={toolbarLabelClass}>
          <span>{densityToggleLabel}</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={comfortableButtonClass}
              aria-label={comfortableDensityLabel}
              aria-pressed={comfortableSelected}
              onClick={() => handleLocalDensitySelect('comfortable')}
            >
              {comfortableDensityLabel}
            </button>
            <button
              type="button"
              className={compactButtonClass}
              aria-label={compactDensityLabel}
              aria-pressed={compactSelected}
              onClick={() => handleLocalDensitySelect('compact')}
            >
              {compactDensityLabel}
            </button>
            {!isUsingGlobalDensity && (
              <button
                type="button"
                className={variantButtonClass}
                onClick={handleLocalDensityReset}
                aria-label={densityResetLabel}
              >
                ↺ <span>{densityResetLabel}</span>
              </button>
            )}
          </div>
          <span className="text-[11px] font-medium text-text-subtle">{densityStatusMessage}</span>
        </label>

        {showQuickFilter && (
          <label className={toolbarLabelClass}>
            <span>{quickFilterLabel}</span>
            <input
              className={toolbarInputClass}
              placeholder={quickFilterPlaceholder}
              value={quickFilterValue}
              onChange={(event) => handleQuickFilterChange(event.target.value)}
              type="text"
              aria-label={quickFilterLabel}
            />
          </label>
        )}

        <label className={toolbarLabelClass}>
          <span>{variantLabel}</span>
          <div className="flex items-center gap-2">
            <select
              data-testid="report-variant-select"
              className={toolbarSelectClass}
              disabled={variantOptions.length === 0 || variantsLoading}
              value={activeVariantId ?? ''}
              onChange={(event) => handleVariantSelect(event.target.value || undefined)}
              aria-label={variantLabel}
            >
              <option value="">
                {variantsLoading ? 'Varyantlar yükleniyor...' : 'Varyant seç...'}
              </option>
              {variantOptions.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))}
            </select>
            {activeVariantId && (
              <button
                type="button"
                className={toolbarIconButtonClass}
                onClick={() => handleVariantSelect(undefined)}
                aria-label="Varyant seçimini temizle"
                title="Varyant seçimini temizle"
              >
                ✕
              </button>
            )}
          </div>
        </label>

        {!isFullscreen && (
          <>
            <div className="flex-1" />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className={toolbarIconButtonClass}
                onClick={handleOpenVariantManager}
                disabled={variantsLoading || variantsFetching}
                title="Varyantları yönet"
                aria-label="Varyantları yönet"
              >
                <IconSettings />
              </button>
              <button
                type="button"
                className={toolbarSecondaryButtonClass}
                onClick={handleResetFilters}
                disabled={!gridApi}
                title="Tüm sütun filtrelerini temizle"
              >
                <IconReload />
                {/* Reset filters label i18n'den override edilebilir */}
                <span data-testid="grid-reset-filters-label">{resetFiltersLabel}</span>
              </button>
              <button
                type="button"
                className={toolbarSecondaryButtonClass}
                onClick={() => handleExcelExport('visible')}
                disabled={!gridApi}
                title="Görünür satırları Excel formatında indir"
              >
                <IconFileExcel />
                <span data-testid="grid-excel-visible-label">{excelVisibleLabel}</span>
              </button>
              <button
                type="button"
                className={toolbarSecondaryButtonClass}
                onClick={() => handleExcelExport('all')}
                disabled={!gridApi}
                title="Tüm veri setini Excel olarak indir"
              >
                <IconDownload />
                <span data-testid="grid-excel-all-label">{excelAllLabel}</span>
              </button>
              <button
                type="button"
                className={toolbarSecondaryButtonClass}
                onClick={() => handleCsvExport('visible')}
                disabled={!gridApi}
                title="Görünür satırları CSV olarak indir"
              >
                <IconFileText />
                <span data-testid="grid-csv-visible-label">{csvVisibleLabel}</span>
              </button>
              <button
                type="button"
                className={toolbarSecondaryButtonClass}
                onClick={() => handleCsvExport('all')}
                disabled={!gridApi}
                title="Tüm veri setini CSV olarak indir"
              >
                <span data-testid="grid-csv-all-label">{csvAllLabel}</span>
              </button>
              {toolbarExtras}
            </div>
          </>
        )}
        </div>

        <div style={gridContainerStyle}>
          <div
            className={themeClassName}
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              background: 'var(--table-surface-bg)',
              border: '1px solid var(--table-surface-border)',
              borderRadius: 'var(--ag-card-radius)',
            }}
          >
            <div style={{ flex: 1, minHeight: 0 }}>
              <AgGridReact<RowData>
                key={gridInstanceKey}
                modules={agModules}
                rowData={isServerMode ? undefined : clientRowData}
                columnDefs={columnDefs}
                defaultColDef={resolvedDefaultColDef}
                gridOptions={resolvedGridOptions}
                excelStyles={resolvedExcelStyles}
                rowSelection={rowSelection}
                overlayLoadingTemplate={overlayLoadingTemplate}
                overlayNoRowsTemplate={overlayNoRowsTemplate}
                rowHeight={resolvedRowHeight}
                animateRows
                sideBar={resolvedSideBar}
                onGridReady={handleGridReady}
                localeText={resolvedLocaleText}
                rowModelType={isServerMode ? 'serverSide' : 'clientSide'}
                onRowDoubleClicked={(event) => {
                  if (event.data && onRowDoubleClick) {
                    onRowDoubleClick(event.data);
                  }
                }}
              />
            </div>
            {!isServerMode && (
              <div
                className="ag-pagination-panel ag-unselectable"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 'calc(var(--ag-grid-size) * 2)',
                  padding: '0 calc(var(--ag-grid-size) * 2)',
                  minHeight: 'max(calc(var(--ag-grid-size) * 6), var(--ag-row-height))',
                  borderTop: '1px solid var(--ag-row-border-color)',
                  borderLeft: '1px solid var(--ag-border-color)',
                  borderRight: '1px solid var(--ag-border-color)',
                  borderBottom: '1px solid var(--ag-border-color)',
                  background: 'var(--ag-background-color)',
                  borderBottomLeftRadius: 'var(--ag-card-radius)',
                  borderBottomRightRadius: 'var(--ag-card-radius)',
                  marginTop: '-1px',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label
                    htmlFor={resolvedPageSizeSelectId}
                    style={{
                      fontWeight: 500,
                      color: 'var(--ag-foreground-color)',
                    }}
                  >
                    Sayfa boyutu:
                  </label>
                  <select
                    id={resolvedPageSizeSelectId}
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    style={{
                      minWidth: 80,
                      height: 'var(--ag-row-height)',
                      borderRadius: 'var(--ag-border-radius)',
                      border: '1px solid var(--ag-border-color)',
                      padding: '0 8px',
                      background: 'var(--ag-input-background-color)',
                      color: 'var(--ag-foreground-color)',
                      fontSize: 'var(--ag-font-size)',
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                    }}
                  >
                    {resolvedPageSizeOptions.map((size) => (
                      <option key={size} value={size}>
                        {formatNumber(size)}
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    justifyContent: 'flex-start',
                    color: 'var(--ag-secondary-foreground-color)',
                  }}
                >
                  <span style={{ fontWeight: 500, color: 'var(--ag-foreground-color)' }}>
                    {formatNumber(recordStart)}
                  </span>
                  <span>-</span>
                  <span style={{ fontWeight: 500, color: 'var(--ag-foreground-color)' }}>
                    {formatNumber(recordEnd)}
                  </span>
                  <span>
                    / {formatNumber(effectiveTotal)} kayıt
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    className="ag-paging-button"
                    onClick={handleFirstPage}
                    disabled={!canGoPrevious}
                    aria-label="İlk sayfa"
                    title="İlk sayfa"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 28,
                      height: 28,
                      border: '1px solid var(--ag-border-color)',
                      borderRadius: 'var(--ag-border-radius)',
                      background: 'var(--ag-background-color)',
                      cursor: canGoPrevious ? 'pointer' : 'not-allowed',
                      opacity: canGoPrevious ? 1 : 0.45,
                      transition: 'background 0.2s, opacity 0.2s',
                    }}
                  >
                    <span className="ag-icon ag-icon-first" />
                  </button>
                  <button
                    type="button"
                    className="ag-paging-button"
                    onClick={handlePreviousPage}
                    disabled={!canGoPrevious}
                    aria-label="Önceki sayfa"
                    title="Önceki sayfa"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 28,
                      height: 28,
                      border: '1px solid var(--ag-border-color)',
                      borderRadius: 'var(--ag-border-radius)',
                      background: 'var(--ag-background-color)',
                      cursor: canGoPrevious ? 'pointer' : 'not-allowed',
                      opacity: canGoPrevious ? 1 : 0.45,
                      transition: 'background 0.2s, opacity 0.2s',
                    }}
                  >
                    <span className="ag-icon ag-icon-previous" />
                  </button>
                  <span style={{ fontWeight: 500, color: 'var(--ag-foreground-color)' }}>
                    Sayfa {formatNumber(hasData ? currentPage : 0)} / {formatNumber(hasData ? totalPages : 0)}
                  </span>
                  <button
                    type="button"
                    className="ag-paging-button"
                    onClick={handleNextPage}
                    disabled={!canGoNext}
                    aria-label="Sonraki sayfa"
                    title="Sonraki sayfa"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 28,
                      height: 28,
                      border: '1px solid var(--ag-border-color)',
                      borderRadius: 'var(--ag-border-radius)',
                      background: 'var(--ag-background-color)',
                      cursor: canGoNext ? 'pointer' : 'not-allowed',
                      opacity: canGoNext ? 1 : 0.45,
                      transition: 'background 0.2s, opacity 0.2s',
                    }}
                  >
                    <span className="ag-icon ag-icon-next" />
                  </button>
                  <button
                    type="button"
                    className="ag-paging-button"
                    onClick={handleLastPage}
                    disabled={!canGoNext}
                    aria-label="Son sayfa"
                    title="Son sayfa"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 28,
                      height: 28,
                      border: '1px solid var(--ag-border-color)',
                      borderRadius: 'var(--ag-border-radius)',
                      background: 'var(--ag-background-color)',
                      cursor: canGoNext ? 'pointer' : 'not-allowed',
                      opacity: canGoNext ? 1 : 0.45,
                      transition: 'background 0.2s, opacity 0.2s',
                    }}
                  >
                    <span className="ag-icon ag-icon-last" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isVariantManagerOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 py-10">
          <div
            className="absolute inset-0 bg-surface-overlay"
            style={{
              backgroundColor:
                'color-mix(in srgb, var(--surface-overlay-bg) calc(var(--overlay-intensity) * 1%), transparent)',
              opacity: 'var(--overlay-opacity)',
            }}
            aria-label="Varyant yöneticisini kapat"
            onClick={handleCloseVariantManager}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-xl rounded-3xl bg-surface-panel p-6"
            style={{ boxShadow: 'var(--elevation-overlay)' }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">{variantModalTitle}</h3>
              <button
                type="button"
                className={variantIconButtonClass}
                onClick={handleCloseVariantManager}
                aria-label="Varyant yöneticisini kapat"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-6">
              <section className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-subtle">Kişisel Varyantlar</p>
                {personalVariants.length === 0 && !isNewVariantOpen && (
                  <p className="rounded-2xl border border-dashed border-border-subtle px-4 py-6 text-center text-sm text-text-subtle">
                    Henüz kişisel varyant bulunmuyor.
                  </p>
                )}
                {personalVariants.map((variant) => renderVariantRow(variant))}
                {renderNewVariantRow()}
              </section>
              <hr className="border-border-subtle" />
              <section className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-subtle">Global Varyantlar</p>
                {globalVariants.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-border-subtle px-4 py-6 text-center text-sm text-text-subtle">
                    Henüz global varyant bulunmuyor.
                  </p>
                )}
                {globalVariants.map((variant) => renderVariantRow(variant))}
              </section>
            </div>
          </div>
        </div>
      )}

      {toasts.length > 0 && (
        <div
          data-testid="toast-stack"
          className="pointer-events-none fixed inset-x-0 top-4 z-[1200] flex flex-col items-center gap-2 px-4"
          aria-live="polite"
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              data-testid="toast-message"
              data-toast-kind={toast.kind}
              className={`pointer-events-auto flex min-w-[280px] max-w-md items-start gap-3 rounded-2xl px-4 py-3 ${toastStylesByKind[toast.kind]}`}
              style={{ boxShadow: 'var(--elevation-overlay)' }}
            >
              <span className="flex-1 text-sm font-medium">{toast.text}</span>
              <button
                type="button"
                aria-label="Bildirimi kapat"
                className="text-sm font-semibold text-text-inverse transition hover:opacity-80"
                onClick={() => removeToast(toast.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default EntityGridTemplate;
