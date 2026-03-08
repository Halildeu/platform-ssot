#!/usr/bin/env python3
"""Prepare active feature commit packages from the local managed repo state."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path


REPO_ROOT = Path("/Users/halilkocoglu/Documents/dev")
DEFAULT_OUT = REPO_ROOT / ".cache/reports/managed_repo_active_feature_commit_packages_status.v1.json"


@dataclass(frozen=True)
class PackageDefinition:
    package_id: str
    title: str
    rationale: str
    recommended_commit_message: str
    paths: tuple[str, ...]


PACKAGE_DEFINITIONS: tuple[PackageDefinition, ...] = (
    PackageDefinition(
        package_id="feat-backend-build-baseline",
        title="Backend Build Baseline",
        rationale="Kok build zinciri ve servis pom/mvnw dosyalari tek baseline paketi olarak ilerlemeli.",
        recommended_commit_message="chore(backend): align managed repo build baseline",
        paths=(
            "backend/.env.example",
            "backend/mvnw",
            "backend/pom.xml",
            "backend/api-gateway/pom.xml",
            "backend/auth-service/mvnw",
            "backend/auth-service/pom.xml",
            "backend/common-auth/pom.xml",
            "backend/core-data-service/pom.xml",
            "backend/discovery-server/pom.xml",
            "backend/permission-service/mvnw",
            "backend/permission-service/pom.xml",
            "backend/user-service/pom.xml",
            "backend/variant-service/pom.xml",
        ),
    ),
    PackageDefinition(
        package_id="feat-backend-service-contracts",
        title="Backend Service Contracts And Schema Ownership",
        rationale="Servis ici authz/http-client/schema-owned degisiklikleri ayni uygulama paketinde tutulmali.",
        recommended_commit_message="feat(backend): add service contract and schema ownership scaffolding",
        paths=(
            "backend/auth-service/src/main/java/com/example/auth/config/PasswordEncoderConfig.java",
            "backend/auth-service/src/main/java/com/example/auth/config/WebClientConfig.java",
            "backend/auth-service/src/main/java/com/example/auth/permission/PermissionServiceClient.java",
            "backend/auth-service/src/main/java/com/example/auth/security/CustomUserDetailsService.java",
            "backend/auth-service/src/main/java/com/example/auth/security/SecurityConfigKeycloak.java",
            "backend/auth-service/src/main/java/com/example/auth/serviceauth/ServiceJwtConfiguration.java",
            "backend/auth-service/src/main/java/com/example/auth/user/UserServiceClient.java",
            "backend/auth-service/src/main/resources/application.properties",
            "backend/auth-service/src/main/resources/db/migration_schema_owned/",
            "backend/permission-service/src/main/java/com/example/permission/config/DefaultAdminRoleAssignmentInitializer.java",
            "backend/permission-service/src/main/java/com/example/permission/config/PermissionDataInitializer.java",
            "backend/permission-service/src/main/java/com/example/permission/model/PermissionAuditEvent.java",
            "backend/permission-service/src/main/resources/application-docker.properties",
            "backend/permission-service/src/main/resources/application-local.properties",
            "backend/permission-service/src/main/resources/application.properties",
            "backend/permission-service/src/main/resources/db/migration_schema_owned/",
            "backend/permission-service/src/test/java/com/example/permission/config/",
            "backend/user-service/src/main/java/com/example/user/authz/AuthorizationContextService.java",
            "backend/user-service/src/main/java/com/example/user/config/RestTemplateConfig.java",
            "backend/user-service/src/main/java/com/example/user/config/WebClientConfig.java",
            "backend/user-service/src/main/java/com/example/user/permission/PermissionServiceClient.java",
            "backend/user-service/src/main/java/com/example/user/serviceauth/ServiceJwtConfiguration.java",
            "backend/user-service/src/main/java/com/example/user/serviceauth/ServiceTokenProvider.java",
            "backend/user-service/src/main/resources/application.properties",
            "backend/user-service/src/main/resources/db/migration_schema_owned/",
            "backend/variant-service/src/main/java/com/example/variant/theme/service/ThemePaletteSeeder.java",
            "backend/variant-service/src/main/resources/application.properties",
            "backend/variant-service/src/main/resources/db/migration_schema_owned/",
        ),
    ),
    PackageDefinition(
        package_id="feat-backend-runtime-cutover",
        title="Backend Runtime Cutover And Guardrails",
        rationale="Runtime guardrail, cutover scriptleri ve compose/devops zinciri tek operasyon paketi olmali.",
        recommended_commit_message="feat(backend): add runtime cutover and guardrail tooling",
        paths=(
            "backend/README.md",
            "backend/core-data-service/Dockerfile",
            "backend/core-data-service/src/main/resources/application.yml",
            "backend/core-data-service/src/main/resources/db/migration_schema_owned/",
            "backend/core-data-service/src/test/resources/application.yml",
            "backend/devops/postgres/",
            "backend/devops/rehearsal/",
            "backend/docker-compose.yml",
            "backend/scripts/ci/security/dependency-check-suppressions.xml",
            "backend/scripts/ci/security/generate-sbom-and-sign.sh",
            "backend/scripts/ci/security/run-dependency-scan.sh",
            "backend/scripts/health/",
            "backend/scripts/java-runtime.sh",
            "backend/scripts/ops/",
            "backend/scripts/run-compose-stack.sh",
            "backend/scripts/run-services.sh",
            "backend/scripts/stop-services.sh",
        ),
    ),
    PackageDefinition(
        package_id="feat-ui-kit-wave-components",
        title="UI Kit Wave Components",
        rationale="Wave 10-11 componentleri, testleri ve katalog kaydi ayni UI kit paketinde toplanmali.",
        recommended_commit_message="feat(ui-kit): add design-lab recipe components",
        paths=(
            "web/packages/ui-kit/package.json",
            "web/packages/ui-kit/src/catalog/",
            "web/packages/ui-kit/src/components/AIGuidedAuthoring.tsx",
            "web/packages/ui-kit/src/components/AIGuidedAuthoring.test.tsx",
            "web/packages/ui-kit/src/components/ApprovalReview.tsx",
            "web/packages/ui-kit/src/components/ApprovalReview.test.tsx",
            "web/packages/ui-kit/src/components/DetailSummary.tsx",
            "web/packages/ui-kit/src/components/DetailSummary.test.tsx",
            "web/packages/ui-kit/src/components/EmptyErrorLoading.tsx",
            "web/packages/ui-kit/src/components/EmptyErrorLoading.test.tsx",
            "web/packages/ui-kit/src/components/SearchFilterListing.tsx",
            "web/packages/ui-kit/src/components/SearchFilterListing.test.tsx",
            "web/packages/ui-kit/src/components/ThemePresetCompare.tsx",
            "web/packages/ui-kit/src/components/ThemePresetCompare.test.tsx",
            "web/packages/ui-kit/src/components/ThemePresetGallery.tsx",
            "web/packages/ui-kit/src/components/ThemePresetGallery.test.tsx",
            "web/packages/ui-kit/src/index.ts",
        ),
    ),
    PackageDefinition(
        package_id="feat-web-runtime-tooling",
        title="Web Runtime Tooling",
        rationale="Frontend package manager, webpack ve health/ops scriptleri shell entegrasyonundan once tek tooling paketi olarak ayrilmali.",
        recommended_commit_message="chore(web): align managed repo frontend runtime tooling",
        paths=(
            "web/.stylelintrc.cjs",
            "web/apps/mfe-audit/package.json",
            "web/apps/mfe-reporting/package.json",
            "web/apps/mfe-reporting/webpack.dev.js",
            "web/apps/mfe-reporting/webpack.prod.js",
            "web/apps/mfe-shell/package.json",
            "web/apps/mfe-shell/webpack.dev.js",
            "web/apps/mfe-shell/webpack.prod.js",
            "web/apps/mfe-suggestions/package.json",
            "web/apps/mfe-users/package.json",
            "web/apps/mfe-users/webpack.dev.js",
            "web/apps/mfe-users/webpack.prod.js",
            "web/eslint.config.mjs",
            "web/package-lock.json",
            "web/package.json",
            "web/packages/shared-http/package.json",
            "web/pnpm-lock.yaml",
            "web/scripts/health/",
            "web/scripts/ops/",
            "web/security/sri-manifest.json",
        ),
    ),
    PackageDefinition(
        package_id="feat-web-design-lab",
        title="Design Lab Shell Integration",
        rationale="Design lab sayfasi, shell testleri ve workspace jsonlari tek urun teslim paketi olmali.",
        recommended_commit_message="feat(web): add design lab workspace mode",
        paths=(
            "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
            "web/apps/mfe-shell/src/pages/admin/design-lab.groups.json",
            "web/apps/mfe-shell/src/pages/admin/design-lab.index.json",
            "web/apps/mfe-shell/src/pages/admin/design-lab.taxonomy.v1.json",
            "web/apps/mfe-shell/src/pages/login/LoginPage.ui.test.tsx",
            "web/apps/mfe-shell/src/widgets/app-shell/ui/ProtectedRoute.ui.test.tsx",
            "web/tests/playwright/pw_scenarios.yml",
        ),
    ),
)


def run_git(*args: str) -> str:
    result = subprocess.run(
        ["git", *args],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        check=True,
    )
    return result.stdout


def path_matches(path: str, selector: str) -> bool:
    return path == selector or path.startswith(selector)


def read_status_map() -> dict[str, str]:
    status_map: dict[str, str] = {}
    porcelain = run_git("status", "--short")
    for raw_line in porcelain.splitlines():
        if not raw_line:
            continue
        status = raw_line[:2]
        path = raw_line[3:]
        if " -> " in path:
            path = path.split(" -> ", 1)[1]
        status_map[path] = status
    return status_map


def classify_status(code: str, path: str) -> str:
    if not code:
        return "clean" if (REPO_ROOT / path).exists() else "missing"
    code = code.strip()
    if code == "??":
        return "untracked"
    if "R" in code:
        return "renamed"
    if "D" in code:
        return "deleted"
    if "A" in code:
        return "added"
    if "M" in code:
        return "modified"
    return "other"


def build_package_status(package: PackageDefinition, status_map: dict[str, str]) -> dict[str, object]:
    entries = []
    summary = {
        "total_paths": 0,
        "dirty_paths": 0,
        "clean_paths": 0,
        "modified": 0,
        "untracked": 0,
        "deleted": 0,
        "added": 0,
        "renamed": 0,
        "other": 0,
        "missing_paths": 0,
    }

    for selector in package.paths:
        matched = False
        for path in sorted(status_map):
            if not path_matches(path, selector):
                continue
            matched = True
            git_status = status_map[path]
            classification = classify_status(git_status, path)
            exists = (REPO_ROOT / path).exists()
            summary["total_paths"] += 1
            if classification == "clean":
                summary["clean_paths"] += 1
            else:
                summary["dirty_paths"] += 1
            if classification == "modified":
                summary["modified"] += 1
            elif classification == "untracked":
                summary["untracked"] += 1
            elif classification == "deleted":
                summary["deleted"] += 1
            elif classification == "added":
                summary["added"] += 1
            elif classification == "renamed":
                summary["renamed"] += 1
            elif classification == "other":
                summary["other"] += 1
            if not exists:
                summary["missing_paths"] += 1
            entries.append(
                {
                    "path": path,
                    "git_status": git_status,
                    "classification": classification,
                    "exists": exists,
                }
            )
        if not matched:
            exists = (REPO_ROOT / selector).exists()
            summary["total_paths"] += 1
            summary["missing_paths"] += 1
            summary["dirty_paths"] += 1
            entries.append(
                {
                    "path": selector,
                    "git_status": "",
                    "classification": "missing",
                    "exists": exists,
                }
            )
    ready = summary["dirty_paths"] == summary["total_paths"]
    return {
        "package_id": package.package_id,
        "title": package.title,
        "rationale": package.rationale,
        "recommended_commit_message": package.recommended_commit_message,
        "ready_for_isolated_commit": ready,
        "summary": summary,
        "paths": entries,
    }


def stage_package(package_status: dict[str, object]) -> None:
    stage_paths = [entry["path"] for entry in package_status["paths"] if entry["classification"] != "missing"]
    if not stage_paths:
        return
    subprocess.run(["git", "add", "--", *stage_paths], cwd=REPO_ROOT, check=True)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--package-id")
    parser.add_argument("--out", default=str(DEFAULT_OUT))
    parser.add_argument("--stage", action="store_true")
    args = parser.parse_args()

    selected = [
        package
        for package in PACKAGE_DEFINITIONS
        if args.package_id is None or package.package_id == args.package_id
    ]
    if args.package_id and not selected:
        raise SystemExit(f"unknown package id: {args.package_id}")

    status_map = read_status_map()
    package_statuses = [build_package_status(package, status_map) for package in selected]

    if args.stage:
        for package_status in package_statuses:
            stage_package(package_status)

    report = {
        "version": "v1",
        "kind": "managed-repo-active-feature-commit-package-status",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "repo_root": str(REPO_ROOT),
        "staged": args.stage,
        "packages": package_statuses,
        "summary": {
            "package_count": len(package_statuses),
            "ready_for_isolated_commit_count": sum(
                1 for package in package_statuses if package["ready_for_isolated_commit"]
            ),
            "total_paths": sum(package["summary"]["total_paths"] for package in package_statuses),
            "total_dirty_paths": sum(package["summary"]["dirty_paths"] for package in package_statuses),
        },
    }

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    json.dump(report, sys.stdout, indent=2, ensure_ascii=False)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
