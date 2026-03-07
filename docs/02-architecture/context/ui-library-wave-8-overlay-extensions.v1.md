# UI Library Wave 8: Overlay Extensions

- Wave ID: `wave_8_overlay_extensions`
- Family: `overlay`
- Status: `completed`

## Scope

- `ContextMenu`
- `TourCoachmarks`

## Goal

Overlay backlog'unda kalan `ContextMenu` ve `TourCoachmarks` bileşenlerini export + live preview + browser doctor evidence seviyesine taşımak.

## Required Read Order

- `docs/02-architecture/context/repo-context-pack.v1.json`
- `docs/02-architecture/context/ui-library-governance.contract.v1.json`
- `docs/02-architecture/context/ux-katalogu.reference.v1.json`
- `docs/02-architecture/context/ui-library-ux-alignment.v1.json`
- `docs/02-architecture/context/ui-library-component-roadmap.v1.json`
- `docs/02-architecture/context/ui-library-wave-8-overlay-extensions.v1.json`
- `docs/02-architecture/context/ui-library-system.context.v1.json`
- `docs/02-architecture/blueprints/ui-library-system-blueprint.v1.json`
- `docs/00-handbook/STYLE-WEB-001.md`
- `web/packages/ui-kit/src/catalog/component-registry.v1.json`

## Completed Components

- `ContextMenu`
- `TourCoachmarks`

## Gate

- `python3 scripts/check_ui_library_wave_8_overlay_extensions.py`
- `npm -C web run gate:ui-library-wave -- --wave wave_8_overlay_extensions`
