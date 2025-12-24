#!/usr/bin/env python3
import argparse
import json
import sys
from collections import Counter
from pathlib import Path


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--plan", default="artifacts/doc-repair/plan.json")
    ap.add_argument("--out", default="artifacts/doc-repair/unknowns.md")
    args = ap.parse_args()

    plan_path = Path(args.plan)
    if not plan_path.exists():
        print("[doc_repair_unknowns] No plan.json; exit 0")
        return 0

    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    items = plan.get("items", [])

    unknown = [
        it
        for it in items
        if it.get("reason_code") == "UNKNOWN" and (it.get("blockedReason") or "").strip()
    ]

    blocked_reasons = [it["blockedReason"].strip() for it in unknown]
    cnt = Counter(blocked_reasons)

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    lines = ["# Doc-Repair Unknown Reasons", ""]
    lines.append(f"- unknown_items: {len(unknown)}")
    lines.append("")

    if unknown:
        lines.append("## Items (story_id → blockedReason)")
        for it in unknown[:200]:
            story_id = it.get("story_id", "?")
            br = (it.get("blockedReason") or "").strip()
            lines.append(f"- {story_id}: {br}")
        if len(unknown) > 200:
            lines.append(f"- ... (truncated; total={len(unknown)})")
        lines.append("")

    lines.append("## Top blockedReason strings")
    if not cnt:
        lines.append("- (none)")
    else:
        for br, n in cnt.most_common(50):
            lines.append(f"- ({n}x) {br}")

    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"[doc_repair_unknowns] wrote {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
