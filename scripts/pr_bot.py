#!/usr/bin/env python3
"""
PR Bot (v0.1)

Amaç:
- fix/** ve wip/** branch push'larında PR yoksa PR aç
- PR üzerinde tek bir marker comment'ini idempotent şekilde upsert et
- wip/** için PR'ı draft yapmak (best-effort)

Notlar:
- SSOT: docs/04-operations/PR-BOT-RULES.json
- Template'ler: docs/04-operations/pr-bot-templates/*.md
- Marker: <!-- pr-bot:rules -->
"""

from __future__ import annotations

import argparse
import fnmatch
import json
import os
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
REST_API_BASE = "https://api.github.com"
GRAPHQL_API = "https://api.github.com/graphql"
API_VERSION = "2022-11-28"
USER_AGENT = "platform-ssot-pr-bot/0.1"


EXIT_OK = 0
EXIT_CONFIG = 2
EXIT_AUTH = 3
EXIT_API = 4
EXIT_INVARIANT = 5


@dataclass(frozen=True)
class Rule:
    match: str
    template_key: str
    draft: Optional[bool]


class GitHubApiError(RuntimeError):
    def __init__(self, status: int, message: str, response_body: str) -> None:
        super().__init__(message)
        self.status = status
        self.response_body = response_body


def eprint(msg: str) -> None:
    print(msg, file=sys.stderr)


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


def match_any(branch: str, patterns: Iterable[str]) -> bool:
    for pat in patterns:
        if fnmatch.fnmatch(branch, pat):
            return True
    return False


def select_rule(config: Dict[str, Any], branch: str) -> Optional[Rule]:
    rules = config.get("rules") or []
    if not isinstance(rules, list):
        raise SystemExit("PR-BOT-RULES.json: rules list değil.")

    for raw in rules:
        if not isinstance(raw, dict):
            continue
        if raw.get("match") == branch:
            template_key = raw.get("template")
            if not isinstance(template_key, str) or not template_key.strip():
                raise SystemExit(f"Rule template eksik/geçersiz: match={branch}")
            draft_val = raw.get("draft")
            draft: Optional[bool]
            if isinstance(draft_val, bool):
                draft = draft_val
            elif draft_val is None:
                draft = None
            else:
                raise SystemExit(f"Rule draft bool olmalı: match={branch}")
            return Rule(match=branch, template_key=template_key, draft=draft)

    return None


def desired_draft_state(config: Dict[str, Any], branch: str, rule: Rule) -> bool:
    if rule.draft is not None:
        return rule.draft

    policy = config.get("draft_policy") or {}
    if not isinstance(policy, dict):
        return False

    for pat, val in policy.items():
        if isinstance(val, bool) and fnmatch.fnmatch(branch, pat):
            return val
    return False


def read_template(config: Dict[str, Any], template_key: str) -> str:
    templates = config.get("comment_templates") or {}
    if not isinstance(templates, dict):
        raise SystemExit("PR-BOT-RULES.json: comment_templates dict değil.")

    path_value = templates.get(template_key)
    if not isinstance(path_value, str) or not path_value.strip():
        raise SystemExit(f"Template path bulunamadı: {template_key}")

    path = resolve_repo_path(path_value)
    try:
        return path.read_text(encoding="utf-8").rstrip() + "\n"
    except FileNotFoundError:
        raise SystemExit(f"Template dosyası bulunamadı: {path}")


def build_comment_body(config: Dict[str, Any], template_key: str) -> str:
    marker = config.get("comment_marker")
    if not isinstance(marker, str) or not marker.strip():
        raise SystemExit("PR-BOT-RULES.json: comment_marker eksik/geçersiz.")

    template = read_template(config, template_key)
    return f"{marker}\n{template}"


def api_request_json(method: str, url: str, token: str, body: Optional[Dict[str, Any]] = None) -> Any:
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


def find_open_pr(owner: str, repo: str, branch: str, base: str, token: str) -> Optional[Dict[str, Any]]:
    url = rest_url(
        owner,
        repo,
        "/pulls",
        query={
            "state": "open",
            "head": f"{owner}:{branch}",
            "base": base,
            "per_page": "100",
        },
    )
    prs = api_request_json("GET", url, token, body=None)
    if not prs:
        return None
    if not isinstance(prs, list):
        raise GitHubApiError(status=0, message="PR listesi bekleniyordu (REST).", response_body=str(prs))
    return prs[0]


def create_pr(owner: str, repo: str, branch: str, base: str, draft: bool, token: str) -> Dict[str, Any]:
    url = rest_url(owner, repo, "/pulls")
    body = {"title": branch, "head": branch, "base": base, "draft": bool(draft)}
    pr = api_request_json("POST", url, token, body=body)
    if not isinstance(pr, dict):
        raise GitHubApiError(status=0, message="PR create response dict olmalı.", response_body=str(pr))
    return pr


