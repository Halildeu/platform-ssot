#!/usr/bin/env python3
"""
Non-blocking trace quality report.

- Always exits 0 (report-only).
- Emits summary to stdout and GitHub Step Summary if available.
"""

from __future__ import annotations

import csv
import os
import sys
from pathlib import Path


def append_github_step_summary(markdown: str) -> None:
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if not summary:
        return
    Path(summary).parent.mkdir(parents=True, exist_ok=True)
    with Path(summary).open("a", encoding="utf-8") as f:
        f.write(markdown)


def main() -> int:
    traces = sorted(Path("docs/03-delivery/TRACES").glob("TRACE-*.tsv"))
    if not traces:
        print("[check_trace_quality] No TRACE files found.")
        return 0

    total_rows = 0
    refined_rows = 0
    missing_col: list[str] = []
    per_trace: list[tuple[str, int, int]] = []

    for tf in traces:
        lines = tf.read_text(encoding="utf-8").splitlines()
        if not lines:
            continue

        reader = csv.DictReader(lines, delimiter="\t")
        fieldnames = reader.fieldnames or []
        if "mapping_quality" not in fieldnames:
            missing_col.append(str(tf))
            continue

        tr_total = 0
        tr_ref = 0
        for r in reader:
            tr_total += 1
            mq = (r.get("mapping_quality") or "").strip().lower()
            if mq == "refined":
                tr_ref += 1

        total_rows += tr_total
        refined_rows += tr_ref
        per_trace.append((tf.name, tr_total, tr_ref))

    ratio = (refined_rows / total_rows) if total_rows else 0.0

    out_lines: list[str] = []
    out_lines.append("## Trace Quality Report (non-blocking)")
    out_lines.append(f"- traces: {len(traces)}")
    out_lines.append(f"- rows_total: {total_rows}")
    out_lines.append(f"- rows_refined: {refined_rows}")
    out_lines.append(f"- refined_ratio: {ratio:.2%}")

    if missing_col:
        out_lines.append("")
        out_lines.append("⚠️ mapping_quality kolonu eksik TRACE dosyaları:")
        for p in missing_col:
            out_lines.append(f"- {p}")

    out_lines.append("")
    out_lines.append("### Per-trace")
    for name, t, r in per_trace:
        rr = (r / t) if t else 0.0
        out_lines.append(f"- {name}: refined {r}/{t} ({rr:.2%})")

    markdown = "\n".join(out_lines) + "\n"
    print(markdown)
    append_github_step_summary(markdown)
    return 0


if __name__ == "__main__":
    sys.exit(main())

