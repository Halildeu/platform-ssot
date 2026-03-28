#!/usr/bin/env python3
"""
Legacy governance backlog → yeni PROJECT-FLOW Story zinciri kontrolü.

Kullanım:
  python3 scripts/check_governance_migration.py

Yapılanlar:
- backend/docs/legacy/root/05-governance/PROJECT_FLOW.md içindeki governance
  ID'lerini (E0x-S0x, QLTY-..., vb.) toplar.
- docs/03-delivery/PROJECT-FLOW.md içindeki SPEC sütunundan benzer ID'leri
  toplar.
- Legacy'de olup yeni tabloda görünmeyenleri "henüz taşınmamış governance
  maddeleri" olarak listeler.

Not:
- Bu script, STORY-0029 / AC-0029 / TP-0029 kabul kriterlerini destekleyen
  hafif bir kontrol sağlar; gerçek iş önceliği veya kapsam analizini insan
  ekipleri yapmalıdır.
"""

from __future__ import annotations

import re
from pathlib import Path
from typing import Set


ROOT = Path(__file__).resolve().parents[1]
LEGACY_PROJECT_FLOW = ROOT / "backend/docs/legacy/root/05-governance/PROJECT_FLOW.md"
NEW_PROJECT_FLOW = ROOT / "docs/03-delivery/PROJECT-FLOW.md"
STORIES_DIR = ROOT / "docs/03-delivery/STORIES"

# Governance ID deseni: E03-S01, E03-S01-S01, QLTY-REST-USER-01, QLTY-BE-AUTHZ-SCOPE-01, ...
GOV_ID_PATTERN = re.compile(
    r"\b("
    r"E\d{2}-S\d{2}(?:-[A-Z0-9.-]+)?"
    r"|QLTY-[A-Z0-9-]+"
    r")\b"
)
STORY_ID_PATTERN = re.compile(r"\bSTORY-(\d{4})\b")


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def collect_gov_ids_from_legacy() -> Set[str]:
    if not LEGACY_PROJECT_FLOW.exists():
        return set()
    text = read_text(LEGACY_PROJECT_FLOW)
    return set(m.group(1) for m in GOV_ID_PATTERN.finditer(text))


def collect_gov_ids_from_new() -> Set[str]:
    if not NEW_PROJECT_FLOW.exists():
        return set()
    text = read_text(NEW_PROJECT_FLOW)
    return set(m.group(1) for m in GOV_ID_PATTERN.finditer(text))


def normalize_id(gid: str) -> str:
    """
    Governance ID'lerini kanonik forma çeker.

    Özellikle legacy PROJECT_FLOW içinde bazı ID'ler:
      - QLTY-01-S1-Backend-...  → QLTY-01-S1-
      - E03-S01-S01-1-Accent... → E03-S01-S01-1-
    gibi dosya adı / alias uzantılarıyla geçtiği için, aynı ID'nin
    yeni PROJECT-FLOW içindeki karşılığı:
      - QLTY-01-S1
      - E03-S01-S01-1
    şeklinde olabilir.

    Burada hedef, trailing '-' ve '.' karakterlerini yok sayarak
    karşılaştırma yapmaktır; böylece alias varyantları tek bir
    kanonik ID altında toplanır.
    """

    return gid.rstrip("-.")


def collect_existing_story_numbers() -> Set[int]:
    numbers: Set[int] = set()

    if NEW_PROJECT_FLOW.exists():
        text = read_text(NEW_PROJECT_FLOW)
        numbers.update(int(m.group(1)) for m in STORY_ID_PATTERN.finditer(text))

    if STORIES_DIR.exists():
        for path in STORIES_DIR.glob("STORY-*.md"):
            match = STORY_ID_PATTERN.search(path.name)
            if match:
                numbers.add(int(match.group(1)))

    return numbers


def next_story_numbers(count: int) -> list[int]:
    existing = sorted(collect_existing_story_numbers())
    start = (existing[-1] + 1) if existing else 1
    return [start + offset for offset in range(count)]


def slugify_id(gid: str) -> str:
    slug = gid.lower()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    slug = re.sub(r"-{2,}", "-", slug).strip("-")
    return slug or "governance-item"


def main() -> int:
    legacy_ids_raw = collect_gov_ids_from_legacy()
    new_ids_raw = collect_gov_ids_from_new()

    # Alias varyantları tek ID altında topla
    legacy_ids = {normalize_id(g) for g in legacy_ids_raw}
    new_ids = {normalize_id(g) for g in new_ids_raw}

    if not legacy_ids:
        print("Legacy governance PROJECT_FLOW dokümanı bulunamadı veya ID içerik yok.")
        return 0

    unmigrated = sorted(legacy_ids - new_ids)
    migrated = sorted(legacy_ids & new_ids)

    print("== Governance ID Özeti ==\n")
    print(f"Legacy PROJECT_FLOW içindeki benzersiz ID sayısı : {len(legacy_ids)}")
    print(f"Yeni PROJECT-FLOW'da görülen (taşınmış) ID sayısı : {len(migrated)}")
    print(f"Henüz yeni sisteme taşınmamış ID sayısı          : {len(unmigrated)}\n")

    if migrated:
        print("Taşınmış governance ID'leri (legacy → yeni PROJECT-FLOW):")
        for gid in migrated:
            print(f"- {gid}")
        print()

    if unmigrated:
        print("Henüz yeni PROJECT-FLOW'a taşınmamış governance ID'leri:")
        for gid in unmigrated:
            print(f"- {gid}")
        print()

        suggestions = next_story_numbers(len(unmigrated))
        print("Önerilen Story / Acceptance / Test Plan zinciri:")
        for number, gid in zip(suggestions, unmigrated):
            slug = slugify_id(gid)
            print(
                f"- STORY-{number:04d}-{slug} / "
                f"AC-{number:04d}-{slug} / "
                f"TP-{number:04d}-{slug} "
                f"(upstream: {gid})"
            )
        print(
            "\nBu ID'ler için STORY-00xx zincirleri açılması ve "
            "docs/03-delivery/PROJECT-FLOW.md tablosuna eklenmesi önerilir."
        )
        return 1

    print("Tüm governance ID'leri yeni PROJECT-FLOW içinde temsil ediliyor gibi görünüyor ✅")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
