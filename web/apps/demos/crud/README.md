# CRUD Reference App

Full create-read-update-delete workflow using @mfe/x-data-grid + @mfe/x-form-builder.

## Components Used

- **DataGrid** — server-side row model with AG Grid
- **FormBuilder** — JSON schema-driven forms with validation
- **Dialog** — modal for create/edit operations
- **Button, Badge, Text** — UI primitives
- **useHttp** — API integration layer

## Quick Start

```bash
npx @mfe/create-app my-crud-app --template crud
cd my-crud-app
pnpm dev
```

## First-Value Time Target

Under 15 minutes from `create-app` to a working CRUD interface with mock API.

## Features Demonstrated

- AG Grid server-side pagination, filtering, sorting
- JSON Schema form generation with validation
- Create / Edit / Delete operations
- Detail panel with related data
- Optimistic updates with error rollback
