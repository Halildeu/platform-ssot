# @mfe/blocks — Contract

> Composable page blocks and app templates (shadcn-style block registry).

## Purpose

Provides pre-built, composable UI blocks and page templates that micro-frontends
can assemble into full pages. Blocks use only design-system tokens and plain
React — they never import X-* packages directly. X packages compose via
slots/children.

## Public API

### Registry

| Export                 | Kind       | Description                              |
| ---------------------- | ---------- | ---------------------------------------- |
| `createBlockRegistry`  | function   | Factory — returns a fresh `BlockRegistry`|
| `defaultRegistry`      | singleton  | Pre-created shared registry instance     |
| `BlockRegistryContext`  | context    | React context for DI                     |
| `useBlockRegistry`     | hook       | Reads `BlockRegistryContext`             |

### Block categories

| Category    | Blocks                                               |
| ----------- | ---------------------------------------------------- |
| dashboard   | `KPIDashboardBlock`, `MetricStripBlock`, `ChartGridBlock` |
| crud        | `DataListBlock`, `DetailViewBlock`, `CreateEditFormBlock` |
| admin       | `SettingsPageBlock`, `UserManagementBlock`            |
| analytics   | `AnalyticsOverviewBlock`                             |

### Composition

| Export        | Kind      | Description                                      |
| ------------- | --------- | ------------------------------------------------ |
| `PageBuilder` | component | Renders a `PageComposition` using the registry   |

### Templates

| Export                    | Kind      | Description                         |
| ------------------------- | --------- | ----------------------------------- |
| `CrudPageTemplate`        | component | List + detail + create/edit flow    |
| `DashboardPageTemplate`   | component | KPI strip + charts + activity       |
| `SettingsPageTemplate`    | component | Sectioned settings + save           |

## Constraints

1. **No X-package imports** — blocks depend only on `@mfe/design-system` tokens
   and plain React. Charts, grids, etc. compose in via `children` / `ReactNode`
   slots.
2. **CSS variables only** — all visual values reference `var(--color-*)` tokens
   from the design system. No hard-coded hex values except as fallbacks.
3. **Pure components** — blocks are stateless where possible; state lives in
   templates or the consuming app.
4. **Generic typing** — `DataListBlock` and `CrudPageTemplate` are generic over
   the item type `<T>`.

## Peer dependencies

- `@mfe/design-system` — token CSS variables
- `@mfe/x-charts` — optional, compose via children
- `@mfe/x-data-grid` — optional, compose via children
- `react ^18 || ^19`

## Testing

```bash
pnpm --filter @mfe/blocks test
```

Covers: `DataListBlock`, `PageBuilder`, `CrudPageTemplate`.
