#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import re
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


def write_json(path: Path, obj: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return f"sha256:{h.hexdigest()}"


RE_SAFE_FILENAME = re.compile(r"[^A-Za-z0-9_.-]+")


def safe_filename(s: str, *, max_len: int = 180) -> str:
    out = RE_SAFE_FILENAME.sub("_", s).strip("._-")
    if not out:
        return "item"
    return out[:max_len]


def compute_item_digest(repo: Path, config_root: Path, item: dict[str, Any]) -> tuple[str, Path]:
    rel = item.get("path")
    if not isinstance(rel, str) or not rel.strip():
        raise ValueError("invalid_item_path")
    abs_path = (config_root / rel).resolve()
    abs_path.relative_to(repo.resolve())
    if not abs_path.exists():
        raise FileNotFoundError(rel)
    return sha256_file(abs_path), abs_path


def main() -> int:
    ap = argparse.ArgumentParser(description="Registry integrity: compute/verify integrity.digest (+ optional signature_ref) (v0)")
    ap.add_argument("--registry", default="autonomous-pipeline-v2/registry.v1.json")
    ap.add_argument("--mode", default="verify", choices=["verify", "update"])
    ap.add_argument("--write", action="store_true", help="Write back (update mode only). Otherwise prints to stdout.")
    ap.add_argument("--require-digest", action="store_true", help="Fail if any item is missing integrity.digest")
    ap.add_argument("--populate-signature-ref", action="store_true", help="Update: fill integrity.signature_ref when missing")
    ap.add_argument("--signature-dir", default="signatures", help="Relative to registry directory (update mode)")
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
        eprint(f"[integrity] FAIL: registry not found: {args.registry}")
        return 2
    config_root = registry_path.parent.resolve()

    reg = load_json(registry_path)
    items = reg.get("items")
    if not isinstance(items, list):
        eprint("[integrity] FAIL: registry.items must be a list")
        return 2

    mismatches: list[str] = []
    missing: list[str] = []
    file_missing: list[str] = []

    updated_any = False
    for item in items:
        if not isinstance(item, dict):
            continue
        item_id = str(item.get("id") or "")
        try:
            digest, abs_path = compute_item_digest(repo, config_root, item)
        except FileNotFoundError as exc:
            file_missing.append(f"{item_id} path={exc}")
            continue
        except Exception as exc:
            file_missing.append(f"{item_id} error={exc}")
            continue

        integrity = item.get("integrity")
        integrity = integrity if isinstance(integrity, dict) else {}
        existing_digest = integrity.get("digest")

        if args.mode == "verify":
            if not isinstance(existing_digest, str) or not existing_digest:
                if args.require_digest:
                    missing.append(item_id)
                continue
            if existing_digest != digest:
                mismatches.append(f"{item_id} expected={existing_digest} actual={digest} path={abs_path.relative_to(repo).as_posix()}")
            continue

        # update mode
        if existing_digest != digest:
            integrity["digest"] = digest
            updated_any = True

        if args.populate_signature_ref:
            sig_ref = integrity.get("signature_ref")
            if not isinstance(sig_ref, str) or not sig_ref.strip():
                sig_name = safe_filename(item_id) + ".sig"
                integrity["signature_ref"] = f"{str(args.signature_dir).rstrip('/')}/{sig_name}"
                if "signed" not in integrity:
                    integrity["signed"] = False
                updated_any = True

        if integrity:
            item["integrity"] = integrity

    if args.mode == "verify":
        if file_missing:
            for ln in file_missing:
                eprint(f"[integrity] FAIL: file_missing {ln}")
            return 2
        if missing:
            for item_id in missing:
                eprint(f"[integrity] FAIL: missing_digest id={item_id}")
            return 2
        if mismatches:
            for ln in mismatches:
                eprint(f"[integrity] FAIL: digest_mismatch {ln}")
            return 2
        print("[integrity] PASS")
        return 0

    if file_missing:
        for ln in file_missing:
            eprint(f"[integrity] FAIL: file_missing {ln}")
        return 2

    if args.write:
        if updated_any:
            write_json(registry_path, reg)
        print(f"[integrity] UPDATED path={registry_path.relative_to(repo).as_posix()} changed={str(updated_any).lower()}")
        return 0

    print(json.dumps(reg, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
