/* ------------------------------------------------------------------ */
/*  Patterns — Page-region components, slot/children pattern           */
/*                                                                     */
/*  Patterns define page-level regions and layouts.                    */
/* ------------------------------------------------------------------ */

/* Page Structure */
export { PageHeader, createPageHeaderTagItems, createPageHeaderStatItems } from "./page-header";
export type {
  PageHeaderProps,
  PageHeaderTagItem,
  PageHeaderTagInput,
  PageHeaderStatItem,
  PageHeaderStatInput,
  PageHeaderClasses,
} from "./page-header";

/* Drawers */
export { FormDrawer } from "./form-drawer";
export type { FormDrawerProps, FormDrawerSize, FormDrawerPlacement } from "./form-drawer";
export { DetailDrawer } from "./detail-drawer";
export type {
  DetailDrawerProps,
  DetailDrawerSize,
  DetailDrawerSection,
} from "./detail-drawer";

/* Filters */
export { FilterBar } from "./filter-bar";
export type { FilterBarProps } from "./filter-bar";

/* Layouts */
export { MasterDetail } from "./master-detail";
export type { MasterDetailProps, MasterDetailRatio } from "./master-detail";

export { PageLayout } from "./page-layout";
export type {
  PageLayoutProps,
  PageLayoutClasses,
  PageBreadcrumbItem,
  PageLayoutRouteInput,
  PageLayoutPresetOptions,
} from "./page-layout";
export { createPageLayoutPreset, createPageLayoutBreadcrumbItems } from "./page-layout";

/* Summary */
export { SummaryStrip } from "./summary-strip";
export type { SummaryStripProps, SummaryStripItem } from "./summary-strip";

/* Entity Summary */
export { EntitySummaryBlock } from "./entity-summary-block";
export type { EntitySummaryBlockProps } from "./entity-summary-block";

/* Detail Summary */
export { DetailSummary } from "./detail-summary";
export type { DetailSummaryProps } from "./detail-summary";

/* Report Filters */
export { ReportFilterPanel } from "./report-filter-panel";
export type { ReportFilterPanelProps } from "./report-filter-panel";

/* Result */
export { Result } from "./result";
export type { ResultProps, ResultStatus } from "./result";

/* Shell Header */
export { ShellHeader } from "./shell-header";
export type { ShellHeaderProps, ShellHeaderNavItem } from "./shell-header";

/* Shell Sidebar */
export { ShellSidebar } from "./shell-sidebar";
export type {
  ShellSidebarProps,
  ShellSidebarNavItem,
  ShellSidebarFolderItem,
  ShellSidebarFooterActionItem,
  ShellSidebarStatusConfig,
} from "./shell-sidebar";
