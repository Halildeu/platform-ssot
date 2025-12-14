#!/usr/bin/env python3
"""
DATA katmanı için SQL stil kontrolleri.

Kullanım (repo kökünden):
  python3 scripts/check_data_sql_style.py

Kurallar (STYLE-DATA-001 ve DATA-PROJECT-LAYOUT ile uyumlu, basitleştirilmiş):
- SELECT * yasak (tüm klasörler).
- Tarih aralıklarında BETWEEN kullanımı istenmez (>= AND < tercih edilir).
- LIMIT kullanımına sadece data/tests/ içinde tolerans (diğer klasörlerde uyarı).

Not:
- Amaç, data review öncesi otomatik uyarı üretmek; nihai karar yine
  data ekibi tarafından verilir.
"""

from __future__ import annotations

import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import List


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"


SELECT_STAR_RE = re.compile(r"\bselect\s+\*", re.IGNORECASE)
BETWEEN_RE = re.compile(r"\bbetween\b", re.IGNORECASE)
LIMIT_RE = re.compile(r"\blimit\b", re.IGNORECASE)


@dataclass
class Issue:
    path: Path
    line_no: int
    kind: str
    line: str


def iter_sql_files() -> List[Path]:
    if not DATA_DIR.exists():
        return []
    return sorted(DATA_DIR.rglob("*.sql"))


def classify_issue(path: Path) -> str:
    """
    Basit isimlendirme: üst klasöre göre.
    """
    try:
        rel = path.relative_to(DATA_DIR)
    except ValueError:
        return "unknown"
    parts = rel.parts
    return parts[0] if parts else "root"


def scan_file(path: Path) -> List[Issue]:
    text = path.read_text(encoding="utf-8", errors="ignore")
    issues: List[Issue] = []
    top = classify_issue(path)

    for i, line in enumerate(text.splitlines(), start=1):
        stripped = line.strip()
        if not stripped or stripped.startswith("--"):
            continue

        if SELECT_STAR_RE.search(line):
            issues.append(Issue(path, i, "SELECT_STAR", line))

        if BETWEEN_RE.search(line):
            issues.append(Issue(path, i, "BETWEEN", line))

        if top != "tests" and LIMIT_RE.search(line):
            issues.append(Issue(path, i, "LIMIT_NON_TEST", line))

    return issues


def main() -> int:
    sql_files = iter_sql_files()
    if not sql_files:
        print("[check_data_sql_style] data/ altında .sql dosyası bulunamadı (skip).")
        return 0

    all_issues: List[Issue] = []
    for path in sql_files:
        all_issues.extend(scan_file(path))

    if not all_issues:
        print("[check_data_sql_style] SQL stil kontrollerinde sorun bulunmadı ✅")
        return 0

    print("[check_data_sql_style] Aşağıdaki SQL stil ihlalleri tespit edildi:\n")
    for iss in all_issues:
        rel = iss.path.relative_to(ROOT)
        print(f"- {iss.kind}: {rel}:{iss.line_no}")
        print(f"    {iss.line.strip()}")
    print()
    print(f"Toplam issue sayısı: {len(all_issues)} ❌")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())

