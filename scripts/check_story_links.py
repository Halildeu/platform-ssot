#!/usr/bin/env python3
"""
PROJECT-FLOW ↔ STORY / AC / TP tutarlılık kontrolü.

Kullanım:
  python3 scripts/check_story_links.py
  python3 scripts/check_story_links.py STORY-0007
  python3 scripts/check_story_links.py -h
  python3 scripts/check_story_links.py --help

Kontroller:
- PROJECT-FLOW tablosundaki her STORY satırı için:
  - İlgili STORY dosyası var mı?
  - Acceptance sütununda görünen AC-XXXX için ACCEPTANCE dosyası var mı?
  - STORY meta ("Downstream:") içindeki AC/TP ID'leri için dosyalar var mı?
  - STORY içindeki "LİNKLER" bölümünde ilgili AC/TP referansları geçiyor mu?
"""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional, Tuple, Dict


ROOT = Path(__file__).resolve().parents[1]
PROJECT_FLOW_MD = ROOT / "docs/03-delivery/PROJECT-FLOW.md"
PROJECT_FLOW_TSV = ROOT / "docs/03-delivery/PROJECT-FLOW.tsv"


@dataclass
class StoryRow:
    story_id: str
    acceptance_id: Optional[str]
    raw_line: str


def parse_cli_args(argv: List[str]) -> Optional[str]:
    parser = argparse.ArgumentParser(
        description="PROJECT-FLOW ↔ STORY / AC / TP tutarlılık kontrolü.",
    )
    parser.add_argument(
        "story_id",
        nargs="?",
        help="Sadece verilen STORY-ID için kontrol et (örn. STORY-0007).",
    )
    args = parser.parse_args(argv[1:])
    return args.story_id


def parse_project_flow(target_story: Optional[str] = None) -> List[StoryRow]:
    # SSOT: TSV (yoksa legacy MD fallback)
    if PROJECT_FLOW_TSV.exists():
        rows: List[StoryRow] = []
        lines = PROJECT_FLOW_TSV.read_text(encoding="utf-8").splitlines()
        if not lines:
            raise SystemExit(f"PROJECT-FLOW TSV boş: {PROJECT_FLOW_TSV}")

        header = [h.strip() for h in lines[0].split("\t")]
        idx: Dict[str, int] = {name: i for i, name in enumerate(header) if name}
        if "Story ID" not in idx or "Acceptance" not in idx:
            raise SystemExit("PROJECT-FLOW TSV kolonları eksik: Story ID, Acceptance")

        for line in lines[1:]:
            if not line.strip():
                continue
            parts = line.split("\t")
            if len(parts) < len(header):
                parts += [""] * (len(header) - len(parts))

            story_id = (parts[idx["Story ID"]] or "").strip()
            if not story_id.startswith("STORY-"):
                continue
            if target_story and story_id != target_story:
                continue

            acceptance_cell = parts[idx["Acceptance"]] or ""
            m = re.search(r"AC-\d{4}", acceptance_cell)
            ac_id = m.group(0) if m else None
            rows.append(StoryRow(story_id=story_id, acceptance_id=ac_id, raw_line=line.rstrip()))

        return rows

    if not PROJECT_FLOW_MD.exists():
        raise SystemExit(f"PROJECT-FLOW bulunamadı: {PROJECT_FLOW_MD}")

    rows: List[StoryRow] = []
    in_block = False
    in_story_table_section = False
    for line in PROJECT_FLOW_MD.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()

        # Sadece "2. STORY DURUM TABLOSU" altındaki tabloyu parse et.
        if stripped.startswith("## 2. STORY DURUM TABLOSU"):
            in_story_table_section = True
            continue
        if not in_story_table_section:
            continue

        if stripped.startswith("```text"):
            in_block = True
            continue
        if in_block and stripped.startswith("```"):
            # Story tablosu bitti.
            break
        if not in_block:
            continue
        if not stripped or not stripped.startswith("STORY-"):
            continue
        if "Story ID" in stripped:
            # tablo başlığı
            continue

        parts = stripped.split()
        story_id = parts[0]
        if target_story and story_id != target_story:
            continue

        m = re.search(r"AC-\d{4}", stripped)
        ac_id = m.group(0) if m else None
        rows.append(StoryRow(story_id=story_id, acceptance_id=ac_id, raw_line=line.rstrip()))

    return rows


def find_story_file(story_id: str) -> Optional[Path]:
    matches = sorted(ROOT.glob(f"docs/03-delivery/STORIES/{story_id}-*.md"))
    if not matches:
        return None
    if len(matches) > 1:
        # Birden fazla dosya varsa ilkini alalım ama uyarı vereceğiz.
        print(f"Uyarı: {story_id} için birden fazla STORY dosyası bulundu, ilki kullanılacak.")
    return matches[0]


def find_acceptance_file(ac_id: str) -> Optional[Path]:
    matches = sorted(ROOT.glob(f"docs/03-delivery/ACCEPTANCE/{ac_id}-*.md"))
    return matches[0] if matches else None


def find_testplan_file(tp_id: str) -> Optional[Path]:
    matches = sorted(ROOT.glob(f"docs/03-delivery/TEST-PLANS/{tp_id}-*.md"))
    return matches[0] if matches else None


