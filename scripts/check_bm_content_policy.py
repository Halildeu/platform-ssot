#!/usr/bin/env python3
"""
BM content gate (hard/soft depending on policy).

Goal:
- Enforce minimum BM pack content completeness beyond folder/name checks.
- Focuses on BM items (DEC/GRD/ASM/VAL/RSK and KPI for MET docs).

Policy:
- docs/03-delivery/SPECS/bm-content-policy.v1.json
"""

from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path


POLICY_PATH = Path("docs/03-delivery/SPECS/bm-content-policy.v1.json")
BM_ROOT = Path("docs/01-product/BUSINESS-MASTERS")
OUT_REPORT = Path(".autopilot-tmp/flow-mining/bm-content-report.md")

RE_BM_FILE = re.compile(r"^BM-(?P<num>\d{4})-.*\.md$", re.IGNORECASE)
RE_BM_ITEM = re.compile(
    r"\bBM-(?P<bm>\d{4})-(?P<doc>CORE|CTRL|MET)-(?P<type>DEC|GRD|KPI|RSK|ASM|VAL)-(?P<seq>\d{3})\b"
)
RE_NUM_HEADING = re.compile(r"(?m)^\s*(?P<num>\d+)\.\s+(?P<title>.+?)\s*$")

RE_TBD = re.compile(r"\bTBD\b", re.IGNORECASE)


def norm(s: str) -> str:
    return re.sub(r"\s+", " ", s.strip()).casefold().replace("i̇", "i")


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


@dataclass(frozen=True)
class BmItem:
    bm: str
    doc: str
    typ: str
    seq: str


def expected_doc_code_from_filename(filename: str) -> str | None:
    low = filename.casefold()
    if "core" in low:
        return "CORE"
    if "controls" in low:
        return "CTRL"
    if "metrics" in low:
        return "MET"
    return None


def extract_section_titles(txt: str) -> list[tuple[int, str]]:
    out: list[tuple[int, str]] = []
    for m in re.finditer(RE_NUM_HEADING, txt):
        try:
            n = int(m.group("num"))
        except Exception:
            continue
        if 1 <= n <= 10:
            out.append((n, m.group("title").strip()))
    return out


def check_required_sections(path: str, txt: str, require: bool) -> list[str]:
    if not require:
        return []

    required = [
        (1, "AMAÇ"),
        (2, "KAPSAM"),
        (3, "KAPSAM DIŞI"),
        (4, "İŞLETİM MODELİ"),
        (5, "KARAR NOKTALARI (ID'Lİ)"),
        (6, "GUARDRAIL'LER (ID'Lİ)"),
        (7, "VARSAYIMLAR (ID'Lİ)"),
        (8, "DOĞRULAMA PLANI (ID'Lİ)"),
        (9, "TOP 10 SÜRPRİZ ÖNLEYİCİ (ID'Lİ)"),
        (10, "LİNKLER"),
    ]

    titles = extract_section_titles(txt)
    seq = [(n, norm(t)) for (n, t) in titles]

    errs: list[str] = []
    cursor = 0
    for n, expected in required:
        expected_n = n
        expected_title = norm(expected)
        found = False
        for i in range(cursor, len(seq)):
            nn, tt = seq[i]
            if nn == expected_n and tt == expected_title:
                cursor = i + 1
                found = True
                break
        if not found:
            errs.append(f"{path}: missing/ordered section: {n}. {expected}")
            break

    # Ensure no duplicates for 1..10 headings
    counts: dict[tuple[int, str], int] = {}
    for nn, tt in seq:
        k = (nn, tt)
        counts[k] = counts.get(k, 0) + 1
    for n, expected in required:
        k = (n, norm(expected))
        if counts.get(k, 0) > 1:
            errs.append(f"{path}: duplicated section heading: {n}. {expected}")
            break

    return errs


def extract_items(txt: str) -> list[BmItem]:
    items: list[BmItem] = []
    for m in re.finditer(RE_BM_ITEM, txt):
        items.append(BmItem(bm=m.group("bm"), doc=m.group("doc"), typ=m.group("type"), seq=m.group("seq")))
    return items


