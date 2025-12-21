#!/usr/bin/env python3
"""
PR Merge Bot (v0.3)

Amaç:
- workflow_run SUCCESS sonrası ilgili PR'ı bulmak,
- Label gate ile (pr-bot/ready-to-merge) squash merge yapmak.

Altın kurallar:
- Least privilege (GITHUB_TOKEN),
- Idempotent ve denetlenebilir (Step Summary),
- Fail-safe (koşullar sağlanmıyorsa exit 0).
"""

from __future__ import annotations

import argparse
import fnmatch
import json
import os
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
REST_API_BASE = "https://api.github.com"
API_VERSION = "2022-11-28"
USER_AGENT = "platform-ssot-pr-merge-bot/0.3"
RESULT_PREFIX = "[pr-merge] RESULT "


EXIT_OK = 0
EXIT_CONFIG = 2
EXIT_AUTH = 3
EXIT_API = 4
EXIT_INVARIANT = 5


MERGE_POLICY_NONE = "none"
MERGE_POLICY_BOT_SQUASH = "bot_squash"
MERGE_POLICIES = {MERGE_POLICY_NONE, MERGE_POLICY_BOT_SQUASH}
DEFAULT_READY_TO_MERGE_LABEL = "pr-bot/ready-to-merge"
REQUIRED_CHECK_CI_GATE = "ci-gate"


@dataclass(frozen=True)
class Rule:
    match: str
    merge_policy: str


class GitHubApiError(RuntimeError):
    def __init__(self, status: int, message: str, response_body: str) -> None:
        super().__init__(message)
        self.status = status
        self.response_body = response_body


def eprint(msg: str) -> None:
    print(msg, file=sys.stderr)


def emit_result(payload: Dict[str, Any]) -> None:
    try:
        raw = json.dumps(payload, ensure_ascii=False, separators=(",", ":"), sort_keys=True)
    except TypeError:
        raw = json.dumps(
            {"result": "error", "reason": "result_payload_not_serializable"},
            ensure_ascii=False,
            separators=(",", ":"),
            sort_keys=True,
        )
    print(f"{RESULT_PREFIX}{raw}")


def load_json(path: Path) -> Dict[str, Any]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise SystemExit(f"Rules dosyası bulunamadı: {path}")
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Rules JSON parse hatası: {path} ({exc})")


def resolve_repo_path(value: str) -> Path:
    p = Path(value)
    if p.is_absolute():
        return p
    return (ROOT / p).resolve()


def api_request_json(
    method: str,
    url: str,
    token: str,
    body: Optional[Dict[str, Any]] = None,
) -> Any:
    data: Optional[bytes] = None
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": USER_AGENT,
        "X-GitHub-Api-Version": API_VERSION,
        "Authorization": f"Bearer {token}",
    }

    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = Request(url=url, method=method, data=data, headers=headers)
    try:
        with urlopen(req, timeout=30) as resp:
            raw = resp.read().decode("utf-8")
            if not raw:
                return None
            return json.loads(raw)
    except HTTPError as e:
        raw = e.read().decode("utf-8", errors="replace")
        raise GitHubApiError(status=e.code, message=f"GitHub API HTTP {e.code}: {url}", response_body=raw)
    except URLError as e:
        raise GitHubApiError(status=0, message=f"GitHub API bağlantı hatası: {url} ({e})", response_body="")


def rest_url(owner: str, repo: str, path: str, query: Optional[Dict[str, str]] = None) -> str:
    from urllib.parse import urlencode

    base = f"{REST_API_BASE}/repos/{owner}/{repo}{path}"
    if not query:
        return base
    return f"{base}?{urlencode(query)}"


def match_any(branch: str, patterns: Iterable[str]) -> bool:
    for pat in patterns:
        if fnmatch.fnmatch(branch, pat):
            return True
    return False


