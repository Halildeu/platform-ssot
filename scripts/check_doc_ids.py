#!/usr/bin/env python3
"""
Basit ID bütünlük denetleyici.

Kontroller:
- PB / PRD / STORY / AC / TP / ADR / RUNBOOK dokümanlarında:
  - `ID:` meta satırı var mı?
  - ID değeri doğru prefix ile başlıyor mu? (PB-/PRD-/STORY-/AC-/TP-/ADR-/RB-)
  - ID, dosya adının (stem) başında geçiyor mu?  (örn. ID: TP-0010, stem: TP-0010-...)
  - Aynı ID birden fazla dosyada kullanılıyor mu? (ID havuzu çakışması)

Çalıştırmak için:
  python3 scripts/check_doc_ids.py
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import re
from typing import Dict, List, Tuple


ROOT = Path(__file__).resolve().parents[1]


@dataclass
class IdRule:
    name: str
    glob: str
    id_prefix: str


RULES: Dict[str, IdRule] = {
    "pb": IdRule(
        name="PB",
        glob="docs/01-product/PROBLEM-BRIEFS/PB-*.md",
        id_prefix="PB-",
    ),
    "prd": IdRule(
        name="PRD",
        glob="docs/01-product/PRD/PRD-*.md",
        id_prefix="PRD-",
    ),
    "story": IdRule(
        name="STORY",
        glob="docs/03-delivery/STORIES/STORY-*.md",
        id_prefix="STORY-",
    ),
    "acceptance": IdRule(
        name="ACCEPTANCE",
        glob="docs/03-delivery/ACCEPTANCE/AC-*.md",
        id_prefix="AC-",
    ),
    "testplan": IdRule(
        name="TEST-PLAN",
        glob="docs/03-delivery/TEST-PLANS/TP-*.md",
        id_prefix="TP-",
    ),
    "adr": IdRule(
        name="ADR",
        glob="docs/02-architecture/services/**/ADR/ADR-*.md",
        id_prefix="ADR-",
    ),
    "runbook": IdRule(
        name="RUNBOOK",
        glob="docs/04-operations/RUNBOOKS/RB-*.md",
        id_prefix="RB-",
    ),
}


def read_lines(path: Path) -> List[str]:
    return path.read_text(encoding="utf-8").splitlines()


def extract_id(lines: List[str]) -> str | None:
    """
    İlk ~10 satır içinde `ID:` satırını bulur ve değerini döner.
    Örn: "ID: TP-0010" → "TP-0010".
    """
    for line in lines[:10]:
        if line.startswith("ID:"):
            value = line.split(":", 1)[1].strip()
            # ID alanı genelde tek token; yine de ilk token'ı baz alalım.
            return value.split()[0]
    return None


def extract_story_ref(lines: List[str]) -> str | None:
    """
    İlk ~20 satır içinde `Story:` meta satırını bulur ve değerini döner.
    Örn: "Story: STORY-0007-user-notification-preferences-api" → "STORY-0007-user-notification-preferences-api".
    """
    for line in lines[:20]:
        if line.startswith("Story:"):
            return line.split(":", 1)[1].strip().split()[0]
    return None


def extract_numeric_id(value: str, prefix: str) -> str | None:
    """
    Prefix'e göre 4 haneli ID sayısını döner.
    Örn: value="TP-0037" prefix="TP-" → "0037"
    """
    m = re.match(rf"^{re.escape(prefix)}(\d{{4}})$", value)
    return m.group(1) if m else None


def extract_story_number(story_ref: str) -> str | None:
    """
    Story referansından 4 haneli sayıyı çıkarır.
    Örn: "STORY-0037-foo" → "0037"
    """
    m = re.search(r"STORY-(\d{4})", story_ref)
    return m.group(1) if m else None


def check_rule(rule: IdRule) -> Tuple[int, Dict[str, List[Path]]]:
    print(f"\n== {rule.name} dosyaları için ID kontrolü ==")
    matched_files = sorted(ROOT.glob(rule.glob))
    if not matched_files:
        print(f"- Uyarı: {rule.glob} için dosya bulunamadı.")
        return 0, {}

    total_errors = 0
    id_usage: Dict[str, List[Path]] = {}

    for path in matched_files:
        lines = read_lines(path)
        errors: List[str] = []

        value = extract_id(lines)
        if not value:
            errors.append("ID meta satırı bulunamadı (ilk 10 satır içinde 'ID:' yok).")
        else:
            # Prefix kontrolü
            if not value.startswith(rule.id_prefix):
                errors.append(
                    f"ID meta '{value}' beklenen prefix ile başlamıyor: {rule.id_prefix!r}."
                )

            # Dosya adı ile temel uyum: stem ID ile başlamalı.
            stem = path.stem  # örn: TP-0010-release-safety-and-dr-guardrails
            if not stem.startswith(value):
                errors.append(
                    f"ID meta '{value}' dosya adıyla uyumlu değil (stem prefix beklentisi: {stem})."
                )

            # ID havuzu: aynı ID birden fazla dosyada kullanılıyor mu?
            if value:
                id_usage.setdefault(value, []).append(path)

            # Delivery zinciri hizası: AC/TP numarası Story numarasıyla aynı olmalı.
            if rule.id_prefix in {"AC-", "TP-"}:
                story_ref = extract_story_ref(lines)
                if story_ref:
                    story_num = extract_story_number(story_ref)
                    doc_num = extract_numeric_id(value, rule.id_prefix)
                    if story_num and doc_num and story_num != doc_num:
                        errors.append(
                            f"{rule.name}: ID '{value}' ile Story '{story_ref}' numarası hizalı değil (beklenen: {rule.id_prefix}{story_num})."
                        )

        if errors:
            total_errors += len(errors)
            print(f"- HATA: {path}")
            for msg in errors:
                print(f"    • {msg}")
        else:
            print(f"- OK:   {path}")

    # Çakışan ID'ler
    collisions = {k: v for k, v in id_usage.items() if len(v) > 1}
    if collisions:
        print("\nID ÇAKIŞMALARI:")
        for value, paths in collisions.items():
            total_errors += 1
            print(f"- ID '{value}' birden fazla dosyada kullanılmış:")
            for p in paths:
                print(f"    • {p}")

    if total_errors == 0:
        print(f"✓ {rule.name} için tüm ID kontrolleri başarılı.")
    else:
        print(f"✗ {rule.name} için toplam {total_errors} ID problemi bulundu.")
    return total_errors, id_usage


def main() -> int:
    total_errors = 0
    for rule in RULES.values():
        errs, _ = check_rule(rule)
        total_errors += errs

    if total_errors == 0:
        print("\nTÜM ID KONTROLLERİ BAŞARILI ✅")
        return 0

    print(f"\nTOPLAM {total_errors} ID PROBLEMİ VAR ❌")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
