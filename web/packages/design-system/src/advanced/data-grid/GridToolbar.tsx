/**
 * GridToolbar — Grid control bar.
 *
 * Responsibilities:
 * - Quick filter input with SSRM refresh support
 * - Density toggle (comfortable / compact)
 * - Theme selector dropdown
 * - Fullscreen toggle
 * - Excel / CSV export buttons
 * - Reset filters button
 * - Extensible extras slot
 */
import React, { useCallback, useState } from "react";
import { resolveAccessState, accessStyles, type AccessControlledProps } from '../../internal/access-controller';
import type { GridApi } from "ag-grid-community";
import type { GridTheme, GridDensity } from "./GridShell";
import type { GridExportConfig } from "./EntityGridTemplate";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------
 */

export interface GridToolbarMessages {
  quickFilterPlaceholder?: string;
  densityComfortableLabel?: string;
  densityCompactLabel?: string;
  densityResetLabel?: string;
  themeLabel?: string;
  fullscreenLabel?: string;
  fullscreenTooltip?: string;
  resetFiltersLabel?: string;
  excelVisibleLabel?: string;
  excelAllLabel?: string;
  csvVisibleLabel?: string;
  csvAllLabel?: string;
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

/** Toolbar strip for data grids with search, density toggle, theme switcher, and CSV export. 
 * @example
 * ```tsx
 * <GridToolbar />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/grid-toolbar)
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

  const handleQuickFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuickFilter(value);
      onQuickFilterChange?.(value);

      if (gridApi) {
        // v34: setGridOption for quickFilterText
        gridApi.setGridOption?.("quickFilterText", value);

        // For SSRM, also trigger server-side refresh
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
  }, [gridApi, onQuickFilterChange]);

  const handleExcelExport = useCallback(
    (scope: "visible" | "all") => {
      if (!gridApi) return;
      gridApi.exportDataAsExcel?.({
        fileName: exportConfig?.fileBaseName
          ? `${exportConfig.fileBaseName}.xlsx`
          : "export.xlsx",
        sheetName: exportConfig?.sheetName ?? "Sheet1",
        processCellCallback: exportConfig?.processCellCallback,
        allColumns: scope === "all",
      });
    },
    [gridApi, exportConfig],
  );

  const handleCsvExport = useCallback(
    (scope: "visible" | "all") => {
      if (!gridApi) return;
      gridApi.exportDataAsCsv?.({
        fileName: exportConfig?.csvFileBaseName ?? exportConfig?.fileBaseName
          ? `${exportConfig?.csvFileBaseName ?? exportConfig?.fileBaseName}.csv`
          : "export.csv",
        processCellCallback: exportConfig?.processCellCallback,
        allColumns: scope === "all",
        columnSeparator: exportConfig?.csvColumnSeparator,
      });
    },
    [gridApi, exportConfig],
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
        placeholder={m.quickFilterPlaceholder ?? "Ara..."}
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

      {/* Fullscreen */}
      {onRequestFullscreen && (
        <button
          type="button"
          className="h-8 rounded-md bg-surface-muted px-3 text-xs font-medium text-text-secondary hover:bg-surface-raised"
          onClick={onRequestFullscreen}
          title={m.fullscreenTooltip ?? "Toggle fullscreen"}
          aria-label={m.fullscreenLabel ?? "Fullscreen"}
        >
          ⛶
        </button>
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

      {/* Export buttons */}
      {exportConfig && !isFullscreen && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="h-8 rounded-md bg-surface-muted px-3 text-xs font-medium text-text-secondary hover:bg-surface-raised"
            onClick={() => handleExcelExport("visible")}
          >
            {m.excelVisibleLabel ?? "Excel"}
          </button>
          <button
            type="button"
            className="h-8 rounded-md bg-surface-muted px-3 text-xs font-medium text-text-secondary hover:bg-surface-raised"
            onClick={() => handleExcelExport("all")}
          >
            {m.excelAllLabel ?? "Excel (All)"}
          </button>
          <button
            type="button"
            className="h-8 rounded-md bg-surface-muted px-3 text-xs font-medium text-text-secondary hover:bg-surface-raised"
            onClick={() => handleCsvExport("visible")}
          >
            {m.csvVisibleLabel ?? "CSV"}
          </button>
          <button
            type="button"
            className="h-8 rounded-md bg-surface-muted px-3 text-xs font-medium text-text-secondary hover:bg-surface-raised"
            onClick={() => handleCsvExport("all")}
          >
            {m.csvAllLabel ?? "CSV (All)"}
          </button>
        </div>
      )}

      {/* Extras slot */}
      {extras}
    </div>
  );
};

GridToolbar.displayName = "GridToolbar";

export default GridToolbar;
