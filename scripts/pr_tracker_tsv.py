#!/usr/bin/env python3
"""
Local PR tracker (TSV) – Local SSOT uyumlu (v0.3).

- TSV dosyası gitignored olmalıdır:
  `.autopilot-tmp/pr-tracker/PR-TRACKER.tsv`

Komutlar:
  - add    : tek PR için satır ekle/güncelle (GitHub'dan sync eder)
  - sync   : TSV'deki tüm PR'ları güncelle (opsiyonel --watch)
  - report : TSV'den STATUS.md üret (local-only)

Notlar:
- Token değeri asla yazdırılmaz.
- Hata durumunda tracker satırı NOTE alanında işaretlenir; exit code 0 (gürültü yok).
"""

from __future__ import annotations

import argparse
import fnmatch
import json
import os
import re
import subprocess
import sys
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_TRACKER_PATH = ROOT / ".autopilot-tmp" / "pr-tracker" / "PR-TRACKER.tsv"
DEFAULT_STATUS_PATH = ROOT / ".autopilot-tmp" / "pr-tracker" / "STATUS.md"
DEFAULT_WORKFLOW_NAME = "ci-gate"
PR_BOT_RULES_PATH = ROOT / "docs-ssot/04-operations/PR-BOT-RULES.json"

MERGE_POLICY_NONE = "none"
MERGE_POLICY_BOT_SQUASH = "bot_squash"
MERGE_POLICIES = {MERGE_POLICY_NONE, MERGE_POLICY_BOT_SQUASH}
DEFAULT_READY_LABEL = "pr-bot/ready-to-merge"

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
    "MERGE_POLICY",
    "READY_LABEL",
    "LABELS",
    "LAST_UPDATE",
    "NEXT_ACTION",
    "NOTE",
]


class GitHubApiError(RuntimeError):
    def __init__(self, message: str) -> None:
        super().__init__(message)


def utc_now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def sanitize_cell(value: str) -> str:
    # TSV bozulmasın diye \t ve satır sonlarını temizliyoruz.
    return value.replace("\t", " ").replace("\r", " ").replace("\n", " ").strip()


def bool_str(value: Any) -> str:
    if value is True:
        return "true"
    if value is False:
        return "false"
    return ""


def read_git_origin_repo() -> Optional[str]:
    try:
        proc = subprocess.run(
            ["git", "remote", "get-url", "origin"],
            cwd=ROOT,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            text=True,
        )
    except Exception:
        return None

    url = (proc.stdout or "").strip()
    if not url:
        return None

    # https://github.com/OWNER/REPO(.git)
    m = re.search(r"github\.com/([^/]+)/([^/]+?)(?:\.git)?$", url)
    if m:
        return f"{m.group(1)}/{m.group(2)}"

    # git@github.com:OWNER/REPO(.git)
    m = re.search(r"github\.com:([^/]+)/([^/]+?)(?:\.git)?$", url)
    if m:
        return f"{m.group(1)}/{m.group(2)}"

    return None


def resolve_repo(explicit_repo: Optional[str]) -> str:
    if explicit_repo:
        return explicit_repo.strip()
    if os.environ.get("GITHUB_REPOSITORY"):
        return os.environ["GITHUB_REPOSITORY"].strip()
    repo = read_git_origin_repo()
    if repo:
        return repo
    raise SystemExit("HATA: --repo verilmedi ve origin remote'dan owner/repo parse edilemedi.")


