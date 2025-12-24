#!/usr/bin/env python3
"""
PR Tracker (TSV) – Local SSOT helper (v0.3)

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
import os
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
    "DRAFT",
    "HEAD_SHA",
    "CI_GATE",
    "CI_GATE_RUN_URL",
    "FAIL_WORKFLOWS",
    "MERGEABLE",
    "MERGEABLE_STATE",
    "HAS_CONFLICTS",
    "MERGE_POLICY",
    "READY_LABEL",
    "LABELS",
    "LAST_UPDATE",
    "NEXT_ACTION",
    "NOTE",
]


def utc_now() -> str:
    # Python 3.12+: datetime.utcnow() deprecated; keep timezone-aware UTC string.
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
    m = re.search(r"github\.com[:/](?P<owner>[^/]+)/(?P<repo>[^/]+?)(?:\.git)?$", url)
    if not m:
        return None
    return f"{m.group('owner')}/{m.group('repo')}"


def resolve_repo(value: Optional[str]) -> str:
    if value and "/" in value:
        return value
    env_repo = (os.environ.get("GITHUB_REPOSITORY") or "").strip()
    if "/" in env_repo:
        return env_repo
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


@dataclass(frozen=True)
class MergePolicySummary:
    merge_policy: str
    ready_label_name: str


MERGE_POLICY_NONE = "none"
MERGE_POLICY_BOT_SQUASH = "bot_squash"


def load_pr_bot_rules() -> Dict[str, Any]:
    path = ROOT / "docs/04-operations/PR-BOT-RULES.json"
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return {}
    except json.JSONDecodeError:
        return {}


def compute_merge_policy(config: Dict[str, Any], branch: str) -> MergePolicySummary:
    ready_label = config.get("ready_to_merge_label") or "pr-bot/ready-to-merge"
    if not isinstance(ready_label, str) or not ready_label.strip():
        ready_label = "pr-bot/ready-to-merge"

    rules = config.get("rules") or []
    if not isinstance(rules, list):
        rules = []

    def parse_rule_merge_policy(raw: Dict[str, Any]) -> Optional[str]:
        val = raw.get("merge_policy")
        if val is None:
            auto_merge_val = raw.get("auto_merge")
            return MERGE_POLICY_BOT_SQUASH if auto_merge_val is True else MERGE_POLICY_NONE
        if isinstance(val, str) and val.strip():
            return val.strip()
        return None

    # exact match first
    for raw in rules:
        if not isinstance(raw, dict):
            continue
        if raw.get("match") == branch:
            mp = parse_rule_merge_policy(raw)
            return MergePolicySummary(merge_policy=mp or MERGE_POLICY_NONE, ready_label_name=ready_label)

    # fnmatch patterns
    import fnmatch

    for raw in rules:
        if not isinstance(raw, dict):
            continue
        match = raw.get("match")
        if not isinstance(match, str) or not match.strip():
            continue
        if fnmatch.fnmatch(branch, match):
            mp = parse_rule_merge_policy(raw)
            return MergePolicySummary(merge_policy=mp or MERGE_POLICY_NONE, ready_label_name=ready_label)

    # default
    return MergePolicySummary(merge_policy=MERGE_POLICY_NONE, ready_label_name=ready_label)


def compute_next_action(
    *,
    state: str,
    draft: bool,
    mergeable: Optional[bool],
    mergeable_state: str,
    ci_gate: str,
    merge_policy: str,
    ready_label_present: bool,
    fail_workflows: List[str],
) -> str:
    if state.lower() != "open":
        return "NONE"
    if draft:
        return "DRAFT"
    if mergeable_state.lower() == "dirty":
        return "RESOLVE_CONFLICTS"
    if ci_gate in ("", "missing", "queued", "in_progress", "unknown"):
        return "WAIT_CI_GATE"
    if ci_gate != "success":
        return "FIX_CI"
    if merge_policy != MERGE_POLICY_BOT_SQUASH:
        return "POLICY_NO_MERGE"
    if not ready_label_present:
        return "ADD_READY_LABEL"
    if fail_workflows:
        return "FIX_OTHER_FAIL"
    if mergeable_state.lower() in ("unstable", "unknown", ""):
        return "WAIT_MERGEABLE"
    if mergeable is False:
        return "WAIT_MERGEABLE"
    return "READY"


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

    # newest-first; keep latest run per workflow name (any status) + latest completed run per name
    latest_by_name: Dict[str, Dict[str, Any]] = {}
    completed_by_name: Dict[str, Dict[str, Any]] = {}
    for r in all_runs:
        name = r.get("name")
        if not isinstance(name, str) or not name.strip():
            continue
        if name not in latest_by_name:
            latest_by_name[name] = r
        if r.get("status") == "completed" and name not in completed_by_name:
            completed_by_name[name] = r

    ci = latest_by_name.get("ci-gate") or {}
    ci_status = ci.get("status")
    if isinstance(ci_status, str) and ci_status and ci_status != "completed":
        ci_gate = ci_status
    else:
        # completed: use conclusion
        ci_gate = (ci.get("conclusion") if isinstance(ci.get("conclusion"), str) else None) or "missing"

    ci_gate_url = (ci.get("html_url") if isinstance(ci.get("html_url"), str) else "") or ""

    fail_names: List[str] = []
    for name, r in completed_by_name.items():
        conclusion = r.get("conclusion")
        if not isinstance(conclusion, str) or not conclusion:
            continue
        if conclusion in ("success", "skipped"):
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
        row["HAS_CONFLICTS"] = "true" if (row["MERGEABLE_STATE"].strip().lower() == "dirty") else "false"

        draft_val = pr.get("draft")
        row["DRAFT"] = "true" if draft_val is True else "false"

        mergeable_val = pr.get("mergeable")
        if mergeable_val is True:
            row["MERGEABLE"] = "true"
        elif mergeable_val is False:
            row["MERGEABLE"] = "false"
        else:
            row["MERGEABLE"] = "unknown"

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
        runs = RunSummary(ci_gate="missing", ci_gate_url="", fail_workflows=[])
        if head_sha:
            runs = collect_runs(repo, head_sha)
            row["CI_GATE"] = runs.ci_gate
            row["CI_GATE_RUN_URL"] = runs.ci_gate_url
            row["FAIL_WORKFLOWS"] = ",".join(runs.fail_workflows)
        else:
            row["CI_GATE"] = "missing"
            row["CI_GATE_RUN_URL"] = ""
            row["FAIL_WORKFLOWS"] = ""

        rules_cfg = load_pr_bot_rules()
        mp = compute_merge_policy(rules_cfg, (row.get("BRANCH") or "").strip())
        row["MERGE_POLICY"] = mp.merge_policy
        ready_present = mp.ready_label_name in label_names
        row["READY_LABEL"] = "true" if ready_present else "false"

        row["NEXT_ACTION"] = compute_next_action(
            state=(row.get("STATE") or ""),
            draft=(row.get("DRAFT") == "true"),
            mergeable=(True if row.get("MERGEABLE") == "true" else False if row.get("MERGEABLE") == "false" else None),
            mergeable_state=(row.get("MERGEABLE_STATE") or ""),
            ci_gate=(row.get("CI_GATE") or "missing"),
            merge_policy=(row.get("MERGE_POLICY") or MERGE_POLICY_NONE),
            ready_label_present=ready_present,
            fail_workflows=runs.fail_workflows,
        )

        write_tracker(path, cols, rows)
        return True, ""

    except Exception as exc:
        row["NOTE"] = f"error:{exc}"
        # Best-effort: keep last_update / partial fields; don't crash sync loop.
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
    repo = resolve_repo(getattr(args, "repo", None))

    lines: List[str] = []
    lines.append("# PR Tracker Snapshot")
    lines.append("")
    lines.append(f"- Repo: `{repo}`")
    lines.append(f"- Updated: {utc_now()}")
    lines.append(f"- Source: `{path}`")
    lines.append("")

    if not rows:
        lines.append("No rows.")
        out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
        print(f"[tracker] ok: wrote {out_path}")
        return 0

    lines.append("| PR | Branch | State | ci-gate | Fail workflows | Mergeable | Policy | Ready | Next | Labels | Note |")
    lines.append("|---:|---|---|---|---|---|---|---|---|---|---|")
    for r in rows:
        pr = (r.get("PR") or "").strip()
        branch = (r.get("BRANCH") or "").strip()
        state = (r.get("STATE") or "").strip()
        ci_gate = (r.get("CI_GATE") or "").strip()
        fail_wf = (r.get("FAIL_WORKFLOWS") or "").strip()
        mergeable_state = (r.get("MERGEABLE_STATE") or "").strip()
        merge_policy = (r.get("MERGE_POLICY") or "").strip()
        ready = (r.get("READY_LABEL") or "").strip()
        next_action = (r.get("NEXT_ACTION") or "").strip()
        labels = (r.get("LABELS") or "").strip()
        note = (r.get("NOTE") or "").strip()
        ci_cell = ci_gate
        if ci_gate and (r.get("CI_GATE_RUN_URL") or "").strip():
            ci_url = (r.get("CI_GATE_RUN_URL") or "").strip()
            ci_cell = f"[{ci_gate}]({ci_url})"
        mergeable_cell = mergeable_state or (r.get("MERGEABLE") or "").strip()
        lines.append(
            f"| [{pr}](https://github.com/{repo}/pull/{pr}) | `{branch}` | `{state}` | {ci_cell} | `{fail_wf}` | `{mergeable_cell}` | `{merge_policy}` | `{ready}` | `{next_action}` | `{labels}` | {note} |"
        )

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
