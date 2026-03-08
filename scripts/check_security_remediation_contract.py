#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from datetime import date
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
CONTRACT_PATH = ROOT / "docs" / "02-architecture" / "context" / "security-remediation.contract.v1.json"


def _load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _path_exists(rel_path: str) -> bool:
    return (ROOT / rel_path).exists()


def _check_contract_shape(contract: dict[str, Any]) -> list[str]:
    issues: list[str] = []
    if str(contract.get("contract_id") or "").strip() != "security-remediation-contract-v1":
        issues.append("contract_id_invalid")
    blocking_policy = contract.get("blocking_policy")
    if not isinstance(blocking_policy, dict):
        issues.append("blocking_policy_missing")
    else:
        required_checks = blocking_policy.get("required_checks")
        if not isinstance(required_checks, list) or not required_checks:
            issues.append("blocking_policy.required_checks_missing")
    if not isinstance(contract.get("remediation_waves"), list):
        issues.append("remediation_waves_missing")
    if not isinstance(contract.get("governed_residual_risks"), list):
        issues.append("governed_residual_risks_missing")
    return issues


def _check_review_dates(contract: dict[str, Any]) -> list[str]:
    issues: list[str] = []
    today = date.today()
    for risk in contract.get("governed_residual_risks") or []:
        if not isinstance(risk, dict):
            issues.append("residual_risk_invalid")
            continue
        review_str = str(risk.get("review_on_or_before") or "").strip()
        risk_id = str(risk.get("id") or "unknown")
        try:
            review_date = date.fromisoformat(review_str)
        except ValueError:
            issues.append(f"review_date_invalid:{risk_id}")
            continue
        if review_date < today:
            issues.append(f"review_date_expired:{risk_id}")
    return issues


def _check_evidence_paths(contract: dict[str, Any], allow_missing_artifacts: bool) -> tuple[list[str], list[str]]:
    issues: list[str] = []
    warnings: list[str] = []

    for wave in contract.get("remediation_waves") or []:
        if not isinstance(wave, dict):
            issues.append("remediation_wave_invalid")
            continue
        for action in wave.get("actions") or []:
            if not isinstance(action, dict):
                issues.append(f"remediation_action_invalid:{wave.get('id')}")
                continue
            for evidence in action.get("evidence") or []:
                rel = str(evidence or "").strip()
                if rel and not _path_exists(rel):
                    issues.append(f"missing_wave_evidence:{wave.get('id')}:{rel}")

    for risk in contract.get("governed_residual_risks") or []:
        if not isinstance(risk, dict):
            continue
        risk_id = str(risk.get("id") or "unknown")
        suppression = str(risk.get("suppression_file") or "").strip()
        if suppression and not _path_exists(suppression):
            issues.append(f"missing_suppression_file:{risk_id}:{suppression}")
        for evidence in risk.get("evidence") or []:
            rel = str(evidence or "").strip()
            if not rel:
                continue
            if not _path_exists(rel):
                tag = f"missing_residual_evidence:{risk_id}:{rel}"
                if allow_missing_artifacts and rel.startswith("backend/test-results/security/"):
                    warnings.append(tag)
                else:
                    issues.append(tag)

    expectations = contract.get("artifact_expectations")
    if isinstance(expectations, dict):
        for key, rel_value in expectations.items():
            rel = str(rel_value or "").strip()
            if not rel:
                issues.append(f"artifact_expectation_invalid:{key}")
                continue
            if not _path_exists(rel):
                tag = f"missing_artifact_expectation:{key}:{rel}"
                if allow_missing_artifacts:
                    warnings.append(tag)
                else:
                    issues.append(tag)

    return issues, warnings


def _dependency_check_summary(report_path: Path, threshold: float, allow_missing_artifacts: bool) -> tuple[dict[str, Any], list[str], list[str]]:
    if not report_path.exists():
        tag = f"missing_dependency_check_report:{report_path.relative_to(ROOT).as_posix()}"
        if allow_missing_artifacts:
            return {"status": "WARN", "missing": True}, [], [tag]
        return {"status": "FAIL", "missing": True}, [tag], []

    report = _load_json(report_path)
    blocking: list[str] = []
    dependencies = report.get("dependencies") or []
    for dependency in dependencies:
        if not isinstance(dependency, dict):
            continue
        file_name = str(dependency.get("fileName") or "unknown")
        for vulnerability in dependency.get("vulnerabilities") or []:
            if not isinstance(vulnerability, dict):
                continue
            severity = str(vulnerability.get("severity") or "").upper()
            cvssv3 = vulnerability.get("cvssv3")
            cvssv2 = vulnerability.get("cvssv2")
            cvss_score = cvssv3.get("baseScore") if isinstance(cvssv3, dict) else None
            if cvss_score is None:
                cvss_score = cvssv2.get("score") if isinstance(cvssv2, dict) else None
            try:
                numeric_score = float(cvss_score)
            except (TypeError, ValueError):
                numeric_score = 0.0
            if severity in {"HIGH", "CRITICAL"} or numeric_score >= threshold:
                blocking.append(f"{vulnerability.get('name') or 'unknown'}:{severity}:{file_name}")
    summary = {
        "status": "OK" if not blocking else "FAIL",
        "blocking_findings": blocking,
        "dependency_count": len(dependencies),
    }
    return summary, (["blocking_vulnerabilities_present"] if blocking else []), []


def _parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="")
    parser.add_argument("--allow-missing-artifacts", action="store_true")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = _parse_args(argv)
    if not CONTRACT_PATH.exists():
        raise SystemExit(f"missing contract: {CONTRACT_PATH}")

    contract = _load_json(CONTRACT_PATH)
    issues = _check_contract_shape(contract)
    issues.extend(_check_review_dates(contract))
    evidence_issues, warnings = _check_evidence_paths(contract, args.allow_missing_artifacts)
    issues.extend(evidence_issues)

    blocking_policy = contract.get("blocking_policy") if isinstance(contract.get("blocking_policy"), dict) else {}
    threshold = float(blocking_policy.get("dependency_check_fail_cvss") or 7.0)
    dep_report_rel = str((contract.get("artifact_expectations") or {}).get("dependency_check_report") or "")
    dep_summary, dep_issues, dep_warnings = _dependency_check_summary(ROOT / dep_report_rel, threshold, args.allow_missing_artifacts)
    issues.extend(dep_issues)
    warnings.extend(dep_warnings)

    report = {
        "kind": "security-remediation-contract-check",
        "version": "v1",
        "repo_root": str(ROOT),
        "contract_path": CONTRACT_PATH.relative_to(ROOT).as_posix(),
        "allow_missing_artifacts": bool(args.allow_missing_artifacts),
        "dependency_check": dep_summary,
        "issues": issues,
        "warnings": warnings,
        "status": "OK" if not issues else "FAIL",
    }
    if args.out:
        out_path = Path(args.out).resolve()
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, sort_keys=True))
    return 0 if report["status"] == "OK" else 2


if __name__ == "__main__":
    raise SystemExit(main())
