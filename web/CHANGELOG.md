# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **F4 Enterprise X Suite**: 6 new packages (x-data-grid, x-charts, x-scheduler, x-kanban, x-editor, x-form-builder)
- **@mfe/create-app**: CLI scaffold generator with 4 templates (dashboard, crud, admin, minimal)
- **@mfe/blocks**: Pre-built page templates (DashboardPageTemplate, CrudPageTemplate, etc.)
- **@mfe/docs**: Documentation portal built with Nextra 3
- **Design Lab**: Dual-preview engine (local stubs + runtime preview)
- **Quality Tab**: Category-aware depth scoring with 16 criteria
- **Security pipeline**: Trivy SCA, OWASP ZAP DAST, CycloneDX SBOM, Cosign signing
- **24 new component doc entries** for Enterprise X Suite (wave_13)

### Changed
- **Accessibility Scorecard**: Type-aware per-category scoring (display/interactive/form-field/overlay/container)
- **Enterprise-Ready Checklist**: Redesigned from 9 criteria to 16 category-aware depth criteria
- **Design tokens**: Dark mode readiness criterion added
- **AG Grid**: Full v34.3.1 activation with SSRM, charts, export

### Fixed
- `aria` substring false positive in a11y scoring (`includes("aria")` → `startsWith("aria")`)
- Space-named components not matching category Sets
- NotificationDrawer missing label (composite prop name)
- Nextra 3.3 compatibility (`_meta.json` → `_meta.ts`, `_app.tsx` required)
