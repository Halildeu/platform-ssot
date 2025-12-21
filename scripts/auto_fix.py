#!/usr/bin/env python3
"""
auto-fix (v0.1)

Amaç:
- ci-gate workflow_run FAIL olduğunda, deterministik ve güvenli (allowlist + limitli)
  küçük patch'ler üretip bot PR açmak.

Altın kurallar:
- Least privilege (GITHUB_TOKEN),
- Idempotent ve denetlenebilir (marker'lı PR body),
- Fail-safe (koşullar sağlanmıyorsa exit 0; kalite bypass yok),
- Recursion yok (bot branch'lerinde noop).

Not:
- Bu script stdlib dışı bağımlılık kullanmaz.
- Token asla loglanmaz.
"""

from __future__ import annotations

import argparse
import io
import json
import os
import re
import subprocess
import sys
import textwrap
import urllib.error
import urllib.request
import zipfile
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple


ROOT = Path(__file__).resolve().parents[1]

API_BASE = "https://api.github.com"
API_ACCEPT = "application/vnd.github+json"
API_VERSION = "2022-11-28"
USER_AGENT = "platform-ssot-auto-fix/0.1"

BOT_BRANCH_PREFIX = "bot/fix-"
AUTO_FIX_MARKER = "<!-- auto-fix:v1 -->"


ERROR_RE = re.compile(
    r"(\[ci-gate\]\s+FAIL:|Traceback|Process completed with exit code|npm ERR!|Module not found|ERROR\b|Error:|FAILED\b|Exception)",
    re.IGNORECASE,
)
DOC_ID_ERROR_PATH_RE = re.compile(r"^- HATA:\s+(.+?\.md)\s*$", re.MULTILINE)


@dataclass(frozen=True)
class RunInfo:
    repo: str
    run_id: int
    name: str
    html_url: str
    head_sha: str
    head_branch: str
    head_owner: str
    event: str
    conclusion: str
    pull_requests: List[dict]


@dataclass(frozen=True)
class JobInfo:
    id: int
    name: str
    conclusion: str
    html_url: str


def eprint(msg: str) -> None:
    print(msg, file=sys.stderr)


def build_headers(token: str, accept: str = API_ACCEPT) -> Dict[str, str]:
    return {
        "Authorization": f"Bearer {token}",
        "Accept": accept,
        "X-GitHub-Api-Version": API_VERSION,
        "User-Agent": USER_AGENT,
    }


def http_request(
    method: str,
    url: str,
    headers: Dict[str, str],
    body: Optional[bytes] = None,
    timeout_sec: int = 60,
) -> Tuple[int, Dict[str, str], bytes]:
    req = urllib.request.Request(url, method=method, headers=headers, data=body)
    try:
        with urllib.request.urlopen(req, timeout=timeout_sec) as resp:
            return resp.status, dict(resp.headers.items()), resp.read()
    except urllib.error.HTTPError as err:
        data = err.read() if hasattr(err, "read") else b""
        hdrs = dict(err.headers.items()) if err.headers else {}
        return err.code, hdrs, data


def github_get_json(token: str, path: str, accept: str = API_ACCEPT) -> Tuple[int, dict | list]:
    code, _hdrs, raw = http_request("GET", f"{API_BASE}{path}", headers=build_headers(token, accept=accept))
    if not raw:
        return code, {}
    try:
        return code, json.loads(raw.decode("utf-8"))
    except json.JSONDecodeError:
        return code, {}


def github_post_json(token: str, path: str, payload: dict) -> Tuple[int, dict | list]:
    body = json.dumps(payload).encode("utf-8")
    code, _hdrs, raw = http_request(
        "POST",
        f"{API_BASE}{path}",
        headers={**build_headers(token), "Content-Type": "application/json"},
        body=body,
    )
    if not raw:
        return code, {}
    try:
        return code, json.loads(raw.decode("utf-8"))
    except json.JSONDecodeError:
        return code, {}


