#!/usr/bin/env bash
# Prevent xtrace from leaking secrets even if invoked with `bash -x`.
set +x
set -euo pipefail

HOSTNAME="github.com"
GIT_PROTOCOL="https"
STORE_KEYCHAIN=0
KEYCHAIN_SERVICE="github.com"
KEYCHAIN_ACCOUNT="${USER:-user}"

usage() {
  cat <<'EOF'
Usage:
  bash scripts/ops/gh_auth_with_token.sh [--store-keychain] [--hostname github.com] [--git-protocol https] [--account <name>]

Token source priority:
  1) env: GH_TOKEN
  2) env: GITHUB_TOKEN
  3) macOS Keychain: service=github.com, account=$USER
  4) Vault (KV v2): GH_AUTH_VAULT_PATH + GH_AUTH_VAULT_FIELD (optional)

Security:
  - Token is never printed; only piped to `gh auth login --with-token` via stdin.
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --store-keychain) STORE_KEYCHAIN=1; shift ;;
    --hostname) HOSTNAME="$2"; shift 2 ;;
    --git-protocol) GIT_PROTOCOL="$2"; shift 2 ;;
    --account) KEYCHAIN_ACCOUNT="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "[gh_auth_with_token] Unknown arg: $1"; usage; exit 1 ;;
  esac
done

if ! command -v gh >/dev/null 2>&1; then
  echo "[gh_auth_with_token] gh CLI not found."
  exit 1
fi

if [ "$STORE_KEYCHAIN" = "1" ]; then
  if ! command -v security >/dev/null 2>&1; then
    echo "[gh_auth_with_token] macOS Keychain (security) not available; cannot store token."
    exit 1
  fi

  echo "[gh_auth_with_token] Storing token in Keychain (service=$KEYCHAIN_SERVICE account=$KEYCHAIN_ACCOUNT)."
  echo "[gh_auth_with_token] macOS Keychain will prompt for the token; it will NOT be echoed."
  # IMPORTANT: `-w` used without argument prompts for password; safer than `-w <token>`.
  security add-generic-password -U -a "$KEYCHAIN_ACCOUNT" -s "$KEYCHAIN_SERVICE" -w >/dev/null
fi

TOKEN=""
if [ -n "${GH_TOKEN:-}" ]; then
  TOKEN="${GH_TOKEN}"
elif [ -n "${GITHUB_TOKEN:-}" ]; then
  TOKEN="${GITHUB_TOKEN}"
else
  if command -v security >/dev/null 2>&1; then
    TOKEN="$(security find-generic-password -a "$KEYCHAIN_ACCOUNT" -s "$KEYCHAIN_SERVICE" -w 2>/dev/null || true)"
  fi

  if [ -z "$TOKEN" ] && command -v vault >/dev/null 2>&1 && [ -n "${GH_AUTH_VAULT_PATH:-}" ] && [ -n "${GH_AUTH_VAULT_FIELD:-}" ]; then
    TOKEN="$(vault kv get -field="$GH_AUTH_VAULT_FIELD" "$GH_AUTH_VAULT_PATH" 2>/dev/null || true)"
  fi
fi

if [ -z "$TOKEN" ]; then
  echo "[gh_auth_with_token] No token found (env/keychain/vault)."
  echo "  - Option A: export GH_TOKEN=... (session only)"
  echo "  - Option B (macOS): bash scripts/ops/gh_auth_with_token.sh --store-keychain"
  echo "  - Option C (Vault): export GH_AUTH_VAULT_PATH=... GH_AUTH_VAULT_FIELD=...; then run this script"
  exit 1
fi

printf "%s" "$TOKEN" | gh auth login --hostname "$HOSTNAME" --git-protocol "$GIT_PROTOCOL" --with-token >/dev/null
unset TOKEN

LOGIN="$(gh api user -q .login 2>/dev/null || true)"
if [ -n "$LOGIN" ]; then
  echo "[gh_auth_with_token] OK (login=$LOGIN)"
else
  echo "[gh_auth_with_token] OK"
fi
