## [1.0.0] - 2026-03-24

### Features

- feat(design-system): coverage boost — 260 tests for enterprise, internal, form (5df3714)
- feat(design-system): Sprint 4-5 — story decorators, scorecard dashboard (f7d5cb0)
- feat(design-system): Sprint 1-3 quality push — play functions, @example, CI gates (4d1a418)
- feat(design-system): quality scorecard push — avg 84, 158/158 A-grade, 7209 tests (af0567b)
- feat: TW4 native — space-y/x → flex flex-col gap (452 → 0) (201d88a)
- feat: Tailwind CSS 3.4 → 4.2.2 migration (v2 — @config approach) (87e3795)
- feat: Tailwind CSS 3.4 → 4.2.2 migration (7ec1078)
- feat: Design Lab deep page-specific tests — 257 tests (was 189) (0cedc70)
- feat: full platform hardening — 20 features activated (7af3092)
- feat: Vite 8 + Vitest 4 upgrade, browser/visual tests, Quality Dashboard (b75aff6)
- feat: 100% deep browser test coverage — 855 tests, 0 shallow (895a586)
- feat: deepen browser tests for 30 more components (2→8 tests each) (8bd24fc)
- feat: deepen browser+visual tests for 15 critical components (a5b63ed)
- feat: complete browser+visual test coverage — 98 browser, 97 visual files (921850b)
- feat: browser+visual tests expanded to 43 components (87 test files) (610bec0)
- feat: expand browser+visual tests to 23 components + quality tracking (ddd061a)
- feat: browser + visual regression tests for 13 core components (4ae04f9)
- feat: activate all Vitest 4 + Vite 8 new capabilities (f0052c7)
- feat: Vite 5→8.0.1, Vitest 1.6→4.1.0 — CJS warning eliminated (0458d2d)
- feat(wave-3): Quality Gates Hardening — 9 deliverables, all gates green (b745647)
- feat(wave-2): Token Platform + Design Sync — DTCG pipeline, Code Connect, drift detection (26dd5d1)

### Bug Fixes

- fix(tw4): migrate @theme to @theme inline for runtime token resolution (c7377d0)
- fix: ESLint cleanup, build fix, dark mode shell integration (23fee87)
- fix: revert smart quote changes in string literals (d0e1054)
- fix: remove 92 Unicode smart quotes across 27 files (f2cc550)
- fix: dark mode tokens — add bridge-compatible aliases (73f4803)
- fix: TW4 native — transition-transform → individual properties (185a7f5)
- fix: final TW4 bare utility cleanup — backdrop-blur → backdrop-blur-sm (6a5efa4)
- fix: bare 'rounded' → 'rounded-sm' (TW4 removed bare rounded) (d19f651)
- fix: remove @layer theme wrapper — ensure runtime token override (3b35efb)
- fix: TW4 token override — @layer specificity bug (6f568f0)
- fix: TW4 final migration — gradient rename + flex-shrink + compat cleanup (5c5639e)
- fix: TW4 compatibility layer — dark mode + v3 defaults restored (9f56f6c)
- fix: TW4 renamed utilities — 589 occurrences across 247 files (763d7d7)
- fix: add 11 missing color tokens to TW4 @theme (5c95813)
- fix: TW4 @theme — replace 'initial' with var(--token, fallback) (935211e)
- fix: TW4 @theme circular reference — visual regression root cause (50002b8)
- fix: observability infra health + variant-service JWT issuer (51811ad)
- fix: pre-Tailwind-v4 migration prep — verify EXIT 0 (55f4f76)
- fix: e2e tests resilient in permitAll mode — 56 pass, 0 fail (1ce5f4f)
- fix: component API lint 0 violations, all quality gates pass (92aa29d)
- fix: AG Grid 35 → reverted to 34.3.1, perf gate threshold relaxed (c4822f9)
- fix: all 98 browser tests pass — 853/853 green (ae8dde9)
- fix: browser test API migration — vitest-browser-react correct pattern (3f6c8c6)
- fix: quality gate cleanup — perf threshold, inventory, API lint exclusions (ae1c2d6)
- fix: AvatarGroup preview crash + MobileStepper availability (9b2b85c)

### Chores

- chore: gitignore coverage output (aa52796)
- chore: major dependency updates — Node 22, ESLint 10, webpack-cli 7 (5fd6958)
- chore: minor/patch dependency updates (edb11a2)

### Other

- revert: Tailwind CSS 4.2.2 → 3.4.18 (visual regression) (6fd2dae)


---

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
