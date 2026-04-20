#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
DEPLOY_ENV="${DEPLOY_ENV:-stage}"
VAULT_ADDR="${VAULT_ADDR:?VAULT_ADDR required}"
VAULT_APPROLE_MOUNT="${VAULT_APPROLE_MOUNT:-auth/approle}"
VAULT_APPROLE_ROLE_NAME="${VAULT_APPROLE_ROLE_NAME:-backend-deploy-${DEPLOY_ENV}}"
VAULT_APPROLE_ROLE_ID_FILE="${VAULT_APPROLE_ROLE_ID_FILE:-/home/halil/platform/state/vault/approle/${VAULT_APPROLE_ROLE_NAME}.role-id}"
VAULT_APPROLE_SECRET_ID_FILE="${VAULT_APPROLE_SECRET_ID_FILE:-/home/halil/platform/state/vault/approle/${VAULT_APPROLE_ROLE_NAME}.secret-id}"
VAULT_TOKEN_REVOKE_ON_EXIT="${VAULT_TOKEN_REVOKE_ON_EXIT:-true}"
APPROLE_CLIENT_TOKEN=""
APPROLE_REVOKE_FLAG=""

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "[error] required command not found: $1" >&2
    exit 1
  fi
}

read_trimmed_file() {
  local path="$1"

  if [[ ! -f "${path}" ]]; then
    echo "[error] file not found: ${path}" >&2
    exit 1
  fi

  python3 - "$path" <<'PY'
from pathlib import Path
import sys

print(Path(sys.argv[1]).read_text(encoding="utf-8").strip(), end="")
PY
}

json_get() {
  local key="$1"

  python3 -c 'import json, sys; payload = json.load(sys.stdin); print(payload.get("auth", {}).get(sys.argv[1], "") or "", end="")' "${key}"
}

revoke_token() {
  if [[ "${APPROLE_REVOKE_FLAG}" != "true" && "${APPROLE_REVOKE_FLAG}" != "1" && "${APPROLE_REVOKE_FLAG}" != "yes" ]]; then
    return 0
  fi

  if [[ -z "${APPROLE_CLIENT_TOKEN}" ]]; then
    return 0
  fi

  curl -sS -o /dev/null \
    -H "X-Vault-Token: ${APPROLE_CLIENT_TOKEN}" \
    -X POST "${VAULT_ADDR%/}/v1/auth/token/revoke-self" || true
}

preflight_state_files() {
  # 2026-04-18 Codex Thread 5 finding #4: state file contract hardening.
  # Previously state file missing or TTL-expired secret-id produced a late,
  # opaque failure (curl exit 22 on AppRole login, no hint that files were
  # stale or wrong path). This preflight checks:
  #
  # A. File existence (explicit error, not python3 traceback)
  # B. File non-empty
  # C. File age — warn if older than 25 days (secret-id TTL default 768h=32d)
  #    so operator has time to re-seed before login fails
  #
  # No auto-rotate here — rotation requires Vault root/service token which
  # this wrapper doesn't have. Operator must run seed-stage-approle.sh or
  # materialize-backend-deploy-approle.sh. But we make the signal early and
  # loud so they can act before the canary/deploy window.
  local role_file="$1" secret_file="$2"
  local now_ts file_ts age_days warn_threshold=25 fail=0

  for f in "$role_file" "$secret_file"; do
    if [[ ! -f "$f" ]]; then
      echo "[error] AppRole state file missing: $f" >&2
      echo "  → Operator: run seed-stage-approle.sh or materialize-backend-deploy-approle.sh" >&2
      fail=1
    elif [[ ! -s "$f" ]]; then
      echo "[error] AppRole state file empty: $f" >&2
      fail=1
    fi
  done

  if (( fail > 0 )); then
    exit 1
  fi

  # Age check (warn only — don't block deploy)
  now_ts="$(date +%s)"
  for f in "$role_file" "$secret_file"; do
    file_ts="$(stat -c %Y "$f" 2>/dev/null || stat -f %m "$f" 2>/dev/null || echo "$now_ts")"
    age_days=$(( (now_ts - file_ts) / 86400 ))
    if (( age_days >= warn_threshold )); then
      echo "[warn] AppRole state file aged ${age_days}d (>${warn_threshold}d threshold): $f" >&2
      echo "  → Secret-id TTL default 768h (32d); re-seed recommended before expiry." >&2
    fi
  done
}

main() {
  require_cmd curl
  require_cmd python3

  local role_id
  local secret_id
  local mount
  local login_url
  local payload
  local login_response

  preflight_state_files "${VAULT_APPROLE_ROLE_ID_FILE}" "${VAULT_APPROLE_SECRET_ID_FILE}"

  role_id="$(read_trimmed_file "${VAULT_APPROLE_ROLE_ID_FILE}")"
  secret_id="$(read_trimmed_file "${VAULT_APPROLE_SECRET_ID_FILE}")"
  mount="${VAULT_APPROLE_MOUNT#/}"
  mount="${mount%/}"
  login_url="${VAULT_ADDR%/}/v1/${mount}/login"

  payload="$(python3 - <<'PY' "$role_id" "$secret_id"
import json
import sys

print(json.dumps({"role_id": sys.argv[1], "secret_id": sys.argv[2]}))
PY
)"

  login_response="$(curl -sSf \
    -H 'Content-Type: application/json' \
    -X POST "${login_url}" \
    -d "${payload}" 2>&1)" || {
    curl_exit=$?
    echo "[error] AppRole login failed (curl exit=${curl_exit})." >&2
    echo "  → Verify state files match current Vault AppRole role/secret-id." >&2
    echo "  → role_id prefix: ${role_id:0:12}..." >&2
    echo "  → Re-seed: bash backend/scripts/vault/seed-stage-approle.sh (requires VAULT_TOKEN root)" >&2
    exit 1
  }

  APPROLE_CLIENT_TOKEN="$(printf '%s' "${login_response}" | json_get client_token)"
  if [[ -z "${APPROLE_CLIENT_TOKEN}" ]]; then
    echo "[error] approle login returned empty client_token." >&2
    echo "  → Response body snippet: ${login_response:0:200}" >&2
    exit 1
  fi

  APPROLE_REVOKE_FLAG="$(printf '%s' "${VAULT_TOKEN_REVOKE_ON_EXIT}" | tr '[:upper:]' '[:lower:]')"
  trap revoke_token EXIT

  DEPLOY_ENV="${DEPLOY_ENV}" \
  VAULT_ADDR="${VAULT_ADDR}" \
  VAULT_TOKEN="${APPROLE_CLIENT_TOKEN}" \
  OUTPUT_FILE="${OUTPUT_FILE:-/home/halil/platform/env/backend.env}" \
  AUDIT_BACKEND_URI="${AUDIT_BACKEND_URI:-}" \
  STAGING_SWEEPER_CLIENT_SECRET="${STAGING_SWEEPER_CLIENT_SECRET:-}" \
  "${SCRIPT_DIR}/render-backend-env.sh"
}

main "$@"
