#!/usr/bin/env python3
"""
Doküman dil kontrolü (TR odaklı).

Amaç:
- Delivery dokümanlarında (STORY/AC/TP) “Türkçe gövde” kuralını enforce etmek.
- Özellikle Story "Tanım" bölümünde İngilizce kalıp kullanımını engellemek:
  - "As a ... I want ... so that ..."

Not:
- Acceptance dokümanlarında "Given/When/Then" anahtar kelimeleri bilerek
  İngilizcedir; bu script onları hedeflemez.

Kullanım:
  python3 scripts/check_doc_language_tr.py
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List


ROOT = Path(__file__).resolve().parents[1]


@dataclass(frozen=True)
class Rule:
    name: str
    glob: str
    forbidden_patterns: List[re.Pattern[str]]


FORBIDDEN_COMMON = [
    re.compile(r"\bAs\s+(a|an)\b"),
    re.compile(r"\bI\s+want\b"),
    re.compile(r"\bwe\s+want\b", re.IGNORECASE),
    re.compile(r"\bso\s+that\b"),
]


RULES: List[Rule] = [
    Rule(
        name="STORY",
        glob="docs/03-delivery/STORIES/STORY-*.md",
        forbidden_patterns=FORBIDDEN_COMMON,
    ),
    Rule(
        name="ACCEPTANCE",
        glob="docs/03-delivery/ACCEPTANCE/AC-*.md",
        forbidden_patterns=FORBIDDEN_COMMON,
    ),
    Rule(
        name="TEST-PLAN",
        glob="docs/03-delivery/TEST-PLANS/TP-*.md",
        forbidden_patterns=FORBIDDEN_COMMON,
    ),
]


def iter_files(glob: str) -> Iterable[Path]:
    return sorted(ROOT.glob(glob))


def main() -> int:
    errors: List[str] = []

    for rule in RULES:
        for path in iter_files(rule.glob):
            lines = path.read_text(encoding="utf-8").splitlines()
            for idx, line in enumerate(lines, start=1):
                for pat in rule.forbidden_patterns:
                    if pat.search(line):
                        errors.append(f"{rule.name}: {path.relative_to(ROOT)}:{idx}: {line.strip()}")
                        break

    if errors:
        print("[check_doc_language_tr] HATA: Türkçe gövde kuralını bozan kalıplar bulundu:")
        for e in errors[:200]:
            print(f"- {e}")
        if len(errors) > 200:
            print(f"... ({len(errors) - 200} satır daha)")
        return 1

    print("[check_doc_language_tr] OK: Delivery (STORY/AC/TP) dokümanlarında İngilizce kalıp yok ✅")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
