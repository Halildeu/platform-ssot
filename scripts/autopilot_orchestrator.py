#!/usr/bin/env python3
import argparse
import datetime as dt
import os
import subprocess
import sys
import time
from pathlib import Path


QUEUE = Path(".autopilot-tmp/queue/queue.tsv")
LOCK = Path(".autopilot-tmp/locks/autopilot.lock")


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

    while True:
        if lock_exists():
            time.sleep(args.poll_idle)
            continue

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