def parse_rule(raw: Dict[str, Any]) -> Rule:
    match = raw.get("match")
    if not isinstance(match, str) or not match.strip():
        raise SystemExit("Rule match eksik/geçersiz.")

    merge_policy_val = raw.get("merge_policy")
    if merge_policy_val is None:
        merge_policy = MERGE_POLICY_NONE
    elif isinstance(merge_policy_val, str):
        merge_policy = merge_policy_val.strip()
    else:
        raise SystemExit(f"Rule merge_policy string olmalı: match={match}")

    if merge_policy not in MERGE_POLICIES:
        raise SystemExit(
            f"Rule merge_policy geçersiz: match={match} (beklenen: {sorted(MERGE_POLICIES)}, gelen: {merge_policy})"
        )

    return Rule(match=match, merge_policy=merge_policy)


def select_rule(config: Dict[str, Any], branch: str) -> Rule:
    rules = config.get("rules") or []
    if not isinstance(rules, list):
        raise SystemExit("PR-BOT-RULES.json: rules list değil.")

    parsed: List[Rule] = []
    for raw in rules:
        if not isinstance(raw, dict):
            continue
        parsed.append(parse_rule(raw))

    for rule in parsed:
        if rule.match == branch:
            return rule
    for rule in parsed:
        if fnmatch.fnmatch(branch, rule.match):
            return rule

    return Rule(match="(default)", merge_policy=MERGE_POLICY_NONE)


def ready_to_merge_label(config: Dict[str, Any]) -> str:
    raw = config.get("ready_to_merge_label")
    if raw is None:
        return DEFAULT_READY_TO_MERGE_LABEL
    if not isinstance(raw, str) or not raw.strip():
        raise SystemExit("PR-BOT-RULES.json: ready_to_merge_label string olmalı.")
    return raw.strip()


def write_step_summary(lines: List[str]) -> None:
    path = os.environ.get("GITHUB_STEP_SUMMARY")
    if not path:
        return
    try:
        Path(path).write_text("\n".join(lines) + "\n", encoding="utf-8")
    except OSError:
        return


def get_issue(owner: str, repo: str, issue_number: int, token: str) -> Dict[str, Any]:
    url = rest_url(owner, repo, f"/issues/{issue_number}")
    resp = api_request_json("GET", url, token, body=None)
    if not isinstance(resp, dict):
        raise GitHubApiError(status=0, message="Issue response dict olmalı.", response_body=str(resp))
    return resp


def has_label(issue: Dict[str, Any], label_name: str) -> bool:
    labels = issue.get("labels") or []
    if not isinstance(labels, list):
        return False
    for it in labels:
        if isinstance(it, dict) and it.get("name") == label_name:
            return True
    return False


def find_open_pr(
    owner: str,
    repo: str,
    head_owner: str,
    head_branch: str,
    base_branch: str,
    token: str,
) -> Optional[Dict[str, Any]]:
    url = rest_url(
        owner,
        repo,
        "/pulls",
        query={
            "state": "open",
            "head": f"{head_owner}:{head_branch}",
            "base": base_branch,
            "per_page": "100",
        },
    )
    prs = api_request_json("GET", url, token, body=None)
    if not prs:
        return None
    if not isinstance(prs, list):
        raise GitHubApiError(status=0, message="PR listesi bekleniyordu (REST).", response_body=str(prs))
    return prs[0]


def get_pr_details_with_retry(owner: str, repo: str, pr_number: int, token: str) -> Dict[str, Any]:
    url = rest_url(owner, repo, f"/pulls/{pr_number}")
    last: Optional[Dict[str, Any]] = None
    for _ in range(4):
        resp = api_request_json("GET", url, token, body=None)
        if not isinstance(resp, dict):
            raise GitHubApiError(status=0, message="PR detail response dict olmalı.", response_body=str(resp))
        last = resp
        if resp.get("mergeable") is not None:
            return resp
        time.sleep(1.5)
    if last is None:
        raise GitHubApiError(status=0, message="PR detail boş döndü.", response_body="")
    return last


def list_check_runs(owner: str, repo: str, sha: str, token: str) -> List[Dict[str, Any]]:
    url = rest_url(owner, repo, f"/commits/{sha}/check-runs", query={"per_page": "100"})
    resp = api_request_json("GET", url, token, body=None)
    if not isinstance(resp, dict):
        raise GitHubApiError(status=0, message="check-runs response dict olmalı.", response_body=str(resp))
    runs = resp.get("check_runs") or []
    if not isinstance(runs, list):
        return []
    return [r for r in runs if isinstance(r, dict)]


