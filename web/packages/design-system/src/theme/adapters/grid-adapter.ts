/* ------------------------------------------------------------------ */
/*  Grid Adapter — token → AG Grid theme params                        */
/*                                                                     */
/*  Maps design system tokens to AG Grid's theming API.                */
/*  Used by advanced/data-grid components.                             */
/* ------------------------------------------------------------------ */

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

export function tokenSetToGridTheme(
  tokens: SemanticTokenSet,
): GridThemeParams {
  return {
    headerBackgroundColor: tokens.surfaceMuted,
    headerForegroundColor: tokens.textPrimary,
    backgroundColor: tokens.surfaceDefault,
    foregroundColor: tokens.textPrimary,
    borderColor: tokens.borderSubtle,
    rowHoverColor: tokens.surfaceMuted,
    selectedRowBackgroundColor: tokens.stateInfoBg,
    oddRowBackgroundColor: tokens.surfaceCanvas,
    fontSize: "13px",
    headerFontSize: "12px",
  };
}