def gh_api_json(path: str) -> Dict[str, Any]:
    """
    HTTP client olarak gh CLI kullanılır (local SSL/CA sorunlarını aşmak için).
    Token değeri asla yazdırılmaz; gh CLI, GH_TOKEN/GITHUB_TOKEN veya lokal auth ile çalışır.
    """
    try:
        proc = subprocess.run(
            ["gh", "api", path],
            cwd=ROOT,
            check=False,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
    except FileNotFoundError:
        raise GitHubApiError("gh_not_found")

    if proc.returncode != 0:
        msg = (proc.stderr or proc.stdout or "").strip()
        last = msg.splitlines()[-1] if msg else "unknown_error"
        raise GitHubApiError(f"gh_api_error: {sanitize_cell(last)}")

    try:
        return json.loads(proc.stdout or "{}")
    except json.JSONDecodeError:
        raise GitHubApiError("invalid_json")


def ensure_tracker_file(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        path.write_text("\t".join(COLUMNS) + "\n", encoding="utf-8")
        return
    content = path.read_text(encoding="utf-8")
    if not content.strip():
        path.write_text("\t".join(COLUMNS) + "\n", encoding="utf-8")


def write_tracker_rows(path: Path, rows: List[Dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    out_lines = ["\t".join(COLUMNS)]
    for row in rows:
        out_lines.append("\t".join(sanitize_cell(row.get(col, "")) for col in COLUMNS))
    path.write_text("\n".join(out_lines) + "\n", encoding="utf-8")


def read_tracker_rows(path: Path) -> List[Dict[str, str]]:
    ensure_tracker_file(path)
    lines = path.read_text(encoding="utf-8").splitlines()
    if not lines:
        return []
    header = lines[0].split("\t")
    rows: List[Dict[str, str]] = []
    for line in lines[1:]:
        if not line.strip():
            continue
        parts = line.split("\t")
        if len(parts) < len(header):
            parts = parts + [""] * (len(header) - len(parts))
        d = dict(zip(header, parts))
        rows.append({k: d.get(k, "") for k in COLUMNS})

    # Backward-compatible schema upgrade: header drift varsa yeni header ile rewrite.
    if header != COLUMNS:
        write_tracker_rows(path, rows)
    return rows


def upsert_row(rows: List[Dict[str, str]], new_row: Dict[str, str]) -> None:
    key = str(new_row.get("PR", "")).strip()
    if not key:
        return
    for i, r in enumerate(rows):
        if str(r.get("PR", "")).strip() == key:
            rows[i] = new_row
            return
    rows.append(new_row)


def match_any(branch: str, patterns: List[str]) -> bool:
    for p in patterns:
        if fnmatch.fnmatch(branch, p):
            return True
    return False


_PR_BOT_RULES_CACHE: Optional[Dict[str, Any]] = None


def load_pr_bot_rules() -> Optional[Dict[str, Any]]:
    global _PR_BOT_RULES_CACHE
    if _PR_BOT_RULES_CACHE is not None:
        return _PR_BOT_RULES_CACHE
    try:
        raw = json.loads(PR_BOT_RULES_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        _PR_BOT_RULES_CACHE = None
        return None
    if not isinstance(raw, dict):
        _PR_BOT_RULES_CACHE = None
        return None
    _PR_BOT_RULES_CACHE = raw
    return raw


def merge_policy_for_branch(branch: str) -> Tuple[str, str]:
    """
    PR-BOT-RULES.json'dan branch için merge_policy ve ready label adını üretir.

    Returns:
      (merge_policy, ready_label_name)
    """
    cfg = load_pr_bot_rules() or {}

    ready_label = DEFAULT_READY_LABEL
    raw_label = cfg.get("ready_to_merge_label")
    if isinstance(raw_label, str) and raw_label.strip():
        ready_label = raw_label.strip()

    patterns_val = cfg.get("branch_patterns") or []
    patterns = [p for p in patterns_val if isinstance(p, str)] if isinstance(patterns_val, list) else []
    if patterns and not match_any(branch, patterns):
        return MERGE_POLICY_NONE, ready_label

    rules_val = cfg.get("rules") or []
    rules = [r for r in rules_val if isinstance(r, dict)] if isinstance(rules_val, list) else []

    def normalize_policy(rule: Dict[str, Any]) -> str:
        mp = rule.get("merge_policy")
        if mp is None:
            return MERGE_POLICY_BOT_SQUASH if rule.get("auto_merge") is True else MERGE_POLICY_NONE
        if isinstance(mp, str):
            v = mp.strip()
            return v if v in MERGE_POLICIES else MERGE_POLICY_NONE
        return MERGE_POLICY_NONE

    for r in rules:
        if r.get("match") == branch:
            return normalize_policy(r), ready_label
    for r in rules:
        m = r.get("match")
        if isinstance(m, str) and fnmatch.fnmatch(branch, m):
            return normalize_policy(r), ready_label

    return MERGE_POLICY_NONE, ready_label


@dataclass(frozen=True)
class RunSummary:
    ci_gate: str
    ci_gate_url: str
    fail_workflows: List[str]


def collect_run_summary(repo: str, head_sha: str, workflow_name: str) -> RunSummary:
    """
    - CI_GATE: latest run için conclusion veya (queued/in_progress) status.
    - FAIL_WORKFLOWS: latest completed run per workflow name, conclusion not in {success, skipped}.
    """
    query = f"event=pull_request&head_sha={head_sha}&per_page=100"
    data = gh_api_json(f"repos/{repo}/actions/runs?{query}")
    runs_raw = data.get("workflow_runs") or []
    runs: List[Dict[str, Any]] = [r for r in runs_raw if isinstance(r, dict)]

    ci_gate = "unknown"
    ci_gate_url = ""
    for r in runs:
        if (r.get("name") or "") != workflow_name:
            continue
        url = r.get("html_url")
        if isinstance(url, str):
            ci_gate_url = url
        status = r.get("status")
        conclusion = r.get("conclusion")
        if isinstance(status, str) and status in {"queued", "in_progress"}:
            ci_gate = status
        elif isinstance(conclusion, str) and conclusion:
            ci_gate = conclusion
        break

    by_name: Dict[str, Dict[str, Any]] = {}
    for r in runs:
        name = r.get("name")
        if not isinstance(name, str) or not name.strip():
            continue
        if name in by_name:
            continue
        if (r.get("status") or "") != "completed":
            continue
        by_name[name] = r

    fail_names: List[str] = []
    for name, r in by_name.items():
        conclusion = r.get("conclusion")
        if not isinstance(conclusion, str) or not conclusion:
            continue
        if conclusion in {"success", "skipped"}:
            continue
        fail_names.append(name)
    fail_names.sort()

    return RunSummary(ci_gate=ci_gate, ci_gate_url=ci_gate_url, fail_workflows=fail_names)


def compute_next_action(
    *,
    state: str,
    draft: bool,
    mergeable_state: str,
    ci_gate: str,
    merge_policy: str,
    ready_label: bool,
    fail_workflows: List[str],
) -> str:
    if state != "open":
        return "NONE"
    if draft:
        return "DRAFT"
    if mergeable_state == "dirty":
        return "RESOLVE_CONFLICTS"
    if ci_gate in {"", "in_progress", "queued", "unknown"}:
        return "WAIT_CI_GATE"
    if ci_gate != "success":
        return "FIX_CI"
    if merge_policy != MERGE_POLICY_BOT_SQUASH:
        return "POLICY_NO_MERGE"
    if not ready_label:
        return "ADD_READY_LABEL"
    if fail_workflows:
        return "FIX_OTHER_FAIL"
    if mergeable_state in {"unstable", "unknown", ""}:
        return "WAIT_MERGEABLE"
    return "READY"


def build_row_from_pr(repo: str, pr_number: int, workflow_name: str) -> Dict[str, str]:
    row: Dict[str, str] = {col: "" for col in COLUMNS}
    row["PR"] = str(pr_number)
    row["LAST_UPDATE"] = utc_now()

    pr = gh_api_json(f"repos/{repo}/pulls/{pr_number}")

    title = str(pr.get("title") or "")
    state = str(pr.get("state") or "")
    draft = pr.get("draft") if isinstance(pr.get("draft"), bool) else None
    mergeable = pr.get("mergeable") if isinstance(pr.get("mergeable"), bool) else None
    mergeable_state = str(pr.get("mergeable_state") or "unknown")

    head = pr.get("head") or {}
    head_ref = str(head.get("ref") or "")
    head_sha = str(head.get("sha") or "")

    labels = pr.get("labels") or []
    label_names: List[str] = []
    for l in labels:
        if isinstance(l, dict) and l.get("name"):
            label_names.append(str(l["name"]))

    merge_policy, ready_label_name = merge_policy_for_branch(head_ref)
    ready_label = ready_label_name in label_names

    row["BRANCH"] = sanitize_cell(head_ref)
    row["TITLE"] = sanitize_cell(title)
    row["STATE"] = sanitize_cell(state)
    row["DRAFT"] = bool_str(draft)
    row["MERGEABLE"] = bool_str(mergeable)
    row["HEAD_SHA"] = sanitize_cell(head_sha)
    row["MERGEABLE_STATE"] = sanitize_cell(mergeable_state)
    row["MERGE_POLICY"] = sanitize_cell(merge_policy)
    row["READY_LABEL"] = "true" if ready_label else "false"
    row["LABELS"] = sanitize_cell(",".join(label_names))

    if head_sha:
        summary = collect_run_summary(repo, head_sha, workflow_name)
        row["CI_GATE"] = sanitize_cell(summary.ci_gate)
        row["CI_GATE_RUN_URL"] = sanitize_cell(summary.ci_gate_url)
        row["FAIL_WORKFLOWS"] = sanitize_cell(",".join(summary.fail_workflows))
    else:
        row["CI_GATE"] = "unknown"
        row["NOTE"] = "error: missing_head_sha"

    row["NEXT_ACTION"] = compute_next_action(
        state=(row.get("STATE") or "").strip(),
        draft=(row.get("DRAFT") == "true"),
        mergeable_state=(row.get("MERGEABLE_STATE") or "").strip(),
        ci_gate=(row.get("CI_GATE") or "").strip(),
        merge_policy=(row.get("MERGE_POLICY") or "").strip(),
        ready_label=(row.get("READY_LABEL") == "true"),
        fail_workflows=[x for x in (row.get("FAIL_WORKFLOWS") or "").split(",") if x.strip()],
    )

    return row


def cmd_add(args: argparse.Namespace) -> int:
    tracker_path = Path(args.tracker_path).resolve()
    repo = resolve_repo(args.repo)
    rows = read_tracker_rows(tracker_path)
    try:
        new_row = build_row_from_pr(repo, args.pr, args.workflow_name)
    except GitHubApiError as e:
        new_row = {col: "" for col in COLUMNS}
        new_row["PR"] = str(args.pr)
        new_row["LAST_UPDATE"] = utc_now()
        new_row["CI_GATE"] = "unknown"
        new_row["NEXT_ACTION"] = "WAIT_CI_GATE"
        new_row["NOTE"] = f"error: {sanitize_cell(str(e))}"
    except Exception as e:
        new_row = {col: "" for col in COLUMNS}
        new_row["PR"] = str(args.pr)
        new_row["LAST_UPDATE"] = utc_now()
        new_row["CI_GATE"] = "unknown"
        new_row["NEXT_ACTION"] = "WAIT_CI_GATE"
        new_row["NOTE"] = f"error: {sanitize_cell(type(e).__name__)}"

    upsert_row(rows, new_row)
    write_tracker_rows(tracker_path, rows)
    return 0


def sync_once(tracker_path: Path, repo: str, workflow_name: str) -> int:
    rows = read_tracker_rows(tracker_path)
    updated_rows: List[Dict[str, str]] = []
    for r in rows:
        pr_str = (r.get("PR") or "").strip()
        if not pr_str:
            continue
        try:
            pr_num = int(pr_str)
        except ValueError:
            rr = dict(r)
            rr["LAST_UPDATE"] = utc_now()
            rr["CI_GATE"] = "unknown"
            rr["NEXT_ACTION"] = "NONE"
            rr["NOTE"] = "error: invalid_pr_number"
            updated_rows.append(rr)
            continue

        try:
            rr = build_row_from_pr(repo, pr_num, workflow_name)
        except GitHubApiError as e:
            rr = dict(r)
            rr["LAST_UPDATE"] = utc_now()
            rr["CI_GATE"] = "unknown"
            rr["NEXT_ACTION"] = "WAIT_CI_GATE"
            rr["NOTE"] = f"error: {sanitize_cell(str(e))}"
        except Exception as e:
            rr = dict(r)
            rr["LAST_UPDATE"] = utc_now()
            rr["CI_GATE"] = "unknown"
            rr["NEXT_ACTION"] = "WAIT_CI_GATE"
            rr["NOTE"] = f"error: {sanitize_cell(type(e).__name__)}"

        updated_rows.append(rr)

    write_tracker_rows(tracker_path, updated_rows)
    return 0


def cmd_sync(args: argparse.Namespace) -> int:
    tracker_path = Path(args.tracker_path).resolve()
    repo = resolve_repo(args.repo)
    if args.watch <= 0:
        return sync_once(tracker_path, repo, args.workflow_name)

    try:
        while True:
            sync_once(tracker_path, repo, args.workflow_name)
            time.sleep(args.watch)
    except KeyboardInterrupt:
        return 0


def cmd_report(args: argparse.Namespace) -> int:
    tracker_path = Path(args.tracker_path).resolve()
    repo = resolve_repo(args.repo)
    rows = read_tracker_rows(tracker_path)

    out_path = Path(args.out).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)

    lines: List[str] = []
    lines.append("# PR Tracker Status")
    lines.append("")
    lines.append(f"- Repo: `{repo}`")
    lines.append(f"- Updated: `{utc_now()}`")
    lines.append(f"- Source: `{tracker_path}`")
    lines.append("")
    lines.append("| PR | Branch | State | ci-gate | Fail workflows | Mergeable | Policy | Ready | Next | Labels | Note |")
    lines.append("|---:|---|---|---|---|---|---|---|---|---|---|")

    for r in rows:
        pr_raw = (r.get("PR") or "").strip()
        if not pr_raw.isdigit():
            continue

        pr_num = int(pr_raw)
        pr_url = f"https://github.com/{repo}/pull/{pr_num}"

        branch = (r.get("BRANCH") or "").strip()
        state = (r.get("STATE") or "").strip() or "unknown"
        mergeable_state = (r.get("MERGEABLE_STATE") or "").strip() or "unknown"
        merge_policy = (r.get("MERGE_POLICY") or "").strip() or "none"
        ready_label = (r.get("READY_LABEL") or "").strip()
        next_action = (r.get("NEXT_ACTION") or "").strip()
        fail_wf = (r.get("FAIL_WORKFLOWS") or "").strip()
        labels = (r.get("LABELS") or "").strip()
        note = (r.get("NOTE") or "").strip()

        ci_gate = (r.get("CI_GATE") or "").strip() or "unknown"
        ci_gate_url = (r.get("CI_GATE_RUN_URL") or "").strip()
        ci_gate_cell = f"[{ci_gate}]({ci_gate_url})" if ci_gate_url else ci_gate

        lines.append(
            "| "
            + f"[#{pr_num}]({pr_url})"
            + " | "
            + f"`{sanitize_cell(branch)}`"
            + " | "
            + f"`{sanitize_cell(state)}`"
            + " | "
            + ci_gate_cell
            + " | "
            + f"`{sanitize_cell(fail_wf)}`"
            + " | "
            + f"`{sanitize_cell(mergeable_state)}`"
            + " | "
            + f"`{sanitize_cell(merge_policy)}`"
            + " | "
            + f"`{sanitize_cell(ready_label)}`"
            + " | "
            + f"`{sanitize_cell(next_action)}`"
            + " | "
            + f"`{sanitize_cell(labels)}`"
            + " | "
            + f"{sanitize_cell(note)}"
            + " |"
        )

    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return 0


def main(argv: List[str]) -> int:
    ap = argparse.ArgumentParser(prog="pr_tracker_tsv.py")
    ap.add_argument("--repo", help="owner/repo (default: origin remote veya GITHUB_REPOSITORY)")
    ap.add_argument(
        "--tracker-path",
        default=str(DEFAULT_TRACKER_PATH),
        help="TSV path (default: .autopilot-tmp/pr-tracker/PR-TRACKER.tsv)",
    )
    ap.add_argument("--workflow-name", default=DEFAULT_WORKFLOW_NAME, help='Workflow name (default: "ci-gate")')

    sub = ap.add_subparsers(dest="cmd", required=True)

    add = sub.add_parser("add", help="TSV'ye satır ekle/güncelle")
    add.add_argument("--pr", type=int, required=True, help="PR number")
    add.set_defaults(func=cmd_add)

    sync = sub.add_parser("sync", help="TSV'deki tüm PR'ları güncelle")
    sync.add_argument("--watch", type=int, default=0, help="Seconds (polling). 0: single run.")
    sync.set_defaults(func=cmd_sync)

    report = sub.add_parser("report", help="TSV'den STATUS.md üret (local-only)")
    report.add_argument(
        "--out",
        default=str(DEFAULT_STATUS_PATH),
        help="Output markdown path (default: .autopilot-tmp/pr-tracker/STATUS.md)",
    )
    report.set_defaults(func=cmd_report)

    args = ap.parse_args(argv)
    return int(args.func(args))


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
