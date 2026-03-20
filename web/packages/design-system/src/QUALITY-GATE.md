# Quality Gate — 5-Layer Testing Standard

> **Package:** `@mfe/design-system`
> **Gate script:** `scripts/release/pre-release-check.mjs` (14 gates)
> **Updated:** 2026-03-20

---

## Release Gate — 14 Automated Gates

| # | Gate | What It Checks | Status |
|---|---|---|---|
| 1 | Clean Working Tree | No uncommitted changes | ✅ |
| 2 | Build | `tsup` (15 entries) + `tsc` → 0 error | ✅ |
| 3 | Tests | `vitest run` → 5,321 tests pass | ✅ |
| 4 | Perf Benchmarks | 16 component render budget (5/10/15ms tiers) | ✅ |
| 5 | Bundle Size | Per-module budget check (17 modules) | ✅ |
| 6 | Semver Check | Breaking change detection (730 exports) | ✅ |
| 7 | Deprecation Audit | @deprecated count + migration guidance | ✅ |
| 8 | API Reference | Generated docs up to date | ✅ |
| 9 | Pack Dry-Run | npm pack produces valid tarball | ✅ |
| 10 | Consumer Smoke | SSR render (15 components) + CJS require + subpath exports | ✅ |
| 11 | Visual Regression | Playwright snapshot diff (149 scenarios × 3 browsers = 447 tests) | ✅ |
| 12 | TS Warning Budget | 0 non-storybook TypeScript errors | ✅ |
| 13 | DesignLab Index | Python index build (232 items) | ✅ |
| 14 | Publish Dry-Run | npm publish --dry-run passes | ✅ |

**Result: 13/13 passed (14 total, 1 skippable: clean-tree)**

---

## Testing Layers

### Layer 1: Contract Tests (24+ files)

Every component has a `.contract.test.tsx` file verifying the public API contract.

- File pattern: `__tests__/<Component>.contract.test.tsx`
- Minimum: 8+ assertions per component
- Contracts: `InteractiveComponentProps`, `FormFieldComponentProps`, `OverlayComponentProps`
- axe-core `expectNoA11yViolations()` in every contract test

### Layer 2: A11y Regression

axe-core assertions and centralized a11y engine audit.

- Engine: `src/a11y/audit.ts` + `src/a11y/keyboard.ts`
- Helper: `src/__tests__/a11y-utils.ts` — `expectNoA11yViolations()`
- Checks: ARIA roles, label association, keyboard navigation, focus management
- 0 critical/serious violations

### Layer 3: Visual Regression

Playwright visual snapshot tests for composed components.

- Config: `playwright.config.ts`
- Test files: `src/__visual__/` (4 files, 35 scenarios)
  - `primitives.visual.ts` — 12 primitive tests
  - `components.visual.ts` — 10 component tests
  - `patterns.visual.ts` — 7 pattern tests
  - `dark-mode.visual.ts` — 6 dark mode tests
- Threshold: pixel diff < 1%
- Scripts: `npm run test:visual`, `npm run test:visual:update`

### Layer 4: Interaction Smoke

Keyboard integration tests for all interactive patterns.

- Centralized: `src/__tests__/keyboard-integration.test.tsx`
- Per-component: individual `__tests__/` directories
- Covers: Tab, Enter, Escape, Arrow keys

### Layer 5: Boundary Enforcement

ESLint rules preventing cross-layer imports.

- `tokens/` → no React imports
- `internal/` (headless) → no styled component imports
- `advanced/` → no components/ imports

---

## Current Compliance Status

### Primitives (24/24 contract coverage ✅)

