#!/usr/bin/env python3
"""
BENCH content gate (hard/soft depending on policy).

Goal:
- Enforce minimum BENCH pack content completeness beyond folder/name checks.
- Focuses on:
  - Matrix docs: table presence + minimum row count
  - Gaps docs: trends/gaps/AI blocks minimum counts

Policy:
- docs/03-delivery/SPECS/bench-content-policy.v1.json
"""

from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path


POLICY_PATH = Path("docs/03-delivery/SPECS/bench-content-policy.v1.json")
BENCH_ROOT = Path("docs/01-product/BENCHMARKS")
OUT_REPORT = Path(".autopilot-tmp/flow-mining/bench-content-report.md")

RE_BENCH_FILE = re.compile(r"^BENCH-(?P<num>\d{4})-.*\.md$", re.IGNORECASE)
RE_TBD = re.compile(r"\bTBD\b", re.IGNORECASE)
RE_NUM_HEADING = re.compile(r"(?m)^\s*(?:#+\s*)?(?P<num>\d+)\.\s+(?P<title>.+?)\s*$")
RE_TABLE_HEADER = re.compile(
    r"^\|\s*Alan\s*\|\s*Kapabilite\s*\|\s*Kanıt\s+Türü\s*\|\s*Kaynak\s*\|\s*Tarih\s*\|\s*Not\s*\|\s*$",
    re.IGNORECASE,
)


def norm(s: str) -> str:
    return re.sub(r"\s+", " ", s.strip()).casefold().replace("i̇", "i")


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


@dataclass(frozen=True)
class Section:
    num: int
    title: str
    start: int
    end: int


def extract_sections(txt: str) -> list[Section]:
    out: list[Section] = []
    for m in re.finditer(RE_NUM_HEADING, txt):
        try:
            n = int(m.group("num"))
        except Exception:
            continue
        if 1 <= n <= 7:
            out.append(Section(num=n, title=m.group("title").strip(), start=m.start(), end=m.end()))
    out.sort(key=lambda s: s.start)
    return out


def get_section_body(txt: str, sections: list[Section], num: int) -> str:
    idx = next((i for i, s in enumerate(sections) if s.num == num), None)
    if idx is None:
        return ""
    start = sections[idx].end
    end = sections[idx + 1].start if idx + 1 < len(sections) else len(txt)
    return txt[start:end]


def check_required_sections(path: str, txt: str, require: bool) -> list[str]:
    if not require:
        return []

    required = [
        (1, "AMAÇ"),
        (2, "KAPSAM"),
        (3, "CAPABILITY MATRIX (KANIT STANDARDI)"),
        (4, "TRENDLER"),
        (5, "BOŞLUKLAR (GAPS)"),
        (6, "AI YAPILABİLİRLİK + RİSK KONTROLLERİ"),
        (7, "LİNKLER / KAYNAKLAR"),
    ]

    titles = [(s.num, norm(s.title)) for s in extract_sections(txt)]

    errs: list[str] = []
    cursor = 0
    for n, expected in required:
        expected_title = norm(expected)
        found = False
        for i in range(cursor, len(titles)):
            nn, tt = titles[i]
            if nn == n and tt == expected_title:
                cursor = i + 1
                found = True
                break
        if not found:
            errs.append(f"{path}: missing/ordered section: {n}. {expected}")
            break

    # duplicates check
    counts: dict[tuple[int, str], int] = {}
    for nn, tt in titles:
        counts[(nn, tt)] = counts.get((nn, tt), 0) + 1
    for n, expected in required:
        k = (n, norm(expected))
        if counts.get(k, 0) > 1:
            errs.append(f"{path}: duplicated section heading: {n}. {expected}")
            break

    return errs


def infer_kind_from_filename(name: str) -> str | None:
    low = name.casefold()
    if "matrix" in low:
        return "MATRIX"
    if "gaps" in low:
        return "GAPS"
    return None


def count_table_rows(txt: str) -> tuple[int, bool]:
    lines = txt.splitlines()
    header_idx = None
    for i, ln in enumerate(lines):
        if RE_TABLE_HEADER.match(ln.strip()):
            header_idx = i
            break
    if header_idx is None:
        return 0, False

    rows = 0
    for ln in lines[header_idx + 1 :]:
        s = ln.strip()
        if not s:
            break
        if not s.startswith("|"):
            break
        if s.startswith("|---"):
            continue
        if s.count("|") >= 6:
            rows += 1
    return rows, True


def count_bullets(block: str) -> int:
    c = 0
    for ln in block.splitlines():
        s = ln.strip()
        if s.startswith("- ") or s.startswith("* "):
            c += 1
    return c


