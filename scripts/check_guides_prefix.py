#!/usr/bin/env python3
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

POLICY_PATH = Path("docs-ssot/03-delivery/SPECS/guides-policy.v1.json")
OUT_DIR = Path(".autopilot-tmp/flow-mining")


def read_json(p: Path) -> dict:
    return json.loads(p.read_text(encoding="utf-8"))


def main() -> int:
    if not POLICY_PATH.exists():
        print("[check_guides_prefix] FAIL: missing guides policy")
        return 1

    policy = read_json(POLICY_PATH)
    enabled = bool(policy.get("enabled", False))
    guides_root = Path(policy.get("scope", {}).get("guides_root", "docs/03-delivery/guides"))

    if not guides_root.exists():
        print(f"[check_guides_prefix] PASS: guides root missing (skip): {guides_root}")
        return 0

    require_prefix = policy.get("rules", {}).get("require_prefix", r"GUIDE-\d{4}")
    guide_re = re.compile(rf"^{require_prefix}-.+\.md$", re.IGNORECASE)

    files = sorted([p for p in guides_root.rglob("*.md") if p.is_file()])
    ok = 0
    bad: list[str] = []

    for f in files:
        if guide_re.match(f.name):
            ok += 1
        else:
            bad.append(str(f))

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    report_path = OUT_DIR / "guides-prefix-report.md"
    ts_utc = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ")

    lines = []
    lines.append("# Guides Prefix Report (local-only)")
    lines.append("")
    lines.append(f"- ts_utc: {ts_utc}")
    lines.append(f"- enabled: {enabled}")
    lines.append(f"- guides_root: {guides_root}")
    lines.append(f"- total_md: {len(files)} | ok_prefixed: {ok} | violations: {len(bad)}")
    lines.append("")

    if bad:
        lines.append("## Violations (prefixsiz veya yanlış prefix)")
        for x in bad[:200]:
            lines.append(f"- {x}")
        if len(bad) > 200:
            lines.append(f"- ... ({len(bad) - 200} more)")
    else:
        lines.append("## Violations")
        lines.append("- none")

    report_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"[check_guides_prefix] report={report_path} violations={len(bad)} enabled={enabled}")

    if enabled and bad:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
