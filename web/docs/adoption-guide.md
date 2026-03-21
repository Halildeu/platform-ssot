# Adoption Guide

> From zero to production with the @mfe platform. Three tracks for different time budgets.

---

## Track 1: 10 Minutes to Demo

Get a running app with the full component showcase.

### Step 1 — Scaffold

```bash
npx create-mfe-app my-demo
cd my-demo
```

This creates a Vite-powered app with:
- `@mfe/design-system` pre-configured
- Theme provider with light/dark toggle
- Sample pages: dashboard, form, data table

### Step 2 — Start

```bash
pnpm install
pnpm dev
# → http://localhost:5173
```

### Step 3 — Explore

The demo app includes interactive pages:

| Page | What it shows |
|---|---|
| `/` | Dashboard with charts and stats cards |
| `/data` | DataGrid with 1K rows, sorting, filtering |
| `/forms` | Full form with validation, all input types |
| `/components` | Component gallery with live props editor |

Change the theme in `src/theme.ts` and watch the entire app update instantly.

**Result**: A running app demonstrating the full platform in under 10 minutes.

---

## Track 2: 30 Minutes to First Screen

Customize the template into a real screen for your project.

### Step 1 — Choose a Template

```bash
npx create-mfe-app my-project --template dashboard
# Available templates: dashboard, admin, crm, blank
```

### Step 2 — Customize the Theme

Edit `src/theme.ts` to match your brand:

```typescript
import { createTheme } from '@mfe/design-system';

export const theme = createTheme({
  colors: {
    primary: '#1a56db',    // Your brand blue
    secondary: '#7c3aed',  // Your brand purple
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
  },
  borderRadius: {
    base: '8px',
  },
});
```

### Step 3 — Add Real Data

Replace the mock data source with your API:

```typescript
import { useQuery } from '@tanstack/react-query';
import { DataGrid } from '@mfe/x-data-grid';

function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => fetch('/api/orders').then(r => r.json()),
  });

  return (
    <DataGrid
      rows={data ?? []}
      columns={orderColumns}
      loading={isLoading}
      pagination
      pageSize={25}
    />
  );
}
```

### Step 4 — Deploy Preview

```bash
pnpm build
# Output in dist/ — deploy to any static host
npx wrangler pages deploy dist/  # Cloudflare Pages example
```

**Result**: A branded, data-connected screen deployed to a preview URL.

---

## Track 3: 1 Day to Enterprise Starter

Integrate authentication, data grid, charts, and forms into a production-ready shell.

### Hour 1-2: Shell Setup

```bash
npx create-mfe-app enterprise-shell --template enterprise
cd enterprise-shell
pnpm install
```

The enterprise template includes:
- Module Federation host configuration
- Keycloak authentication integration
- Permission-based route guards
- Sidebar navigation with role-aware menu items

Configure auth in `.env`:
```env
VITE_AUTH_PROVIDER=keycloak
VITE_KEYCLOAK_URL=https://auth.yourcompany.com
VITE_KEYCLOAK_REALM=your-realm
VITE_KEYCLOAK_CLIENT_ID=mfe-shell
```

### Hour 3-4: Data Grid Integration

Build a master-detail data page:

```typescript
import { DataGrid, type ColDef } from '@mfe/x-data-grid';

const columns: ColDef[] = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'name', headerName: 'Customer', flex: 1 },
  { field: 'status', headerName: 'Status', cellRenderer: 'statusBadge' },
  { field: 'total', headerName: 'Total', type: 'currency' },
  { field: 'date', headerName: 'Date', type: 'date' },
];

// Server-side row model for 100K+ rows
<DataGrid
  columns={columns}
  rowModelType="serverSide"
  serverSideDatasource={yourDatasource}
  pagination
  enableCharts        // Right-click → Chart Range
  enableExcelExport   // Export with formatting
/>
```

### Hour 5-6: Charts Dashboard

```typescript
import { LineChart, BarChart, PieChart } from '@mfe/x-charts';

<div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
  <LineChart
    data={revenueData}
    xField="month"
    yField="revenue"
    color="primary"
  />
  <PieChart
    data={categoryData}
    valueField="amount"
    labelField="category"
  />
</div>
```

