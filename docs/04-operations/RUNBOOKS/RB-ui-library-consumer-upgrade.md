# RB-ui-library-consumer-upgrade

Status: Active
Owner: @team/platform

## Purpose

- `mfe-ui-kit` degisikliklerinde tuketici uygulama etkisini, semver guidance'ini ve migration checklist akislarini sabitlestirir.

## Canonical Inputs

- `docs/02-architecture/context/ui-library-consumer-upgrade.contract.v1.json`
- `docs/02-architecture/context/ui-library-consumer-owner-registry.v1.json`
- `docs/02-architecture/context/ui-library-consumer-upgrade-recipes.contract.v1.json`
- `docs/02-architecture/context/ui-library-consumer-codemod-candidates.contract.v1.json`
- `docs/02-architecture/context/ui-library-consumer-codemod-prototypes.contract.v1.json`
- `web/apps/mfe-shell/src/pages/admin/design-lab.index.json`
- `web/test-results/releases/ui-library/latest/ui-library-consumer-impact.v1.json`
- `web/test-results/releases/ui-library/latest/ui-library-upgrade-checklist.v1.json`
- `web/test-results/releases/ui-library/latest/ui-library-upgrade-recipes.v1.json`
- `web/test-results/releases/ui-library/latest/ui-library-upgrade-recipes.audit.v1.json`
- `web/test-results/releases/ui-library/latest/ui-library-codemod-candidates.v1.json`
- `web/test-results/releases/ui-library/latest/ui-library-codemod-candidates.audit.v1.json`
- `web/test-results/releases/ui-library/latest/ui-library-codemod-prototypes.v1.json`
- `web/test-results/releases/ui-library/latest/ui-library-codemod-prototypes.audit.v1.json`

## Review Classes

1. `patch-safe-lab-only`
2. `minor-single-app-review`
3. `minor-beta-external-review`
4. `major-cross-app-review`

## Default Playbook

1. Consumer impact artefact'inda etkilenen component ve app sinifini oku.
2. `singleAppBlastRadius` backlog'u varsa ilgili uygulama sahibini release turuna ekle.
3. `major-cross-app-review` sinifi varsa semver major review ve rollout notu zorunlu olsun.
4. Codemod support `dry-run-candidate` oldugu surece migration checklist, prototype preview ve evidence refs eksiksiz tutulur.
5. Owner registry override yoksa `.github/CODEOWNERS` fallback owner release owner'i olarak kabul edilir.
6. Tek-app backlog icin generated upgrade recipe artefact'i ve `audit:ui-library-upgrade-recipes` dry-run raporu birlikte okunur.
7. Codemod candidate backlog'u varsa `audit:ui-library-codemod-candidates` dry-run sonucu recipe audit ile birlikte okunur.
8. Prototype backlog'u varsa `audit:ui-library-codemod-prototypes` sonucu rewrite preview ve rollback plan kaniti olarak okunur.
