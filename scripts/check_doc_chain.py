#!/usr/bin/env python3
"""
End-to-end doküman zinciri kontrolü.

Kullanım:
  python3 scripts/check_doc_chain.py
  python3 scripts/check_doc_chain.py STORY-0007

Kontroller:
- Belirli bir STORY için:
  - STORY içindeki LİNKLER bölümünden PB / PRD / AC / TP / RUNBOOK / API doküman yollarını okur.
  - Bu yolların gerçekten var olup olmadığını raporlar.
- Global modda:
  - Tüm PB / PRD dosyalarını tarar, herhangi bir STORY'nin LİNKLER bölümünde
    referans verilmeyenleri "Discover/Shape aşamasında, henüz delivery yok"
    olarak listeler.
"""

from __future__ import annotations

import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple


ROOT = Path(__file__).resolve().parents[1]


@dataclass
class DocLinks:
    story_id: str
    story_path: Path
    links: Dict[str, str]  # label -> path


def read_lines(path: Path) -> List[str]:
    return path.read_text(encoding="utf-8").splitlines()


def find_story_file(story_id: str) -> Optional[Path]:
    matches = sorted(ROOT.glob(f"docs/03-delivery/STORIES/{story_id}-*.md"))
    return matches[0] if matches else None


def parse_links_section(lines: List[str]) -> Dict[str, str]:
    """
    LİNKLER bölümündeki satırlardan PB/PRD/Acceptance/Test Plan/Runbook/API
    yollarını çıkarır.
    Örn:
      - PB: docs/01-product/PROBLEM-BRIEFS/PB-0001-....md
    """
    start = None
    for idx, line in enumerate(lines):
        if "LİNKLER" in line:
            start = idx
            break
    if start is None:
        return {}

    links: Dict[str, str] = {}
    for line in lines[start + 1 :]:
        if line.startswith("## "):
            break
        text = line.strip()
        if not text or not text.startswith("-"):
            continue
        # "- PB: path" gibi satırlar
        m = re.match(r"-\s*([^:]+):\s+(.+)", text)
        if not m:
            continue
        label = m.group(1).strip()
        path = m.group(2).strip()
        links[label] = path
    return links


def collect_story_links(target_story: Optional[str] = None) -> List[DocLinks]:
    stories: List[DocLinks] = []
    for story_path in sorted(ROOT.glob("docs/03-delivery/STORIES/STORY-*.md")):
        m = re.search(r"STORY-\d{4}", story_path.name)
        story_id = m.group(0) if m else story_path.stem
        if target_story and story_id != target_story:
            continue
        lines = read_lines(story_path)
        links = parse_links_section(lines)
        if not links:
            continue
        stories.append(DocLinks(story_id=story_id, story_path=story_path, links=links))
    return stories


def check_story_chain(doc_links: DocLinks) -> List[str]:
    errors: List[str] = []
    for label, rel_path in doc_links.links.items():
        # Basit path kontrolü; docs/ ile başlayan, tekil ve joker (*) içermeyen
        # gerçek dosya yollarını kontrol ediyoruz. Şablon veya glob içeren
        # satırları (örn. docs/03-delivery/api/*.md) şu an için atlıyoruz.
        if (
            not rel_path
            or ".md" not in rel_path
            or "*" in rel_path
            or "," in rel_path
        ):
            continue
        if rel_path.startswith("`") and rel_path.endswith("`"):
            rel_path = rel_path.strip("`")
        path = ROOT / rel_path
        if not path.exists():
            errors.append(f"{doc_links.story_id}: '{label}' için dosya bulunamadı: {rel_path}")
    return errors


def collect_pb_prd_usage(stories: List[DocLinks]) -> Tuple[Set[str], Set[str]]:
    """
    STORY LİNKLER bölümünde geçen PB-XXXX ve PRD-XXXX ID'lerini toplar.
    """
    pb_ids: Set[str] = set()
    prd_ids: Set[str] = set()
    for dl in stories:
        for _, rel_path in dl.links.items():
            m_pb = re.search(r"PB-\d{4}", rel_path)
            if m_pb:
                pb_ids.add(m_pb.group(0))
            m_prd = re.search(r"PRD-\d{4}", rel_path)
            if m_prd:
                prd_ids.add(m_prd.group(0))
    return pb_ids, prd_ids


def collect_all_pb_prd_ids() -> Tuple[Set[str], Set[str]]:
    pb_ids: Set[str] = set()
    prd_ids: Set[str] = set()

    for path in ROOT.glob("docs/01-product/PROBLEM-BRIEFS/PB-*.md"):
        stem = path.stem.split(".")[0]
        if stem.startswith("PB-"):
            parts = stem.split("-")
            if len(parts) >= 2:
                pb_ids.add("-".join(parts[:2]))  # PB-0001-... -> PB-0001

    for path in ROOT.glob("docs/01-product/PRD/PRD-*.md"):
        stem = path.stem.split(".")[0]
        if stem.startswith("PRD-"):
            parts = stem.split("-")
            if len(parts) >= 2:
                prd_ids.add("-".join(parts[:2]))  # PRD-0001-... -> PRD-0001

    return pb_ids, prd_ids


def main(argv: List[str]) -> int:
    target_story: Optional[str] = None
    if len(argv) == 2:
        target_story = argv[1]

    stories = collect_story_links(target_story)
    if target_story and not stories:
        print(f"{target_story} için LİNKLER bölümü içeren STORY bulunamadı.")
        return 1

    total_errors = 0
    for dl in stories:
        errs = check_story_chain(dl)
        if errs:
            total_errors += len(errs)
            print(f"- HATALAR: {dl.story_id}")
            for e in errs:
                print(f"    • {e}")
        else:
            print(f"OK: {dl.story_id} zincirindeki linkler mevcut.")

    # Global modda PB/PRD kullanım analizi
    if not target_story:
        pb_used, prd_used = collect_pb_prd_usage(stories)
        pb_all, prd_all = collect_all_pb_prd_ids()

        early_pb = sorted(pb_all - pb_used)
        early_prd = sorted(prd_all - prd_used)

        if early_pb or early_prd:
            print("\nDiscover/Shape aşamasında kalmış işler (yalnız PB/PRD, Story link'i yok):")
            for pb in early_pb:
                print(f"- PB sadece: {pb}")
            for prd in early_prd:
                print(f"- PRD sadece: {prd}")

    if total_errors == 0:
        print("\nDOC CHAIN kontrolü tamamlandı ✅")
        return 0

    print(f"\nTOPLAM {total_errors} DOC CHAIN HATASI VAR ❌")
    return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
