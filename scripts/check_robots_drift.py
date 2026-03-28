#!/usr/bin/env python3
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path


REG = Path("docs-ssot/04-operations/ROBOTS-REGISTRY.v0.1.json")
POL = Path("docs-ssot/03-delivery/SPECS/robots-policy.v1.json")

# Side-effect sinyalleri (best-effort)
RX = [
    ("workflow_dispatch", re.compile(r"\bworkflow_dispatch\b", re.I)),
    ("dispatches_api", re.compile(r"/actions/workflows/.+/dispatches", re.I)),
    ("gh_api_dispatch", re.compile(r"\bgh\s+api\b.*dispatch", re.I)),
    ("merge", re.compile(r"\bgh\s+pr\s+merge\b|\bmerge\s+--squash\b", re.I)),
    ("push", re.compile(r"\bgit\s+push\b", re.I)),
    ("rollback_confirm", re.compile(r"confirm\s*[:=]\s*ROLLBACK", re.I)),
    ("merge_confirm", re.compile(r"confirm\s*[:=]\s*MERGE", re.I)),
    ("vault_get", re.compile(r"\bvault\s+kv\s+get\b", re.I)),
]


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def main() -> int:
    if not REG.exists() or not POL.exists():
        print("[check_robots_drift] FAIL: missing registry/policy")
        return 1

    reg = json.loads(REG.read_text(encoding="utf-8"))
    pol = json.loads(POL.read_text(encoding="utf-8"))
    enabled = bool(pol.get("enabled", False))

    known_paths = {r.get("path") for r in reg.get("robots", []) if isinstance(r, dict) and r.get("path")}

    candidates: list[Path] = []
    for base in [Path("scripts"), Path(".github/workflows")]:
        if not base.exists():
            continue
        for p in base.rglob("*"):
            if not p.is_file():
                continue
            if p.suffix not in (".py", ".sh", ".yml", ".yaml"):
                continue
            candidates.append(p)

    violations: list[dict] = []
    for p in candidates:
        txt = read(p)
        hits = [name for name, rx in RX if rx.search(txt)]
        if not hits:
            continue

        rel = str(p).replace("\\", "/")

        if rel not in known_paths:
            violations.append({"type": "UNREGISTERED_ROBOT", "file": rel, "hits": hits})
            continue

        robot = next((x for x in reg.get("robots", []) if isinstance(x, dict) and x.get("path") == rel), None)
        if not robot:
            continue

        allowed_modes = robot.get("allowed_modes", [])
        if ("apply" in allowed_modes) and (not robot.get("required_confirm")):
            merge_or_rollback = ("merge" in hits) or ("rollback_confirm" in hits) or ("merge_confirm" in hits)
            if merge_or_rollback:
                violations.append(
                    {
                        "type": "MISSING_CONFIRM",
                        "file": rel,
                        "robot_id": robot.get("id"),
                        "hits": hits,
                    }
                )

    out_dir = Path(".autopilot-tmp/robots")
    out_dir.mkdir(parents=True, exist_ok=True)
    rep = out_dir / "robots-drift-report.md"
    rep_json = out_dir / "robots-drift-report.json"

    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ")
    lines: list[str] = []
    lines.append("# Robots Drift Report (local-only)")
    lines.append("")
    lines.append(f"- ts_utc: {ts}")
    lines.append(f"- enabled: {enabled}")
    lines.append(f"- violations: {len(violations)}")
    lines.append("")
    if violations:
        for v in violations[:200]:
            lines.append(f"- {v['type']}: {v.get('file')} hits={v.get('hits')}")
        if len(violations) > 200:
            lines.append(f"- ... ({len(violations) - 200} more)")
    else:
        lines.append("- none")
    lines.append("")

    rep.write_text("\n".join(lines), encoding="utf-8")
    rep_json.write_text(json.dumps(violations, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"[check_robots_drift] report={rep} violations={len(violations)} enabled={enabled}")

    if enabled and violations:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
