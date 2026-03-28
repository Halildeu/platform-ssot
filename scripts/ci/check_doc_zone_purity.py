#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DOCS_DIR = ROOT / "docs"
TECHNICAL_BASELINE_PATH = ROOT / "registry" / "technical_baseline.aistd.v1.json"
CANONICAL_JSON_ROOTS = (
    ROOT / "extensions",
    ROOT / "policies",
    ROOT / "registry",
    ROOT / "schemas",
)


def fail(msg: str) -> None:
    print(f"FAIL: {msg}", file=sys.stderr)
    sys.exit(1)


def load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        fail(f"invalid json: {path.relative_to(ROOT)} ({exc})")


def is_allowed_doc_json(rel_path: str, archive_root: str) -> bool:
    if archive_root and rel_path.startswith(f"{archive_root.rstrip('/')}/"):
        return True
    if rel_path.endswith(".schema.json"):
        return False
    name = Path(rel_path).name
    return name.endswith(".json") and ".v" in name


def main() -> None:
    if not TECHNICAL_BASELINE_PATH.exists():
        fail(f"technical baseline not found: {TECHNICAL_BASELINE_PATH}")
    if not DOCS_DIR.exists():
        fail(f"docs dir not found: {DOCS_DIR}")

    baseline = load_json(TECHNICAL_BASELINE_PATH)
    if baseline.get("kind") != "technical-baseline-aistd":
        fail("technical baseline kind must be technical-baseline-aistd")
    archive = baseline.get("archive") if isinstance(baseline.get("archive"), dict) else {}
    archive_root = str(archive.get("archive_root") or "").strip()
    legacy_manifest_rel = str(archive.get("legacy_manifest_path") or "").strip()
    if not archive_root:
        fail("technical baseline archive.archive_root missing")
    if not legacy_manifest_rel:
        fail("technical baseline archive.legacy_manifest_path missing")
    legacy_manifest_path = ROOT / legacy_manifest_rel
    if not legacy_manifest_path.exists():
        fail(f"legacy archive manifest not found: {legacy_manifest_path}")
    legacy_manifest = load_json(legacy_manifest_path)
    if legacy_manifest.get("kind") != "legacy-standards-archive-aistd":
        fail("legacy archive manifest kind must be legacy-standards-archive-aistd")

    for zone in CANONICAL_JSON_ROOTS:
        if not zone.exists():
            fail(f"canonical json root not found: {zone.relative_to(ROOT)}")

    invalid_archived_paths: list[str] = []
    for item in legacy_manifest.get("items") or []:
        if not isinstance(item, dict):
            continue
        archived_path = str(item.get("archived_path") or "").strip()
        if archived_path and not archived_path.startswith(f"{archive_root.rstrip('/')}/"):
            invalid_archived_paths.append(archived_path)
    if invalid_archived_paths:
        sample = "\n".join(invalid_archived_paths[:10])
        fail("legacy archive manifest contains paths outside archive_root:\n" + sample)

    invalid_docs_json = []
    for doc_json in DOCS_DIR.rglob("*.json"):
        rel = doc_json.relative_to(ROOT).as_posix()
        if not is_allowed_doc_json(rel, archive_root):
            invalid_docs_json.append(rel)
    if invalid_docs_json:
        sample = "\n".join(invalid_docs_json[:10])
        fail("docs contains non-versioned/non-archive json files:\n" + sample)

    print("PASS: doc zones align with technical baseline and legacy archive contract")


if __name__ == "__main__":
    main()
