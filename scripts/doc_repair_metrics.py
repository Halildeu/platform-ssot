#!/usr/bin/env python3
"""
Doc-Repair metrics generator.

Girdiler:
- artifacts/doc-repair/plan.json
- artifacts/doc-repair/apply-report.md

Çıktılar:
- artifacts/doc-repair/metrics.json
- artifacts/doc-repair/metrics.md

Not:
- plan.json yoksa exit 0 (non-blocking).
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter
from pathlib import Path
from typing import Any, Dict, List


def read_json(path: Path) -> Dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data: Dict[str, Any]) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_md(path: Path, lines: List[str]) -> None:
    path.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def parse_apply_report(path: Path) -> tuple[Counter[str], Counter[str]]:
    """
    Expected row format (doc_repair_apply.py):
    - STORY-XXXX | `REASON_CODE` | STATUS | `INTERNAL_CODE` | detail...
    """
    status = Counter()
    internal = Counter()

    for line in path.read_text(encoding="utf-8", errors="ignore").splitlines():
        if not line.startswith("- "):
            continue
        if "|" not in line:
            continue

        parts = [p.strip() for p in line[2:].split("|")]
        if len(parts) < 5:
            continue

        # parts: story_id, `reason_code`, STATUS, `internal_code`, detail
        status_value = parts[2]
        internal_value = parts[3].strip("`")
        if status_value:
            status[status_value] += 1
        if internal_value:
            internal[internal_value] += 1

    return status, internal


def main(argv: List[str]) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--plan", default="artifacts/doc-repair/plan.json")
    ap.add_argument("--apply-report", default="artifacts/doc-repair/apply-report.md")
    ap.add_argument("--out-dir", default="artifacts/doc-repair")
    args = ap.parse_args(argv[1:])

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    plan_path = Path(args.plan)
    if not plan_path.exists():
        print("[doc_repair_metrics] No plan.json; exit 0")
        return 0

    plan = read_json(plan_path)
    items = plan.get("items") or []
    if not isinstance(items, list):
        items = []

    reason_counts: Counter[str] = Counter()
    for it in items:
        if not isinstance(it, dict):
            continue
        reason_counts[str(it.get("reason_code") or "UNKNOWN")] += 1

    apply_status_counts: Counter[str] = Counter()
    apply_internal_counts: Counter[str] = Counter()
    apply_report_path = Path(args.apply_report)
    if apply_report_path.exists():
        apply_status_counts, apply_internal_counts = parse_apply_report(apply_report_path)

    unknown_count = reason_counts.get("UNKNOWN", 0)
    total_items = len(items)
    unknown_ratio = (unknown_count / total_items) if total_items else 0.0

    summary = {
        "plan_items": total_items,
        "reason_counts": dict(reason_counts),
        "apply_status_counts": dict(apply_status_counts),
        "apply_internal_counts": dict(apply_internal_counts),
        "unknown_reason_ratio": unknown_ratio,
    }

    write_json(out_dir / "metrics.json", summary)

    md: List[str] = ["# Doc-Repair Metrics", ""]
    md.append(f"- plan_items: {summary['plan_items']}")
    md.append(f"- unknown_reason_ratio: {summary['unknown_reason_ratio']:.2%}")
    md.append("")
    md.append("## Reason Counts")
    for k, v in sorted(reason_counts.items(), key=lambda kv: (-kv[1], kv[0])):
        md.append(f"- {k}: {v}")
    md.append("")
    md.append("## Apply Status Counts")
    for k, v in sorted(apply_status_counts.items(), key=lambda kv: (-kv[1], kv[0])):
        md.append(f"- {k}: {v}")
    md.append("")
    md.append("## Apply Internal Codes")
    for k, v in sorted(apply_internal_counts.items(), key=lambda kv: (-kv[1], kv[0])):
        md.append(f"- {k}: {v}")
    write_md(out_dir / "metrics.md", md)

    print(f"[doc_repair_metrics] wrote {out_dir/'metrics.json'} and {out_dir/'metrics.md'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