def iter_issue_comments(owner: str, repo: str, issue_number: int, token: str) -> Iterable[Dict[str, Any]]:
    page = 1
    while True:
        url = rest_url(
            owner,
            repo,
            f"/issues/{issue_number}/comments",
            query={"per_page": "100", "page": str(page)},
        )
        items = api_request_json("GET", url, token, body=None)
        if not items:
            return
        if not isinstance(items, list):
            raise GitHubApiError(status=0, message="Issue comment listesi bekleniyordu.", response_body=str(items))
        for it in items:
            if isinstance(it, dict):
                yield it
        if len(items) < 100:
            return
        page += 1


def upsert_marker_comment(
    owner: str,
    repo: str,
    issue_number: int,
    token: str,
    marker: str,
    desired_body: str,
) -> Tuple[str, Optional[str]]:
    """
    Dönüş:
      action: created|updated|noop
      comment_url: varsa URL
    """
    matches: List[Dict[str, Any]] = []
    for c in iter_issue_comments(owner, repo, issue_number, token):
        body = c.get("body") or ""
        if isinstance(body, str) and marker in body:
            matches.append(c)

    if matches:
        # En son bulunan marker comment'ini güncelle (idempotentlik için).
        target = matches[-1]
        existing_body = target.get("body") or ""
        comment_id = target.get("id")
        comment_url = target.get("html_url")
        if not isinstance(existing_body, str) or not isinstance(comment_id, int):
            raise GitHubApiError(status=0, message="Comment shape beklenmedik.", response_body=str(target))

        if existing_body == desired_body:
            return "noop", comment_url if isinstance(comment_url, str) else None

        url = rest_url(owner, repo, f"/issues/comments/{comment_id}")
        api_request_json("PATCH", url, token, body={"body": desired_body})
        return "updated", comment_url if isinstance(comment_url, str) else None

    url = rest_url(owner, repo, f"/issues/{issue_number}/comments")
    resp = api_request_json("POST", url, token, body={"body": desired_body})
    if not isinstance(resp, dict):
        raise GitHubApiError(status=0, message="Comment create response dict olmalı.", response_body=str(resp))
    comment_url = resp.get("html_url")
    return "created", comment_url if isinstance(comment_url, str) else None


def graphql_mutation(token: str, query: str, variables: Dict[str, Any]) -> Dict[str, Any]:
    resp = api_request_json("POST", GRAPHQL_API, token, body={"query": query, "variables": variables})
    if not isinstance(resp, dict):
        raise GitHubApiError(status=0, message="GraphQL response dict olmalı.", response_body=str(resp))
    if resp.get("errors"):
        raise GitHubApiError(status=0, message="GraphQL errors döndü.", response_body=json.dumps(resp.get("errors")))
    data = resp.get("data")
    if not isinstance(data, dict):
        raise GitHubApiError(status=0, message="GraphQL data dict olmalı.", response_body=str(resp))
    return data


def convert_pr_to_draft_best_effort(token: str, pr_node_id: str) -> Tuple[bool, str]:
    query = """
mutation($prId: ID!) {
  convertPullRequestToDraft(input: { pullRequestId: $prId }) {
    pullRequest { id isDraft url }
  }
}
""".strip()
    try:
        data = graphql_mutation(token, query, {"prId": pr_node_id})
        pr = (data.get("convertPullRequestToDraft") or {}).get("pullRequest") or {}
        is_draft = pr.get("isDraft")
        return bool(is_draft), "ok"
    except GitHubApiError as e:
        return False, f"fail: {e}"


def write_step_summary(lines: List[str]) -> None:
    path = os.environ.get("GITHUB_STEP_SUMMARY")
    if not path:
        return
    try:
        Path(path).write_text("\n".join(lines) + "\n", encoding="utf-8")
    except OSError:
        # Summary yazılamazsa job'u fail etmeyelim.
        return


def parse_args(argv: List[str]) -> argparse.Namespace:
    ap = argparse.ArgumentParser(prog="pr_bot.py")
    ap.add_argument("--repo", default=os.environ.get("GITHUB_REPOSITORY"))
    ap.add_argument("--branch", default=os.environ.get("GITHUB_REF_NAME"))
    ap.add_argument("--base", default=None)
    ap.add_argument("--token-env", default="GH_TOKEN")
    ap.add_argument("--rules-path", default="docs/04-operations/PR-BOT-RULES.json")
    ap.add_argument("--dry-run", action="store_true")
    return ap.parse_args(argv)


