import type { GridThemeParams } from "../theme/adapters/grid-adapter";
import type { ChartColorConfig } from "../theme/adapters/chart-adapter";
export declare function cssVarsToGridTheme(): GridThemeParams;
export declare function cssVarsToChartColors(): ChartColorConfig;
export interface AutoThemeAdapterResult {
    gridTheme: GridThemeParams;
    chartColors: ChartColorConfig;
}
/**
 * Hook that returns AG Grid and Chart theme configs derived from CSS custom
 * properties. Automatically re-computes when theme attributes change on <html>.
 *
 * @example
 * ```tsx
 * const { gridTheme, chartColors } = useAutoThemeAdapter();
 * <AgGridReact theme={gridTheme} />
 * ```
 */
export declare function useAutoThemeAdapter(): AutoThemeAdapterResult;
export default useAutoThemeAdapter;
