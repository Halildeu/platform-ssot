#!/usr/bin/env python3
"""
log-digest: workflow_run fail olduğunda PR'a tek (marker'lı) failure digest yorumu basar.

Amaç:
- FAIL olan workflow_run içindeki FAIL job'ların loglarını indirip,
- ilk hata bloğunu + olası failing command'leri özetlemek,
- PR'a idempotent şekilde comment upsert etmek (spam yok).

Notlar:
- Stdlib dışı bağımlılık yoktur.
- Token asla loglanmaz.
"""

from __future__ import annotations

import argparse
import io
import json
import os
import re
import sys
import textwrap
import urllib.error
import urllib.request
import zipfile
from dataclasses import dataclass
from typing import Dict, Iterable, List, Optional, Sequence, Tuple


API_BASE = "https://api.github.com"
API_ACCEPT = "application/vnd.github+json"
API_VERSION = "2022-11-28"
USER_AGENT = "platform-ssot-log-digest/1"

MARKER = "<!-- log-digest:v1 -->"
MAX_COMMENT_CHARS = 30_000
MAX_SNIPPET_LINES = 120
SNIPPET_AFTER_LINES = 80
MAX_COMMANDS_PER_JOB = 8

ERROR_RE = re.compile(
    r"(\[ci-gate\]\s+FAIL:|Traceback|Process completed with exit code|npm ERR!|Module not found|ERROR\b|Error:|FAILED\b|Exception)",
    re.IGNORECASE,
)
CMD_RE_LIST = [
    re.compile(r"^\s*##\[command\](.+)$", re.MULTILINE),
    re.compile(r"^\[ci-gate\]\s+RUN:\s+(.+)$", re.MULTILINE),
]


@dataclass(frozen=True)
class RunInfo:
    repo: str
    run_id: int
    html_url: str
    head_sha: str
    head_branch: str
    head_owner: str
    name: str
    event: str
    conclusion: str
    pull_requests: List[dict]


@dataclass(frozen=True)
class JobInfo:
    id: int
    name: str
    conclusion: str
    html_url: str


@dataclass(frozen=True)
class JobDigest:
    job: JobInfo
    commands: List[str]
    snippet_title: str
    snippet: str


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
        # HTTPError: response body'yi de taşıyabilir.
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
        eprint(f"[log-digest] Cannot fetch run details: http={code}")
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
        html_url=str(data.get("html_url") or ""),
        head_sha=str(data.get("head_sha") or ""),
        head_branch=str(data.get("head_branch") or ""),
        head_owner=head_owner,
        name=str(data.get("name") or ""),
        event=str(data.get("event") or ""),
        conclusion=str(data.get("conclusion") or ""),
        pull_requests=list(data.get("pull_requests") or []),
    )

def github_graphql(token: str, query: str, variables: dict) -> Tuple[int, dict]:
    payload = {"query": query, "variables": variables}
    code, _hdrs, raw = http_request(
        "POST",
        f"{API_BASE}/graphql",
        headers={**build_headers(token), "Content-Type": "application/json"},
        body=json.dumps(payload).encode("utf-8"),
    )
    if not raw:
        return code, {}
    try:
        data = json.loads(raw.decode("utf-8"))
        return code, data if isinstance(data, dict) else {}
    except json.JSONDecodeError:
        return code, {}


def find_pr_number_via_graphql(token: str, run: RunInfo) -> Optional[int]:
    if not run.head_sha or "/" not in run.repo:
        return None
    owner, name = run.repo.split("/", 1)
    q = """
query($owner:String!, $name:String!, $oid:GitObjectID!) {
  repository(owner: $owner, name: $name) {
    object(oid: $oid) {
      ... on Commit {
        associatedPullRequests(first: 10) {
          nodes { number state }
        }
      }
    }
  }
}
""".strip()
    code, data = github_graphql(token, q, {"owner": owner, "name": name, "oid": run.head_sha})
    if code != 200:
        return None
    if data.get("errors"):
        return None
    repo_obj = (data.get("data") or {}).get("repository") or {}
    obj = repo_obj.get("object") or {}
    apr = obj.get("associatedPullRequests") or {}
    nodes = apr.get("nodes") or []
    if not isinstance(nodes, list) or not nodes:
        return None
    open_nodes = [n for n in nodes if isinstance(n, dict) and n.get("state") == "OPEN"]
    cand = open_nodes[0] if open_nodes else nodes[0]
    num = cand.get("number") if isinstance(cand, dict) else None
    return num if isinstance(num, int) else None