| Component | Unit Test | Contract Test | A11y (axe) | Keyboard | Visual |
|---|---|---|---|---|---|
| Button | ✅ | ✅ (17) | ✅ | ✅ | ✅ |
| Input | ✅ | ✅ (15) | ✅ | ✅ | ✅ |
| Select | ✅ | ✅ (12) | ✅ | ✅ | ✅ |
| Switch | ✅ | ✅ (15) | ✅ | ✅ | ✅ |
| Checkbox | ✅ | ✅ (17) | ✅ | ✅ | ✅ |
| Radio | ✅ | ✅ (17) | ✅ | ✅ | ✅ |
| Dialog | ✅ | ✅ | ✅ | ✅ | — |
| Modal | ✅ | ✅ | ✅ | ✅ | — |
| Popover | ✅ | ✅ | ✅ | ✅ | — |
| Tooltip | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dropdown | ✅ | ✅ | ✅ | ✅ | — |
| Badge | ✅ | ✅ (18) | ✅ | — | ✅ |
| Tag | ✅ | ✅ | ✅ | — | — |
| Avatar | ✅ | ✅ (19) | ✅ | — | — |
| Alert | ✅ | ✅ (14) | ✅ | — | ✅ |
| Spinner | ✅ | ✅ (13) | ✅ | — | ✅ |
| Skeleton | ✅ | ✅ | ✅ | — | ✅ |
| Text | ✅ | ✅ (45) | ✅ | — | — |
| Card | ✅ | ✅ | ✅ | — | ✅ |
| Divider | ✅ | ✅ | ✅ | — | — |
| IconButton | ✅ | ✅ (23) | ✅ | — | — |
| LinkInline | ✅ | ✅ (21) | ✅ | — | — |
| Stack | ✅ | ✅ | ✅ | — | — |
| Drawer | ✅ | ✅ (23) | ✅ | ✅ | — |

### Components (24+ contract coverage)

| Component | Unit Test | Contract Test | A11y (axe) | Keyboard | Visual |
|---|---|---|---|---|---|
| Tabs | ✅ | ✅ | ✅ | ✅ | ✅ |
| Pagination | ✅ | ✅ | ✅ | — | — |
| Steps | ✅ | ✅ | ✅ | — | ✅ |
| Breadcrumb | ✅ | ✅ | ✅ | — | — |
| DatePicker | ✅ | ✅ | ✅ | — | ✅ |
| Combobox | ✅ | ✅ | ✅ | ✅ | — |
| Slider | ✅ | ✅ | ✅ | ✅ | — |
| Rating | ✅ | ✅ | ✅ | — | — |
| SearchInput | ✅ | ✅ | ✅ | — | — |
| Accordion | ✅ | ✅ | ✅ | ✅ | ✅ |
| CommandPalette | ✅ | ✅ | — | ✅ | ✅ |
| InputNumber | ✅ | ✅ (16) | ✅ | ✅ | — |
| Autocomplete | ✅ | ✅ (15) | ✅ | ✅ | — |
| Upload | ✅ | ✅ (17) | ✅ | — | ✅ |
| Timeline | ✅ | ✅ | ✅ | — | ✅ |
| Tree | ✅ | ✅ | ✅ | — | ✅ |
| Calendar | ✅ | ✅ | ✅ | — | ✅ |
| ColorPicker | ✅ | ✅ (16) | ✅ | — | ✅ |
| Toast | ✅ | ✅ (11) | ✅ | — | — |
| Segmented | ✅ | ✅ (13) | ✅ | — | — |
| Mentions | ✅ | ✅ (15) | ✅ | — | — |
| List | ✅ | ✅ (13) | ✅ | — | — |
| MenuBar | ✅ | ✅ (11) | ✅ | — | — |
| NavigationRail | ✅ | ✅ (12) | ✅ | — | — |
| ContextMenu | ✅ | ✅ (11) | ✅ | — | — |
| Transfer | ✅ | ✅ (15) | ✅ | — | — |
| Cascader | ✅ | ✅ (16) | ✅ | — | — |
| TimePicker | ✅ | ✅ (19) | ✅ | — | — |

### Patterns (10/10 contract coverage ✅)

