/**
 * Universal Report Column System — Public API
 *
 * Usage:
 * ```ts
 * import { buildColDefs, type ColumnMeta } from '@mfe/design-system/advanced/data-grid';
 *
 * const meta: ColumnMeta[] = [
 *   { field: 'name', headerNameKey: 'shared.columns.name', columnType: 'bold-text' },
 *   { field: 'role', headerNameKey: 'shared.columns.role', columnType: 'badge', variantMap: { ADMIN: 'danger' } },
 * ];
 *
 * const colDefs = buildColDefs(meta, t, locale);
 * ```
 */

/* Types */
export type {
  ColumnMeta,
  TextColumnMeta,
  BoldTextColumnMeta,
  BadgeColumnMeta,
  StatusColumnMeta,
  StatusMapEntry,
  DateColumnMeta,
  NumberColumnMeta,
  CurrencyColumnMeta,
  EnumColumnMeta,
  BooleanColumnMeta,
  PercentColumnMeta,
  LinkColumnMeta,
  ActionsColumnMeta,
  ActionItem,
  BaseColumnMeta,
  BadgeVariant,
  ConditionalRule,
  TranslateFn,
  ColumnDef,
} from './types';

/* Transformer */
export { buildColDefs } from './transformer';

/* Preset renderers (for advanced usage / testing) */
export {
  createTextRenderer,
  createBoldTextRenderer,
  createBadgeRenderer,
  createStatusRenderer,
  createDateRenderer,
  createNumberRenderer,
  createCurrencyRenderer,
  createBooleanRenderer,
  createPercentRenderer,
  createLinkRenderer,
  createEnumRenderer,
  createExportValueGetter,
} from './presets';

/* Filter builders */
export { buildFilterConfig, type FilterConfig } from './filters';

/* Detail drawer */
export { buildDetailRenderer } from './detail-renderer';
export type { DetailExtraField } from './detail-renderer';

/* Export helpers */
export { buildProcessCellCallback } from './export-helpers';

/* Conditional formatting */
export { withConditionalFormatting, findMatchingRule } from './conditional';
