/**
 * BarChart — Thin passthrough to @mfe/x-charts
 *
 * Design-system consumers get the same API. Access control is
 * applied at the consumer (app) level, not in the chart component.
 *
 * NOTE: This file uses a relative workspace path instead of
 * @mfe/x-charts to avoid circular module resolution.
 */
export { BarChart as default, BarChart } from "../../../../x-charts/src/BarChart";
export type { BarChartProps } from "../../../../x-charts/src/BarChart";
