/**
 * Chart Theme Bridge — AG Charts + Design System Token Sync
 *
 * Maps design-system CSS custom properties to AG Charts theme overrides,
 * ensuring charts created from grid range selection match the grid's
 * design token palette.
 *
 * Usage: pass getChartThemeOverrides() to AgGridReact's chartThemeOverrides prop.
 *
 * AG Charts v12.3.1 compatible.
 */
export interface ChartThemeOverrides {
    common?: {
        title?: {
            fontFamily?: string;
            color?: string;
            fontSize?: number;
        };
        subtitle?: {
            fontFamily?: string;
            color?: string;
        };
        axes?: {
            category?: {
                label?: {
                    color?: string;
                    fontFamily?: string;
                };
            };
            number?: {
                label?: {
                    color?: string;
                    fontFamily?: string;
                };
            };
        };
        legend?: {
            item?: {
                label?: {
                    color?: string;
                    fontFamily?: string;
                };
            };
        };
        padding?: {
            top?: number;
            right?: number;
            bottom?: number;
            left?: number;
        };
    };
    bar?: Record<string, unknown>;
    line?: Record<string, unknown>;
    pie?: Record<string, unknown>;
    area?: Record<string, unknown>;
}
/**
 * Generates AG Charts theme overrides from design-system CSS custom properties.
 *
 * Call this function at render time (not at module level) to capture
 * the current theme token values.
 */
export declare const getChartThemeOverrides: () => ChartThemeOverrides;
/**
 * AG Charts color palette aligned with design-system action/state tokens.
 *
 * Use as fills/strokes parameter or via chartThemes in AG Grid.
 */
export declare const getChartColorPalette: () => string[];
export default getChartThemeOverrides;
