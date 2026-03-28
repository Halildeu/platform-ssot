#!/usr/bin/env python3
"""
TRACE content gate (hard/soft depending on policy).

Goal:
- Enforce minimum TRACE pack completeness beyond folder/name checks.
- Focuses on schema correctness + basic drift prevention:
  - required columns exist
  - BM_ITEM_ID is well-formed and exists in BM packs
  - mapping_quality values are valid
  - PLATFORM_SPEC rows include platform_capability in notes
  - (Exemplar) full coverage for selected trace files

Policy:
- docs-ssot/03-delivery/SPECS/trace-content-policy.v1.json
"""

from __future__ import annotations

import csv
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path


POLICY_PATH = Path("docs-ssot/03-delivery/SPECS/trace-content-policy.v1.json")
TRACE_DIR = Path("docs/03-delivery/TRACES")
BM_ROOT = Path("docs/01-product/BUSINESS-MASTERS")
OUT_REPORT = Path(".autopilot-tmp/flow-mining/trace-content-report.md")

RE_TBD = re.compile(r"\bTBD\b", re.IGNORECASE)
RE_BM_ITEM_ID = re.compile(r"^BM-(?P<bm>\d{4})-(?P<doc>CORE|CTRL|MET)-(?P<typ>DEC|GRD|KPI|RSK|ASM|VAL)-(?P<seq>\d{3})$")


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def collect_all_bm_item_ids() -> set[str]:
    found: set[str] = set()
    rx = re.compile(r"\bBM-(\d{4})-(CORE|CTRL|MET)-(DEC|GRD|KPI|RSK|ASM|VAL)-(\d{3})\b")
    for p in BM_ROOT.rglob("BM-*.md"):
        if not p.is_file():
            continue
        txt = read_text(p)
        for m in rx.finditer(txt):
            found.add(m.group(0))
    return found


