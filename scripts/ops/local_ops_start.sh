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

docker compose -f "$COMPOSE_FILE" up -d vault vault-unseal

export VAULT_ADDR="${VAULT_ADDR:-http://127.0.0.1:8200}"

# Vault token
# - Prefer existing VAULT_TOKEN env (worktree-friendly).
# - Otherwise read from a local token file (dev init output).
if [ -z "${VAULT_TOKEN:-}" ]; then
  TOKEN_FILE="$(find . -maxdepth 6 -type f -name "vault-root-token" | head -n 1 || true)"
  if [ -z "${TOKEN_FILE:-}" ]; then
    echo "[error] VAULT_TOKEN not set and vault-root-token file not found. Export VAULT_TOKEN or run dev init once (backend/.vault-dev/dev_init.sh)." >&2
    exit 3
  fi
  export VAULT_TOKEN="$(cat "$TOKEN_FILE")"
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

# Start tracker watch (unbuffered)
nohup python3 -u scripts/pr_tracker_tsv.py sync --watch 30 \
  > .autopilot-tmp/pids/tracker.log 2>&1 & echo $! > .autopilot-tmp/pids/tracker.pid

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