def find_pr_number(token: str, run: RunInfo) -> Tuple[Optional[int], str]:
    if run.pull_requests:
        pr0 = run.pull_requests[0]
        num = pr0.get("number")
        if isinstance(num, int):
            return num, "run.pull_requests[0]"
        return None, "run.pull_requests present but number missing"

    if not run.head_sha:
        return None, "missing head_sha"

    # List PRs associated with a commit (preview header historically required).
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

    gql_num = find_pr_number_via_graphql(token, run)
    if gql_num:
        return gql_num, "graphql.associatedPullRequests"

    if run.head_branch:
        head_ref = f"{run.head_owner}:{run.head_branch}" if run.head_owner else run.head_branch
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


def extract_commands(text: str) -> List[str]:
    cmds: List[str] = []
    for cre in CMD_RE_LIST:
        for m in cre.finditer(text):
            cmd = (m.group(1) or "").strip()
            if not cmd:
                continue
            cmds.append(cmd)
    # uniq (stable)
    seen = set()
    out: List[str] = []
    for c in cmds:
        if c in seen:
            continue
        seen.add(c)
        out.append(c)
        if len(out) >= MAX_COMMANDS_PER_JOB:
            break
    return out


def extract_first_error_snippet(text: str) -> Tuple[str, str]:
    lines = text.splitlines()
    for idx, line in enumerate(lines):
        if not ERROR_RE.search(line):
            continue
        end = min(len(lines), idx + SNIPPET_AFTER_LINES + 1)
        snippet_lines = lines[idx:end]
        if len(snippet_lines) > MAX_SNIPPET_LINES:
            snippet_lines = snippet_lines[:MAX_SNIPPET_LINES]
        title = line.strip()
        snippet = "\n".join(snippet_lines).strip()
        return title, snippet
    return "No matching error pattern found.", ""


def digest_job_logs(zip_bytes: bytes) -> Tuple[List[str], str, str]:
    # commands, snippet_title, snippet
    if not zip_bytes:
        return [], "No logs available.", ""

    try:
        zf = zipfile.ZipFile(io.BytesIO(zip_bytes))
    except zipfile.BadZipFile:
        return [], "Logs archive is not a valid zip.", ""

    commands: List[str] = []
    best_title = "No matching error pattern found."
    best_snippet = ""

    for name in sorted(zf.namelist()):
        if name.endswith("/"):
            continue
        try:
            raw = zf.read(name)
        except KeyError:
            continue
        text = raw.decode("utf-8", errors="replace")
        commands.extend(extract_commands(text))

        if not best_snippet:
            title, snippet = extract_first_error_snippet(text)
            if snippet:
                best_title = f"{title} (source: {name})"
                best_snippet = snippet

    # uniq commands (stable) + limit
    seen = set()
    uniq_cmds: List[str] = []
    for c in commands:
        if c in seen:
            continue
        seen.add(c)
        uniq_cmds.append(c)
        if len(uniq_cmds) >= MAX_COMMANDS_PER_JOB:
            break

    return uniq_cmds, best_title, best_snippet


def build_digest_markdown(run: RunInfo, pr_number: int, jobs: List[JobDigest]) -> str:
    lines: List[str] = [
        MARKER,
        "## CI Failure Digest",
        "",
        f"- PR: `#{pr_number}`",
        f"- Workflow: `{run.name}`",
        f"- Conclusion: `{run.conclusion}`",
        f"- Run: {run.html_url}",
        f"- Head SHA: `{run.head_sha}`",
    ]
    if run.conclusion.lower() == "cancelled":
        lines.append("- Note: Logs not downloaded: run cancelled.")
    lines.extend(["", "### Failing jobs"])
    if not jobs:
        lines.append("- (none found)")
    else:
        for jd in jobs:
            lines.append(f"- {jd.job.name}: `{jd.job.conclusion}`")

    for jd in jobs:
        lines.extend(
            [
                "",
                f"### {jd.job.name}",
                f"- Job: {jd.job.html_url}",
            ]
        )

        if jd.commands:
            lines.append("- Detected commands:")
            for c in jd.commands:
                lines.append(f"  - `{c}`")

        if jd.snippet:
            lines.extend(
                [
                    "",
                    f"First error snippet: {jd.snippet_title}",
                    "```text",
                    jd.snippet,
                    "```",
                ]
            )
        else:
            lines.append("")
            lines.append(f"First error snippet: {jd.snippet_title}")

    body = "\n".join(lines).strip() + "\n"
    return truncate_comment(body)


