/**
 * Universal Report Column Metadata — Declarative column type system.
 *
 * Modules provide ONLY metadata (field, type, config).
 * The skeleton auto-generates full AG Grid ColDef with renderers.
 *
 * @example
 * ```ts
 * const columns: ColumnMeta[] = [
 *   { field: 'fullName', headerNameKey: 'users.columns.fullName', columnType: 'bold-text', minWidth: 180 },
 *   { field: 'role', headerNameKey: 'users.columns.role', columnType: 'badge', variantMap: { ADMIN: 'danger' } },
 *   { field: 'status', headerNameKey: 'users.columns.status', columnType: 'status', statusMap: { ACTIVE: { variant: 'success', labelKey: 'shared.status.active' } } },
 * ];
 * ```
 */

/* ------------------------------------------------------------------ */
/*  Badge variant — mirrors @mfe/design-system BadgeVariant            */
/* ------------------------------------------------------------------ */

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'danger'
  | 'info'
  | 'muted';

/* ------------------------------------------------------------------ */
/*  Shared base — every column type extends this                       */
/* ------------------------------------------------------------------ */

export interface BaseColumnMeta {
  /** Data field name from the row object */
  field: string;

  /** i18n key — resolved at render time via t(). Raw string also accepted (for dynamic reports). */
  headerNameKey: string;

  /** Fixed width in pixels */
  width?: number;

  /** Minimum width in pixels */
  minWidth?: number;

  /** Flex grow factor */
  flex?: number;

  /** Column sortable? Default: true */
  sortable?: boolean;

  /** Column filterable? Default: true */
  filterable?: boolean;

  /** Pin column to left or right */
  pinned?: 'left' | 'right';

  /** Hide column by default (user can show via column menu) */
  hidden?: boolean;

  /** Permission code required to see this column — hidden if user lacks permission */
  requiredPermission?: string;

  /** Responsive: hide column below this breakpoint */
  responsive?: { hideBelow?: 'sm' | 'md' | 'lg' | 'xl' };

  /** Conditional formatting rules (future — field reserved) */
  conditionalRules?: ConditionalRule[];
}

/* ------------------------------------------------------------------ */
/*  Conditional formatting (future — reserved)                         */
/* ------------------------------------------------------------------ */

export interface ConditionalRule {
  condition: 'gt' | 'lt' | 'eq' | 'neq' | 'gte' | 'lte' | 'contains';
  value: string | number;
  style: {
    textColor?: string;
    bgColor?: string;
    badgeVariant?: BadgeVariant;
  };
}

/* ------------------------------------------------------------------ */
/*  Column type: text (default)                                        */
/* ------------------------------------------------------------------ */

export interface TextColumnMeta extends BaseColumnMeta {
  columnType: 'text';
}

/* ------------------------------------------------------------------ */
/*  Column type: bold-text (e.g., name, title)                         */
/* ------------------------------------------------------------------ */

