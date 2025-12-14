#!/usr/bin/env python3
"""
Basit doküman şablon denetleyici.

- STORY: docs/03-delivery/STORIES/STORY-*.md
- ACCEPTANCE: docs/03-delivery/ACCEPTANCE/AC-*.md
- TEST-PLAN: docs/03-delivery/TEST-PLANS/TP-*.md
- RUNBOOK: docs/04-operations/RUNBOOKS/RB-*.md

Kontroller:
- H1 altında ID meta satırı var mı ve dosya adıyla uyumlu mu?
- Zorunlu H2 başlıkları var mı ve doğru sırada mı?

Çalıştırmak için:
  python scripts/check_doc_templates.py
"""

from __future__ import annotations

import sys
from dataclasses import dataclass
from pathlib import Path
from typing import List, Dict


ROOT = Path(__file__).resolve().parents[1]


@dataclass
class TemplateRule:
    name: str
    glob: str
    id_prefix: str
    required_headings: List[str]


RULES: Dict[str, TemplateRule] = {
    "story": TemplateRule(
        name="STORY",
        glob="docs/03-delivery/STORIES/STORY-*.md",
        id_prefix="STORY-",
        required_headings=[
            "1. AMAÇ",
            "2. TANIM",
            "3. KAPSAM VE SINIRLAR",
            "4. ACCEPTANCE KRİTERLERİ",
            "5. BAĞIMLILIKLAR",
            "6. ÖZET",
            "7. LİNKLER (İSTEĞE BAĞLI)",
        ],
    ),
    "acceptance": TemplateRule(
        name="ACCEPTANCE",
        glob="docs/03-delivery/ACCEPTANCE/AC-*.md",
        id_prefix="AC-",
        required_headings=[
            "1. AMAÇ",
            "2. KAPSAM",
            "3. GIVEN / WHEN / THEN SENARYOLARI",
            "4. NOTLAR / KISITLAR",
            "5. ÖZET",
            "6. LİNKLER (İSTEĞE BAĞLI)",
        ],
    ),
    "testplan": TemplateRule(
        name="TEST-PLAN",
        glob="docs/03-delivery/TEST-PLANS/TP-*.md",
        id_prefix="TP-",
        required_headings=[
            "1. AMAÇ",
            "2. KAPSAM",
            "3. STRATEJİ",
            "4. TEST SENARYOLARI ÖZETİ",
        ],
    ),
    "runbook": TemplateRule(
        name="RUNBOOK",
        glob="docs/04-operations/RUNBOOKS/RB-*.md",
        id_prefix="RB-",
        required_headings=[
            "-------------------------------------------------------------------------------",
            "1. AMAÇ",
            "-------------------------------------------------------------------------------",
            "2. KAPSAM",
            "-------------------------------------------------------------------------------",
            "3. BAŞLATMA / DURDURMA",
            "-------------------------------------------------------------------------------",
            "4. GÖZLEMLEME / LOG / METRİKLER",
            "-------------------------------------------------------------------------------",
            "5. ARIZA DURUMLARI VE ADIMLAR",
            "-------------------------------------------------------------------------------",
            "6. ÖZET",
            "-------------------------------------------------------------------------------",
            "7. LİNKLER (İSTEĞE BAĞLI)",
        ],
    ),
}


def read_lines(path: Path) -> List[str]:
    return path.read_text(encoding="utf-8").splitlines()


def check_id_meta(rule: TemplateRule, path: Path, lines: List[str], errors: List[str]) -> None:
    """
    ID satırının varlığını ve dosya adı ile uyumunu kontrol eder.
    Beklenen:
      - Bir satır: "ID: PREFIX-XXXX-..."
      - PREFIX, rule.id_prefix ile başlar
      - Değer, dosya adının (uzantısız) prefix'i ile başlar
    """
    id_line = None
    for line in lines[0:10]:
        if line.startswith("ID:"):
            id_line = line
            break
    if not id_line:
        errors.append("ID meta satırı bulunamadı (ilk 10 satır içinde 'ID:' yok).")
        return

    value = id_line.split(":", 1)[1].strip()
    # Genellikle tek token; yine de ilk token üzerinden gidelim.
    base = value.split()[0]

    if not base.startswith(rule.id_prefix):
        errors.append(f"ID meta '{base}' beklenen prefix ile başlamıyor: {rule.id_prefix!r}.")

    stem = path.stem  # örn: STORY-0001-backend-docs-refactor
    # Dosya adının, ID değeriyle başlamasını bekliyoruz (ID: STORY-0001, stem: STORY-0001-...).
    if not stem.startswith(base):
        errors.append(
            f"ID meta '{base}' dosya adıyla uyumlu değil (stem prefix beklentisi: {stem})."
        )


