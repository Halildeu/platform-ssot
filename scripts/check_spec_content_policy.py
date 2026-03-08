#!/usr/bin/env python3
"""
SPEC content gate (hard/soft depending on policy).

Goal:
- Enforce minimum SPEC contract (SSOT) completeness beyond heading-contract checks.
- Focuses on:
  - no TBD drift
  - contract section is not empty (and non-stub has minimum density)
  - governance and links sections are not empty

Policy:
- docs-ssot/03-delivery/SPECS/spec-content-policy.v1.json
"""

from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path


POLICY_PATH = Path("docs-ssot/03-delivery/SPECS/spec-content-policy.v1.json")
SPEC_DIR = Path("docs/03-delivery/SPECS")
OUT_REPORT = Path(".autopilot-tmp/flow-mining/spec-content-report.md")

RE_SPEC_FILE = re.compile(r"^SPEC-(?P<num>\d{4})-.*\.md$", re.IGNORECASE)
RE_TBD = re.compile(r"\bTBD\b", re.IGNORECASE)
RE_NUM_HEADING = re.compile(r"(?m)^\s*(?:#+\s*)?(?P<num>\d+)\.\s+(?P<title>.+?)\s*$")
RE_DOCS_REF = re.compile(r"\bdocs/[A-Za-z0-9_.\-/]+\b")
RE_STUB_SIGNAL = re.compile(r"\bstub\b", re.IGNORECASE)
RE_SUBHEAD = re.compile(r"(?m)^\s*#{3,6}\s+.+$")


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


def is_stub_doc(path: Path, txt: str) -> bool:
    if "-stub" in path.name.casefold():
        return True
    head = "\n".join(txt.splitlines()[:40])
    return bool(RE_STUB_SIGNAL.search(head))


def check_required_sections(path: str, txt: str, *, require: bool) -> list[str]:
    if not require:
        return []

    required = [
        (1, "AMAÇ"),
        (2, "KAPSAM"),
        (3, "KONTRAT (SSOT)"),
        (4, "GOVERNANCE (DEĞİŞİKLİK POLİTİKASI)"),
        (5, "LİNKLER"),
    ]

    titles = [(s.num, norm(s.title)) for s in extract_sections(txt, max_num=5)]
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
        print(f"[check_spec_content_policy] FAIL: missing policy: {POLICY_PATH}")
        return 1
    if not SPEC_DIR.exists():
        print(f"[check_spec_content_policy] FAIL: missing SPEC dir: {SPEC_DIR}")
        return 1

    policy = read_json(POLICY_PATH)
    enabled = bool(policy.get("enabled", False))
    rules = policy.get("rules") or {}

    forbid_tbd_anywhere = bool(rules.get("forbid_tbd_anywhere", False))
    require_sections = bool(rules.get("require_sections_1_to_5", True))
    allow_stub_specs = bool(rules.get("allow_stub_specs", True))

    min_contract_bullets_non_stub = int(rules.get("min_contract_bullets_non_stub", 0))
    min_governance_bullets = int(rules.get("min_governance_bullets", 0))
    min_docs_refs_in_links = int(rules.get("min_docs_refs_in_links", 0))

    scanned = 0
    violations: list[str] = []

    for p in sorted(SPEC_DIR.glob("SPEC-*.md")):
        if not p.is_file():
            continue
        if not RE_SPEC_FILE.match(p.name):
            continue

        scanned += 1
        rel = p.as_posix()
        txt = read_text(p)
        stub = is_stub_doc(p, txt)

        if forbid_tbd_anywhere and RE_TBD.search(txt):
            violations.append(f"{rel}: contains forbidden TBD")
            continue

        violations.extend(check_required_sections(rel, txt, require=require_sections))

        sections = extract_sections(txt, max_num=5)
        body3 = get_section_body(txt, sections, 3)
        body4 = get_section_body(txt, sections, 4)
        body5 = get_section_body(txt, sections, 5)

        # 3) contract minimal (non-stub only)
        if stub and not allow_stub_specs:
            violations.append(f"{rel}: stub specs are not allowed by policy")
        if (not stub) and min_contract_bullets_non_stub > 0:
            b3 = count_bullets(body3)
            subheads = len(RE_SUBHEAD.findall(body3))
            if b3 < min_contract_bullets_non_stub and subheads == 0:
                violations.append(
                    f"{rel}: contract too thin (bullets={b3}, subheads={subheads}, need_bullets={min_contract_bullets_non_stub} or subhead>=1)"
                )

        # 4) governance minimal
        if min_governance_bullets > 0:
            b4 = count_bullets(body4)
            if b4 < min_governance_bullets:
                violations.append(f"{rel}: governance bullets too low (have={b4}, need={min_governance_bullets})")

        # 5) links must contain docs/ refs (portable)
        if min_docs_refs_in_links > 0:
            refs = sorted(set(RE_DOCS_REF.findall(body5)))
            if len(refs) < min_docs_refs_in_links:
                violations.append(f"{rel}: links docs refs too low (have={len(refs)}, need={min_docs_refs_in_links})")

    OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ")
    lines: list[str] = []
    lines.append("# SPEC Content Report (local-only)")
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

    print(f"[check_spec_content_policy] report={OUT_REPORT} violations={len(violations)} enabled={enabled}")

    if enabled and violations:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
