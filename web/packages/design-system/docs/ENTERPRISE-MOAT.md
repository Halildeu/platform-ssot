# Enterprise Moat -- Competitive Differentiation

Features that make `@mfe/design-system` uniquely suited for enterprise applications,
beyond what MUI, Ant Design, or Radix UI offer out of the box.

---

## 1. Four-Level Access Control System

### What It Is

A policy-driven access control system built into every interactive component.
Four access levels -- `full`, `readonly`, `disabled`, `hidden` -- are first-class
props on all interactive surfaces, with automatic ARIA semantics and an
`accessReason` tooltip explaining *why* a control is restricted.

### How It Works

```tsx
// Full access -- normal interactive component
<Button access="full">Save</Button>

// Readonly -- visible but non-interactive, proper ARIA
<Input access="readonly" accessReason="You don't have edit permissions" />

// Disabled -- greyed out with tooltip explanation
<Select access="disabled" accessReason="Complete previous step first" />

// Hidden -- invisible (CSS `invisible`, keeps layout)
<Button access="hidden">Admin Only</Button>
```

### Implementation

The system is composed of three layers:

1. **`access-controller.ts`** (`src/internal/access-controller.ts`)
   - Defines `AccessLevel` type: `"full" | "readonly" | "disabled" | "hidden"`
   - `AccessControlledProps` adds `access?` and `accessReason?` to any component
   - `resolveAccessState()` resolves an access level to boolean flags (`isHidden`, `isReadonly`, `isDisabled`)
   - `shouldBlockInteraction()` determines whether events should be blocked
   - `withAccessGuard()` wraps event handlers with automatic `preventDefault`/`stopPropagation` when interaction is blocked
   - `accessStyles()` returns Tailwind utility classes per access level (opacity, cursor, pointer-events)

2. **`event-guard.ts`** (`src/internal/interaction-core/event-guard.ts`)
   - `evaluateGuard()` evaluates composite state (access + disabled + loading) and returns a structured `EventGuardResult`
   - `guardEvent()` wraps any React event handler to block events when guard is active
   - `guardStyles()` returns CSS classes (cursor, opacity, pointer-events) for the guard state
   - `guardAria()` returns appropriate ARIA attributes (`aria-disabled`, `aria-readonly`, `aria-busy`)

3. **Component integration** -- Components import `AccessControlledProps` into their prop types and wire up `withAccessGuard` / `guardAria` / `stateAttrs`. Example from Switch:
   ```tsx
   export interface SwitchProps
     extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type">,
       AccessControlledProps { ... }
   ```

Components using access control include: Switch, Select, Radio, Checkbox, IconButton,
Slider, DatePicker, TimePicker, Combobox, Upload, Calendar, Pagination,
TablePagination, SectionTabs, DetailDrawer, and others.

### State Attributes

Access levels are reflected as `data-access` attributes on DOM elements via
`stateAttrs()`, enabling CSS-based styling with selectors like
`[data-access="readonly"]`.

### Why This Matters

| Capability | MUI | Ant Design | Radix | @mfe/design-system |
|---|---|---|---|---|
| `disabled` prop | Yes | Yes | Yes | Yes |
| `readonly` semantic level | No | No | No | **Yes** |
| `hidden` access level | No | No | No | **Yes** |
| `accessReason` tooltip | No | No | No | **Yes** |
| Unified `withAccessGuard` HOF | No | No | No | **Yes** |
| Auto ARIA for each level | Partial | Partial | Yes | **Yes** |

---

## 2. Interaction Core

### What It Is

A centralized interaction policy layer that standardizes focus management,
keyboard contracts, event guarding, semantic intent resolution, and state
attributes across all components.

### Subsystems

- **State Attributes** (`state-attributes.ts`) -- Standardized `data-*` attribute helpers
  (`data-access`, `data-state`, `data-status`, `data-loading`, `data-disabled`, `data-readonly`,
  `data-error`, `data-component`). Includes a CSS selector builder (`stateSelector()`).

- **Focus Policy** (`focus-policy.ts`) -- Four focus strategies (`ring`, `outline`, `inset`, `none`)
  with Tailwind class generators. Maps component types to default strategies
  (e.g., buttons get `ring`, links get `outline`).

