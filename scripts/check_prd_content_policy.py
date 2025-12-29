#!/usr/bin/env python3
"""
PRD content gate (hard/soft depending on policy).

Goal:
- Enforce minimum PRD content completeness beyond heading-contract checks.
- Focuses on:
  - no TBD drift
  - minimum bullet density in critical sections
  - at least one repo-internal docs reference in links

Policy:
- docs/03-delivery/SPECS/prd-content-policy.v1.json
"""

from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path


POLICY_PATH = Path("docs/03-delivery/SPECS/prd-content-policy.v1.json")
PRD_ROOT = Path("docs/01-product/PRD")
OUT_REPORT = Path(".autopilot-tmp/flow-mining/prd-content-report.md")

RE_PRD_FILE = re.compile(r"^PRD-(?P<num>\d{4})-.*\.md$", re.IGNORECASE)
RE_TBD = re.compile(r"\bTBD\b", re.IGNORECASE)
RE_NUM_HEADING = re.compile(r"(?m)^\s*(?:#+\s*)?(?P<num>\d+)\.\s+(?P<title>.+?)\s*$")
RE_DOCS_REF = re.compile(r"\bdocs/[A-Za-z0-9_.\-/]+\b")


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


def extract_sections(txt: str, *, max_num: int) -> list[Section]:
    out: list[Section] = []
    for m in re.finditer(RE_NUM_HEADING, txt):
        try:
            n = int(m.group("num"))
        except Exception:
            continue
        if 1 <= n <= max_num:
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


def count_bullets(block: str) -> int:
    c = 0
    for ln in block.splitlines():
        s = ln.strip()
        if s.startswith("- ") or s.startswith("* "):
            c += 1
    return c


def check_required_sections(path: str, txt: str, *, require: bool) -> list[str]:
    if not require:
        return []

    required = [
        (1, "AMAÇ"),
        (2, "KAPSAM"),
        (3, "KULLANICI SENARYOLARI"),
        (4, "DAVRANIŞ / GEREKSİNİMLER"),
        (5, "NON-GOALS (KAPSAM DIŞI)"),
        (6, "ACCEPTANCE KRİTERLERİ ÖZETİ"),
        (7, "RİSKLER / BAĞIMLILIKLAR"),
        (8, "ÖZET"),
        (9, "LİNKLER / SONRAKİ ADIMLAR"),
    ]

    titles = [(s.num, norm(s.title)) for s in extract_sections(txt, max_num=9)]
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
    return errs


def main() -> int:
    if not POLICY_PATH.exists():
        print(f"[check_prd_content_policy] FAIL: missing policy: {POLICY_PATH}")
        return 1
    if not PRD_ROOT.exists():
        print(f"[check_prd_content_policy] FAIL: missing PRD root: {PRD_ROOT}")
        return 1

    policy = read_json(POLICY_PATH)
    enabled = bool(policy.get("enabled", False))
    rules = policy.get("rules") or {}

    forbid_tbd_anywhere = bool(rules.get("forbid_tbd_anywhere", False))
    require_sections = bool(rules.get("require_sections_1_to_9", True))

    min_user_scenarios = int(rules.get("min_user_scenarios", 0))
    min_requirements = int(rules.get("min_requirements", 0))
    min_acceptance_summary = int(rules.get("min_acceptance_summary", 0))
    min_risks_or_dependencies = int(rules.get("min_risks_or_dependencies", 0))
    min_docs_refs_in_links = int(rules.get("min_docs_refs_in_links", 0))

    scanned = 0
    violations: list[str] = []

    for p in sorted(PRD_ROOT.glob("PRD-*.md")):
        if not p.is_file():
            continue
        m = RE_PRD_FILE.match(p.name)
        if not m:
            continue

        scanned += 1
        rel = p.as_posix()
        txt = read_text(p)

        if forbid_tbd_anywhere and RE_TBD.search(txt):
            violations.append(f"{rel}: contains forbidden TBD")
            continue

        violations.extend(check_required_sections(rel, txt, require=require_sections))

        sections = extract_sections(txt, max_num=9)

        # 3) user scenarios
        if min_user_scenarios > 0:
            b3 = count_bullets(get_section_body(txt, sections, 3))
            if b3 < min_user_scenarios:
                violations.append(f"{rel}: section 3 bullets too low (have={b3}, need={min_user_scenarios})")

        # 4) requirements
        if min_requirements > 0:
            b4 = count_bullets(get_section_body(txt, sections, 4))
            if b4 < min_requirements:
                violations.append(f"{rel}: section 4 bullets too low (have={b4}, need={min_requirements})")

        # 6) acceptance summary
        if min_acceptance_summary > 0:
            b6 = count_bullets(get_section_body(txt, sections, 6))
            if b6 < min_acceptance_summary:
                violations.append(f"{rel}: section 6 bullets too low (have={b6}, need={min_acceptance_summary})")

        # 7) risks/deps
        if min_risks_or_dependencies > 0:
            b7 = count_bullets(get_section_body(txt, sections, 7))
            if b7 < min_risks_or_dependencies:
                violations.append(f"{rel}: section 7 bullets too low (have={b7}, need={min_risks_or_dependencies})")

        # 9) links must contain docs/ refs (portable)
        if min_docs_refs_in_links > 0:
            body9 = get_section_body(txt, sections, 9)
            refs = sorted(set(RE_DOCS_REF.findall(body9)))
            if len(refs) < min_docs_refs_in_links:
                violations.append(f"{rel}: section 9 docs refs too low (have={len(refs)}, need={min_docs_refs_in_links})")

    OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ")
    lines: list[str] = []
    lines.append("# PRD Content Report (local-only)")
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

    print(f"[check_prd_content_policy] report={OUT_REPORT} violations={len(violations)} enabled={enabled}")

    if enabled and violations:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

