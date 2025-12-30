#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


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


RE_INTENT = re.compile(r"^(?P<wf_id>WF-[A-Z0-9_-]+)\.(?P<wf_ver>v[0-9]+)$")


def parse_intent(intent: str) -> tuple[str, str]:
    m = RE_INTENT.match(intent.strip())
    if not m:
        raise ValueError(f"unsupported_intent: {intent}")
    return m.group("wf_id"), m.group("wf_ver")


def main() -> int:
    ap = argparse.ArgumentParser(description="Discovery v0: intent -> workflow selection (minimal)")
    ap.add_argument("--registry", default="autonomous-pipeline-v2/registry.v1.json")
    ap.add_argument("--intent", required=True, help="Example: WF-CORE.v1")
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
        eprint(f"[discover] FAIL: registry not found: {args.registry}")
        return 2
    registry = load_json(registry_path)
    items = registry.get("items") or []

    wf_id, wf_ver = parse_intent(str(args.intent))
    item_id = f"workflow:{wf_id}@{wf_ver}"

    wf_item = next((it for it in items if it.get("id") == item_id and it.get("kind") == "workflow"), None)
    if not wf_item:
        eprint(f"[discover] FAIL: workflow not found in registry: {item_id}")
        return 2

    out = {
        "schema_version": "discovery.result.v0",
        "intent": args.intent,
        "selected": {
            "workflow_id": wf_id,
            "workflow_version": wf_ver,
            "registry_item_id": item_id,
            "path": wf_item.get("path"),
        },
    }
    print(json.dumps(out, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