def parse_ai_counts(block: str) -> tuple[int, int, int]:
    suitable = 0
    risky = 0
    controls = 0

    state: str | None = None
    for ln in block.splitlines():
        raw = ln.strip()
        if not raw:
            continue

        marker = raw
        if marker.startswith("- ") or marker.startswith("* "):
            marker = marker[2:].strip()
        m = marker.casefold()

        if m.startswith("uygun:"):
            state = "suitable"
            continue
        if (m.startswith("riskli") and ":" in m) or m.startswith("yasak:"):
            state = "risky"
            continue
        if (("guardrail" in m) or ("risk kontrolleri" in m) or m.startswith("kontroller")) and ":" in m:
            state = "controls"
            continue

        # count bullet items
        s = ln.lstrip()
        if not (s.startswith("- ") or s.startswith("* ")):
            continue
        item = s[2:].strip()
        if not item or item.endswith(":"):
            continue

        if state == "suitable":
            suitable += 1
        elif state == "risky":
            risky += 1
        elif state == "controls":
            controls += 1

    return suitable, risky, controls


def main() -> int:
    if not POLICY_PATH.exists():
        print(f"[check_bench_content_policy] FAIL: missing policy: {POLICY_PATH}")
        return 1
    if not BENCH_ROOT.exists():
        print(f"[check_bench_content_policy] FAIL: missing BENCH root: {BENCH_ROOT}")
        return 1

    policy = read_json(POLICY_PATH)
    enabled = bool(policy.get("enabled", False))
    rules = policy.get("rules") or {}

    require_sections = bool(rules.get("require_sections_1_to_7", True))
    forbid_tbd_anywhere = bool(rules.get("forbid_tbd_anywhere", False))
    require_table_header = bool(rules.get("require_matrix_table_header", True))

    min_matrix_rows = int(rules.get("min_matrix_rows", 0))
    min_trends = int(rules.get("min_trends", 0))
    min_gaps = int(rules.get("min_gaps", 0))
    min_ai_suitable = int(rules.get("min_ai_suitable", 0))
    min_ai_risky = int(rules.get("min_ai_risky", 0))
    min_ai_controls = int(rules.get("min_ai_controls", 0))

    scanned = 0
    violations: list[str] = []

    for p in sorted(BENCH_ROOT.rglob("BENCH-*.md")):
        if not p.is_file():
            continue
        m = RE_BENCH_FILE.match(p.name)
        if not m:
            continue

        scanned += 1
        rel = p.as_posix()
        txt = read_text(p)

        if forbid_tbd_anywhere and RE_TBD.search(txt):
            violations.append(f"{rel}: contains forbidden TBD")
            continue

        violations.extend(check_required_sections(rel, txt, require=require_sections))

        kind = infer_kind_from_filename(p.name)
        if kind is None:
            violations.append(f"{rel}: cannot infer kind from filename (expected matrix/gaps token)")
            continue

        if kind == "MATRIX":
            rows, has_header = count_table_rows(txt)
            if require_table_header and not has_header:
                violations.append(f"{rel}: missing matrix table header")
                continue
            if rows < min_matrix_rows:
                violations.append(f"{rel}: min_matrix_rows not met (have={rows}, need={min_matrix_rows})")
                continue

        if kind == "GAPS":
            sections = extract_sections(txt)
            trend_block = get_section_body(txt, sections, 4)
            gaps_block = get_section_body(txt, sections, 5)
            ai_block = get_section_body(txt, sections, 6)

            trends = count_bullets(trend_block)
            gaps = count_bullets(gaps_block)
            ai_s, ai_r, ai_c = parse_ai_counts(ai_block)

            if trends < min_trends:
                violations.append(f"{rel}: min_trends not met (have={trends}, need={min_trends})")
            if gaps < min_gaps:
                violations.append(f"{rel}: min_gaps not met (have={gaps}, need={min_gaps})")
            if ai_s < min_ai_suitable:
                violations.append(f"{rel}: min_ai_suitable not met (have={ai_s}, need={min_ai_suitable})")
            if ai_r < min_ai_risky:
                violations.append(f"{rel}: min_ai_risky not met (have={ai_r}, need={min_ai_risky})")
            if ai_c < min_ai_controls:
                violations.append(f"{rel}: min_ai_controls not met (have={ai_c}, need={min_ai_controls})")

    OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ")
    lines: list[str] = []
    lines.append("# BENCH Content Report (local-only)")
    lines.append("")
    lines.append(f"- ts_utc: {ts}")
    lines.append(f"- enabled: {enabled}")
    lines.append(f"- scanned_files: {scanned}")
    lines.append(f"- violations: {len(violations)}")
    lines.append("")
    if violations:
        for v in violations[:200]:
            lines.append(f"- {v}")
        if len(violations) > 200:
            lines.append(f"- ... ({len(violations) - 200} more)")
    else:
        lines.append("- none")
    OUT_REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"[check_bench_content_policy] report={OUT_REPORT} violations={len(violations)} enabled={enabled}")

    if enabled and violations:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
