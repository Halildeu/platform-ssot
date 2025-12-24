#!/usr/bin/env bash
set -euo pipefail

# Local Ops Start (Vault + Tracker + Orchestrator)
#
# - Starts local dev Vault (vault + vault-unseal)
# - Reads GH_LOCAL_AUTOPILOT_TOKEN from Vault and exports GH_TOKEN (value never printed)
# - Runs tracker + orchestrator in background (PID files + logs under .autopilot-tmp/)
#
# Requirements:
# - docker + docker compose
# - vault CLI
# - gh CLI

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

COMPOSE_FILE="$(scripts/ops/find_compose_with_vault.sh)"
echo "[ops] compose_file=$COMPOSE_FILE"

COMPOSE_DIR="$(cd "$(dirname "$COMPOSE_FILE")" && pwd)"

# Ensure Vault dev artifacts exist for the vault-unseal sidecar.
# Compose mounts (relative to COMPOSE_DIR):
#   ./ .vault-dev -> /vault-dev (ro)
# Required files (one of):
#   - vault-unseal-key
#   - vault-init.json
#
# Worktree note:
# - backend/.vault-dev is gitignored and may not exist in secondary worktrees.
# - If missing, we try to link it from another local worktree (searching for backend/.vault-dev).
VAULT_DEV_MOUNT_DIR="${COMPOSE_DIR}/.vault-dev"

ensure_vault_dev_artifacts() {
  local has_unseal_key="0"
  local has_init="0"
  local has_root_token="0"

  [ -f "${VAULT_DEV_MOUNT_DIR}/vault-unseal-key" ] && has_unseal_key="1"
  [ -f "${VAULT_DEV_MOUNT_DIR}/vault-init.json" ] && has_init="1"
  [ -f "${VAULT_DEV_MOUNT_DIR}/vault-root-token" ] && has_root_token="1"

  # Fast path: everything is already available in this worktree.
  if [ "${has_unseal_key}" = "1" ] && [ "${has_root_token}" = "1" ]; then
    return 0
  fi

  local source_dir=""
  if [ -n "${VAULT_DEV_SOURCE_DIR:-}" ]; then
    source_dir="${VAULT_DEV_SOURCE_DIR}"
  elif [ -n "${VAULT_DEV_DIR:-}" ]; then
    source_dir="${VAULT_DEV_DIR}"
  else
    local search_root
    search_root="$(cd "${REPO_ROOT}/.." && pwd)"
    local found
    # Prefer a directory that has the plain-text unseal key.
    found="$(find "${search_root}" -maxdepth 6 -type f \
      -path "*/backend/.vault-dev/vault-unseal-key" 2>/dev/null | head -n 1 || true)"
    if [ -z "${found:-}" ]; then
      found="$(find "${search_root}" -maxdepth 6 -type f \
        -path "*/backend/.vault-dev/vault-init.json" 2>/dev/null | head -n 1 || true)"
    fi
    if [ -n "${found:-}" ]; then
      source_dir="$(dirname "${found}")"
    fi
  fi

  if [ -n "${source_dir:-}" ]; then
    if [ -f "${source_dir}/vault-unseal-key" ] || [ -f "${source_dir}/vault-init.json" ]; then
      if [ ! -e "${VAULT_DEV_MOUNT_DIR}" ]; then
        ln -s "${source_dir}" "${VAULT_DEV_MOUNT_DIR}"
        echo "[ops] linked vault dev dir: ${VAULT_DEV_MOUNT_DIR} -> ${source_dir}"
      elif [ -d "${VAULT_DEV_MOUNT_DIR}" ]; then
        # If directory exists in this worktree, copy the minimum required files.
        for f in vault-unseal-key vault-init.json vault-root-token; do
          if [ -f "${source_dir}/${f}" ] && [ ! -f "${VAULT_DEV_MOUNT_DIR}/${f}" ]; then
            cp "${source_dir}/${f}" "${VAULT_DEV_MOUNT_DIR}/${f}"
          fi
        done
        echo "[ops] ensured vault dev files in: ${VAULT_DEV_MOUNT_DIR}"
      fi
    fi
  fi

  if [ ! -f "${VAULT_DEV_MOUNT_DIR}/vault-unseal-key" ] && [ ! -f "${VAULT_DEV_MOUNT_DIR}/vault-init.json" ]; then
    echo "[error] Vault unseal artifacts not found at ${VAULT_DEV_MOUNT_DIR} (expected vault-unseal-key or vault-init.json)." >&2
    echo "[error] Run: bash backend/scripts/vault/dev_init.sh (or set VAULT_DEV_SOURCE_DIR to an existing backend/.vault-dev directory)." >&2
    exit 7
  fi
}

ensure_vault_dev_artifacts

docker compose -f "$COMPOSE_FILE" up -d vault vault-unseal

export VAULT_ADDR="${VAULT_ADDR:-http://127.0.0.1:8200}"

