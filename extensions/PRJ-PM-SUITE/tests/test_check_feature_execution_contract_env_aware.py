"""ADR-0014 env-aware lane scope tests.

Validates the four-step resolution priority (CLI > env var > policy default >
baseline default), legacy backward-compat, and the contract-plan-superset
validation rule introduced for required_lanes.
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
    path.write_text(
        json.dumps(obj, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def _bootstrap(
    tmp: Path,
    *,
    baseline_lanes_by_env: dict | None = None,
    baseline_default_env: str = "pre-prod",
    baseline_legacy_lanes: list | None = None,
    policy_default_env: str | None = "pre-prod",
    contract_lanes: list | None = None,
) -> Path:
    """Create a self-contained tmp repo with stubbed policy + baseline +
    one ACTIVE feature contract scoped to backend/**.
    """
    subprocess.run(["git", "init", "-q", str(tmp)], check=True)
    subprocess.run(["git", "-C", str(tmp), "config", "user.email", "t@e.com"], check=True)
    subprocess.run(["git", "-C", str(tmp), "config", "user.name", "t"], check=True)
    subprocess.run(["git", "-C", str(tmp), "config", "commit.gpgsign", "false"], check=True)
    (tmp / "README.md").write_text("init\n", encoding="utf-8")
    subprocess.run(["git", "-C", str(tmp), "add", "README.md"], check=True)
    subprocess.run(["git", "-C", str(tmp), "commit", "-q", "-m", "init"], check=True)

    _write_json(
        tmp / "schemas/feature-execution-contract.schema.v1.json",
        {"$schema": "https://json-schema.org/draft/2020-12/schema", "type": "object"},
    )
    _write_json(
        tmp / "extensions/PRJ-UX-NORTH-STAR/contract/ux_katalogu.final_lock.v1.json",
        {"themes": []},
    )
    _write_json(
        tmp / "policies/policy_ui_design_system.v1.json",
        {"version": "v1", "kind": "policy-ui-design-system"},
    )

    ci_contract: dict = {
        "delivery_sequence": ["backend", "frontend", "integration", "e2e"],
        "default_env": baseline_default_env,
    }
    if baseline_lanes_by_env is not None:
        ci_contract["required_lanes_by_env"] = baseline_lanes_by_env
    if baseline_legacy_lanes is not None:
        ci_contract["required_lanes"] = baseline_legacy_lanes

    _write_json(
        tmp / "registry/technical_baseline.aistd.v1.json",
        {"profile_id": "test", "ci_contract": ci_contract},
    )

    contract = {
        "version": "v1",
        "kind": "feature-execution-contract",
        "status": "ACTIVE",
        "feature_id": "test-feature",
        "title": "test",
        "summary": "test summary",
        "source_context": {
            "source_type": "manual",
            "source_refs": ["docs/x.md"],
            "business_goal": "g",
            "requested_outcome": "o",
        },
        "delivery_scope": {
            "repo_root": ".",
            "service_scopes": ["backend"],
            "change_path_globs": ["backend/**"],
            "affected_modules": ["backend/svc"],
        },
        "ux_contract": {"mode": "NOT_APPLICABLE", "rationale": "n/a", "artifacts": []},
        "technical_contract": {
            "baseline_profile_id": "test",
            "api_version_prefix": "/api/v1",
            "design_system_policy": "policies/policy_ui_design_system.v1.json",
            "db_migration_required": False,
        },
        "lane_plan": {
            "execution_sequence": ["backend", "frontend", "integration", "e2e"],
            "required_lanes": contract_lanes
            or ["unit", "contract", "integration", "e2e"],
            "notes": ["test"],
        },
        "definition_of_done": {
            "acceptance_criteria": ["test"],
            "evidence_paths": [".cache/reports/feature_execution_contract_check.v1.json"],
        },
        "notes": [],
    }
    _write_json(tmp / "extensions/PRJ-PM-SUITE/contract/features/test-feature.v1.json", contract)
    _write_json(
        tmp / "extensions/PRJ-PM-SUITE/contract/active_features.v1.json",
        {
            "version": "v1",
            "kind": "active-features-index",
            "active_features": [
                {
                    "feature_id": "test-feature",
                    "contract_path": "extensions/PRJ-PM-SUITE/contract/features/test-feature.v1.json",
                    "status": "ACTIVE",
                }
            ],
            "notes": [],
        },
    )

    policy = {
        "version": "v1",
        "kind": "policy-feature-execution-bridge",
        "status": "ACTIVE",
        "enforcement_mode": "blocking",
        "active_features_path": "extensions/PRJ-PM-SUITE/contract/active_features.v1.json",
        "contract_path": "extensions/PRJ-PM-SUITE/contract/features/test-feature.v1.json",
        "contract_paths": [],
        "contract_glob": "extensions/PRJ-PM-SUITE/contract/features/*.v1.json",
        "contract_schema_path": "schemas/feature-execution-contract.schema.v1.json",
        "technical_baseline_path": "registry/technical_baseline.aistd.v1.json",
        "ux_lock_path": "extensions/PRJ-UX-NORTH-STAR/contract/ux_katalogu.final_lock.v1.json",
        "scope_detection": {
            "include_globs": ["backend/**"],
            "exclude_globs": [],
            "scope_globs": {"backend": ["backend/**"]},
        },
        "ux_scope": {"required_globs": [], "require_ux_on_frontend_changes": False},
        "validation": {
            "active_status_on_scoped_change": True,
            "required_source_refs_min": 1,
            "placeholder_tokens": ["TBD"],
            "required_execution_sequence_from_lock": False,
            "required_lanes_from_lock": True,
        },
        "fail_action": "warn",
    }
    if policy_default_env is not None:
        policy["default_lane_env"] = policy_default_env
    _write_json(tmp / "policies/policy_feature_execution_bridge.v1.json", policy)

    # Touch a backend file post-init so the diff actually picks up a scoped
    # change. We add a second commit so HEAD~1 -> HEAD has a real diff.
    backend_file = tmp / "backend/svc/Dummy.java"
    backend_file.parent.mkdir(parents=True, exist_ok=True)
    backend_file.write_text("// dummy\n", encoding="utf-8")
    subprocess.run(["git", "-C", str(tmp), "add", "backend/svc/Dummy.java"], check=True)
    subprocess.run(["git", "-C", str(tmp), "commit", "-q", "-m", "scoped-change"], check=True)

    return tmp


def _run_checker(repo: Path, *, env_flag: str | None = None, env_var: str | None = None) -> dict:
    """Invoke the checker as subprocess; returns parsed stdout JSON."""
    out_path = repo / ".cache/reports/check.json"
    cmd = [
        sys.executable,
        str(CHECKER),
        "--repo-root",
        str(repo),
        "--policy-path",
        "policies/policy_feature_execution_bridge.v1.json",
        "--base",
        "HEAD~1",
        "--head",
        "HEAD",
        "--out",
        str(out_path),
    ]
    if env_flag is not None:
        cmd += ["--env", env_flag]
    proc_env = os.environ.copy()
    proc_env.pop("DELIVERY_LANE_ENV", None)
    if env_var is not None:
        proc_env["DELIVERY_LANE_ENV"] = env_var
    res = subprocess.run(
        cmd, cwd=str(repo), env=proc_env, capture_output=True, text=True, check=False
    )
    summary = json.loads(res.stdout.strip().splitlines()[-1]) if res.stdout.strip() else {}
    full = json.loads(out_path.read_text(encoding="utf-8")) if out_path.exists() else {}
    return {"summary": summary, "report": full, "exit_code": res.returncode, "stderr": res.stderr}


class EnvResolutionPriorityTests(unittest.TestCase):
    """ADR-0014 §Implementation: priority chain CLI > env var > policy > baseline."""

    def setUp(self) -> None:
        self.tmp = Path(tempfile.mkdtemp(prefix="check-env-"))

    def tearDown(self) -> None:
        shutil.rmtree(self.tmp, ignore_errors=True)

    def test_cli_flag_takes_priority_over_env_var(self) -> None:
        _bootstrap(
            self.tmp,
            baseline_lanes_by_env={
                "pre-prod": ["unit", "contract"],
                "prod": ["unit", "contract", "integration", "e2e"],
            },
        )
        result = _run_checker(self.tmp, env_flag="prod", env_var="pre-prod")
        self.assertEqual(result["summary"]["effective_lane_env"], "prod")
        self.assertEqual(
            result["summary"]["expected_required_lanes"],
            ["unit", "contract", "integration", "e2e"],
        )

    def test_env_var_used_when_cli_flag_absent(self) -> None:
        _bootstrap(
            self.tmp,
            baseline_lanes_by_env={
                "pre-prod": ["unit", "contract"],
                "prod": ["unit", "contract", "integration", "e2e"],
            },
        )
        result = _run_checker(self.tmp, env_var="prod")
        self.assertEqual(result["summary"]["effective_lane_env"], "prod")

    def test_policy_default_used_when_cli_and_env_absent(self) -> None:
        _bootstrap(
            self.tmp,
            baseline_lanes_by_env={
                "pre-prod": ["unit", "contract"],
                "prod": ["unit", "contract", "integration", "e2e"],
            },
            policy_default_env="prod",
            baseline_default_env="pre-prod",
        )
        result = _run_checker(self.tmp)
        self.assertEqual(result["summary"]["effective_lane_env"], "prod")

    def test_baseline_default_used_when_policy_default_missing(self) -> None:
        _bootstrap(
            self.tmp,
            baseline_lanes_by_env={
                "pre-prod": ["unit", "contract"],
                "prod": ["unit", "contract", "integration", "e2e"],
            },
            policy_default_env=None,
            baseline_default_env="prod",
        )
        result = _run_checker(self.tmp)
        self.assertEqual(result["summary"]["effective_lane_env"], "prod")


class LegacyBackwardCompatTests(unittest.TestCase):
    """When required_lanes_by_env absent, legacy required_lanes still drives the gate."""

    def setUp(self) -> None:
        self.tmp = Path(tempfile.mkdtemp(prefix="check-legacy-"))

    def tearDown(self) -> None:
        shutil.rmtree(self.tmp, ignore_errors=True)

    def test_legacy_required_lanes_only_resolves_to_legacy_source(self) -> None:
        _bootstrap(
            self.tmp,
            baseline_lanes_by_env=None,
            baseline_legacy_lanes=["unit", "contract", "integration", "e2e"],
            contract_lanes=["unit", "contract", "integration", "e2e"],
        )
        result = _run_checker(self.tmp)
        self.assertEqual(result["summary"]["lane_resolution_source"], "legacy")
        self.assertEqual(
            result["summary"]["expected_required_lanes"],
            ["unit", "contract", "integration", "e2e"],
        )

    def test_by_env_takes_priority_over_legacy_when_both_present(self) -> None:
        _bootstrap(
            self.tmp,
            baseline_lanes_by_env={
                "pre-prod": ["unit", "contract"],
                "prod": ["unit", "contract", "integration", "e2e"],
            },
            baseline_legacy_lanes=["unit", "contract", "integration", "e2e"],
        )
        result = _run_checker(self.tmp, env_flag="pre-prod")
        self.assertEqual(result["summary"]["lane_resolution_source"], "by_env")
        self.assertEqual(result["summary"]["expected_required_lanes"], ["unit", "contract"])


class ContractSupersetValidationTests(unittest.TestCase):
    """ADR-0014: feature contract.required_lanes must be a SUPERSET of the
    env's effective required lanes (not strict equality).
    """

    def setUp(self) -> None:
        self.tmp = Path(tempfile.mkdtemp(prefix="check-superset-"))

    def tearDown(self) -> None:
        shutil.rmtree(self.tmp, ignore_errors=True)

    def test_pre_prod_subset_passes_with_full_contract_plan(self) -> None:
        # Contract plan = full lane set (production-grade)
        # Env required = {unit, contract} (pre-prod subset)
        # Should PASS (no required_lanes_missing error).
        _bootstrap(
            self.tmp,
            baseline_lanes_by_env={
                "pre-prod": ["unit", "contract"],
                "prod": ["unit", "contract", "integration", "e2e"],
            },
            contract_lanes=["unit", "database", "api", "contract", "integration", "e2e"],
        )
        result = _run_checker(self.tmp, env_flag="pre-prod")
        contract_errors = [
            e for e in result["report"].get("errors", []) if "required_lanes" in e
        ]
        self.assertEqual(contract_errors, [])

    def test_missing_required_lane_fails(self) -> None:
        # Contract plan missing "contract" lane while pre-prod requires it.
        _bootstrap(
            self.tmp,
            baseline_lanes_by_env={
                "pre-prod": ["unit", "contract"],
                "prod": ["unit", "contract", "integration", "e2e"],
            },
            contract_lanes=["unit", "integration", "e2e"],
        )
        result = _run_checker(self.tmp, env_flag="pre-prod")
        missing_errors = [
            e for e in result["report"].get("errors", []) if "required_lanes_missing" in e
        ]
        self.assertEqual(len(missing_errors), 1)
        self.assertIn("contract", missing_errors[0])

    def test_prod_full_set_passes_with_full_plan(self) -> None:
        _bootstrap(
            self.tmp,
            baseline_lanes_by_env={
                "pre-prod": ["unit", "contract"],
                "prod": ["unit", "contract", "integration", "e2e"],
            },
            contract_lanes=["unit", "database", "api", "contract", "integration", "e2e"],
        )
        result = _run_checker(self.tmp, env_flag="prod")
        contract_errors = [
            e for e in result["report"].get("errors", []) if "required_lanes" in e
        ]
        self.assertEqual(contract_errors, [])


class CutoverSentinelTests(unittest.TestCase):
    """ADR-0014: pre-prod required lanes must be a strict subset of prod
    (cutover widens the gate, never narrows it).
    """

    def test_pre_prod_is_subset_of_prod(self) -> None:
        baseline_path = REPO_ROOT / "registry/technical_baseline.aistd.v1.json"
        if not baseline_path.exists():
            self.skipTest("baseline file not present in this checkout")
        baseline = json.loads(baseline_path.read_text(encoding="utf-8"))
        ci = baseline.get("ci_contract", {})
        by_env = ci.get("required_lanes_by_env", {})
        pre = set(by_env.get("pre-prod", []))
        prod = set(by_env.get("prod", []))
        if not pre or not prod:
            self.skipTest("required_lanes_by_env not yet seeded in baseline")
        self.assertTrue(
            pre.issubset(prod),
            f"pre-prod lanes {sorted(pre)} not subset of prod {sorted(prod)}",
        )


if __name__ == "__main__":
    unittest.main()