def check_headings(rule: TemplateRule, path: Path, lines: List[str], errors: List[str]) -> None:
    """
    Zorunlu başlıkların varlığını ve sırasını kontrol eder.
    STORY/AC/TP için hem "## " ile başlayan H2 başlıkları hem de
    eski stil "1. AMAÇ" gibi satırlar desteklenir. Karşılaştırma,
    normalize edilmiş başlık metni üzerinden yapılır.
    RUNBOOK için template'teki blok olduğu gibi aranır.
    """
    if rule.name != "RUNBOOK":
        headings: List[str] = []
        for line in lines:
            text = line.strip()
            if text.startswith("## "):
                headings.append(text[3:].strip())
            elif (
                text
                and not text.startswith("#")
                and not text.startswith("- ")
                and text[0].isdigit()
                and "." in text[:4]
            ):
                # Örn: "1. AMAÇ", "2. KAPSAM"
                headings.append(text)

        cursor = 0
        for expected in rule.required_headings:
            try:
                idx = headings.index(expected, cursor)
            except ValueError:
                errors.append(f"Beklenen başlık bulunamadı veya sırada değil: {expected!r}.")
                return
            cursor = idx + 1

        # Aynı başlığın bir dosya içinde birden fazla kullanılmasını istemiyoruz.
        # Özellikle template'te zorunlu olan H2'ler (1. AMAÇ, 2. KAPSAM, ...)
        # her dosyada tam bir kez geçmeli; birden fazla geçiyorsa muhtemelen
        # yanlışlıkla ikinci bir gövde yapıştırılmıştır.
        from collections import Counter

        counts = Counter(headings)
        for expected in rule.required_headings:
            if counts.get(expected, 0) > 1:
                errors.append(f"Başlık birden fazla kez kullanılmış: {expected!r}.")
    else:
        # RUNBOOK: required_headings dizisindeki satır dizisini dosya içinde sırayla arıyoruz
        idx = 0
        for expected in rule.required_headings:
            found = False
            while idx < len(lines):
                if lines[idx].strip() == expected:
                    found = True
                    idx += 1
                    break
                idx += 1
            if not found:
                errors.append(f"RUNBOOK şablon satırı bulunamadı veya sırada değil: {expected!r}.")
                return


def check_rule(rule: TemplateRule) -> int:
    print(f"\n== {rule.name} dosyaları için şablon kontrolü ==")
    matched_files = sorted(ROOT.glob(rule.glob))
    if not matched_files:
        print(f"- Uyarı: {rule.glob} için dosya bulunamadı.")
        return 0

    total_errors = 0
    for path in matched_files:
        lines = read_lines(path)
        errors: List[str] = []
        check_id_meta(rule, path, lines, errors)
        check_headings(rule, path, lines, errors)
        if errors:
            total_errors += len(errors)
            print(f"- HATA: {path}")
            for msg in errors:
                print(f"    • {msg}")
        else:
            print(f"- OK:   {path}")

    if total_errors == 0:
        print(f"✓ {rule.name} için tüm dosyalar şablona uyuyor.")
    else:
        print(f"✗ {rule.name} için toplam {total_errors} hata bulundu.")
    return total_errors


def main() -> int:
    total = 0
    for rule in RULES.values():
        total += check_rule(rule)

    if total == 0:
        print("\nTÜM ŞABLON KONTROLLERİ BAŞARILI ✅")
        return 0

    print(f"\nTOPLAM {total} ŞABLON HATASI VAR ❌")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
