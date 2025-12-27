#!/usr/bin/env bash
set -euo pipefail

HOSTNAME="github.com"
REPO=""
BASE="main"
HEAD=""
TITLE=""
BODY_FILE=""
DRAFT=0

usage() {
  cat <<'EOF'
Usage:
  bash scripts/ops/gh_pr_create_from_body.sh \
    --repo <owner/repo> \
    --base <base-branch> \
    --head <head-branch> \
    --title <title> \
    --body-file <path> \
    [--draft]

Notes:
  - SSOT: Auth is OK if `gh api rate_limit` works (persist auth OR GH_TOKEN/GITHUB_TOKEN OR Vault pointer).
  - Helper: `bash scripts/ops/gh_token_preflight.sh`
  - Idempotent: if PR already exists for `--head`, prints URL and exits 0.
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --repo) REPO="$2"; shift 2 ;;
    --base) BASE="$2"; shift 2 ;;
    --head) HEAD="$2"; shift 2 ;;
    --title) TITLE="$2"; shift 2 ;;
    --body-file) BODY_FILE="$2"; shift 2 ;;
    --draft) DRAFT=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "[gh_pr_create_from_body] Unknown arg: $1"; usage; exit 1 ;;
  esac
done

if ! command -v gh >/dev/null 2>&1; then
  echo "[gh_pr_create_from_body] gh CLI not found."
  exit 1
fi

if [ -z "$REPO" ] || [ -z "$HEAD" ] || [ -z "$TITLE" ]; then
  echo "[gh_pr_create_from_body] Missing required args."
  usage
  exit 1
fi

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "${script_dir}/gh_token_preflight.sh" ]; then
  # shellcheck source=/dev/null
  source "${script_dir}/gh_token_preflight.sh"
fi
if ! gh api rate_limit >/dev/null 2>&1; then
  gh_token_preflight >/dev/null 2>&1 || {
    echo "[gh_pr_create_from_body] GH auth unavailable. Fix: set GH_TOKEN/GITHUB_TOKEN (or GH_AUTH_VAULT_PATH/FIELD) and retry."
    exit 1
  }
fi

if [ -n "$BODY_FILE" ] && [ ! -f "$BODY_FILE" ]; then
  echo "[gh_pr_create_from_body] body file not found: $BODY_FILE"
  exit 1
fi

# If PR exists, print and exit 0 (no duplicates).
url="$(gh pr list --repo "$REPO" --head "$HEAD" --state open --json url --jq '.[0].url // ""' 2>/dev/null || true)"
if [ -n "$url" ]; then
  echo "[gh_pr_create_from_body] PR already exists: $url"
  exit 0
fi

args=(--repo "$REPO" --base "$BASE" --head "$HEAD" --title "$TITLE")
if [ "$DRAFT" = "1" ]; then
  args+=(--draft)
fi

if [ -n "$BODY_FILE" ] && [ -f "$BODY_FILE" ]; then
  args+=(--body-file "$BODY_FILE")
else
  args+=(--body "PR created via gh (no body-file).")
fi

gh pr create "${args[@]}"
