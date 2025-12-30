#!/usr/bin/env python3
from __future__ import annotations

import argparse
import importlib.util
import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def eprint(msg: str) -> None:
    print(msg, file=sys.stderr)


def repo_root() -> Path:
    here = Path(__file__).resolve()
    project_root = here.parent.parent
    if project_root.name == "autonomous-pipeline-v2":
        return project_root.parent
    return project_root


def safe_resolve_under(root: Path, rel_path: str) -> Path:
    p = Path(rel_path)
    if p.is_absolute():
        raise ValueError(f"absolute_path_not_allowed: {rel_path}")
    if any(part == ".." for part in p.parts):
        raise ValueError(f"path_traversal_not_allowed: {rel_path}")
    resolved = (root / p).resolve()
    resolved.relative_to(root.resolve())
    return resolved


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, obj: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def load_runner_module(repo: Path):
    runner_path = (Path(__file__).resolve().parent / "run_wf_core.py").resolve()
    runner_path.relative_to(repo.resolve())
    spec = importlib.util.spec_from_file_location("autonomous_pipeline_v2_run_wf_core", runner_path)
    if spec is None or spec.loader is None:
        raise RuntimeError("runner_module_load_failed")
    mod = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = mod
    spec.loader.exec_module(mod)  # type: ignore[union-attr]
    return mod


def resolve_run_dir(repo: Path, out_root: Path, run_arg: str) -> Path:
    if "/" in run_arg or run_arg.startswith("."):
        return safe_resolve_under(repo, run_arg)
    return (out_root / run_arg).resolve()


def append_trace(run_dir: Path, line: str) -> None:
    trace_path = run_dir / "trace.log"
    trace_path.parent.mkdir(parents=True, exist_ok=True)
    with trace_path.open("a", encoding="utf-8", errors="ignore") as f:
        f.write(f"{utc_now_iso()} {line}\n")