def main() -> int:
    if not POLICY_PATH.exists():
        print(f"[check_bm_content_policy] FAIL: missing policy: {POLICY_PATH}")
        return 1
    if not BM_ROOT.exists():
        print(f"[check_bm_content_policy] FAIL: missing BM root: {BM_ROOT}")
        return 1

    policy = read_json(POLICY_PATH)
    enabled = bool(policy.get("enabled", False))
    rules = policy.get("rules") or {}

    require_sections = bool(rules.get("require_sections_1_to_10", True))
    require_id_prefix_matches_file = bool(rules.get("require_id_prefix_matches_file", True))
    forbid_tbd_anywhere = bool(rules.get("forbid_tbd_anywhere", False))

    min_dec = int(rules.get("min_dec", 1))
    min_grd = int(rules.get("min_grd", 1))
    min_asm = int(rules.get("min_asm", 1))
    min_val = int(rules.get("min_val", 1))
    min_rsk = int(rules.get("min_rsk", 0))
    min_kpi_met = int(rules.get("min_kpi_for_met_doc", 0))

    scanned = 0
    violations: list[str] = []

    for p in sorted(BM_ROOT.rglob("BM-*.md")):
        if not p.is_file():
            continue

        m = RE_BM_FILE.match(p.name)
        if not m:
            continue

        scanned += 1
        bm_num = m.group("num")
        rel = p.as_posix()

        txt = read_text(p)

        if forbid_tbd_anywhere and RE_TBD.search(txt):
            violations.append(f"{rel}: contains forbidden TBD")
            continue

        violations.extend(check_required_sections(rel, txt, require=require_sections))

        items = extract_items(txt)
        if not items:
            violations.append(f"{rel}: no BM_ITEM_ID found")
            continue

        ids = [f"BM-{it.bm}-{it.doc}-{it.typ}-{it.seq}" for it in items]
        if len(set(ids)) != len(ids):
            violations.append(f"{rel}: duplicate BM_ITEM_ID detected")

        if require_id_prefix_matches_file:
            wrong = sorted({it.bm for it in items if it.bm != bm_num})
            if wrong:
                violations.append(f"{rel}: BM number mismatch (file=BM-{bm_num}, found={wrong})")

        expected_doc = expected_doc_code_from_filename(p.name)
        if expected_doc is None:
            violations.append(f"{rel}: cannot infer doc code from filename (expected core/controls/metrics token)")
            continue

        def cnt(doc: str, typ: str) -> int:
            return sum(1 for it in items if it.doc == doc and it.typ == typ)

        # Core/CTRL/MET all require the same minimum structure.
        if cnt(expected_doc, "DEC") < min_dec:
            violations.append(f"{rel}: min_dec not met for {expected_doc} (have={cnt(expected_doc, 'DEC')}, need={min_dec})")
        if cnt(expected_doc, "GRD") < min_grd:
            violations.append(f"{rel}: min_grd not met for {expected_doc} (have={cnt(expected_doc, 'GRD')}, need={min_grd})")
        if cnt(expected_doc, "ASM") < min_asm:
            violations.append(f"{rel}: min_asm not met for {expected_doc} (have={cnt(expected_doc, 'ASM')}, need={min_asm})")
        if cnt(expected_doc, "VAL") < min_val:
            violations.append(f"{rel}: min_val not met for {expected_doc} (have={cnt(expected_doc, 'VAL')}, need={min_val})")
        if cnt(expected_doc, "RSK") < min_rsk:
            violations.append(f"{rel}: min_rsk not met for {expected_doc} (have={cnt(expected_doc, 'RSK')}, need={min_rsk})")

        if expected_doc == "MET" and min_kpi_met > 0:
            if cnt("MET", "KPI") < min_kpi_met:
                violations.append(f"{rel}: min_kpi_for_met_doc not met (have={cnt('MET', 'KPI')}, need={min_kpi_met})")

    OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ")
    lines: list[str] = []
    lines.append("# BM Content Report (local-only)")
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

    print(f"[check_bm_content_policy] report={OUT_REPORT} violations={len(violations)} enabled={enabled}")

    if enabled and violations:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

