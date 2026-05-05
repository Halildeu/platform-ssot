#!/usr/bin/env python3
"""Seed a feature-execution-contract under contract/features/ (or legacy
single-file location), with overwrite + path-traversal safety guards and
optional active_features.v1.json index append.

C-prime multi-file pattern (Codex 019df4ed iter-5):
- The legacy single-file contract (`feature_execution_contract.v1.json`) is
  preserved for backward-compat audit. New features land under
  `extensions/PRJ-PM-SUITE/contract/features/<id>.v1.json`.
- `--target-file` is mandatory and must match the allow-list regex below;
  arbitrary filesystem locations are rejected.
- Overwrite of an existing file with a different `feature_id` is refused
  (concurrent-PR protection).
- When `--update-active-index` is on (default), a new entry is appended
  to `active_features.v1.json` if it is not already present.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

# Allow-list regex for --target-file (relative paths only). Two shapes:
# - extensions/PRJ-PM-SUITE/contract/features/<id>.v1.json
# - extensions/PRJ-PM-SUITE/contract/feature_execution_contract.v1.json (legacy)
TARGET_FILE_ALLOW_RE = re.compile(
    r"^extensions/PRJ-PM-SUITE/contract/(features/[a-zA-Z0-9_-]+\.v1\.json|feature_execution_contract\.v1\.json)$"
)
DEFAULT_FEATURES_DIR = "extensions/PRJ-PM-SUITE/contract/features"
LEGACY_CONTRACT_PATH = "extensions/PRJ-PM-SUITE/contract/feature_execution_contract.v1.json"
ACTIVE_FEATURES_PATH = "extensions/PRJ-PM-SUITE/contract/active_features.v1.json"


def _load_json(path: Path) -> dict[str, Any]:
    obj = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(obj, dict):
        raise ValueError(f"invalid_json_root:{path}")
    return obj


def _normalize_rel(path: str) -> str:
    norm = str(path or "").strip().replace("\\", "/")
    while norm.startswith("./"):
        norm = norm[2:]
    return norm


def _parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", default=".")
    parser.add_argument("--feature-id", required=True)
    parser.add_argument("--title", required=True)
    parser.add_argument("--summary", required=True)
    parser.add_argument("--source-type", default="manual")
    parser.add_argument("--source-ref", action="append", default=[])
    parser.add_argument("--business-goal", required=True)
    parser.add_argument("--requested-outcome", required=True)
    parser.add_argument("--scope", action="append", default=[])
    parser.add_argument("--change-glob", action="append", default=[])
    parser.add_argument("--affected-module", action="append", default=[])
    parser.add_argument("--ux-mode", default="NOT_APPLICABLE")
    parser.add_argument("--ux-rationale", default="No frontend scoped change.")
    parser.add_argument(
        "--ux-artifact",
        action="append",
        default=[],
        help="Format: <path_glob>:<ux_theme_id>:<ux_subtheme_id>",
    )
    parser.add_argument("--db-migration-required", default="false")
    parser.add_argument("--acceptance", action="append", default=[])
    parser.add_argument("--evidence-path", action="append", default=[])
    parser.add_argument("--note", action="append", default=[])
    parser.add_argument("--status", default="DRAFT")
    parser.add_argument(
        "--target-file",
        required=True,
        help=(
            "Relative target path (must match "
            f"'{TARGET_FILE_ALLOW_RE.pattern}'). New features must land under "
            f"'{DEFAULT_FEATURES_DIR}/<id>.v1.json'."
        ),
    )
    parser.add_argument(
        "--allow-overwrite",
        action="store_true",
        help=(
            "Allow overwriting an existing target file even if its feature_id "
            "matches; if feature_id differs, the script always refuses to "
            "preserve the other PR's contract."
        ),
    )
    parser.add_argument(
        "--update-active-index",
        default="true",
        help="If true (default), add the feature to active_features.v1.json.",
    )
    parser.add_argument(
        "--active-status",
        default="ACTIVE",
        help="Status entry written into active_features.v1.json (default ACTIVE).",
    )
    return parser.parse_args(argv)


def _parse_bool(raw: str) -> bool:
    return str(raw or "").strip().lower() in {"1", "true", "yes", "on"}


def _validate_target_file(target_rel: str) -> str:
    norm = _normalize_rel(target_rel)
    if not norm:
        raise SystemExit("contract_seed failed: --target-file is empty")
    if ".." in norm.split("/"):
        raise SystemExit(f"contract_seed failed: --target-file contains traversal: {norm}")
    if not TARGET_FILE_ALLOW_RE.match(norm):
        raise SystemExit(
            "contract_seed failed: --target-file rejected by allow-list pattern "
            f"'{TARGET_FILE_ALLOW_RE.pattern}': got {norm!r}"
        )
    return norm


def _existing_feature_id(target_path: Path) -> str:
    if not target_path.exists():
        return ""
    try:
        existing = _load_json(target_path)
    except Exception:
        return ""
    return str(existing.get("feature_id") or "").strip()


def _refuse_overwrite_if_conflict(
    target_path: Path, target_rel: str, feature_id: str, allow_overwrite: bool
) -> None:
    """Refuse to overwrite a file whose feature_id differs from the new one."""
    if not target_path.exists():
        return
    existing_id = _existing_feature_id(target_path)
    if not existing_id:
        # Empty/invalid existing file: only allow if explicit overwrite flag.
        if not allow_overwrite:
            raise SystemExit(
                f"contract_seed failed: target {target_rel} exists but is empty/invalid; "
                f"use --allow-overwrite to replace"
            )
        return
    if existing_id != feature_id:
        raise SystemExit(
            "contract_seed failed: refusing to overwrite "
            f"{target_rel} (existing feature_id={existing_id!r}, "
            f"new feature_id={feature_id!r}). Pick a unique --target-file under "
            f"{DEFAULT_FEATURES_DIR}/."
        )
    if not allow_overwrite:
        raise SystemExit(
            f"contract_seed failed: target {target_rel} already exists with the same "
            f"feature_id={feature_id!r}; pass --allow-overwrite to confirm replace"
        )


def _update_active_features_index(
    repo_root: Path,
    *,
    feature_id: str,
    target_rel: str,
    active_status: str,
) -> tuple[str, dict[str, Any]]:
    index_path = repo_root / ACTIVE_FEATURES_PATH
    if index_path.exists():
        idx = _load_json(index_path)
    else:
        idx = {
            "version": "v1",
            "kind": "active-features-index",
            "active_features": [],
            "legacy_contract_path": LEGACY_CONTRACT_PATH,
            "notes": [],
        }
    active_list = idx.get("active_features")
    if not isinstance(active_list, list):
        active_list = []
        idx["active_features"] = active_list

    existing_entry: dict[str, Any] | None = None
    for item in active_list:
        if isinstance(item, dict) and str(item.get("feature_id") or "").strip() == feature_id:
            existing_entry = item
            break

    if existing_entry is None:
        active_list.append(
            {
                "feature_id": feature_id,
                "contract_path": target_rel,
                "status": active_status,
            }
        )
        action = "appended"
    else:
        existing_entry["contract_path"] = target_rel
        existing_entry["status"] = active_status
        action = "updated"

    index_path.parent.mkdir(parents=True, exist_ok=True)
    index_path.write_text(json.dumps(idx, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return action, idx


def main(argv: list[str] | None = None) -> int:
    args = _parse_args(argv)
    repo_root = Path(str(args.repo_root)).resolve()

    feature_id = str(args.feature_id).strip()
    if not feature_id:
        raise SystemExit("contract_seed failed: --feature-id is empty")

    target_rel = _validate_target_file(str(args.target_file))
    target_abs = (repo_root / target_rel).resolve()
    # Confine to repo_root: defence in depth against absolute paths or symlink traversal.
    try:
        target_abs.relative_to(repo_root)
    except ValueError as exc:
        raise SystemExit(
            f"contract_seed failed: --target-file resolves outside repo_root: {target_abs}"
        ) from exc

    _refuse_overwrite_if_conflict(target_abs, target_rel, feature_id, bool(args.allow_overwrite))

    template_path = repo_root / LEGACY_CONTRACT_PATH
    policy_path = repo_root / "policies/policy_feature_execution_bridge.v1.json"
    baseline_path = repo_root / "registry/technical_baseline.aistd.v1.json"

    template = _load_json(template_path)
    policy = _load_json(policy_path)
    baseline = _load_json(baseline_path)

    scope_globs_raw = (
        (policy.get("scope_detection") if isinstance(policy.get("scope_detection"), dict) else {}).get("scope_globs")
    )
    scope_globs = scope_globs_raw if isinstance(scope_globs_raw, dict) else {}

    selected_scopes = [str(item).strip() for item in args.scope if str(item).strip()]
    if not selected_scopes:
        selected_scopes = ["frontend"]
    change_globs = [str(item).strip() for item in args.change_glob if str(item).strip()]
    if not change_globs:
        for scope in selected_scopes:
            default_patterns = scope_globs.get(scope) if isinstance(scope_globs, dict) else None
            if isinstance(default_patterns, list) and default_patterns:
                change_globs.append(str(default_patterns[0]))
    if not change_globs:
        change_globs = ["web/**/*"]

    ux_artifacts: list[dict[str, str]] = []
    for raw in args.ux_artifact:
        text = str(raw).strip()
        if not text:
            continue
        try:
            path_glob, theme_id, subtheme_id = text.split(":", 2)
        except ValueError as exc:
            raise SystemExit(f"contract_seed failed: invalid --ux-artifact format: {text}") from exc
        ux_artifacts.append(
            {
                "path_glob": path_glob.strip(),
                "ux_theme_id": theme_id.strip(),
                "ux_subtheme_id": subtheme_id.strip(),
            }
        )

    ci_contract = baseline.get("ci_contract") if isinstance(baseline.get("ci_contract"), dict) else {}
    contract = template
    contract["status"] = str(args.status).strip() or "DRAFT"
    contract["feature_id"] = feature_id
    contract["title"] = str(args.title).strip()
    contract["summary"] = str(args.summary).strip()
    contract["source_context"] = {
        "source_type": str(args.source_type).strip() or "manual",
        "source_refs": [str(item).strip() for item in args.source_ref if str(item).strip()] or ["manual:unspecified"],
        "business_goal": str(args.business_goal).strip(),
        "requested_outcome": str(args.requested_outcome).strip(),
    }
    contract["delivery_scope"] = {
        "repo_root": ".",
        "service_scopes": selected_scopes,
        "change_path_globs": change_globs,
        "affected_modules": [str(item).strip() for item in args.affected_module if str(item).strip()],
    }
    contract["ux_contract"] = {
        "mode": str(args.ux_mode).strip() or "NOT_APPLICABLE",
        "rationale": str(args.ux_rationale).strip() or "No UX rationale provided.",
        "artifacts": ux_artifacts,
    }
    contract["technical_contract"] = {
        "baseline_profile_id": str(baseline.get("profile_id") or "").strip(),
        "api_version_prefix": (
            str(
                ((baseline.get("baseline") if isinstance(baseline.get("baseline"), dict) else {}).get("api") or {}).get(
                    "version_prefix"
                )
                or "/api/v1"
            ).strip()
        ),
        "design_system_policy": "policies/policy_ui_design_system.v1.json",
        "db_migration_required": _parse_bool(str(args.db_migration_required)),
    }
    contract["lane_plan"] = {
        "execution_sequence": [str(item) for item in (ci_contract.get("delivery_sequence") or []) if str(item).strip()],
        "required_lanes": [str(item) for item in (ci_contract.get("required_lanes") or []) if str(item).strip()],
        "notes": [
            "Generated by seed_feature_execution_contract.py"
        ],
    }
    contract["definition_of_done"] = {
        "acceptance_criteria": [str(item).strip() for item in args.acceptance if str(item).strip()] or [str(args.summary).strip()],
        "evidence_paths": [str(item).strip() for item in args.evidence_path if str(item).strip()]
        or [".cache/reports/feature_execution_contract_check.v1.json"],
    }
    contract["notes"] = [str(item).strip() for item in args.note if str(item).strip()]

    target_abs.parent.mkdir(parents=True, exist_ok=True)
    target_abs.write_text(json.dumps(contract, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")

    index_action = "skipped"
    if _parse_bool(str(args.update_active_index)):
        # Skip updating the index when seeding the legacy single-file contract;
        # active_features.v1.json indexes per-feature files only.
        if target_rel != LEGACY_CONTRACT_PATH:
            index_action, _ = _update_active_features_index(
                repo_root,
                feature_id=feature_id,
                target_rel=target_rel,
                active_status=str(args.active_status).strip() or "ACTIVE",
            )
        else:
            index_action = "skipped_legacy_target"

    print(
        json.dumps(
            {
                "status": "OK",
                "out": str(target_abs),
                "feature_id": contract["feature_id"],
                "service_scopes": contract["delivery_scope"]["service_scopes"],
                "active_features_index_action": index_action,
            },
            ensure_ascii=False,
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