def main() -> int:
    ap = argparse.ArgumentParser(description="Resume a suspended run (v0)")
    ap.add_argument("--run", required=True, help="run_id UUID or run_dir path")
    ap.add_argument("--out-root", default=".autopilot-tmp/autonomous-pipeline-v2/runs")
    ap.add_argument("--approval", default="", help="Approval token string (avoid; prefer --approval-file)")
    ap.add_argument("--approval-file", default="", help="Path to a file containing approval token")
    ap.add_argument("--decision", default="approve", choices=["approve", "reject"])
    ap.add_argument("--actor-id", default="")
    ap.add_argument("--role", default="")
    args = ap.parse_args()

    repo = repo_root()
    out_root = safe_resolve_under(repo, args.out_root)
    run_dir = resolve_run_dir(repo, out_root, str(args.run))

    if not run_dir.exists():
        eprint(f"[resume] FAIL: run_dir not found: {run_dir}")
        return 2

    run_status_path = run_dir / "run_status.json"
    suspend_path = run_dir / "suspend.json"
    request_path = run_dir / "request.json"
    provenance_path = run_dir / "provenance.json"

    if not run_status_path.exists() or not suspend_path.exists() or not request_path.exists() or not provenance_path.exists():
        eprint("[resume] FAIL: missing required run artifacts (run_status/suspend/request/provenance)")
        return 2

    run_status = load_json(run_status_path)
    if run_status.get("status") != "suspended":
        eprint(f"[resume] FAIL: run is not suspended (status={run_status.get('status')})")
        return 2

    suspend = load_json(suspend_path)
    approval_cfg = suspend.get("approval") if isinstance(suspend, dict) else None
    approval_cfg = approval_cfg if isinstance(approval_cfg, dict) else {}
    expected_token_sha256 = str(approval_cfg.get("token_sha256") or "")

    token = str(args.approval or "")
    if args.approval_file:
        token_file = safe_resolve_under(repo, str(args.approval_file))
        token = token_file.read_text(encoding="utf-8", errors="ignore").strip()
    if not token:
        token_file_ref = approval_cfg.get("token_file")
        if isinstance(token_file_ref, str) and token_file_ref.strip():
            token_file = safe_resolve_under(repo, token_file_ref)
            token = token_file.read_text(encoding="utf-8", errors="ignore").strip()
    if not token:
        eprint("[resume] FAIL: missing approval token (use --approval-file or --approval)")
        return 2

    mod = load_runner_module(repo)
    token_sha256 = mod.sha256_bytes(token.encode("utf-8"))
    if expected_token_sha256 and token_sha256 != expected_token_sha256:
        eprint("[resume] FAIL: approval token mismatch")
        return 3

    run_id = str(run_status.get("run_id") or "")
    request = load_json(request_path)

    # Load the same registry/workflow/policies as provenance referenced.
    provenance = load_json(provenance_path)
    registry_ref = ((provenance.get("digests") or {}).get("registry") or {}).get("path")
    if not isinstance(registry_ref, str) or not registry_ref:
        eprint("[resume] FAIL: provenance missing registry path")
        return 2

    registry_path = safe_resolve_under(repo, registry_ref)
    registry = load_json(registry_path)
    items = registry.get("items") or []
    config_root = registry_path.parent.resolve()

    workflow_id = (request.get("workflow") or {}).get("id") or "WF-CORE"
    workflow_version = (request.get("workflow") or {}).get("version") or "v1"
    wf_item_id = f"workflow:{workflow_id}@{workflow_version}"
    wf_item = next((it for it in items if it.get("id") == wf_item_id), None)
    if not wf_item:
        eprint(f"[resume] FAIL: workflow not found in registry: {wf_item_id}")
        return 2

    wf_path = (config_root / str(wf_item.get("path"))).resolve()
    workflow = load_json(wf_path)

    pol_map: dict[str, dict[str, Any]] = {}
    for pref in workflow.get("policy_refs") or []:
        pol_item = next((it for it in items if it.get("id") == pref), None)
        if not pol_item:
            eprint(f"[resume] FAIL: policy not found in registry: {pref}")
            return 2
        pol_path = (config_root / str(pol_item.get("path"))).resolve()
        pol_map[pref] = load_json(pol_path)
    security_policy = pol_map.get("policy.security@v1") or {}

    # Persist resume decision into APPROVAL output (audit-safe).
    approval_out_path = run_dir / "node_outputs" / "APPROVAL.json"
    if approval_out_path.exists() and not (run_dir / "node_outputs" / "APPROVAL.before_resume.json").exists():
        (run_dir / "node_outputs" / "APPROVAL.before_resume.json").write_text(
            approval_out_path.read_text(encoding="utf-8", errors="ignore"), encoding="utf-8"
        )

    decision = "approved" if args.decision == "approve" else "rejected"
    approval_outputs = {
        "approved": args.decision == "approve",
        "decision": decision,
        "reason": f"manual_{decision}",
    }
    actor: dict[str, Any] = {}
    if args.actor_id:
        actor["actor_id"] = args.actor_id
    if args.role:
        actor["role"] = args.role

    run_ctx = mod.RunContext(
        run_id=run_id,
        attempt=2,
        started_at=utc_now_iso(),
        run_dir=run_dir,
        config_root=config_root,
        repo_root=repo,
    )

    approval_updated = mod.make_node_output_base(
        node_id="APPROVAL",
        node_type="approval",
        node_version="v1",
        status="success",
        run=run_ctx,
        started_at=time.time(),
        outputs=approval_outputs,
        evidence={"token_sha256": token_sha256, "actor": actor or None},
    )
    write_json(approval_out_path, approval_updated)

    # Mark suspend consumed + write resume.json
    suspend["state"] = "consumed"
    suspend["consumed_at"] = utc_now_iso()
    write_json(suspend_path, suspend)
    write_json(
        run_dir / "resume.json",
        {
            "schema_version": "resume.v1",
            "run_id": run_id,
            "decision": decision,
            "token_sha256": token_sha256,
            "actor": actor or None,
            "created_at": utc_now_iso(),
        },
    )

    append_trace(run_dir, f"resume decision={decision}")

    if args.decision != "approve":
        run_status["approval"] = {"approved": False, "decision": decision}
        run_status["status"] = "rejected"
        run_status["created_at"] = utc_now_iso()
        write_json(run_status_path, run_status)
        eprint(f"[resume] REJECT run_dir={run_dir.relative_to(repo).as_posix()}")
        return 11

    # Resume MOD-B if needed.
    mod_b_out_path = run_dir / "node_outputs" / "MOD-B.json"
    mod_b_existing = load_json(mod_b_out_path) if mod_b_out_path.exists() else {}
    if mod_b_existing.get("status") == "success":
        eprint(f"[resume] PASS (already completed) run_dir={run_dir.relative_to(repo).as_posix()}")
        return 0

    mod_a_out = load_json(run_dir / "node_outputs" / "MOD-A.json")
    analysis_summary = (mod_a_out.get("outputs") or {}).get("analysis_summary")
    inputs = request.get("inputs") or {}
    output_path = str(inputs.get("output_path") or ".autopilot-tmp/autonomous-pipeline-v2/out/analysis_summary.json")

    append_trace(run_dir, "node_start MOD-B (resume)")
    mod_b_node = next((n for n in workflow.get("nodes") or [] if n.get("id") == "MOD-B"), {}) or {}
    mod_b_caps = mod.parse_capabilities(mod_b_node.get("capabilities"))
    if not mod_b_caps.allowed_tools:
        eprint("[resume] FAIL: capabilities.allowed_tools missing for node=MOD-B")
        return 2
    mod_b_out = mod.run_mod_b(run_ctx, analysis_summary, output_path, request, security_policy, mod_b_caps)
    write_json(mod_b_out_path, mod_b_out)
    append_trace(run_dir, f"node_end MOD-B status={mod_b_out.get('status')}")

    # Update evidence pack side_effects.
    evidence_path = run_dir / "evidence.json"
    if evidence_path.exists():
        ev = load_json(evidence_path)
        ev["side_effects"] = (mod_b_out.get("side_effects") or [])
        write_json(evidence_path, ev)

    run_status["approval"] = {"approved": True, "decision": decision}
    run_status["status"] = "completed" if mod_b_out.get("status") == "success" else "failed"
    run_status["created_at"] = utc_now_iso()
    write_json(run_status_path, run_status)

    if mod_b_out.get("status") == "success":
        print(f"[resume] PASS run_dir={run_dir.relative_to(repo).as_posix()}")
        return 0
    print(f"[resume] FAIL run_dir={run_dir.relative_to(repo).as_posix()}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
