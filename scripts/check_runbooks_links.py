#!/usr/bin/env python3
"""
RUNBOOK dokümanlarındaki `docs/...` linklerinin gerçekten var olup olmadığını
kontrol eden basit script.

Kullanım:
  python3 scripts/check_runbooks_links.py

Davranış:
- docs/04-operations/RUNBOOKS/*.md dosyalarını tarar.
- İçinde geçen `docs/...*.md` linklerini yakalar.
- Her link için:
  - Dosya varsa: OK
  - Dosya yoksa: FAIL

Çıkış kodu:
- Tüm linkler geçerliyse 0
- En az bir eksik dosya varsa 1
"""

from __future__ import annotations

import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import List


ROOT = Path(__file__).resolve().parents[1]
RUNBOOK_DIR = ROOT / "docs" / "04-operations" / "RUNBOOKS"


LINK_RE = re.compile(r"(docs/[0-9A-Za-z_\-/]+\.md)")


@dataclass
class LinkCheck:
    runbook: Path
    target: Path
    exists: bool


def find_links(path: Path) -> List[str]:
    text = path.read_text(encoding="utf-8")
    return sorted(set(LINK_RE.findall(text)))


def main() -> int:
    if not RUNBOOK_DIR.exists():
        print(f"RUNBOOK klasörü bulunamadı: {RUNBOOK_DIR}")
        return 1

    checks: List[LinkCheck] = []
    for runbook in sorted(RUNBOOK_DIR.glob("RB-*.md")):
        links = find_links(runbook)
        for link in links:
            target = ROOT / link
            checks.append(LinkCheck(runbook=runbook, target=target, exists=target.exists()))

    if not checks:
        print("Runbook linki bulunamadı (docs/...*.md).")
        return 0

    all_ok = True
    print("RUNBOOK link kontrolü:\n")
    for c in checks:
        rel_rb = c.runbook.relative_to(ROOT)
        rel_target = c.target.relative_to(ROOT)
        if c.exists:
            print(f"[OK]   {rel_rb} -> {rel_target}")
        else:
            print(f"[FAIL] {rel_rb} -> {rel_target} (dosya yok)")
            all_ok = False

    if all_ok:
        print("\nTüm RUNBOOK linkleri geçerli görünüyor ✅")
        return 0

    print("\nBazı RUNBOOK linkleri geçersiz ❌")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())

