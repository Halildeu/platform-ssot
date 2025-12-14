import { z } from 'zod';

const BreadcrumbItemSchema = z.object({
  label: z.string().optional(),
  i18nKey: z.string().optional(),
  to: z.string().optional(),
});

const FilterBaseSchema = z.object({
  key: z.string(),
  label: z.string().optional(),
  i18nKey: z.string().optional(),
  defaultValue: z.unknown().optional(),
  required: z.boolean().optional(),
  helpText: z.string().optional(),
});

const SelectOptionSchema = z.object({
  value: z.union([z.string(), z.number(), z.boolean()]),
  label: z.string().optional(),
  i18nKey: z.string().optional(),
});

const FilterSchema = z.discriminatedUnion('type', [
  FilterBaseSchema.extend({ type: z.literal('text'), placeholder: z.string().optional() }),
  FilterBaseSchema.extend({ type: z.literal('select'), options: z.array(SelectOptionSchema), multiple: z.boolean().optional() }),
  FilterBaseSchema.extend({ type: z.literal('date'), mode: z.enum(['date', 'datetime', 'range']).optional() }),
  FilterBaseSchema.extend({ type: z.literal('boolean') }),
]);

const ColumnSchema = z.object({
  key: z.string(),
  header: z.string().optional(),
  i18nKey: z.string().optional(),
  type: z.enum(['text', 'number', 'date', 'status']).optional(),
  sortable: z.boolean().optional(),
  filterable: z.boolean().optional(),
  width: z.number().min(40).optional(),
  tooltip: z.string().optional(),
  formatter: z.string().optional(),
  permission: z.string().optional(),
});

const GridSchema = z.object({
  dataSource: z
    .object({
      queryKey: z.array(z.unknown()).optional(),
      endpoint: z.string().optional(),
      method: z.enum(['GET', 'POST']).optional(),
    })
    .optional(),
  columns: z.array(ColumnSchema).min(1),
  initialSort: z
    .array(
      z.object({
        key: z.string(),
        direction: z.enum(['asc', 'desc']).default('asc'),
      }),
    )
    .optional(),
});

const DetailSectionSchema = z.object({
  key: z.string(),
  type: z.enum(['summary', 'related', 'audit', 'notes', 'custom']).optional(),
  component: z.string().optional(),
  title: z.string().optional(),
  i18nKey: z.string().optional(),
});

const DetailTabSchema = z.object({
  key: z.string(),
  title: z.string().optional(),
  i18nKey: z.string().optional(),
  sections: z.array(DetailSectionSchema).optional(),
});

const DetailSchema = z.object({
  tabs: z.array(DetailTabSchema).optional(),
});

const ActionSchema = z.object({
  key: z.string(),
  label: z.string().optional(),
  i18nKey: z.string().optional(),
  icon: z.string().optional(),
  type: z.enum(['primary', 'default', 'danger']).optional(),
  target: z.string().optional(),
  intent: z.enum(['open-drawer', 'open-modal', 'mutation', 'navigation']).optional(),
  permission: z.string().optional(),
  confirm: z
    .object({
      title: z.string().optional(),
      i18nKey: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
});

const LayoutSchema = z.object({
  kind: z.enum(['default', 'settings', 'wizard']).default('default').optional(),
});

export const PageManifestSchema = z.object({
  meta: z.object({
    id: z.string().min(1),
    title: z.string().optional(),
    i18nKey: z.string().optional(),
    description: z.string().optional(),
    breadcrumb: z.array(BreadcrumbItemSchema).optional(),
    permission: z.string().optional(),
    icon: z.string().optional(),
    version: z.string().optional(),
  }),
  layout: LayoutSchema.optional(),
  filters: z.array(FilterSchema).optional(),
  grid: GridSchema,
  detail: DetailSchema.optional(),
  actions: z.array(ActionSchema).optional(),
  telemetry: z
    .object({
      pageId: z.string().optional(),
      source: z.string().optional(),
    })
    .optional(),
  featureFlags: z.array(z.string()).optional(),
});

export type PageManifest = z.infer<typeof PageManifestSchema>;

