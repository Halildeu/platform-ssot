#!/usr/bin/env python3
from __future__ import annotations

import argparse
import fnmatch
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

# Allow `python check_feature_execution_contract.py ...` to import the shared
# resolver without forcing callers to set PYTHONPATH. The shared module lives
# right next to this script.
sys.path.insert(0, str(Path(__file__).resolve().parent))

from contract_resolution import (  # noqa: E402  (intentional sys.path tweak above)
    GovernanceError,
    resolve_active_contracts,
)

DEFAULT_POLICY_PATH = "policies/policy_feature_execution_bridge.v1.json"
DEFAULT_OUT_PATH = ".cache/reports/feature_execution_contract_check.v1.json"


def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _load_json(path: Path) -> dict[str, Any]:
    obj = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(obj, dict):
        raise ValueError(f"invalid_json_root:{path}")
    return obj


def _match_any(path: str, patterns: list[str]) -> bool:
    for pattern in patterns:
        if fnmatch.fnmatch(path, pattern):
            return True
    return False


def _normalize_rel(path: str) -> str:
    norm = str(path or "").strip().replace("\\", "/")
    while norm.startswith("./"):
        norm = norm[2:]
    return norm


def _git_changed_files(repo_root: Path, base: str, head: str) -> list[str]:
    proc = subprocess.run(
        [
            "git",
            "-C",
            str(repo_root),
            "diff",
            "--name-only",
            "--diff-filter=ACMRTUXB",
            base,
            head,
        ],
        text=True,
        capture_output=True,
        check=False,
    )
    if proc.returncode != 0:
        raise RuntimeError((proc.stderr or proc.stdout or "git_diff_failed").strip())
    return sorted(
        {
            _normalize_rel(line)
            for line in (proc.stdout or "").splitlines()
            if _normalize_rel(line)
        }
    )


def _default_diff_refs(repo_root: Path) -> tuple[str, str]:
    try:
        left = subprocess.run(
            ["git", "-C", str(repo_root), "rev-parse", "HEAD^1"],
            text=True,
            capture_output=True,
            check=False,
        )
        right = subprocess.run(
            ["git", "-C", str(repo_root), "rev-parse", "HEAD^2"],
            text=True,
            capture_output=True,
            check=False,
        )
        if left.returncode == 0 and right.returncode == 0:
            base_parent = left.stdout.strip()
            pr_head_parent = right.stdout.strip()
            merge_base = subprocess.run(
                ["git", "-C", str(repo_root), "merge-base", base_parent, pr_head_parent],
                text=True,
                capture_output=True,
                check=False,
            )
            if merge_base.returncode == 0 and merge_base.stdout.strip():
                return merge_base.stdout.strip(), pr_head_parent
    except Exception:
        pass
    return "HEAD~1", "HEAD"


def _contains_placeholder(value: Any, tokens: list[str]) -> bool:
    text = str(value or "").strip().upper()
    if not text:
        return True
    for token in tokens:
        needle = str(token or "").strip().upper()
        if needle and needle in text:
            return True
    return False


def _parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", default=".")
    parser.add_argument("--policy-path", default=DEFAULT_POLICY_PATH)
    parser.add_argument("--base", default="")
    parser.add_argument("--head", default="")
    parser.add_argument("--changed-files", default="", help="Comma separated file list.")
    parser.add_argument("--out", default=DEFAULT_OUT_PATH)
    parser.add_argument(
        "--env",
        default=None,
        help=(
            "Lane environment override (pre-prod | prod). "
            "ADR-0014 resolution priority: --env flag > DELIVERY_LANE_ENV env var > "
            "policy default_lane_env > baseline ci_contract.default_env. "
            "Affects which lane subset becomes the gate's required set."
        ),
    )
    return parser.parse_args(argv)


def _resolve_lane_env(
    args: argparse.Namespace,
    policy: dict[str, Any],
    baseline_ci: dict[str, Any],
) -> str:
    """ADR-0014: resolve effective lane environment.

    Priority chain (highest first):
      1. CLI --env flag
      2. DELIVERY_LANE_ENV environment variable (set by CI workflow)
      3. policy.default_lane_env
      4. baseline ci_contract.default_env
      5. fallback "pre-prod"
    """
    import os
    cli_env = (getattr(args, "env", None) or "").strip()
    if cli_env:
        return cli_env
    env_var = (os.environ.get("DELIVERY_LANE_ENV") or "").strip()
    if env_var:
        return env_var
    policy_default = str(policy.get("default_lane_env") or "").strip()
    if policy_default:
        return policy_default
    baseline_default = str(baseline_ci.get("default_env") or "").strip()
    if baseline_default:
        return baseline_default
    return "pre-prod"