def main() -> int:
    if not POLICY_PATH.exists():
        print(f"[check_trace_content_policy] FAIL: missing policy: {POLICY_PATH}")
        return 1
    if not TRACE_DIR.exists():
        print(f"[check_trace_content_policy] FAIL: missing TRACE dir: {TRACE_DIR}")
        return 1
    if not BM_ROOT.exists():
        print(f"[check_trace_content_policy] FAIL: missing BM root: {BM_ROOT}")
        return 1

    policy = read_json(POLICY_PATH)
    enabled = bool(policy.get("enabled", False))
    rules = policy.get("rules") or {}

    forbid_tbd_anywhere = bool(rules.get("forbid_tbd_anywhere", False))
    required_columns = [str(x) for x in (rules.get("required_columns") or [])]
    allowed_target_types = {str(x).strip().upper() for x in (rules.get("allowed_target_types") or [])}
    allowed_mapping_quality = {str(x).strip().lower() for x in (rules.get("allowed_mapping_quality") or [])}

    require_bm_item_exists = bool(rules.get("require_bm_item_exists", True))
    require_bm_section_matches_item = bool(rules.get("require_bm_section_matches_item", True))
    require_notes_nonempty = bool(rules.get("require_notes_nonempty", True))
    require_platform_spec_capability_note = bool(rules.get("require_platform_spec_capability_note", True))
    full_coverage_trace_files = {str(x) for x in (rules.get("full_coverage_trace_files") or [])}

    if not required_columns:
        print("[check_trace_content_policy] FAIL: policy.rules.required_columns is empty")
        return 1

    if not allowed_target_types:
        print("[check_trace_content_policy] FAIL: policy.rules.allowed_target_types is empty")
        return 1

    if not allowed_mapping_quality:
        print("[check_trace_content_policy] FAIL: policy.rules.allowed_mapping_quality is empty")
        return 1

    bm_items = collect_all_bm_item_ids()

    scanned = 0
    violations: list[str] = []

    for tf in sorted(TRACE_DIR.glob("TRACE-*.tsv")):
        if not tf.is_file():
            continue
        scanned += 1
        rel = tf.as_posix()
        raw = tf.read_text(encoding="utf-8").splitlines()
        if not raw:
            violations.append(f"{rel}: empty trace file")
            continue

        if forbid_tbd_anywhere and RE_TBD.search("\n".join(raw)):
            violations.append(f"{rel}: contains forbidden TBD")
            continue

        reader = csv.DictReader(raw, delimiter="\t")
        fieldnames = reader.fieldnames or []
        missing_cols = [c for c in required_columns if c not in fieldnames]
        if missing_cols:
            violations.append(f"{rel}: missing required columns: {missing_cols}")
            continue

        trace_bm_items: set[str] = set()
        trace_bm_nums: set[str] = set()

        for i, row in enumerate(reader, start=2):
            bm_item = (row.get("BM_ITEM_ID") or "").strip()
            bm_section = (row.get("BM_SECTION") or "").strip().upper()
            target_type = (row.get("TARGET_TYPE") or "").strip().upper()
            target_id = (row.get("TARGET_ID") or "").strip()
            mapping_quality = (row.get("mapping_quality") or "").strip().lower()
            notes = (row.get("NOTES") or "").strip()

            m = RE_BM_ITEM_ID.match(bm_item)
            if not m:
                violations.append(f"{rel}:{i}: invalid BM_ITEM_ID: {bm_item!r}")
                continue

            trace_bm_items.add(bm_item)
            trace_bm_nums.add(m.group("bm"))

            if require_bm_item_exists and bm_item not in bm_items:
                violations.append(f"{rel}:{i}: BM_ITEM_ID not found in BM packs: {bm_item}")

            if require_bm_section_matches_item:
                expected_section = m.group("doc")
                if bm_section != expected_section:
                    violations.append(f"{rel}:{i}: BM_SECTION mismatch (expected={expected_section}, got={bm_section}) for {bm_item}")

            if target_type not in allowed_target_types:
                violations.append(f"{rel}:{i}: invalid TARGET_TYPE: {target_type!r}")
            if not target_id:
                violations.append(f"{rel}:{i}: empty TARGET_ID (type={target_type})")

            if mapping_quality not in allowed_mapping_quality:
                violations.append(f"{rel}:{i}: invalid mapping_quality: {mapping_quality!r}")

            if require_notes_nonempty and not notes:
                violations.append(f"{rel}:{i}: empty NOTES")

            if target_type == "PLATFORM_SPEC" and require_platform_spec_capability_note:
                if "platform_capability:" not in notes:
                    violations.append(f"{rel}:{i}: PLATFORM_SPEC row missing platform_capability in NOTES")

        if tf.name in full_coverage_trace_files:
            expected: set[str] = set()
            for bm_num in trace_bm_nums:
                expected |= {x for x in bm_items if x.startswith(f"BM-{bm_num}-")}
            missing_items = sorted(expected - trace_bm_items)
            if missing_items:
                sample = ", ".join(missing_items[:12])
                violations.append(
                    f"{rel}: FULL_COVERAGE missing_bm_items={len(missing_items)} sample={sample}"
                )

    OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ")
    out: list[str] = []
    out.append("# TRACE Content Report (local-only)")
    out.append("")
    out.append(f"- ts_utc: {ts}")
    out.append(f"- enabled: {enabled}")
    out.append(f"- scanned_files: {scanned}")
    out.append(f"- violations: {len(violations)}")
    out.append("")
    if violations:
        for v in violations[:200]:
            out.append(f"- {v}")
        if len(violations) > 200:
            out.append(f"- ... ({len(violations) - 200} more)")
    else:
        out.append("- none")
    OUT_REPORT.write_text("\n".join(out) + "\n", encoding="utf-8")

    print(f"[check_trace_content_policy] report={OUT_REPORT} violations={len(violations)} enabled={enabled}")

    if enabled and violations:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
