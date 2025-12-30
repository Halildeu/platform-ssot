#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import shlex
import subprocess
import sys
from pathlib import Path
from typing import Any


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


def run_cmd(argv: list[str], *, gate: str) -> int:
    cmd = shlex.join(argv)
    print(f"[deploy-gate] RUN gate={gate} cmd={cmd}")
    proc = subprocess.run(argv)
    return int(proc.returncode or 0)


def main() -> int:
    ap = argparse.ArgumentParser(description="Deploy gate v0: registry integrity + signing checks")
    ap.add_argument("--registry", default="autonomous-pipeline-v2/registry.v1.json")
    ap.add_argument("--scope", default="prod", help="Example: prod|staging|dev")
    ap.add_argument("--public-key", action="append", default=[], help="PEM public key path for signature verify (may repeat)")
    args = ap.parse_args()

    repo = repo_root()
    registry_path = safe_resolve_under(repo, str(args.registry))
    if not registry_path.exists():
        fallback = "registry.v1.json"
        alt = str(args.registry).removeprefix("autonomous-pipeline-v2/")
        for cand in [alt, fallback]:
            if not cand or cand == str(args.registry):
                continue
            p2 = safe_resolve_under(repo, cand)
            if p2.exists():
                registry_path = p2
                break
    if not registry_path.exists():
        eprint(f"[deploy-gate] FAIL: registry not found: {args.registry}")
        return 2
    config_root = registry_path.parent.resolve()
    registry_integrity = str((Path(__file__).resolve().parent / "registry_integrity.py").resolve().relative_to(repo.resolve()).as_posix())
    registry_sign = str((Path(__file__).resolve().parent / "registry_sign.py").resolve().relative_to(repo.resolve()).as_posix())

    code = run_cmd(
        [
            "python3",
            registry_integrity,
            "--registry",
            str(registry_path.relative_to(repo).as_posix()),
            "--mode",
            "verify",
            "--require-digest",
        ],
        gate="registry_integrity",
    )
    if code != 0:
        return code

    reg = load_json(registry_path)
    items = reg.get("items") or []
    pol_item = next((it for it in items if isinstance(it, dict) and it.get("id") == "policy.security@v1"), None)
    if not isinstance(pol_item, dict):
        eprint("[deploy-gate] FAIL: policy.security@v1 not found in registry")
        return 2

    pol_path = (config_root / str(pol_item.get("path"))).resolve()
    pol = load_json(pol_path)
    sc = pol.get("supply_chain") if isinstance(pol, dict) else None
    sign_cfg = (sc.get("artifact_signing") if isinstance(sc, dict) else None) or {}

    required = bool((sign_cfg.get("required") if isinstance(sign_cfg, dict) else False) or False)
    scopes = sign_cfg.get("scopes") if isinstance(sign_cfg, dict) else None
    scopes = [str(x) for x in (scopes or []) if isinstance(x, str)]
    enforced = required and str(args.scope) in scopes

    if enforced:
        cmd = [
            "python3",
            registry_sign,
            "--registry",
            str(registry_path.relative_to(repo).as_posix()),
            "--mode",
            "verify",
            "--require-signed",
        ]
        for pk in args.public_key or []:
            cmd.extend(["--public-key", pk])
        code2 = run_cmd(cmd, gate="registry_signatures")
        if code2 != 0:
            return code2

    print(f"[deploy-gate] PASS scope={args.scope} signing_enforced={str(enforced).lower()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
