#!/usr/bin/env python3
from __future__ import annotations

from ui_library_checks import (
    ensure_dict,
    ensure_exists,
    ensure_list,
    fail,
    load_json,
    load_json_with_authorities,
    load_text,
    ok,
    path_in_repo,
    read_web_scripts,
)


SCRIPT = "check_ui_library_package_release_contract"


def main() -> int:
    required = [
        "docs/02-architecture/context/ui-library-package-release.contract.v1.json",
        "web/packages/ui-kit/package.json",
        "web/apps/mfe-shell/src/pages/admin/design-lab.index.json",
        "web/packages/ui-kit/webpack.prod.js",
    ]
    missing = ensure_exists(*required)
    if missing:
        return fail(SCRIPT, [f"missing-file:{path}" for path in missing])

    contract = load_json_with_authorities(required[0])
    release_manifest_path = str(contract.get("release_manifest_path") or "").strip()
    package_json = load_json_with_authorities(required[1])
    index = load_json_with_authorities(required[2])
    webpack_prod = load_text(required[3])
    release_manifest = load_json(release_manifest_path) if release_manifest_path and path_in_repo(release_manifest_path).is_file() else {}
    scripts = read_web_scripts()
    release = ensure_dict(index.get("release"))
    latest_release = ensure_dict(release.get("latestRelease"))
    catalog_metrics = ensure_dict(latest_release.get("catalogMetrics"))
    registry_summary = ensure_dict(release.get("registrySummary"))
    adoption = ensure_dict(index.get("adoption"))
    migration = ensure_dict(index.get("migration"))
    migration_summary = ensure_dict(migration.get("summary"))
    owner_resolution = ensure_dict(migration.get("ownerResolution"))
    upgrade_playbook = ensure_dict(migration.get("upgradePlaybook"))
    upgrade_checklist = ensure_dict(migration.get("upgradeChecklist"))
    upgrade_recipes = ensure_dict(migration.get("upgradeRecipes"))
    codemod_candidates = ensure_dict(migration.get("codemodCandidates"))
    codemod_apply = ensure_dict(codemod_candidates.get("applyExecutor"))
    codemod_manual_review = ensure_dict(codemod_candidates.get("manualReview"))
    codemod_manual_decision = ensure_dict(codemod_manual_review.get("decisions"))
    codemod_prototypes = ensure_dict(codemod_candidates.get("prototypes"))
    release_manifest_migration = ensure_dict(release_manifest.get("migration"))
    release_manifest_upgrade_recipes = ensure_dict(release_manifest_migration.get("upgradeRecipes"))
    release_manifest_codemod_candidates = ensure_dict(release_manifest_migration.get("codemodCandidates"))
    release_manifest_codemod_apply = ensure_dict(release_manifest_codemod_candidates.get("applyExecutor"))
    release_manifest_codemod_manual_review = ensure_dict(release_manifest_codemod_candidates.get("manualReview"))
    release_manifest_codemod_manual_decision = ensure_dict(release_manifest_codemod_manual_review.get("decisions"))
    release_manifest_codemod_prototypes = ensure_dict(release_manifest_codemod_candidates.get("prototypes"))
    semver_guidance = ensure_dict(migration.get("semverGuidance"))
    change_classes = ensure_dict(migration.get("changeClasses"))
    change_class_summary = ensure_dict(change_classes.get("summary"))
    visual = ensure_dict(index.get("visualRegression"))
    visual_summary = ensure_dict(visual.get("summary"))
    review_channel = ensure_dict(visual.get("reviewChannel"))
    surface_summary = ensure_dict(adoption.get("surfaceSummary"))
    api_coverage = ensure_dict(adoption.get("apiCoverage"))
    module_federation = ensure_dict(adoption.get("moduleFederation"))
    problems: list[str] = []

    if index.get("release", {}).get("packageVersion") != package_json.get("version"):
        problems.append("package-version-drift")

    for script_name in contract.get("required_scripts", []):
        if script_name not in scripts:
            problems.append(f"missing-web-script:{script_name}")
    if ensure_list(release.get("requiredScripts")) != ensure_list(contract.get("required_scripts")):
        problems.append("release-required-scripts-drift")

    if "'./library'" not in webpack_prod and '"./library"' not in webpack_prod:
        problems.append("missing-library-expose")

    if adoption.get("previewRoute") != "/admin/design-lab":
        problems.append("adoption-preview-route-drift")

    visual_review_contract_path = str(contract.get("visual_review_contract_path") or "").strip()
    consumer_upgrade_contract_path = str(contract.get("consumer_upgrade_contract_path") or "").strip()
    consumer_owner_registry_path = str(contract.get("consumer_owner_registry_path") or "").strip()
    consumer_upgrade_recipes_contract_path = str(contract.get("consumer_upgrade_recipes_contract_path") or "").strip()
    consumer_codemod_candidates_contract_path = str(contract.get("consumer_codemod_candidates_contract_path") or "").strip()
    consumer_codemod_dry_run_contract_path = str(contract.get("consumer_codemod_dry_run_contract_path") or "").strip()
    consumer_codemod_apply_contract_path = str(contract.get("consumer_codemod_apply_contract_path") or "").strip()
    consumer_codemod_manual_review_contract_path = str(contract.get("consumer_codemod_manual_review_contract_path") or "").strip()
    consumer_codemod_manual_decision_contract_path = str(contract.get("consumer_codemod_manual_decision_contract_path") or "").strip()
    consumer_codemod_apply_preview_contract_path = str(contract.get("consumer_codemod_apply_preview_contract_path") or "").strip()
    consumer_codemod_prototypes_contract_path = str(contract.get("consumer_codemod_prototypes_contract_path") or "").strip()
    upgrade_checklist_artifact_path = str(contract.get("upgrade_checklist_artifact_path") or "").strip()
    i18n_coverage_artifact_path = str(contract.get("i18n_coverage_artifact_path") or "").strip()
    i18n_pseudo_smoke_artifact_path = str(contract.get("i18n_pseudo_smoke_artifact_path") or "").strip()
    i18n_surface_artifact_path = str(contract.get("i18n_surface_artifact_path") or "").strip()
    upgrade_recipes_artifact_path = str(contract.get("upgrade_recipes_artifact_path") or "").strip()
    upgrade_recipes_audit_artifact_path = str(contract.get("upgrade_recipes_audit_artifact_path") or "").strip()
    codemod_candidates_artifact_path = str(contract.get("codemod_candidates_artifact_path") or "").strip()
    codemod_candidates_audit_artifact_path = str(contract.get("codemod_candidates_audit_artifact_path") or "").strip()
    codemod_dry_run_artifact_path = str(contract.get("codemod_dry_run_artifact_path") or "").strip()
    codemod_dry_run_audit_artifact_path = str(contract.get("codemod_dry_run_audit_artifact_path") or "").strip()
    codemod_apply_artifact_path = str(contract.get("codemod_apply_artifact_path") or "").strip()
    codemod_apply_audit_artifact_path = str(contract.get("codemod_apply_audit_artifact_path") or "").strip()
    codemod_manual_review_artifact_path = str(contract.get("codemod_manual_review_artifact_path") or "").strip()
    codemod_manual_review_audit_artifact_path = str(contract.get("codemod_manual_review_audit_artifact_path") or "").strip()
    codemod_manual_decision_artifact_path = str(contract.get("codemod_manual_decision_artifact_path") or "").strip()
    codemod_manual_decision_audit_artifact_path = str(contract.get("codemod_manual_decision_audit_artifact_path") or "").strip()
    codemod_apply_preview_artifact_path = str(contract.get("codemod_apply_preview_artifact_path") or "").strip()
    codemod_apply_preview_audit_artifact_path = str(contract.get("codemod_apply_preview_audit_artifact_path") or "").strip()
    codemod_prototypes_artifact_path = str(contract.get("codemod_prototypes_artifact_path") or "").strip()
    codemod_prototypes_audit_artifact_path = str(contract.get("codemod_prototypes_audit_artifact_path") or "").strip()
    release_notes_artifact_path = str(contract.get("release_notes_artifact_path") or "").strip()
    changelog_artifact_path = str(contract.get("changelog_artifact_path") or "").strip()
    upgrade_recipes_audit = (
        load_json(upgrade_recipes_audit_artifact_path)
        if upgrade_recipes_audit_artifact_path and path_in_repo(upgrade_recipes_audit_artifact_path).is_file()
        else {}
    )
    codemod_candidates_artifact = (
        load_json(codemod_candidates_artifact_path)
        if codemod_candidates_artifact_path and path_in_repo(codemod_candidates_artifact_path).is_file()
        else {}
    )
    codemod_candidates_audit = (
        load_json(codemod_candidates_audit_artifact_path)
        if codemod_candidates_audit_artifact_path and path_in_repo(codemod_candidates_audit_artifact_path).is_file()
        else {}
    )
    codemod_dry_run_artifact = (
        load_json(codemod_dry_run_artifact_path)
        if codemod_dry_run_artifact_path and path_in_repo(codemod_dry_run_artifact_path).is_file()
        else {}
    )
    codemod_dry_run_audit = (
        load_json(codemod_dry_run_audit_artifact_path)
        if codemod_dry_run_audit_artifact_path and path_in_repo(codemod_dry_run_audit_artifact_path).is_file()
        else {}
    )
    codemod_apply_artifact = (
        load_json(codemod_apply_artifact_path)
        if codemod_apply_artifact_path and path_in_repo(codemod_apply_artifact_path).is_file()
        else {}
    )
    codemod_apply_audit = (
        load_json(codemod_apply_audit_artifact_path)
        if codemod_apply_audit_artifact_path and path_in_repo(codemod_apply_audit_artifact_path).is_file()
        else {}
    )
    codemod_manual_review_artifact = (
        load_json(codemod_manual_review_artifact_path)
        if codemod_manual_review_artifact_path and path_in_repo(codemod_manual_review_artifact_path).is_file()
        else {}
    )
    codemod_manual_review_audit = (
        load_json(codemod_manual_review_audit_artifact_path)
        if codemod_manual_review_audit_artifact_path and path_in_repo(codemod_manual_review_audit_artifact_path).is_file()
        else {}
    )
    codemod_manual_decision_artifact = (
        load_json(codemod_manual_decision_artifact_path)
        if codemod_manual_decision_artifact_path and path_in_repo(codemod_manual_decision_artifact_path).is_file()
        else {}
    )
    codemod_manual_decision_audit = (
        load_json(codemod_manual_decision_audit_artifact_path)
        if codemod_manual_decision_audit_artifact_path and path_in_repo(codemod_manual_decision_audit_artifact_path).is_file()
        else {}
    )
    codemod_apply_preview_artifact = (
        load_json(codemod_apply_preview_artifact_path)
        if codemod_apply_preview_artifact_path and path_in_repo(codemod_apply_preview_artifact_path).is_file()
        else {}
    )
    codemod_apply_preview_audit = (
        load_json(codemod_apply_preview_audit_artifact_path)
        if codemod_apply_preview_audit_artifact_path and path_in_repo(codemod_apply_preview_audit_artifact_path).is_file()
        else {}
    )
    codemod_prototypes_artifact = (
        load_json(codemod_prototypes_artifact_path)
        if codemod_prototypes_artifact_path and path_in_repo(codemod_prototypes_artifact_path).is_file()
        else {}
    )
    codemod_prototypes_audit = (
        load_json(codemod_prototypes_audit_artifact_path)
        if codemod_prototypes_audit_artifact_path and path_in_repo(codemod_prototypes_audit_artifact_path).is_file()
        else {}
    )
    i18n_coverage_artifact = (
        load_json(i18n_coverage_artifact_path)
        if i18n_coverage_artifact_path and path_in_repo(i18n_coverage_artifact_path).is_file()
        else {}
    )
    i18n_pseudo_smoke_artifact = (
        load_json(i18n_pseudo_smoke_artifact_path)
        if i18n_pseudo_smoke_artifact_path and path_in_repo(i18n_pseudo_smoke_artifact_path).is_file()
        else {}
    )
    i18n_surface_artifact = (
        load_json(i18n_surface_artifact_path)
        if i18n_surface_artifact_path and path_in_repo(i18n_surface_artifact_path).is_file()
        else {}
    )
    if not consumer_upgrade_contract_path or not path_in_repo(consumer_upgrade_contract_path).is_file():
        problems.append("missing-consumer-upgrade-contract")
    if not consumer_owner_registry_path or not path_in_repo(consumer_owner_registry_path).is_file():
        problems.append("missing-consumer-owner-registry")
    if not consumer_upgrade_recipes_contract_path or not path_in_repo(consumer_upgrade_recipes_contract_path).is_file():
        problems.append("missing-consumer-upgrade-recipes-contract")
    if not consumer_codemod_candidates_contract_path or not path_in_repo(consumer_codemod_candidates_contract_path).is_file():
        problems.append("missing-consumer-codemod-candidates-contract")
    if not consumer_codemod_dry_run_contract_path or not path_in_repo(consumer_codemod_dry_run_contract_path).is_file():
        problems.append("missing-consumer-codemod-dry-run-contract")
    if not consumer_codemod_apply_contract_path or not path_in_repo(consumer_codemod_apply_contract_path).is_file():
        problems.append("missing-consumer-codemod-apply-contract")
    if not consumer_codemod_manual_review_contract_path or not path_in_repo(consumer_codemod_manual_review_contract_path).is_file():
        problems.append("missing-consumer-codemod-manual-review-contract")
    if not consumer_codemod_manual_decision_contract_path or not path_in_repo(consumer_codemod_manual_decision_contract_path).is_file():
        problems.append("missing-consumer-codemod-manual-decision-contract")
    if not consumer_codemod_apply_preview_contract_path or not path_in_repo(consumer_codemod_apply_preview_contract_path).is_file():
        problems.append("missing-consumer-codemod-apply-preview-contract")
    if not consumer_codemod_prototypes_contract_path or not path_in_repo(consumer_codemod_prototypes_contract_path).is_file():
        problems.append("missing-consumer-codemod-prototypes-contract")
    if not visual_review_contract_path or not path_in_repo(visual_review_contract_path).is_file():
        problems.append("missing-visual-review-contract")
    if not release_manifest_path or not path_in_repo(release_manifest_path).is_file():
        problems.append("missing-release-manifest")
    elif review_channel.get("contractPath") != visual_review_contract_path:
        problems.append("visual-review-contract-drift")
    if not bool(review_channel.get("configured")):
        problems.append("visual-review-channel-unconfigured")
    if review_channel.get("provider") != "chromatic":
        problems.append("visual-review-provider-drift")
    if review_channel.get("reviewMode") not in {"artifact_only", "hosted_review"}:
        problems.append("visual-review-mode-invalid")

    public_exports = int(surface_summary.get("publicExports") or 0)
    documented_exports = int(api_coverage.get("documentedExports") or 0)
    undocumented_exports = int(api_coverage.get("undocumentedExports") or 0)
    if public_exports <= 0:
        problems.append("missing-adoption-surface-summary")
    if public_exports != documented_exports + undocumented_exports:
        problems.append("adoption-api-coverage-drift")
    if "./library" not in ensure_list(module_federation.get("exposes")):
        problems.append("adoption-missing-library-expose")
    if int(registry_summary.get("stable") or 0) != int(surface_summary.get("stableExports") or 0):
        problems.append("release-registry-stable-drift")
    if int(registry_summary.get("beta") or 0) != int(surface_summary.get("betaExports") or 0):
        problems.append("release-registry-beta-drift")
    if int(registry_summary.get("apiCatalogItems") or 0) != documented_exports:
        problems.append("release-registry-api-drift")
    if int(catalog_metrics.get("exported") or 0) != public_exports:
        problems.append("release-catalog-exported-drift")
    if int(catalog_metrics.get("stable") or 0) != int(surface_summary.get("stableExports") or 0):
        problems.append("release-catalog-stable-drift")
    if int(catalog_metrics.get("beta") or 0) != int(surface_summary.get("betaExports") or 0):
        problems.append("release-catalog-beta-drift")
    if int(catalog_metrics.get("apiCatalogItems") or 0) != documented_exports:
        problems.append("release-catalog-api-drift")
    if int(catalog_metrics.get("storyCoveredComponents") or 0) != int(visual_summary.get("storybookCoveredComponents") or 0):
        problems.append("release-catalog-story-coverage-drift")
    if int(catalog_metrics.get("adoptedOutsideLab") or 0) != int(migration_summary.get("adoptedOutsideLabComponents") or 0):
        problems.append("release-catalog-adoption-drift")
    if int(catalog_metrics.get("consumerAppsCount") or 0) != int(migration_summary.get("consumerAppsCount") or 0):
        problems.append("release-catalog-consumer-apps-drift")

    release_notes_path = str(release.get("releaseNotesPath") or "").strip()
    if not release_notes_path or not path_in_repo(release_notes_path).is_file():
        problems.append("missing-release-notes")

    if not migration_summary:
        problems.append("missing-migration-summary")
    if not owner_resolution:
        problems.append("missing-owner-resolution")
    if consumer_upgrade_contract_path and upgrade_playbook.get("contractPath") != consumer_upgrade_contract_path:
        problems.append("migration-upgrade-playbook-drift")
    if not upgrade_playbook:
        problems.append("missing-upgrade-playbook")
    if consumer_owner_registry_path and owner_resolution.get("contractPath") != consumer_owner_registry_path:
        problems.append("migration-owner-registry-drift")
    if not upgrade_checklist:
        problems.append("missing-upgrade-checklist")
    if not upgrade_recipes:
        problems.append("missing-upgrade-recipes")
    if not codemod_candidates:
        problems.append("missing-codemod-candidates")
    if not codemod_prototypes:
        problems.append("missing-codemod-prototypes")
    if not semver_guidance:
        problems.append("missing-semver-guidance")
    if not change_class_summary:
        problems.append("missing-migration-change-classes")
    migration_artifact_path = str(migration.get("artifactPath") or "").strip()
    if not migration_artifact_path or not path_in_repo(migration_artifact_path).is_file():
        problems.append("missing-migration-artifact")
    if not upgrade_checklist_artifact_path or not path_in_repo(upgrade_checklist_artifact_path).is_file():
        problems.append("missing-upgrade-checklist-artifact")
    if not upgrade_recipes_artifact_path or not path_in_repo(upgrade_recipes_artifact_path).is_file():
        problems.append("missing-upgrade-recipes-artifact")
    if not upgrade_recipes_audit_artifact_path or not path_in_repo(upgrade_recipes_audit_artifact_path).is_file():
        problems.append("missing-upgrade-recipes-audit-artifact")
    if not codemod_candidates_artifact_path or not path_in_repo(codemod_candidates_artifact_path).is_file():
        problems.append("missing-codemod-candidates-artifact")
    if not codemod_candidates_audit_artifact_path or not path_in_repo(codemod_candidates_audit_artifact_path).is_file():
        problems.append("missing-codemod-candidates-audit-artifact")
    if not codemod_dry_run_artifact_path or not path_in_repo(codemod_dry_run_artifact_path).is_file():
        problems.append("missing-codemod-dry-run-artifact")
    if not codemod_dry_run_audit_artifact_path or not path_in_repo(codemod_dry_run_audit_artifact_path).is_file():
        problems.append("missing-codemod-dry-run-audit-artifact")
    if not codemod_apply_artifact_path or not path_in_repo(codemod_apply_artifact_path).is_file():
        problems.append("missing-codemod-apply-artifact")
    if not codemod_apply_audit_artifact_path or not path_in_repo(codemod_apply_audit_artifact_path).is_file():
        problems.append("missing-codemod-apply-audit-artifact")
    if not codemod_manual_review_artifact_path or not path_in_repo(codemod_manual_review_artifact_path).is_file():
        problems.append("missing-codemod-manual-review-artifact")
    if not codemod_manual_review_audit_artifact_path or not path_in_repo(codemod_manual_review_audit_artifact_path).is_file():
        problems.append("missing-codemod-manual-review-audit-artifact")
    if not codemod_manual_decision_artifact_path or not path_in_repo(codemod_manual_decision_artifact_path).is_file():
        problems.append("missing-codemod-manual-decision-artifact")
    if not codemod_manual_decision_audit_artifact_path or not path_in_repo(codemod_manual_decision_audit_artifact_path).is_file():
        problems.append("missing-codemod-manual-decision-audit-artifact")
    if not codemod_apply_preview_artifact_path or not path_in_repo(codemod_apply_preview_artifact_path).is_file():
        problems.append("missing-codemod-apply-preview-artifact")
    if not codemod_apply_preview_audit_artifact_path or not path_in_repo(codemod_apply_preview_audit_artifact_path).is_file():
        problems.append("missing-codemod-apply-preview-audit-artifact")
    if not codemod_prototypes_artifact_path or not path_in_repo(codemod_prototypes_artifact_path).is_file():
        problems.append("missing-codemod-prototypes-artifact")
    if not codemod_prototypes_audit_artifact_path or not path_in_repo(codemod_prototypes_audit_artifact_path).is_file():
        problems.append("missing-codemod-prototypes-audit-artifact")
    if not i18n_coverage_artifact_path or not path_in_repo(i18n_coverage_artifact_path).is_file():
        problems.append("missing-i18n-coverage-artifact")
    if not i18n_pseudo_smoke_artifact_path or not path_in_repo(i18n_pseudo_smoke_artifact_path).is_file():
        problems.append("missing-i18n-pseudo-smoke-artifact")
    if not i18n_surface_artifact_path or not path_in_repo(i18n_surface_artifact_path).is_file():
        problems.append("missing-i18n-surface-artifact")
    if not release_notes_artifact_path or not path_in_repo(release_notes_artifact_path).is_file():
        problems.append("missing-release-notes-artifact")
    if not changelog_artifact_path or not path_in_repo(changelog_artifact_path).is_file():
        problems.append("missing-changelog-artifact")
    if int(migration_summary.get("manualReviewRequiredComponents") or 0) != int(migration_summary.get("adoptedOutsideLabComponents") or 0):
        problems.append("migration-manual-review-drift")
    if int(migration_summary.get("crossAppReviewComponents") or 0) < 0:
        problems.append("migration-cross-app-invalid")
    if int(migration_summary.get("singleAppBlastRadiusCount") or 0) < 0:
        problems.append("migration-single-app-invalid")
    if int(change_class_summary.get("majorCrossAppReview") or 0) != int(migration_summary.get("crossAppReviewComponents") or 0):
        problems.append("migration-change-class-cross-app-drift")
    if int(migration_summary.get("ownerMappedAppsCount") or 0) != int(migration_summary.get("consumerAppsCount") or 0):
        problems.append("migration-owner-mapped-drift")
    if int(owner_resolution.get("ownerMappedAppsCount") or 0) != int(migration_summary.get("ownerMappedAppsCount") or 0):
        problems.append("migration-owner-resolution-summary-drift")
    if int(owner_resolution.get("unownedAppsCount") or 0) != 0:
        problems.append("migration-unowned-apps-present")
    if str(semver_guidance.get("recommendedBump") or "") not in {"patch", "minor", "major"}:
        problems.append("migration-semver-guidance-invalid")
    if int(ensure_dict(upgrade_checklist.get("summary")).get("totalItems") or 0) != int(migration_summary.get("manualReviewRequiredComponents") or 0):
        problems.append("migration-upgrade-checklist-total-drift")
    if int(ensure_dict(upgrade_recipes.get("summary")).get("singleAppRecipes") or 0) != int(
        ensure_dict(upgrade_checklist.get("summary")).get("singleAppItems") or 0
    ):
        problems.append("migration-upgrade-recipes-single-app-drift")
    codemod_summary = ensure_dict(codemod_candidates.get("summary"))
    codemod_dry_run = ensure_dict(codemod_candidates.get("dryRun"))
    codemod_apply_artifact_payload = ensure_dict(codemod_apply_artifact.get("codemodApply"))
    codemod_apply_artifact_summary = ensure_dict(codemod_apply_artifact_payload.get("summary"))
    codemod_manual_review_artifact_payload = ensure_dict(codemod_manual_review_artifact.get("codemodManualReview"))
    codemod_manual_review_artifact_summary = ensure_dict(codemod_manual_review_artifact_payload.get("summary"))
    codemod_manual_decision_artifact_payload = ensure_dict(
        codemod_manual_decision_artifact.get("codemodManualReviewDecisions")
    )
    codemod_manual_decision_artifact_summary = ensure_dict(codemod_manual_decision_artifact_payload.get("summary"))
    codemod_apply_preview = ensure_dict(codemod_dry_run.get("applyPreview"))
    codemod_artifact_payload = ensure_dict(codemod_candidates_artifact.get("codemodCandidates"))
    codemod_artifact_summary = ensure_dict(codemod_artifact_payload.get("summary"))
    codemod_dry_run_artifact_payload = ensure_dict(codemod_dry_run_artifact.get("codemodDryRun"))
    codemod_dry_run_artifact_summary = ensure_dict(codemod_dry_run_artifact_payload.get("summary"))
    codemod_apply_preview_artifact_payload = ensure_dict(codemod_apply_preview_artifact.get("codemodApplyPreview"))
    codemod_apply_preview_artifact_summary = ensure_dict(codemod_apply_preview_artifact_payload.get("summary"))
    codemod_items = ensure_list(codemod_candidates.get("items"))
    codemod_prototype_summary = ensure_dict(codemod_prototypes.get("summary"))
    codemod_prototype_focus_components = [
        str(entry).strip()
        for entry in ensure_list(codemod_prototypes.get("focusComponents"))
        if str(entry).strip()
    ]
    codemod_prototypes_artifact_payload = ensure_dict(codemod_prototypes_artifact.get("codemodPrototypes"))
    codemod_prototypes_artifact_summary = ensure_dict(codemod_prototypes_artifact_payload.get("summary"))
    if int(migration_summary.get("codemodReadyComponents") or 0) != int(codemod_summary.get("totalCandidates") or 0):
        problems.append("migration-codemod-ready-drift")
    if int(ensure_dict(upgrade_playbook.get("summary")).get("codemodReadyComponents") or 0) != int(
        codemod_summary.get("totalCandidates") or 0
    ):
        problems.append("migration-upgrade-playbook-codemod-ready-drift")
    if int(ensure_dict(upgrade_recipes.get("summary")).get("codemodCandidateCount") or 0) != int(
        codemod_summary.get("totalCandidates") or 0
    ):
        problems.append("migration-upgrade-recipes-codemod-drift")
    if str(codemod_candidates.get("contractPath") or "") != consumer_codemod_candidates_contract_path:
        problems.append("migration-codemod-contract-drift")
    if not codemod_dry_run:
        problems.append("missing-codemod-dry-run")
    if str(codemod_dry_run.get("contractPath") or "") != consumer_codemod_dry_run_contract_path:
        problems.append("migration-codemod-dry-run-contract-drift")
    if not codemod_apply:
        problems.append("missing-codemod-apply")
    if str(codemod_apply.get("contractPath") or "") != consumer_codemod_apply_contract_path:
        problems.append("migration-codemod-apply-contract-drift")
    if not codemod_manual_review:
        problems.append("missing-codemod-manual-review")
    if str(codemod_manual_review.get("contractPath") or "") != consumer_codemod_manual_review_contract_path:
        problems.append("migration-codemod-manual-review-contract-drift")
    if not codemod_manual_decision:
        problems.append("missing-codemod-manual-decision")
    if str(codemod_manual_decision.get("contractPath") or "") != consumer_codemod_manual_decision_contract_path:
        problems.append("migration-codemod-manual-decision-contract-drift")
    if not codemod_apply_preview:
        problems.append("missing-codemod-apply-preview")
    if str(codemod_apply_preview.get("contractPath") or "") != consumer_codemod_apply_preview_contract_path:
        problems.append("migration-codemod-apply-preview-contract-drift")
    if int(codemod_summary.get("dryRunReadyCandidates") or 0) != int(codemod_summary.get("totalCandidates") or 0):
        problems.append("migration-codemod-dry-run-drift")
    if int(codemod_summary.get("applyExecutorReadyCandidates") or 0) != sum(
        1 for item in codemod_items if bool(ensure_dict(item).get("applyExecutorIncluded"))
    ):
        problems.append("migration-codemod-apply-summary-drift")
    if int(codemod_summary.get("manualReviewFirstCandidates") or 0) != sum(
        1 for item in codemod_items if bool(ensure_dict(item).get("manualReviewIncluded"))
    ):
        problems.append("migration-codemod-manual-review-summary-drift")
    if int(codemod_summary.get("autoApplyReadyCandidates") or 0) != 0:
        problems.append("migration-codemod-auto-apply-invalid")
    if int(codemod_summary.get("lowRiskCount") or 0) + int(codemod_summary.get("mediumRiskCount") or 0) + int(
        codemod_summary.get("highRiskCount") or 0
    ) != int(codemod_summary.get("totalCandidates") or 0):
        problems.append("migration-codemod-risk-summary-drift")
    if codemod_artifact_payload and str(codemod_artifact_payload.get("contractPath") or "") != consumer_codemod_candidates_contract_path:
        problems.append("codemod-candidates-artifact-contract-drift")
    if codemod_artifact_summary and int(codemod_artifact_summary.get("totalCandidates") or 0) != int(
        codemod_summary.get("totalCandidates") or 0
    ):
        problems.append("codemod-candidates-artifact-summary-drift")
    if sum(1 for item in codemod_items if bool(ensure_dict(item).get("applyReady"))) != 0:
        problems.append("migration-codemod-apply-ready-item-present")
    if int(ensure_dict(codemod_dry_run.get("summary")).get("activeCandidateCount") or 0) != sum(
        1 for item in codemod_items if bool(ensure_dict(item).get("dryRunIncluded"))
    ):
        problems.append("migration-codemod-dry-run-active-drift")
    if int(ensure_dict(codemod_dry_run.get("summary")).get("focusCount") or 0) != len(
        ensure_list(codemod_dry_run.get("focusComponents"))
    ):
        problems.append("migration-codemod-dry-run-focus-drift")
    if codemod_dry_run_artifact_payload and str(codemod_dry_run_artifact_payload.get("contractPath") or "") != consumer_codemod_dry_run_contract_path:
        problems.append("codemod-dry-run-artifact-contract-drift")
    if codemod_dry_run_artifact_summary and int(codemod_dry_run_artifact_summary.get("focusedCandidates") or 0) != int(
        ensure_dict(codemod_dry_run.get("summary")).get("activeCandidateCount") or 0
    ):
        problems.append("codemod-dry-run-artifact-summary-drift")
    if int(ensure_dict(codemod_apply.get("summary")).get("focusCount") or 0) != len(
        ensure_list(codemod_apply.get("focusComponents"))
    ):
        problems.append("migration-codemod-apply-focus-drift")
    if str(codemod_apply.get("defaultWriteMode") or "") != "write_requires_flag":
        problems.append("migration-codemod-apply-default-write-drift")
    if bool(ensure_dict(codemod_apply.get("summary")).get("writeEnabledByDefault")):
        problems.append("migration-codemod-apply-write-enabled")
    if codemod_apply_artifact_payload and str(codemod_apply_artifact_payload.get("contractPath") or "") != consumer_codemod_apply_contract_path:
        problems.append("codemod-apply-artifact-contract-drift")
    if codemod_apply_artifact_summary and int(codemod_apply_artifact_summary.get("focusCandidateCount") or 0) != int(
        ensure_dict(codemod_apply.get("summary")).get("focusCount") or 0
    ):
        problems.append("codemod-apply-artifact-summary-drift")
    if int(ensure_dict(codemod_manual_review.get("summary")).get("focusCount") or 0) != len(
        ensure_list(codemod_manual_review.get("focusComponents"))
    ):
        problems.append("migration-codemod-manual-review-focus-drift")
    if str(codemod_manual_review.get("reviewMode") or "") != "manual-review-only":
        problems.append("migration-codemod-manual-review-mode-drift")
    if bool(codemod_manual_review.get("reviewWriteEnabled")):
        problems.append("migration-codemod-manual-review-write-enabled")
    if str(codemod_manual_review.get("approvalModel") or "") != "single-owner-direct-approval":
        problems.append("migration-codemod-manual-review-approval-model-drift")
    if str(codemod_manual_review.get("decisionStateDefault") or "") != "owner_review_pending":
        problems.append("migration-codemod-manual-review-decision-state-drift")
    if codemod_manual_review_artifact_payload and str(codemod_manual_review_artifact_payload.get("contractPath") or "") != consumer_codemod_manual_review_contract_path:
        problems.append("codemod-manual-review-artifact-contract-drift")
    if codemod_manual_review_artifact_summary and int(codemod_manual_review_artifact_summary.get("focusCandidateCount") or 0) != int(
        ensure_dict(codemod_manual_review.get("summary")).get("focusCount") or 0
    ):
        problems.append("codemod-manual-review-artifact-summary-drift")
    if int(ensure_dict(codemod_manual_review.get("summary")).get("pendingDecisionCount") or 0) != int(
        ensure_dict(codemod_manual_review.get("summary")).get("focusCount") or 0
    ):
        problems.append("migration-codemod-manual-review-pending-drift")
    if int(ensure_dict(codemod_manual_review.get("summary")).get("generatedChecklistItemCount") or 0) <= 0:
        problems.append("migration-codemod-manual-review-checklist-missing")
    if int(ensure_dict(codemod_manual_decision.get("summary")).get("focusCount") or 0) != len(
        ensure_list(codemod_manual_decision.get("focusComponents"))
    ):
        problems.append("migration-codemod-manual-decision-focus-drift")
    if str(codemod_manual_decision.get("decisionMode") or "") != "single-owner-direct-approval":
        problems.append("migration-codemod-manual-decision-mode-drift")
    if codemod_manual_decision_artifact_payload and str(codemod_manual_decision_artifact_payload.get("contractPath") or "") != consumer_codemod_manual_decision_contract_path:
        problems.append("codemod-manual-decision-artifact-contract-drift")
    if codemod_manual_decision_artifact_summary and int(codemod_manual_decision_artifact_summary.get("focusCandidateCount") or 0) != int(
        ensure_dict(codemod_manual_decision.get("summary")).get("focusCount") or 0
    ):
        problems.append("codemod-manual-decision-artifact-summary-drift")
    if int(ensure_dict(codemod_manual_decision.get("summary")).get("pendingDecisionCount") or 0) != 0:
        problems.append("migration-codemod-manual-decision-pending-drift")
    if int(ensure_dict(codemod_apply_preview.get("summary")).get("focusCount") or 0) != len(
        ensure_list(codemod_apply_preview.get("focusComponents"))
    ):
        problems.append("migration-codemod-apply-preview-focus-drift")
    if str(codemod_apply_preview.get("defaultWriteMode") or "") != "preview_only":
        problems.append("migration-codemod-apply-preview-default-write-drift")
    if codemod_apply_preview_artifact_payload and str(codemod_apply_preview_artifact_payload.get("contractPath") or "") != consumer_codemod_apply_preview_contract_path:
        problems.append("codemod-apply-preview-artifact-contract-drift")
    if codemod_apply_preview_artifact_summary and int(codemod_apply_preview_artifact_summary.get("focusCandidateCount") or 0) != int(
        ensure_dict(codemod_apply_preview.get("summary")).get("focusCount") or 0
    ):
        problems.append("codemod-apply-preview-artifact-summary-drift")
    if str(codemod_prototypes.get("contractPath") or "") != consumer_codemod_prototypes_contract_path:
        problems.append("migration-codemod-prototypes-contract-drift")
    if int(codemod_prototype_summary.get("focusCount") or 0) != len(codemod_prototype_focus_components):
        problems.append("migration-codemod-prototype-focus-drift")
    if int(codemod_prototype_summary.get("prototypeCount") or 0) != len(codemod_prototype_focus_components):
        problems.append("migration-codemod-prototype-count-drift")
    if int(codemod_prototype_summary.get("readyCount") or 0) != len(codemod_prototype_focus_components):
        problems.append("migration-codemod-prototype-ready-drift")
    if int(codemod_prototype_summary.get("missingCount") or 0) != 0:
        problems.append("migration-codemod-prototype-missing")
    if codemod_prototypes_artifact_payload and str(codemod_prototypes_artifact_payload.get("contractPath") or "") != consumer_codemod_prototypes_contract_path:
        problems.append("codemod-prototypes-artifact-contract-drift")
    if codemod_prototypes_artifact_summary and int(codemod_prototypes_artifact_summary.get("prototypeCount") or 0) != int(
        codemod_prototype_summary.get("prototypeCount") or 0
    ):
        problems.append("codemod-prototypes-artifact-summary-drift")
    ready_candidate_prototypes = sum(
        1
        for item in codemod_items
        if str(ensure_dict(item).get("component") or "").strip() in codemod_prototype_focus_components
        and str(ensure_dict(item).get("prototypeStatus") or "") == "ready"
    )
    if ready_candidate_prototypes != int(codemod_prototype_summary.get("readyCount") or 0):
        problems.append("migration-codemod-item-prototype-drift")
    if str(upgrade_recipes.get("contractPath") or "") != consumer_upgrade_recipes_contract_path:
        problems.append("migration-upgrade-recipes-contract-drift")
    if str(release_manifest.get("upgradeRecipesArtifactPath") or "") != upgrade_recipes_artifact_path:
        problems.append("release-manifest-upgrade-recipes-artifact-drift")
    if str(release_manifest.get("upgradeRecipesAuditArtifactPath") or "") != upgrade_recipes_audit_artifact_path:
        problems.append("release-manifest-upgrade-recipes-audit-artifact-drift")
    if str(release_manifest.get("codemodCandidatesArtifactPath") or "") != codemod_candidates_artifact_path:
        problems.append("release-manifest-codemod-candidates-artifact-drift")
    if str(release_manifest.get("codemodCandidatesAuditArtifactPath") or "") != codemod_candidates_audit_artifact_path:
        problems.append("release-manifest-codemod-candidates-audit-artifact-drift")
    if str(release_manifest.get("codemodDryRunArtifactPath") or "") != codemod_dry_run_artifact_path:
        problems.append("release-manifest-codemod-dry-run-artifact-drift")
    if str(release_manifest.get("codemodDryRunAuditArtifactPath") or "") != codemod_dry_run_audit_artifact_path:
        problems.append("release-manifest-codemod-dry-run-audit-artifact-drift")
    if str(release_manifest.get("codemodApplyArtifactPath") or "") != codemod_apply_artifact_path:
        problems.append("release-manifest-codemod-apply-artifact-drift")
    if str(release_manifest.get("codemodApplyAuditArtifactPath") or "") != codemod_apply_audit_artifact_path:
        problems.append("release-manifest-codemod-apply-audit-artifact-drift")
    if str(release_manifest.get("codemodManualReviewArtifactPath") or "") != codemod_manual_review_artifact_path:
        problems.append("release-manifest-codemod-manual-review-artifact-drift")
    if str(release_manifest.get("codemodManualReviewAuditArtifactPath") or "") != codemod_manual_review_audit_artifact_path:
        problems.append("release-manifest-codemod-manual-review-audit-artifact-drift")
    if str(release_manifest.get("codemodManualDecisionArtifactPath") or "") != codemod_manual_decision_artifact_path:
        problems.append("release-manifest-codemod-manual-decision-artifact-drift")
    if str(release_manifest.get("codemodManualDecisionAuditArtifactPath") or "") != codemod_manual_decision_audit_artifact_path:
        problems.append("release-manifest-codemod-manual-decision-audit-artifact-drift")
    if str(release_manifest.get("codemodApplyPreviewArtifactPath") or "") != codemod_apply_preview_artifact_path:
        problems.append("release-manifest-codemod-apply-preview-artifact-drift")
    if str(release_manifest.get("codemodApplyPreviewAuditArtifactPath") or "") != codemod_apply_preview_audit_artifact_path:
        problems.append("release-manifest-codemod-apply-preview-audit-artifact-drift")
    if str(release_manifest.get("codemodPrototypesArtifactPath") or "") != codemod_prototypes_artifact_path:
        problems.append("release-manifest-codemod-prototypes-artifact-drift")
    if str(release_manifest.get("codemodPrototypesAuditArtifactPath") or "") != codemod_prototypes_audit_artifact_path:
        problems.append("release-manifest-codemod-prototypes-audit-artifact-drift")
    if str(release_manifest.get("i18nCoverageArtifactPath") or "") != i18n_coverage_artifact_path:
        problems.append("release-manifest-i18n-coverage-artifact-drift")
    if str(release_manifest.get("i18nPseudoSmokeArtifactPath") or "") != i18n_pseudo_smoke_artifact_path:
        problems.append("release-manifest-i18n-pseudo-smoke-artifact-drift")
    if not release_manifest_upgrade_recipes:
        problems.append("release-manifest-missing-upgrade-recipes")
    elif str(release_manifest_upgrade_recipes.get("contractPath") or "") != consumer_upgrade_recipes_contract_path:
        problems.append("release-manifest-upgrade-recipes-contract-drift")
    if not release_manifest_codemod_candidates:
        problems.append("release-manifest-missing-codemod-candidates")
    elif str(release_manifest_codemod_candidates.get("contractPath") or "") != consumer_codemod_candidates_contract_path:
        problems.append("release-manifest-codemod-candidates-contract-drift")
    release_manifest_codemod_dry_run = ensure_dict(release_manifest_codemod_candidates.get("dryRun"))
    if not release_manifest_codemod_dry_run:
        problems.append("release-manifest-missing-codemod-dry-run")
    elif str(release_manifest_codemod_dry_run.get("contractPath") or "") != consumer_codemod_dry_run_contract_path:
        problems.append("release-manifest-codemod-dry-run-contract-drift")
    if not release_manifest_codemod_apply:
        problems.append("release-manifest-missing-codemod-apply")
    elif str(release_manifest_codemod_apply.get("contractPath") or "") != consumer_codemod_apply_contract_path:
        problems.append("release-manifest-codemod-apply-contract-drift")
    if not release_manifest_codemod_manual_review:
        problems.append("release-manifest-missing-codemod-manual-review")
    elif str(release_manifest_codemod_manual_review.get("contractPath") or "") != consumer_codemod_manual_review_contract_path:
        problems.append("release-manifest-codemod-manual-review-contract-drift")
    if not release_manifest_codemod_manual_decision:
        problems.append("release-manifest-missing-codemod-manual-decision")
    elif str(release_manifest_codemod_manual_decision.get("contractPath") or "") != consumer_codemod_manual_decision_contract_path:
        problems.append("release-manifest-codemod-manual-decision-contract-drift")
    release_manifest_codemod_apply_preview = ensure_dict(release_manifest_codemod_dry_run.get("applyPreview"))
    if not release_manifest_codemod_apply_preview:
        problems.append("release-manifest-missing-codemod-apply-preview")
    elif str(release_manifest_codemod_apply_preview.get("contractPath") or "") != consumer_codemod_apply_preview_contract_path:
        problems.append("release-manifest-codemod-apply-preview-contract-drift")
    if not release_manifest_codemod_prototypes:
        problems.append("release-manifest-missing-codemod-prototypes")
    elif str(release_manifest_codemod_prototypes.get("contractPath") or "") != consumer_codemod_prototypes_contract_path:
        problems.append("release-manifest-codemod-prototypes-contract-drift")
    audit_recipe_count = int(upgrade_recipes_audit.get("recipeCount") or 0)
    audit_pass_count = int(upgrade_recipes_audit.get("passCount") or 0)
    audit_fail_count = int(upgrade_recipes_audit.get("failCount") or 0)
    if audit_recipe_count != int(ensure_dict(upgrade_recipes.get("summary")).get("totalRecipes") or 0):
        problems.append("migration-upgrade-recipes-audit-count-drift")
    if audit_pass_count != audit_recipe_count:
        problems.append("migration-upgrade-recipes-audit-pass-drift")
    if audit_fail_count != 0:
        problems.append("migration-upgrade-recipes-audit-failures")
    manifest_latest_audit = ensure_dict(release_manifest_upgrade_recipes.get("latestAudit"))
    if audit_recipe_count and int(manifest_latest_audit.get("recipeCount") or 0) != audit_recipe_count:
        problems.append("release-manifest-upgrade-recipes-audit-summary-drift")
    codemod_audit_candidate_count = int(codemod_candidates_audit.get("candidateCount") or 0)
    codemod_audit_pass_count = int(codemod_candidates_audit.get("passCount") or 0)
    codemod_audit_fail_count = int(codemod_candidates_audit.get("failCount") or 0)
    if codemod_audit_candidate_count != int(codemod_summary.get("totalCandidates") or 0):
        problems.append("migration-codemod-audit-count-drift")
    if codemod_audit_pass_count != codemod_audit_candidate_count:
        problems.append("migration-codemod-audit-pass-drift")
    if codemod_audit_fail_count != 0:
        problems.append("migration-codemod-audit-failures")
    manifest_codemod_latest_audit = ensure_dict(release_manifest_codemod_candidates.get("latestAudit"))
    if codemod_audit_candidate_count and int(manifest_codemod_latest_audit.get("candidateCount") or 0) != codemod_audit_candidate_count:
        problems.append("release-manifest-codemod-audit-summary-drift")
    if codemod_audit_candidate_count and int(manifest_codemod_latest_audit.get("passCount") or 0) != codemod_audit_pass_count:
        problems.append("release-manifest-codemod-audit-pass-drift")
    if codemod_audit_candidate_count and int(manifest_codemod_latest_audit.get("failCount") or 0) != codemod_audit_fail_count:
        problems.append("release-manifest-codemod-audit-fail-drift")
    codemod_dry_run_candidate_count = int(codemod_dry_run_audit.get("candidateCount") or 0)
    codemod_dry_run_pass_count = int(codemod_dry_run_audit.get("passCount") or 0)
    codemod_dry_run_fail_count = int(codemod_dry_run_audit.get("failCount") or 0)
    if codemod_dry_run_candidate_count != int(ensure_dict(codemod_dry_run.get("summary")).get("activeCandidateCount") or 0):
        problems.append("migration-codemod-dry-run-audit-count-drift")
    if codemod_dry_run_pass_count != codemod_dry_run_candidate_count:
        problems.append("migration-codemod-dry-run-audit-pass-drift")
    if codemod_dry_run_fail_count != 0:
        problems.append("migration-codemod-dry-run-audit-failures")
    manifest_codemod_dry_run_latest_audit = ensure_dict(release_manifest_codemod_dry_run.get("latestAudit"))
    if codemod_dry_run_candidate_count and int(manifest_codemod_dry_run_latest_audit.get("candidateCount") or 0) != codemod_dry_run_candidate_count:
        problems.append("release-manifest-codemod-dry-run-audit-summary-drift")
    if codemod_dry_run_candidate_count and int(manifest_codemod_dry_run_latest_audit.get("passCount") or 0) != codemod_dry_run_pass_count:
        problems.append("release-manifest-codemod-dry-run-audit-pass-drift")
    if codemod_dry_run_candidate_count and int(manifest_codemod_dry_run_latest_audit.get("failCount") or 0) != codemod_dry_run_fail_count:
        problems.append("release-manifest-codemod-dry-run-audit-fail-drift")
    codemod_apply_candidate_count = int(codemod_apply_audit.get("candidateCount") or 0)
    codemod_apply_pass_count = int(codemod_apply_audit.get("passCount") or 0)
    codemod_apply_fail_count = int(codemod_apply_audit.get("failCount") or 0)
    codemod_apply_applied_count = int(codemod_apply_audit.get("appliedCount") or 0)
    if codemod_apply_candidate_count != int(ensure_dict(codemod_apply.get("summary")).get("focusCount") or 0):
        problems.append("migration-codemod-apply-audit-count-drift")
    if codemod_apply_pass_count != codemod_apply_candidate_count:
        problems.append("migration-codemod-apply-audit-pass-drift")
    if codemod_apply_fail_count != 0:
        problems.append("migration-codemod-apply-audit-failures")
    if codemod_apply_applied_count != 0:
        problems.append("migration-codemod-apply-applied-drift")
    manifest_codemod_apply_latest_audit = ensure_dict(release_manifest_codemod_apply.get("latestAudit"))
    if codemod_apply_candidate_count and int(manifest_codemod_apply_latest_audit.get("candidateCount") or 0) != codemod_apply_candidate_count:
        problems.append("release-manifest-codemod-apply-audit-summary-drift")
    if codemod_apply_candidate_count and int(manifest_codemod_apply_latest_audit.get("passCount") or 0) != codemod_apply_pass_count:
        problems.append("release-manifest-codemod-apply-audit-pass-drift")
    if codemod_apply_candidate_count and int(manifest_codemod_apply_latest_audit.get("failCount") or 0) != codemod_apply_fail_count:
        problems.append("release-manifest-codemod-apply-audit-fail-drift")
    codemod_manual_review_candidate_count = int(codemod_manual_review_audit.get("candidateCount") or 0)
    codemod_manual_review_pass_count = int(codemod_manual_review_audit.get("passCount") or 0)
    codemod_manual_review_fail_count = int(codemod_manual_review_audit.get("failCount") or 0)
    if codemod_manual_review_candidate_count != int(ensure_dict(codemod_manual_review.get("summary")).get("focusCount") or 0):
        problems.append("migration-codemod-manual-review-audit-count-drift")
    if codemod_manual_review_pass_count != codemod_manual_review_candidate_count:
        problems.append("migration-codemod-manual-review-audit-pass-drift")
    if codemod_manual_review_fail_count != 0:
        problems.append("migration-codemod-manual-review-audit-failures")
    manifest_codemod_manual_review_latest_audit = ensure_dict(release_manifest_codemod_manual_review.get("latestAudit"))
    if codemod_manual_review_candidate_count and int(manifest_codemod_manual_review_latest_audit.get("candidateCount") or 0) != codemod_manual_review_candidate_count:
        problems.append("release-manifest-codemod-manual-review-audit-summary-drift")
    if codemod_manual_review_candidate_count and int(manifest_codemod_manual_review_latest_audit.get("passCount") or 0) != codemod_manual_review_pass_count:
        problems.append("release-manifest-codemod-manual-review-audit-pass-drift")
    if codemod_manual_review_candidate_count and int(manifest_codemod_manual_review_latest_audit.get("failCount") or 0) != codemod_manual_review_fail_count:
        problems.append("release-manifest-codemod-manual-review-audit-fail-drift")
    if codemod_manual_review_candidate_count and int(manifest_codemod_manual_review_latest_audit.get("pendingDecisionCount") or 0) != int(
        codemod_manual_review_audit.get("pendingDecisionCount") or 0
    ):
        problems.append("release-manifest-codemod-manual-review-pending-drift")
    if codemod_manual_review_candidate_count and int(manifest_codemod_manual_review_latest_audit.get("singleOwnerApprovalCount") or 0) != int(
        codemod_manual_review_audit.get("singleOwnerApprovalCount") or 0
    ):
        problems.append("release-manifest-codemod-manual-review-owner-drift")
    if codemod_manual_review_candidate_count and int(manifest_codemod_manual_review_latest_audit.get("generatedChecklistItemCount") or 0) != int(
        codemod_manual_review_audit.get("generatedChecklistItemCount") or 0
    ):
        problems.append("release-manifest-codemod-manual-review-checklist-drift")
    codemod_manual_decision_candidate_count = int(codemod_manual_decision_audit.get("candidateCount") or 0)
    codemod_manual_decision_pass_count = int(codemod_manual_decision_audit.get("passCount") or 0)
    codemod_manual_decision_fail_count = int(codemod_manual_decision_audit.get("failCount") or 0)
    if codemod_manual_decision_candidate_count != int(ensure_dict(codemod_manual_decision.get("summary")).get("focusCount") or 0):
        problems.append("migration-codemod-manual-decision-audit-count-drift")
    if codemod_manual_decision_pass_count != codemod_manual_decision_candidate_count:
        problems.append("migration-codemod-manual-decision-audit-pass-drift")
    if codemod_manual_decision_fail_count != 0:
        problems.append("migration-codemod-manual-decision-audit-failures")
    manifest_codemod_manual_decision_latest_audit = ensure_dict(release_manifest_codemod_manual_decision.get("latestAudit"))
    if codemod_manual_decision_candidate_count and int(manifest_codemod_manual_decision_latest_audit.get("candidateCount") or 0) != codemod_manual_decision_candidate_count:
        problems.append("release-manifest-codemod-manual-decision-audit-summary-drift")
    if codemod_manual_decision_candidate_count and int(manifest_codemod_manual_decision_latest_audit.get("passCount") or 0) != codemod_manual_decision_pass_count:
        problems.append("release-manifest-codemod-manual-decision-audit-pass-drift")
    if codemod_manual_decision_candidate_count and int(manifest_codemod_manual_decision_latest_audit.get("failCount") or 0) != codemod_manual_decision_fail_count:
        problems.append("release-manifest-codemod-manual-decision-audit-fail-drift")
    if codemod_manual_decision_candidate_count and int(manifest_codemod_manual_decision_latest_audit.get("approvedForApplyPreviewCount") or 0) != int(
        codemod_manual_decision_audit.get("approvedForApplyPreviewCount") or 0
    ):
        problems.append("release-manifest-codemod-manual-decision-approved-drift")
    if codemod_manual_decision_candidate_count and int(manifest_codemod_manual_decision_latest_audit.get("deferredUntilVisualReviewCount") or 0) != int(
        codemod_manual_decision_audit.get("deferredUntilVisualReviewCount") or 0
    ):
        problems.append("release-manifest-codemod-manual-decision-deferred-drift")
    if codemod_manual_decision_candidate_count and int(manifest_codemod_manual_decision_latest_audit.get("reviewOnlyManualRefactorCount") or 0) != int(
        codemod_manual_decision_audit.get("reviewOnlyManualRefactorCount") or 0
    ):
        problems.append("release-manifest-codemod-manual-decision-review-only-drift")
    if codemod_manual_decision_candidate_count and int(manifest_codemod_manual_decision_latest_audit.get("pendingDecisionCount") or 0) != int(
        codemod_manual_decision_audit.get("pendingDecisionCount") or 0
    ):
        problems.append("release-manifest-codemod-manual-decision-pending-drift")
    codemod_apply_preview_candidate_count = int(codemod_apply_preview_audit.get("candidateCount") or 0)
    codemod_apply_preview_pass_count = int(codemod_apply_preview_audit.get("passCount") or 0)
    codemod_apply_preview_fail_count = int(codemod_apply_preview_audit.get("failCount") or 0)
    codemod_apply_preview_applied_count = int(codemod_apply_preview_audit.get("appliedCount") or 0)
    if codemod_apply_preview_candidate_count != int(ensure_dict(codemod_apply_preview.get("summary")).get("focusCount") or 0):
        problems.append("migration-codemod-apply-preview-audit-count-drift")
    if codemod_apply_preview_pass_count != codemod_apply_preview_candidate_count:
        problems.append("migration-codemod-apply-preview-audit-pass-drift")
    if codemod_apply_preview_fail_count != 0:
        problems.append("migration-codemod-apply-preview-audit-failures")
    if codemod_apply_preview_applied_count != 0:
        problems.append("migration-codemod-apply-preview-applied-drift")
    manifest_codemod_apply_preview_latest_audit = ensure_dict(release_manifest_codemod_apply_preview.get("latestAudit"))
    if codemod_apply_preview_candidate_count and int(manifest_codemod_apply_preview_latest_audit.get("candidateCount") or 0) != codemod_apply_preview_candidate_count:
        problems.append("release-manifest-codemod-apply-preview-audit-summary-drift")
    if codemod_apply_preview_candidate_count and int(manifest_codemod_apply_preview_latest_audit.get("passCount") or 0) != codemod_apply_preview_pass_count:
        problems.append("release-manifest-codemod-apply-preview-audit-pass-drift")
    if codemod_apply_preview_candidate_count and int(manifest_codemod_apply_preview_latest_audit.get("failCount") or 0) != codemod_apply_preview_fail_count:
        problems.append("release-manifest-codemod-apply-preview-audit-fail-drift")
    codemod_prototype_count = int(codemod_prototypes_audit.get("prototypeCount") or 0)
    codemod_prototype_pass_count = int(codemod_prototypes_audit.get("passCount") or 0)
    codemod_prototype_fail_count = int(codemod_prototypes_audit.get("failCount") or 0)
    if codemod_prototype_count != int(codemod_prototype_summary.get("prototypeCount") or 0):
        problems.append("migration-codemod-prototype-audit-count-drift")
    if codemod_prototype_pass_count != codemod_prototype_count:
        problems.append("migration-codemod-prototype-audit-pass-drift")
    if codemod_prototype_fail_count != 0:
        problems.append("migration-codemod-prototype-audit-failures")
    manifest_codemod_prototype_latest_audit = ensure_dict(release_manifest_codemod_prototypes.get("latestAudit"))
    if codemod_prototype_count and int(manifest_codemod_prototype_latest_audit.get("prototypeCount") or 0) != codemod_prototype_count:
        problems.append("release-manifest-codemod-prototype-audit-summary-drift")
    if codemod_prototype_count and int(manifest_codemod_prototype_latest_audit.get("passCount") or 0) != codemod_prototype_pass_count:
        problems.append("release-manifest-codemod-prototype-audit-pass-drift")
    if codemod_prototype_count and int(manifest_codemod_prototype_latest_audit.get("failCount") or 0) != codemod_prototype_fail_count:
        problems.append("release-manifest-codemod-prototype-audit-fail-drift")

    i18n_manifest = ensure_dict(release_manifest.get("i18n"))
    i18n_coverage_manifest = ensure_dict(i18n_manifest.get("coverage"))
    i18n_pseudo_manifest = ensure_dict(i18n_manifest.get("pseudoSmoke"))
    i18n_surface_manifest = ensure_dict(i18n_manifest.get("surfaceGuard"))
    if not i18n_coverage_manifest:
        problems.append("release-manifest-missing-i18n-coverage")
    else:
        if str(i18n_coverage_manifest.get("artifactPath") or "") != i18n_coverage_artifact_path:
            problems.append("release-manifest-i18n-coverage-path-drift")
        if str(i18n_coverage_manifest.get("overallStatus") or "") != str(i18n_coverage_artifact.get("overall_status") or ""):
            problems.append("release-manifest-i18n-coverage-status-drift")
        if int(i18n_coverage_manifest.get("localeCount") or 0) != int(ensure_dict(i18n_coverage_artifact.get("summary")).get("localeCount") or 0):
            problems.append("release-manifest-i18n-coverage-locale-count-drift")
        if int(i18n_coverage_manifest.get("translatedLocaleCount") or 0) != int(
            ensure_dict(i18n_coverage_artifact.get("summary")).get("translatedLocaleCount") or 0
        ):
            problems.append("release-manifest-i18n-coverage-translated-locale-drift")
        if int(i18n_coverage_manifest.get("namespaceCount") or 0) != int(ensure_dict(i18n_coverage_artifact.get("summary")).get("namespaceCount") or 0):
            problems.append("release-manifest-i18n-coverage-namespace-count-drift")
        backlog_manifest = ensure_dict(i18n_coverage_manifest.get("backlog"))
        if len(ensure_list(backlog_manifest.get("topLocaleTranslationGaps"))) != len(
            ensure_list(ensure_dict(i18n_coverage_artifact.get("backlog")).get("topLocaleTranslationGaps"))
        ):
            problems.append("release-manifest-i18n-coverage-locale-backlog-drift")
        if len(ensure_list(backlog_manifest.get("topNamespaceTranslationGaps"))) != len(
            ensure_list(ensure_dict(i18n_coverage_artifact.get("backlog")).get("topNamespaceTranslationGaps"))
        ):
            problems.append("release-manifest-i18n-coverage-namespace-backlog-drift")
        if len(ensure_list(backlog_manifest.get("priorityTranslationBacklog"))) != len(
            ensure_list(ensure_dict(i18n_coverage_artifact.get("backlog")).get("priorityTranslationBacklog"))
        ):
            problems.append("release-manifest-i18n-coverage-priority-backlog-drift")
    if not i18n_pseudo_manifest:
        problems.append("release-manifest-missing-i18n-pseudo-smoke")
    else:
        if str(i18n_pseudo_manifest.get("artifactPath") or "") != i18n_pseudo_smoke_artifact_path:
            problems.append("release-manifest-i18n-pseudo-path-drift")
        if str(i18n_pseudo_manifest.get("overallStatus") or "") != str(i18n_pseudo_smoke_artifact.get("overall_status") or ""):
            problems.append("release-manifest-i18n-pseudo-status-drift")
        if int(i18n_pseudo_manifest.get("namespaceCount") or 0) != int(ensure_dict(i18n_pseudo_smoke_artifact.get("summary")).get("namespaceCount") or 0):
            problems.append("release-manifest-i18n-pseudo-namespace-count-drift")
        if int(i18n_pseudo_manifest.get("unchangedEligibleStringCount") or 0) != int(
            ensure_dict(i18n_pseudo_smoke_artifact.get("summary")).get("unchangedEligibleStringCount") or 0
        ):
            problems.append("release-manifest-i18n-pseudo-unchanged-drift")
    if not i18n_surface_manifest:
        problems.append("release-manifest-missing-i18n-surface")
    else:
        if str(i18n_surface_manifest.get("artifactPath") or "") != i18n_surface_artifact_path:
            problems.append("release-manifest-i18n-surface-path-drift")
        if str(i18n_surface_manifest.get("overallStatus") or "") != str(i18n_surface_artifact.get("overall_status") or ""):
            problems.append("release-manifest-i18n-surface-status-drift")
        surface_summary = ensure_dict(i18n_surface_artifact.get("summary"))
        if int(i18n_surface_manifest.get("blockingFindingCount") or 0) != int(surface_summary.get("blockingFindingCount") or 0):
            problems.append("release-manifest-i18n-surface-blocking-drift")
        if int(i18n_surface_manifest.get("reportOnlyFindingCount") or 0) != int(surface_summary.get("reportOnlyFindingCount") or 0):
            problems.append("release-manifest-i18n-surface-report-only-drift")

    if str(i18n_coverage_artifact.get("overall_status") or "") != "PASS":
        problems.append("i18n-coverage-artifact-failed")
    if str(i18n_pseudo_smoke_artifact.get("overall_status") or "") != "PASS":
        problems.append("i18n-pseudo-smoke-artifact-failed")
    if str(i18n_surface_artifact.get("overall_status") or "") != "PASS":
        problems.append("i18n-surface-artifact-failed")

    missing_doc_evidence = []
    for entry in ensure_list(latest_release.get("evidenceRefs")):
        ref = str(entry).strip()
        if not ref or "*" in ref or not ref.startswith("docs/"):
            continue
        if not path_in_repo(ref).is_file():
            missing_doc_evidence.append(ref)
    if missing_doc_evidence:
        problems.append("missing-doc-evidence:" + ",".join(sorted(missing_doc_evidence)))

    if problems:
        return fail(SCRIPT, problems)
    return ok(
        SCRIPT,
        "version=%s publicExports=%d apiCoverage=%d%% singleApp=%d crossApp=%d ownerMapped=%d"
        % (
            package_json.get("version"),
            public_exports,
            int(api_coverage.get("coveragePercent") or 0),
            int(migration_summary.get("singleAppBlastRadiusCount") or 0),
            int(migration_summary.get("crossAppReviewComponents") or 0),
            int(migration_summary.get("ownerMappedAppsCount") or 0),
        ),
    )


if __name__ == "__main__":
    raise SystemExit(main())