# Wait for Vault to be ready & unsealed (vault-unseal sidecar may need a few seconds)
wait_for_vault_unsealed() {
  local max_attempts=30
  local sleep_s=1
  local i
  for ((i = 1; i <= max_attempts; i++)); do
    local status
    status="$(vault status 2>/dev/null || true)"
    if printf '%s\n' "$status" | grep -qiE '^Sealed.*false'; then
      return 0
    fi
    sleep "$sleep_s"
  done
  return 1
}

if ! wait_for_vault_unsealed; then
  echo "[error] Vault is still sealed or not ready (VAULT_ADDR=${VAULT_ADDR}). Check vault/vault-unseal container logs." >&2
  exit 6
fi

# Vault token
# - Prefer existing VAULT_TOKEN env (worktree-friendly).
# - Otherwise read from a local token file (dev init output).
if [ -z "${VAULT_TOKEN:-}" ]; then
  TOKEN_FILE="${VAULT_DEV_MOUNT_DIR}/vault-root-token"
  if [ ! -f "${TOKEN_FILE}" ]; then
    # Fallback: derive root token from vault-init.json (preferred over broad find).
    if [ -f "${VAULT_DEV_MOUNT_DIR}/vault-init.json" ]; then
      export VAULT_TOKEN="$(python3 - <<'PY'
import json, pathlib
p=pathlib.Path("backend/.vault-dev/vault-init.json")
d=json.loads(p.read_text(encoding="utf-8"))
print(d.get("root_token",""))
PY
)"
    else
      TOKEN_FILE="$(find . -maxdepth 6 -type f -name "vault-root-token" | head -n 1 || true)"
    fi
  fi
  if [ -z "${TOKEN_FILE:-}" ]; then
    echo "[error] VAULT_TOKEN not set and vault-root-token file not found. Export VAULT_TOKEN or run dev init once (backend/scripts/vault/dev_init.sh)." >&2
    exit 3
  fi
  if [ -z "${VAULT_TOKEN:-}" ]; then
    export VAULT_TOKEN="$(cat "$TOKEN_FILE")"
  fi
fi

# GH token from Vault (value not printed)
export GH_TOKEN="$(vault kv get -field=GH_LOCAL_AUTOPILOT_TOKEN secret/stage/ops/github)"
if [ -z "${GH_TOKEN:-}" ]; then
  echo "[error] GH_TOKEN is empty. Ensure Vault path secret/stage/ops/github has field GH_LOCAL_AUTOPILOT_TOKEN." >&2
  exit 4
fi

mkdir -p .autopilot-tmp/pids .autopilot-tmp/locks .autopilot-tmp/queue .autopilot-tmp/pr-tracker

# Stop old pids if any (best-effort)
for name in tracker orchestrator; do
  if [ -f ".autopilot-tmp/pids/$name.pid" ]; then
    kill "$(cat ".autopilot-tmp/pids/$name.pid")" 2>/dev/null || true
    rm -f ".autopilot-tmp/pids/$name.pid"
  fi
done

# Determine owner/repo from origin remote URL (fallback: env GITHUB_REPOSITORY)
REPO="${GITHUB_REPOSITORY:-}"
if [ -z "${REPO:-}" ]; then
  ORIGIN_URL="$(git remote get-url origin 2>/dev/null || true)"
  if [[ "${ORIGIN_URL}" =~ github\.com[:/]([^/]+)/([^/]+)(\.git)?$ ]]; then
    REPO="${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
    REPO="${REPO%.git}"
  fi
fi
if [ -z "${REPO:-}" ]; then
  echo "[error] Cannot detect repo (owner/repo). Set GITHUB_REPOSITORY or configure origin remote." >&2
  exit 5
fi

# Start tracker watch (unbuffered) – explicit repo (no origin-parse dependency)
nohup python3 -u scripts/pr_tracker_tsv.py --repo "${REPO}" sync --watch 30 \
  > .autopilot-tmp/pids/tracker.log 2>&1 & echo $! > .autopilot-tmp/pids/tracker.pid

AUTOPILOT_FIX_CMD="${AUTOPILOT_FIX_CMD:-bash scripts/codex_fix_runner.sh}"

nohup python3 -u scripts/autopilot_orchestrator.py \
  --repo "${REPO}" \
  --scan-tracker \
  --tracker-path .autopilot-tmp/pr-tracker/PR-TRACKER.tsv \
  --scan-interval 30 \
  --max-attempts 5 \
  --semantic \
  --fix-cmd "${AUTOPILOT_FIX_CMD}" \
  > .autopilot-tmp/pids/orchestrator.log 2>&1 & echo $! > .autopilot-tmp/pids/orchestrator.pid

echo "[ops] tracker pid=$(cat .autopilot-tmp/pids/tracker.pid)"
echo "[ops] orchestrator pid=$(cat .autopilot-tmp/pids/orchestrator.pid)"

python3 scripts/pr_tracker_tsv.py report --out .autopilot-tmp/pr-tracker/STATUS.md >/dev/null 2>&1 || true
echo "[ops] status written: .autopilot-tmp/pr-tracker/STATUS.md"
