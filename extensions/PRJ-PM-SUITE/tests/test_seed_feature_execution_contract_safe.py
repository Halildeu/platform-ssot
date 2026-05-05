"""Tests for the hardened seed_feature_execution_contract.py.

Focus: --target-file allow-list + overwrite refusal + active_features.v1.json
append-safe behaviour. Each test runs in an isolated tmpdir-based "repo" so it
does not depend on the real repository state.
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
SEED = REPO_ROOT / "extensions/PRJ-PM-SUITE/contract/seed_feature_execution_contract.py"


def _write_json(path: Path, obj: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def _bootstrap_repo(tmp: Path) -> Path:
    repo = tmp
    # Minimal template, policy, baseline -- all required by the seeder.
    _write_json(
        repo / "extensions/PRJ-PM-SUITE/contract/feature_execution_contract.v1.json",
        {
            "version": "v1",
            "kind": "feature-execution-contract",
            "status": "DRAFT",
            "feature_id": "template",
            "title": "tpl",
            "summary": "tpl",
            "source_context": {
                "source_type": "manual",
                "source_refs": ["tpl"],
                "business_goal": "tpl",
                "requested_outcome": "tpl",
            },
            "delivery_scope": {
                "repo_root": ".",
                "service_scopes": ["frontend"],
                "change_path_globs": ["web/**"],
                "affected_modules": [],
            },
            "ux_contract": {"mode": "NOT_APPLICABLE", "rationale": "tpl", "artifacts": []},
            "technical_contract": {
                "baseline_profile_id": "tpl",
                "api_version_prefix": "/api/v1",
                "design_system_policy": "policies/policy_ui_design_system.v1.json",
                "db_migration_required": False,
            },
            "lane_plan": {
                "execution_sequence": ["backend", "frontend"],
                "required_lanes": ["unit"],
                "notes": [],
            },
            "definition_of_done": {
                "acceptance_criteria": ["tpl"],
                "evidence_paths": [".cache/reports/feature_execution_contract_check.v1.json"],
            },
            "notes": [],
        },
    )
    _write_json(
        repo / "policies/policy_feature_execution_bridge.v1.json",
        {
            "version": "v1",
            "kind": "policy-feature-execution-bridge",
            "status": "ACTIVE",
            "scope_detection": {
                "include_globs": ["backend/**", "web/**"],
                "exclude_globs": [],
                "scope_globs": {
                    "backend": ["backend/**"],
                    "frontend": ["web/**"],
                },
            },
        },
    )
    _write_json(
        repo / "registry/technical_baseline.aistd.v1.json",
        {
            "profile_id": "test-baseline",
            "ci_contract": {
                "delivery_sequence": ["backend"],
                "required_lanes": ["unit"],
            },
            "baseline": {"api": {"version_prefix": "/api/v1"}},
        },
    )
    return repo


def _run_seed(repo: Path, *args: str) -> subprocess.CompletedProcess:
    cmd = [sys.executable, str(SEED), "--repo-root", str(repo)] + list(args)
    return subprocess.run(cmd, cwd=str(repo), capture_output=True, text=True)


class SeedSafetyTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = Path(tempfile.mkdtemp(prefix="seed-test-"))
        self.addCleanup(lambda: shutil.rmtree(self.tmp, ignore_errors=True))
        self.repo = _bootstrap_repo(self.tmp)

    def _required_args(self, *, fid: str = "feat-x", target: str | None = None) -> list[str]:
        return [
            "--feature-id", fid,
            "--title", "T",
            "--summary", "S",
            "--business-goal", "G",
            "--requested-outcome", "O",
            "--target-file", target or f"extensions/PRJ-PM-SUITE/contract/features/{fid}.v1.json",
        ]

    def test_target_file_traversal_rejected(self) -> None:
        # Absolute path & ../ both rejected by the allow-list regex.
        for bad in [
            "/etc/passwd",
            "../../etc/passwd",
            "extensions/PRJ-PM-SUITE/contract/../evil.json",
            "extensions/other/contract/feat.v1.json",
            "extensions/PRJ-PM-SUITE/contract/features/bad name.v1.json",
        ]:
            proc = _run_seed(self.repo, *self._required_args(target=bad))
            self.assertNotEqual(proc.returncode, 0, msg=f"path {bad} should be rejected; stdout={proc.stdout}")
            self.assertIn("--target-file", proc.stderr + proc.stdout)

    def test_legacy_contract_path_allowed(self) -> None:
        # The legacy single-file path is in the allow-list regex. The default
        # bootstrap template uses feature_id="template", so a write with a
        # different feature_id must be refused even on legacy target -- this
        # test rewrites the template with the same id and --allow-overwrite to
        # show the legacy path itself does not get rejected by the regex.
        proc = _run_seed(
            self.repo,
            *self._required_args(
                fid="template",
                target="extensions/PRJ-PM-SUITE/contract/feature_execution_contract.v1.json",
            ),
            "--allow-overwrite",
        )
        self.assertEqual(proc.returncode, 0, msg=proc.stdout + proc.stderr)
        # Active index NOT updated for legacy target.
        idx_path = self.repo / "extensions/PRJ-PM-SUITE/contract/active_features.v1.json"
        self.assertFalse(idx_path.exists(), msg="legacy target must not create the active index")

    def test_overwrite_with_different_feature_id_refused(self) -> None:
        target = "extensions/PRJ-PM-SUITE/contract/features/feat-a.v1.json"
        # First seed creates it.
        proc1 = _run_seed(self.repo, *self._required_args(fid="feat-a", target=target))
        self.assertEqual(proc1.returncode, 0, msg=proc1.stdout + proc1.stderr)
        # Second attempt with different feature_id but same target must fail.
        proc2 = _run_seed(self.repo, *self._required_args(fid="feat-b", target=target), "--allow-overwrite")
        self.assertNotEqual(proc2.returncode, 0)
        self.assertIn("refusing to overwrite", proc2.stderr + proc2.stdout)

    def test_overwrite_same_id_requires_explicit_flag(self) -> None:
        target = "extensions/PRJ-PM-SUITE/contract/features/feat-a.v1.json"
        proc1 = _run_seed(self.repo, *self._required_args(fid="feat-a", target=target))
        self.assertEqual(proc1.returncode, 0, msg=proc1.stdout + proc1.stderr)
        # Without --allow-overwrite, refuses.
        proc2 = _run_seed(self.repo, *self._required_args(fid="feat-a", target=target))
        self.assertNotEqual(proc2.returncode, 0)
        # With --allow-overwrite, succeeds.
        proc3 = _run_seed(self.repo, *self._required_args(fid="feat-a", target=target), "--allow-overwrite")
        self.assertEqual(proc3.returncode, 0, msg=proc3.stdout + proc3.stderr)

    def test_active_features_index_appended(self) -> None:
        target_a = "extensions/PRJ-PM-SUITE/contract/features/feat-a.v1.json"
        target_b = "extensions/PRJ-PM-SUITE/contract/features/feat-b.v1.json"
        _run_seed(self.repo, *self._required_args(fid="feat-a", target=target_a))
        _run_seed(self.repo, *self._required_args(fid="feat-b", target=target_b))
        idx_path = self.repo / "extensions/PRJ-PM-SUITE/contract/active_features.v1.json"
        self.assertTrue(idx_path.exists())
        idx = json.loads(idx_path.read_text(encoding="utf-8"))
        ids = sorted(item["feature_id"] for item in idx["active_features"])
        self.assertEqual(ids, ["feat-a", "feat-b"])

    def test_active_features_index_is_updated_not_duplicated(self) -> None:
        target = "extensions/PRJ-PM-SUITE/contract/features/feat-a.v1.json"
        _run_seed(self.repo, *self._required_args(fid="feat-a", target=target))
        # Re-seed same feature_id with --allow-overwrite -- index should still
        # contain a single entry for that feature.
        _run_seed(self.repo, *self._required_args(fid="feat-a", target=target), "--allow-overwrite")
        idx_path = self.repo / "extensions/PRJ-PM-SUITE/contract/active_features.v1.json"
        idx = json.loads(idx_path.read_text(encoding="utf-8"))
        feat_a_entries = [item for item in idx["active_features"] if item["feature_id"] == "feat-a"]
        self.assertEqual(len(feat_a_entries), 1, msg=idx)


if __name__ == "__main__":
    unittest.main()
