#!/usr/bin/env python3
"""Prepare docs, legacy, and governance mirror commit packages."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path


REPO_ROOT = Path("/Users/halilkocoglu/Documents/dev")
DEFAULT_OUT = REPO_ROOT / ".cache/reports/managed_repo_docs_legacy_commit_packages_status.v1.json"


@dataclass(frozen=True)
class PackageDefinition:
    package_id: str
    title: str
    rationale: str
    recommended_commit_message: str
    paths: tuple[str, ...]


PACKAGE_DEFINITIONS: tuple[PackageDefinition, ...] = (
    PackageDefinition(
        package_id="docs-managed-repo-governance",
        title="Managed Repo Governance Docs",
        rationale="El kitabi, operasyon runbooklari ve managed repo onboarding belgeleri ayni governance docs paketi olarak ilerlemeli.",
        recommended_commit_message="docs(governance): align managed repo runbooks and handbooks",
        paths=(
            "docs-ssot/04-operations/ROBOTS-REGISTRY.v0.1.json",
            "docs/00-handbook/",
            "docs/04-operations/RUNBOOKS/",
            "docs/OPERATIONS/",
        ),
    ),
    PackageDefinition(
        package_id="docs-architecture-runtime",
        title="Architecture Runtime Docs",
        rationale="Mimari overview, context, runtime ve servis belgeleri ayni aktif dokumantasyon paketi olarak kalmali.",
        recommended_commit_message="docs(architecture): align runtime and service topology",
        paths=(
            "docs/02-architecture/DOMAIN-MAP.md",
            "docs/02-architecture/INDEX.md",
            "docs/02-architecture/README.md",
            "docs/02-architecture/SYSTEM-OVERVIEW.md",
            "docs/02-architecture/context/",
            "docs/02-architecture/runtime/",
            "docs/02-architecture/services/INDEX.md",
            "docs/02-architecture/services/api-gateway/",
            "docs/02-architecture/services/auth-service/",
            "docs/02-architecture/services/core-data-service/",
            "docs/02-architecture/services/discovery-server/",
            "docs/02-architecture/services/service-doc-status.v1.json",
            "docs/02-architecture/services/variant-service/",
            "docs/02-architecture/services/backend-docs/ADR/ADR-0003-service-to-service-http-client-standardization.md",
            "docs/02-architecture/services/backend-docs/ADR/ADR-0004-shared-postgres-schema-ownership-and-cutover.md",
        ),
    ),
    PackageDefinition(
        package_id="docs-delivery-governance",
        title="Delivery And Policy Source Docs",
        rationale="Delivery spec ve feature API belgeleri aktif governance ve feature zincirinin policy source tarafidir.",
        recommended_commit_message="docs(delivery): align specs and feature api references",
        paths=(
            "docs/02-architecture/services/backend-docs/ADR/ADR-0002-doc-repair-loop-v0-1.md",
            "docs/03-delivery/SPECS/",
            "docs/03-delivery/api/",
        ),
    ),
    PackageDefinition(
        package_id="docs-archive-legacy-ux",
        title="Legacy UX Archive",
        rationale="Eski UX ve archive belgeleri aktif akistan ayrilarak archive-only bolgede tutulmali.",
        recommended_commit_message="docs(archive): add legacy ux and archive materials",
        paths=(
            "docs/01-product/UX/",
            "docs/ARCHIVE/",
        ),
    ),
    PackageDefinition(
        package_id="legacy-pipeline-retire",
        title="Legacy Pipeline Retirement",
        rationale="Autonomous pipeline v2 artik aktif execution dependency degil; silme paketi tek legacy retire commitinde tutulmali.",
        recommended_commit_message="chore(legacy): retire autonomous pipeline v2",
        paths=(
            "autonomous-pipeline-v2/",
        ),
    ),
    PackageDefinition(
        package_id="governance-ssot-mirror",
        title="Governance SSOT Mirror",
        rationale="Managed repo icindeki governance mirror yuzeyi tek paket halinde aktif tutulmali.",
        recommended_commit_message="chore(governance): add managed repo ssot mirror",
        paths=(
            "extensions/",
            "policies/",
            "registry/",
            "schemas/",
            "tenant/",
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
        "kind": "managed-repo-docs-legacy-commit-package-status",
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