def _resolve_expected_lanes(
    baseline_ci: dict[str, Any],
    lane_env: str,
) -> tuple[list[str], str]:
    """ADR-0014: pick required_lanes_by_env[env] when present, fall back to
    legacy required_lanes for backward-compat.

    Returns (lanes, source) where source is "by_env" | "legacy" | "missing"
    so the report can audit which set governed the run.
    """
    by_env = baseline_ci.get("required_lanes_by_env")
    if isinstance(by_env, dict) and lane_env in by_env:
        env_lanes = by_env[lane_env]
        if isinstance(env_lanes, list) and env_lanes:
            return [str(x) for x in env_lanes if str(x).strip()], "by_env"
    legacy = baseline_ci.get("required_lanes")
    if isinstance(legacy, list) and legacy:
        return [str(x) for x in legacy if str(x).strip()], "legacy"
    return [], "missing"


def _load_ux_index(lock_obj: dict[str, Any]) -> tuple[set[str], dict[str, set[str]]]:
    themes = lock_obj.get("themes") if isinstance(lock_obj.get("themes"), list) else []
    theme_ids: set[str] = set()
    subthemes_by_theme: dict[str, set[str]] = {}
    for item in themes:
        if not isinstance(item, dict):
            continue
        theme_id = str(item.get("theme_id") or "").strip()
        if not theme_id:
            continue
        theme_ids.add(theme_id)
        subthemes = item.get("subthemes") if isinstance(item.get("subthemes"), list) else []
        subthemes_by_theme[theme_id] = {
            str(sub).strip()
            for sub in subthemes
            if isinstance(sub, str) and str(sub).strip()
        }
    return theme_ids, subthemes_by_theme


def _append_missing(errors: list[str], prefix: str, payload: dict[str, Any], required_keys: tuple[str, ...]) -> None:
    for key in required_keys:
        if key not in payload:
            errors.append(f"{prefix}:missing_key:{key}")


# NOTE: contract resolution lives in contract_resolution.resolve_active_contracts
# so the checker and the delivery-session packet builder cannot drift. Codex
# iter-6 REVISE flagged the previous in-file copy as a dead-letterbox risk.


