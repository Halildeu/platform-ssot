/**
 * GridToolbar — Grid control bar.
 *
 * Responsibilities:
 * - Quick filter input with SSRM refresh support
 * - Density toggle (comfortable / compact)
 * - Theme selector dropdown
 * - Fullscreen toggle
 * - Excel / CSV export (2 buttons — always exports all filtered rows)
 * - Reset filters button
 * - Extensible extras slot
 */
import React, { useCallback, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { resolveAccessState, accessStyles, type AccessControlledProps } from '../../internal/access-controller';
import type { GridApi } from "ag-grid-community";
import type { GridTheme, GridDensity } from "./GridShell";
import type { GridExportConfig } from "./EntityGridTemplate";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface GridToolbarMessages {
  quickFilterPlaceholder?: string;
  densityComfortableLabel?: string;
  densityCompactLabel?: string;
  densityResetLabel?: string;
  themeLabel?: string;
  fullscreenLabel?: string;
  fullscreenTooltip?: string;
  resetFiltersLabel?: string;
  excelLabel?: string;
  csvLabel?: string;
  exportingLabel?: string;
}

/** Props for the GridToolbar component. */
export interface GridToolbarProps<RowData = unknown> extends AccessControlledProps {
  /** Reference to current GridApi */
  gridApi: GridApi<RowData> | null;
  /** Current theme */
  theme: GridTheme;
  /** Theme change handler */
  onThemeChange?: (theme: GridTheme) => void;
  /** Available theme options */
  themeOptions?: readonly { label: string; value: GridTheme }[];
  /** Current density */
  density: GridDensity;
  /** Density change handler */
  onDensityChange?: (density: GridDensity) => void;
  /** Whether grid is in server mode (affects quick filter behavior) */
  isServerMode?: boolean;
  /** Quick filter initial value */
  quickFilterInitialValue?: string;
  /** Quick filter value change handler */
  onQuickFilterChange?: (value: string) => void;
  /** Fullscreen handler */
  onRequestFullscreen?: () => void;
  /** Whether currently fullscreen */
  isFullscreen?: boolean;
  /** Export configuration */
  exportConfig?: GridExportConfig<RowData>;
  /**
   * Server-side export callback. Called when exporting in server mode.
   * Should fetch all filtered rows from backend and trigger file download.
   * Receives current filter model and sort model from the grid.
   */
  onServerExport?: (
    format: 'excel' | 'csv',
    params: { filterModel: Record<string, unknown>; sortModel: unknown[]; quickFilterText: string },
  ) => Promise<void>;
  /** i18n messages */
  messages?: GridToolbarMessages;
  /** Extra elements to render in toolbar */
  extras?: React.ReactNode;
  /** Variant selector slot (injected by VariantIntegration) */
  variantSlot?: React.ReactNode;
  /** Container className */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Inline export icons                                                */
/* ------------------------------------------------------------------ */

const ExcelIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
  </svg>
);

const CsvIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="11" y2="13" />
    <line x1="8" y1="17" x2="13" y2="17" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Default theme options                                              */
/* ------------------------------------------------------------------ */

const DEFAULT_THEME_OPTIONS: readonly { label: string; value: GridTheme }[] = [
  { label: "Quartz", value: "quartz" },
  { label: "Balham", value: "balham" },
  { label: "Alpine", value: "alpine" },
  { label: "Material", value: "material" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/** Toolbar strip for data grids with search, density toggle, theme switcher, and export.
 * Export buttons always export all filtered rows (not just current page).
 * In server mode, calls onServerExport callback for backend-side export.
 * In client mode, uses AG Grid's built-in export (all rows, ignoring pagination).
 *
 * @example
 * ```tsx
 * <GridToolbar gridApi={api} theme="quartz" density="comfortable" exportConfig={{ fileBaseName: 'users' }} />
 * ```
 * @since 1.0.0
 */
export const GridToolbar = <RowData = unknown>({
  gridApi,
  theme,
  onThemeChange,
  themeOptions = DEFAULT_THEME_OPTIONS,
  density,
  onDensityChange,
  isServerMode = false,
  quickFilterInitialValue = "",
  onQuickFilterChange,
  onRequestFullscreen,
  isFullscreen = false,
  exportConfig,
  onServerExport,
  messages,
  extras,
  variantSlot,
  className,
  access,
  accessReason,
}: GridToolbarProps<RowData>): React.ReactElement => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) return <></> as unknown as React.ReactElement;
  const [quickFilter, setQuickFilter] = useState(quickFilterInitialValue);
  const [exporting, setExporting] = useState<'excel' | 'csv' | null>(null);

  const handleQuickFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuickFilter(value);
      onQuickFilterChange?.(value);

      if (gridApi) {
        gridApi.setGridOption?.("quickFilterText", value);
        if (isServerMode) {
          gridApi.refreshServerSide?.({ purge: false });
        }
      }
    },
    [gridApi, isServerMode, onQuickFilterChange],
  );

  const handleResetFilters = useCallback(() => {
    if (!gridApi) return;
    gridApi.setFilterModel?.(null);
    gridApi.setAdvancedFilterModel?.(null);
    gridApi.setGridOption?.("quickFilterText", "");
    setQuickFilter("");
    onQuickFilterChange?.("");
    if (isServerMode) {
      gridApi.refreshServerSide?.({ purge: true });
    }
  }, [gridApi, isServerMode, onQuickFilterChange]);

  /* ---- Unified export handler ---- */
  const handleExport = useCallback(
    async (format: 'excel' | 'csv') => {
      if (!gridApi) return;

      // Server-side mode: delegate to callback
      if (isServerMode && onServerExport) {
        setExporting(format);
        try {
          const filterModel = gridApi.getFilterModel?.() ?? {};
          const sortModel = (gridApi.getColumnState?.() ?? [])
            .filter((c) => c.sort)
            .map((c) => ({ colId: c.colId, sort: c.sort, sortIndex: c.sortIndex }));
          const quickFilterText = (gridApi.getGridOption?.("quickFilterText") as string) ?? "";
          await onServerExport(format, { filterModel, sortModel, quickFilterText });
        } finally {
          setExporting(null);
        }
        return;
      }

      // Client-side mode: use AG Grid export (all filtered rows)
      if (format === 'excel') {
        gridApi.exportDataAsExcel?.({
          fileName: exportConfig?.fileBaseName
            ? `${exportConfig.fileBaseName}.xlsx`
            : "export.xlsx",
          sheetName: exportConfig?.sheetName ?? "Sheet1",
          processCellCallback: exportConfig?.processCellCallback,
          allColumns: true,
        });
      } else {
        gridApi.exportDataAsCsv?.({
          fileName: exportConfig?.csvFileBaseName ?? exportConfig?.fileBaseName
            ? `${exportConfig?.csvFileBaseName ?? exportConfig?.fileBaseName}.csv`
            : "export.csv",
          processCellCallback: exportConfig?.processCellCallback,
          allColumns: true,
          columnSeparator: exportConfig?.csvColumnSeparator ?? ';',
          prependContent: '\uFEFF', // UTF-8 BOM for Excel compatibility
        });
      }
    },
    [gridApi, isServerMode, onServerExport, exportConfig],
  );

  const m = messages ?? {};

  return (
    <div
      data-access-state={accessState.state}
      className={[
        "flex flex-wrap items-center gap-3 rounded-t-lg border border-b-0 border-border-subtle bg-surface-default px-4 py-2",
        className ?? "",
        accessStyles(accessState.state),
      ]
        .join(" ")
        .trim()}
      data-component="grid-toolbar"
      title={accessReason}
    >
      {/* Quick filter */}
      <input
        type="text"
        value={quickFilter}
        onChange={handleQuickFilterChange}
        placeholder={m.quickFilterPlaceholder ?? "Tüm sütunlarda ara..."}
        className="h-8 min-w-[180px] rounded-md border border-border-default bg-surface-default px-3 text-sm text-text-primary placeholder:text-text-disabled focus:border-action-primary focus:outline-hidden focus:ring-2 focus:ring-accent-focus"
        aria-label={m.quickFilterPlaceholder ?? "Quick filter"}
      />

      {/* Theme selector */}
      {onThemeChange && (
        <select
          value={theme}
          onChange={(e) => onThemeChange(e.target.value as GridTheme)}
          className="h-8 rounded-md border border-border-default bg-surface-default px-2 text-sm text-text-primary"
          aria-label={m.themeLabel ?? "Theme"}
        >
          {themeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {/* Density toggle */}
      {onDensityChange && (
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Grid density">
          <button
            type="button"
            className={[
              "h-8 rounded-md px-3 text-xs font-medium transition-colors",
              density === "comfortable"
                ? "bg-action-primary text-text-inverse"
                : "bg-surface-muted text-text-secondary hover:bg-surface-raised",
            ].join(" ")}
            onClick={() => onDensityChange("comfortable")}
            aria-checked={density === "comfortable"}
            role="radio"
          >
            {m.densityComfortableLabel ?? "Comfortable"}
          </button>
          <button
            type="button"
            className={[
              "h-8 rounded-md px-3 text-xs font-medium transition-colors",
              density === "compact"
                ? "bg-action-primary text-text-inverse"
                : "bg-surface-muted text-text-secondary hover:bg-surface-raised",
            ].join(" ")}
            onClick={() => onDensityChange("compact")}
            aria-checked={density === "compact"}
            role="radio"
          >
            {m.densityCompactLabel ?? "Compact"}
          </button>
        </div>
      )}

      {/* Variant selector slot */}
      {variantSlot}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Reset filters */}
      <button
        type="button"
        className="h-8 rounded-md bg-surface-muted px-3 text-xs font-medium text-text-secondary hover:bg-surface-raised"
        onClick={handleResetFilters}
      >
        {m.resetFiltersLabel ?? "Reset Filters"}
      </button>

      {/* Export buttons — 2 buttons: Excel + CSV */}
      {exportConfig && !isFullscreen && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={exporting === 'excel'}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-surface-muted px-3 text-xs font-medium text-text-secondary hover:bg-surface-raised disabled:opacity-50"
            onClick={() => handleExport('excel')}
            title="Excel"
          >
            <ExcelIcon className="h-4 w-4" />
            {exporting === 'excel' ? (m.exportingLabel ?? "İndiriliyor...") : (m.excelLabel ?? "Excel")}
          </button>
          <button
            type="button"
            disabled={exporting === 'csv'}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-surface-muted px-3 text-xs font-medium text-text-secondary hover:bg-surface-raised disabled:opacity-50"
            onClick={() => handleExport('csv')}
            title="CSV"
          >
            <CsvIcon className="h-4 w-4" />
            {exporting === 'csv' ? (m.exportingLabel ?? "İndiriliyor...") : (m.csvLabel ?? "CSV")}
          </button>
        </div>
      )}

      {/* Extras slot */}
      {extras}

      {/* Fullscreen toggle */}
      {onRequestFullscreen && (
        <button
          type="button"
          className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-muted text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary"
          onClick={onRequestFullscreen}
          title={m.fullscreenTooltip ?? (isFullscreen ? 'Exit fullscreen' : 'Fullscreen')}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
};

GridToolbar.displayName = "GridToolbar";

export default GridToolbar;
