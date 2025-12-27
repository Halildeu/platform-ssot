#!/usr/bin/env bash

# Token-based GH auth preflight (SSOT):
# - Auth is considered OK if `gh api rate_limit` succeeds.
# - Works with GH_TOKEN env, GITHUB_TOKEN env, or Vault pointer env (GH_AUTH_VAULT_PATH/FIELD).
# - Token value is never printed (and xtrace is temporarily disabled).

gh_token_preflight() {
  if ! command -v gh >/dev/null 2>&1; then
    echo "[gh_token_preflight] FAIL: gh CLI not found" >&2
    return 1
  fi

  local xtrace_was_on=0
  case "$-" in *x*) xtrace_was_on=1 ;; esac
  set +x

  # If gh already has a valid auth context (e.g. token stored by `gh auth login`),
  # treat as PASS without requiring env token.
  if gh api rate_limit >/dev/null 2>&1; then
    echo "[gh_token_preflight] PASS: gh api rate_limit ok (existing auth)"
    if [ "${xtrace_was_on}" = "1" ]; then
      set -x
    fi
    return 0
  fi

  local token=""
  if [ -n "${GH_TOKEN:-}" ]; then
    token="${GH_TOKEN}"
  elif [ -n "${GITHUB_TOKEN:-}" ]; then
    token="${GITHUB_TOKEN}"
  elif command -v vault >/dev/null 2>&1 && [ -n "${GH_AUTH_VAULT_PATH:-}" ] && [ -n "${GH_AUTH_VAULT_FIELD:-}" ]; then
    token="$(vault kv get -field="$GH_AUTH_VAULT_FIELD" "$GH_AUTH_VAULT_PATH" 2>/dev/null || true)"
  fi

  if [ -z "${token}" ]; then
    echo "[gh_token_preflight] FAIL: no token found (GH_TOKEN/GITHUB_TOKEN/VaultPointer)" >&2
    if [ "${xtrace_was_on}" = "1" ]; then
      set -x
    fi
    return 1
  fi

  export GH_TOKEN="${token}"
  unset token

  if ! gh api rate_limit >/dev/null 2>&1; then
    echo "[gh_token_preflight] FAIL: gh api rate_limit failed (token invalid/scopes?)" >&2
    if [ "${xtrace_was_on}" = "1" ]; then
      set -x
    fi
    return 1
  fi

  echo "[gh_token_preflight] PASS: GH_TOKEN works (gh api rate_limit ok)"
  if [ "${xtrace_was_on}" = "1" ]; then
    set -x
  fi
  return 0
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  set -euo pipefail
  gh_token_preflight
fi
