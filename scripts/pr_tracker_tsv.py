#!/usr/bin/env python3
"""
PR tracker (TSV) – Local SSOT helper

Amaç:
- Yerelde `.autopilot-tmp/pr-tracker/PR-TRACKER.tsv` içinde PR'ları takip etmek,
- `sync` ile PR durumlarını ve `ci-gate` koşumunu güncellemek,
- `report` ile tek sayfalık STATUS.md üretmek.

Notlar:
- Bu script "local SSOT" içindir; CI gate değildir.
- `gh` CLI kullanır (Python SSL/CA sorunlarını by-pass eder).
- Token değeri hiçbir koşulda loglanmaz.
- Hata durumlarında TSV satırına NOTE yazıp exit=0 döner (gürültüsüz).
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import subprocess
import sys
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Sequence, Tuple


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_TRACKER_PATH = ROOT / ".autopilot-tmp/pr-tracker/PR-TRACKER.tsv"
DEFAULT_WORKFLOW_NAME = "ci-gate"

COLUMNS = [
    "PR",
    "BRANCH",
    "TITLE",
    "STATE",
    "HEAD_SHA",
    "CI_GATE",
    "CI_GATE_RUN_URL",
    "MERGEABLE_STATE",
    "LABELS",
    "LAST_UPDATE",
    "NOTE",
]


@dataclass(frozen=True)
class PrSnapshot:
    pr: int
    branch: str
    title: str
    state: str
    head_sha: str
    mergeable_state: str
    labels: List[str]


@dataclass(frozen=True)
class WorkflowRunSnapshot:
    name: str
    status: str
    conclusion: str
    html_url: str


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def eprint(msg: str) -> None:
    print(msg, file=sys.stderr)


def infer_repo_from_origin() -> str:
    try:
        out = subprocess.check_output(
            ["git", "remote", "get-url", "origin"],
            cwd=ROOT,
            text=True,
            stderr=subprocess.DEVNULL,
        ).strip()
    except Exception:
        return ""

    # https://github.com/OWNER/REPO(.git) or git@github.com:OWNER/REPO(.git)
    m = re.search(r"github\.com[:/](.+?)/(.+?)(?:\.git)?$", out)
    if not m:
        return ""
    return f"{m.group(1)}/{m.group(2)}"


def run_gh(args: Sequence[str], timeout_sec: int = 30) -> Tuple[int, str, str]:
    try:
        cp = subprocess.run(
            ["gh", *args],
            cwd=ROOT,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=timeout_sec,
        )
        return cp.returncode, cp.stdout, cp.stderr
    except FileNotFoundError:
        return 127, "", "gh not found"
    except subprocess.TimeoutExpired:
        return 124, "", "timeout"


def gh_json(args: Sequence[str], timeout_sec: int = 30) -> Tuple[Optional[dict | list], str]:
    code, out, err = run_gh(args, timeout_sec=timeout_sec)
    if code != 0:
        msg = (err or out).strip() or f"gh exit={code}"
        return None, msg
    if not out.strip():
        return None, "empty gh output"
    try:
        return json.loads(out), ""
    except json.JSONDecodeError:
        return None, "invalid json"


def ensure_tracker(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        return
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f, delimiter="\t")
        writer.writerow(COLUMNS)


def read_rows(path: Path) -> List[Dict[str, str]]:
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f, delimiter="\t")
        rows: List[Dict[str, str]] = []
        for row in reader:
            if not row:
                continue
            rows.append({k: (row.get(k) or "") for k in COLUMNS})
        return rows


def write_rows(path: Path, rows: List[Dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=COLUMNS, delimiter="\t", extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({k: (row.get(k) or "") for k in COLUMNS})


def normalize_note(msg: str) -> str:
    m = msg.strip().replace("\n", " ")
    return m[:240]


def fetch_pr(repo: str, pr_number: int) -> Tuple[Optional[PrSnapshot], str]:
    data, err = gh_json(["api", f"repos/{repo}/pulls/{pr_number}"], timeout_sec=30)
    if data is None or not isinstance(data, dict):
        return None, f"pr_fetch_failed: {err}"

    head = data.get("head") or {}
    labels = data.get("labels") or []
    label_names: List[str] = []
    if isinstance(labels, list):
        for x in labels:
            if isinstance(x, dict) and isinstance(x.get("name"), str):
                label_names.append(x["name"])

    snapshot = PrSnapshot(
        pr=pr_number,
        branch=str((head or {}).get("ref") or ""),
        title=str(data.get("title") or ""),
        state=str(data.get("state") or ""),
        head_sha=str((head or {}).get("sha") or ""),
        mergeable_state=str(data.get("mergeable_state") or ""),
        labels=sorted(set(label_names)),
    )
    return snapshot, ""


def fetch_workflow_run(repo: str, head_sha: str, workflow_name: str) -> Tuple[Optional[WorkflowRunSnapshot], str]:
    if not head_sha:
        return None, "missing head_sha"

    data, err = gh_json(
        ["api", f"repos/{repo}/actions/runs?event=pull_request&head_sha={head_sha}&per_page=50"],
        timeout_sec=30,
    )
    if data is None or not isinstance(data, dict):
        return None, f"runs_fetch_failed: {err}"

    runs = data.get("workflow_runs") or []
    if not isinstance(runs, list):
        return None, "runs_fetch_failed: invalid payload"

    picked: Optional[dict] = None
    for r in runs:
        if isinstance(r, dict) and r.get("name") == workflow_name:
            picked = r
            break
    if not picked:
        return None, "runs_not_found"

    status = str(picked.get("status") or "")
    conclusion = str(picked.get("conclusion") or "")
    html_url = str(picked.get("html_url") or "")

    return WorkflowRunSnapshot(name=workflow_name, status=status, conclusion=conclusion, html_url=html_url), ""


def upsert_row(rows: List[Dict[str, str]], new_row: Dict[str, str]) -> None:
    pr = new_row.get("PR") or ""
    for i, r in enumerate(rows):
        if (r.get("PR") or "") == pr:
            rows[i] = new_row
            return
    rows.append(new_row)


def update_pr_row(repo: str, pr_number: int, workflow_name: str) -> Dict[str, str]:
    base: Dict[str, str] = {k: "" for k in COLUMNS}
    base["PR"] = str(pr_number)
    base["LAST_UPDATE"] = utc_now()

    pr, pr_err = fetch_pr(repo, pr_number)
    if pr is None:
        base["NOTE"] = normalize_note(pr_err)
        base["CI_GATE"] = "unknown"
        return base

    base["BRANCH"] = pr.branch
    base["TITLE"] = pr.title
    base["STATE"] = pr.state
    base["HEAD_SHA"] = pr.head_sha
    base["MERGEABLE_STATE"] = pr.mergeable_state
    base["LABELS"] = ",".join(pr.labels)

    run, run_err = fetch_workflow_run(repo, pr.head_sha, workflow_name)
    if run is None:
        base["CI_GATE"] = "unknown" if run_err.startswith("runs_fetch_failed") else run_err
        base["NOTE"] = normalize_note(run_err) if run_err and run_err != "runs_not_found" else ""
        return base

    if run.status == "completed":
        base["CI_GATE"] = run.conclusion or "unknown"
    else:
        base["CI_GATE"] = run.status or "unknown"
    base["CI_GATE_RUN_URL"] = run.html_url
    base["NOTE"] = ""
    return base


def cmd_add(args: argparse.Namespace) -> int:
    repo = args.repo or infer_repo_from_origin()
    if not repo:
        eprint("[pr-tracker] repo cannot be inferred; use --repo owner/repo")
        # Fail-safe: still write a minimal row.
        repo = ""

    tracker_path = Path(args.tracker_path)
    ensure_tracker(tracker_path)
    rows = read_rows(tracker_path)

    if not repo:
        row = {k: "" for k in COLUMNS}
        row["PR"] = str(args.pr)
        row["LAST_UPDATE"] = utc_now()
        row["NOTE"] = "repo_missing"
        upsert_row(rows, row)
        write_rows(tracker_path, rows)
        return 0

    row = update_pr_row(repo=repo, pr_number=args.pr, workflow_name=args.workflow_name)
    upsert_row(rows, row)
    write_rows(tracker_path, sorted(rows, key=lambda r: int(r.get("PR") or "0")))
    return 0


def cmd_sync_once(repo: str, tracker_path: Path, workflow_name: str) -> int:
    ensure_tracker(tracker_path)
    rows = read_rows(tracker_path)
    if not rows:
        return 0

    out_rows: List[Dict[str, str]] = []
    for r in rows:
        pr_raw = (r.get("PR") or "").strip()
        if not pr_raw.isdigit():
            continue
        pr_number = int(pr_raw)
        out_rows.append(update_pr_row(repo=repo, pr_number=pr_number, workflow_name=workflow_name))

    write_rows(tracker_path, sorted(out_rows, key=lambda x: int(x.get("PR") or "0")))
    return 0


def cmd_sync(args: argparse.Namespace) -> int:
    repo = args.repo or infer_repo_from_origin()
    if not repo:
        eprint("[pr-tracker] repo cannot be inferred; use --repo owner/repo")
        return 0

    tracker_path = Path(args.tracker_path)
    watch = int(args.watch or 0)
    if watch <= 0:
        return cmd_sync_once(repo=repo, tracker_path=tracker_path, workflow_name=args.workflow_name)

    while True:
        cmd_sync_once(repo=repo, tracker_path=tracker_path, workflow_name=args.workflow_name)
        time.sleep(watch)


def build_md_table(rows: List[Dict[str, str]], repo: str) -> str:
    lines: List[str] = []
    lines.append("# PR Tracker Status")
    lines.append("")
    lines.append(f"- Repo: `{repo or 'unknown'}`")
    lines.append(f"- Updated: `{utc_now()}`")
    lines.append("")
    lines.append("| PR | Branch | State | ci-gate | Mergeable | Labels | Note |")
    lines.append("|---:|---|---|---|---|---|---|")

    for r in sorted(rows, key=lambda x: int((x.get("PR") or "0") or "0")):
        pr = r.get("PR") or ""
        pr_cell = f"#{pr}"
        if repo and pr.isdigit():
            pr_cell = f"[#{pr}](https://github.com/{repo}/pull/{pr})"

        run_url = (r.get("CI_GATE_RUN_URL") or "").strip()
        ci_gate = (r.get("CI_GATE") or "").strip()
        if run_url:
            ci_gate = f"[{ci_gate or 'run'}]({run_url})"

        branch = (r.get("BRANCH") or "").strip()
        state = (r.get("STATE") or "").strip()
        mergeable = (r.get("MERGEABLE_STATE") or "").strip()
        labels = (r.get("LABELS") or "").strip()
        note = (r.get("NOTE") or "").strip()

        lines.append(f"| {pr_cell} | `{branch}` | `{state}` | `{ci_gate}` | `{mergeable}` | `{labels}` | {note} |")
    lines.append("")
    return "\n".join(lines)


def cmd_report(args: argparse.Namespace) -> int:
    repo = args.repo or infer_repo_from_origin()
    tracker_path = Path(args.tracker_path)
    ensure_tracker(tracker_path)
    rows = read_rows(tracker_path)

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(build_md_table(rows, repo=repo), encoding="utf-8")
    return 0


def build_parser() -> argparse.ArgumentParser:
    ap = argparse.ArgumentParser(prog="pr_tracker_tsv.py")
    ap.add_argument("--repo", default="", help="owner/repo (default: infer from git origin)")
    ap.add_argument("--tracker-path", default=str(DEFAULT_TRACKER_PATH), help="TSV path (default: .autopilot-tmp/...)")
    ap.add_argument("--workflow-name", default=DEFAULT_WORKFLOW_NAME, help="required workflow name (default: ci-gate)")

    sub = ap.add_subparsers(dest="cmd", required=True)

    add = sub.add_parser("add", help="TSV'ye satır ekle/güncelle")
    add.add_argument("--pr", type=int, required=True, help="PR number")
    add.set_defaults(func=cmd_add)

    sync = sub.add_parser("sync", help="TSV'deki tüm PR'ları güncelle")
    sync.add_argument("--watch", type=int, default=0, help="Seconds (polling). 0: single run.")
    sync.set_defaults(func=cmd_sync)

    report = sub.add_parser("report", help="STATUS.md üret (markdown)")
    report.add_argument("--out", required=True, help="Output markdown path")
    report.set_defaults(func=cmd_report)

    return ap


def main(argv: Sequence[str]) -> int:
    ap = build_parser()
    args = ap.parse_args(argv)
    try:
        return int(args.func(args) or 0)
    except KeyboardInterrupt:
        return 130
    except Exception as exc:
        # Fail-safe: tracker script CI kapısı değil.
        eprint(f"[pr-tracker] error: {type(exc).__name__}: {exc}")
        return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
