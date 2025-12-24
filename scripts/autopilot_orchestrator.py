#!/usr/bin/env python3
"""
Local Autopilot Orchestrator (v0.2)

Amaç:
- Local SSOT kuralına uygun tek-worker orchestrator.
- Idle iken GitHub'a istek atmaz.
- Tracker TSV (local) üzerinden FAIL olan PR'ları queue'ya alır (opsiyonel).
- Queue'dan PR alır ve `scripts/autopilot_local.sh` çalıştırır.

Notlar:
- GitHub API çağrıları orchestrator'da değil, autopilot_local.sh içinde yapılır.
- GH_TOKEN değeri asla loglanmaz.
"""

from __future__ import annotations

import argparse
import csv
import os
import subprocess
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Sequence


ROOT = Path(__file__).resolve().parents[1]
QUEUE = ROOT / ".autopilot-tmp/queue/queue.tsv"
LOCK = ROOT / ".autopilot-tmp/locks/autopilot.lock"


def eprint(msg: str) -> None:
    print(msg, file=sys.stderr)


def run(cmd: Sequence[str], env: Optional[Dict[str, str]] = None) -> int:
    proc = subprocess.run(cmd, cwd=str(ROOT), text=True, env=env)
    return int(proc.returncode)


def read_tracker_rows(path: Path) -> List[Dict[str, str]]:
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f, delimiter="\t")
        rows: List[Dict[str, str]] = []
        for row in reader:
            if not row:
                continue
            pr = (row.get("PR") or "").strip()
            if not pr:
                continue
            rows.append({k: (v or "") for k, v in row.items()})
        return rows


def ensure_queue_header() -> None:
    QUEUE.parent.mkdir(parents=True, exist_ok=True)
    if not QUEUE.exists():
        QUEUE.write_text("PR\tSTATE\tREASON\tLAST_UPDATE\n", encoding="utf-8")


def lock_exists() -> bool:
    return LOCK.exists()


def lock_write(pr: int) -> None:
    LOCK.parent.mkdir(parents=True, exist_ok=True)
    LOCK.write_text(f"pr={pr}\npid={os.getpid()}\n", encoding="utf-8")


def lock_clear() -> None:
    try:
        LOCK.unlink()
    except FileNotFoundError:
        return


def queue_add(pr: int, reason: str) -> None:
    run([sys.executable, "scripts/autopilot_queue.py", "add", "--pr", str(pr), "--reason", reason])


def queue_pop() -> Optional[int]:
    cp = subprocess.run(
        [sys.executable, "scripts/autopilot_queue.py", "pop"],
        cwd=str(ROOT),
        capture_output=True,
        text=True,
    )
    pr = (cp.stdout or "").strip()
    if not pr:
        return None
    if not pr.isdigit():
        return None
    return int(pr)


def tracker_row_for_pr(tracker_path: Path, pr: int) -> Optional[Dict[str, str]]:
    pr_s = str(pr)
    for row in read_tracker_rows(tracker_path):
        if (row.get("PR") or "").strip() == pr_s:
            return row
    return None


def should_enqueue(row: Dict[str, str]) -> bool:
    state = (row.get("STATE") or "").strip().lower()
    if state and state != "open":
        return False

    labels = {x.strip() for x in (row.get("LABELS") or "").split(",") if x.strip()}
    if "autopilot/needs-human" in labels:
        return False
    if "autopilot/passed" in labels:
        return False

    mergeable_state = (row.get("MERGEABLE_STATE") or "").strip().lower()
    if mergeable_state == "dirty":
        return True

    fail_wf = (row.get("FAIL_WORKFLOWS") or "").strip()
    return bool(fail_wf)


def scan_tracker_and_enqueue(tracker_path: Path) -> int:
    rows = read_tracker_rows(tracker_path)
    count = 0
    for row in rows:
        pr = (row.get("PR") or "").strip()
        if not pr.isdigit():
            continue
        if not should_enqueue(row):
            continue
        mergeable_state = (row.get("MERGEABLE_STATE") or "").strip().lower()
        fail_wf = (row.get("FAIL_WORKFLOWS") or "").strip()
        if mergeable_state == "dirty":
            reason = "merge-conflict"
            if fail_wf:
                reason = f"{reason};fail_workflows={fail_wf}"
        else:
            reason = f"fail_workflows={fail_wf}"
        queue_add(int(pr), reason=reason)
        count += 1
    return count


@dataclass(frozen=True)
class Args:
    repo: str
    max_attempts: int
    poll_idle: int
    scan_tracker: bool
    tracker_path: Path
    scan_interval: int
    fix_cmd: str
    semantic: bool
    required_only: bool


