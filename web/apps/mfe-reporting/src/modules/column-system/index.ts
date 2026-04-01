/**
 * Universal Report Column System — Public API
 *
 * Usage:
 * ```ts
 * import { buildColDefs, type ColumnMeta } from '../column-system';
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
