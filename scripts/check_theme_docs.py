#!/usr/bin/env python3
"""
E03 Theme / Layout / Overlay doküman zincirini hızlıca kontrol eden script.

Kullanım:
  python3 scripts/check_theme_docs.py

Davranış:
- STORY-0037 / 0038 / 0039 için:
  - STORY / ACCEPTANCE / TEST-PLAN dosyaları var mı?
  - Her birinde Status: Done mı?
- PROJECT-FLOW içinde ilgili satırlar bulunuyor mu ve Durum sütunu "Done" mı?

Bu script, Theme fazının dokümantasyon tarafında "kapanmış" durumda
kalmasını sağlamak için küçük bir sağlık kontrolüdür.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path
from typing import List


ROOT = Path(__file__).resolve().parents[1]


THEME_STORIES = [
    ("STORY-0037", "AC-0037", "TP-0036"),
    ("STORY-0038", "AC-0038", "TP-0037"),
    ("STORY-0039", "AC-0039", "TP-0038"),
]


@dataclass
class ThemeDocStatus:
    story_id: str
    ac_id: str
    tp_id: str
    story_ok: bool
    ac_ok: bool
    tp_ok: bool
    project_flow_done: bool


def has_status_done(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    return "Status: Done" in text


def project_flow_has_done(story_id: str) -> bool:
    pf = ROOT / "docs" / "03-delivery" / "PROJECT-FLOW.md"
    text = pf.read_text(encoding="utf-8")
    # Satırda STORY ID ve 🟩 Done ifadesi birlikte geçmeli.
    pattern = re.compile(rf"^{story_id}\b.*🟩 Done", re.MULTILINE)
    return bool(pattern.search(text))


def main() -> int:
    results: List[ThemeDocStatus] = []

    for story_id, ac_id, tp_id in THEME_STORIES:
        story_path = ROOT / "docs" / "03-delivery" / "STORIES" / f"{story_id}-" + "*.md"
        # glob ile gerçek dosyayı bul
        story_matches = list((ROOT / "docs" / "03-delivery" / "STORIES").glob(f"{story_id}-*.md"))
        ac_path = ROOT / "docs" / "03-delivery" / "ACCEPTANCE" / f"{ac_id}-" + "*.md"
        ac_matches = list((ROOT / "docs" / "03-delivery" / "ACCEPTANCE").glob(f"{ac_id}-*.md"))
        tp_path = ROOT / "docs" / "03-delivery" / "TEST-PLANS" / f"{tp_id}-" + "*.md"
        tp_matches = list((ROOT / "docs" / "03-delivery" / "TEST-PLANS").glob(f"{tp_id}-*.md"))

        story_ok = bool(story_matches) and has_status_done(story_matches[0])
        ac_ok = bool(ac_matches) and has_status_done(ac_matches[0])
        tp_ok = bool(tp_matches) and has_status_done(tp_matches[0])
        pf_ok = project_flow_has_done(story_id)

        results.append(
            ThemeDocStatus(
                story_id=story_id,
                ac_id=ac_id,
                tp_id=tp_id,
                story_ok=story_ok,
                ac_ok=ac_ok,
                tp_ok=tp_ok,
                project_flow_done=pf_ok,
            )
        )

    all_ok = True
    print("E03 Theme doküman zinciri kontrolü:\n")
    for r in results:
        print(f"- {r.story_id} / {r.ac_id} / {r.tp_id}")
        print(f"  STORY Status: Done  -> {'OK' if r.story_ok else 'MISSING/WRONG'}")
        print(f"  AC Status: Done     -> {'OK' if r.ac_ok else 'MISSING/WRONG'}")
        print(f"  TP Status: Done     -> {'OK' if r.tp_ok else 'MISSING/WRONG'}")
        print(f"  PROJECT-FLOW satırı -> {'OK' if r.project_flow_done else 'MISSING/WRONG'}\n")
        if not (r.story_ok and r.ac_ok and r.tp_ok and r.project_flow_done):
            all_ok = False

    if all_ok:
        print("Theme/UX (E03) fazı doküman tarafında tamamen kapalı görünüyor ✅")
        return 0

    print("Theme/UX (E03) fazında doküman tarafında eksikler var ❌")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())

