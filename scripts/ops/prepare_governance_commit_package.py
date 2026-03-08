#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_PLAN_PATH = ROOT / ".cache" / "reports" / "managed_repo_governance_commit_packages.v1.json"
DEFAULT_OUT_PATH = ROOT / ".cache" / "reports" / "managed_repo_governance_commit_packages_status.v1.json"

COMMIT_MESSAGES = {
    "gov-core-lanes": "chore(governance): align core lane contract",
    "gov-release-chain": "chore(governance): align release chain guardrails",
    "gov-pr-bots": "chore(governance): align pr and robot automation",
    "gov-doc-repair-policies": "chore(governance): align doc repair policies",
    "gov-standards-archive": "chore(governance): align standards archive tooling",
    "gov-ops-quality": "chore(governance): align ops quality tooling",
}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def run_git(args: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", "-C", str(ROOT), *args],
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )


def parse_porcelain(paths: list[str]) -> dict[str, str]:
    if not paths:
        return {}
    proc = run_git(["status", "--porcelain", "--", *paths])
    statuses: dict[str, str] = {}
    for line in proc.stdout.splitlines():
        if not line:
            continue
        status = line[:2]
        path = line[3:]
        if " -> " in path:
            path = path.split(" -> ", 1)[1]
        statuses[path] = status
    return statuses


def classify_status(code: str, exists: bool) -> str:
    stripped = code.strip()
    if not code:
        return "clean" if exists else "missing"
    if stripped == "??":
        return "untracked"
    if "D" in code:
        return "deleted"
    if "R" in code:
        return "renamed"
    if "A" in code:
        return "added"
    if "M" in code:
        return "modified"
    return "other"


def package_status(pkg: dict[str, Any]) -> dict[str, Any]:
    paths = [str(path) for path in pkg.get("paths", [])]
    statuses = parse_porcelain(paths)
    path_rows: list[dict[str, Any]] = []
    summary = {
        "total_paths": len(paths),
        "dirty_paths": 0,
        "clean_paths": 0,
        "missing_paths": 0,
        "modified": 0,
        "untracked": 0,
        "deleted": 0,
        "added": 0,
        "renamed": 0,
        "other": 0,
    }
    for path in paths:
        abs_path = ROOT / path
        exists = abs_path.exists()
        git_status = statuses.get(path, "")
        classification = classify_status(git_status, exists)
        row = {
            "path": path,
            "exists": exists,
            "git_status": git_status or "  ",
            "classification": classification,
        }
        path_rows.append(row)
        if classification == "clean":
            summary["clean_paths"] += 1
        elif classification == "missing":
            summary["missing_paths"] += 1
        else:
            summary["dirty_paths"] += 1
            summary[classification] = summary.get(classification, 0) + 1

    ready = summary["dirty_paths"] == summary["total_paths"] and summary["missing_paths"] == 0
    return {
        "package_id": pkg["package_id"],
        "title": pkg["title"],
        "rationale": pkg.get("rationale", ""),
        "recommended_commit_message": COMMIT_MESSAGES.get(
            pkg["package_id"], f"chore(governance): align {pkg['package_id']}"
        ),
        "ready_for_isolated_commit": ready,
        "summary": summary,
        "paths": path_rows,
    }


def stage_package(paths: list[str]) -> None:
    if not paths:
        return
    run_git(["add", "--", *paths])


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--plan", default=str(DEFAULT_PLAN_PATH))
    parser.add_argument("--out", default=str(DEFAULT_OUT_PATH))
    parser.add_argument("--package-id", action="append", default=[])
    parser.add_argument("--stage", action="store_true")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    plan_path = Path(args.plan).resolve()
    out_path = Path(args.out).resolve()
    plan = load_json(plan_path)
    packages = plan.get("packages") or []
    selected_ids = {pkg_id.strip() for pkg_id in args.package_id if pkg_id.strip()}
    if selected_ids:
        packages = [pkg for pkg in packages if pkg.get("package_id") in selected_ids]

    package_reports = [package_status(pkg) for pkg in packages]
    if args.stage:
        for pkg in package_reports:
            stage_package([row["path"] for row in pkg["paths"]])

    overall = {
        "package_count": len(package_reports),
        "ready_for_isolated_commit_count": sum(
            1 for pkg in package_reports if pkg["ready_for_isolated_commit"]
        ),
        "total_paths": sum(pkg["summary"]["total_paths"] for pkg in package_reports),
        "total_dirty_paths": sum(pkg["summary"]["dirty_paths"] for pkg in package_reports),
    }
    report = {
        "kind": "managed-repo-governance-commit-package-status",
        "version": "v1",
        "generated_at": now_iso(),
        "repo_root": str(ROOT),
        "source_plan": plan_path.relative_to(ROOT).as_posix(),
        "staged": bool(args.stage),
        "summary": overall,
        "packages": package_reports,
    }
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
