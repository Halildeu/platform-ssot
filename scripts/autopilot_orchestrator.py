#!/usr/bin/env python3
import argparse
import csv
import datetime as dt
import os
import subprocess
import sys
import time
from pathlib import Path


QUEUE = Path(".autopilot-tmp/queue/queue.tsv")
LOCK = Path(".autopilot-tmp/locks/autopilot.lock")

DEFAULT_TRACKER = Path(".autopilot-tmp/pr-tracker/PR-TRACKER.tsv")

TRACKER_FAILURE_VALUES = {
    "failure",
    "failed",
    "fail",
    "error",
    "cancelled",
    "canceled",
    "timed_out",
    "timedout",
    "timeout",
    "action_required",
}


def now() -> str:
    ts = dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat()
    return ts.replace("+00:00", "Z")


def run(cmd: list[str], env: dict[str, str] | None = None) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, text=True, env=env)


def lock_write(pr: int) -> None:
    LOCK.parent.mkdir(parents=True, exist_ok=True)
    LOCK.write_text(
        f"pr={pr}\nstart={now()}\npid={os.getpid()}\n",
        encoding="utf-8",
    )


def lock_clear() -> None:
    try:
        LOCK.unlink()
    except FileNotFoundError:
        return


def lock_exists() -> bool:
    return LOCK.exists()


def _norm(value: str) -> str:
    return (value or "").strip().lower()


def _read_queue_prs() -> set[int]:
    if not QUEUE.exists():
        return set()
    with QUEUE.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f, delimiter="\t")
        prs: set[int] = set()
        for row in reader:
            pr_raw = (row.get("PR") or "").strip()
            if not pr_raw.isdigit():
                continue
            prs.add(int(pr_raw))
        return prs


def _scan_tracker_and_enqueue(tracker_path: Path) -> int:
    if not tracker_path.exists():
        return 0

    queued = _read_queue_prs()
    enqueued = 0

    with tracker_path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f, delimiter="\t")
        for row in reader:
            pr_raw = (row.get("PR") or "").strip()
            if not pr_raw.isdigit():
                continue
            pr = int(pr_raw)

            state = _norm(row.get("STATE") or "")
            if state != "open":
                continue

            ci_gate = _norm(row.get("CI_GATE") or "")
            if ci_gate not in TRACKER_FAILURE_VALUES:
                continue

            labels = _norm(row.get("LABELS") or "")
            if "needs-human" in labels:
                continue
            if "autopilot/passed" in labels:
                continue

            if pr in queued:
                continue

            reason = f"ci-gate {ci_gate}".strip()
            cp = subprocess.run(
                [
                    sys.executable,
                    "scripts/autopilot_queue.py",
                    "add",
                    "--pr",
                    str(pr),
                    "--reason",
                    reason,
                ],
                capture_output=True,
                text=True,
            )
            if cp.returncode == 0:
                enqueued += 1
                queued.add(pr)
            else:
                err = (cp.stderr or cp.stdout or "").strip().splitlines()
                msg = err[-1] if err else "unknown error"
                print(f"[orchestrator] enqueue failed for PR #{pr}: {msg}", file=sys.stderr)

    return enqueued


def pop_next_pr() -> int | None:
    cp = subprocess.run(
        [sys.executable, "scripts/autopilot_queue.py", "pop"],
        capture_output=True,
        text=True,
    )
    pr = (cp.stdout or "").strip()
    if not pr:
        return None
    try:
        return int(pr)
    except Exception:
        return None


def ensure_env(env: dict[str, str], key: str, required: bool = True) -> bool:
    value = env.get(key, "")
    if required and not value:
        print(f"[orchestrator] missing env: {key}", file=sys.stderr)
        return False
    return True


def main() -> int:
    parser = argparse.ArgumentParser(prog="autopilot_orchestrator.py")
    parser.add_argument("--repo", required=True, help="owner/repo")
    parser.add_argument(
        "--poll-idle",
        type=int,
        default=5,
        help="Idle loop checks queue (no network).",
    )
    parser.add_argument(
        "--scan-tracker",
        action="store_true",
        help="Scan local PR tracker TSV and enqueue failing PRs (no network).",
    )
    parser.add_argument(
        "--tracker-path",
        default=str(DEFAULT_TRACKER),
        help="PR tracker TSV path (default: .autopilot-tmp/pr-tracker/PR-TRACKER.tsv).",
    )
    parser.add_argument(
        "--scan-interval",
        type=int,
        default=30,
        help="Seconds between tracker scans (default: 30).",
    )
    parser.add_argument("--max-attempts", type=int, default=5, help="autopilot_local.sh --max")
    parser.add_argument("--semantic", action="store_true", help="set AUTOPILOT_SEMANTIC_LINT=1")
    parser.add_argument("--fix-cmd", default="", help="AUTOPILOT_FIX_CMD (optional)")
    args = parser.parse_args()

    env = os.environ.copy()
    if args.semantic:
        env["AUTOPILOT_SEMANTIC_LINT"] = "1"
    if args.fix_cmd:
        env["AUTOPILOT_FIX_CMD"] = args.fix_cmd

    if not ensure_env(env, "GH_TOKEN", required=True):
        return 2

    QUEUE.parent.mkdir(parents=True, exist_ok=True)
    if not QUEUE.exists():
        QUEUE.write_text("PR\tSTATE\tREASON\tLAST_UPDATE\n", encoding="utf-8")

    print("[orchestrator] started (idle-no-query). waiting for queue...")

    tracker_path = Path(args.tracker_path)
    last_scan = 0.0

    while True:
        if lock_exists():
            time.sleep(args.poll_idle)
            continue

        if args.scan_tracker:
            now_m = time.monotonic()
            if last_scan <= 0.0 or (now_m - last_scan) >= args.scan_interval:
                enq = _scan_tracker_and_enqueue(tracker_path)
                if enq > 0:
                    print(f"[orchestrator] scan: enqueued {enq} PR(s) from tracker")
                last_scan = now_m

        pr = pop_next_pr()
        if pr is None:
            time.sleep(args.poll_idle)
            continue

        print(f"[orchestrator] picked PR #{pr}")
        lock_write(pr)
        try:
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
            rc = run(cmd, env=env).returncode
            print(f"[orchestrator] autopilot_local finished for PR #{pr} rc={rc}")
        finally:
            lock_clear()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
