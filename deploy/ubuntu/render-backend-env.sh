#!/usr/bin/env bash
set -euo pipefail

DEPLOY_ENV="${DEPLOY_ENV:-stage}"
VAULT_ADDR="${VAULT_ADDR:?VAULT_ADDR required}"
VAULT_TOKEN="${VAULT_TOKEN:?VAULT_TOKEN required}"
VAULT_KV_MOUNT="${VAULT_KV_MOUNT:-secret}"
BACKEND_CONFIG_PATH_TEMPLATE="${BACKEND_CONFIG_PATH_TEMPLATE:-<env>/backend-deploy/config}"
OUTPUT_FILE="${OUTPUT_FILE:-/home/halil/platform/env/backend.env}"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "[error] required command not found: $1" >&2
    exit 1
  fi
}

resolve_path() {
  local raw="$1"
  local resolved

  resolved="${raw//<env>/${DEPLOY_ENV}}"
  resolved="${resolved#/}"
  printf '%s' "${resolved}"
}

kv_get_json() {
  local path="$1"
  local mount="$2"

  curl -sSf \
    -H "X-Vault-Token: ${VAULT_TOKEN}" \
    "${VAULT_ADDR%/}/v1/${mount}/data/${path}"
}

json_get() {
  local key="$1"
  python3 -c 'import json, sys; payload = json.load(sys.stdin); print(payload.get("data", {}).get("data", {}).get(sys.argv[1], ""), end="")' "$key"
}

write_kv() {
  local file="$1"
  local key="$2"
  local value="$3"

  if [[ "${value}" == *$'\n'* ]]; then
    echo "[error] ${key} contains a newline; backend.env only supports single-line values." >&2
    exit 1
  fi

  printf '%s=%s\n' "${key}" "${value}" >> "${file}"
}

main() {
  require_cmd curl
  require_cmd python3

  local mount
  local config_path
  local payload
  local tmp_file
  local dir
  local missing=()
  local required_keys=(
    GIT_REMOTE_URL
    REPO_BRANCH
    GHCR_OWNER
    VAULT_URI
    VAULT_TOKEN
    KEYCLOAK_ISSUER_URI
    KEYCLOAK_JWKS_URI
    AUTH_VERIFICATION_BASE_URL
    AUTH_RESET_BASE_URL
    SERVICE_CLIENT_USER_SERVICE_SECRET
    PERMISSION_SERVICE_INTERNAL_API_KEY
    POSTGRES_USER
    POSTGRES_PASSWORD
    OPENFGA_STORE_ID
    OPENFGA_MODEL_ID
    CORE_DATA_DB_URL
    CORE_DATA_DB_USERNAME
    CORE_DATA_DB_PASSWORD
  )
  local ordered_keys=(
    GIT_REMOTE_URL
    REPO_BRANCH
    GHCR_OWNER
    GHCR_USERNAME
    GHCR_TOKEN
    IMAGE_TAG
    COMPOSE_PROJECT_NAME
    TZ
    COMPOSE_PROFILES
    VAULT_URI
    VAULT_SCHEME
    VAULT_TOKEN
    VAULT_FAIL_FAST
    KEYCLOAK_ISSUER_URI
    KEYCLOAK_JWKS_URI
    WEB_ORIGIN
    AUTH_VERIFICATION_BASE_URL
    AUTH_RESET_BASE_URL
    SERVICE_CLIENT_USER_SERVICE_SECRET
    PERMISSION_SERVICE_INTERNAL_API_KEY
    SECURITY_AUTH_ALLOWED_CLIENT_IDS
    POSTGRES_USER
    POSTGRES_PASSWORD
    POSTGRES_DB
    AUTH_DB_SCHEMA
    USER_DB_SCHEMA
    PERMISSION_DB_SCHEMA
    VARIANT_DB_SCHEMA
    CORE_DATA_DB_SCHEMA
    OPENFGA_STORE_ID
    OPENFGA_MODEL_ID
    OPENFGA_LOG_LEVEL
    CORE_DATA_DB_URL
    CORE_DATA_DB_USERNAME
    CORE_DATA_DB_PASSWORD
    REPORT_MSSQL_HOST
    REPORT_MSSQL_PORT
    REPORT_MSSQL_DB
    REPORT_MSSQL_USERNAME
    REPORT_MSSQL_PASSWORD
    REPORT_PG_HOST
    REPORT_PG_PORT
    REPORT_PG_DB
    REPORT_PG_USERNAME
    REPORT_PG_PASSWORD
    SCHEMA_MSSQL_HOST
    SCHEMA_MSSQL_PORT
    SCHEMA_MSSQL_DB
    SCHEMA_MSSQL_USERNAME
    SCHEMA_MSSQL_PASSWORD
    SCHEMA_DEFAULT_SCHEMA
  )
  local key
  local value

  mount="${VAULT_KV_MOUNT#/}"
  mount="${mount%/}"
  config_path="$(resolve_path "${BACKEND_CONFIG_PATH_TEMPLATE}")"

  payload="$(kv_get_json "${config_path}" "${mount}")"

  for key in "${required_keys[@]}"; do
    value="$(printf '%s' "${payload}" | json_get "${key}")"
    if [[ -z "${value}" ]]; then
      missing+=("${key}")
    fi
  done

  if [[ "${#missing[@]}" -gt 0 ]]; then
    echo "[error] missing required backend deploy keys at ${mount}/${config_path}: ${missing[*]}" >&2
    exit 1
  fi

  dir="$(dirname "${OUTPUT_FILE}")"
  mkdir -p "${dir}"
  chmod 700 "${dir}" 2>/dev/null || true

  tmp_file="$(mktemp "${dir}/backend.env.XXXXXX")"
  chmod 600 "${tmp_file}"
  printf '# rendered from Vault path: %s/%s\n' "${mount}" "${config_path}" > "${tmp_file}"
  printf '# generated_at=%s\n' "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> "${tmp_file}"

  for key in "${ordered_keys[@]}"; do
    value="$(printf '%s' "${payload}" | json_get "${key}")"
    if [[ -n "${value}" ]]; then
      write_kv "${tmp_file}" "${key}" "${value}"
    fi
  done

  mv "${tmp_file}" "${OUTPUT_FILE}"
  chmod 600 "${OUTPUT_FILE}"

  echo "[render] wrote ${OUTPUT_FILE} from ${mount}/${config_path}"
}

main "$@"