def github_patch_json(token: str, path: str, payload: dict) -> Tuple[int, dict | list]:
    body = json.dumps(payload).encode("utf-8")
    code, _hdrs, raw = http_request(
        "PATCH",
        f"{API_BASE}{path}",
        headers={**build_headers(token), "Content-Type": "application/json"},
        body=body,
    )
    if not raw:
        return code, {}
    try:
        return code, json.loads(raw.decode("utf-8"))
    except json.JSONDecodeError:
        return code, {}


def github_get_bytes(token: str, path: str, accept: str = API_ACCEPT) -> Tuple[int, bytes]:
    code, _hdrs, raw = http_request("GET", f"{API_BASE}{path}", headers=build_headers(token, accept=accept))
    return code, raw


def paginate(token: str, path: str, key: Optional[str] = None) -> Iterable[dict]:
    page = 1
    while True:
        sep = "&" if "?" in path else "?"
        code, data = github_get_json(token, f"{path}{sep}per_page=100&page={page}")
        if code != 200:
            return
        if key:
            items = (data or {}).get(key) if isinstance(data, dict) else None
        else:
            items = data if isinstance(data, list) else None
        if not items:
            return
        assert isinstance(items, list)
        for item in items:
            if isinstance(item, dict):
                yield item
        if len(items) < 100:
            return
        page += 1


def get_run_info(token: str, repo: str, run_id: int) -> Optional[RunInfo]:
    code, data = github_get_json(token, f"/repos/{repo}/actions/runs/{run_id}")
    if code != 200 or not isinstance(data, dict):
        eprint(f"[auto-fix] Cannot fetch run details: http={code}")
        return None

    default_owner = repo.split("/", 1)[0] if "/" in repo else ""
    head_owner = default_owner
    head_repo = data.get("head_repository")
    if isinstance(head_repo, dict):
        head_owner_obj = head_repo.get("owner") or {}
        if isinstance(head_owner_obj, dict) and isinstance(head_owner_obj.get("login"), str):
            head_owner = head_owner_obj["login"]

    return RunInfo(
        repo=repo,
        run_id=run_id,
        name=str(data.get("name") or ""),
        html_url=str(data.get("html_url") or ""),
        head_sha=str(data.get("head_sha") or ""),
        head_branch=str(data.get("head_branch") or ""),
        head_owner=head_owner,
        event=str(data.get("event") or ""),
        conclusion=str(data.get("conclusion") or ""),
        pull_requests=list(data.get("pull_requests") or []),
    )


def find_pr_number(token: str, run: RunInfo) -> Tuple[Optional[int], str]:
    if run.pull_requests:
        pr0 = run.pull_requests[0]
        num = pr0.get("number")
        if isinstance(num, int):
            return num, "run.pull_requests[0]"
        return None, "run.pull_requests present but number missing"

    if not run.head_sha:
        return None, "missing head_sha"

    code, prs = github_get_json(
        token,
        f"/repos/{run.repo}/commits/{run.head_sha}/pulls",
        accept="application/vnd.github+json, application/vnd.github.groot-preview+json",
    )
    if code == 200 and isinstance(prs, list) and prs:
        open_prs = [p for p in prs if isinstance(p, dict) and p.get("state") == "open"]
        cand = open_prs[0] if open_prs else prs[0]
        num = cand.get("number") if isinstance(cand, dict) else None
        return (num if isinstance(num, int) else None), "commit_pulls"

    if run.head_branch and run.head_owner:
        head_ref = f"{run.head_owner}:{run.head_branch}"
        code2, prs2 = github_get_json(
            token,
            f"/repos/{run.repo}/pulls?state=open&head={head_ref}",
        )
        if code2 == 200 and isinstance(prs2, list) and prs2:
            cand2 = prs2[0]
            num2 = cand2.get("number") if isinstance(cand2, dict) else None
            return (num2 if isinstance(num2, int) else None), "pulls?head=owner:branch"

    return None, f"no PR found (commit_pulls http={code})"


