# Compatibility Matrix

## Runtime Dependencies

| Dependency | Required Version | Notes |
|-----------|-----------------|-------|
| React | `>=18.0.0` | Hooks, `useId`, concurrent features |
| React DOM | `>=18.0.0` | `createPortal`, `<dialog>` element |
| clsx | `^2.1.1` | Class name composition (bundled) |
| tailwind-merge | `^3.3.1` | Tailwind class deduplication (bundled) |

### Heavyweight optional dependencies (bundled)

These are included in `dependencies` and used by advanced components:

| Dependency | Version | Used by |
|-----------|---------|---------|
| ag-grid-community | `34.3.1` | Data Grid |
| ag-grid-enterprise | `34.3.1` | Data Grid (enterprise features) |
| ag-grid-react | `34.3.1` | Data Grid React wrapper |
| ag-charts-community | `12.3.1` | Charts |
| ag-charts-enterprise | `12.3.1` | Charts (enterprise features) |
| @tanstack/react-query | `^5.90.10` | Async data components |

> Tree-shaking ensures these are only included in your bundle if you import the
> components that use them.

## Peer Dependencies

| Dependency | Version | Notes |
|-----------|---------|-------|
| `react` | `>=18.0.0` | Required |
| `react-dom` | `>=18.0.0` | Required |

## Supported Environments

| Environment | Version | Status |
|------------|---------|--------|
| Node.js | >=18.0.0 | SSR, build tooling |
| Chrome | Last 2 versions | Full support |
| Firefox | Last 2 versions | Full support |
| Safari | Last 2 versions | Full support |
| Edge | Last 2 versions | Full support |

## Framework Compatibility

| Framework | Version | Status | Notes |
|----------|---------|--------|-------|
| Next.js (App Router) | 13+ | Supported | `"use client"` required for interactive components |
| Next.js (Pages Router) | 12+ | Supported | Works without `"use client"` directive |
| Vite | 4+ | Supported | |
| Webpack | 5+ | Supported | |
| Create React App | 5+ | Supported | |

## Bundler Support

| Bundler | Tree-Shaking | ESM | CJS |
|---------|:------------:|:---:|:---:|
| webpack 5 | Yes | Yes | Yes |
| esbuild | Yes | Yes | Yes |
| Vite / Rollup | Yes | Yes | Yes |
| tsup | Yes | Yes | Yes |

### Module formats

The published package provides both ESM and CJS builds:

```
dist/
  esm/          # ES modules (import/export)
  cjs/          # CommonJS (require/module.exports)
  index.d.ts    # TypeScript declarations
```

Package `exports` field ensures bundlers resolve the correct format automatically.

### Side effects

The package declares `"sideEffects": false` for all modules except
`advanced/data-grid/setup`, enabling aggressive tree-shaking. Import only
the components you use:

```ts
// Good — only Input and Button are bundled
import { Input, Button } from "@mfe/design-system";

// Also works — deep imports
import { Input } from "@mfe/design-system/primitives/input";
import { FormField } from "@mfe/design-system/components/form-field";
```

## TypeScript

| TypeScript | Version | Notes |
|-----------|---------|-------|
| `>=5.4.0` | Supported | Minimum version tested |
| `5.x` | Recommended | |

All components export their prop types:

```ts
import type { InputProps, ButtonProps, SelectProps } from "@mfe/design-system";
```

## Semver Policy

- **Patch** (1.0.x): Bug fixes, no API changes
- **Minor** (1.x.0): New features, new components, deprecation warnings added
- **Major** (x.0.0): Breaking changes, deprecated API removal

## Deprecation Policy

1. A `@deprecated` JSDoc annotation and console warning are added in a **minor** release
2. A **2 minor release** grace period follows
3. The deprecated API is removed in the **next major** release

### Currently deprecated props

| Component | Deprecated Prop | Replacement |
|-----------|----------------|-------------|
| `Input` | `inputSize` | `size` |
| `Input` | `invalid` | `error` |
| `Select` | `selectSize` | `size` |
| `Checkbox` | `checkboxSize` | `size` |
| `Radio` | `radioSize` | `size` |
| `Switch` | `switchSize` | `size` |