def parse_args(argv: Sequence[str]) -> Args:
    ap = argparse.ArgumentParser(prog="autopilot_orchestrator.py")
    ap.add_argument("--repo", required=True, help="owner/repo")
    ap.add_argument("--max-attempts", type=int, default=5, help="autopilot_local.sh --max")
    ap.add_argument("--poll-idle", type=int, default=5, help="idle sleep seconds (no network)")
    ap.add_argument("--scan-tracker", action="store_true", help="scan tracker TSV and enqueue failing PRs")
    ap.add_argument(
        "--tracker-path",
        type=Path,
        default=ROOT / ".autopilot-tmp/pr-tracker/PR-TRACKER.tsv",
        help="tracker TSV path",
    )
    ap.add_argument("--scan-interval", type=int, default=30, help="tracker scan interval seconds")
    ap.add_argument("--fix-cmd", default="", help="AUTOPILOT_FIX_CMD (optional)")
    ap.add_argument("--semantic", action="store_true", help="set AUTOPILOT_SEMANTIC_LINT=1")
    ap.add_argument(
        "--required-only",
        action="store_true",
        help="do not set AUTOPILOT_ANY_FAIL=1 when running autopilot_local",
    )
    ns = ap.parse_args(list(argv))
    return Args(
        repo=ns.repo,
        max_attempts=ns.max_attempts,
        poll_idle=ns.poll_idle,
        scan_tracker=ns.scan_tracker,
        tracker_path=ns.tracker_path,
        scan_interval=ns.scan_interval,
        fix_cmd=ns.fix_cmd,
        semantic=ns.semantic,
        required_only=ns.required_only,
    )


def main(argv: Sequence[str]) -> int:
    args = parse_args(argv)

    ensure_queue_header()

    env = os.environ.copy()
    if args.semantic:
        env["AUTOPILOT_SEMANTIC_LINT"] = "1"
    if args.fix_cmd:
        env["AUTOPILOT_FIX_CMD"] = args.fix_cmd
    if not args.required_only:
        env["AUTOPILOT_ANY_FAIL"] = "1"

    if not env.get("GH_TOKEN"):
        eprint("[orchestrator] missing env: GH_TOKEN")
        return 2

    last_scan = 0.0
    print("[orchestrator] started (idle-no-query). waiting for queue...")

    while True:
        # local-only scan
        if args.scan_tracker:
            now = time.time()
            if now - last_scan >= float(args.scan_interval):
                try:
                    queued = scan_tracker_and_enqueue(args.tracker_path)
                    if queued:
                        print(f"[orchestrator] queued_from_tracker={queued}")
                except Exception as exc:
                    print(f"[orchestrator] tracker scan warn: {exc}", file=sys.stderr)
                last_scan = now

        if lock_exists():
            time.sleep(args.poll_idle)
            continue

        pr = queue_pop()
        if pr is None:
            time.sleep(args.poll_idle)
            continue

        print(f"[orchestrator] picked PR #{pr}")
        lock_write(pr)
        try:
            if args.scan_tracker:
                row = tracker_row_for_pr(args.tracker_path, pr)
                mergeable_state = (row or {}).get("MERGEABLE_STATE", "").strip().lower()
                if mergeable_state == "dirty":
                    print(f"[orchestrator] mergeable_state=dirty for PR #{pr}; resolving conflicts with main...")
                    rc_resolve = run(
                        [
                            sys.executable,
                            "scripts/resolve_merge_conflicts.py",
                            "--repo",
                            args.repo,
                            "--pr",
                            str(pr),
                        ],
                        env=env,
                    )
                    if rc_resolve != 0:
                        print(
                            f"[orchestrator] resolve_merge_conflicts STOP for PR #{pr} rc={rc_resolve} (needs-human)",
                            file=sys.stderr,
                        )
                        # Best-effort: PR'a needs-human label basmayı dener; başarısızsa sessiz geç.
                        run(
                            [
                                "bash",
                                "-lc",
                                f"gh api -X POST repos/{args.repo}/issues/{pr}/labels -f labels[]=autopilot/needs-human >/dev/null 2>&1 || true",
                            ],
                            env=env,
                        )
                        continue

            cmd = [
                "bash",
                "scripts/autopilot_local.sh",
                "--repo",
                args.repo,
                "--pr",
                str(pr),
                "--max",
                str(args.max_attempts),
            ]
            rc = run(cmd, env=env)
            print(f"[orchestrator] autopilot_local finished for PR #{pr} rc={rc}")
        finally:
            lock_clear()

    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
