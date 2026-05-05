"""Tests for the shared contract-resolution module + active_features index.

These tests cover the Codex iter-6 REVISE blocker: `active_features.v1.json`
must be the governance source-of-truth, not a dead artefact. The resolver
priority ladder is:

    1. policy.contract_paths       -- CLI override
    2. policy.active_features_path -- governance source-of-truth
    3. policy.contract_glob        -- migration fallback
    4. policy.contract_path        -- legacy single-file

Each test bootstraps an isolated tmpdir "repo" so they do not depend on the
real repository state. Both the unit-level resolver call and the end-to-end
checker / packet-builder behaviour are exercised so the index is exercised
through every gate.
"""

from __future__ import annotations

import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
CONTRACT_DIR = REPO_ROOT / "extensions/PRJ-PM-SUITE/contract"
CHECKER = CONTRACT_DIR / "check_feature_execution_contract.py"
PACKET_BUILDER = CONTRACT_DIR / "build_delivery_session_packet.py"

# Make `contract_resolution` importable from these tests.
sys.path.insert(0, str(CONTRACT_DIR))

from contract_resolution import (  # noqa: E402  (intentional sys.path tweak)
    GovernanceError,
    resolve_active_contracts,
)


def _write_json(path: Path, obj: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def _write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def _make_minimal_contract(*, feature_id: str, change_globs, service_scopes, status="ACTIVE") -> dict:
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
            "mode": "NOT_APPLICABLE",
            "rationale": "test-rationale",
            "artifacts": [],
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


def _bootstrap_repo(
    tmp: Path,
    *,
    contracts_by_path: dict | None = None,
    active_features_index: dict | None = None,
    policy_overrides: dict | None = None,
    write_active_index_text: str | None = None,
) -> Path:
    repo = tmp
    subprocess.run(["git", "init", "-q", str(repo)], check=True)
    subprocess.run(["git", "-C", str(repo), "config", "user.email", "test@example.com"], check=True)
    subprocess.run(["git", "-C", str(repo), "config", "user.name", "test"], check=True)
    subprocess.run(["git", "-C", str(repo), "config", "commit.gpgsign", "false"], check=True)
    (repo / "README.md").write_text("init\n", encoding="utf-8")
    subprocess.run(["git", "-C", str(repo), "add", "README.md"], check=True)
    subprocess.run(["git", "-C", str(repo), "commit", "-q", "-m", "init"], check=True)

    _write_json(
        repo / "schemas/feature-execution-contract.schema.v1.json",
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
            "baseline": {"api": {"version_prefix": "/api/v1"}},
        },
    )
    _write_json(
        repo / "extensions/PRJ-UX-NORTH-STAR/contract/ux_katalogu.final_lock.v1.json",
        {
            "themes": [
                {"theme_id": "trust", "subthemes": ["least"]},
                {"theme_id": "consistency", "subthemes": ["single"]},
            ]
        },
    )
    _write_json(
        repo / "policies/policy_ui_design_system.v1.json",
        {"version": "v1", "kind": "policy-ui-design-system"},
    )

    for rel, contract in (contracts_by_path or {}).items():
        _write_json(repo / rel, contract)

    if write_active_index_text is not None:
        _write_text(
            repo / "extensions/PRJ-PM-SUITE/contract/active_features.v1.json",
            write_active_index_text,
        )
    elif active_features_index is not None:
        _write_json(
            repo / "extensions/PRJ-PM-SUITE/contract/active_features.v1.json",
            active_features_index,
        )

    policy = {
        "version": "v1",
        "kind": "policy-feature-execution-bridge",
        "status": "ACTIVE",
        "enforcement_mode": "blocking",
        "contract_path": "extensions/PRJ-PM-SUITE/contract/feature_execution_contract.v1.json",
        "contract_paths": [],
        "contract_glob": "extensions/PRJ-PM-SUITE/contract/features/*.v1.json",
        "contract_schema_path": "schemas/feature-execution-contract.schema.v1.json",
        "technical_baseline_path": "registry/technical_baseline.aistd.v1.json",
        "ux_lock_path": "extensions/PRJ-UX-NORTH-STAR/contract/ux_katalogu.final_lock.v1.json",
        "scope_detection": {
            "include_globs": ["backend/**", "web/**"],
            "exclude_globs": ["**/*.md"],
            "scope_globs": {"backend": ["backend/**"], "frontend": ["web/**"]},
        },
        "ux_scope": {"required_globs": ["web/**"], "require_ux_on_frontend_changes": True},
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
    _write_json(
        repo / "policies/policy_pm_suite.v1.json",
        {
            "version": "v1",
            "kind": "policy-pm-suite",
            "delivery_session": {
                "packet_path": ".cache/reports/delivery_session_packet.v1.json",
                "guard_report_path": ".cache/reports/delivery_session_guard.v1.json",
                "note": "test",
            },
        },
    )
    _write_json(
        repo / "ci/module_delivery_lanes.v1.json",
        {
            "lanes": {
                "unit": {"command": "echo unit"},
                "contract": {"command": "echo contract"},
                "integration": {"command": "echo integration"},
                "e2e": {"command": "echo e2e"},
            }
        },
    )
    _write_json(
        repo / "standards.lock",
        {
            "module_delivery_contract": {
                "scope_lane_map": {"backend": "unit", "frontend": "contract"}
            }
        },
    )
    return repo


def _run_checker(repo: Path, changed_files: list[str]) -> tuple[int, dict]:
    out_rel = ".cache/reports/feature_execution_contract_check.v1.json"
    proc = subprocess.run(
        [
            sys.executable,
            str(CHECKER),
            "--repo-root", str(repo),
            "--base", "HEAD",
            "--head", "HEAD",
            "--changed-files", ",".join(changed_files),
            "--out", out_rel,
        ],
        cwd=str(repo),
        capture_output=True,
        text=True,
    )
    out_path = repo / out_rel
    report = json.loads(out_path.read_text(encoding="utf-8")) if out_path.exists() else {}
    return proc.returncode, report


def _run_packet_builder(repo: Path) -> subprocess.CompletedProcess:
    return subprocess.run(
        [
            sys.executable,
            str(PACKET_BUILDER),
            "--repo-root", str(repo),
            "--out", ".cache/reports/delivery_session_packet.v1.json",
        ],
        cwd=str(repo),
        capture_output=True,
        text=True,
    )


class ResolverUnitTest(unittest.TestCase):
    """Unit-level coverage of resolve_active_contracts() priority order."""

    def setUp(self) -> None:
        self.tmp = Path(tempfile.mkdtemp(prefix="resolver-unit-"))
        self.addCleanup(lambda: shutil.rmtree(self.tmp, ignore_errors=True))

    def test_explicit_contract_paths_overrides_active_index(self) -> None:
        # Even when an active_features index lists feature-b, an explicit
        # `contract_paths` policy field wins.
        contract_a = _make_minimal_contract(
            feature_id="feature-a", change_globs=["backend/svc-a/**"], service_scopes=["backend"]
        )
        contract_b = _make_minimal_contract(
            feature_id="feature-b", change_globs=["backend/svc-b/**"], service_scopes=["backend"]
        )
        repo = _bootstrap_repo(
            self.tmp,
            contracts_by_path={
                "extensions/PRJ-PM-SUITE/contract/features/feature-a.v1.json": contract_a,
                "extensions/PRJ-PM-SUITE/contract/features/feature-b.v1.json": contract_b,
            },
            active_features_index={
                "version": "v1",
                "kind": "active-features-index",
                "active_features": [
                    {
                        "feature_id": "feature-b",
                        "contract_path": "extensions/PRJ-PM-SUITE/contract/features/feature-b.v1.json",
                        "status": "ACTIVE",
                    }
                ],
            },
            policy_overrides={
                "active_features_path": "extensions/PRJ-PM-SUITE/contract/active_features.v1.json",
                "contract_paths": [
                    "extensions/PRJ-PM-SUITE/contract/features/feature-a.v1.json"
                ],
            },
        )
        policy = json.loads(
            (repo / "policies/policy_feature_execution_bridge.v1.json").read_text()
        )
        paths, source = resolve_active_contracts(repo, policy)
        self.assertEqual(source, "contract_paths")
        self.assertEqual(
            paths,
            ["extensions/PRJ-PM-SUITE/contract/features/feature-a.v1.json"],
        )

    def test_active_index_loads_only_ACTIVE(self) -> None:
        # feature-a is ACTIVE, feature-b is DRAFT -> only feature-a returned.
        contract_a = _make_minimal_contract(
            feature_id="feature-a", change_globs=["backend/svc-a/**"], service_scopes=["backend"]
        )
        contract_b = _make_minimal_contract(
            feature_id="feature-b",
            change_globs=["backend/svc-b/**"],
            service_scopes=["backend"],
            status="DRAFT",
        )
        repo = _bootstrap_repo(
            self.tmp,
            contracts_by_path={
                "extensions/PRJ-PM-SUITE/contract/features/feature-a.v1.json": contract_a,
                "extensions/PRJ-PM-SUITE/contract/features/feature-b.v1.json": contract_b,
            },
            active_features_index={
                "version": "v1",
                "kind": "active-features-index",
                "active_features": [
                    {
                        "feature_id": "feature-a",
                        "contract_path": "extensions/PRJ-PM-SUITE/contract/features/feature-a.v1.json",
                        "status": "ACTIVE",
                    },
                    {
                        "feature_id": "feature-b",
                        "contract_path": "extensions/PRJ-PM-SUITE/contract/features/feature-b.v1.json",
                        "status": "DRAFT",
                    },
                ],
            },
            policy_overrides={
                "active_features_path": "extensions/PRJ-PM-SUITE/contract/active_features.v1.json",
            },
        )
        policy = json.loads(
            (repo / "policies/policy_feature_execution_bridge.v1.json").read_text()
        )
        paths, source = resolve_active_contracts(repo, policy)
        self.assertEqual(source, "active_features_path")
        self.assertEqual(
            paths,
            ["extensions/PRJ-PM-SUITE/contract/features/feature-a.v1.json"],
        )

    def test_glob_fallback_only_when_index_missing(self) -> None:
        # When active_features_path is absent from the policy, the resolver
        # falls back to contract_glob.
        contract_a = _make_minimal_contract(
            feature_id="feature-a", change_globs=["backend/svc-a/**"], service_scopes=["backend"]
        )
        repo = _bootstrap_repo(
            self.tmp,
            contracts_by_path={
                "extensions/PRJ-PM-SUITE/contract/features/feature-a.v1.json": contract_a,
            },
            policy_overrides={
                "contract_glob": "extensions/PRJ-PM-SUITE/contract/features/*.v1.json",
            },
        )
        policy = json.loads(
            (repo / "policies/policy_feature_execution_bridge.v1.json").read_text()
        )
        # active_features_path key absent.
        self.assertNotIn("active_features_path", policy)
        paths, source = resolve_active_contracts(repo, policy)
        self.assertEqual(source, "contract_glob")
        self.assertEqual(
            paths, ["extensions/PRJ-PM-SUITE/contract/features/feature-a.v1.json"]
        )

    def test_active_index_invalid_json_fail_closed(self) -> None:
        repo = _bootstrap_repo(
            self.tmp,
            write_active_index_text="{not valid json",
            policy_overrides={
                "active_features_path": "extensions/PRJ-PM-SUITE/contract/active_features.v1.json",
            },
        )
        policy = json.loads(
            (repo / "policies/policy_feature_execution_bridge.v1.json").read_text()
        )
        with self.assertRaises(GovernanceError) as cm:
            resolve_active_contracts(repo, policy)
        self.assertIn("invalid_json", str(cm.exception))

    def test_active_index_duplicate_feature_id_fail(self) -> None:
        contract_a = _make_minimal_contract(
            feature_id="dup", change_globs=["backend/svc-a/**"], service_scopes=["backend"]
        )
        repo = _bootstrap_repo(
            self.tmp,
            contracts_by_path={
                "extensions/PRJ-PM-SUITE/contract/features/dup.v1.json": contract_a,
            },
            active_features_index={
                "version": "v1",
                "kind": "active-features-index",
                "active_features": [
                    {
                        "feature_id": "dup",
                        "contract_path": "extensions/PRJ-PM-SUITE/contract/features/dup.v1.json",
                        "status": "ACTIVE",
                    },
                    {
                        "feature_id": "dup",
                        "contract_path": "extensions/PRJ-PM-SUITE/contract/features/dup.v1.json",
                        "status": "ACTIVE",
                    },
                ],
            },
            policy_overrides={
                "active_features_path": "extensions/PRJ-PM-SUITE/contract/active_features.v1.json",
            },
        )
        policy = json.loads(
            (repo / "policies/policy_feature_execution_bridge.v1.json").read_text()
        )
        with self.assertRaises(GovernanceError) as cm:
            resolve_active_contracts(repo, policy)
        self.assertIn("duplicate_feature_id:dup", str(cm.exception))

    def test_active_index_invalid_status_fail(self) -> None:
        contract_a = _make_minimal_contract(
            feature_id="feature-a", change_globs=["backend/svc-a/**"], service_scopes=["backend"]
        )
        repo = _bootstrap_repo(
            self.tmp,
            contracts_by_path={
                "extensions/PRJ-PM-SUITE/contract/features/feature-a.v1.json": contract_a,
            },
            active_features_index={
                "version": "v1",
                "kind": "active-features-index",
                "active_features": [
                    {
                        "feature_id": "feature-a",
                        "contract_path": "extensions/PRJ-PM-SUITE/contract/features/feature-a.v1.json",
                        "status": "UNKNOWN_STATUS",
                    }
                ],
            },
            policy_overrides={
                "active_features_path": "extensions/PRJ-PM-SUITE/contract/active_features.v1.json",
            },
        )
        policy = json.loads(
            (repo / "policies/policy_feature_execution_bridge.v1.json").read_text()
        )
        with self.assertRaises(GovernanceError) as cm:
            resolve_active_contracts(repo, policy)
        self.assertIn("invalid_status:UNKNOWN_STATUS", str(cm.exception))

    def test_active_index_path_traversal_reject(self) -> None:
        repo = _bootstrap_repo(
            self.tmp,
            active_features_index={
                "version": "v1",
                "kind": "active-features-index",
                "active_features": [
                    {
                        "feature_id": "evil",
                        "contract_path": "../../../etc/passwd",
                        "status": "ACTIVE",
                    }
                ],
            },
            policy_overrides={
                "active_features_path": "extensions/PRJ-PM-SUITE/contract/active_features.v1.json",
            },
        )
        policy = json.loads(
            (repo / "policies/policy_feature_execution_bridge.v1.json").read_text()
        )
        with self.assertRaises(GovernanceError) as cm:
            resolve_active_contracts(repo, policy)
        self.assertIn("path_traversal", str(cm.exception))

    def test_active_index_missing_active_contract_fail(self) -> None:
        # ACTIVE entry pointing to a contract that does not exist on disk.
        repo = _bootstrap_repo(
            self.tmp,
            active_features_index={
                "version": "v1",
                "kind": "active-features-index",
                "active_features": [
                    {
                        "feature_id": "ghost",
                        "contract_path": "extensions/PRJ-PM-SUITE/contract/features/ghost.v1.json",
                        "status": "ACTIVE",
                    }
                ],
            },
            policy_overrides={
                "active_features_path": "extensions/PRJ-PM-SUITE/contract/active_features.v1.json",
            },
        )
        policy = json.loads(
            (repo / "policies/policy_feature_execution_bridge.v1.json").read_text()
        )
        with self.assertRaises(GovernanceError) as cm:
            resolve_active_contracts(repo, policy)
        self.assertIn("active_contract_missing", str(cm.exception))

    def test_active_index_missing_DRAFT_contract_OK(self) -> None:
        # DRAFT entries are tolerated even when the contract does not exist
        # yet -- this lets the index track features that are mid-introduction.
        contract_a = _make_minimal_contract(
            feature_id="feature-a", change_globs=["backend/svc-a/**"], service_scopes=["backend"]
        )
        repo = _bootstrap_repo(
            self.tmp,
            contracts_by_path={
                "extensions/PRJ-PM-SUITE/contract/features/feature-a.v1.json": contract_a,
            },
            active_features_index={
                "version": "v1",
                "kind": "active-features-index",
                "active_features": [
                    {
                        "feature_id": "feature-a",
                        "contract_path": "extensions/PRJ-PM-SUITE/contract/features/feature-a.v1.json",
                        "status": "ACTIVE",
                    },
                    {
                        "feature_id": "future",
                        "contract_path": "extensions/PRJ-PM-SUITE/contract/features/future.v1.json",
                        "status": "DRAFT",
                    },
                ],
            },
            policy_overrides={
                "active_features_path": "extensions/PRJ-PM-SUITE/contract/active_features.v1.json",
            },
        )
        policy = json.loads(
            (repo / "policies/policy_feature_execution_bridge.v1.json").read_text()
        )
        paths, source = resolve_active_contracts(repo, policy)
        self.assertEqual(source, "active_features_path")
        # Only feature-a (ACTIVE) is returned; the missing DRAFT is skipped.
        self.assertEqual(
            paths,
            ["extensions/PRJ-PM-SUITE/contract/features/feature-a.v1.json"],
        )


class ResolverEndToEndTest(unittest.TestCase):
    """Run the checker / packet builder end-to-end with the index in place."""

    def setUp(self) -> None:
        self.tmp = Path(tempfile.mkdtemp(prefix="resolver-e2e-"))
        self.addCleanup(lambda: shutil.rmtree(self.tmp, ignore_errors=True))

    def test_active_index_DRAFT_ignored_even_in_glob(self) -> None:
        # The feature-b DRAFT contract is on disk and would be picked up by
        # contract_glob fallback, but with `active_features_path` set the
        # resolver MUST NOT reach the glob -- the gate stays clean and only
        # the ACTIVE feature-a is enforced.
        contract_a = _make_minimal_contract(
            feature_id="feature-a", change_globs=["backend/svc-a/**"], service_scopes=["backend"]
        )
        contract_b_draft = _make_minimal_contract(
            feature_id="feature-b",
            change_globs=["backend/svc-b/**"],
            service_scopes=["backend"],
            status="DRAFT",
        )
        # DRAFT contract has placeholder fields that would tank the gate if
        # the resolver leaked it through.
        contract_b_draft["title"] = "TBD title"
        contract_b_draft["summary"] = "TBD summary"

        repo = _bootstrap_repo(
            self.tmp,
            contracts_by_path={
                "extensions/PRJ-PM-SUITE/contract/features/feature-a.v1.json": contract_a,
                "extensions/PRJ-PM-SUITE/contract/features/feature-b.v1.json": contract_b_draft,
            },
            active_features_index={
                "version": "v1",
                "kind": "active-features-index",
                "active_features": [
                    {
                        "feature_id": "feature-a",
                        "contract_path": "extensions/PRJ-PM-SUITE/contract/features/feature-a.v1.json",
                        "status": "ACTIVE",
                    },
                    {
                        "feature_id": "feature-b",
                        "contract_path": "extensions/PRJ-PM-SUITE/contract/features/feature-b.v1.json",
                        "status": "DRAFT",
                    },
                ],
            },
            policy_overrides={
                "active_features_path": "extensions/PRJ-PM-SUITE/contract/active_features.v1.json",
            },
        )
        rc, report = _run_checker(repo, changed_files=["backend/svc-a/foo.py"])
        self.assertEqual(report["status"], "OK", msg=report)
        self.assertEqual(rc, 0)
        self.assertEqual(report["contract_resolution_source"], "active_features_path")
        # Only feature-a is enforced; feature-b's placeholders never surface.
        self.assertEqual(
            [c["feature_id"] for c in report["active_contracts"]], ["feature-a"]
        )
        self.assertFalse(
            any(e.startswith("contract_feature-b") for e in report["errors"]),
            msg="DRAFT feature-b leaked through to the gate (errors={})".format(
                report["errors"]
            ),
        )

    def test_active_index_invalid_status_surfaces_in_checker_report(self) -> None:
        # Verify the GovernanceError lands inside the checker's JSON report
        # rather than crashing the gate.
        contract_a = _make_minimal_contract(
            feature_id="feature-a", change_globs=["backend/svc-a/**"], service_scopes=["backend"]
        )
        repo = _bootstrap_repo(
            self.tmp,
            contracts_by_path={
                "extensions/PRJ-PM-SUITE/contract/features/feature-a.v1.json": contract_a,
            },
            active_features_index={
                "version": "v1",
                "kind": "active-features-index",
                "active_features": [
                    {
                        "feature_id": "feature-a",
                        "contract_path": "extensions/PRJ-PM-SUITE/contract/features/feature-a.v1.json",
                        "status": "BOGUS",
                    }
                ],
            },
            policy_overrides={
                "active_features_path": "extensions/PRJ-PM-SUITE/contract/active_features.v1.json",
            },
        )
        rc, report = _run_checker(repo, changed_files=["backend/svc-a/foo.py"])
        self.assertEqual(report["status"], "FAIL")
        self.assertTrue(
            any(
                str(e).startswith("active_features:invalid_status:BOGUS")
                for e in report["errors"]
            ),
            msg=report["errors"],
        )

    def test_packet_builder_uses_same_resolver(self) -> None:
        # Both the checker and the packet builder must select the SAME contracts
        # (Codex iter-6 REVISE: dead control-plane fix).
        contract_a = _make_minimal_contract(
            feature_id="feature-a", change_globs=["backend/svc-a/**"], service_scopes=["backend"]
        )
        contract_b_draft = _make_minimal_contract(
            feature_id="feature-b",
            change_globs=["backend/svc-b/**"],
            service_scopes=["backend"],
            status="DRAFT",
        )
        repo = _bootstrap_repo(
            self.tmp,
            contracts_by_path={
                "extensions/PRJ-PM-SUITE/contract/features/feature-a.v1.json": contract_a,
                "extensions/PRJ-PM-SUITE/contract/features/feature-b.v1.json": contract_b_draft,
            },
            active_features_index={
                "version": "v1",
                "kind": "active-features-index",
                "active_features": [
                    {
                        "feature_id": "feature-a",
                        "contract_path": "extensions/PRJ-PM-SUITE/contract/features/feature-a.v1.json",
                        "status": "ACTIVE",
                    },
                    {
                        "feature_id": "feature-b",
                        "contract_path": "extensions/PRJ-PM-SUITE/contract/features/feature-b.v1.json",
                        "status": "DRAFT",
                    },
                ],
            },
            policy_overrides={
                "active_features_path": "extensions/PRJ-PM-SUITE/contract/active_features.v1.json",
            },
        )
        # Run both gates and compare the contracts each one resolved.
        rc, report = _run_checker(repo, changed_files=["backend/svc-a/foo.py"])
        self.assertEqual(report["contract_resolution_source"], "active_features_path")
        checker_features = sorted(
            c["feature_id"] for c in report["active_contracts"]
        )

        proc = _run_packet_builder(repo)
        self.assertEqual(proc.returncode, 0, msg=proc.stdout + proc.stderr)
        packet = json.loads(
            (repo / ".cache/reports/delivery_session_packet.v1.json").read_text(encoding="utf-8")
        )
        self.assertEqual(packet["contract_resolution_source"], "active_features_path")
        packet_features = sorted(
            c["feature_id"] for c in packet["active_contracts"]
        )
        self.assertEqual(
            checker_features,
            packet_features,
            msg=f"checker={checker_features} packet={packet_features}",
        )
        self.assertEqual(checker_features, ["feature-a"])


if __name__ == "__main__":
    unittest.main()