def list_failing_jobs(token: str, run: RunInfo) -> List[JobInfo]:
    jobs: List[JobInfo] = []
    for item in paginate(token, f"/repos/{run.repo}/actions/runs/{run.run_id}/jobs", key="jobs"):
        conclusion = str(item.get("conclusion") or "")
        if conclusion.lower() == "success":
            continue
        job_id = item.get("id")
        name = str(item.get("name") or "")
        html_url = str(item.get("html_url") or "")
        if isinstance(job_id, int) and name:
            jobs.append(JobInfo(id=job_id, name=name, conclusion=conclusion, html_url=html_url))
    return jobs


def extract_texts_from_zip(zip_bytes: bytes, max_total_chars: int = 2_000_000) -> List[str]:
    if not zip_bytes:
        return []
    try:
        zf = zipfile.ZipFile(io.BytesIO(zip_bytes))
    except zipfile.BadZipFile:
        return []

    texts: List[str] = []
    total = 0
    for name in sorted(zf.namelist()):
        if name.endswith("/"):
            continue
        try:
            raw = zf.read(name)
        except KeyError:
            continue
        text = raw.decode("utf-8", errors="replace")
        if not text:
            continue
        if total + len(text) > max_total_chars:
            remain = max_total_chars - total
            if remain <= 0:
                break
            text = text[:remain]
        texts.append(text)
        total += len(text)
        if total >= max_total_chars:
            break
    return texts


def first_error_snippet(text: str, after_lines: int = 80, max_lines: int = 120) -> Tuple[str, str]:
    lines = text.splitlines()
    for idx, line in enumerate(lines):
        if not ERROR_RE.search(line):
            continue
        end = min(len(lines), idx + after_lines + 1)
        snippet_lines = lines[idx:end]
        if len(snippet_lines) > max_lines:
            snippet_lines = snippet_lines[:max_lines]
        return line.strip(), "\n".join(snippet_lines).strip()
    return "No matching error pattern found.", ""


def to_repo_relative_path(raw_path: str) -> Optional[str]:
    raw_path = raw_path.strip()
    for anchor in ("docs/", "web/", "scripts/", ".github/"):
        idx = raw_path.find(anchor)
        if idx >= 0:
            return raw_path[idx:]
    return None


def expected_id_for_doc(rel_path: str) -> Optional[str]:
    p = Path(rel_path)
    stem = p.stem

    m = re.match(r"^(AC-\d{4})\b", stem)
    if m:
        return m.group(1)
    m = re.match(r"^(TP-\d{4})\b", stem)
    if m:
        return m.group(1)
    m = re.match(r"^(STORY-\d{4}-.+)$", stem)
    if m:
        return m.group(1)
    m = re.match(r"^(RB-[A-Za-z0-9-]+)$", stem)
    if m:
        return m.group(1)
    return None


def set_doc_id(rel_path: str, expected_id: str) -> bool:
    path = (ROOT / rel_path).resolve()
    if not path.exists():
        return False

    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    changed = False

    id_line_idx: Optional[int] = None
    for i, line in enumerate(lines[:25]):
        if line.startswith("ID:"):
            id_line_idx = i
            break

    new_id_line = f"ID: {expected_id}  "
    if id_line_idx is not None:
        if lines[id_line_idx].strip() != new_id_line.strip():
            lines[id_line_idx] = new_id_line
            changed = True
    else:
        # H1 sonrası ekle
        insert_at = 1
        for i, line in enumerate(lines[:10]):
            if line.startswith("# "):
                insert_at = i + 1
                break
        lines.insert(insert_at, "")
        lines.insert(insert_at + 1, new_id_line)
        changed = True

    if not changed:
        return False

    path.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
    return True


