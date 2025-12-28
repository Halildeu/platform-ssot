#!/usr/bin/env bash
set -euo pipefail

# Ensure an OPEN PR exists for a head branch (idempotent).
# - Uses SSOT auth: `gh api rate_limit` must succeed (persist auth OR GH_TOKEN/GITHUB_TOKEN OR Vault pointer).
# - If head commit is already in origin/<base>, does nothing.
# - If an open PR already exists for <head>, does nothing.
# - Otherwise creates a PR (optional body-file).
#
# Vault pointer defaults (SSOT):
# - GH_AUTH_VAULT_PATH=secret/stage/ops/github
# - GH_AUTH_VAULT_FIELD=GH_LOCAL_AUTOPILOT_TOKEN

# Prevent accidental secret leakage if the caller enabled xtrace.
set +x

REPO=""
BASE="main"
HEAD=""
TITLE=""
BODY_FILE=""
BODY_TEXT="Local SSOT: PR created via CLI (copy-free). See local execution-log for evidence."
DRAFT=0

usage() {
  cat <<'EOF'
Usage:
  bash scripts/ops/gh_pr_ensure_open.sh \
    --repo <owner/repo> \
    --base <base-branch> \
    --head <head-branch> \
    [--title <title>] \
    [--body-file <path>] \
    [--body <text>] \
    [--draft]

Notes:
  - SSOT auth: `gh api rate_limit` must succeed (persist auth OR GH_TOKEN/GITHUB_TOKEN OR Vault pointer).
  - Vault pointer defaults:
      GH_AUTH_VAULT_PATH=secret/stage/ops/github
      GH_AUTH_VAULT_FIELD=GH_LOCAL_AUTOPILOT_TOKEN
  - Idempotent:
      - If head commit is already in origin/<base>, exits 0 (NOOP).
      - If an open PR already exists for --head, exits 0 (NOOP).
EOF
}

detect_repo_from_origin() {
  local origin
  origin="$(git remote get-url origin 2>/dev/null || true)"
  if [[ "${origin}" =~ github\.com[:/]([^/]+)/([^/]+)(\.git)?$ ]]; then
    local owner="${BASH_REMATCH[1]}"
    local repo="${BASH_REMATCH[2]}"
    repo="${repo%.git}"
    echo "${owner}/${repo}"
    return 0
  fi
  return 1
}

while [ $# -gt 0 ]; do
  case "$1" in
    --repo) REPO="$2"; shift 2 ;;
    --base) BASE="$2"; shift 2 ;;
    --head) HEAD="$2"; shift 2 ;;
    --title) TITLE="$2"; shift 2 ;;
    --body-file) BODY_FILE="$2"; shift 2 ;;
    --body) BODY_TEXT="$2"; shift 2 ;;
    --draft) DRAFT=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "[gh_pr_ensure_open] Unknown arg: $1" >&2; usage; exit 2 ;;
  esac
done

if ! command -v gh >/dev/null 2>&1; then
  echo "[gh_pr_ensure_open] FAIL: gh CLI not found" >&2
  exit 1
fi
if ! command -v git >/dev/null 2>&1; then
  echo "[gh_pr_ensure_open] FAIL: git not found" >&2
  exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "${REPO_ROOT:-}" ]; then
  echo "[gh_pr_ensure_open] FAIL: not a git repo" >&2
  exit 1
fi
cd "${REPO_ROOT}"

if [ -z "${REPO:-}" ]; then
  REPO="${GITHUB_REPOSITORY:-}"
fi
if [ -z "${REPO:-}" ]; then
  REPO="$(detect_repo_from_origin || true)"
fi
if [ -z "${REPO:-}" ]; then
  echo "[gh_pr_ensure_open] FAIL: cannot detect repo; pass --repo owner/repo" >&2
  exit 1
fi

if [ -z "${HEAD:-}" ]; then
  echo "[gh_pr_ensure_open] FAIL: --head is required" >&2
  usage
  exit 2
fi
if [ "${HEAD}" = "${BASE}" ]; then
  echo "[gh_pr_ensure_open] FAIL: head equals base (${BASE})" >&2
  exit 2
fi

if [ -n "${BODY_FILE:-}" ] && [ ! -f "${BODY_FILE}" ]; then
  echo "[gh_pr_ensure_open] FAIL: body file not found: ${BODY_FILE}" >&2
  exit 2
fi

# SSOT Vault pointer defaults (only if caller didn't set them).
: "${GH_AUTH_VAULT_PATH:=secret/stage/ops/github}"
: "${GH_AUTH_VAULT_FIELD:=GH_LOCAL_AUTOPILOT_TOKEN}"

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "${script_dir}/gh_token_preflight.sh" ]; then
  # shellcheck source=/dev/null
  source "${script_dir}/gh_token_preflight.sh"
fi

if ! gh api rate_limit >/dev/null 2>&1; then
  if ! gh_token_preflight >/dev/null 2>&1; then
    echo "[gh_pr_ensure_open] FAIL: GH auth unavailable. Fix: set GH_TOKEN/GITHUB_TOKEN or configure Vault pointer (GH_AUTH_VAULT_PATH/FIELD) + VAULT_TOKEN." >&2
    exit 1
  fi
fi

# Ensure the head branch exists locally (we need its commit and we want to push it).
if ! git show-ref --verify --quiet "refs/heads/${HEAD}"; then
  echo "[gh_pr_ensure_open] FAIL: local branch not found: ${HEAD}" >&2
  echo "[gh_pr_ensure_open] Hint: checkout the branch locally (or pass a local branch name)." >&2
  exit 2
fi

# Make sure base is up-to-date locally.
git fetch origin "${BASE}" -q

head_commit="$(git rev-parse "${HEAD}")"
if git merge-base --is-ancestor "${head_commit}" "origin/${BASE}"; then
  echo "[gh_pr_ensure_open] NOOP: ${HEAD} (${head_commit:0:7}) is already in origin/${BASE}"
  exit 0
fi

# Ensure remote branch exists (required for PR creation).
if ! git push -u origin "${HEAD}" >/dev/null 2>&1; then
  echo "[gh_pr_ensure_open] FAIL: git push failed for branch=${HEAD}. Run git auth setup and retry." >&2
  exit 1
fi

open_url="$(gh pr list --repo "${REPO}" --head "${HEAD}" --state open --json url --jq '.[0].url // ""' 2>/dev/null || true)"
if [ -n "${open_url}" ]; then
  echo "[gh_pr_ensure_open] NOOP: open PR exists: ${open_url}"
  exit 0
fi

if [ -z "${TITLE:-}" ]; then
  TITLE="docs: ${HEAD} (auto PR ensure)"
fi

args=(--repo "${REPO}" --base "${BASE}" --head "${HEAD}" --title "${TITLE}")
if [ "${DRAFT}" = "1" ]; then
  args+=(--draft)
fi
if [ -n "${BODY_FILE:-}" ]; then
  args+=(--body-file "${BODY_FILE}")
else
  args+=(--body "${BODY_TEXT}")
fi

gh pr create "${args[@]}" >/dev/null

created_url="$(gh pr view --repo "${REPO}" --head "${HEAD}" --json url --jq '.url // ""' 2>/dev/null || true)"
if [ -n "${created_url}" ]; then
  echo "[gh_pr_ensure_open] CREATED: ${created_url}"
  exit 0
fi

echo "[gh_pr_ensure_open] CREATED: PR created but URL lookup failed (gh pr view)." >&2
exit 0

