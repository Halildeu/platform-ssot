// Ambient module declaration — workspace types resolve via pnpm symlink at runtime
// This allows typecheck without building design-system dist first
declare module '@mfe/design-system' {
  export const cn: (...args: any[]) => string;
  export const Text: React.FC<any>;
  export const Spinner: React.FC<any>;
  export const Button: React.FC<any>;
  export const Card: React.FC<any>;
  export const Stack: React.FC<any>;
  export const Badge: React.FC<any>;
  export const Tag: React.FC<any>;
  export const Alert: React.FC<any>;
  export const Avatar: React.FC<any>;
  export const Select: React.FC<any>;
  export const Checkbox: React.FC<any>;
  export const Switch: React.FC<any>;
  export const Radio: React.FC<any>;
  export const Input: React.FC<any>;
  export const Tabs: React.FC<any>;
  export const Accordion: React.FC<any>;
  export const Dialog: React.FC<any>;
  export const Modal: React.FC<any>;
  export const Tooltip: React.FC<any>;
  export const Popover: React.FC<any>;
  export const Drawer: React.FC<any>;
  export const Dropdown: React.FC<any>;
  export const Pagination: React.FC<any>;
  export const Segmented: React.FC<any>;
  export const Divider: React.FC<any>;
  export const Empty: React.FC<any>;
  export const Skeleton: React.FC<any>;
  export const Timeline: React.FC<any>;
  export const Steps: React.FC<any>;
  export const Breadcrumb: React.FC<any>;
  export const MenuBar: React.FC<any>;
  // Charts
  export const BarChart: React.FC<any>;
  export const LineChart: React.FC<any>;
  export const AreaChart: React.FC<any>;
  export const PieChart: React.FC<any>;
  // AG Grid
  export const EntityGridTemplate: React.FC<any>;
  export const GridShell: React.FC<any>;
  export const GridToolbar: React.FC<any>;
  export const TablePagination: React.FC<any>;
  // AG Grid types
  export type EntityGridTemplateProps = any;
  export type GridShellProps = any;
  export type GridToolbarProps = any;
  export type ColDef = any;
  export type GridOptions = any;
  export type GridApi = any;
  export type GridReadyEvent = any;
  // Types — exported as any for ambient compatibility
  export type ChartSize = any;
  export type ChartDataPoint = any;
  export type ChartSeries = any;
  export type ChartLocaleText = any;
  export type BarChartProps = any;
  export type LineChartProps = any;
  export type AreaChartProps = any;
  export type PieChartProps = any;
  // Catch-all for any other exports
  const _default: any;
  export default _default;
}

declare module '@mfe/design-system/advanced/data-grid/chart-theme-bridge' {
  export function getChartThemeOverrides(): Record<string, any>;
  export function getChartColorPalette(): string[];
}

declare module '@mfe/design-system/advanced' {
  export function getChartThemeOverrides(): Record<string, any>;
  export function getChartColorPalette(): string[];
}

declare module '@mfe/shared-types' {
  const x: any;
  export = x;
}

declare module '@mfe/shared-http' {
  const x: any;
  export = x;
}
