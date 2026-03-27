import type { SemanticTokenSet } from "../../tokens/semantic";
/**
 * AG Grid theme parameter object.
 * These values are passed to AG Grid's `themeParams` or used in
 * custom CSS overrides for the grid.
 */
export interface GridThemeParams {
    headerBackgroundColor: string;
    headerForegroundColor: string;
    backgroundColor: string;
    foregroundColor: string;
    borderColor: string;
    rowHoverColor: string;
    selectedRowBackgroundColor: string;
    oddRowBackgroundColor: string;
    fontSize: string;
    headerFontSize: string;
}
export declare function tokenSetToGridTheme(tokens: SemanticTokenSet): GridThemeParams;
