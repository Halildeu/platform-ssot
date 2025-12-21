#!/usr/bin/env python3
"""
Delivery zincirinde (STORY/AC/TP + PROJECT-FLOW) duplicate ID kontrolü.

Amaç:
- docs/03-delivery/STORIES, ACCEPTANCE, TEST-PLANS altında yer alan dokümanlarda
  `ID:` meta değerlerinin tekil olmasını garanti etmek.
- docs/03-delivery/PROJECT-FLOW.tsv içindeki `Story ID` ve `Acceptance` alanlarında
  aynı ID'nin birden fazla satırda tekrar etmesini engellemek.

Notlar:
- Bu script "referans" kullanımını (PROJECT-FLOW'da STORY/AC geçmesi gibi) duplicate
  saymaz; sadece "tanım" seviyesinde duplicate ve PROJECT-FLOW içi tekrarları yakalar.
"""

from __future__ import annotations

import re
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import DefaultDict, Dict, List, Optional, Sequence, Tuple


ROOT = Path(__file__).resolve().parents[1]

PROJECT_FLOW_TSV = ROOT / "docs/03-delivery/PROJECT-FLOW.tsv"

ID_LINE_RE = re.compile(r"^ID:\s*([A-Z]+-\d{4})\b")


@dataclass(frozen=True)
class DocType:
    name: str
    glob: str
    id_prefix: str


DOC_TYPES: Sequence[DocType] = (
    DocType(name="STORY", glob="docs/03-delivery/STORIES/STORY-*.md", id_prefix="STORY-"),
    DocType(name="ACCEPTANCE", glob="docs/03-delivery/ACCEPTANCE/AC-*.md", id_prefix="AC-"),
    DocType(name="TEST-PLAN", glob="docs/03-delivery/TEST-PLANS/TP-*.md", id_prefix="TP-"),
)


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def extract_id_from_markdown(path: Path) -> Optional[str]:
    for line in read_text(path).splitlines()[:20]:
        m = ID_LINE_RE.match(line.strip())
        if m:
            return m.group(1)
    return None


def collect_defined_doc_ids() -> Tuple[DefaultDict[str, List[Path]], List[str]]:
    id_to_paths: DefaultDict[str, List[Path]] = defaultdict(list)
    errors: List[str] = []

    for dt in DOC_TYPES:
        for path in sorted(ROOT.glob(dt.glob)):
            doc_id = extract_id_from_markdown(path)
            if not doc_id:
                errors.append(f"{dt.name}: ID meta satırı yok: {path}")
                continue
            if not doc_id.startswith(dt.id_prefix):
                errors.append(
                    f"{dt.name}: ID prefix uyumsuz: {path} (found={doc_id}, expected_prefix={dt.id_prefix})"
                )
                continue
            id_to_paths[doc_id].append(path)

    return id_to_paths, errors


def parse_project_flow_tsv() -> Tuple[List[Tuple[str, int]], List[Tuple[str, int]], List[str]]:
    errors: List[str] = []
    story_ids: List[Tuple[str, int]] = []
    acceptance_ids: List[Tuple[str, int]] = []

    if not PROJECT_FLOW_TSV.exists():
        errors.append(f"PROJECT-FLOW TSV bulunamadı: {PROJECT_FLOW_TSV}")
        return story_ids, acceptance_ids, errors

    lines = PROJECT_FLOW_TSV.read_text(encoding="utf-8").splitlines()
    if not lines:
        errors.append(f"PROJECT-FLOW TSV boş: {PROJECT_FLOW_TSV}")
        return story_ids, acceptance_ids, errors

    header = [h.strip() for h in lines[0].split("\t")]
    idx: Dict[str, int] = {name: i for i, name in enumerate(header) if name}
    if "Story ID" not in idx or "Acceptance" not in idx:
        errors.append("PROJECT-FLOW TSV kolonları eksik: Story ID, Acceptance")
        return story_ids, acceptance_ids, errors

    for line_no, line in enumerate(lines[1:], start=2):
        if not line.strip():
            continue
        parts = line.split("\t")
        if len(parts) < len(header):
            parts += [""] * (len(header) - len(parts))

        story_id = (parts[idx["Story ID"]] or "").strip()
        if story_id.startswith("STORY-"):
            story_ids.append((story_id, line_no))

        acceptance_cell = (parts[idx["Acceptance"]] or "").strip()
        m = re.search(r"AC-\d{4}", acceptance_cell)
        if m:
            acceptance_ids.append((m.group(0), line_no))

    return story_ids, acceptance_ids, errors


def find_duplicates(items: Sequence[Tuple[str, int]]) -> Dict[str, List[int]]:
    seen: DefaultDict[str, List[int]] = defaultdict(list)
    for value, line_no in items:
        seen[value].append(line_no)
    return {k: v for k, v in seen.items() if len(v) > 1}


def main() -> int:
    total_errors: List[str] = []

    print("== Delivery docs (STORY/AC/TP) ID uniqueness ==")
    id_to_paths, doc_errors = collect_defined_doc_ids()
    total_errors.extend(doc_errors)

    doc_collisions = {k: v for k, v in id_to_paths.items() if len(v) > 1}
    for doc_id, paths in sorted(doc_collisions.items()):
        total_errors.append(
            f"Duplicate ID in delivery docs: {doc_id} used in {len(paths)} files: "
            + ", ".join(str(p) for p in paths)
        )

    if doc_errors or doc_collisions:
        print(f"- FAIL: {len(doc_errors)} meta error(s), {len(doc_collisions)} duplicate ID(s)")
    else:
        print("- PASS")

    print("\n== PROJECT-FLOW.tsv ID uniqueness ==")
    story_ids, acceptance_ids, pf_errors = parse_project_flow_tsv()
    total_errors.extend(pf_errors)

    story_dups = find_duplicates(story_ids)
    ac_dups = find_duplicates(acceptance_ids)

    for story_id, lines in sorted(story_dups.items()):
        total_errors.append(
            f"Duplicate Story ID in PROJECT-FLOW.tsv: {story_id} at lines {', '.join(map(str, lines))}"
        )
    for ac_id, lines in sorted(ac_dups.items()):
        total_errors.append(
            f"Duplicate Acceptance ID in PROJECT-FLOW.tsv: {ac_id} at lines {', '.join(map(str, lines))}"
        )

    if pf_errors or story_dups or ac_dups:
        print(f"- FAIL: {len(pf_errors)} parse error(s), {len(story_dups)} STORY dup(s), {len(ac_dups)} AC dup(s)")
    else:
        print("- PASS")

    if total_errors:
        print("\nERRORS:")
        for err in total_errors:
            print(f"- {err}")
        return 1

    print("\nALL CHECKS PASSED")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

