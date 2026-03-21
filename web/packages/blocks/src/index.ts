/* ================================================================== */
/*  @mfe/blocks — barrel exports                                       */
/* ================================================================== */

// ---- Core types & registry ----------------------------------------
export type {
  BlockDefinition,
  BlockCategory,
  BlockRegistry,
  PageComposition,
} from './types';

export {
  createBlockRegistry,
  defaultRegistry,
  BlockRegistryContext,
  useBlockRegistry,
} from './registry';

// ---- Dashboard blocks ---------------------------------------------
export {
  KPIDashboardBlock,
  MetricStripBlock,
  ChartGridBlock,
} from './blocks/dashboard';
export type {
  KPIMetric,
  KPIDashboardBlockProps,
  MetricStripStat,
  MetricStripBlockProps,
  ChartGridItem,
  ChartGridBlockProps,
} from './blocks/dashboard';

// ---- CRUD blocks --------------------------------------------------
export {
  DataListBlock,
  DetailViewBlock,
  CreateEditFormBlock,
} from './blocks/crud';
export type {
  DataListColumn,
  DataListBlockProps,
  DetailViewField,
  DetailViewSection,
  DetailViewBlockProps,
  FormField,
  CreateEditFormBlockProps,
} from './blocks/crud';

// ---- Admin blocks -------------------------------------------------
export {
  SettingsPageBlock,
  UserManagementBlock,
} from './blocks/admin';
export type {
  SettingsField,
  SettingsSection,
  SettingsPageBlockProps,
  ManagedUser,
  UserManagementBlockProps,
} from './blocks/admin';

// ---- Analytics blocks ---------------------------------------------
export {
  AnalyticsOverviewBlock,
} from './blocks/analytics';
export type {
  AnalyticsMetric,
  AnalyticsOverviewBlockProps,
} from './blocks/analytics';

// ---- Composition --------------------------------------------------
export { PageBuilder } from './composition/PageBuilder';
export type { PageBuilderProps } from './composition/PageBuilder';

// ---- Templates ----------------------------------------------------
export {
  CrudPageTemplate,
  DashboardPageTemplate,
  SettingsPageTemplate,
} from './templates';
export type {
  CrudPageTemplateProps,
  ActivityItem,
  DashboardPageTemplateProps,
  SettingsPageTemplateProps,
} from './templates';