def ensure_mfe_shell_telemetry_stub() -> Tuple[bool, str]:
    rel_path = "web/apps/mfe-shell/src/app/telemetry/telemetry-client.ts"
    path = ROOT / rel_path
    if path.exists():
        return False, f"already exists: {rel_path}"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        "\n".join(
            [
                "type TelemetryClient = {",
                "  emit: (name: string, props?: Record<string, unknown>) => void;",
                "  trackPageView: (path?: string, props?: Record<string, unknown>) => void;",
                "};",
                "",
                "const telemetryClient: TelemetryClient = {",
                "  emit: () => {},",
                "  trackPageView: () => {},",
                "};",
                "",
                "export default telemetryClient;",
                "",
            ]
        ),
        encoding="utf-8",
    )
    return True, f"created stub: {rel_path}"


def git(*args: str, check: bool = True) -> subprocess.CompletedProcess[str]:
    cmd = ["git", *args]
    res = subprocess.run(cmd, cwd=str(ROOT), text=True, capture_output=True)
    if check and res.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)} failed: {res.stderr.strip()}")
    return res


def changed_files() -> List[str]:
    res = git("diff", "--name-only", check=True)
    files = [l.strip() for l in res.stdout.splitlines() if l.strip()]
    return files


def diff_numstat() -> Tuple[int, int, int]:
    # returns: files, added, deleted
    res = git("diff", "--numstat", check=True)
    files = 0
    added = 0
    deleted = 0
    for line in res.stdout.splitlines():
        parts = line.split("\t")
        if len(parts) < 3:
            continue
        a, d, _path = parts[0], parts[1], parts[2]
        if a.isdigit():
            added += int(a)
        if d.isdigit():
            deleted += int(d)
        files += 1
    return files, added, deleted


def enforce_allowlist(files: List[str], allowed_prefixes: Sequence[str]) -> Tuple[bool, str]:
    for f in files:
        if any(f.startswith(p) for p in allowed_prefixes):
            continue
        return False, f"disallowed path modified: {f}"
    return True, "ok"


def upsert_pr_body(token: str, repo: str, pr_number: int, body: str) -> None:
    code, _ = github_patch_json(token, f"/repos/{repo}/pulls/{pr_number}", {"body": body})
    if code not in (200, 201):
        eprint(f"[auto-fix] PR body update failed: http={code}")


def ensure_label(token: str, repo: str, pr_number: int, label: str) -> None:
    code, _ = github_post_json(token, f"/repos/{repo}/issues/{pr_number}/labels", {"labels": [label]})
    if code not in (200, 201):
        eprint(f"[auto-fix] label add failed (best-effort): http={code}")


def find_existing_pr(token: str, repo: str, head: str, base: str) -> Optional[dict]:
    code, prs = github_get_json(token, f"/repos/{repo}/pulls?state=open&head={head}&base={base}")
    if code != 200 or not isinstance(prs, list) or not prs:
        return None
    pr0 = prs[0]
    return pr0 if isinstance(pr0, dict) else None


def create_pr(token: str, repo: str, title: str, head: str, base: str, body: str) -> Optional[dict]:
    code, pr = github_post_json(
        token,
        f"/repos/{repo}/pulls",
        {"title": title, "head": head, "base": base, "body": body, "draft": False},
    )
    if code not in (200, 201) or not isinstance(pr, dict):
        eprint(f"[auto-fix] PR create failed: http={code}")
        if isinstance(pr, dict) and pr.get("message"):
            eprint(f"[auto-fix] message: {pr.get('message')}")
        return None
    return pr


