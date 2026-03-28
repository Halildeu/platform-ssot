# @corp/blocks

Pre-built page templates and composable blocks for assembling full application pages. Each block composes design-system primitives and X Suite components into production-ready layouts.

## Installation

```bash
pnpm add @corp/blocks
```

Peer dependencies:

```bash
pnpm add @corp/design-system @corp/x-data-grid @corp/x-charts
```

## Quick Start

```tsx
import { CrudPageTemplate } from '@corp/blocks';

const columns = [
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'status', headerName: 'Status', width: 120 },
  { field: 'createdAt', headerName: 'Created', width: 160, type: 'date' },
];

export function UsersPage() {
  return (
    <CrudPageTemplate
      title="Users"
      columns={columns}
      dataEndpoint="/api/users"
      createForm={{ fields: [/* field config */] }}
      actions={['create', 'edit', 'delete', 'export']}
    />
  );
}
```

## Dashboard Template

```tsx
import { DashboardPageTemplate } from '@corp/blocks';

const widgets = [
  { type: 'kpi', title: 'Revenue', value: '$125K', trend: +12.5, span: 1 },
  { type: 'kpi', title: 'Users', value: '1,842', trend: -3.1, span: 1 },
  { type: 'kpi', title: 'Conversion', value: '4.2%', trend: +0.8, span: 1 },
  { type: 'chart', chartType: 'line', dataEndpoint: '/api/metrics/revenue', span: 2 },
  { type: 'table', columns: recentOrderColumns, dataEndpoint: '/api/orders/recent', span: 1 },
];

export function OverviewDashboard() {
  return (
    <DashboardPageTemplate
      title="Overview"
      widgets={widgets}
      columns={3}
      refreshInterval={30000}
    />
  );
}
```

## Page Builder

```tsx
import { PageBuilder } from '@corp/blocks';

export function CustomPage() {
  return (
    <PageBuilder>
      <PageBuilder.Header title="Custom Page" breadcrumbs={['Home', 'Custom']} />
      <PageBuilder.Section columns={2}>
        <PageBuilder.Widget type="chart" config={chartConfig} />
        <PageBuilder.Widget type="table" config={tableConfig} />
      </PageBuilder.Section>
      <PageBuilder.Section columns={1}>
        <PageBuilder.Widget type="form" config={formConfig} />
      </PageBuilder.Section>
    </PageBuilder>
  );
}
```

## Available Components

| Component | Description |
|-----------|-------------|
| `DashboardPageTemplate` | KPI + chart + table dashboard layout |
| `CrudPageTemplate` | List grid + create/edit/delete flows |
| `SettingsPageTemplate` | Grouped settings with tabs and save |
| `AuthPageTemplate` | Login / register / forgot-password pages |
| `PageBuilder` | Composable page construction with slots |

## API Reference

Full props documentation: [/api/blocks](/api/blocks)

## Related

- **Create a new app** — Use `@mfe/create-app` to scaffold a full application with blocks pre-configured
- **Customize blocks** — See [Block Customization Guide](../../apps/docs/pages/blocks/customization.mdx)
- **Create your own block** — See [Creating Blocks Guide](../../apps/docs/pages/blocks/creating-blocks.mdx)
- **Quality standards** — See [Performance SLA](../../docs/performance-sla.md)

## License

Private -- internal use only.
