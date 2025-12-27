#!/usr/bin/env python3
import argparse
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

REGISTRY_PATH = Path("docs/04-operations/ROBOTS-REGISTRY.v0.1.json")
POLICY_PATH = Path("docs/03-delivery/SPECS/robots-policy.v1.json")

OUT_DIR = Path(".autopilot-tmp/robots")


def now_utc() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ")


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def write_json(path: Path, data: dict) -> None:
    write_text(path, json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def git_branch() -> str:
    try:
        return subprocess.check_output(["git", "branch", "--show-current"], text=True).strip()
    except Exception:
        return ""


def git_sha_short() -> str:
    try:
        return subprocess.check_output(["git", "rev-parse", "--short", "HEAD"], text=True).strip()
    except Exception:
        return ""


def load_registry_and_policy() -> tuple[list[dict], dict]:
    if not REGISTRY_PATH.exists():
        print(f"[robotsctl] missing registry: {REGISTRY_PATH}", file=sys.stderr)
        raise SystemExit(1)

    registry = read_json(REGISTRY_PATH)
    robots = registry.get("robots", [])
    if not isinstance(robots, list):
        print("[robotsctl] invalid registry schema: robots must be list", file=sys.stderr)
        raise SystemExit(1)

    policy = {"enabled": False, "default_mode": "observe", "allow_apply": False}
    if POLICY_PATH.exists():
        policy = read_json(POLICY_PATH)

    return robots, policy


def robot_allowed(robot: dict, mode: str, allow_apply: bool) -> bool:
    allowed = robot.get("allowed_modes") or []
    if mode not in allowed:
        return False
    if mode == "apply" and not allow_apply:
        return False
    return True


def confirm_ok(robot: dict, confirm: str | None) -> bool:
    required = robot.get("required_confirm")
    if not required:
        return True
    return (confirm or "") == required


def render_robot_report(robot: dict, mode: str, confirm: str | None) -> tuple[int, str]:
    rid = robot.get("id", "?")
    name = robot.get("name", "?")
    required_confirm = robot.get("required_confirm")

    lines: list[str] = []
    lines.append(f"# Robot Report: {rid} ({name})")
    lines.append("")
    lines.append(f"- ts_utc: {now_utc()}")
    lines.append(f"- branch: {git_branch() or 'TBD'}")
    lines.append(f"- sha: {git_sha_short() or 'TBD'}")
    lines.append(f"- mode: {mode}")
    lines.append(f"- kind: {robot.get('kind')}")
    lines.append(f"- path: {robot.get('path')}")
    lines.append(f"- side_effects: {robot.get('side_effects')}")
    lines.append(f"- required_confirm: {required_confirm}")
    lines.append("")

    if mode == "apply" and required_confirm and not confirm_ok(robot, confirm):
        lines.append("## Result")
        lines.append(f"- FAIL: confirm mismatch (expected {required_confirm})")
        lines.append("")
        return 1, "\n".join(lines) + "\n"

    lines.append("## Result")
    lines.append("- v0.1: report-only (no external side-effects performed)")
    lines.append("")
    return 0, "\n".join(lines) + "\n"


def cmd_list(robots: list[dict]) -> int:
    for r in robots:
        rid = r.get("id", "?")
        name = r.get("name", "?")
        kind = r.get("kind", "?")
        path = r.get("path", "?")
        allowed = r.get("allowed_modes", [])
        print(f"{rid}\t{name}\t{kind}\t{path}\tallowed={allowed}")
    return 0


def cmd_run(robots: list[dict], policy: dict, mode: str, confirm: str | None, ids: set[str]) -> int:
    enabled = bool(policy.get("enabled", False))
    allow_apply = bool(policy.get("allow_apply", False))

    selected = [r for r in robots if (not ids or r.get("id") in ids)]
    if not selected:
        print("[robotsctl] no matching robots", file=sys.stderr)
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    results: list[dict] = []
    rc_all = 0
    for r in selected:
        rid = r.get("id", "?")
        if not robot_allowed(r, mode, allow_apply):
            continue

        rc, report = render_robot_report(r, mode, confirm)
        write_text(OUT_DIR / rid / "report.md", report)
        write_json(
            OUT_DIR / rid / "latest.json",
            {
                "id": rid,
                "ts_utc": now_utc(),
                "mode": mode,
                "rc": rc,
                "policy_enabled": enabled,
                "allow_apply": allow_apply,
            },
        )
        results.append({"id": rid, "rc": rc})
        rc_all = max(rc_all, rc)

    write_json(
        OUT_DIR / "summary.json",
        {
            "ts_utc": now_utc(),
            "branch": git_branch(),
            "sha": git_sha_short(),
            "mode": mode,
            "policy_enabled": enabled,
            "allow_apply": allow_apply,
            "count": len(results),
            "results": results,
        },
    )

    summary_md = []
    summary_md.append("# Robots Summary")
    summary_md.append("")
    summary_md.append(f"- ts_utc: {now_utc()}")
    summary_md.append(f"- mode: {mode}")
    summary_md.append(f"- count: {len(results)}")
    summary_md.append("")
    for x in results:
        summary_md.append(f"- {x['id']}: rc={x['rc']}")
    write_text(OUT_DIR / "summary.md", "\n".join(summary_md) + "\n")

    print(f"[robotsctl] wrote {OUT_DIR/'summary.md'}")
    return rc_all


def main() -> int:
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)

    ap_list = sub.add_parser("list")
    ap_list.add_argument("--ids", default="", help="comma-separated robot ids (optional)")

    ap_run = sub.add_parser("run")
    ap_run.add_argument("--mode", choices=["observe", "plan", "apply"], default=None)
    ap_run.add_argument("--apply", action="store_true", help="alias for --mode apply")
    ap_run.add_argument("--confirm", default=None)
    ap_run.add_argument("--ids", default="", help="comma-separated robot ids (optional)")

    args = ap.parse_args()

    robots, policy = load_registry_and_policy()

    ids: set[str] = set()
    if getattr(args, "ids", ""):
        ids = {x.strip() for x in args.ids.split(",") if x.strip()}

    if args.cmd == "list":
        selected = [r for r in robots if (not ids or r.get("id") in ids)]
        return cmd_list(selected)

    mode = args.mode or policy.get("default_mode", "observe")
    if args.apply:
        mode = "apply"
    return cmd_run(robots, policy, mode, args.confirm, ids)


if __name__ == "__main__":
    raise SystemExit(main())
