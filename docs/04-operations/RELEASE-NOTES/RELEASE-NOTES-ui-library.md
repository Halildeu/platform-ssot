# RELEASE-NOTES-ui-library

Bu dosya `mfe-ui-kit` için paket ve lifecycle release notlarinin kanonik kaydidır.

## Entry Template
- version:
- date:
- changed_components:
- lifecycle_changes:
- breaking_changes:
- migration_notes:
- evidence_refs:

## Entries
- version: 1.1.0
  date: 2026-03-08
  changed_components: overlay_extensions, release_pipeline_hardening, package_release_manifest, publish_workflow
  lifecycle_changes: exported=85, planned=0; ui-kit release/publish kontrati fail-closed hale getirildi
  breaking_changes: none
  migration_notes: module federation kullanan tuketiciler './library' expose yuzeyini referans alabilir; mevcut package importlari degismedi
  evidence_refs:
    - web/apps/mfe-shell/src/pages/admin/design-lab.index.json
    - web/test-results/diagnostics/frontend-doctor/**/frontend-doctor.summary.v1.json
    - web/test-results/diagnostics/ui-library-wave-gate/**/ui-library-wave-gate.summary.v1.json
    - web/test-results/diagnostics/ui-library-release-gate/**/ui-library-release-gate.summary.v1.json
    - web/test-results/releases/ui-library/latest/ui-library-release-manifest.v1.json
    - web/test-results/releases/ui-library/latest/ui-library-release.summary.v1.json
    - docs/04-operations/RUNBOOKS/RB-ui-library-package-release.md
    - docs/03-delivery/TEST-PLANS/TP-0302-release-deploy-e2e-v0-1.md
- version: 1.0.0
  date: 2026-03-07
  changed_components: foundation, navigation, forms, data display batch-1
  lifecycle_changes: registry lifecycle alanlari guncellendi
  breaking_changes: none
  migration_notes: none
  evidence_refs:
    - web/apps/mfe-shell/src/pages/admin/design-lab.index.json
    - web/test-results/diagnostics/frontend-doctor/**/frontend-doctor.summary.v1.json
    - web/test-results/diagnostics/ui-library-wave-gate/**/ui-library-wave-gate.summary.v1.json