def build_pr_body(
    run: RunInfo,
    source_pr_number: Optional[int],
    fixes: List[str],
    first_error_title: str,
    first_error_snippet_text: str,
) -> str:
    lines: List[str] = [
        AUTO_FIX_MARKER,
        "## Auto-fix (v0.1)",
        "",
        f"- Source workflow: `{run.name}`",
        f"- Source run: {run.html_url}",
    ]
    if source_pr_number:
        lines.append(f"- Source PR: `#{source_pr_number}`")
    if run.head_sha:
        lines.append(f"- Source head SHA: `{run.head_sha}`")

    lines.extend(["", "### Applied fixes"])
    if not fixes:
        lines.append("- (none)")
    else:
        for f in fixes:
            lines.append(f"- {f}")

    lines.extend(
        [
            "",
            "### Guardrails",
            "- Allowlist: `docs/`, `web/` (v0.1 default)",
            "- Limits: max 20 files, max 500 lines net change (v0.1)",
            "- Recursion: `bot/fix-*` branches are skipped",
        ]
    )

    if first_error_snippet_text:
        lines.extend(
            [
                "",
                f"### First error snippet: {first_error_title}",
                "```text",
                first_error_snippet_text,
                "```",
            ]
        )

    return "\n".join(lines).strip() + "\n"