def read_lines(path: Path) -> List[str]:
    return path.read_text(encoding="utf-8").splitlines()


def parse_downstream_ids(lines: List[str]) -> Tuple[List[str], List[str]]:
    """
    STORY meta bloğundaki Downstream satırını okuyup AC/TP ID'lerini döner.
    Örn:
      Downstream: AC-0007, TP-0006
    """
    ac_ids: List[str] = []
    tp_ids: List[str] = []

    for line in lines[:15]:
        if line.strip().startswith("Downstream:"):
            value = line.split(":", 1)[1]
            tokens = re.split(r"[,\s]+", value)
            for tok in tokens:
                tok = tok.strip()
                if tok.startswith("AC-"):
                    ac_ids.append(tok)
                elif tok.startswith("TP-"):
                    tp_ids.append(tok)
            break

    return ac_ids, tp_ids


def parse_links_section(lines: List[str]) -> List[str]:
    """
    STORY içindeki "LİNKLER (İSTEĞE BAĞLI)" bölümündeki satırları döner.
    """
    def is_heading(text: str) -> bool:
        s = text.strip()
        if s.startswith("## "):
            return True
        if (
            s
            and not s.startswith("#")
            and not s.startswith("- ")
            and s[0].isdigit()
            and "." in s[:4]
        ):
            return True
        return False

    start = None
    for idx, line in enumerate(lines):
        text = line.strip()
        # Hem "## 7. LİNKLER ..." hem de "7. LİNKLER ..." stillerini destekle.
        if (text.startswith("##") and "LİNKLER" in text) or (
            is_heading(text) and "LİNKLER" in text
        ):
            start = idx
            break
    if start is None:
        return []

    collected: List[str] = []
    for line in lines[start + 1 :]:
        if is_heading(line):
            break
        collected.append(line.strip())
    return collected


def check_story_link(row: StoryRow) -> List[str]:
    errors: List[str] = []

    story_path = find_story_file(row.story_id)
    if not story_path:
        errors.append(f"{row.story_id}: STORY dosyası bulunamadı.")
        return errors

    lines = read_lines(story_path)
    ac_ids_downstream, tp_ids_downstream = parse_downstream_ids(lines)
    links_lines = parse_links_section(lines)
    links_text = "\n".join(links_lines)
    story_num = row.story_id.split("-", 1)[1]

    # PROJECT-FLOW'dan gelen Acceptance ID'yi kontrol et
    if row.acceptance_id:
        ac_path = find_acceptance_file(row.acceptance_id)
        if not ac_path:
            errors.append(f"{row.story_id}: Acceptance dosyası yok: {row.acceptance_id}.")
        if row.acceptance_id not in ac_ids_downstream:
            errors.append(
                f"{row.story_id}: Downstream meta içinde beklenen Acceptance ID bulunamadı: {row.acceptance_id}."
            )
        if row.acceptance_id not in links_text:
            errors.append(
                f"{row.story_id}: LİNKLER bölümünde Acceptance referansı eksik: {row.acceptance_id}."
            )
        # AC numarası Story ile hizalı olmalı
        if row.acceptance_id.split("-", 1)[1] != story_num:
            errors.append(
                f"{row.story_id}: Acceptance ID Story ile hizalı değil (beklenen: AC-{story_num})."
            )

    # Downstream'de görünen tüm AC/TP ID'leri için dosya var mı?
    for ac_id in ac_ids_downstream:
        if not find_acceptance_file(ac_id):
            errors.append(f"{row.story_id}: Downstream'de belirtilen Acceptance dosyası eksik: {ac_id}.")
    for tp_id in tp_ids_downstream:
        # TP numarası Story ile hizalı olmalı
        if tp_id.split("-", 1)[1] != story_num:
            errors.append(
                f"{row.story_id}: Test Plan ID Story ile hizalı değil (beklenen: TP-{story_num}, bulunan: {tp_id})."
            )
        if not find_testplan_file(tp_id):
            errors.append(f"{row.story_id}: Downstream'de belirtilen Test Plan dosyası eksik: {tp_id}.")
        elif tp_id not in links_text:
            errors.append(
                f"{row.story_id}: LİNKLER bölümünde Test Plan referansı eksik: {tp_id}."
            )

    return errors


def main(argv: List[str]) -> int:
    target_story = parse_cli_args(argv)

    rows = parse_project_flow(target_story)
    if target_story and not rows:
        print(f"{target_story} PROJECT-FLOW tablosunda bulunamadı.")
        return 1

    total_errors = 0
    per_story_errors: Dict[str, List[str]] = {}

    for row in rows:
        errs = check_story_link(row)
        if errs:
            per_story_errors[row.story_id] = errs
            total_errors += len(errs)
        else:
            print(f"OK: {row.story_id}")

    if per_story_errors:
        print("\nDETAYLI HATALAR:")
        for sid, errs in per_story_errors.items():
            print(f"- {sid}:")
            for e in errs:
                print(f"    • {e}")

    if total_errors == 0:
        print("\nPROJECT-FLOW ↔ STORY/AC/TP kontrolleri başarılı ✅")
        return 0

    print(f"\nTOPLAM {total_errors} ZİNCİR HATASI VAR ❌")
    return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
