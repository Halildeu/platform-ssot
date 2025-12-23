#!/usr/bin/env python3
"""
PR Tracker (TSV) – Local SSOT helper (v0.1)

Amaç:
- Localde takip edilen PR'lar için tek bir TSV kayıt tutmak.
- GitHub'dan (gh api) PR meta + workflow run durumlarını çekip TSV'yi güncellemek.

Notlar:
- Token/secret değerleri ASLA loglanmaz.
- Çıktı dosyası localdir: `.autopilot-tmp/pr-tracker/PR-TRACKER.tsv` (gitignore/exclude ile dışarıda tutulur).

Kullanım:
  python3 scripts/pr_tracker_tsv.py add --pr 53 [--repo owner/repo]
  python3 scripts/pr_tracker_tsv.py sync [--repo owner/repo] [--watch 30]
  python3 scripts/pr_tracker_tsv.py report --out .autopilot-tmp/pr-tracker/STATUS.md
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence, Tuple


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_TRACKER_PATH = ROOT / ".autopilot-tmp/pr-tracker/PR-TRACKER.tsv"

COLUMNS = [
    "PR",
    "BRANCH",
    "TITLE",
    "STATE",
    "HEAD_SHA",
    "CI_GATE",
    "CI_GATE_RUN_URL",
    "FAIL_WORKFLOWS",
    "MERGEABLE_STATE",
    "LABELS",
    "LAST_UPDATE",
    "NOTE",
]


def utc_now() -> str:
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def eprint(msg: str) -> None:
    print(msg, file=sys.stderr)


def run(cmd: Sequence[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, cwd=str(ROOT), text=True, capture_output=True)


def require_ok(proc: subprocess.CompletedProcess[str], context: str) -> str:
    if proc.returncode != 0:
        raise RuntimeError(f"{context}: rc={proc.returncode} stderr={proc.stderr.strip()}")
    return (proc.stdout or "").strip()


def parse_owner_repo_from_origin() -> Optional[str]:
    proc = run(["git", "remote", "get-url", "origin"])
    if proc.returncode != 0:
        return None
    url = (proc.stdout or "").strip()
    m = re.search(r"github\.com[:/](.+?)/(.+?)(?:\.git)?$", url)
    if not m:
        return None
    return f"{m.group(1)}/{m.group(2)}"


def resolve_repo(value: Optional[str]) -> str:
    if value and "/" in value:
        return value
    inferred = parse_owner_repo_from_origin()
    if inferred:
        return inferred
    raise SystemExit("HATA: --repo verilmeli (örn: owner/repo) veya origin remote github.com olmalı.")


def ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def read_tracker(path: Path) -> Tuple[List[str], List[Dict[str, str]]]:
    if not path.exists():
        return COLUMNS[:], []

    with path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f, delimiter="\t")
        header = reader.fieldnames or []
        rows = []
        for row in reader:
            if not row:
                continue
            pr = (row.get("PR") or "").strip()
            if not pr:
                continue
            rows.append({k: (v or "") for k, v in row.items()})

    # Schema upgrade: COLUMNS + unknown extras
    new_cols = COLUMNS[:] + [c for c in header if c and c not in COLUMNS]
    # Fill missing columns
    for r in rows:
        for c in new_cols:
            r.setdefault(c, "")

    # Persist upgrade if header differs
    if header != new_cols:
        write_tracker(path, new_cols, rows)
    return new_cols, rows


def write_tracker(path: Path, columns: List[str], rows: List[Dict[str, str]]) -> None:
    ensure_parent(path)
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=columns, delimiter="\t")
        writer.writeheader()
        for r in rows:
            writer.writerow({c: (r.get(c) or "") for c in columns})


def upsert_row(rows: List[Dict[str, str]], pr_number: int) -> Dict[str, str]:
    pr_str = str(pr_number)
    for r in rows:
        if (r.get("PR") or "").strip() == pr_str:
            return r
    r = {c: "" for c in COLUMNS}
    r["PR"] = pr_str
    rows.append(r)
    return r


def gh_api_json(endpoint: str, paginate: bool = False) -> Any:
    cmd = ["gh", "api"]
    if paginate:
        cmd.extend(["--paginate", "--slurp"])
    cmd.append(endpoint)
    proc = run(cmd)
    out = require_ok(proc, f"gh api {endpoint}")
    return json.loads(out) if out else None


@dataclass(frozen=True)
class RunSummary:
    ci_gate: str
    ci_gate_url: str
    fail_workflows: List[str]


def collect_runs(repo: str, head_sha: str) -> RunSummary:
    endpoint = f"repos/{repo}/actions/runs?event=pull_request&head_sha={head_sha}&per_page=100"
    pages = gh_api_json(endpoint, paginate=True)
    if not isinstance(pages, list):
        pages = [pages]

    all_runs: List[Dict[str, Any]] = []
    for page in pages:
        if not isinstance(page, dict):
            continue
        runs = page.get("workflow_runs") or []
        if isinstance(runs, list):
            all_runs.extend([r for r in runs if isinstance(r, dict)])

    def is_completed(r: Dict[str, Any]) -> bool:
        return r.get("status") == "completed"

    # newest-first; pick latest completed run for each workflow name
    by_name: Dict[str, Dict[str, Any]] = {}
    for r in all_runs:
        name = r.get("name")
        if not isinstance(name, str) or not name.strip():
            continue
        if name in by_name:
            continue
        if not is_completed(r):
            continue
        by_name[name] = r

    ci = by_name.get("ci-gate")
    ci_gate = (ci or {}).get("conclusion") or "unknown"
    ci_gate_url = (ci or {}).get("html_url") or ""
    if not isinstance(ci_gate_url, str):
        ci_gate_url = ""

    fail_names: List[str] = []
    for name, r in by_name.items():
        conclusion = r.get("conclusion")
        if not isinstance(conclusion, str) or not conclusion:
            continue
        if conclusion == "success":
            continue
        fail_names.append(name)
    fail_names.sort()

    return RunSummary(ci_gate=str(ci_gate), ci_gate_url=ci_gate_url, fail_workflows=fail_names)


def sync_one(path: Path, repo: str, pr_number: int) -> Tuple[bool, str]:
    cols, rows = read_tracker(path)
    row = upsert_row(rows, pr_number)
    row["LAST_UPDATE"] = utc_now()
    row["NOTE"] = ""

    try:
        pr = gh_api_json(f"repos/{repo}/pulls/{pr_number}", paginate=False)
        if not isinstance(pr, dict):
            raise RuntimeError("PR response dict değil.")

        row["TITLE"] = str(pr.get("title") or "")
        row["STATE"] = str(pr.get("state") or "")
        row["MERGEABLE_STATE"] = str(pr.get("mergeable_state") or "")

        head = pr.get("head") or {}
        if isinstance(head, dict):
            row["BRANCH"] = str(head.get("ref") or "")
            row["HEAD_SHA"] = str(head.get("sha") or "")

        labels = pr.get("labels") or []
        label_names: List[str] = []
        if isinstance(labels, list):
            for l in labels:
                if isinstance(l, dict) and isinstance(l.get("name"), str):
                    label_names.append(l["name"])
        row["LABELS"] = ",".join(label_names)

        head_sha = (row.get("HEAD_SHA") or "").strip()
        if head_sha:
            runs = collect_runs(repo, head_sha)
            row["CI_GATE"] = runs.ci_gate
            row["CI_GATE_RUN_URL"] = runs.ci_gate_url
            row["FAIL_WORKFLOWS"] = ",".join(runs.fail_workflows)
        else:
            row["CI_GATE"] = "unknown"
            row["CI_GATE_RUN_URL"] = ""
            row["FAIL_WORKFLOWS"] = ""

        write_tracker(path, cols, rows)
        return True, ""

    except Exception as exc:
        row["NOTE"] = f"error:{exc}"
        write_tracker(path, cols, rows)
        return False, str(exc)


def cmd_add(args: argparse.Namespace) -> int:
    repo = resolve_repo(args.repo)
    ok, msg = sync_one(Path(args.tracker_path), repo, args.pr)
    if ok:
        print(f"[tracker] ok: PR #{args.pr} synced")
        return 0
    print(f"[tracker] warn: PR #{args.pr} sync failed: {msg}")
    return 0


def cmd_sync(args: argparse.Namespace) -> int:
    repo = resolve_repo(args.repo)
    path = Path(args.tracker_path)
    cols, rows = read_tracker(path)
    prs = []
    for r in rows:
        pr = (r.get("PR") or "").strip()
        if pr.isdigit():
            prs.append(int(pr))

    if not prs:
        # file yoksa header üretelim
        if not path.exists():
            write_tracker(path, cols, [])
        print("[tracker] info: no PRs in tracker")
        return 0

    for pr in prs:
        sync_one(path, repo, pr)

    print(f"[tracker] ok: synced {len(prs)} PR(s)")
    return 0


def cmd_watch(args: argparse.Namespace) -> int:
    interval = args.watch
    while True:
        cmd_sync(args)
        try:
            import time

            time.sleep(interval)
        except KeyboardInterrupt:
            return 0


def cmd_report(args: argparse.Namespace) -> int:
    path = Path(args.tracker_path)
    _, rows = read_tracker(path)
    out_path = Path(args.out)
    ensure_parent(out_path)

    lines: List[str] = []
    lines.append("# PR Tracker Snapshot")
    lines.append("")
    lines.append(f"- Updated: {utc_now()}")
    lines.append(f"- Source: `{path}`")
    lines.append("")

    if not rows:
        lines.append("No rows.")
        out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
        print(f"[tracker] ok: wrote {out_path}")
        return 0

    lines.append("| PR | Branch | State | ci-gate | Failing workflows | Labels | Note |")
    lines.append("|---:|---|---|---|---|---|---|")
    for r in rows:
        pr = (r.get("PR") or "").strip()
        branch = (r.get("BRANCH") or "").strip()
        state = (r.get("STATE") or "").strip()
        ci_gate = (r.get("CI_GATE") or "").strip()
        fail_wf = (r.get("FAIL_WORKFLOWS") or "").strip()
        labels = (r.get("LABELS") or "").strip()
        note = (r.get("NOTE") or "").strip()
        lines.append(f"| {pr} | {branch} | {state} | {ci_gate} | {fail_wf} | {labels} | {note} |")

    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"[tracker] ok: wrote {out_path}")
    return 0


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    ap = argparse.ArgumentParser(prog="pr_tracker_tsv.py")
    ap.add_argument("--repo", default=None, help="owner/repo (default: origin remote)")
    ap.add_argument("--tracker-path", default=str(DEFAULT_TRACKER_PATH))
    sub = ap.add_subparsers(dest="cmd", required=True)

    a = sub.add_parser("add", help="Add/update a PR row (and sync from GitHub)")
    a.add_argument("--pr", type=int, required=True)
    a.set_defaults(fn=cmd_add)

    s = sub.add_parser("sync", help="Sync all PRs listed in tracker from GitHub")
    s.add_argument("--watch", type=int, default=0, help="Loop every N seconds (0=single run)")
    s.set_defaults(fn=cmd_watch)

    r = sub.add_parser("report", help="Write a markdown STATUS report from TSV")
    r.add_argument("--out", required=True)
    r.set_defaults(fn=cmd_report)

    return ap.parse_args(list(argv))


def main(argv: Sequence[str]) -> int:
    args = parse_args(argv)
    if args.cmd == "sync" and getattr(args, "watch", 0) == 0:
        return cmd_sync(args)
    return int(args.fn(args))


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
