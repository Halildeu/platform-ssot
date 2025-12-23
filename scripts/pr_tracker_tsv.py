#!/usr/bin/env python3
"""
Local PR tracker (TSV) – Local SSOT uyumlu.

- TSV dosyası gitignored olmalıdır:
  .autopilot-tmp/pr-tracker/PR-TRACKER.tsv

Komutlar:
  - add  : tek PR için satır ekle/güncelle
  - sync : TSV'deki tüm PR'ları güncelle (opsiyonel --watch)

Notlar:
- Token değeri asla yazdırılmaz.
- Hata durumunda tracker satırı NOTE alanında işaretlenir; exit code 0 (gürültü yok).
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple


ROOT = Path(__file__).resolve().parents[1]

DEFAULT_TRACKER_PATH = ROOT / ".autopilot-tmp" / "pr-tracker" / "PR-TRACKER.tsv"
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


class GitHubApiError(RuntimeError):
    def __init__(self, message: str, *, http_code: Optional[int] = None) -> None:
        super().__init__(message)
        self.http_code = http_code


def utc_now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def sanitize_cell(value: str) -> str:
    # TSV bozulmasın diye \t ve satır sonlarını temizliyoruz.
    return value.replace("\t", " ").replace("\r", " ").replace("\n", " ").strip()


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

    # ssh://git@github.com/OWNER/REPO(.git)
    m = re.search(r"github\.com/([^/]+)/([^/]+?)(?:\.git)?$", url)
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


def resolve_token() -> Optional[str]:
    # Local SSOT: token asla loglanmaz.
    return os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")


def github_get_json(token: str, path: str) -> Dict[str, Any]:
    api = "https://api.github.com"
    url = f"{api}{path}"
    req = urllib.request.Request(
        url=url,
        method="GET",
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "User-Agent": "platform-ssot-pr-tracker",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            payload = resp.read()
            return json.loads(payload.decode("utf-8", errors="replace"))
    except urllib.error.HTTPError as e:
        body = ""
        try:
            body = e.read().decode("utf-8", errors="replace")
        except Exception:
            body = ""
        msg = f"http={e.code}"
        if body:
            try:
                parsed = json.loads(body)
                if isinstance(parsed, dict) and parsed.get("message"):
                    msg = f"{msg} message={parsed.get('message')}"
            except Exception:
                pass
        raise GitHubApiError(msg, http_code=getattr(e, "code", None))
    except urllib.error.URLError as e:
        raise GitHubApiError(f"url_error={e.reason}")
    except json.JSONDecodeError:
        raise GitHubApiError("invalid_json")


def ensure_tracker_file(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        path.write_text("\t".join(COLUMNS) + "\n", encoding="utf-8")
        return
    # Boş dosya ise header yaz.
    content = path.read_text(encoding="utf-8")
    if not content.strip():
        path.write_text("\t".join(COLUMNS) + "\n", encoding="utf-8")


def read_tracker_rows(path: Path) -> List[Dict[str, str]]:
    ensure_tracker_file(path)
    lines = path.read_text(encoding="utf-8").splitlines()
    if not lines:
        return []
    header = lines[0].split("\t")
    # Header drift varsa da (ileri düzey), yine de minimum kolon setiyle ilerleriz.
    rows: List[Dict[str, str]] = []
    for line in lines[1:]:
        if not line.strip():
            continue
        parts = line.split("\t")
        # eksik kolonları boşla doldur
        if len(parts) < len(header):
            parts = parts + [""] * (len(header) - len(parts))
        d = dict(zip(header, parts))
        rows.append({k: d.get(k, "") for k in COLUMNS})
    return rows


def write_tracker_rows(path: Path, rows: List[Dict[str, str]]) -> None:
    ensure_tracker_file(path)
    out_lines = ["\t".join(COLUMNS)]
    for row in rows:
        out_lines.append("\t".join(sanitize_cell(row.get(col, "")) for col in COLUMNS))
    path.write_text("\n".join(out_lines) + "\n", encoding="utf-8")


def upsert_row(rows: List[Dict[str, str]], new_row: Dict[str, str]) -> None:
    key = str(new_row.get("PR", "")).strip()
    if not key:
        return
    for i, r in enumerate(rows):
        if str(r.get("PR", "")).strip() == key:
            rows[i] = new_row
            return
    rows.append(new_row)


def get_ci_gate_status(repo: str, head_sha: str, token: str, workflow_name: str) -> Tuple[str, str, str]:
    # Runs endpoint: head_sha + event=pull_request.
    query = urllib.parse.urlencode({"event": "pull_request", "head_sha": head_sha, "per_page": "100"})
    data = github_get_json(token, f"/repos/{repo}/actions/runs?{query}")
    runs = data.get("workflow_runs") or []
    candidates: List[Dict[str, Any]] = []
    for r in runs:
        if not isinstance(r, dict):
            continue
        if (r.get("name") or "") != workflow_name:
            continue
        if (r.get("status") or "") != "completed":
            continue
        candidates.append(r)
    if not candidates:
        return "unknown", "", ""
    pick = max(candidates, key=lambda r: (r.get("updated_at") or r.get("created_at") or ""))
    conclusion = str(pick.get("conclusion") or "unknown")
    run_url = str(pick.get("html_url") or "")
    run_id = str(pick.get("id") or "")
    return conclusion, run_url, run_id


def build_row_from_pr(repo: str, pr_number: int, token: Optional[str], workflow_name: str) -> Dict[str, str]:
    base_row: Dict[str, str] = {col: "" for col in COLUMNS}
    base_row["PR"] = str(pr_number)
    base_row["LAST_UPDATE"] = utc_now()

    if not token:
        base_row["CI_GATE"] = "unknown"
        base_row["NOTE"] = "error: token_missing(GH_TOKEN)"
        return base_row

    pr = github_get_json(token, f"/repos/{repo}/pulls/{pr_number}")
    title = str(pr.get("title") or "")
    state = str(pr.get("state") or "")
    head = pr.get("head") or {}
    head_ref = str(head.get("ref") or "")
    head_sha = str(head.get("sha") or "")
    mergeable_state = str(pr.get("mergeable_state") or "unknown")
    labels = pr.get("labels") or []
    label_names: List[str] = []
    for l in labels:
        if isinstance(l, dict) and l.get("name"):
            label_names.append(str(l["name"]))

    base_row["BRANCH"] = sanitize_cell(head_ref)
    base_row["TITLE"] = sanitize_cell(title)
    base_row["STATE"] = sanitize_cell(state)
    base_row["HEAD_SHA"] = sanitize_cell(head_sha)
    base_row["MERGEABLE_STATE"] = sanitize_cell(mergeable_state)
    base_row["LABELS"] = sanitize_cell(",".join(label_names))

    if head_sha:
        conclusion, run_url, _run_id = get_ci_gate_status(repo, head_sha, token, workflow_name)
        base_row["CI_GATE"] = sanitize_cell(conclusion)
        base_row["CI_GATE_RUN_URL"] = sanitize_cell(run_url)
    else:
        base_row["CI_GATE"] = "unknown"
        base_row["NOTE"] = "error: missing_head_sha"
    return base_row


def cmd_add(args: argparse.Namespace) -> int:
    tracker_path = Path(args.tracker_path).resolve()
    repo = resolve_repo(args.repo)
    token = resolve_token()
    rows = read_tracker_rows(tracker_path)
    try:
        new_row = build_row_from_pr(repo, args.pr, token, args.workflow_name)
    except GitHubApiError as e:
        new_row = {col: "" for col in COLUMNS}
        new_row["PR"] = str(args.pr)
        new_row["CI_GATE"] = "unknown"
        new_row["LAST_UPDATE"] = utc_now()
        new_row["NOTE"] = f"error: {sanitize_cell(str(e))}"
    except Exception as e:
        new_row = {col: "" for col in COLUMNS}
        new_row["PR"] = str(args.pr)
        new_row["CI_GATE"] = "unknown"
        new_row["LAST_UPDATE"] = utc_now()
        new_row["NOTE"] = f"error: {sanitize_cell(type(e).__name__)}"

    upsert_row(rows, new_row)
    write_tracker_rows(tracker_path, rows)
    return 0


def sync_once(tracker_path: Path, repo: str, token: Optional[str], workflow_name: str) -> int:
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
            rr["NOTE"] = "error: invalid_pr_number"
            updated_rows.append(rr)
            continue

        try:
            rr = build_row_from_pr(repo, pr_num, token, workflow_name)
        except GitHubApiError as e:
            rr = dict(r)
            rr["LAST_UPDATE"] = utc_now()
            rr["CI_GATE"] = "unknown"
            rr["NOTE"] = f"error: {sanitize_cell(str(e))}"
        except Exception as e:
            rr = dict(r)
            rr["LAST_UPDATE"] = utc_now()
            rr["CI_GATE"] = "unknown"
            rr["NOTE"] = f"error: {sanitize_cell(type(e).__name__)}"

        updated_rows.append(rr)

    write_tracker_rows(tracker_path, updated_rows)
    return 0


def cmd_sync(args: argparse.Namespace) -> int:
    tracker_path = Path(args.tracker_path).resolve()
    repo = resolve_repo(args.repo)
    token = resolve_token()
    if args.watch <= 0:
        return sync_once(tracker_path, repo, token, args.workflow_name)

    # watch loop (exit 0 on Ctrl+C)
    try:
        while True:
            sync_once(tracker_path, repo, token, args.workflow_name)
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
    lines.append("")
    lines.append("| PR | Branch | State | ci-gate | Mergeable | Labels | Note |")
    lines.append("|---:|---|---|---|---|---|---|")

    for r in rows:
        pr_raw = (r.get("PR") or "").strip()
        if not pr_raw.isdigit():
            continue

        pr_num = int(pr_raw)
        pr_url = f"https://github.com/{repo}/pull/{pr_num}"

        branch = (r.get("BRANCH") or "").strip()
        state = (r.get("STATE") or "").strip() or "unknown"
        mergeable = (r.get("MERGEABLE_STATE") or "").strip() or "unknown"
        labels = (r.get("LABELS") or "").strip()
        note = (r.get("NOTE") or "").strip()

        ci_gate = (r.get("CI_GATE") or "").strip() or "unknown"
        ci_gate_url = (r.get("CI_GATE_RUN_URL") or "").strip()
        if ci_gate_url:
            ci_gate_cell = f"[{ci_gate}]({ci_gate_url})"
        else:
            ci_gate_cell = ci_gate

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
            + f"`{sanitize_cell(mergeable)}`"
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
        default=str(ROOT / ".autopilot-tmp" / "pr-tracker" / "STATUS.md"),
        help="Output markdown path (default: .autopilot-tmp/pr-tracker/STATUS.md)",
    )
    report.set_defaults(func=cmd_report)

    args = ap.parse_args(argv)
    return int(args.func(args))


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
