#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


def _load_json(path: Path) -> dict[str, Any]:
    obj = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(obj, dict):
        raise ValueError(f"invalid_json_root:{path}")
    return obj


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
    parser.add_argument("--plane", action="append", default=[])
    parser.add_argument("--primary-plane", default="")
    parser.add_argument("--capability-id", action="append", default=[])
    parser.add_argument("--permission-code", action="append", default=[])
    parser.add_argument("--resource-scope", action="append", default=[])
    parser.add_argument("--audit-action", action="append", default=[])
    parser.add_argument("--event-name", action="append", default=[])
    parser.add_argument("--job-name", action="append", default=[])
    parser.add_argument("--decision-bundle-path", default="tenant/TENANT-DEFAULT/decision-bundle.v1.json")
    parser.add_argument("--context-ref", action="append", default=[])
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
    parser.add_argument("--out", default="")
    return parser.parse_args(argv)


def _parse_bool(raw: str) -> bool:
    return str(raw or "").strip().lower() in {"1", "true", "yes", "on"}


def _unique_text(values: list[str]) -> list[str]:
    out: list[str] = []
    seen: set[str] = set()
    for raw in values:
        item = str(raw).strip()
        if not item or item in seen:
            continue
        seen.add(item)
        out.append(item)
    return out


def _derive_planes(scopes: list[str], change_globs: list[str], explicit_planes: list[str]) -> list[str]:
    if explicit_planes:
        return _unique_text(explicit_planes)

    planes: list[str] = []
    if "frontend" in scopes:
        planes.append("web")
        if any(glob.startswith("mobile/") for glob in change_globs):
            planes.append("mobile")
    if "backend" in scopes or "api" in scopes:
        planes.append("backend")
    if "database" in scopes:
        planes.append("data")
    if not planes:
        planes.append("governance")
    return _unique_text(planes)


def _default_plane_globs(plane: str) -> list[str]:
    defaults = {
        "web": ["web/**"],
        "mobile": ["mobile/**"],
        "backend": ["backend/**", "api/**"],
        "ai": ["ai/**"],
        "data": ["data/**", "db/**", "database/**", "sql/**", "pipelines/**", "reports/**"],
        "governance": [
            "docs/**",
            "tenant/**",
            "schemas/**",
            "policies/**",
            "registry/**",
            "extensions/PRJ-PM-SUITE/contract/**",
        ],
    }
    return list(defaults.get(plane, ["**"]))


def _derive_plane_path_globs(planes: list[str], change_globs: list[str]) -> dict[str, list[str]]:
    prefix_map = {
        "web": ("web/", "frontend/", "apps/", "ui/"),
        "mobile": ("mobile/",),
        "backend": ("backend/", "api/"),
        "ai": ("ai/",),
        "data": ("data/", "db/", "database/", "sql/", "pipelines/", "reports/"),
        "governance": ("docs/", "tenant/", "schemas/", "policies/", "registry/", "extensions/PRJ-PM-SUITE/contract/"),
    }
    out: dict[str, list[str]] = {}
    for plane in planes:
        prefixes = prefix_map.get(plane, tuple())
        matched = [glob for glob in change_globs if glob.startswith(prefixes)]
        out[plane] = matched or _default_plane_globs(plane)
    return out


def main(argv: list[str] | None = None) -> int:
    args = _parse_args(argv)
    repo_root = Path(str(args.repo_root)).resolve()
    template_path = repo_root / "extensions/PRJ-PM-SUITE/contract/feature_execution_contract.v1.json"
    policy_path = repo_root / "policies/policy_feature_execution_bridge.v1.json"
    baseline_path = repo_root / "registry/technical_baseline.aistd.v1.json"

    template = _load_json(template_path)
    policy = _load_json(policy_path)
    baseline = _load_json(baseline_path)

    out_path_text = str(args.out).strip() or str(policy.get("contract_path") or "")
    if not out_path_text:
        raise SystemExit("contract_seed failed: contract_path missing in policy")
    out_path = Path(out_path_text)
    if not out_path.is_absolute():
        out_path = (repo_root / out_path).resolve()

    scope_globs = (
        (policy.get("scope_detection") if isinstance(policy.get("scope_detection"), dict) else {}).get("scope_globs")
        if isinstance((policy.get("scope_detection") if isinstance(policy.get("scope_detection"), dict) else {}).get("scope_globs"), dict)
        else {}
    )
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

    selected_planes = _derive_planes(selected_scopes, change_globs, [str(item) for item in args.plane])
    primary_plane = str(args.primary_plane).strip() or selected_planes[0]
    multi_plane_mode = "multi-plane" if len(selected_planes) > 1 else "single-plane"
    context_refs = _unique_text(
        [str(item).strip() for item in args.context_ref if str(item).strip()]
        or [
            "tenant/TENANT-DEFAULT/context.v1.md",
            "tenant/TENANT-DEFAULT/stakeholders.v1.md",
            "tenant/TENANT-DEFAULT/scope.v1.md",
            "tenant/TENANT-DEFAULT/criteria.v1.md",
        ]
    )

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
    contract["feature_id"] = str(args.feature_id).strip()
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
    contract["multi_plane_contract"] = {
        "mode": multi_plane_mode,
        "planes": selected_planes,
        "primary_plane": primary_plane,
        "plane_path_globs": _derive_plane_path_globs(selected_planes, change_globs),
    }
    contract["shared_contracts"] = {
        "capability_ids": _unique_text([str(item) for item in args.capability_id]),
        "permission_codes": _unique_text([str(item) for item in args.permission_code]),
        "resource_scopes": _unique_text([str(item) for item in args.resource_scope]),
        "audit_actions": _unique_text([str(item) for item in args.audit_action]),
        "event_names": _unique_text([str(item) for item in args.event_name]),
        "job_names": _unique_text([str(item) for item in args.job_name]),
    }
    contract["context_contract"] = {
        "decision_bundle_path": str(args.decision_bundle_path).strip() or "tenant/TENANT-DEFAULT/decision-bundle.v1.json",
        "context_refs": context_refs,
        "codex_read_sequence": [
            "standards.lock",
            "docs/OPERATIONS/AI-MULTIREPO-OPERATING-CONTRACT.v1.md",
            "docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md",
            "tenant/TENANT-DEFAULT/context.v1.md",
            "tenant/TENANT-DEFAULT/decision-bundle.v1.json",
            "extensions/PRJ-PM-SUITE/contract/feature_execution_contract.v1.json",
        ],
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

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(contract, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "status": "OK",
                "out": str(out_path),
                "feature_id": contract["feature_id"],
                "service_scopes": contract["delivery_scope"]["service_scopes"],
                "planes": contract["multi_plane_contract"]["planes"],
            },
            ensure_ascii=False,
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