def _validate_contract(
    contract: dict[str, Any],
    *,
    feature_id_for_prefix: str,
    scoped_files_present: bool,
    placeholder_tokens: list[str],
    expected_profile_id: str,
    expected_sequence: list[str],
    expected_lanes: list[str],
    require_sequence_from_lock: bool,
    require_lanes_from_lock: bool,
    require_ux_on_frontend_changes: bool,
    ux_scoped_files: list[str],
    active_status_on_scoped_change: bool,
    required_source_refs_min: int,
    ux_theme_ids: set[str],
    ux_subthemes_by_theme: dict[str, set[str]],
) -> tuple[list[str], list[str], list[str], list[str], list[str]]:
    """
    Validate a single contract object.

    Returns (errors, warnings, change_path_globs, service_scopes, artifact_globs).

    Errors and warnings are prefixed with `contract_<feature_id>:` so multi-contract
    failure mode is observable. The mandatory-shape rules mirror the legacy single
    contract behaviour but are scoped to this contract only.
    """
    errors: list[str] = []
    warnings: list[str] = []
    change_path_globs: list[str] = []
    service_scopes: list[str] = []
    artifact_globs: list[str] = []

    prefix = f"contract_{feature_id_for_prefix}" if feature_id_for_prefix else "contract"

    if not contract:
        errors.append(f"{prefix}:contract_required_for_scoped_changes")
        return errors, warnings, change_path_globs, service_scopes, artifact_globs

    _append_missing(
        errors,
        prefix,
        contract,
        (
            "version",
            "kind",
            "status",
            "feature_id",
            "title",
            "summary",
            "source_context",
            "delivery_scope",
            "ux_contract",
            "technical_contract",
            "lane_plan",
            "definition_of_done",
            "notes",
        ),
    )

    if str(contract.get("version") or "") != "v1":
        errors.append(f"{prefix}:version_must_be_v1")
    if str(contract.get("kind") or "") != "feature-execution-contract":
        errors.append(f"{prefix}:kind_invalid")
    status = str(contract.get("status") or "").strip()
    if active_status_on_scoped_change and scoped_files_present and status != "ACTIVE":
        errors.append(f"{prefix}:status_must_be_ACTIVE_for_scoped_changes")

    for key in ("feature_id", "title", "summary"):
        value = str(contract.get(key) or "").strip()
        if not value:
            errors.append(f"{prefix}:{key}_missing")
        elif scoped_files_present and _contains_placeholder(value, placeholder_tokens):
            errors.append(f"{prefix}:{key}_contains_placeholder")

    source_context = contract.get("source_context") if isinstance(contract.get("source_context"), dict) else {}
    _append_missing(
        errors,
        f"{prefix}:source_context",
        source_context,
        ("source_type", "source_refs", "business_goal", "requested_outcome"),
    )
    source_refs = source_context.get("source_refs") if isinstance(source_context.get("source_refs"), list) else []
    if len(source_refs) < required_source_refs_min:
        errors.append(f"{prefix}:source_context:source_refs_below_min")
    if scoped_files_present:
        for key in ("business_goal", "requested_outcome"):
            if _contains_placeholder(source_context.get(key), placeholder_tokens):
                errors.append(f"{prefix}:source_context:{key}_contains_placeholder")
        for idx, item in enumerate(source_refs):
            if _contains_placeholder(item, placeholder_tokens):
                errors.append(f"{prefix}:source_context:source_refs_contains_placeholder:{idx}")

    delivery_scope = contract.get("delivery_scope") if isinstance(contract.get("delivery_scope"), dict) else {}
    _append_missing(
        errors,
        f"{prefix}:delivery_scope",
        delivery_scope,
        ("repo_root", "service_scopes", "change_path_globs", "affected_modules"),
    )
    service_scopes = [
        str(item).strip()
        for item in (delivery_scope.get("service_scopes") or [])
        if isinstance(item, str) and str(item).strip()
    ]
    change_path_globs = [
        str(item).strip()
        for item in (delivery_scope.get("change_path_globs") or [])
        if isinstance(item, str) and str(item).strip()
    ]
    if scoped_files_present and not service_scopes:
        errors.append(f"{prefix}:delivery_scope:service_scopes_empty")
    if scoped_files_present and not change_path_globs:
        errors.append(f"{prefix}:delivery_scope:change_path_globs_empty")

    ux_contract = contract.get("ux_contract") if isinstance(contract.get("ux_contract"), dict) else {}
    _append_missing(errors, f"{prefix}:ux_contract", ux_contract, ("mode", "rationale", "artifacts"))
    ux_mode = str(ux_contract.get("mode") or "").strip()
    artifacts = ux_contract.get("artifacts") if isinstance(ux_contract.get("artifacts"), list) else []
    for idx, item in enumerate(artifacts):
        if not isinstance(item, dict):
            errors.append(f"{prefix}:ux_contract:artifact_not_object:{idx}")
            continue
        path_glob = str(item.get("path_glob") or "").strip()
        theme_id = str(item.get("ux_theme_id") or "").strip()
        subtheme_id = str(item.get("ux_subtheme_id") or "").strip()
        if not path_glob or not theme_id or not subtheme_id:
            errors.append(f"{prefix}:ux_contract:artifact_missing_fields:{idx}")
            continue
        artifact_globs.append(path_glob)
        if ux_theme_ids and theme_id not in ux_theme_ids:
            errors.append(f"{prefix}:ux_contract:invalid_theme_id:{theme_id}")
        elif ux_subthemes_by_theme and subtheme_id not in ux_subthemes_by_theme.get(theme_id, set()):
            errors.append(f"{prefix}:ux_contract:invalid_subtheme_id:{theme_id}:{subtheme_id}")
    if not ux_scoped_files and ux_mode == "NOT_APPLICABLE" and _contains_placeholder(
        ux_contract.get("rationale"), placeholder_tokens
    ):
        errors.append(f"{prefix}:ux_contract:rationale_contains_placeholder")
    # Frontend-coverage UX checks (REQUIRED + uncovered_ui_change) live at the
    # union level since coverage is an OR across active contracts.

    technical_contract = (
        contract.get("technical_contract") if isinstance(contract.get("technical_contract"), dict) else {}
    )
    _append_missing(
        errors,
        f"{prefix}:technical_contract",
        technical_contract,
        ("baseline_profile_id", "api_version_prefix", "design_system_policy", "db_migration_required"),
    )
    if expected_profile_id and str(technical_contract.get("baseline_profile_id") or "").strip() != expected_profile_id:
        errors.append(f"{prefix}:technical_contract:baseline_profile_id_mismatch")
    if str(technical_contract.get("api_version_prefix") or "").strip() != "/api/v1":
        errors.append(f"{prefix}:technical_contract:api_version_prefix_invalid")
    if (
        str(technical_contract.get("design_system_policy") or "").strip()
        != "policies/policy_ui_design_system.v1.json"
    ):
        errors.append(f"{prefix}:technical_contract:design_system_policy_invalid")
    if not isinstance(technical_contract.get("db_migration_required"), bool):
        errors.append(f"{prefix}:technical_contract:db_migration_required_must_be_boolean")

    lane_plan = contract.get("lane_plan") if isinstance(contract.get("lane_plan"), dict) else {}
    _append_missing(errors, f"{prefix}:lane_plan", lane_plan, ("execution_sequence", "required_lanes", "notes"))
    actual_sequence = [
        str(item).strip()
        for item in (lane_plan.get("execution_sequence") or [])
        if isinstance(item, str) and str(item).strip()
    ]
    actual_lanes = [
        str(item).strip()
        for item in (lane_plan.get("required_lanes") or [])
        if isinstance(item, str) and str(item).strip()
    ]
    if require_sequence_from_lock and expected_sequence and actual_sequence != expected_sequence:
        errors.append(f"{prefix}:lane_plan:execution_sequence_mismatch")
    # ADR-0014: feature contract required_lanes carries the FULL plan
    # (production-grade), while env-aware expected_lanes is the active
    # gate's REQUIRED SUBSET. Validation passes when contract plan is a
    # superset of the env's required set (i.e. every required lane is
    # part of the contract's plan). This keeps feature contracts stable
    # across env transitions while letting the gate accept the correct
    # subset per environment.
    if require_lanes_from_lock and expected_lanes:
        missing_lanes = [lane for lane in expected_lanes if lane not in actual_lanes]
        if missing_lanes:
            errors.append(
                f"{prefix}:lane_plan:required_lanes_missing:{','.join(missing_lanes)}"
            )

    definition_of_done = (
        contract.get("definition_of_done") if isinstance(contract.get("definition_of_done"), dict) else {}
    )
    _append_missing(
        errors,
        f"{prefix}:definition_of_done",
        definition_of_done,
        ("acceptance_criteria", "evidence_paths"),
    )
    acceptance_criteria = (
        definition_of_done.get("acceptance_criteria")
        if isinstance(definition_of_done.get("acceptance_criteria"), list)
        else []
    )
    evidence_paths = (
        definition_of_done.get("evidence_paths")
        if isinstance(definition_of_done.get("evidence_paths"), list)
        else []
    )
    if not acceptance_criteria:
        errors.append(f"{prefix}:definition_of_done:acceptance_criteria_empty")
    if not evidence_paths:
        errors.append(f"{prefix}:definition_of_done:evidence_paths_empty")
    if scoped_files_present:
        for idx, item in enumerate(acceptance_criteria):
            if _contains_placeholder(item, placeholder_tokens):
                errors.append(f"{prefix}:definition_of_done:acceptance_contains_placeholder:{idx}")

    return errors, warnings, change_path_globs, service_scopes, artifact_globs


