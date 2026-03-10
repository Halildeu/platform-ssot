#!/usr/bin/env python3
from __future__ import annotations

from ui_library_checks import (
    ensure_dict,
    ensure_exists,
    ensure_list,
    fail,
    load_json,
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

    contract = load_json(required[0])
    release_manifest_path = str(contract.get("release_manifest_path") or "").strip()
    package_json = load_json(required[1])
    index = load_json(required[2])
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
    release_manifest_migration = ensure_dict(release_manifest.get("migration"))
    release_manifest_upgrade_recipes = ensure_dict(release_manifest_migration.get("upgradeRecipes"))
    release_manifest_codemod_candidates = ensure_dict(release_manifest_migration.get("codemodCandidates"))
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
    upgrade_checklist_artifact_path = str(contract.get("upgrade_checklist_artifact_path") or "").strip()
    upgrade_recipes_artifact_path = str(contract.get("upgrade_recipes_artifact_path") or "").strip()
    upgrade_recipes_audit_artifact_path = str(contract.get("upgrade_recipes_audit_artifact_path") or "").strip()
    codemod_candidates_artifact_path = str(contract.get("codemod_candidates_artifact_path") or "").strip()
    codemod_candidates_audit_artifact_path = str(contract.get("codemod_candidates_audit_artifact_path") or "").strip()
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
    if not consumer_upgrade_contract_path or not path_in_repo(consumer_upgrade_contract_path).is_file():
        problems.append("missing-consumer-upgrade-contract")
    if not consumer_owner_registry_path or not path_in_repo(consumer_owner_registry_path).is_file():
        problems.append("missing-consumer-owner-registry")
    if not consumer_upgrade_recipes_contract_path or not path_in_repo(consumer_upgrade_recipes_contract_path).is_file():
        problems.append("missing-consumer-upgrade-recipes-contract")
    if not consumer_codemod_candidates_contract_path or not path_in_repo(consumer_codemod_candidates_contract_path).is_file():
        problems.append("missing-consumer-codemod-candidates-contract")
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
    if int(ensure_dict(upgrade_recipes.get("summary")).get("singleAppRecipes") or 0) != int(migration_summary.get("singleAppBlastRadiusCount") or 0):
        problems.append("migration-upgrade-recipes-single-app-drift")
    codemod_summary = ensure_dict(codemod_candidates.get("summary"))
    codemod_artifact_payload = ensure_dict(codemod_candidates_artifact.get("codemodCandidates"))
    codemod_artifact_summary = ensure_dict(codemod_artifact_payload.get("summary"))
    codemod_items = ensure_list(codemod_candidates.get("items"))
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
    if int(codemod_summary.get("dryRunReadyCandidates") or 0) != int(codemod_summary.get("totalCandidates") or 0):
        problems.append("migration-codemod-dry-run-drift")
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
    if not release_manifest_upgrade_recipes:
        problems.append("release-manifest-missing-upgrade-recipes")
    elif str(release_manifest_upgrade_recipes.get("contractPath") or "") != consumer_upgrade_recipes_contract_path:
        problems.append("release-manifest-upgrade-recipes-contract-drift")
    if not release_manifest_codemod_candidates:
        problems.append("release-manifest-missing-codemod-candidates")
    elif str(release_manifest_codemod_candidates.get("contractPath") or "") != consumer_codemod_candidates_contract_path:
        problems.append("release-manifest-codemod-candidates-contract-drift")
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
