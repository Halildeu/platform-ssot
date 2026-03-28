#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
STANDARDS_LOCK = ROOT / "standards.lock"
TECHNICAL_BASELINE = ROOT / "registry" / "technical_baseline.aistd.v1.json"
PM_POLICY = ROOT / "policies" / "policy_pm_suite.v1.json"
WORKTREE_REGISTRY = ROOT / "registry" / "worktrees" / "worktree_registry.v1.json"


def _load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def _is_cache_path(value: str) -> bool:
    normalized = str(value or "").strip().replace("\\", "/")
    return normalized.startswith(".cache/") or "/.cache/" in normalized


def _check_exists(rel_path: str, errors: list[str]) -> None:
    rel = str(rel_path or "").strip()
    if not rel:
        errors.append("empty_path")
        return
    if not (ROOT / rel).exists():
        errors.append(f"missing:{rel}")


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []

    try:
        lock = _load_json(STANDARDS_LOCK)
    except Exception as exc:  # noqa: BLE001
        payload = {
            "status": "FAIL",
            "error_code": "STANDARDS_LOCK_INVALID",
            "message": str(exc),
        }
        print(json.dumps(payload, ensure_ascii=False, sort_keys=True))
        return 2

    operating_contract = str(lock.get("operating_contract") or "").strip()
    if _is_cache_path(operating_contract):
        errors.append(f"operating_contract_under_cache:{operating_contract}")

    standard_sources = lock.get("standard_sources") if isinstance(lock.get("standard_sources"), dict) else {}
    for key, value in standard_sources.items():
        path = str(value or "").strip()
        if _is_cache_path(path):
            errors.append(f"standard_source_under_cache:{key}:{path}")
        else:
            _check_exists(path, errors)

    required_files = lock.get("required_files") if isinstance(lock.get("required_files"), list) else []
    for value in required_files:
        path = str(value or "").strip()
        if not path:
            continue
        if _is_cache_path(path):
            errors.append(f"required_file_under_cache:{path}")
        else:
            _check_exists(path, errors)

    managed_sync = lock.get("managed_repo_sync") if isinstance(lock.get("managed_repo_sync"), dict) else {}
    for field in ("script", "source_of_truth"):
        path = str(managed_sync.get(field) or "").strip()
        if path and _is_cache_path(path):
            errors.append(f"managed_repo_sync_{field}_under_cache:{path}")
    preserve_paths = managed_sync.get("preserve_existing_paths") if isinstance(managed_sync.get("preserve_existing_paths"), list) else []
    for value in preserve_paths:
        path = str(value or "").strip()
        if path and _is_cache_path(path):
            errors.append(f"preserve_existing_path_under_cache:{path}")

    try:
        baseline = _load_json(TECHNICAL_BASELINE)
    except Exception as exc:  # noqa: BLE001
        errors.append(f"technical_baseline_invalid:{exc}")
        baseline = {}
    archive = baseline.get("archive") if isinstance(baseline, dict) and isinstance(baseline.get("archive"), dict) else {}
    legacy_manifest = str(archive.get("legacy_manifest_path") or "").strip()
    if legacy_manifest and _is_cache_path(legacy_manifest):
        errors.append(f"legacy_manifest_under_cache:{legacy_manifest}")

    try:
        pm_policy = _load_json(PM_POLICY)
    except Exception as exc:  # noqa: BLE001
        errors.append(f"pm_policy_invalid:{exc}")
        pm_policy = {}

    execution_bridge = pm_policy.get("execution_bridge") if isinstance(pm_policy, dict) and isinstance(pm_policy.get("execution_bridge"), dict) else {}
    for field in ("contract_path", "checker_path", "seed_script_path", "contract_schema_path"):
        path = str(execution_bridge.get(field) or "").strip()
        if path and _is_cache_path(path):
            errors.append(f"pm_execution_bridge_input_under_cache:{field}:{path}")

    delivery_session = pm_policy.get("delivery_session") if isinstance(pm_policy, dict) and isinstance(pm_policy.get("delivery_session"), dict) else {}
    for field in ("builder_path", "guard_path", "packet_schema_path"):
        path = str(delivery_session.get(field) or "").strip()
        if path and _is_cache_path(path):
            errors.append(f"pm_delivery_session_input_under_cache:{field}:{path}")

    if _is_cache_path("registry/worktrees/worktree_registry.v1.json"):
        errors.append("worktree_registry_path_rule_invalid")
    if not WORKTREE_REGISTRY.exists():
        warnings.append("worktree_registry_missing_bootstrap_required")

    payload = {
        "status": "FAIL" if errors else "OK",
        "repo_root": str(ROOT),
        "checked": {
            "standards_lock": str(STANDARDS_LOCK.relative_to(ROOT)),
            "technical_baseline": str(TECHNICAL_BASELINE.relative_to(ROOT)),
            "pm_policy": str(PM_POLICY.relative_to(ROOT)),
            "worktree_registry": str(WORKTREE_REGISTRY.relative_to(ROOT)),
        },
        "errors": errors,
        "warnings": warnings,
        "rule_summary": {
            "cache_is_deletable": True,
            "canonical_inputs_must_not_live_under_cache": True,
            "derived_reports_may_live_under_cache_reports": True,
        },
    }
    print(json.dumps(payload, ensure_ascii=False, sort_keys=True))
    return 0 if not errors else 2


if __name__ == "__main__":
    raise SystemExit(main())
