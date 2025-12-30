#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import shlex
import subprocess
import sys
from pathlib import Path
from typing import Any, Iterable


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


def resolve_item_file(repo: Path, config_root: Path, item: dict[str, Any]) -> Path:
    rel = item.get("path")
    if not isinstance(rel, str) or not rel.strip():
        raise ValueError("invalid_item_path")
    abs_path = (config_root / rel).resolve()
    abs_path.relative_to(repo.resolve())
    if not abs_path.exists():
        raise FileNotFoundError(rel)
    return abs_path


def resolve_signature_path(repo: Path, config_root: Path, item: dict[str, Any]) -> Path:
    integrity = item.get("integrity")
    integrity = integrity if isinstance(integrity, dict) else {}
    sig_ref = integrity.get("signature_ref")
    if not isinstance(sig_ref, str) or not sig_ref.strip():
        raise ValueError("missing_signature_ref")
    sig_path = (config_root / sig_ref).resolve()
    sig_path.relative_to(repo.resolve())
    return sig_path


def run_cmd(argv: list[str]) -> int:
    cmd = shlex.join(argv)
    proc = subprocess.run(argv, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    if proc.returncode != 0:
        eprint(f"[sign] FAIL cmd={cmd}")
        out = (proc.stdout or "").strip()
        if out:
            eprint(out)
    return int(proc.returncode or 0)


def verify_with_any_pubkey(file_path: Path, sig_path: Path, pubkeys: Iterable[Path]) -> bool:
    for pk in pubkeys:
        code = run_cmd(
            [
                "openssl",
                "dgst",
                "-sha256",
                "-verify",
                str(pk),
                "-signature",
                str(sig_path),
                str(file_path),
            ]
        )
        if code == 0:
            return True
    return False


def main() -> int:
    ap = argparse.ArgumentParser(description="Registry signing: detached signatures for registry items (v0)")
    ap.add_argument("--registry", default="autonomous-pipeline-v2/registry.v1.json")
    ap.add_argument("--mode", choices=["sign", "verify"], required=True)
    ap.add_argument("--write", action="store_true", help="Write back registry changes (sign mode only)")
    ap.add_argument("--private-key", default="", help="PEM private key path (sign mode)")
    ap.add_argument("--public-key", action="append", default=[], help="PEM public key path (verify mode; may repeat)")
    ap.add_argument("--require-signed", action="store_true", help="Fail if any item is not signed (verify mode)")
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
        eprint(f"[sign] FAIL: registry not found: {args.registry}")
        return 2
    config_root = registry_path.parent.resolve()

    reg = load_json(registry_path)
    items = reg.get("items")
    if not isinstance(items, list):
        eprint("[sign] FAIL: registry.items must be a list")
        return 2

    if args.mode == "sign":
        if not args.private_key:
            eprint("[sign] FAIL: --private-key required for sign mode")
            return 2
        priv_path = safe_resolve_under(repo, str(args.private_key))
        if not priv_path.exists():
            eprint(f"[sign] FAIL: private key not found: {priv_path}")
            return 2

        updated = False
        for item in items:
            if not isinstance(item, dict):
                continue
            item_id = str(item.get("id") or "")
            try:
                file_path = resolve_item_file(repo, config_root, item)
                sig_path = resolve_signature_path(repo, config_root, item)
            except Exception as exc:
                eprint(f"[sign] FAIL: item={item_id} error={exc}")
                return 2

            sig_path.parent.mkdir(parents=True, exist_ok=True)
            code = run_cmd(["openssl", "dgst", "-sha256", "-sign", str(priv_path), "-out", str(sig_path), str(file_path)])
            if code != 0:
                eprint(f"[sign] FAIL: sign_failed item={item_id}")
                return 2

            integrity = item.get("integrity")
            integrity = integrity if isinstance(integrity, dict) else {}
            integrity["signed"] = True
            item["integrity"] = integrity
            updated = True

        if args.write:
            if updated:
                write_json(registry_path, reg)
            print(f"[sign] UPDATED registry={registry_path.relative_to(repo).as_posix()} changed={str(updated).lower()}")
            return 0

        print(json.dumps(reg, ensure_ascii=False, indent=2))
        return 0

    # verify
    pubkeys = [safe_resolve_under(repo, str(p)) for p in (args.public_key or [])]
    env_pub = os.environ.get("AUTONOMOUS_PIPELINE_PUBLIC_KEY")
    if env_pub and env_pub.strip():
        pubkeys.append(safe_resolve_under(repo, env_pub.strip()))
    pubkeys = [p for p in pubkeys if p.exists()]

    if not pubkeys:
        eprint("[sign] FAIL: no public keys provided (use --public-key or AUTONOMOUS_PIPELINE_PUBLIC_KEY)")
        return 2

    for item in items:
        if not isinstance(item, dict):
            continue
        item_id = str(item.get("id") or "")
        integrity = item.get("integrity")
        integrity = integrity if isinstance(integrity, dict) else {}
        signed = bool(integrity.get("signed", False))

        if args.require_signed and not signed:
            eprint(f"[sign] FAIL: not_signed item={item_id}")
            return 2
        if not signed:
            continue

        try:
            file_path = resolve_item_file(repo, config_root, item)
            sig_path = resolve_signature_path(repo, config_root, item)
        except Exception as exc:
            eprint(f"[sign] FAIL: item={item_id} error={exc}")
            return 2

        if not sig_path.exists():
            eprint(f"[sign] FAIL: signature_missing item={item_id} signature={sig_path.relative_to(repo).as_posix()}")
            return 2

        if not verify_with_any_pubkey(file_path, sig_path, pubkeys):
            eprint(f"[sign] FAIL: signature_invalid item={item_id}")
            return 2

    print("[sign] PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