export interface BoldTextColumnMeta extends BaseColumnMeta {
  columnType: 'bold-text';
  /** CSS class override (default: "font-semibold text-text-primary") */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Column type: badge (colored label with variant map)                */
/* ------------------------------------------------------------------ */

export interface BadgeColumnMeta extends BaseColumnMeta {
  columnType: 'badge';
  /** Map raw value → Badge variant color */
  variantMap: Record<string, BadgeVariant>;
  /** Fallback variant when value not in map */
  defaultVariant?: BadgeVariant;
  /** Optional i18n label map: raw value → i18n key. If absent, raw value displayed. */
  labelMap?: Record<string, string>;
  /** Predefined set filter values. If absent, derived from variantMap keys. */
  filterValues?: string[];
}

/* ------------------------------------------------------------------ */
/*  Column type: status (badge + i18n label, common pattern)           */
/* ------------------------------------------------------------------ */

export interface StatusMapEntry {
  variant: BadgeVariant;
  /** i18n key for display label */
  labelKey: string;
}

export interface StatusColumnMeta extends BaseColumnMeta {
  columnType: 'status';
  /** Map raw status value → variant + i18n label */
  statusMap: Record<string, StatusMapEntry>;
  /** Fallback variant */
  defaultVariant?: BadgeVariant;
}

/* ------------------------------------------------------------------ */
/*  Column type: date                                                  */
/* ------------------------------------------------------------------ */

export interface DateColumnMeta extends BaseColumnMeta {
  columnType: 'date';
  /** Date format preset. Default: 'short' (toLocaleDateString) */
  format?: 'short' | 'long' | 'datetime' | 'relative';
  /** Text shown when value is null/undefined. Default: "-" */
  emptyText?: string;
}

/* ------------------------------------------------------------------ */
/*  Column type: number                                                */
/* ------------------------------------------------------------------ */

export interface NumberColumnMeta extends BaseColumnMeta {
  columnType: 'number';
  /** Decimal places. Default: 0 */
  decimals?: number;
  /** Suffix appended after number (e.g., "dk", "gün", "%") */
  suffix?: string;
  /** Prefix prepended before number (e.g., "₺", "$") */
  prefix?: string;
  /** Text shown when value is null/undefined. Default: "-" */
  emptyText?: string;
}

/* ------------------------------------------------------------------ */
/*  Column type: currency                                              */
/* ------------------------------------------------------------------ */

export interface CurrencyColumnMeta extends BaseColumnMeta {
  columnType: 'currency';
  /** ISO 4217 currency code. Default: "TRY" */
  currencyCode?: string;
  /** Decimal places. Default: 2 */
  decimals?: number;
}

/* ------------------------------------------------------------------ */
/*  Column type: enum (set filter + label mapping)                     */
/* ------------------------------------------------------------------ */

export interface EnumColumnMeta extends BaseColumnMeta {
  columnType: 'enum';
  /** Map raw value → display label (raw string or i18n key) */
  labelMap: Record<string, string>;
  /** Whether labelMap values are i18n keys. Default: false (raw strings) */
  labelsAreKeys?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Column type: boolean                                               */
/* ------------------------------------------------------------------ */

export interface BooleanColumnMeta extends BaseColumnMeta {
  columnType: 'boolean';
  /** Labels for true/false. Default: "Evet" / "Hayır" */
  trueLabel?: string;
  falseLabel?: string;
  /** i18n keys for labels. Takes precedence over trueLabel/falseLabel. */
  trueLabelKey?: string;
  falseLabelKey?: string;
  /** Display mode: text or icon. Default: 'icon' */
  display?: 'text' | 'icon';
}

/* ------------------------------------------------------------------ */
/*  Column type: percent                                               */
/* ------------------------------------------------------------------ */

export interface PercentColumnMeta extends BaseColumnMeta {
  columnType: 'percent';
  /** Decimal places. Default: 1 */
  decimals?: number;
  /** Show visual progress bar behind text. Default: false */
  showBar?: boolean;
  /** Bar color. Default: "var(--action-primary)" */
  barColor?: string;
}

/* ------------------------------------------------------------------ */
/*  Column type: link                                                  */
/* ------------------------------------------------------------------ */

export interface LinkColumnMeta extends BaseColumnMeta {
  columnType: 'link';
  /** Field or template for href. Use {field} for interpolation. */
  hrefTemplate?: string;
  /** Field name to read href from row data. Takes precedence over hrefTemplate. */
  hrefField?: string;
  /** Open in new tab. Default: false */
  newTab?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Column type: actions (pinned right, no filter/sort)                */
/* ------------------------------------------------------------------ */

export interface ActionItem {
  key: string;
  labelKey: string;
  icon?: string;
  /** Danger style (red). Default: false */
  danger?: boolean;
  /** Permission required. Hidden if user lacks it. */
  requiredPermission?: string;
}

export interface ActionsColumnMeta extends BaseColumnMeta {
  columnType: 'actions';
  /** Action menu items */
  actions: ActionItem[];
}

/* ------------------------------------------------------------------ */
/*  Discriminated union — THE column metadata type                     */
/* ------------------------------------------------------------------ */

export type ColumnMeta =
  | TextColumnMeta
  | BoldTextColumnMeta
  | BadgeColumnMeta
  | StatusColumnMeta
  | DateColumnMeta
  | NumberColumnMeta
  | CurrencyColumnMeta
  | EnumColumnMeta
  | BooleanColumnMeta
  | PercentColumnMeta
  | LinkColumnMeta
  | ActionsColumnMeta;

/* ------------------------------------------------------------------ */
/*  Translation function signature                                     */
/* ------------------------------------------------------------------ */

export type TranslateFn = (key: string) => string;