### Hour 7-8: Forms with Validation

```typescript
import { Form, Input, Select, DatePicker, Button } from '@mfe/design-system';
import { useForm } from '@mfe/design-system/form';

const form = useForm({
  schema: orderSchema,  // Zod schema for validation
  defaultValues: { status: 'draft' },
});

<Form form={form} onSubmit={handleSubmit}>
  <Input name="customerName" label="Customer" required />
  <Select name="status" label="Status" options={statusOptions} />
  <DatePicker name="dueDate" label="Due Date" minDate={new Date()} />
  <Button type="submit" loading={form.isSubmitting}>
    Create Order
  </Button>
</Form>
```

**Result**: A production-ready enterprise starter with auth, grid, charts, and forms — all sharing a consistent theme and permission model.

---

## Migration Guides

### From MUI (Material UI)

| MUI | @mfe Equivalent | Notes |
|---|---|---|
| `@mui/material/Button` | `@mfe/design-system` Button | Similar API, different prop names |
| `@mui/x-data-grid-pro` | `@mfe/x-data-grid` | AG Grid-based, different column API |
| `@mui/x-charts` | `@mfe/x-charts` | Similar declarative API |
| `ThemeProvider` + `createTheme` | `ThemeProvider` + `createTheme` | Token-based instead of style overrides |
| `sx` prop | `className` + CSS modules / tokens | No runtime CSS-in-JS |

**Migration codemod**:
```bash
npx @mfe/codemod from-mui ./src
```

Handles: import rewrites, prop renames, theme migration. Manual review needed for `sx` prop usage and custom style overrides.

### From Ant Design

| Ant Design | @mfe Equivalent | Notes |
|---|---|---|
| `antd/Button` | `@mfe/design-system` Button | `type` prop → `variant` prop |
| `antd/Table` | `@mfe/x-data-grid` | Completely different API (AG Grid) |
| `antd/Form` | `@mfe/design-system/form` | Similar field-level validation |
| `ConfigProvider` | `ThemeProvider` | Token names differ |

**Migration codemod**:
```bash
npx @mfe/codemod from-antd ./src
```

### From Custom Solution

No codemod available. Recommended approach:

1. **Install @mfe packages** alongside existing components
2. **Adopt design tokens first** — replace hardcoded colors/spacing with `@mfe/design-system` tokens
3. **Replace page by page** — start with new pages, migrate existing pages incrementally
4. **Remove old dependencies** once all pages are migrated

---

## ROI Framework

Use these estimates when building a business case for platform adoption.

### Developer Time Savings

| Activity | Without platform | With @mfe | Savings |
|---|---|---|---|
| Build a data table page | 3-5 days | 2-4 hours | ~80% |
| Build a dashboard | 1-2 weeks | 1-2 days | ~75% |
| Implement dark mode | 1-2 weeks | 0 (built-in) | 100% |
| Add i18n support | 3-5 days | Config only | ~90% |
| Accessibility audit fixes | 2-4 weeks/quarter | Minimal (built-in) | ~70% |
| Cross-browser testing | 1 week/quarter | CI handles it | ~85% |

### Consistency Gains

| Metric | Before | After |
|---|---|---|
| Design drift (visual inconsistencies) | Common | Eliminated via tokens |
| Onboarding time for new devs | 2-4 weeks | 3-5 days |
| Component duplication across teams | 3-5 copies of common widgets | Single source |
| Accessibility violations per audit | 20-50 | < 5 |
| Bundle size (typical dashboard) | 800 KB+ (duplicate deps) | ~420 KB |

### Calculation Template

```
Annual developer cost savings =
  (Hours saved per developer per month) x
  (Number of developers) x
  (Hourly fully-loaded cost) x
  12 months

Example:
  20 hours/dev/month x 15 developers x $75/hour x 12 = $270,000/year
```

These are framework estimates. Actual ROI depends on team size, existing tech debt, and the number of applications being built.
