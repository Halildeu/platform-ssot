# Changelog

All notable changes to `@mfe/design-system` will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- **Build Pipeline**: ESM + CJS dual output via tsup, TypeScript declarations via tsc
- **"use client" directive**: Barrel-level RSC boundary on `src/index.ts` and `src/advanced/data-grid/setup.ts`
- **SSR Safety**: Guarded all module-level browser API access (OverlayPositioning, scroll-lock, ui-adapter)
- **SSR Smoke Test**: 3-test suite verifying safe Node.js import (`src/__tests__/ssr-smoke.test.ts`)
- **Hydration Smoke Test**: SSR-to-hydration round-trip verification for presentational components
- **Uncontrolled Mode**: Added `defaultChecked`/`defaultValue`/`defaultCurrent` to Checkbox, Radio, Select, Switch, Pagination, Steps
- **Focus Restore**: `useFocusRestore` hook for overlay components (FormDrawer, DetailDrawer)
- **Component Scaffold**: `scripts/scaffold-component.mjs` for new component creation
- **CI Scripts**:
  - `scripts/ci/bundle-size.mjs` -- per-module size tracking with budget enforcement
  - `scripts/ci/semver-check.mjs` -- public API surface change detection
  - `scripts/ci/deprecation-audit.mjs` -- @deprecated annotation scanner
  - `scripts/ci/adoption-report.mjs` -- app x component usage matrix
  - `scripts/ci/visual-regression.sh` -- visual regression runner
  - `scripts/ci/generate-stories-report.mjs` -- Storybook coverage report
- **API Reference Generator**: `scripts/generate-api-reference.mjs` for auto-generated prop docs
- **Migration Guide Generator**: `scripts/generate-migration-guide.mjs`
- **Component Diff**: `scripts/component-diff.mjs` for API surface diffing
- **Documentation**:
  - `docs/CLIENT-ONLY-COMPONENTS.md` -- SSR boundary analysis
  - `docs/SSR-RSC-BOUNDARY.md` -- "use client" strategy decision
  - `docs/OVERLAY-CAPABILITY-MATRIX.md` -- per-component x per-capability breakdown
  - `docs/OVERLAY-DECISIONS.md` -- overlay architecture decisions
  - `docs/BEHAVIOR-CONTRACT-MATRIX.md` -- component x behavior matrix
  - `docs/TOKEN-PIPELINE.md` -- token build ownership contract
  - `docs/ANTD-LOCKFILE-AUDIT.md` -- antd residue audit
  - `docs/COMPATIBILITY.md` -- runtime/browser/framework support matrix
  - `docs/API-STABILITY-TIERS.md` -- prop stability classification
  - `docs/EDGE-CASES.md` -- verified edge-case behaviors
  - `docs/PORTAL-BEHAVIOR.md` -- portal rendering strategy
  - `docs/SLOT-PATTERN.md` -- slot/slotProps composition guide
  - `docs/USAGE-RECIPES.md` -- integration recipes overview
  - `docs/MIGRATION-NOTES.md` -- migration notes
  - `docs/rationale/DESIGN-DECISIONS.md` -- architecture decisions
  - `docs/recipes/` -- react-hook-form, zod, Next.js integration guides
- **Issue Templates**: Bug report, feature request, RFC templates (`.github/ISSUE_TEMPLATE/`)
- **Test Suites**: Edge-case, infrastructure, keyboard-integration, robustness, visual-quality, state-preview-contract tests

### Changed
- **Package exports**: Source paths for dev, dist paths in `publishConfig`
- **displayName**: Added to GridShell, SectionTabs, Calendar, TimePicker, Slider, Combobox, DatePicker, Upload, IconButton, LazyComponent, PortalProvider, and drawer patterns
- **FormField re-export**: Renamed adaptive-form FormField to AdaptiveFormField to resolve naming clash

### Fixed
- **usePortal.tsx**: Renamed from .ts to .tsx (JSX in non-JSX file)
- **OverlayPositioning**: SSR-safe window.innerWidth/innerHeight access
- **scroll-lock**: SSR-safe document.body access
- **ui-adapter**: SSR-safe document.documentElement default parameter

### Deprecated
- See `docs/API-STABILITY-TIERS.md` for full deprecation inventory

## [1.0.0] - Initial Release
- Enterprise-grade component library with 91 components across primitives, components, patterns, and advanced tiers
- Full accessibility: axe-core, keyboard navigation, WCAG compliance
- Access control system (full/readonly/hidden/disabled)
- AG Grid v34.3.1 integration (data-grid, charts)
- Token-based theming with dark mode support
- Slot/slotProps composition pattern
- Overlay engine (Dialog, Modal, Popover, Tooltip, Drawers)
