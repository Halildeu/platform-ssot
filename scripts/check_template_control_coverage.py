#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path


MAP = Path("docs/00-handbook/DOC-TEMPLATE-MAP-SSOT.json")
POL = Path("docs/03-delivery/SPECS/template-strictness-policy.v1.json")
OUT = Path(".autopilot-tmp/flow-mining/template-control-coverage-report.md")


def main() -> int:
    d = json.loads(MAP.read_text(encoding="utf-8"))
    pol = json.loads(POL.read_text(encoding="utf-8"))
    modes = pol.get("modes", {})

    missing_mode = [dtype for dtype in d.get("map", {}).keys() if dtype not in modes]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ")

    lines: list[str] = []
    lines.append("# Template Control Coverage Report (non-blocking)")
    lines.append("")
    lines.append(f"- ts_utc: {ts}")
    lines.append(f"- mapped_types: {len(d.get('map', {}))}")
    lines.append(f"- missing_mode: {len(missing_mode)}")
    lines.append("")
    for x in missing_mode:
        lines.append(f"- MISSING_MODE: {x}")
    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"[check_template_control_coverage] report={OUT} missing_mode={len(missing_mode)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