def checks_all_green(check_runs: List[Dict[str, Any]]) -> Tuple[bool, str]:
    if not check_runs:
        return False, "no check-runs"

    for r in check_runs:
        status = r.get("status")
        conclusion = r.get("conclusion")
        if status != "completed":
            name = r.get("name") or "unknown"
            return False, f"incomplete: {name} ({status})"
        if conclusion not in ("success", "skipped", "neutral"):
            name = r.get("name") or "unknown"
            return False, f"not-green: {name} ({conclusion})"
    return True, "ok"


def ci_gate_is_success(check_runs: List[Dict[str, Any]]) -> Tuple[bool, str]:
    """
    Required check (v0.1): sadece `ci-gate`.

    Not:
    - Check run name GitHub Actions job adıyla gelir (workflow+job: ci-gate/ci-gate).
    - Aynı SHA için birden fazla ci-gate run olabilir (re-run). En yeni olanı değerlendiririz.
    """

    candidates: List[Dict[str, Any]] = []
    for r in check_runs:
        name = r.get("name")
        if not isinstance(name, str):
            continue
        if name == REQUIRED_CHECK_CI_GATE or name.startswith(f"{REQUIRED_CHECK_CI_GATE}"):
            candidates.append(r)

    if not candidates:
        return False, "ci-gate check-run not found"

    def sort_key(it: Dict[str, Any]) -> Tuple[str, str, str]:
        completed_at = it.get("completed_at")
        started_at = it.get("started_at")
        run_id = it.get("id")
        return (
            completed_at if isinstance(completed_at, str) else "",
            started_at if isinstance(started_at, str) else "",
            str(run_id) if run_id is not None else "",
        )

    picked = max(candidates, key=sort_key)
    status = picked.get("status")
    conclusion = picked.get("conclusion")
    if status != "completed":
        return False, f"ci-gate status={status}"
    if conclusion != "success":
        return False, f"ci-gate conclusion={conclusion}"
    return True, "ci-gate success"


def squash_merge(owner: str, repo: str, pr_number: int, sha: str, token: str) -> Dict[str, Any]:
    url = rest_url(owner, repo, f"/pulls/{pr_number}/merge")
    body = {"merge_method": "squash", "sha": sha}
    resp = api_request_json("PUT", url, token, body=body)
    if not isinstance(resp, dict):
        raise GitHubApiError(status=0, message="merge response dict olmalı.", response_body=str(resp))
    return resp


def parse_args(argv: List[str]) -> argparse.Namespace:
    ap = argparse.ArgumentParser(prog="pr_merge.py")
    ap.add_argument("--repo", default=os.environ.get("GITHUB_REPOSITORY"))
    ap.add_argument("--event-path", default=os.environ.get("GITHUB_EVENT_PATH"))
    ap.add_argument("--token-env", default="GH_TOKEN")
    ap.add_argument("--rules-path", default="docs/04-operations/PR-BOT-RULES.json")
    ap.add_argument("--dry-run", action="store_true")
    return ap.parse_args(argv)