- **Keyboard Contract** (`keyboard-contract.ts`) -- WAI-ARIA APG keyboard patterns codified as
  a registry (`KEYBOARD_CONTRACTS`). Covers Button, Switch, Checkbox, Radio, Select, Tabs,
  Accordion, Dialog, Combobox, Menu, Tooltip, Slider. `createKeyHandler()` maps key presses
  to semantic actions. `describeKeyboardContract()` generates human-readable docs.

- **Semantic Intent** (`semantic-intent.ts`) -- Maps raw user interactions to semantic intents
  (`activate`, `toggle`, `open`, `close`, `select`, `navigate`, etc.) regardless of input
  method (mouse, keyboard, touch). Decouples "what happened" from "what it means".

### Component Contract

`component-contract.ts` defines standardized prop interfaces (`InteractiveComponentProps`,
`FormFieldComponentProps`, `OverlayComponentProps`) and a `SlottableComponentProps` pattern
for compound component slot customization. Includes `auditComponentContract()` for API
compliance checks.

### Why This Matters

Most design systems leave keyboard behavior and focus management to individual component
authors. This system enforces consistency at the infrastructure level, so every component
follows the same WAI-ARIA patterns with zero per-component keyboard implementation effort.

---

## 3. Data Surface Primitives (AG Grid Integration)

### What It Is

A fully integrated AG Grid v34.3.1 layer that provides enterprise-grade data grid
capabilities with design system theming, variant management, server-side data adapters,
and design-token-driven styling.

### Architecture

The data surface is composed of five modular parts:

1. **`setup.ts`** -- Canonical AG Grid module registration point for the entire monorepo.
   Registers targeted modules (not `AllEnterpriseModule`) to minimize bundle size:
   - Core: AllCommunityModule
   - Row models: ServerSideRowModelModule, InfiniteRowModelModule
   - Filtering: AdvancedFilterModule, SetFilterModule
   - Side bar: SideBarModule, ColumnsToolPanelModule, FiltersToolPanelModule
   - Menus: MenuModule, ColumnMenuModule
   - Export: CsvExportModule, ExcelExportModule
   - Clipboard: ClipboardModule
   - Integrated Charts: IntegratedChartsModule (AG Charts 12.3.1)

2. **`GridShell`** -- Core AG Grid wrapper with theme class injection (`ag-theme-quartz`, etc.),
   density attribute for CSS variable switching (comfortable: 48px rows, compact: 36px rows),
   and ref-forwarded GridApi access.

3. **`EntityGridTemplate`** -- Orchestrator component composing GridShell + GridToolbar +
   VariantIntegration + DatasourceModeAdapter + TablePagination. This is the main public API
   for grid consumers. Supports full i18n via a comprehensive `messages` prop with 80+ translatable strings.

4. **`DatasourceModeAdapter`** -- Hook for server-side vs. client-side branching.
   Handles SSRM datasource factory, block caching config, and mode transitions
   (server -> client -> server). Uses v34 `setGridOption()` API.

5. **`VariantIntegration`** -- Grid view variant system (save/load/clone/delete).
   Collects full grid state (column state, filter model, advanced filter, sort, pivot,
   quick filter) and persists variants via API. Supports personal variants, global variants,
   global defaults, user defaults, and schema-version compatibility checks.

6. **`AgGridServer`** -- Simplified server-side wrapper that takes a `getData` callback
   and auto-creates an SSRM datasource.

### Theme Bridge

- **`grid-adapter.ts`** maps design tokens to AG Grid theme params (header colors, row colors,
  border colors, font sizes).
- **`chart-adapter.ts`** maps design tokens to chart library colors (primary, background, text,
  grid, tooltip, series palette).

### Why This Matters

| Capability | MUI | Ant Design | Radix | @mfe/design-system |
|---|---|---|---|---|
| AG Grid enterprise integration | No | No | N/A | **Yes** |
| Server-side row model adapter | No (DataGrid has own SSRM) | No | N/A | **Yes** |
| Grid variant save/load/clone | No | No | N/A | **Yes** |
| Grid schema version compat check | No | No | N/A | **Yes** |
| Token-to-grid theme bridge | No | No | N/A | **Yes** |
| Token-to-chart color bridge | No | No | N/A | **Yes** |
| Integrated Charts module | Separate product | No | N/A | **Yes** |

---

## 4. Multi-Axis Theme Governance

### What It Is

