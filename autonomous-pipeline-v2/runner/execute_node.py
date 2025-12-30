#!/usr/bin/env python3
from __future__ import annotations

import argparse
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import run_wf_core as wf


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
    return wf.load_json(path)


def write_json(path: Path, obj: Any) -> None:
    return wf.write_json(path, obj)


def main() -> int:
    ap = argparse.ArgumentParser(description="Execute a single node using run_dir snapshots (v0)")
    ap.add_argument("--run-dir", required=True, help="Run directory (repo-relative)")
    ap.add_argument("--node", required=True, choices=["MOD-A", "MOD-B"])
    ap.add_argument("--attempt", type=int, default=1)
    args = ap.parse_args()

    repo = repo_root()
    run_dir = safe_resolve_under(repo, str(args.run_dir))
    if not run_dir.exists():
        eprint(f"[exec] FAIL: run_dir not found: {run_dir}")
        return 2

    run_id = run_dir.name
    run_ctx = wf.RunContext(
        run_id=run_id,
        attempt=int(args.attempt),
        started_at=utc_now_iso(),
        run_dir=run_dir,
        config_root=repo,
        repo_root=repo,
    )

    request_path = run_dir / "request.json"
    if not request_path.exists():
        eprint("[exec] FAIL: request.json missing")
        return 2
    request = load_json(request_path)

    node_outputs_dir = run_dir / "node_outputs"
    node_outputs_dir.mkdir(parents=True, exist_ok=True)

    if args.node == "MOD-A":
        inputs = request.get("inputs") or {}
        markdown_path = str(inputs.get("markdown_path") or "")
        out = wf.run_mod_a(run_ctx, markdown_path)
        write_json(node_outputs_dir / "MOD-A.json", out)
        print(f"[exec] DONE node=MOD-A status={out.get('status')}")
        return 0 if out.get("status") == "success" else 1

    # MOD-B
    sec_path = run_dir / "policies" / "security_policy.json"
    if not sec_path.exists():
        eprint("[exec] FAIL: security_policy snapshot missing")
        return 2
    security_policy = load_json(sec_path)

    cap_path = run_dir / "capabilities" / "MOD-B.json"
    if not cap_path.exists():
        eprint("[exec] FAIL: capabilities snapshot missing for node=MOD-B")
        return 2
    capabilities = wf.parse_capabilities(load_json(cap_path))
    if not capabilities.allowed_tools:
        eprint("[exec] FAIL: capabilities.allowed_tools missing for node=MOD-B")
        return 2

    mod_a_out_path = node_outputs_dir / "MOD-A.json"
    if not mod_a_out_path.exists():
        eprint("[exec] FAIL: MOD-A output missing")
        return 2
    mod_a_out = load_json(mod_a_out_path)
    analysis_summary = (mod_a_out.get("outputs") or {}).get("analysis_summary")

    inputs = request.get("inputs") or {}
    output_path = str(inputs.get("output_path") or ".autopilot-tmp/autonomous-pipeline-v2/out/analysis_summary.json")

    t0 = time.time()
    out = wf.run_mod_b(run_ctx, analysis_summary, output_path, request, security_policy, capabilities)
    write_json(node_outputs_dir / "MOD-B.json", out)
    print(f"[exec] DONE node=MOD-B status={out.get('status')} duration_ms={int((time.time()-t0)*1000)}")
    return 0 if out.get("status") == "success" else 1


if __name__ == "__main__":
    raise SystemExit(main())