def main(argv: List[str]) -> int:
    args = parse_args(argv)

    if not args.repo or "/" not in args.repo:
        eprint("HATA: --repo verilmeli (örn: owner/repo) veya GITHUB_REPOSITORY set olmalı.")
        return EXIT_CONFIG
    if not args.event_path:
        eprint("HATA: --event-path verilmeli veya GITHUB_EVENT_PATH set olmalı.")
        return EXIT_CONFIG

    owner, repo = args.repo.split("/", 1)

    rules_path = resolve_repo_path(args.rules_path)
    try:
        config = load_json(rules_path)
    except SystemExit as e:
        eprint(str(e))
        return EXIT_CONFIG

    base_branch = config.get("base_branch") or "main"
    if not isinstance(base_branch, str) or not base_branch.strip():
        eprint("HATA: base_branch geçersiz.")
        return EXIT_CONFIG

    try:
        gate_label = ready_to_merge_label(config)
    except SystemExit as e:
        eprint(str(e))
        return EXIT_CONFIG

    event = json.loads(Path(args.event_path).read_text(encoding="utf-8"))
    if not isinstance(event, dict):
        eprint("HATA: event payload dict olmalı.")
        return EXIT_INVARIANT

    wr = event.get("workflow_run") or {}
    if not isinstance(wr, dict):
        eprint("HATA: workflow_run payload bekleniyor.")
        return EXIT_INVARIANT

    head_sha = wr.get("head_sha")
    head_branch = wr.get("head_branch")
    conclusion = wr.get("conclusion")
    run_url = wr.get("html_url")
    if not isinstance(head_sha, str) or not head_sha.strip():
        eprint("HATA: workflow_run.head_sha eksik/geçersiz.")
        return EXIT_INVARIANT
    if not isinstance(head_branch, str) or not head_branch.strip():
        eprint("HATA: workflow_run.head_branch eksik/geçersiz.")
        return EXIT_INVARIANT
    if conclusion != "success":
        emit_result(
            {
                "base": base_branch,
                "branch": head_branch,
                "pr": None,
                "reason": f"workflow_run conclusion={conclusion}",
                "result": "noop",
                "run_url": run_url if isinstance(run_url, str) else None,
                "sha": head_sha,
            }
        )
        print(f"[merge-bot] noop: workflow_run conclusion={conclusion}")
        return EXIT_OK

    rule = select_rule(config, head_branch)
    if rule.merge_policy != MERGE_POLICY_BOT_SQUASH:
        emit_result(
            {
                "base": base_branch,
                "branch": head_branch,
                "pr": None,
                "reason": f"merge_policy={rule.merge_policy}",
                "result": "noop",
                "run_url": run_url if isinstance(run_url, str) else None,
                "sha": head_sha,
            }
        )
        print(f"[merge-bot] noop: merge_policy={rule.merge_policy} (branch={head_branch})")
        return EXIT_OK

    head_repo = wr.get("head_repository") or {}
    head_owner = owner
    if isinstance(head_repo, dict):
        head_owner_obj = head_repo.get("owner") or {}
        if isinstance(head_owner_obj, dict) and isinstance(head_owner_obj.get("login"), str):
            head_owner = head_owner_obj["login"]

    if args.dry_run:
        print("[merge-bot] dry-run")
        print(f"- repo: {owner}/{repo}")
        print(f"- base: {base_branch}")
        print(f"- head: {head_owner}:{head_branch}")
        print(f"- sha:  {head_sha}")
        print(f"- label gate: {gate_label}")
        emit_result(
            {
                "base": base_branch,
                "branch": head_branch,
                "pr": None,
                "reason": "dry-run",
                "result": "noop",
                "run_url": run_url if isinstance(run_url, str) else None,
                "sha": head_sha,
            }
        )
        return EXIT_OK

    token = os.environ.get(args.token_env) or os.environ.get("GITHUB_TOKEN")
    if not token:
        eprint(f"HATA: token bulunamadı. env:{args.token_env} (fallback: GITHUB_TOKEN)")
        emit_result(
            {
                "base": base_branch,
                "branch": head_branch,
                "pr": None,
                "reason": f"missing token env:{args.token_env} (fallback: GITHUB_TOKEN)",
                "result": "error",
                "run_url": run_url if isinstance(run_url, str) else None,
                "sha": head_sha,
            }
        )
        return EXIT_AUTH

    summary: List[str] = []
    summary.append("# PR Merge Bot")
    summary.append("")
    summary.append(f"- Repo: `{owner}/{repo}`")
    summary.append(f"- Base: `{base_branch}`")
    summary.append(f"- Head: `{head_owner}:{head_branch}`")
    summary.append(f"- SHA: `{head_sha}`")
    summary.append(f"- Gate label: `{gate_label}`")

    try:
        pr = find_open_pr(owner, repo, head_owner, head_branch, base_branch, token)
        if not pr:
            summary.append("- Result: noop (no open PR)")
            write_step_summary(summary)
            emit_result(
                {
                    "base": base_branch,
                    "branch": head_branch,
                    "pr": None,
                    "reason": "no open PR",
                    "result": "noop",
                    "run_url": run_url if isinstance(run_url, str) else None,
                    "sha": head_sha,
                }
            )
            print("[merge-bot] noop: no open PR")
            return EXIT_OK

        pr_number = pr.get("number")
        pr_url = pr.get("html_url")
        if not isinstance(pr_number, int) or not isinstance(pr_url, str):
            raise GitHubApiError(status=0, message="PR response beklenmedik (number/url).", response_body=str(pr))
        summary.append(f"- PR: {pr_url}")

        pr_detail = get_pr_details_with_retry(owner, repo, pr_number, token)
        pr_state = pr_detail.get("state")
        pr_draft = pr_detail.get("draft")
        pr_head = (pr_detail.get("head") or {}).get("sha")
        pr_base = (pr_detail.get("base") or {}).get("ref")
        pr_mergeable = pr_detail.get("mergeable")
        pr_mergeable_state = pr_detail.get("mergeable_state")

        if pr_state != "open":
            summary.append(f"- Result: noop (state={pr_state})")
            write_step_summary(summary)
            emit_result(
                {
                    "base": base_branch,
                    "branch": head_branch,
                    "pr": pr_number,
                    "reason": f"state={pr_state}",
                    "result": "noop",
                    "run_url": run_url if isinstance(run_url, str) else None,
                    "sha": head_sha,
                }
            )
            return EXIT_OK
        if pr_base != base_branch:
            summary.append(f"- Result: noop (base={pr_base})")
            write_step_summary(summary)
            emit_result(
                {
                    "base": base_branch,
                    "branch": head_branch,
                    "pr": pr_number,
                    "reason": f"base={pr_base}",
                    "result": "noop",
                    "run_url": run_url if isinstance(run_url, str) else None,
                    "sha": head_sha,
                }
            )
            return EXIT_OK
        if pr_draft is True:
            summary.append("- Result: noop (draft)")
            write_step_summary(summary)
            emit_result(
                {
                    "base": base_branch,
                    "branch": head_branch,
                    "pr": pr_number,
                    "reason": "draft",
                    "result": "noop",
                    "run_url": run_url if isinstance(run_url, str) else None,
                    "sha": head_sha,
                }
            )
            return EXIT_OK
        if pr_head != head_sha:
            summary.append(f"- Result: noop (head sha changed: pr={pr_head})")
            write_step_summary(summary)
            emit_result(
                {
                    "base": base_branch,
                    "branch": head_branch,
                    "pr": pr_number,
                    "reason": f"head sha changed: pr={pr_head}",
                    "result": "noop",
                    "run_url": run_url if isinstance(run_url, str) else None,
                    "sha": head_sha,
                }
            )
            return EXIT_OK

        issue = get_issue(owner, repo, pr_number, token)
        if not has_label(issue, gate_label):
            summary.append("- Result: noop (missing ready label)")
            write_step_summary(summary)
            emit_result(
                {
                    "base": base_branch,
                    "branch": head_branch,
                    "label": gate_label,
                    "pr": pr_number,
                    "reason": "missing ready label",
                    "result": "noop",
                    "run_url": run_url if isinstance(run_url, str) else None,
                    "sha": head_sha,
                }
            )
            return EXIT_OK

        if pr_mergeable is not True:
            summary.append(f"- Result: noop (mergeable={pr_mergeable}, state={pr_mergeable_state})")
            write_step_summary(summary)
            emit_result(
                {
                    "base": base_branch,
                    "branch": head_branch,
                    "mergeable": pr_mergeable,
                    "mergeable_state": pr_mergeable_state,
                    "pr": pr_number,
                    "reason": f"mergeable={pr_mergeable}, state={pr_mergeable_state}",
                    "result": "noop",
                    "run_url": run_url if isinstance(run_url, str) else None,
                    "sha": head_sha,
                }
            )
            return EXIT_OK

        if pr_mergeable_state == "unstable":
            # GitHub bazen kısa süreli "unstable" döndürür; retry ile deterministik hale getir.
            for _ in range(6):
                time.sleep(5)
                pr_detail = get_pr_details_with_retry(owner, repo, pr_number, token)
                pr_head = (pr_detail.get("head") or {}).get("sha")
                pr_mergeable = pr_detail.get("mergeable")
                pr_mergeable_state = pr_detail.get("mergeable_state")
                if pr_head != head_sha:
                    break
                if pr_mergeable_state != "unstable":
                    break
            if pr_head != head_sha:
                summary.append(f"- Result: noop (head sha changed: pr={pr_head})")
                write_step_summary(summary)
                emit_result(
                    {
                        "base": base_branch,
                        "branch": head_branch,
                        "pr": pr_number,
                        "reason": f"head sha changed: pr={pr_head}",
                        "result": "noop",
                        "run_url": run_url if isinstance(run_url, str) else None,
                        "sha": head_sha,
                    }
                )
                return EXIT_OK

        if pr_mergeable_state not in ("clean", "has_hooks"):
            summary.append(f"- Result: noop (mergeable_state={pr_mergeable_state})")
            write_step_summary(summary)
            emit_result(
                {
                    "base": base_branch,
                    "branch": head_branch,
                    "mergeable_state": pr_mergeable_state,
                    "pr": pr_number,
                    "reason": f"mergeable_state={pr_mergeable_state}",
                    "result": "noop",
                    "run_url": run_url if isinstance(run_url, str) else None,
                    "sha": head_sha,
                }
            )
            return EXIT_OK

        check_runs = list_check_runs(owner, repo, head_sha, token)
        ok, msg = ci_gate_is_success(check_runs)
        summary.append(f"- Required check: {REQUIRED_CHECK_CI_GATE}")
        summary.append(f"- {msg}")
        if not ok:
            summary.append("- Result: noop (ci-gate not green)")
            write_step_summary(summary)
            emit_result(
                {
                    "base": base_branch,
                    "branch": head_branch,
                    "checks": msg,
                    "pr": pr_number,
                    "reason": f"ci-gate not green: {msg}",
                    "result": "noop",
                    "run_url": run_url if isinstance(run_url, str) else None,
                    "sha": head_sha,
                }
            )
            return EXIT_OK

        try:
            resp = squash_merge(owner, repo, pr_number, head_sha, token)
        except GitHubApiError as e:
            # Merge endpoint 405/409/422 gibi durumlarda güvenli şekilde noop kabul edilir.
            if e.status in (405, 409, 422):
                summary.append(f"- Merge: skipped (api {e.status})")
                write_step_summary(summary)
                emit_result(
                    {
                        "base": base_branch,
                        "branch": head_branch,
                        "pr": pr_number,
                        "reason": f"merge api {e.status}",
                        "result": "noop",
                        "run_url": run_url if isinstance(run_url, str) else None,
                        "sha": head_sha,
                    }
                )
                return EXIT_OK
            raise

        merged = resp.get("merged")
        summary.append(f"- Merge: {'merged' if merged is True else 'unknown'} (method=squash)")
        write_step_summary(summary)
        emit_result(
            {
                "base": base_branch,
                "branch": head_branch,
                "pr": pr_number,
                "reason": None,
                "result": "merged" if merged is True else "noop",
                "run_url": run_url if isinstance(run_url, str) else None,
                "sha": head_sha,
            }
        )

        print(f"[merge-bot] merged: {pr_url}" if merged is True else f"[merge-bot] done: {pr_url}")
        return EXIT_OK

    except GitHubApiError as e:
        eprint(f"[merge-bot] HATA: {e}")
        if e.response_body:
            eprint(e.response_body)
        emit_result(
            {
                "base": base_branch,
                "branch": head_branch,
                "pr": None,
                "reason": f"api {e.status}",
                "result": "error",
                "run_url": run_url if isinstance(run_url, str) else None,
                "sha": head_sha,
            }
        )
        if e.status in (401, 403):
            return EXIT_AUTH
        return EXIT_API


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