def main(argv: Sequence[str]) -> int:
    parser = argparse.ArgumentParser(prog="auto_fix.py")
    parser.add_argument("--repo", required=True, help="owner/repo")
    parser.add_argument("--run-id", required=True, type=int, help="workflow_run id")
    parser.add_argument("--base", default="main", help="base branch (default: main)")
    parser.add_argument("--dry-run", action="store_true", help="no git push / no PR create")
    args = parser.parse_args(list(argv)[1:])

    enabled = (os.environ.get("AUTO_FIX_ENABLED") or "").strip().lower()
    if enabled not in ("1", "true", "yes", "on"):
        print("[auto-fix] AUTO_FIX_ENABLED is not enabled; noop.")
        return 0

    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if not token:
        eprint("[auto-fix] Missing token env (GITHUB_TOKEN/GH_TOKEN).")
        return 0

    run = get_run_info(token=token, repo=args.repo, run_id=args.run_id)
    if not run:
        return 0

    print(
        "[auto-fix] run"
        f" id={run.run_id}"
        f" workflow={run.name!r}"
        f" event={run.event!r}"
        f" conclusion={run.conclusion!r}"
        f" head_branch={run.head_branch!r}"
        f" head_sha={run.head_sha}"
    )

    if run.head_branch.startswith(BOT_BRANCH_PREFIX):
        print("[auto-fix] bot branch recursion guard; noop.")
        return 0

    if run.event != "pull_request" or run.conclusion != "failure":
        print("[auto-fix] not a ci-gate failure on pull_request; noop.")
        return 0

    source_pr_number, pr_reason = find_pr_number(token=token, run=run)
    if source_pr_number:
        print(f"[auto-fix] source_pr={source_pr_number} (via {pr_reason})")
    else:
        print(f"[auto-fix] source_pr not found (reason={pr_reason})")

    failing_jobs = list_failing_jobs(token=token, run=run)
    if not failing_jobs:
        print("[auto-fix] no failing jobs; noop.")
        return 0

    all_logs_text = ""
    first_title = "No matching error pattern found."
    first_snippet = ""

    for job in failing_jobs[:6]:
        code, zbytes = github_get_bytes(token, f"/repos/{run.repo}/actions/jobs/{job.id}/logs")
        if code != 200:
            continue
        texts = extract_texts_from_zip(zbytes)
        if not texts:
            continue
        chunk = "\n\n".join(texts)
        if not first_snippet:
            t, s = first_error_snippet(chunk)
            if s:
                first_title, first_snippet = t, s
        all_logs_text += "\n\n" + chunk
        if len(all_logs_text) > 2_000_000:
            break

    planned_doc_id_fix: Optional[Tuple[str, str]] = None
    need_telemetry_stub = False

    # Plan 1: docs ID meta line mismatch (from check_doc_ids output)
    m = DOC_ID_ERROR_PATH_RE.search(all_logs_text)
    if m:
        raw_path = m.group(1)
        rel = to_repo_relative_path(raw_path)
        if rel and rel.startswith("docs/"):
            expected = expected_id_for_doc(rel)
            if expected:
                planned_doc_id_fix = (rel, expected)

    # Plan 2: mfe-shell telemetry-client missing module (known historical)
    if "telemetry/telemetry-client" in all_logs_text or "telemetry-client" in all_logs_text:
        need_telemetry_stub = True

    if not planned_doc_id_fix and not need_telemetry_stub:
        print("[auto-fix] No safe fix rules matched; noop.")
        return 0

    # Prepare bot branch from base
    owner = args.repo.split("/", 1)[0]
    bot_branch = f"{BOT_BRANCH_PREFIX}{args.run_id}"
    head_ref = f"{owner}:{bot_branch}"

    # Ensure clean base
    git("fetch", "origin", args.base)
    git("checkout", "-B", bot_branch, f"origin/{args.base}")

    fixes: List[str] = []

    # Apply planned fixes (idempotent)
    if planned_doc_id_fix:
        rel, expected = planned_doc_id_fix
        if set_doc_id(rel, expected):
            fixes.append(f"Set ID meta for `{rel}` → `{expected}`")

    if need_telemetry_stub:
        changed, msg = ensure_mfe_shell_telemetry_stub()
        if changed:
            fixes.append(msg)

    if not fixes:
        print("[auto-fix] Planned fixes already satisfied; noop.")
        return 0

    files = changed_files()
    ok, reason = enforce_allowlist(files, allowed_prefixes=("docs/", "web/"))
    if not ok:
        eprint(f"[auto-fix] Allowlist violation; abort. reason={reason}")
        return 0

    num_files, added, deleted = diff_numstat()
    if num_files > 20 or (added + deleted) > 500:
        eprint(f"[auto-fix] Change too large; abort. files={num_files} lines={added+deleted}")
        return 0

    if not files:
        print("[auto-fix] No changes after rebasing; noop.")
        return 0

    git("config", "user.name", "platform-ssot-auto-fix")
    git("config", "user.email", "auto-fix@users.noreply.github.com")
    git("add", "-A")
    summary = fixes[0] if fixes else "rule-based patch"
    msg = f"auto-fix: {summary} (run {args.run_id})"
    if len(msg) > 72:
        msg = f"auto-fix: rule-based patch (run {args.run_id})"
    git("commit", "-m", msg)

    pr_body = build_pr_body(
        run=run,
        source_pr_number=source_pr_number,
        fixes=fixes,
        first_error_title=first_title,
        first_error_snippet_text=first_snippet,
    )

    title = f"auto-fix: ci-gate failure (run {args.run_id})"

    if args.dry_run:
        print("[auto-fix] dry-run: skip git push / PR create")
        print(pr_body)
        return 0

    # Push branch
    try:
        git("push", "-u", "origin", f"{bot_branch}:{bot_branch}")
    except Exception as exc:
        eprint(f"[auto-fix] git push failed; noop. err={exc}")
        return 0

    # Upsert PR (create or update)
    existing = find_existing_pr(token=token, repo=args.repo, head=head_ref, base=args.base)
    pr_number: Optional[int] = None
    pr_url = ""
    if existing and isinstance(existing.get("number"), int):
        pr_number = int(existing["number"])
        pr_url = str(existing.get("html_url") or "")
        print(f"[auto-fix] existing PR found: #{pr_number} {pr_url}")
        upsert_pr_body(token=token, repo=args.repo, pr_number=pr_number, body=pr_body)
    else:
        print(f"[auto-fix] create_pr base={args.base} head={head_ref}")
        created = create_pr(token=token, repo=args.repo, title=title, head=head_ref, base=args.base, body=pr_body)
        if created and isinstance(created.get("number"), int):
            pr_number = int(created["number"])
            pr_url = str(created.get("html_url") or "")
            print(f"[auto-fix] created PR: #{pr_number} {pr_url}")

    if pr_number:
        ensure_label(token=token, repo=args.repo, pr_number=pr_number, label="pr-bot/ready-to-merge")

    print("[auto-fix] OK")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv))
    except Exception as exc:
        eprint("[auto-fix] Unexpected error (noop):")
        eprint(textwrap.indent(repr(exc), "  "))
        raise SystemExit(0)
