#!/usr/bin/env python3
import json
import re
from datetime import datetime, timezone
from pathlib import Path

GUIDES_DIR = Path("docs/03-delivery/guides")
OUT_DIR = Path(".autopilot-tmp/flow-mining")

GUIDE_NAME_RE = re.compile(r"^GUIDE-(\d{4})-", re.IGNORECASE)


def slug(s: str) -> str:
    s = s.strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s or "guide"


def next_id() -> int:
    mx = 0
    if not GUIDES_DIR.exists():
        return 1
    for p in GUIDES_DIR.rglob("GUIDE-*.md"):
        m = GUIDE_NAME_RE.match(p.name)
        if m:
            mx = max(mx, int(m.group(1)))
    return mx + 1


def main() -> int:
    if not GUIDES_DIR.exists():
        print("[plan_guides_migration] guides dir missing; nothing to plan")
        return 0

    current_next = next_id()
    plan = []

    for p in sorted(GUIDES_DIR.rglob("*.md")):
        if p.name.lower().startswith("guide-"):
            continue

        base = slug(p.stem)
        new_name = f"GUIDE-{current_next:04d}-{base}.md"
        current_next += 1

        plan.append(
            {
                "from": str(p),
                "to": str(p.with_name(new_name)),
                "note": "rename-only; content/template alignment handled after rename",
            }
        )

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    ts = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    md_path = OUT_DIR / f"guides-migration-plan_{ts}.md"
    json_path = OUT_DIR / f"guides-migration-plan_{ts}.json"

    lines = []
    lines.append("# Guides Migration Plan (local-only)")
    lines.append("")
    lines.append(f"- ts_utc: {datetime.now(timezone.utc).isoformat()}")
    lines.append(f"- candidates: {len(plan)}")
    lines.append("")
    for i, x in enumerate(plan, start=1):
        lines.append(f"{i}. {x['from']} -> {x['to']}")

    md_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    json_path.write_text(json.dumps(plan, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"[plan_guides_migration] wrote {md_path} and {json_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
