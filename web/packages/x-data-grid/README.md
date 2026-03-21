# @corp/x-data-grid

Enterprise data grid for high-performance tabular data display, editing, and analysis. Built on AG Grid with opinionated defaults, server-side data source integration, and full design-system theming.

## Installation

```bash
pnpm add @corp/x-data-grid
```

Peer dependencies (installed automatically with the monorepo):

```bash
pnpm add @corp/design-system ag-grid-react ag-grid-enterprise
```

## Quick Start

```tsx
import { EntityGridTemplate } from '@corp/x-data-grid';

const columns = [
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'role', headerName: 'Role', width: 150 },
];

const rows = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'Editor' },
];

export function UserGrid() {
  return (
    <EntityGridTemplate
      columns={columns}
      rows={rows}
      pagination
      pageSize={25}
    />
  );
}
```

## Server-Side Data

```tsx
import { EntityGridTemplate, ServerDataSource } from '@corp/x-data-grid';

const dataSource = new ServerDataSource({
  endpoint: '/api/users',
  pageSize: 50,
});

export function ServerGrid() {
  return (
    <EntityGridTemplate
      columns={columns}
      dataSource={dataSource}
      serverSide
    />
  );
}
```

## Available Components

| Component | Description |
|-----------|-------------|
| `EntityGridTemplate` | Primary grid with filtering, sorting, pagination |
| `MasterDetailGrid` | Expandable row with nested detail grid |
| `TreeDataGrid` | Hierarchical tree data display |
| `PivotGrid` | Pivot table with row/column grouping |
| `EditableGrid` | Inline cell editing with validation |
| `ServerDataSource` | Server-side data fetching adapter |

## API Reference

Full props documentation: [/api/x-data-grid](/api/x-data-grid)

## License

Private -- internal use only.
