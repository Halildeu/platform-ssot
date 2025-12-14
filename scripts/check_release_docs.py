#!/usr/bin/env python3
"""
Release dokümantasyonunun temel unsurlarını kontrol eden script.

Kullanım:
  python3 scripts/check_release_docs.py

Davranış:
- docs/04-operations/RELEASE-NOTES/*.md dosyalarını tarar.
- Her release notu için:
  - İçerikte en az bir TEST PLAN linki var mı?  (docs/03-delivery/TEST-PLANS/TP-*.md)
  - İçerikte en az bir RUNBOOK linki var mı?    (docs/04-operations/RUNBOOKS/RB-*.md)

Çıkış kodu:
- Tüm release notları en az bir TP ve RB linkine sahipse 0
- En az bir release notunda eksik varsa 1
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path
from typing import List


ROOT = Path(__file__).resolve().parents[1]
REL_NOTES_DIR = ROOT / "docs" / "04-operations" / "RELEASE-NOTES"


TP_RE = re.compile(r"docs/03-delivery/TEST-PLANS/TP-[0-9]{4}-[A-Za-z0-9\-]+\.md")
RB_RE = re.compile(r"docs/04-operations/RUNBOOKS/RB-[A-Za-z0-9\-]+\.md")


@dataclass
class ReleaseCheck:
    path: Path
    has_tp_link: bool
    has_rb_link: bool


def main() -> int:
    if not REL_NOTES_DIR.exists():
        print(f"Release notes klasörü bulunamadı: {REL_NOTES_DIR}")
        return 0

    checks: List[ReleaseCheck] = []
    for p in sorted(REL_NOTES_DIR.glob("*.md")):
        text = p.read_text(encoding="utf-8")
        has_tp = bool(TP_RE.search(text))
        has_rb = bool(RB_RE.search(text))
        checks.append(ReleaseCheck(path=p, has_tp_link=has_tp, has_rb_link=has_rb))

    if not checks:
        print("Herhangi bir release notes dokümanı bulunamadı.")
        return 0

    all_ok = True
    print("Release doküman kontrolleri:\n")
    for c in checks:
        rel_path = c.path.relative_to(ROOT)
        mark_tp = "OK" if c.has_tp_link else "MISSING"
        mark_rb = "OK" if c.has_rb_link else "MISSING"
        print(f"- {rel_path}")
        print(f"  TEST-PLAN linki: {mark_tp}")
        print(f"  RUNBOOK linki  : {mark_rb}\n")
        if not (c.has_tp_link and c.has_rb_link):
            all_ok = False

    if all_ok:
        print("Tüm release dokümanlarında en az bir TEST-PLAN ve RUNBOOK linki var ✅")
        return 0

    print("Bazı release dokümanlarında TEST-PLAN veya RUNBOOK linki eksik ❌")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())

