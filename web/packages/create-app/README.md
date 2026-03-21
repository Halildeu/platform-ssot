# @mfe/create-app

CLI scaffold generator for applications built with `@mfe/design-system` and `@mfe/blocks`.

## Usage

```bash
npx @mfe/create-app my-app
```

The CLI will prompt you to select a template and configuration options.

## Templates

| Template    | Description                              | Key Dependencies         |
| ----------- | ---------------------------------------- | ------------------------ |
| `dashboard` | KPI cards + charts + activity feed       | `@mfe/x-charts`         |
| `crud`      | List + detail + create/edit forms        | `@mfe/x-data-grid`      |
| `admin`     | Settings panel + user management         | `@mfe/x-form-builder`   |
| `minimal`   | Bare minimum with design-system wired up | --                       |

## What Gets Generated

Each template produces a ready-to-run Vite + React + TypeScript application:

```
my-app/
  package.json
  tsconfig.json
  vite.config.ts
  index.html
  src/
    main.tsx          # DesignSystemProvider + BrowserRouter
    App.tsx           # Route definitions
    index.css         # Global reset
    layouts/          # AppLayout with nav (dashboard/crud/admin)
    pages/            # Page components using @mfe/blocks templates
    data/             # Sample data (crud template)
```

All templates come pre-wired with:

- `@mfe/design-system` via `DesignSystemProvider`
- `@mfe/blocks` page templates and composable blocks
- `react-router-dom` routing
- Vite dev server on port 3000

## Programmatic API

```typescript
import { generateTemplate } from '@mfe/create-app';

const files = generateTemplate({
  name: 'my-app',
  template: 'dashboard',
  typescript: true,
  installDeps: true,
  git: true,
});

// files: TemplateFile[] — array of { path, content } pairs
```

## Development

```bash
# Run tests
pnpm test

# Type check
pnpm typecheck
```

## Next Steps

After scaffolding your app:

1. **Explore the docs portal** — Run `pnpm --filter @mfe/docs dev` to browse component docs, API references, and guides
2. **Add pre-built blocks** — Import from `@mfe/blocks` for dashboard widgets, CRUD templates, and admin panels
3. **Customize your theme** — Use the Theme Builder in Design Lab at `/admin/design-lab`
4. **Check quality** — Run `npm run verify` to validate typecheck + tests + build

### Useful Links

- [Architecture Overview](../../docs/architecture-overview.md)
- [Troubleshooting Guide](../../apps/docs/pages/troubleshooting.mdx)
- [First Contribution](../../docs/first-contribution.md)
- [Performance SLA](../../docs/performance-sla.md)
- [Compatibility Matrix](../../docs/compatibility-matrix.md)
