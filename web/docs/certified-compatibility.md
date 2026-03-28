# Certified Compatibility Matrix

Last verified: 2026-03-22
Verification method: CI matrix workflow (compatibility-matrix.yml)

## Supported Combinations

| | Node 20 | Node 22 |
|---|---------|---------|
| React 18.2 | Certified | Certified |
| React 18.3 | Certified | Certified |

## Build Tool Support

| Tool | Version | Status |
|------|---------|--------|
| Webpack 5 | 5.100+ | Certified |
| Vite | 5.x | Certified |
| Next.js 14 | 14.x | Certified |

## Module Federation

| Config | Status |
|--------|--------|
| Host + 6 remotes | Certified |
| Remote degradation | Tested |
| Shared dependency negotiation | Tested |

## AG Grid / AG Charts

| Package | Version | Status |
|---------|---------|--------|
| ag-grid-community | 34.3.1 | Certified |
| ag-grid-enterprise | 34.3.1 | Certified |
| ag-charts-community | 12.3.1 | Certified |

## X-Suite Packages

| Package | Version | Node 20 | Node 22 |
|---------|---------|---------|---------|
| @mfe/design-system | latest | Certified | Certified |
| @mfe/x-data-grid | latest | Certified | Certified |
| @mfe/x-charts | latest | Certified | Certified |
| @mfe/x-form-builder | latest | Certified | Certified |
| @mfe/x-editor | latest | Certified | Certified |
| @mfe/x-kanban | latest | Certified | Certified |
| @mfe/x-scheduler | latest | Certified | Certified |

## Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 120+ | Certified |
| Firefox | 121+ | Certified |
| Safari | 17+ | Certified |
| Edge | 120+ | Certified |

## How to Re-verify

```bash
# Run the full compatibility matrix locally
pnpm run verify

# Run specific matrix combination
NODE_VERSION=22 REACT_VERSION=18.3 pnpm run verify
```

The CI workflow `compatibility-matrix.yml` runs this matrix on every release branch push and weekly on `main`.
