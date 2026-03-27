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
import React from "react";
import { type AccessControlledProps } from '../../internal/access-controller';
import type { GridApi } from "ag-grid-community";
import type { GridTheme, GridDensity } from "./GridShell";
import type { GridExportConfig } from "./EntityGridTemplate";
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
    themeOptions?: readonly {
        label: string;
        value: GridTheme;
    }[];
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
/** Toolbar strip for data grids with search, density toggle, theme switcher, and CSV export.
 * @example
 * ```tsx
 * <GridToolbar />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/grid-toolbar)
 */
export declare const GridToolbar: {
    <RowData = unknown>({ gridApi, theme, onThemeChange, themeOptions, density, onDensityChange, isServerMode, quickFilterInitialValue, onQuickFilterChange, onRequestFullscreen, isFullscreen, exportConfig, messages, extras, variantSlot, className, access, accessReason, }: GridToolbarProps<RowData>): React.ReactElement;
    displayName: string;
};
export default GridToolbar;