| Component | Unit Test | Contract Test | A11y (axe) | Visual |
|---|---|---|---|---|
| PageHeader | ✅ | ✅ | ✅ | ✅ |
| PageLayout | ✅ | ✅ (15) | ✅ | ✅ |
| DetailDrawer | ✅ | ✅ (15) | ✅ | ✅ |
| FilterBar | ✅ | ✅ (12) | ✅ | ✅ |
| SummaryStrip | ✅ | ✅ (9) | ✅ | ✅ |
| MasterDetail | ✅ | ✅ (13) | ✅ | ✅ |
| DetailSummary | ✅ | ✅ (13) | ✅ | ✅ |
| FormDrawer | ✅ | ✅ (13) | ✅ | — |
| EntitySummaryBlock | ✅ | ✅ (10) | ✅ | — |
| ReportFilterPanel | ✅ | ✅ (13) | ✅ | — |

### Advanced

| Component | Unit Test | Contract Test |
|---|---|---|
| DataGrid (AG Grid) | ✅ | ✅ (grid-parity) |
| TablePagination | ✅ | ✅ |

### Foundation

| Module | Unit Test | Isolation Test |
|---|---|---|
| Tokens | ✅ | ✅ (token-isolation + token-build) |
| Icons | ✅ (38) | — |
| Headless Hooks | ✅ | — |
| Interaction Core | ✅ | — |
| Overlay Engine | ✅ | — |
| A11y Engine | ✅ | — |

### Cross-cutting Test Suites

| Suite | File | Status |
|---|---|---|
| Keyboard Integration | `src/__tests__/keyboard-integration.test.tsx` | ✅ Active |
| Visual Quality | `src/__tests__/visual-quality.test.tsx` | ✅ Active |
| Edge Cases | `src/__tests__/edge-cases.test.tsx` | ✅ Active |
| Robustness | `src/__tests__/robustness.test.tsx` | ✅ Active |
| Infrastructure | `src/__tests__/infrastructure.test.tsx` | ✅ Active |
| SSR Safety | `src/__tests__/ssr-smoke.test.ts` | ✅ Active |
| Hydration Smoke | `src/__tests__/hydration-smoke.test.tsx` | ✅ Active |
| Memory Leak | `src/__tests__/memory-leak.test.tsx` | ✅ Active |
| Perf Benchmark | `src/__tests__/perf-benchmark.test.tsx` | ✅ Active |
| State Preview | `src/__tests__/state-preview-contract.test.ts` | ✅ Active |
| E2E Integration | `src/__tests__/e2e-integration.test.tsx` | ✅ Active (20 flows) |
| A11y Depth | `src/__tests__/a11y-depth.test.tsx` | ✅ Active (30 states) |
| Focus Order Audit | `src/__tests__/focus-order-audit.test.tsx` | ✅ Active |
| Dark Mode Contract | `src/__tests__/dark-mode-contract.test.tsx` | ✅ Active (86 tests) |

---

## Metrics

| Metric | Value |
|---|---|
| Total test files | 224 |
| Total tests | 5,321 |
| Test duration | ~18s |
| Contract test files | 95 (24 primitives + 57 components + 10 patterns + 4 advanced/cross-cutting) |
| Dark mode contract tests | 86 (25 primitives + 51 components + 10 patterns) |
| Bundle budget modules | 17 |
| Release gates | 14 total, 1 skippable (clean-tree) — 13/13 PASS |
| ESLint boundary rules | 3 (tokens, internal, advanced) |
| Deprecated annotations | 0 (all 107 removed for v2.0.0) |
| Deep import entry points | 15 |
| Headless hooks | 8 |
| Icons | 51 (7 categories) |
| Visual test scenarios | 447 (149 scenarios × 3 browsers: chromium, firefox, webkit) |
| Hardcoded color violations | 0 (12 files cleaned) |

---

## Progression

1. ✅ F0 — Release Truth (13/13 gate pass, 14 total, 1 skippable: clean-tree)
2. ✅ F1 — Package Topology (15 deep imports, boundary enforcement)
3. ✅ F2 — Foundation (tokens, icons, headless hooks, a11y)
4. ✅ F3 — Core Completeness (0 deprecated, v2.0.0 ready, 5,310 tests)
5. ⬜ F4 — Enterprise X Suite (Scheduler, Kanban, Editor)
6. ⬜ F5 — Blocks & App Kits
7. ⬜ F6 — Docs & DX
8. ⬜ F7 — Commercial Readiness
