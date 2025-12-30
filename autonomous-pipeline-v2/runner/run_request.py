#!/usr/bin/env python3
from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path


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


def main() -> int:
    ap = argparse.ArgumentParser(description="Single entry: intent + request -> workflow run (v0)")
    ap.add_argument("--intent", required=True, help="Example: WF-CORE.v1")
    ap.add_argument("--request", required=True, help="Request JSON path (may omit workflow; intent fills)")
    ap.add_argument("--registry", default="autonomous-pipeline-v2/registry.v1.json")
    ap.add_argument("--executor-isolation", default="process", choices=["process", "docker"])
    ap.add_argument("--docker-image", default="python:3.11-slim")
    ap.add_argument("--out-root", default=".autopilot-tmp/autonomous-pipeline-v2/runs")
    ap.add_argument("--force", action="store_true", help="Ignore idempotency cache")
    args = ap.parse_args()

    repo = repo_root()
    runner = (Path(__file__).resolve().parent / "run_wf_core.py").resolve()
    runner.relative_to(repo.resolve())

    cmd = [
        sys.executable,
        str(runner),
        "--registry",
        args.registry,
        "--request",
        args.request,
        "--intent",
        args.intent,
        "--executor-isolation",
        args.executor_isolation,
        "--docker-image",
        args.docker_image,
        "--out-root",
        args.out_root,
    ]
    if args.force:
        cmd.append("--force")

    p = subprocess.run(cmd)
    return int(p.returncode)


if __name__ == "__main__":
    raise SystemExit(main())