A theme system with 10 independently controllable axes, backed by a design token
pipeline with CI validation, and runtime persistence via localStorage.

### Theme Axes

| Axis | Values | Purpose |
|---|---|---|
| `appearance` | `light`, `dark`, `high-contrast` | Color scheme |
| `density` | `comfortable`, `compact` | Spacing and sizing |
| `radius` | `rounded`, `sharp` | Border radius |
| `elevation` | `raised`, `flat` | Shadow depth |
| `motion` | `standard`, `reduced` | Animation preference |
| `tableSurfaceTone` | `soft`, `normal`, `strong` | Table row contrast |
| `surfaceTone` | string (e.g., `soft-1`) | Surface background tint |
| `accent` | string | Accent color family |
| `overlayIntensity` | number (clamped from token config) | Overlay backdrop intensity |
| `overlayOpacity` | number (0-100) | Overlay backdrop opacity |

### Implementation

- **`ThemeProvider`** -- React context wrapping the imperative `theme-controller`
- **`theme-controller.ts`** -- Imperative state manager that persists to localStorage,
  applies `data-*` attributes and CSS custom properties on `<html>`, and notifies
  subscribers synchronously
- **`theme-contract.ts`** -- Reads the generated `theme-contract.json` at runtime;
  resolves mode keys with alias and coercion rule support
- **`semantic-theme.ts`** -- Defines all axis types and the `THEME_ATTRIBUTE_MAP`
  for DOM attribute names

### Token Pipeline

Two build pipelines with CI validation:

1. **Runtime Tokens** (`tokens:build:theme`)
   - Input: `design-tokens/figma.tokens.json`
   - Output: `theme.css` (CSS custom properties) + `theme-contract.json`
   - Generates axis-based selectors (`data-theme`, `data-radius`, `data-density`, etc.)

2. **Design-time Tokens** (`tokens:build`)
   - Input: TypeScript source files (color, spacing, radius, typography, motion, zIndex,
     elevation, opacity, density, focusRing, semantic)
   - Output: `tokens.json`, `tokens.css`, `token-types.ts`, `docs.json`

3. **Validation Gate** (`tokens:validate`)
   - Duplicate token name detection
   - Invalid color value validation (hex, rgb, rgba, hsl, hsla, CSS var, named color)
   - Invalid spacing/size value validation
   - Undefined or empty reference detection
   - **Blocks PR merge** on failure

### Why This Matters

| Capability | MUI | Ant Design | Radix | @mfe/design-system |
|---|---|---|---|---|
| Multi-axis theme (10 axes) | Partial (2-3) | Partial (2-3) | No | **Yes** |
| Token validation CI gate | No | No | No | **Yes** |
| Theme contract manifest | No | No | No | **Yes** |
| Coercion rules (axis combos) | No | No | No | **Yes** |
| Token-to-grid/chart adapters | No | No | N/A | **Yes** |
| High-contrast mode | Partial | No | No | **Yes** |
| Overlay intensity tokens | No | No | No | **Yes** |

---

## 5. Locale & RTL Support

### What It Is

A `LocaleProvider` and `useLocale()` hook that sets locale and text direction.
Automatic RTL detection for Arabic, Hebrew, Farsi, and Urdu locales.

### Implementation

```tsx
<DesignSystemProvider locale="ar">
  {/* Automatically sets dir="rtl" */}
  <App />
</DesignSystemProvider>
```

`DesignSystemProvider` composes both `ThemeProvider` and `LocaleProvider` into
a single wrapper.

### i18n in Components

Grid components (EntityGridTemplate, VariantIntegration, GridToolbar, AgGridServer,
TablePagination) accept `messages` / `localeText` props for full string externalization.
EntityGridTemplate alone has 80+ translatable message keys covering toolbar labels,
variant management, pagination, density, export, and grid overlays.

---

## 6. Codemod & Upgrade Tooling

### Migration Guide Generator

`scripts/generate-migration-guide.mjs` -- Scans all source files for `@deprecated`
JSDoc tags and `console.warn` deprecation patterns, then generates a markdown
migration guide. Helps consumers plan upgrades.

### Component API Diff

`scripts/component-diff.mjs` -- Compares public API surface (exported names)
between two git refs. Identifies added, removed, and changed exports.

### Semver Check

