#!/usr/bin/env python3
"""
SPEC referans bütünlük denetleyici.

Kontroller:
- docs/** içinde geçen `SPEC-XXXX` referanslarını toplar.
- docs/03-delivery/SPECS altında ilgili `SPEC-XXXX-*.md` dosyası var mı kontrol eder.

Kullanım:
  python3 scripts/check_spec_refs.py
"""

from __future__ import annotations

from pathlib import Path
import re
from typing import Dict, List, Set


ROOT = Path(__file__).resolve().parents[1]
SPEC_DIR = ROOT / "docs" / "03-delivery" / "SPECS"
SPEC_ID_RE = re.compile(r"\bSPEC-(\d{4})\b")


def iter_doc_files() -> List[Path]:
    docs_root = ROOT / "docs"
    if not docs_root.is_dir():
        return []

    files: List[Path] = []
    for path in docs_root.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix not in {".md", ".tsv"}:
            continue
        files.append(path)

    return sorted(files)


def existing_spec_ids() -> Set[str]:
    ids: Set[str] = set()
    if not SPEC_DIR.is_dir():
        return ids

    for path in sorted(SPEC_DIR.glob("SPEC-????-*.md")):
        m = SPEC_ID_RE.search(path.name)
        if m:
            ids.add(m.group(1))
    return ids


def main() -> int:
    existing = existing_spec_ids()

    referenced: Dict[str, Set[Path]] = {}
    for path in iter_doc_files():
        try:
            text = path.read_text(encoding="utf-8")
        except Exception:
            continue

        for m in SPEC_ID_RE.finditer(text):
            referenced.setdefault(m.group(1), set()).add(path)

    missing = sorted([sid for sid in referenced.keys() if sid not in existing])
    if missing:
        print("[check_spec_refs] FAIL: Missing SPEC files for referenced IDs:")
        for sid in missing:
            files = sorted(referenced[sid])
            print(f"- SPEC-{sid}: referenced in {len(files)} file(s)")
            for ff in files[:10]:
                print(f"  - {ff.relative_to(ROOT)}")
            if len(files) > 10:
                print("  - ...")
        return 1

    print(f"[check_spec_refs] PASS: {len(referenced)} referenced SPEC IDs all have files.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
