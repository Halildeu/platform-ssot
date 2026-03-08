#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
RUNBOOK_PATH = ROOT / "docs" / "04-operations" / "RUNBOOKS" / "RB-insansiz-flow.md"

WORKFLOWS: dict[str, Path] = {
    "deploy_backend": ROOT / ".github" / "workflows" / "deploy-backend.yml",
    "deploy_web": ROOT / ".github" / "workflows" / "deploy-web.yml",
    "post_deploy_validate": ROOT / ".github" / "workflows" / "post-deploy-validate.yml",
    "rollback": ROOT / ".github" / "workflows" / "rollback.yml",
}


def _read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def _require_patterns(path: Path, patterns: list[str]) -> dict[str, Any]:
    text = _read_text(path)
    missing = [pattern for pattern in patterns if pattern not in text]
    return {
        "path": path.relative_to(ROOT).as_posix(),
        "missing_patterns": missing,
        "status": "OK" if not missing else "FAIL",
    }


def _build_report() -> dict[str, Any]:
    if not RUNBOOK_PATH.exists():
        raise RuntimeError(f"missing_file:{RUNBOOK_PATH.relative_to(ROOT).as_posix()}")
    for wf in WORKFLOWS.values():
        if not wf.exists():
            raise RuntimeError(f"missing_file:{wf.relative_to(ROOT).as_posix()}")

    workflow_checks = {
        "deploy_backend": _require_patterns(
            WORKFLOWS["deploy_backend"],
            [
                "DEPLOY_ENABLED",
                "scripts/ops/deploy_scope_gate.py",
                "--target backend",
                "AUTONOMOUS_PIPELINE_SIGNING_PUBLIC_KEY_PEM",
            ],
        ),
        "deploy_web": _require_patterns(
            WORKFLOWS["deploy_web"],
            [
                "DEPLOY_ENABLED",
                "scripts/ops/deploy_scope_gate.py",
                "--target web",
                "WEB_DEPLOY_HOOK_URL",
                "AUTONOMOUS_PIPELINE_SIGNING_PUBLIC_KEY_PEM",
            ],
        ),
        "post_deploy_validate": _require_patterns(
            WORKFLOWS["post_deploy_validate"],
            [
                "deploy-web",
                "deploy-backend",
                "WEB_SMOKE_URL",
                "BACKEND_HEALTH_URLS",
                "Validation failed",
            ],
        ),
        "rollback": _require_patterns(
            WORKFLOWS["rollback"],
            [
                "post-deploy-validate",
                "ROLLBACK_ENABLED",
                "WEB_ROLLBACK_HOOK_URL",
                "BACKEND_ROLLBACK_HOOK_URL",
                "incident:v1",
            ],
        ),
    }

    runbook_check = _require_patterns(
        RUNBOOK_PATH,
        [
            "deploy-web",
            "deploy-backend",
            "post-deploy-validate",
            "rollback",
            "DEPLOY_ENABLED",
            "ROLLBACK_ENABLED",
            "WEB_DEPLOY_HOOK_URL",
            "WEB_SMOKE_URL",
            "BACKEND_HEALTH_URLS",
            "WEB_ROLLBACK_HOOK_URL",
            "BACKEND_ROLLBACK_HOOK_URL",
        ],
    )

    failed_sections = [
        name for name, check in workflow_checks.items() if check["status"] != "OK"
    ]
    if runbook_check["status"] != "OK":
        failed_sections.append("runbook")

    return {
        "kind": "live-release-provisioning-contract-check",
        "version": "v1",
        "repo_root": str(ROOT),
        "runbook": runbook_check,
        "workflows": workflow_checks,
        "status": "OK" if not failed_sections else "FAIL",
        "failed_sections": failed_sections,
    }


def _parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = _parse_args(argv)
    report = _build_report()
    if args.out:
        out_path = Path(args.out).resolve()
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, sort_keys=True))
    return 0 if report["status"] == "OK" else 2


if __name__ == "__main__":
    raise SystemExit(main())
