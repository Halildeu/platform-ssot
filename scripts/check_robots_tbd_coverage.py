#!/usr/bin/env python3
import json
import sys
from datetime import datetime, timezone
from pathlib import Path


REG = Path("docs/04-operations/ROBOTS-REGISTRY.v0.1.json")
OUT = Path(".autopilot-tmp/robots")

TBD_KEYS = ["side_effects", "required_auth_refs", "required_env", "inputs", "outputs"]


def has_tbd(val) -> bool:
    if val is None:
        return True
    if isinstance(val, str):
        return "tbd" in val.lower()
    if isinstance(val, list):
        if not val:
            return True
        return any(has_tbd(x) for x in val) or any((isinstance(x, str) and x.strip().lower() == "tbd") for x in val)
    if isinstance(val, dict):
        if not val:
            return True
        return any(has_tbd(v) for v in val.values())
    return False


def main() -> int:
    if not REG.exists():
        print("[check_robots_tbd_coverage] FAIL: missing registry")
        return 1

    reg = json.loads(REG.read_text(encoding="utf-8"))
    robots = reg.get("robots", [])

    OUT.mkdir(parents=True, exist_ok=True)

    tbd: list[tuple[str, str, str, list[str]]] = []
    risky: list[tuple[str, str, str, list[str]]] = []

    for r in robots:
        if not isinstance(r, dict):
            continue
        rid = r.get("id", "?")
        path = r.get("path", "?")
        kind = r.get("kind", "?")

        hits = []
        for k in TBD_KEYS:
            if k in r and has_tbd(r[k]):
                hits.append(k)

        if hits:
            tbd.append((rid, kind, path, hits))
            se = r.get("side_effects", [])
            se_str = " ".join(se) if isinstance(se, list) else str(se)
            if ("dispatch" in se_str.lower()) or ("merge" in se_str.lower()) or ("push" in se_str.lower()) or kind == "workflow":
                risky.append((rid, kind, path, hits))

    rep = OUT / "robots-tbd-coverage-report.md"
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ")
    lines: list[str] = []
    lines.append("# Robots TBD Coverage Report (local-only, non-blocking)")
    lines.append("")
    lines.append(f"- ts_utc: {ts}")
    lines.append(f"- robots_total: {len(robots)}")
    lines.append(f"- robots_with_tbd: {len(tbd)}")
    lines.append(f"- risky_with_tbd: {len(risky)}")
    lines.append("")
    if risky:
        lines.append("## Risky (side-effect likely) + TBD")
        for rid, kind, path, hits in risky[:200]:
            lines.append(f"- {rid} ({kind}) {path} TBD={hits}")
        lines.append("")
    if tbd:
        lines.append("## All TBD entries")
        for rid, kind, path, hits in tbd[:300]:
            lines.append(f"- {rid} ({kind}) {path} TBD={hits}")
        if len(tbd) > 300:
            lines.append(f"- ... ({len(tbd) - 300} more)")
    else:
        lines.append("## All TBD entries")
        lines.append("- none")

    rep.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"[check_robots_tbd_coverage] report={rep} tbd={len(tbd)} risky={len(risky)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

