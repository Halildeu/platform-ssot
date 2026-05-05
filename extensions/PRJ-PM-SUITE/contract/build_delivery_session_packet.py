#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

# Reuse the shared contract resolver so the checker and the packet builder
# cannot disagree on which contracts are active. (Codex iter-6 REVISE.)
sys.path.insert(0, str(Path(__file__).resolve().parent))

from contract_resolution import (  # noqa: E402  (intentional sys.path tweak above)
    GovernanceError,
    resolve_active_contracts,
)


def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


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
    parser.add_argument("--contract-path", default="")
    parser.add_argument(
        "--contract-paths",
        default="",
        help="Comma separated explicit list of contract paths (overrides bridge policy).",
    )
    parser.add_argument("--out", default="")
    return parser.parse_args(argv)


def _unique(values: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for value in values:
        item = str(value).strip()
        if not item or item in seen:
            continue
        seen.add(item)
        out.append(item)
    return out


def _phase_default_globs(phase: str) -> list[str]:
    defaults = {
        "backend": ["backend/**", "services/**"],
        "database": ["db/**", "database/**", "sql/**", "backend/**/migration/**"],
        "api": ["api/**", "backend/**/controller/**", "backend/**/dto/**", "docs/03-delivery/api/**"],
        "frontend": ["web/**", "frontend/**", "mobile/**", "apps/**", "ui/**"],
        "integration": ["backend/**", "web/**", "api/**", "docs/03-delivery/api/**"],
        "e2e": ["backend/**", "web/**", "api/**", "docs/03-delivery/api/**"],
    }
    return list(defaults.get(phase, ["**"]))


def _phase_related_globs(phase: str, contract_globs: list[str]) -> list[str]:
    phase_prefixes = {
        "backend": ("backend/", "services/", "extensions/"),
        "database": ("db/", "database/", "sql/", "backend/"),
        "api": ("api/", "backend/", "docs/03-delivery/api/"),
        "frontend": ("web/", "frontend/", "mobile/", "apps/", "ui/", "extensions/"),
        "integration": tuple(),
        "e2e": tuple(),
    }
    prefixes = phase_prefixes.get(phase, tuple())
    matched = [item for item in contract_globs if item.startswith(prefixes)]
    return matched or _phase_default_globs(phase)


def _build_per_contract_packet(
    contract: dict[str, Any],
    contract_path_rel: str,
    *,
    repo_root: Path,
    standards_lock: dict[str, Any],
    lane_cfg: dict[str, Any],
    extra_read_paths: list[str],
) -> dict[str, Any]:
    """Build the per-contract sub-packet (lane_plan + write_plan + ux_context)."""
    delivery_scope = contract.get("delivery_scope") if isinstance(contract.get("delivery_scope"), dict) else {}
    ux_contract = contract.get("ux_contract") if isinstance(contract.get("ux_contract"), dict) else {}
    lane_plan_obj = contract.get("lane_plan") if isinstance(contract.get("lane_plan"), dict) else {}

    module_delivery_contract = (
        standards_lock.get("module_delivery_contract")
        if isinstance(standards_lock.get("module_delivery_contract"), dict)
        else {}
    )
    scope_lane_map = (
        module_delivery_contract.get("scope_lane_map")
        if isinstance(module_delivery_contract.get("scope_lane_map"), dict)
        else {}
    )

    service_scopes = _unique(
        [str(item) for item in (delivery_scope.get("service_scopes") or []) if isinstance(item, str)]
    )
    contract_globs = _unique(
        [str(item) for item in (delivery_scope.get("change_path_globs") or []) if isinstance(item, str)]
    )
    execution_sequence = _unique(
        [str(item) for item in (lane_plan_obj.get("execution_sequence") or []) if isinstance(item, str)]
    )

    active_lanes: list[str] = []
    for scope in service_scopes:
        lane = str(scope_lane_map.get(scope) or "").strip()
        if lane:
            active_lanes.append(lane)
    active_lanes.extend(["integration", "e2e"])
    active_lanes = _unique(active_lanes)

    lane_commands_src = lane_cfg.get("lanes") if isinstance(lane_cfg.get("lanes"), dict) else {}
    lane_commands: dict[str, str] = {}
    for lane in active_lanes:
        lane_obj = lane_commands_src.get(lane) if isinstance(lane_commands_src.get(lane), dict) else {}
        lane_commands[lane] = str(lane_obj.get("command") or "").strip()

    phase_to_lane = {
        "backend": "unit",
        "database": "database",
        "api": "api",
        "frontend": "contract",
        "integration": "integration",
        "e2e": "e2e",
    }
    active_phases = _unique(service_scopes + ["integration", "e2e"])
    write_plan: list[dict[str, Any]] = []
    base_read_paths = [
        contract_path_rel,
        "standards.lock",
        "registry/technical_baseline.aistd.v1.json",
        "ci/module_delivery_lanes.v1.json",
        "policies/policy_feature_execution_bridge.v1.json",
        "policies/policy_ui_design_system.v1.json",
        "extensions/PRJ-UX-NORTH-STAR/contract/ux_katalogu.final_lock.v1.json",
        "extensions/PRJ-UX-NORTH-STAR/contract/ux_change_map.v1.json",
    ]
    for phase in execution_sequence:
        if phase not in active_phases:
            continue
        lane = phase_to_lane.get(phase)
        if not lane:
            continue
        write_plan.append(
            {
                "phase": phase,
                "lane": lane,
                "write_globs": _phase_related_globs(phase, contract_globs),
                "read_paths": _unique(base_read_paths + extra_read_paths),
                "command": lane_commands.get(lane) or "",
                "notes": [
                    f"Do not move to the next phase before the {lane} lane is locally green.",
                    "If a file outside write_globs is needed, rebuild the delivery session packet first.",
                ],
            }
        )

    return {
        "feature_id": str(contract.get("feature_id") or "").strip(),
        "title": str(contract.get("title") or "").strip(),
        "contract_path": contract_path_rel,
        "active_scopes": service_scopes,
        "change_path_globs": contract_globs,
        "affected_modules": _unique(
            [str(item) for item in (delivery_scope.get("affected_modules") or []) if isinstance(item, str)]
        ),
        "lane_plan": {
            "execution_sequence": execution_sequence,
            "active_lanes": active_lanes,
            "lane_commands": lane_commands,
        },
        "write_plan": write_plan,
        "ux_context": {
            "mode": str(ux_contract.get("mode") or "NOT_APPLICABLE"),
            "artifact_count": len(ux_contract.get("artifacts") or []),
            "change_map_path": "extensions/PRJ-UX-NORTH-STAR/contract/ux_change_map.v1.json",
            "artifacts": ux_contract.get("artifacts") if isinstance(ux_contract.get("artifacts"), list) else [],
        },
    }


def main(argv: list[str] | None = None) -> int:
    args = _parse_args(argv)
    repo_root = Path(str(args.repo_root)).resolve()

    pm_policy_path = repo_root / "policies/policy_pm_suite.v1.json"
    pm_policy = _load_json(pm_policy_path)
    delivery_session = pm_policy.get("delivery_session") if isinstance(pm_policy.get("delivery_session"), dict) else {}
    execution_bridge_legacy = (
        pm_policy.get("execution_bridge") if isinstance(pm_policy.get("execution_bridge"), dict) else {}
    )

    bridge_policy_path = repo_root / "policies/policy_feature_execution_bridge.v1.json"
    bridge_policy = _load_json(bridge_policy_path) if bridge_policy_path.exists() else {}

    contract_paths_rel: list[str] = []
    resolution_source = "none"

    explicit_paths_arg = str(args.contract_paths or "").strip()
    if explicit_paths_arg:
        contract_paths_rel = sorted(
            {
                _normalize_rel(item)
                for item in explicit_paths_arg.split(",")
                if _normalize_rel(item)
            }
        )
        resolution_source = "cli_contract_paths"

    cli_single = str(args.contract_path or "").strip()
    if not contract_paths_rel and cli_single:
        contract_paths_rel = [_normalize_rel(cli_single)]
        resolution_source = "cli_contract_path"

    if not contract_paths_rel and bridge_policy:
        try:
            contract_paths_rel, resolution_source = resolve_active_contracts(repo_root, bridge_policy)
        except GovernanceError as exc:
            # Same fail-closed semantics as the checker: a malformed
            # active_features index must abort the packet build instead of
            # silently falling through to the glob.
            raise SystemExit(f"delivery_session_build failed: {exc}") from exc

    # Final fallback: legacy pm_suite.execution_bridge.contract_path
    if not contract_paths_rel:
        legacy = str(execution_bridge_legacy.get("contract_path") or "").strip()
        if legacy:
            contract_paths_rel = [_normalize_rel(legacy)]
            resolution_source = "legacy_pm_suite_contract_path"

    if not contract_paths_rel:
        raise SystemExit("delivery_session_build failed: contract path missing")

    standards_lock = _load_json(repo_root / "standards.lock")
    baseline = _load_json(repo_root / "registry/technical_baseline.aistd.v1.json")
    lane_cfg = _load_json(repo_root / "ci/module_delivery_lanes.v1.json")

    out_text = str(args.out).strip() or str(delivery_session.get("packet_path") or "")
    if not out_text:
        raise SystemExit("delivery_session_build failed: packet path missing")
    out_path = Path(out_text)
    if not out_path.is_absolute():
        out_path = (repo_root / out_path).resolve()

    contracts: list[tuple[str, dict[str, Any]]] = []
    for rel in contract_paths_rel:
        abs_path = (repo_root / rel).resolve()
        if not abs_path.exists():
            raise SystemExit(f"delivery_session_build failed: contract_missing:{rel}")
        contracts.append((rel, _load_json(abs_path)))

    extra_read_paths = [rel for rel, _ in contracts]
    active_contract_packets = [
        _build_per_contract_packet(
            contract,
            rel,
            repo_root=repo_root,
            standards_lock=standards_lock,
            lane_cfg=lane_cfg,
            extra_read_paths=extra_read_paths,
        )
        for rel, contract in contracts
    ]

    union_active_scopes = _unique(
        [scope for pkt in active_contract_packets for scope in pkt.get("active_scopes", [])]
    )
    union_change_globs = _unique(
        [g for pkt in active_contract_packets for g in pkt.get("change_path_globs", [])]
    )
    union_active_lanes = _unique(
        [lane for pkt in active_contract_packets for lane in pkt.get("lane_plan", {}).get("active_lanes", [])]
    )
    union_execution_sequence = _unique(
        [
            phase
            for pkt in active_contract_packets
            for phase in pkt.get("lane_plan", {}).get("execution_sequence", [])
        ]
    )
    union_lane_commands: dict[str, str] = {}
    for pkt in active_contract_packets:
        for lane, cmd in (pkt.get("lane_plan") or {}).get("lane_commands", {}).items():
            if lane and lane not in union_lane_commands and cmd:
                union_lane_commands[lane] = cmd

    union_affected_modules = _unique(
        [m for pkt in active_contract_packets for m in pkt.get("affected_modules", [])]
    )
    union_artifacts: list[dict[str, str]] = []
    for pkt in active_contract_packets:
        ux = pkt.get("ux_context") or {}
        for item in ux.get("artifacts") or []:
            if isinstance(item, dict):
                union_artifacts.append(item)
    any_required_ux = any(
        str((pkt.get("ux_context") or {}).get("mode") or "").strip() == "REQUIRED"
        for pkt in active_contract_packets
    )
    union_ux_mode = "REQUIRED" if any_required_ux else "NOT_APPLICABLE"

    union_write_plan: list[dict[str, Any]] = []
    for pkt in active_contract_packets:
        for entry in pkt.get("write_plan") or []:
            entry_copy = dict(entry)
            entry_copy["feature_id"] = pkt.get("feature_id", "")
            union_write_plan.append(entry_copy)

    primary_contract_path = active_contract_packets[0]["contract_path"] if active_contract_packets else ""
    primary_feature_id = active_contract_packets[0]["feature_id"] if active_contract_packets else ""
    primary_title = active_contract_packets[0]["title"] if active_contract_packets else ""

    allowed_write_paths = _unique(
        union_change_globs
        + [pkt.get("contract_path", "") for pkt in active_contract_packets]
        + [
            "extensions/PRJ-UX-NORTH-STAR/contract/ux_change_map.v1.json",
        ]
    )
    required_read_paths = _unique(
        [pkt.get("contract_path", "") for pkt in active_contract_packets]
        + [
            "standards.lock",
            "registry/technical_baseline.aistd.v1.json",
            "policies/policy_feature_execution_bridge.v1.json",
            "policies/policy_ui_design_system.v1.json",
            "ci/module_delivery_lanes.v1.json",
            "extensions/PRJ-UX-NORTH-STAR/contract/ux_katalogu.final_lock.v1.json",
            "extensions/PRJ-UX-NORTH-STAR/contract/ux_change_map.v1.json",
        ]
    )

    report_path = str(delivery_session.get("guard_report_path") or ".cache/reports/delivery_session_guard.v1.json")

    union_evidence_targets: list[str] = []
    for _rel, contract in contracts:
        dod = contract.get("definition_of_done") if isinstance(contract.get("definition_of_done"), dict) else {}
        for item in dod.get("evidence_paths") or []:
            if isinstance(item, str) and str(item).strip():
                union_evidence_targets.append(str(item).strip())
    union_evidence_targets.append(report_path)
    union_evidence_targets = _unique(union_evidence_targets)

    packet = {
        "version": "v1",
        "kind": "delivery-session-packet",
        "generated_at": _now_iso(),
        "repo_root": str(repo_root),
        "contract_resolution_source": resolution_source,
        "source_contract_path": primary_contract_path,
        "source_contract_paths": [pkt.get("contract_path", "") for pkt in active_contract_packets],
        "feature_id": primary_feature_id,
        "title": primary_title,
        "active_scopes": union_active_scopes,
        "affected_modules": union_affected_modules,
        "allowed_write_paths": allowed_write_paths,
        "required_read_paths": required_read_paths,
        "lane_plan": {
            "execution_sequence": union_execution_sequence,
            "active_lanes": union_active_lanes,
            "lane_commands": union_lane_commands,
        },
        "write_plan": union_write_plan,
        "ux_context": {
            "mode": union_ux_mode,
            "artifact_count": len(union_artifacts),
            "change_map_path": "extensions/PRJ-UX-NORTH-STAR/contract/ux_change_map.v1.json",
            "artifacts": union_artifacts,
        },
        "active_contracts": active_contract_packets,
        "stop_conditions": [
            "scope_expansion_requires_packet_rebuild",
            "frontend_without_ux_mapping_blocked",
            "lane_failure_blocks_next_lane",
            "write_outside_allowed_paths_blocked",
        ],
        "evidence_targets": union_evidence_targets,
        "notes": [
            str(delivery_session.get("note") or "delivery_session_compiler_active"),
            f"baseline_profile={baseline.get('profile_id')}",
            f"contract_resolution_source={resolution_source}",
            f"active_contract_count={len(active_contract_packets)}",
        ],
    }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(packet, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "status": "OK",
                "out": str(out_path),
                "feature_id": packet["feature_id"],
                "active_contract_count": len(active_contract_packets),
                "active_scopes": packet["active_scopes"],
                "active_lanes": packet["lane_plan"]["active_lanes"],
                "contract_resolution_source": resolution_source,
            },
            ensure_ascii=False,
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