def main(argv: list[str] | None = None) -> int:
    args = _parse_args(argv)
    repo_root = Path(str(args.repo_root)).resolve()
    policy_path = (repo_root / str(args.policy_path)).resolve()
    out_path = Path(str(args.out))
    if not out_path.is_absolute():
        out_path = (repo_root / out_path).resolve()

    errors: list[str] = []
    warnings: list[str] = []

    if not policy_path.exists():
        report = {
            "version": "v1",
            "kind": "feature-execution-contract-check-report",
            "generated_at": _now_iso(),
            "status": "FAIL",
            "repo_root": str(repo_root),
            "policy_path": str(policy_path),
            "errors": [f"policy_missing:{policy_path.as_posix()}"],
            "warnings": [],
        }
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        print(json.dumps({"status": "FAIL", "error_code": "POLICY_MISSING", "out": str(out_path)}, ensure_ascii=False))
        return 2

    policy = _load_json(policy_path)
    enforcement_mode = str(policy.get("enforcement_mode") or "blocking").strip().lower()
    try:
        contract_paths_rel, contract_source = resolve_active_contracts(repo_root, policy)
    except GovernanceError as exc:
        # Fail-closed: a missing or malformed active_features index becomes
        # a top-level error so downstream gates surface the violation. The
        # error token format is `active_features:<reason>:...`.
        contract_paths_rel, contract_source = [], "active_features_path"
        errors.append(str(exc))
    contract_schema_path_rel = str(policy.get("contract_schema_path") or "").strip()
    baseline_path_rel = str(policy.get("technical_baseline_path") or "").strip()
    ux_lock_path_rel = str(policy.get("ux_lock_path") or "").strip()

    contract_schema_path = (repo_root / contract_schema_path_rel).resolve() if contract_schema_path_rel else Path("")
    baseline_path = (repo_root / baseline_path_rel).resolve() if baseline_path_rel else Path("")
    ux_lock_path = (repo_root / ux_lock_path_rel).resolve() if ux_lock_path_rel else Path("")

    if not contract_paths_rel:
        errors.append("policy:contract_path_missing")

    resolved_contracts: list[tuple[str, Path]] = []
    for rel in contract_paths_rel:
        abs_path = (repo_root / rel).resolve()
        if not abs_path.exists():
            errors.append(f"contract_missing:{rel}")
            continue
        resolved_contracts.append((rel, abs_path))

    if not contract_schema_path_rel or not contract_schema_path.exists():
        errors.append(f"contract_schema_missing:{contract_schema_path_rel or 'unset'}")
    if not baseline_path_rel or not baseline_path.exists():
        errors.append(f"technical_baseline_missing:{baseline_path_rel or 'unset'}")
    if not ux_lock_path_rel or not ux_lock_path.exists():
        errors.append(f"ux_lock_missing:{ux_lock_path_rel or 'unset'}")

    scope_detection = policy.get("scope_detection") if isinstance(policy.get("scope_detection"), dict) else {}
    include_globs = [str(x).strip() for x in (scope_detection.get("include_globs") or []) if str(x).strip()]
    exclude_globs = [str(x).strip() for x in (scope_detection.get("exclude_globs") or []) if str(x).strip()]
    scope_globs = scope_detection.get("scope_globs") if isinstance(scope_detection.get("scope_globs"), dict) else {}
    ux_scope = policy.get("ux_scope") if isinstance(policy.get("ux_scope"), dict) else {}
    ux_required_globs = [str(x).strip() for x in (ux_scope.get("required_globs") or []) if str(x).strip()]
    validation = policy.get("validation") if isinstance(policy.get("validation"), dict) else {}
    placeholder_tokens = [str(x).strip() for x in (validation.get("placeholder_tokens") or []) if str(x).strip()]
    required_source_refs_min = int(validation.get("required_source_refs_min") or 1)
    active_status_on_scoped_change = bool(validation.get("active_status_on_scoped_change", True))
    require_sequence_from_lock = bool(validation.get("required_execution_sequence_from_lock", True))
    require_lanes_from_lock = bool(validation.get("required_lanes_from_lock", True))
    require_ux_on_frontend_changes = bool(ux_scope.get("require_ux_on_frontend_changes", True))

    changed_files: list[str] = []
    diff_base = str(args.base or "").strip()
    diff_head = str(args.head or "").strip()
    try:
        raw_changed = str(args.changed_files or "").strip()
        if raw_changed:
            changed_files = sorted(
                {
                    _normalize_rel(item)
                    for item in raw_changed.split(",")
                    if _normalize_rel(item)
                }
            )
        else:
            if not diff_base or not diff_head:
                diff_base, diff_head = _default_diff_refs(repo_root)
            changed_files = _git_changed_files(repo_root, diff_base, diff_head)
    except Exception as exc:
        errors.append(f"diff_collect_failed:{exc}")

    scoped_files = [
        path
        for path in changed_files
        if (not include_globs or _match_any(path, include_globs))
        and not (exclude_globs and _match_any(path, exclude_globs))
    ]
    ux_scoped_files = [path for path in scoped_files if _match_any(path, ux_required_globs)]

    detected_scopes: set[str] = set()
    for scope_name, patterns in scope_globs.items():
        if not isinstance(patterns, list):
            continue
        normalized_patterns = [str(item).strip() for item in patterns if isinstance(item, str) and str(item).strip()]
        if any(_match_any(path, normalized_patterns) for path in scoped_files):
            detected_scopes.add(str(scope_name))

    baseline: dict[str, Any] = {}
    expected_profile_id = ""
    expected_sequence: list[str] = []
    expected_lanes: list[str] = []
    lane_env = "pre-prod"
    lane_source = "missing"
    ci_contract: dict[str, Any] = {}
    if baseline_path_rel and baseline_path.exists():
        try:
            baseline = _load_json(baseline_path)
            expected_profile_id = str(baseline.get("profile_id") or "").strip()
            ci_contract = baseline.get("ci_contract") if isinstance(baseline.get("ci_contract"), dict) else {}
            expected_sequence = [str(x) for x in (ci_contract.get("delivery_sequence") or []) if str(x).strip()]
        except Exception as exc:
            errors.append(f"technical_baseline_invalid_json:{exc}")
            ci_contract = {}

    # ADR-0014: env-aware required lanes resolution.
    # Priority: --env flag > DELIVERY_LANE_ENV env var > policy.default_lane_env
    # > baseline ci_contract.default_env > "pre-prod" fallback.
    lane_env = _resolve_lane_env(args, policy, ci_contract)
    expected_lanes, lane_source = _resolve_expected_lanes(ci_contract, lane_env)

    ux_theme_ids: set[str] = set()
    ux_subthemes_by_theme: dict[str, set[str]] = {}
    if ux_lock_path_rel and ux_lock_path.exists():
        try:
            ux_lock = _load_json(ux_lock_path)
            ux_theme_ids, ux_subthemes_by_theme = _load_ux_index(ux_lock)
        except Exception as exc:
            errors.append(f"ux_lock_invalid_json:{exc}")

    contract_objects: list[tuple[str, dict[str, Any]]] = []
    for rel, abs_path in resolved_contracts:
        try:
            contract_objects.append((rel, _load_json(abs_path)))
        except Exception as exc:
            errors.append(f"contract_invalid_json:{rel}:{exc}")

    if scoped_files and not contract_objects:
        errors.append("contract_required_for_scoped_changes")

    union_change_globs: list[str] = []
    union_service_scopes: list[str] = []
    union_artifact_globs: list[str] = []
    contract_summaries: list[dict[str, Any]] = []
    contract_errors_total: list[str] = []
    contract_warnings_total: list[str] = []

    for rel, contract in contract_objects:
        feature_id = str(contract.get("feature_id") or "").strip() or Path(rel).stem
        c_errors, c_warnings, c_change_globs, c_service_scopes, c_artifact_globs = _validate_contract(
            contract,
            feature_id_for_prefix=feature_id,
            scoped_files_present=bool(scoped_files),
            placeholder_tokens=placeholder_tokens,
            expected_profile_id=expected_profile_id,
            expected_sequence=expected_sequence,
            expected_lanes=expected_lanes,
            require_sequence_from_lock=require_sequence_from_lock,
            require_lanes_from_lock=require_lanes_from_lock,
            require_ux_on_frontend_changes=require_ux_on_frontend_changes,
            ux_scoped_files=ux_scoped_files,
            active_status_on_scoped_change=active_status_on_scoped_change,
            required_source_refs_min=required_source_refs_min,
            ux_theme_ids=ux_theme_ids,
            ux_subthemes_by_theme=ux_subthemes_by_theme,
        )
        contract_errors_total.extend(c_errors)
        contract_warnings_total.extend(c_warnings)
        union_change_globs.extend(c_change_globs)
        union_service_scopes.extend(c_service_scopes)
        union_artifact_globs.extend(c_artifact_globs)
        contract_summaries.append(
            {
                "feature_id": feature_id,
                "contract_path": rel,
                "status": str(contract.get("status") or ""),
                "service_scopes": c_service_scopes,
                "change_path_globs": c_change_globs,
                "artifact_globs": c_artifact_globs,
            }
        )

    # Coverage union: every scoped file must be covered by at least one ACTIVE contract.
    if scoped_files and contract_objects:
        uncovered_files = [
            path for path in scoped_files if not _match_any(path, union_change_globs)
        ]
        if uncovered_files:
            contract_errors_total.extend(
                [f"delivery_scope:uncovered_change:{path}" for path in uncovered_files]
            )
        union_service_scope_set = set(union_service_scopes)
        undeclared_scopes = sorted(detected_scopes - union_service_scope_set)
        if undeclared_scopes:
            contract_errors_total.append(
                f"delivery_scope:missing_detected_scopes:{','.join(undeclared_scopes)}"
            )

    # UX scope union: any ux-scoped file must be covered by at least one contract's
    # ux_contract.artifacts.path_glob; mode-required is asserted at union level too.
    if scoped_files and contract_objects and require_ux_on_frontend_changes and ux_scoped_files:
        any_required_mode = any(
            str((contract.get("ux_contract") or {}).get("mode") or "").strip() == "REQUIRED"
            for _rel, contract in contract_objects
        )
        if not any_required_mode:
            contract_errors_total.append(
                "ux_contract:mode_must_be_REQUIRED_for_frontend_changes"
            )
        missing_ux_coverage = [path for path in ux_scoped_files if not _match_any(path, union_artifact_globs)]
        if missing_ux_coverage:
            contract_errors_total.extend(
                [f"ux_contract:uncovered_ui_change:{path}" for path in missing_ux_coverage]
            )

    errors.extend(contract_errors_total)
    warnings.extend(contract_warnings_total)

    status = "OK"
    if errors:
        status = "FAIL" if enforcement_mode == "blocking" else "WARN"

    # Backward-compat top-level fields keep the legacy reporter shape so downstream
    # consumers (gates, packets) keep working: contract_path is the first resolved
    # contract for single-contract cases and still readable for multi-contract.
    primary_contract_path = contract_paths_rel[0] if contract_paths_rel else ""

    report = {
        "version": "v1",
        "kind": "feature-execution-contract-check-report",
        "generated_at": _now_iso(),
        "status": status,
        "enforcement_mode": enforcement_mode,
        "repo_root": str(repo_root),
        "policy_path": str(policy_path.relative_to(repo_root)),
        "contract_path": primary_contract_path,
        "contract_paths": contract_paths_rel,
        "contract_resolution_source": contract_source,
        "contract_schema_path": contract_schema_path_rel,
        "technical_baseline_path": baseline_path_rel,
        "ux_lock_path": ux_lock_path_rel,
        "diff": {
            "base": diff_base,
            "head": diff_head,
            "changed_files_count": len(changed_files),
            "scoped_changed_files_count": len(scoped_files),
            "scoped_changed_files": scoped_files,
        },
        "scope_detection": {
            "detected_scopes": sorted(detected_scopes),
            "ux_scoped_changed_files_count": len(ux_scoped_files),
            "ux_scoped_changed_files": ux_scoped_files,
        },
        "contract_summary": {
            "service_scopes": sorted({s for s in union_service_scopes if s}),
            "change_path_globs": sorted({g for g in union_change_globs if g}),
            "artifact_globs": sorted({g for g in union_artifact_globs if g}),
            "expected_profile_id": expected_profile_id,
            "expected_execution_sequence": expected_sequence,
            "expected_required_lanes": expected_lanes,
            "effective_lane_env": lane_env,
            "lane_resolution_source": lane_source,
        },
        "active_contracts": contract_summaries,
        "errors": errors,
        "warnings": warnings,
    }
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")

    print(
        json.dumps(
            {
                "status": status,
                "enforcement_mode": enforcement_mode,
                "scoped_changed_files_count": len(scoped_files),
                "detected_scopes": sorted(detected_scopes),
                "active_contracts": len(contract_summaries),
                "contract_resolution_source": contract_source,
                "effective_lane_env": lane_env,
                "lane_resolution_source": lane_source,
                "expected_required_lanes": expected_lanes,
                "errors": len(errors),
                "warnings": len(warnings),
                "out": str(out_path),
            },
            ensure_ascii=False,
            sort_keys=True,
        )
    )
    if status == "FAIL" and enforcement_mode == "blocking":
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
