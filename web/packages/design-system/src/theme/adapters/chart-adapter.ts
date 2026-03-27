/* ------------------------------------------------------------------ */
/*  Chart Adapter — token → chart color configuration                  */
/*                                                                     */
/*  Maps design system tokens to chart library color schemes.          */
/* ------------------------------------------------------------------ */

import type { SemanticTokenSet } from "../../tokens/semantic";

export interface ChartColorConfig {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  gridColor: string;
  tooltipBg: string;
  tooltipText: string;
  series: string[];
}

export function tokenSetToChartColors(
  tokens: SemanticTokenSet,
): ChartColorConfig {
  return {
    primaryColor: tokens.actionPrimary,
    backgroundColor: tokens.surfaceDefault,
    textColor: tokens.textPrimary,
    gridColor: tokens.borderSubtle,
    tooltipBg: tokens.surfaceRaised,
    tooltipText: tokens.textPrimary,
    series: [
      tokens.actionPrimary,
      tokens.stateSuccessText,
      tokens.stateWarningText,
      tokens.stateErrorText,
      tokens.stateInfoText,
      tokens.textSecondary,
    ],
  };
}
