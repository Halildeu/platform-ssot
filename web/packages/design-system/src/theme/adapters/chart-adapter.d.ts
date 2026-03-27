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
export declare function tokenSetToChartColors(tokens: SemanticTokenSet): ChartColorConfig;
