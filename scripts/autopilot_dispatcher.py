#!/usr/bin/env python3
import argparse
import csv
import datetime as dt
import os
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class TrackerRow:
    pr: int
    branch: str
    title: str
    state: str
    head_sha: str
    ci_gate: str
    ci_gate_run_url: str
    mergeable_state: str
    labels: str
    last_update: str
    note: str


FAILURE_VALUES_DEFAULT = {
    "failure",
    "fail",
    "failed",
    "error",
    "cancelled",
    "canceled",
    "timed_out",
    "timedout",
    "timeout",
    "action_required",
}


def _norm(value: str) -> str:
    return (value or "").strip().lower()


def _parse_repo_from_origin() -> str:
    try:
        origin = subprocess.check_output(
            ["git", "remote", "get-url", "origin"],
            text=True,
            stderr=subprocess.DEVNULL,
        ).strip()
    except Exception:
        return ""

    match = re.search(r"github\.com[:/](.+?)/(.+?)(?:\.git)?$", origin)
    if not match:
        return ""
    return f"{match.group(1)}/{match.group(2)}"


def _parse_iso_time(value: str) -> dt.datetime | None:
    s = (value or "").strip()
    if not s:
        return None
    try:
        if s.endswith("Z"):
            s = s[:-1] + "+00:00"
        return dt.datetime.fromisoformat(s)
    except Exception:
        return None


def _read_tracker_rows(path: Path) -> list[TrackerRow]:
    with path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f, delimiter="\t")
        missing = [k for k in ("PR", "STATE", "CI_GATE") if k not in (reader.fieldnames or [])]
        if missing:
            raise ValueError(f"TSV header missing columns: {', '.join(missing)}")

        rows: list[TrackerRow] = []
        for row in reader:
            pr_raw = (row.get("PR") or "").strip()
            if not pr_raw or not pr_raw.isdigit():
                continue
            rows.append(
                TrackerRow(
                    pr=int(pr_raw),
                    branch=(row.get("BRANCH") or "").strip(),
                    title=(row.get("TITLE") or "").strip(),
                    state=(row.get("STATE") or "").strip(),
                    head_sha=(row.get("HEAD_SHA") or "").strip(),
                    ci_gate=(row.get("CI_GATE") or "").strip(),
                    ci_gate_run_url=(row.get("CI_GATE_RUN_URL") or "").strip(),
                    mergeable_state=(row.get("MERGEABLE_STATE") or "").strip(),
                    labels=(row.get("LABELS") or "").strip(),
                    last_update=(row.get("LAST_UPDATE") or "").strip(),
                    note=(row.get("NOTE") or "").strip(),
                )
            )
        return rows


def _pick_failure_pr(rows: list[TrackerRow], failure_values: set[str]) -> TrackerRow | None:
    candidates: list[tuple[dt.datetime, TrackerRow]] = []
    for r in rows:
        if _norm(r.state) != "open":
            continue
        if _norm(r.ci_gate) not in failure_values:
            continue
        t = _parse_iso_time(r.last_update) or dt.datetime.min.replace(tzinfo=dt.timezone.utc)
        candidates.append((t, r))

    if not candidates:
        return None

    candidates.sort(key=lambda x: (x[0], x[1].pr), reverse=True)
    return candidates[0][1]


def _acquire_lock(lock_file: Path) -> object | None:
    lock_file.parent.mkdir(parents=True, exist_ok=True)
    fd = os.open(lock_file, os.O_RDWR | os.O_CREAT, 0o600)
    try:
        import fcntl  # Unix only

        fcntl.flock(fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        os.close(fd)
        return None
    except Exception:
        os.close(fd)
        raise
    return fd


def _run_autopilot(repo: str, pr: int, max_attempts: int, out_dir: str) -> int:
    script = Path("scripts/autopilot_local.sh")
    if not script.exists():
        raise FileNotFoundError("scripts/autopilot_local.sh not found")

    cmd = [
        "bash",
        str(script),
        "--repo",
        repo,
        "--pr",
        str(pr),
        "--max",
        str(max_attempts),
        "--out",
        out_dir,
    ]
    print(f"[dispatcher] RUN: {' '.join(cmd)}")
    return subprocess.call(cmd)


def main() -> int:
    parser = argparse.ArgumentParser(
        prog="autopilot_dispatcher.py",
        description="Local dispatcher: reads PR-TRACKER.tsv, picks a failing PR, runs autopilot_local.sh once.",
    )
    parser.add_argument(
        "--repo",
        default="",
        help="GitHub repo as owner/repo (default: parse from git remote origin).",
    )
    parser.add_argument(
        "--tracker",
        default=".autopilot-tmp/pr-tracker/PR-TRACKER.tsv",
        help="Path to PR tracker TSV (default: .autopilot-tmp/pr-tracker/PR-TRACKER.tsv).",
    )
    parser.add_argument(
        "--lock-file",
        default=".autopilot-tmp/locks/autopilot-dispatcher.lock",
        help="Lock file path for single-instance execution.",
    )
    parser.add_argument(
        "--max",
        type=int,
        default=5,
        help="Max attempts passed to autopilot_local.sh (default: 5).",
    )
    parser.add_argument(
        "--out",
        default="artifacts/ci-logs",
        help="Output directory passed to autopilot_local.sh (default: artifacts/ci-logs).",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Do not run autopilot; only print which PR would be dispatched.",
    )
    args = parser.parse_args()

    repo = args.repo.strip() or _parse_repo_from_origin()
    if not repo:
        print("[dispatcher] repo not provided and origin remote is not parseable.")
        return 2

    tracker_path = Path(args.tracker)
    if not tracker_path.exists():
        print(f"[dispatcher] tracker missing: {tracker_path} (noop)")
        return 0

    lock_fd = _acquire_lock(Path(args.lock_file))
    if lock_fd is None:
        print("[dispatcher] lock busy; another dispatcher is running (noop)")
        return 0

    try:
        rows = _read_tracker_rows(tracker_path)
        pr_row = _pick_failure_pr(rows, FAILURE_VALUES_DEFAULT)
        if pr_row is None:
            print("[dispatcher] no failing PR found (noop)")
            return 0

        print(
            f"[dispatcher] selected pr=#{pr_row.pr} state={_norm(pr_row.state)} ci_gate={_norm(pr_row.ci_gate)}"
        )
        if args.dry_run:
            print("[dispatcher] dry-run enabled; skipping autopilot execution")
            return 0

        return _run_autopilot(repo=repo, pr=pr_row.pr, max_attempts=args.max, out_dir=args.out)
    finally:
        try:
            os.close(lock_fd)  # type: ignore[arg-type]
        except Exception:
            pass


if __name__ == "__main__":
    raise SystemExit(main())

