# RB-ui-library-package-release

## Purpose
`mfe-ui-kit` paketinin fail-closed release/publish akisini, zorunlu evidence artefact'lariyla birlikte tanimlar.

## Required Inputs
- `web/packages/ui-kit/package.json` version alani guncel olmalidir.
- `docs/04-operations/RELEASE-NOTES/RELEASE-NOTES-ui-library.md` icinde ayni version icin yeni giris bulunmalidir.
- `ui-library-release` gate PASS olmalidir.

## Release Steps
1. `npm -C web run gate:ui-library-release`
2. `npm -C web run build-storybook`
3. `npm -C web run security:build-bundle`
4. `npm -C web run release:ui-library:manifest`
5. `CHROMATIC_PROJECT_TOKEN` varsa `npm -C web run chromatic`

## Required Evidence
- `web/storybook-static/index.html`
- `web/dist/ui-kit/remoteEntry.js`
- `web/dist/ui-kit/ui-library-release-manifest.v1.json`
- `web/test-results/releases/ui-library/latest/ui-library-release-manifest.v1.json`
- `web/test-results/releases/ui-library/latest/ui-library-release.summary.v1.json`
- `web/test-results/diagnostics/frontend-doctor/**/frontend-doctor.summary.v1.json`
- `web/test-results/diagnostics/ui-library-wave-gate/**/ui-library-wave-gate.summary.v1.json`
- `web/test-results/diagnostics/ui-library-release-gate/**/ui-library-release-gate.summary.v1.json`

## Rollback Rule
- Release gate FAIL ise release yapilmaz.
- Manifest version ile release notes version uyusmuyorsa release yapilmaz.
- `publish_bundle` artefact'larindan biri eksikse release yapilmaz.