def main(argv: List[str]) -> int:
    args = parse_args(argv)

    if not args.repo or "/" not in args.repo:
        if args.dry_run:
            args.repo = "UNKNOWN/UNKNOWN"
        else:
            eprint("HATA: --repo verilmeli (örn: owner/repo) veya GITHUB_REPOSITORY set olmalı.")
            return EXIT_CONFIG
    if not args.branch:
        eprint("HATA: --branch verilmeli veya GITHUB_REF_NAME set olmalı.")
        return EXIT_CONFIG

    owner, repo = args.repo.split("/", 1)
    rules_path = resolve_repo_path(args.rules_path)

    try:
        config = load_json(rules_path)
    except SystemExit as e:
        eprint(str(e))
        return EXIT_CONFIG

    base_branch = args.base or config.get("base_branch") or "main"
    if not isinstance(base_branch, str) or not base_branch.strip():
        eprint("HATA: base_branch geçersiz.")
        return EXIT_CONFIG

    branch_patterns = config.get("branch_patterns") or []
    if isinstance(branch_patterns, list) and branch_patterns:
        patterns = [p for p in branch_patterns if isinstance(p, str)]
        if patterns and not match_any(args.branch, patterns):
            print(f"[pr-bot] noop: branch scope dışı: {args.branch}")
            return EXIT_OK

    rule = select_rule(config, args.branch)
    if not rule:
        print(f"[pr-bot] noop: rule yok: {args.branch}")
        return EXIT_OK

    marker = config.get("comment_marker") or ""
    if not isinstance(marker, str) or not marker.strip():
        eprint("HATA: comment_marker eksik/geçersiz.")
        return EXIT_CONFIG

    try:
        desired_comment = build_comment_body(config, rule.template_key)
    except SystemExit as e:
        eprint(str(e))
        return EXIT_CONFIG

    want_draft = desired_draft_state(config, args.branch, rule)

    if args.dry_run:
        print("[pr-bot] dry-run")
        print(f"- repo:   {owner}/{repo}")
        print(f"- branch: {args.branch}")
        print(f"- base:   {base_branch}")
        print(f"- rule:   match={rule.match} template={rule.template_key} draft={want_draft}")
        print(f"- comment_marker: {marker}")
        print("- actions:")
        print("  - ensure PR exists (create if missing)")
        if want_draft:
            print("  - ensure PR is draft (best-effort)")
        print("  - upsert marker comment")
        return EXIT_OK

    token = os.environ.get(args.token_env) or os.environ.get("GITHUB_TOKEN")
    if not token:
        eprint(f"HATA: token bulunamadı. env:{args.token_env} (fallback: GITHUB_TOKEN)")
        return EXIT_AUTH

    summary: List[str] = []
    summary.append("# PR Bot")
    summary.append("")
    summary.append(f"- Repo: `{owner}/{repo}`")
    summary.append(f"- Branch: `{args.branch}`")
    summary.append(f"- Base: `{base_branch}`")
    summary.append(f"- Rule: `{rule.template_key}` (draft={want_draft})")

    try:
        pr = find_open_pr(owner, repo, args.branch, base_branch, token)
        pr_created = False
        if not pr:
            pr = create_pr(owner, repo, args.branch, base_branch, want_draft, token)
            pr_created = True

        pr_number = pr.get("number")
        pr_url = pr.get("html_url")
        pr_node_id = pr.get("node_id")
        pr_is_draft = pr.get("draft")

        if not isinstance(pr_number, int) or not isinstance(pr_url, str):
            eprint("HATA: PR response beklenmedik (number/url).")
            return EXIT_INVARIANT

        print(f"[pr-bot] PR: {pr_url}")
        summary.append(f"- PR: {pr_url}")
        summary.append(f"- PR action: {'created' if pr_created else 'exists'}")

        draft_action = "skipped"
        if want_draft and pr_node_id and isinstance(pr_node_id, str):
            if pr_is_draft is True:
                draft_action = "noop (already draft)"
            else:
                ok, msg = convert_pr_to_draft_best_effort(token, pr_node_id)
                draft_action = "updated" if ok else f"warn ({msg})"
        summary.append(f"- Draft: {draft_action}")

        comment_action, comment_url = upsert_marker_comment(
            owner=owner,
            repo=repo,
            issue_number=pr_number,
            token=token,
            marker=marker,
            desired_body=desired_comment,
        )
        summary.append(f"- Comment: {comment_action}")
        if comment_url:
            summary.append(f"  - {comment_url}")
        print(f"[pr-bot] Comment: {comment_action}")

        write_step_summary(summary)
        return EXIT_OK

    except GitHubApiError as e:
        eprint(f"[pr-bot] HATA: {e}")
        if e.response_body:
            eprint(e.response_body)
        if e.status in (401, 403):
            return EXIT_AUTH
        return EXIT_API


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
