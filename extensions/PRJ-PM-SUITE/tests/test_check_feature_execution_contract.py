"""Tests for the multi-file feature-execution-contract checker.

These tests stub a self-contained "repo_root" tmpdir so they don't depend on the
real repository state. They focus on the C-prime multi-file resolution paths:

- contract_paths (explicit list)
- contract_glob (expand)
- contract_path (single, backward-compat)

Plus the union-coverage and contract-id error-prefix semantics.
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
CHECKER = REPO_ROOT / "extensions/PRJ-PM-SUITE/contract/check_feature_execution_contract.py"


def _write_json(path: Path, obj: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def _make_minimal_contract(*, feature_id: str, change_globs, service_scopes, ux_artifacts=None, status="ACTIVE") -> dict:
    return {
        "version": "v1",
        "kind": "feature-execution-contract",
        "status": status,
        "feature_id": feature_id,
        "title": f"{feature_id} title",
        "summary": f"{feature_id} summary",
        "source_context": {
            "source_type": "manual",
            "source_refs": ["docs/test-source.md"],
            "business_goal": f"{feature_id} goal",
            "requested_outcome": f"{feature_id} outcome",
        },
        "delivery_scope": {
            "repo_root": ".",
            "service_scopes": list(service_scopes),
            "change_path_globs": list(change_globs),
            "affected_modules": [],
        },
        "ux_contract": {
            "mode": "REQUIRED" if ux_artifacts else "NOT_APPLICABLE",
            "rationale": "test-rationale",
            "artifacts": list(ux_artifacts or []),
        },
        "technical_contract": {
            "baseline_profile_id": "test-baseline",
            "api_version_prefix": "/api/v1",
            "design_system_policy": "policies/policy_ui_design_system.v1.json",
            "db_migration_required": False,
        },
        "lane_plan": {
            "execution_sequence": ["backend", "frontend", "integration", "e2e"],
            "required_lanes": ["unit", "contract", "integration", "e2e"],
            "notes": ["test"],
        },
        "definition_of_done": {
            "acceptance_criteria": ["test acceptance"],
            "evidence_paths": [".cache/reports/feature_execution_contract_check.v1.json"],
        },
        "notes": [],
    }


def _bootstrap_repo(tmpdir: Path, *, contracts_by_path: dict, policy_overrides=None) -> Path:
    repo = tmpdir
    # Initialise an empty git history so the checker's diff path works.
    subprocess.run(["git", "init", "-q", str(repo)], check=True)
    subprocess.run(["git", "-C", str(repo), "config", "user.email", "test@example.com"], check=True)
    subprocess.run(["git", "-C", str(repo), "config", "user.name", "test"], check=True)
    subprocess.run(["git", "-C", str(repo), "config", "commit.gpgsign", "false"], check=True)

    # Empty seed commit -- the checker uses --base/--head explicitly so even an
    # empty diff path is fine for these unit tests.
    (repo / "README.md").write_text("init\n", encoding="utf-8")
    subprocess.run(["git", "-C", str(repo), "add", "README.md"], check=True)
    subprocess.run(
        ["git", "-C", str(repo), "commit", "-q", "-m", "init"],
        check=True,
    )

    # Schemas, baseline and ux lock are referenced by the policy. Stub each.
    schema_dir = repo / "schemas"
    _write_json(
        schema_dir / "feature-execution-contract.schema.v1.json",
        {"$schema": "https://json-schema.org/draft/2020-12/schema", "type": "object"},
    )
    _write_json(
        repo / "registry/technical_baseline.aistd.v1.json",
        {
            "profile_id": "test-baseline",
            "ci_contract": {
                "delivery_sequence": ["backend", "frontend", "integration", "e2e"],
                "required_lanes": ["unit", "contract", "integration", "e2e"],
            },
        },
    )
    _write_json(
        repo / "extensions/PRJ-UX-NORTH-STAR/contract/ux_katalogu.final_lock.v1.json",
        {
            "themes": [
                {
                    "theme_id": "trust_privacy_security_ux",
                    "subthemes": ["least_privilege_interaction_design"],
                },
                {
                    "theme_id": "consistency_and_pattern_governance",
                    "subthemes": ["single_component_source_of_truth"],
                },
            ]
        },
    )
    _write_json(
        repo / "policies/policy_ui_design_system.v1.json",
        {"version": "v1", "kind": "policy-ui-design-system"},
    )

    # Write contracts.
    for rel, contract in contracts_by_path.items():
        _write_json(repo / rel, contract)

    # Default policy. Tests can override.
    policy = {
        "version": "v1",
        "kind": "policy-feature-execution-bridge",
        "status": "ACTIVE",
        "enforcement_mode": "blocking",
        "contract_path": "extensions/PRJ-PM-SUITE/contract/feature_execution_contract.v1.json",
        "contract_paths": [],
        "contract_glob": "extensions/PRJ-PM-SUITE/contract/features/*.v1.json",
        "active_features_path": "extensions/PRJ-PM-SUITE/contract/active_features.v1.json",
        "contract_schema_path": "schemas/feature-execution-contract.schema.v1.json",
        "technical_baseline_path": "registry/technical_baseline.aistd.v1.json",
        "ux_lock_path": "extensions/PRJ-UX-NORTH-STAR/contract/ux_katalogu.final_lock.v1.json",
        "scope_detection": {
            "include_globs": ["backend/**", "web/**"],
            "exclude_globs": ["**/*.md"],
            "scope_globs": {
                "backend": ["backend/**"],
                "frontend": ["web/**"],
            },
        },
        "ux_scope": {
            "required_globs": ["web/**"],
            "require_ux_on_frontend_changes": True,
        },
        "validation": {
            "active_status_on_scoped_change": True,
            "required_source_refs_min": 1,
            "placeholder_tokens": ["TBD", "REPLACE_ME", "TODO"],
            "required_execution_sequence_from_lock": True,
            "required_lanes_from_lock": True,
        },
        "reporting": {"out_path": ".cache/reports/feature_execution_contract_check.v1.json"},
        "fail_action": "warn",
    }
    if policy_overrides:
        policy.update(policy_overrides)
    _write_json(repo / "policies/policy_feature_execution_bridge.v1.json", policy)

    return repo


def _run_checker(repo: Path, changed_files: list[str]) -> tuple[int, dict, str]:
    out_rel = ".cache/reports/feature_execution_contract_check.v1.json"
    proc = subprocess.run(
        [
            sys.executable,
            str(CHECKER),
            "--repo-root",
            str(repo),
            "--base",
            "HEAD",
            "--head",
            "HEAD",
            "--changed-files",
            ",".join(changed_files),
            "--out",
            out_rel,
        ],
        cwd=str(repo),
        capture_output=True,
        text=True,
    )
    report = json.loads((repo / out_rel).read_text(encoding="utf-8"))
    return proc.returncode, report, proc.stdout + "\n" + proc.stderr


class MultiContractResolutionTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = Path(tempfile.mkdtemp(prefix="fec-test-"))
        self.addCleanup(lambda: shutil.rmtree(self.tmp, ignore_errors=True))

    def test_contract_glob_loads_multiple_features(self) -> None:
        contract_a = _make_minimal_contract(
            feature_id="feature-a",
            change_globs=["backend/svc-a/**"],
            service_scopes=["backend"],
        )
        contract_b = _make_minimal_contract(
            feature_id="feature-b",
            change_globs=["backend/svc-b/**"],
            service_scopes=["backend"],
        )
        # Legacy file still present (backward-compat).
        legacy = _make_minimal_contract(
            feature_id="legacy-feature",
            change_globs=["backend/legacy/**"],
            service_scopes=["backend"],
        )
        repo = _bootstrap_repo(
            self.tmp,
            contracts_by_path={
                "extensions/PRJ-PM-SUITE/contract/feature_execution_contract.v1.json": legacy,
                "extensions/PRJ-PM-SUITE/contract/features/feature-a.v1.json": contract_a,
                "extensions/PRJ-PM-SUITE/contract/features/feature-b.v1.json": contract_b,
            },
        )

        # Change touches feature-a's scope only -- should be covered by union.
        rc, report, _ = _run_checker(repo, changed_files=["backend/svc-a/foo.py"])
        self.assertEqual(report["status"], "OK", msg=report)
        self.assertEqual(rc, 0)
        self.assertEqual(report["contract_resolution_source"], "contract_glob")
        self.assertEqual(len(report["active_contracts"]), 2)
        feature_ids = {c["feature_id"] for c in report["active_contracts"]}
        self.assertEqual(feature_ids, {"feature-a", "feature-b"})

    def test_explicit_contract_paths_takes_priority(self) -> None:
        contract_a = _make_minimal_contract(
            feature_id="feature-a",
            change_globs=["backend/svc-a/**"],
            service_scopes=["backend"],
        )
        contract_b = _make_minimal_contract(
            feature_id="feature-b",
            change_globs=["backend/svc-b/**"],
            service_scopes=["backend"],
        )
        repo = _bootstrap_repo(
            self.tmp,
            contracts_by_path={
                "extensions/PRJ-PM-SUITE/contract/features/feature-a.v1.json": contract_a,
                "extensions/PRJ-PM-SUITE/contract/features/feature-b.v1.json": contract_b,
                # legacy contract present but should be ignored when contract_paths set.
                "extensions/PRJ-PM-SUITE/contract/feature_execution_contract.v1.json": _make_minimal_contract(
                    feature_id="legacy-skip",
                    change_globs=["backend/skip/**"],
                    service_scopes=["backend"],
                ),
            },
            policy_overrides={
                "contract_paths": [
                    "extensions/PRJ-PM-SUITE/contract/features/feature-a.v1.json",
                ],
                # set glob too -- explicit list must take priority
                "contract_glob": "extensions/PRJ-PM-SUITE/contract/features/*.v1.json",
            },
        )
        rc, report, _ = _run_checker(repo, changed_files=["backend/svc-a/foo.py"])
        self.assertEqual(report["contract_resolution_source"], "contract_paths")
        self.assertEqual([c["feature_id"] for c in report["active_contracts"]], ["feature-a"])
        self.assertEqual(rc, 0)

    def test_uncovered_change_yields_union_error(self) -> None:
        contract_a = _make_minimal_contract(
            feature_id="feature-a",
            change_globs=["backend/svc-a/**"],
            service_scopes=["backend"],
        )
        repo = _bootstrap_repo(
            self.tmp,
            contracts_by_path={
                "extensions/PRJ-PM-SUITE/contract/features/feature-a.v1.json": contract_a,
            },
        )
        # Change targets a path no contract covers.
        rc, report, _ = _run_checker(repo, changed_files=["backend/svc-c/foo.py"])
        self.assertEqual(report["status"], "FAIL")
        # The uncovered_change error is emitted at union level (no contract_<id> prefix).
        self.assertTrue(any(e.startswith("delivery_scope:uncovered_change:") for e in report["errors"]))

    def test_legacy_contract_path_only_still_works(self) -> None:
        legacy = _make_minimal_contract(
            feature_id="legacy",
            change_globs=["backend/legacy/**"],
            service_scopes=["backend"],
        )
        repo = _bootstrap_repo(
            self.tmp,
            contracts_by_path={
                "extensions/PRJ-PM-SUITE/contract/feature_execution_contract.v1.json": legacy,
            },
            policy_overrides={
                "contract_glob": "",  # disable glob fallback
                "contract_paths": [],
            },
        )
        rc, report, _ = _run_checker(repo, changed_files=["backend/legacy/foo.py"])
        self.assertEqual(report["contract_resolution_source"], "contract_path")
        self.assertEqual([c["feature_id"] for c in report["active_contracts"]], ["legacy"])
        self.assertEqual(rc, 0)

    def test_contract_error_uses_id_prefix(self) -> None:
        contract_a = _make_minimal_contract(
            feature_id="feature-a",
            change_globs=["backend/svc-a/**"],
            service_scopes=["backend"],
        )
        # break the contract's technical_contract.api_version_prefix
        contract_a["technical_contract"]["api_version_prefix"] = "/api/v2"
        repo = _bootstrap_repo(
            self.tmp,
            contracts_by_path={
                "extensions/PRJ-PM-SUITE/contract/features/feature-a.v1.json": contract_a,
            },
        )
        rc, report, _ = _run_checker(repo, changed_files=["backend/svc-a/foo.py"])
        self.assertEqual(report["status"], "FAIL")
        self.assertTrue(
            any(
                e.startswith("contract_feature-a:technical_contract:api_version_prefix_invalid")
                for e in report["errors"]
            ),
            msg=report["errors"],
        )


if __name__ == "__main__":
    unittest.main()
