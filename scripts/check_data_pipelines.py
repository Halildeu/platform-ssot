#!/usr/bin/env python3
"""
DATA katmanı için pipeline kalite kontrolleri (Python script'ler).

Kullanım (repo kökünden):
  python3 scripts/check_data_pipelines.py

Kontroller (STYLE-DATA-001'e göre basitleştirilmiş):
- Bare `except:` veya `except Exception:` + `pass` ile swallow edilen exception'lar.
- TODO: ileride config hard-code / logging standartları gibi kontroller eklenebilir.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path
from typing import List


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"


PIPE_DIRS = ["pipelines", "incremental", "full-load", "transforms", "scripts"]

EXCEPT_PASS_RE = re.compile(r"^\s*except(\s+Exception)?\s*:\s*(#.*)?$", re.MULTILINE)
PASS_ONLY_RE = re.compile(r"^\s*pass\s*(#.*)?$", re.MULTILINE)


@dataclass
class PipeIssue:
    path: Path
    line_no: int
    kind: str
    line: str


def iter_pipeline_files() -> List[Path]:
    if not DATA_DIR.exists():
        return []
    paths: List[Path] = []
    for d in PIPE_DIRS:
        p = DATA_DIR / d
        if p.exists():
            paths.extend(sorted(p.rglob("*.py")))
    return paths


def scan_pipeline(path: Path) -> List[PipeIssue]:
    text = path.read_text(encoding="utf-8", errors="ignore")
    issues: List[PipeIssue] = []

    # Çok basit bir yaklaşım: except satırını ve hemen sonrasındaki satırı incele.
    lines = text.splitlines()
    for i, line in enumerate(lines, start=1):
        if EXCEPT_PASS_RE.match(line):
            # Sonraki satır sadece "pass" ise swallow edilmiş olabilir.
            next_line = lines[i] if i < len(lines) else ""
            if PASS_ONLY_RE.match(next_line):
                issues.append(PipeIssue(path, i, "EXCEPT_PASS", line))

    return issues


def main() -> int:
    py_files = iter_pipeline_files()
    if not py_files:
        print("[check_data_pipelines] data/ altında pipeline Python dosyası bulunamadı (skip).")
        return 0

    all_issues: List[PipeIssue] = []
    for path in py_files:
        all_issues.extend(scan_pipeline(path))

    if not all_issues:
        print("[check_data_pipelines] Pipeline exception kontrollerinde sorun bulunmadı ✅")
        return 0

    print("[check_data_pipelines] Aşağıdaki pipeline exception sorunları tespit edildi:\n")
    for iss in all_issues:
        rel = iss.path.relative_to(ROOT)
        print(f"- {iss.kind}: {rel}:{iss.line_no}")
        print(f"    {iss.line.strip()}")
    print()
    print(f"Toplam issue sayısı: {len(all_issues)} ❌")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())

