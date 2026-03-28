#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def _now_iso_utc() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _load_json(path: Path) -> dict[str, Any]:
    obj = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(obj, dict):
        raise ValueError(f"json_root_not_object:{path}")
    return obj


def _parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", default=".")
    parser.add_argument("--out", default=".cache/reports/ux_north_star_report.v1.json")
    return parser.parse_args(argv)


def _check(id_: str, status: str, expected: str, actual: str, evidence: list[str]) -> dict[str, Any]:
    return {
        "id": id_,
        "status": status,
        "expected": expected,
        "actual": actual,
        "evidence": evidence,
    }


def _section_status(checks: list[dict[str, Any]]) -> str:
    has_fail = any(str(item.get("status")) == "FAIL" for item in checks)
    if has_fail:
        return "FAIL"
    has_warn = any(str(item.get("status")) == "WARN" for item in checks)
    return "WARN" if has_warn else "OK"


def _env_is_enabled(name: str) -> bool:
    return str(os.getenv(name) or "").strip().lower() in {"1", "true", "yes", "on"}


def main(argv: list[str] | None = None) -> int:
    args = _parse_args(argv)
    repo_root = Path(str(args.repo_root)).expanduser().resolve()
    out_path = Path(str(args.out)).expanduser()
    out_path = (repo_root / out_path).resolve() if not out_path.is_absolute() else out_path.resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)

    lock_path = repo_root / "standards.lock"
    if not lock_path.exists():
        payload = {"status": "FAIL", "error_code": "STANDARDS_LOCK_MISSING", "repo_root": str(repo_root)}
        print(json.dumps(payload, ensure_ascii=False, sort_keys=True))
        return 2

    lock = _load_json(lock_path)
    standard_sources = lock.get("standard_sources") if isinstance(lock.get("standard_sources"), dict) else {}

    ux_policy_rel = str(standard_sources.get("ux_north_star_policy") or "").strip()
    ux_catalog_rel = str(standard_sources.get("ux_north_star_catalog") or "").strip()
    llm_live_rel = str(standard_sources.get("llm_live_policy") or "").strip()
    llm_guardrails_rel = str(standard_sources.get("llm_provider_guardrails_policy") or "").strip()

    ux_policy_path = (repo_root / ux_policy_rel).resolve() if ux_policy_rel else Path("")
    ux_catalog_path = (repo_root / ux_catalog_rel).resolve() if ux_catalog_rel else Path("")
    llm_live_path = (repo_root / llm_live_rel).resolve() if llm_live_rel else Path("")
    llm_guardrails_path = (repo_root / llm_guardrails_rel).resolve() if llm_guardrails_rel else Path("")

    ux_policy = _load_json(ux_policy_path) if ux_policy_path.exists() else {}
    ux_catalog = _load_json(ux_catalog_path) if ux_catalog_path.exists() else {}
    llm_live = _load_json(llm_live_path) if llm_live_path.exists() else {}
    llm_guardrails = _load_json(llm_guardrails_path) if llm_guardrails_path.exists() else {}

    policy_checks: list[dict[str, Any]] = []
    policy_checks.append(
        _check(
            "ux.policy.exists",
            "OK" if ux_policy_path.exists() else "FAIL",
            "policy file exists",
            ux_policy_rel or "missing_path",
            [ux_policy_rel] if ux_policy_rel else [],
        )
    )
    policy_checks.append(
        _check(
            "ux.policy.active_blocking",
            "OK"
            if ux_policy.get("status") == "ACTIVE"
            and ux_policy.get("enforcement_mode") == "blocking"
            and ux_policy.get("ci_lane") == "contract"
            else "FAIL",
            "status=ACTIVE, enforcement_mode=blocking, ci_lane=contract",
            f"status={ux_policy.get('status')} enforcement={ux_policy.get('enforcement_mode')} ci_lane={ux_policy.get('ci_lane')}",
            [ux_policy_rel] if ux_policy_rel else [],
        )
    )

    catalog_checks: list[dict[str, Any]] = []
    refs = ux_catalog.get("references") if isinstance(ux_catalog.get("references"), list) else []
    domains = ux_catalog.get("domains") if isinstance(ux_catalog.get("domains"), list) else []
    program_id = str(ux_catalog.get("program_id") or "")
    catalog_checks.append(
        _check(
            "ux.catalog.exists",
            "OK" if ux_catalog_path.exists() else "FAIL",
            "catalog file exists",
            ux_catalog_rel or "missing_path",
            [ux_catalog_rel] if ux_catalog_rel else [],
        )
    )
    catalog_checks.append(
        _check(
            "ux.catalog.structure",
            "OK"
            if ux_catalog.get("version") == "v1"
            and ux_catalog.get("kind") == "ux-north-star-catalog-aistd"
            and ux_catalog.get("status") == "ACTIVE"
            and program_id
            else "FAIL",
            "v1 + kind + ACTIVE + non-empty program_id",
            f"version={ux_catalog.get('version')} kind={ux_catalog.get('kind')} status={ux_catalog.get('status')} program_id={program_id}",
            [ux_catalog_rel] if ux_catalog_rel else [],
        )
    )
    catalog_checks.append(
        _check(
            "ux.catalog.coverage",
            "OK" if len(domains) >= 10 and len(refs) >= 6 else "FAIL",
            "domains>=10 and references>=6",
            f"domains={len(domains)} references={len(refs)}",
            [ux_catalog_rel] if ux_catalog_rel else [],
        )
    )

    ai_checks: list[dict[str, Any]] = []
    provider_candidates = (
        ux_catalog.get("thinking_consultation", {}).get("provider_candidates")
        if isinstance(ux_catalog.get("thinking_consultation"), dict)
        else []
    )
    provider_candidates = [str(item) for item in provider_candidates if isinstance(item, str) and str(item).strip()]
    allowed_providers = (
        llm_live.get("allowed_providers") if isinstance(llm_live.get("allowed_providers"), list) else []
    )
    allowed_providers = [str(item) for item in allowed_providers if isinstance(item, str) and str(item).strip()]

    missing_from_allowlist = sorted([item for item in provider_candidates if item not in set(allowed_providers)])
    ai_checks.append(
        _check(
            "ux.ai.provider_alignment",
            "OK" if not missing_from_allowlist else "WARN",
            "catalog provider candidates subset of llm_live allowed providers",
            f"missing={missing_from_allowlist}",
            [llm_live_rel, ux_catalog_rel],
        )
    )

    live_gate = llm_guardrails.get("live_gate") if isinstance(llm_guardrails.get("live_gate"), dict) else {}
    live_flag_env = str(live_gate.get("explicit_live_flag_env") or "KERNEL_API_LLM_LIVE")
    live_flag_enabled = _env_is_enabled(live_flag_env)
    ai_checks.append(
        _check(
            "ux.ai.live_flag",
            "OK" if live_flag_enabled else "WARN",
            f"{live_flag_env}=1 for live consultation",
            f"enabled={live_flag_enabled}",
            [llm_guardrails_rel],
        )
    )

    sections = {
        "policy": {"checks": policy_checks},
        "catalog": {"checks": catalog_checks},
        "ai_consultation": {"checks": ai_checks},
    }

    fail_ids: list[str] = []
    warn_ids: list[str] = []
    for section in sections.values():
        checks = section["checks"]
        section["status"] = _section_status(checks)
        for item in checks:
            if item["status"] == "FAIL":
                fail_ids.append(str(item["id"]))
            elif item["status"] == "WARN":
                warn_ids.append(str(item["id"]))

    overall = "FAIL" if fail_ids else ("WARN" if warn_ids else "OK")

    report = {
        "version": "v1",
        "kind": "ux-north-star-report",
        "generated_at": _now_iso_utc(),
        "repo_root": str(repo_root),
        "status": overall,
        "sources": {
            "ux_policy": ux_policy_rel,
            "ux_catalog": ux_catalog_rel,
            "llm_live": llm_live_rel,
            "llm_guardrails": llm_guardrails_rel,
        },
        "sections": sections,
        "summary": {
            "fail_count": len(fail_ids),
            "warn_count": len(warn_ids),
            "failed_check_ids": sorted(fail_ids),
            "warning_check_ids": sorted(warn_ids),
        },
    }

    out_path.write_text(json.dumps(report, ensure_ascii=False, sort_keys=True, indent=2) + "\n", encoding="utf-8")
    payload = {
        "status": overall,
        "report_path": str(out_path),
        "fail_count": len(fail_ids),
        "warn_count": len(warn_ids),
    }
    print(json.dumps(payload, ensure_ascii=False, sort_keys=True))
    return 0 if overall in {"OK", "WARN"} else 2


if __name__ == "__main__":
    raise SystemExit(main())
