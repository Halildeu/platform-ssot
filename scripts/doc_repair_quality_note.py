#!/usr/bin/env python3
import json
import os
import sys
from pathlib import Path


def main() -> int:
    metrics_path = Path("artifacts/doc-repair/metrics.json")
    if not metrics_path.exists():
        print("[doc_repair_quality_note] No metrics.json; exit 0")
        return 0

    m = json.loads(metrics_path.read_text(encoding="utf-8"))
    ratio = float(m.get("unknown_reason_ratio", 0.0))
    plan_items = int(m.get("plan_items", 0))

    note = []
    note.append("## Doc-Repair Quality Notes")
    note.append(f"- plan_items: {plan_items}")
    note.append(f"- unknown_reason_ratio: {ratio:.2%}")

    if plan_items > 0 and ratio > 0.10:
        note.append("")
        note.append(
            "WARNING: unknown_reason_ratio > 10% (reason-map coverage düşük; yeni pattern eklenmeli)"
        )
    elif plan_items > 0 and ratio > 0.05:
        note.append("")
        note.append("INFO: unknown_reason_ratio > 5% (reason-map iyileştirilebilir)")

    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_path:
        with open(summary_path, "a", encoding="utf-8") as f:
            f.write("\n".join(note) + "\n")
        print(f"[doc_repair_quality_note] wrote job summary: {summary_path}")
    else:
        print("\n".join(note))

    return 0


if __name__ == "__main__":
    sys.exit(main())
