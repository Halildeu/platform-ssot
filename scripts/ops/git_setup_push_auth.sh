#!/usr/bin/env bash
set -euo pipefail

# Prevent accidental secret leakage if the caller enabled xtrace.
set +x

REMOTE="origin"
DRY_RUN="1"

usage() {
  cat <<'EOF'
Usage: bash scripts/ops/git_setup_push_auth.sh [--remote origin] [--dry-run 0|1]

Goal:
- Make `git push` reliable for local SSOT loops (autopilot_local.sh pushes fixes).

Behavior:
- If origin is HTTPS + gh authenticated: runs `gh auth setup-git` (credential helper).
- If origin is SSH: prints a note (assumes ssh-agent/keychain is configured).
- Optional: performs a `git push --dry-run` to validate auth (no changes pushed).

Security:
- Token values are never printed.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --remote) REMOTE="$2"; shift 2;;
    --dry-run) DRY_RUN="$2"; shift 2;;
    -h|--help) usage; exit 0;;
    *) echo "Unknown arg: $1"; usage; exit 2;;
  esac
done

if ! command -v git >/dev/null 2>&1; then
  echo "[git-setup-push-auth] git not found"
  exit 2
fi
if ! command -v gh >/dev/null 2>&1; then
  echo "[git-setup-push-auth] gh CLI not found (skip)."
  exit 0
fi

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "${ROOT}" ]]; then
  echo "[git-setup-push-auth] not a git repo"
  exit 2
fi
cd "${ROOT}"

ORIGIN_URL="$(git remote get-url "${REMOTE}" 2>/dev/null || true)"
if [[ -z "${ORIGIN_URL}" ]]; then
  echo "[git-setup-push-auth] remote not found: ${REMOTE}"
  exit 2
fi

if ! gh auth status -h github.com >/dev/null 2>&1; then
  echo "[git-setup-push-auth] gh not authenticated; run: bash scripts/ops/gh_auth_with_token.sh"
  exit 1
fi

if [[ "${ORIGIN_URL}" =~ ^git@github\.com: ]] || [[ "${ORIGIN_URL}" =~ ^ssh://git@github\.com/ ]]; then
  echo "[git-setup-push-auth] origin is SSH; ensure ssh-agent has a loaded key (recommended: Keychain)."
elif [[ "${ORIGIN_URL}" =~ ^https://github\.com/ ]]; then
  echo "[git-setup-push-auth] origin is HTTPS; configuring gh credential helper..."
  gh auth setup-git >/dev/null 2>&1 || true
else
  echo "[git-setup-push-auth] origin is not GitHub SSH/HTTPS; skipping setup (url=${ORIGIN_URL})"
fi

if [[ "${DRY_RUN}" == "1" ]]; then
  BR="$(git branch --show-current 2>/dev/null || true)"
  if [[ -n "${BR}" && "${BR}" != "main" ]]; then
    # Dry-run validates credentials without pushing.
    git push --dry-run "${REMOTE}" "HEAD:refs/heads/${BR}" >/dev/null 2>&1 || {
      echo "[git-setup-push-auth] dry-run push failed (check auth/remote)."
      exit 3
    }
    echo "[git-setup-push-auth] dry-run push OK (branch=${BR})"
  else
    echo "[git-setup-push-auth] dry-run skipped (branch not detected or main)."
  fi
fi

echo "[git-setup-push-auth] OK"