`scripts/ci/semver-check.mjs` -- Compares current public API against a saved
baseline (`api-baseline.json`). Detects breaking changes (removed exports)
that should trigger a major version bump. **Blocks CI** when breaking changes
are detected without a major bump.

### Deprecation Audit

`scripts/ci/deprecation-audit.mjs` -- Scans for deprecated APIs and reports
count per component. Can run in `--strict` mode to fail CI if any deprecations exist.

---

## 7. Platform-Level Quality Gates

### Quality Gate Runner

`scripts/ci/quality-gate.mjs` orchestrates all checks in sequence:

1. **Build** -- Full TypeScript build
2. **Tests** -- Vitest test suite
3. **Perf Benchmarks** -- Component render performance against stored baselines
4. **Bundle Size** -- Per-module size checks against `bundle-budget.json`
5. **Semver Check** -- API breaking change detection
6. **Deprecation Audit** -- Deprecated API inventory
7. **API Reference** -- Auto-generated API docs
8. **Pack Dry-Run** -- Validates npm package contents
9. **Visual Regression** -- Playwright screenshot comparison

### Additional CI Tools

| Script | Purpose |
|---|---|
| `ci/bundle-size.mjs` | Per-module size reporting with budgets |
| `ci/perf-benchmark.mjs` | Render perf regression detection (Button, Input, Select, etc.) |
| `ci/adoption-report.mjs` | Component usage tracking across consuming apps |
| `ci/generate-stories-report.mjs` | Storybook coverage report |
| `ci/visual-regression.sh` | Playwright visual snapshot init & comparison |

### Release Flow

| Script | Purpose |
|---|---|
| `release/publish-canary.mjs` | Canary releases (`X.Y.Z-canary.{timestamp}.{sha}`) |
| `release/publish-stable.mjs` | Stable releases |
| `release/pre-release-check.mjs` | Pre-release validation |

---

## Competitive Matrix

| Feature | MUI | Ant Design | Radix | @mfe/design-system |
|---|---|---|---|---|
| **Access Control** | | | | |
| 4-level access system | -- | -- | -- | Yes |
| `accessReason` tooltip | -- | -- | -- | Yes |
| Unified event guard | -- | -- | -- | Yes |
| **Interaction Core** | | | | |
| WAI-ARIA keyboard contract registry | -- | -- | Partial | Yes |
| Semantic intent resolver | -- | -- | -- | Yes |
| Focus policy system | Partial | -- | Partial | Yes |
| Component contract audit | -- | -- | -- | Yes |
| **Data Surface** | | | | |
| AG Grid enterprise integration | -- | -- | N/A | Yes |
| Server-side row model adapter | -- | -- | N/A | Yes |
| Grid variant save/load/clone | -- | -- | N/A | Yes |
| Token-to-grid theme bridge | -- | -- | N/A | Yes |
| Integrated Charts | -- | -- | N/A | Yes |
| **Theme Governance** | | | | |
| 10-axis theme system | -- | -- | -- | Yes |
| Token validation CI gate | -- | -- | -- | Yes |
| Theme contract manifest | -- | -- | -- | Yes |
| High-contrast mode | Partial | -- | -- | Yes |
| **Tooling** | | | | |
| Semver enforcement CI | -- | -- | -- | Yes |
| Bundle budget enforcement | Yes | -- | -- | Yes |
| Perf benchmark regression | -- | -- | -- | Yes |
| Migration guide generator | Yes | Yes | -- | Yes |
| API diff between refs | Yes | -- | -- | Yes |
| Deprecation audit CI | -- | -- | -- | Yes |
| Canary release flow | Yes | Yes | Yes | Yes |
| Visual regression CI | Yes | Yes | -- | Yes |

*"--" = not available out of the box; "Partial" = limited or requires significant custom work.*

---

## Summary

The three strongest differentiators are:

1. **Access Control System** -- No mainstream design system offers a four-level
   access model with reason tooltips and automatic ARIA. This directly maps to
   enterprise RBAC requirements without wrapper components.

2. **AG Grid Data Surface** -- A fully themed, variant-managed, server-side-capable
   grid integration with design token bridges. This eliminates the typical gap
   between "design system components" and "the grid we actually use."

3. **Multi-Axis Theme Governance** -- Ten independently controllable axes with
   CI-validated token pipelines, coercion rules, and contract manifests go well
   beyond the light/dark toggle most systems offer.