def truncate_comment(body: str) -> str:
    if len(body) <= MAX_COMMENT_CHARS:
        return body
    trailer = "\n\n_(truncated to fit comment size; see workflow run link for full logs)_\n"
    keep = MAX_COMMENT_CHARS - len(trailer)
    if keep < 0:
        keep = 0
    return body[:keep].rstrip() + trailer


def upsert_pr_comment(token: str, repo: str, pr_number: int, body: str) -> Tuple[str, int]:
    existing_id: Optional[int] = None
    for c in paginate(token, f"/repos/{repo}/issues/{pr_number}/comments"):
        c_body = c.get("body")
        if isinstance(c_body, str) and MARKER in c_body:
            cid = c.get("id")
            if isinstance(cid, int):
                existing_id = cid
                break

    if existing_id:
        code, _ = github_patch_json(token, f"/repos/{repo}/issues/comments/{existing_id}", {"body": body})
        if code not in (200, 201):
            eprint(f"[log-digest] Comment update failed: http={code}")
        return "updated", code

    code, _ = github_post_json(token, f"/repos/{repo}/issues/{pr_number}/comments", {"body": body})
    if code not in (200, 201):
        eprint(f"[log-digest] Comment create failed: http={code}")
    return "created", code


def main(argv: Sequence[str]) -> int:
    parser = argparse.ArgumentParser(prog="log_digest.py")
    parser.add_argument("--repo", required=True, help="owner/repo")
    parser.add_argument("--run-id", required=True, type=int, help="workflow_run id")
    args = parser.parse_args(list(argv)[1:])

    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if not token:
        eprint("[log-digest] Missing token env (GITHUB_TOKEN/GH_TOKEN).")
        return 2

    run = get_run_info(token=token, repo=args.repo, run_id=args.run_id)
    if not run:
        return 0

    print(
        "[log-digest] run"
        f" id={run.run_id}"
        f" workflow={run.name!r}"
        f" event={run.event!r}"
        f" conclusion={run.conclusion!r}"
        f" head_branch={run.head_branch!r}"
        f" head_sha={run.head_sha}"
    )

    pr_number, pr_reason = find_pr_number(token=token, run=run)
    if not pr_number:
        print(f"[log-digest] No PR found for this run; noop. reason={pr_reason}")
        return 0

    failing_jobs = list_failing_jobs(token=token, run=run)
    if not failing_jobs:
        print("[log-digest] No failing jobs found; noop.")
        return 0
    print(f"[log-digest] failing_jobs={len(failing_jobs)} pr_number={pr_number} (via {pr_reason})")

    digests: List[JobDigest] = []
    if run.conclusion.lower() == "cancelled":
        print("[log-digest] run cancelled; skipping log download")
        for job in failing_jobs:
            digests.append(
                JobDigest(
                    job=job,
                    commands=[],
                    snippet_title="Logs not downloaded: run cancelled.",
                    snippet="",
                )
            )
    else:
        for job in failing_jobs:
            code, zbytes = github_get_bytes(token, f"/repos/{run.repo}/actions/jobs/{job.id}/logs")
            if code != 200:
                if code in (401, 403):
                    title = (
                        f"Logs not downloaded: http={code} (unauthorized). "
                        "Check workflow permissions (`actions: read`) / org policy."
                    )
                elif code == 404:
                    title = "Logs not downloaded: http=404 (not found)."
                else:
                    title = f"Cannot download logs (http={code})."
                digests.append(
                    JobDigest(
                        job=job,
                        commands=[],
                        snippet_title=title,
                        snippet="",
                    )
                )
                continue

            cmds, title, snippet = digest_job_logs(zbytes)
            digests.append(JobDigest(job=job, commands=cmds, snippet_title=title, snippet=snippet))

    body = build_digest_markdown(run=run, pr_number=pr_number, jobs=digests)
    action, code = upsert_pr_comment(token=token, repo=run.repo, pr_number=pr_number, body=body)
    print(f"[log-digest] comment {action} http={code}")

    print("[log-digest] OK")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv))
    except Exception as exc:
        eprint("[log-digest] Unexpected error (noop):")
        eprint(textwrap.indent(repr(exc), "  "))
        raise SystemExit(0)
