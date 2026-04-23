#!/usr/bin/env bash
set -euo pipefail
# errtrace: propagate ERR trap into functions, subshells, command substitutions.
# Without this, a fail inside e.g. `foo=$(docker compose ...)` bypasses our trap.
# Prior run #24400697471 hit this: trap installed, no output, silent exit 1.
set -o errtrace

# ERR trap: report the exact line + last command that failed.
# Prior deploys fell through with a bare `exit 1` at job level, leaving the CI
# log ambiguous (api-gateway container logs buffered over the fail signal).
# Example output on fail:
#   [deploy-backend.sh] FAILED at line 342: docker compose pull (exit=1)
# GitHub Actions parses `::error` on STDOUT (not stderr) for annotations.
# Set DEPLOY_TRACE=1 to additionally enable `set -x` trace mode.
on_deploy_err() {
  local exit_code=$?
  local line_no=${1:-?}
  local last_cmd=${BASH_COMMAND:-unknown}
  # STDOUT for ::error annotation pickup; mirror to stderr for local runs.
  echo "::error title=deploy-backend::[deploy-backend.sh] FAILED at line ${line_no}: ${last_cmd} (exit=${exit_code})"
  echo "[deploy-backend.sh] FAILED at line ${line_no}: ${last_cmd} (exit=${exit_code})" >&2
  echo "[deploy-backend.sh] traceback: BASH_LINENO=(${BASH_LINENO[*]:-}) FUNCNAME=(${FUNCNAME[*]:-main})" >&2
  exit "${exit_code}"
}
trap 'on_deploy_err ${LINENO}' ERR

if [[ "${DEPLOY_TRACE:-0}" == "1" ]]; then
  PS4='+[${BASH_SOURCE##*/}:${LINENO}] '
  set -x
fi

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
REPO_DIR="${REPO_DIR:-/home/halil/platform/repo}"
BACKEND_DIR="${BACKEND_DIR:-${REPO_DIR}/backend}"
ENV_FILE="${ENV_FILE:-/home/halil/platform/env/backend.env}"
REPO_BRANCH="${REPO_BRANCH:-main}"
PINNED_REPO_BRANCH="${REPO_BRANCH}"
GIT_REMOTE_URL="${GIT_REMOTE_URL:-}"
COMPOSE_PROFILES="${COMPOSE_PROFILES:-}"
STATE_DIR="${STATE_DIR:-/home/halil/platform/state}"
CURRENT_TAG_FILE="${CURRENT_TAG_FILE:-${STATE_DIR}/backend.current-image-tag}"
PREVIOUS_TAG_FILE="${PREVIOUS_TAG_FILE:-${STATE_DIR}/backend.previous-image-tag}"
TARGET_IMAGE_TAG="${TARGET_IMAGE_TAG:-}"
BUILD_LOCAL="${BUILD_LOCAL:-false}"
BUILD_COMPOSE_FILE="${BUILD_COMPOSE_FILE:-${BACKEND_DIR}/docker-compose.yml}"
DOCKER_PULL_POLICY="${DOCKER_PULL_POLICY:-always}"
RENDER_ENV_BEFORE_DEPLOY="${RENDER_ENV_BEFORE_DEPLOY:-false}"
DEPLOY_ENV="${DEPLOY_ENV:-stage}"

# COMPOSE_FILE default is DEPLOY_ENV-aware.
# Memory rule (feedback_infra_stability.md): "Staging'de ASLA prod compose kullanma
# — GHCR image'ları yok, pull fail eder". Prior default (deploy/docker-compose.prod.yml)
# violated this: on staging deploys, compose interpolation failed because prod compose
# requires KC_DB_PASSWORD and other registry-oriented variables that staging env does
# not provide. Confirmed in run #24400697471 (exit 1 without annotation).
#
# Enforcement: doctor-infra.sh Section I (I1-I5) already enforces this split at static
# check time — script default was the missing runtime counterpart.
if [[ -z "${COMPOSE_FILE:-}" ]]; then
  case "${DEPLOY_ENV}" in
    prod|production)
      COMPOSE_FILE="${BACKEND_DIR}/../deploy/docker-compose.prod.yml"
      ;;
    stage|staging|dev|local|*)
      COMPOSE_FILE="${BACKEND_DIR}/docker-compose.yml"
      ;;
  esac
fi
VAULT_ADDR="${VAULT_ADDR:-}"
VAULT_APPROLE_ROLE_NAME="${VAULT_APPROLE_ROLE_NAME:-}"
VAULT_APPROLE_ROLE_ID_FILE="${VAULT_APPROLE_ROLE_ID_FILE:-}"
VAULT_APPROLE_SECRET_ID_FILE="${VAULT_APPROLE_SECRET_ID_FILE:-}"
VAULT_TOKEN_REVOKE_ON_EXIT="${VAULT_TOKEN_REVOKE_ON_EXIT:-true}"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "[error] required command not found: $1" >&2
    exit 1
  fi
}

print_compose_diagnostics() {
  local compose_flags="$1"
  local services=(
    discovery-server
    postgres-db
    openfga-migrate
    openfga
    permission-service
    auth-service
    user-service
    variant-service
    core-data-service
    api-gateway
  )

  echo "[diag] docker compose ps --all" >&2
  # shellcheck disable=SC2086
  docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" ${compose_flags} ps --all || true

  for service in "${services[@]}"; do
    echo "[diag] docker compose logs --tail=200 ${service}" >&2
    # shellcheck disable=SC2086
    docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" ${compose_flags} logs --no-color --tail=200 "${service}" || true
  done
}

load_env_file() {
  if [[ ! -f "${ENV_FILE}" ]]; then
    echo "[error] env file not found: ${ENV_FILE}" >&2
    exit 1
  fi

  set -a
  # shellcheck disable=SC1090
  . "${ENV_FILE}"
  set +a
}

read_env_value() {
  local key="$1"
  awk -F= -v key="$key" '$1 == key {print substr($0, index($0, "=") + 1)}' "${ENV_FILE}" | tail -n 1
}

upsert_env_value() {
  local key="$1"
  local value="$2"
  local tmp_file

  tmp_file="$(mktemp)"
  awk -v key="$key" -v value="$value" '
    BEGIN { updated = 0 }
    $0 ~ ("^" key "=") {
      if (!updated) {
        print key "=" value
        updated = 1
      }
      next
    }
    { print }
    END {
      if (!updated) {
        print key "=" value
      }
    }
  ' "${ENV_FILE}" > "${tmp_file}"
  mv "${tmp_file}" "${ENV_FILE}"
}

maybe_render_env() {
  local render_flag
  render_flag="$(printf '%s' "${RENDER_ENV_BEFORE_DEPLOY}" | tr '[:upper:]' '[:lower:]')"
  case "${render_flag}" in
    true|1|yes)
      ;;
    *)
      return 0
      ;;
  esac

  if [[ -z "${VAULT_ADDR}" ]]; then
    echo "[error] VAULT_ADDR required when RENDER_ENV_BEFORE_DEPLOY=true." >&2
    exit 1
  fi

  if [[ -n "${VAULT_TOKEN:-}" ]]; then
    DEPLOY_ENV="${DEPLOY_ENV}" \
    VAULT_ADDR="${VAULT_ADDR}" \
    VAULT_TOKEN="${VAULT_TOKEN}" \
    OUTPUT_FILE="${ENV_FILE}" \
    AUDIT_BACKEND_URI="${AUDIT_BACKEND_URI:-}" \
    STAGING_SWEEPER_CLIENT_SECRET="${STAGING_SWEEPER_CLIENT_SECRET:-}" \
    "${SCRIPT_DIR}/render-backend-env.sh"
    return 0
  fi

  DEPLOY_ENV="${DEPLOY_ENV}" \
  VAULT_ADDR="${VAULT_ADDR}" \
  OUTPUT_FILE="${ENV_FILE}" \
  VAULT_APPROLE_ROLE_NAME="${VAULT_APPROLE_ROLE_NAME}" \
  VAULT_APPROLE_ROLE_ID_FILE="${VAULT_APPROLE_ROLE_ID_FILE}" \
  VAULT_APPROLE_SECRET_ID_FILE="${VAULT_APPROLE_SECRET_ID_FILE}" \
  VAULT_TOKEN_REVOKE_ON_EXIT="${VAULT_TOKEN_REVOKE_ON_EXIT}" \
  AUDIT_BACKEND_URI="${AUDIT_BACKEND_URI:-}" \
  STAGING_SWEEPER_CLIENT_SECRET="${STAGING_SWEEPER_CLIENT_SECRET:-}" \
  "${SCRIPT_DIR}/render-backend-env-approle.sh"
}

bootstrap_vault_credentials_from_env_file() {
  local file_vault_token=""
  local file_vault_addr=""
  local render_flag

  if [[ ! -f "${ENV_FILE}" ]]; then
    return 0
  fi

  # STORY-0319 PR #3c — AppRole precedence guard.
  # RENDER_ENV_BEFORE_DEPLOY=true iken canonical env'den VAULT_TOKEN
  # bootstrap edilmez — render-backend-env.sh AppRole path'ini kullansın.
  # Aksi halde eski env dosyasındaki stale token yeni render'ı token-path'e
  # düşürür ve AppRole-first sözleşmesi fiilen gerçekleşmez (Codex turn N
  # bulgusu).
  render_flag="$(printf '%s' "${RENDER_ENV_BEFORE_DEPLOY:-false}" | tr '[:upper:]' '[:lower:]')"

  if [[ "${render_flag}" != "true" && "${render_flag}" != "1" && "${render_flag}" != "yes" ]]; then
    if [[ -z "${VAULT_TOKEN:-}" ]]; then
      file_vault_token="$(read_env_value VAULT_TOKEN)"
      if [[ -n "${file_vault_token}" ]]; then
        VAULT_TOKEN="${file_vault_token}"
        export VAULT_TOKEN
        echo "[deploy] bootstrapped VAULT_TOKEN from existing env file (render disabled)."
      fi
    fi
  else
    echo "[deploy] RENDER_ENV_BEFORE_DEPLOY=true → skipping VAULT_TOKEN bootstrap (AppRole precedence)."
  fi

  if [[ -z "${VAULT_ADDR:-}" ]]; then
    file_vault_addr="$(read_env_value VAULT_URI)"
    if [[ -n "${file_vault_addr}" ]]; then
      VAULT_ADDR="${file_vault_addr}"
      export VAULT_ADDR
      echo "[deploy] bootstrapped VAULT_ADDR from existing env file."
    fi
  fi
}

sync_repo() {
  if [[ -d "${REPO_DIR}/.git" ]]; then
    git -C "${REPO_DIR}" fetch origin "${REPO_BRANCH}"
    if git -C "${REPO_DIR}" show-ref --verify --quiet "refs/heads/${REPO_BRANCH}"; then
      git -C "${REPO_DIR}" checkout "${REPO_BRANCH}"
      git -C "${REPO_DIR}" merge --ff-only FETCH_HEAD
    else
      git -C "${REPO_DIR}" checkout -b "${REPO_BRANCH}" FETCH_HEAD
    fi
    return 0
  fi

  if [[ -z "${GIT_REMOTE_URL}" ]]; then
    echo "[error] repo missing at ${REPO_DIR} and GIT_REMOTE_URL is empty." >&2
    exit 1
  fi

  mkdir -p "$(dirname "${REPO_DIR}")"
  git clone --branch "${REPO_BRANCH}" --depth 1 "${GIT_REMOTE_URL}" "${REPO_DIR}"
}

pre_sync_existing_repo() {
  if [[ -d "${REPO_DIR}/.git" ]]; then
    sync_repo
  fi
}

compose_cmd() {
  local args=()
  local profile

  if [[ -n "${COMPOSE_PROFILES}" ]]; then
    IFS=',' read -r -a args <<< "${COMPOSE_PROFILES}"
    for profile in "${args[@]}"; do
      profile="$(echo "${profile}" | xargs)"
      [[ -n "${profile}" ]] || continue
      printf -- "--profile %s " "${profile}"
    done
  fi
}

compose_run() {
  # Make the active image tag authoritative for compose interpolation.
  IMAGE_TAG="${IMAGE_TAG}" docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" "$@"
}

container_name_for() {
  printf 'platform-%s-1' "$1"
}

wait_for_service_state() {
  local service="$1"
  local expected="$2"
  local timeout_seconds="${3:-90}"
  local container_name
  local deadline
  local state=""
  # Terminal-state tolerance window: some services (notably vault with auto-unseal)
  # briefly report `unhealthy` between restart and unseal. Requiring 3 consecutive
  # terminal-state polls before fail lets auto-recovery complete. Fixes the
  # 2026-04-14 race where `wait_for_service_state vault` failed on first poll
  # despite vault settling into `healthy` a few seconds later.
  # See: .claude/plans/session-handoff-20260414-deploy.md Section 2.3
  local terminal_streak=0
  local terminal_streak_threshold=3

  container_name="$(container_name_for "${service}")"
  deadline=$((SECONDS + timeout_seconds))

  while (( SECONDS < deadline )); do
    state="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "${container_name}" 2>/dev/null || true)"

    if [[ "${state}" == "${expected}" ]]; then
      echo "[wait] ${service} -> ${state}"
      return 0
    fi

    case "${state}" in
      unhealthy|exited|dead)
        terminal_streak=$((terminal_streak + 1))
        echo "[wait] ${service} -> ${state} (streak ${terminal_streak}/${terminal_streak_threshold})"
        if (( terminal_streak >= terminal_streak_threshold )); then
          echo "[error] ${service} reached terminal state: ${state} (${terminal_streak} consecutive polls)" >&2
          docker logs --tail 200 "${container_name}" || true
          return 1
        fi
        ;;
      "")
        terminal_streak=0
        echo "[wait] ${service} -> missing"
        ;;
      *)
        terminal_streak=0
        echo "[wait] ${service} -> ${state}"
        ;;
    esac

    sleep 2
  done

  echo "[error] timeout waiting for ${service} to become ${expected}; last_state=${state}" >&2
  docker logs --tail 200 "${container_name}" || true
  return 1
}

main() {
  require_cmd git
  require_cmd docker

  pre_sync_existing_repo
  bootstrap_vault_credentials_from_env_file
  maybe_render_env
  load_env_file

  # --- Vault URI validation and correction ---
  # Canonical internal Vault address: http://vault:8200
  # Reject stale hostnames (platform-stage-vault, platform-vault, etc.)
  validate_and_fix_vault_uri() {
    local canonical_vault_uri="http://vault:8200"
    local current_uri
    current_uri="$(read_env_value VAULT_URI)"

    # Fix HTTPS → HTTP (internal Docker network uses HTTP, TLS at edge)
    if [[ "${current_uri}" == https://vault:* ]]; then
      current_uri="${current_uri/https:\/\//http:\/\/}"
      echo "[deploy] fixed VAULT_URI scheme: https→http"
    fi

    # Reject stale/wrong hostnames — only "vault" is valid in compose network
    if [[ -n "${current_uri}" && "${current_uri}" != http://vault:* && "${current_uri}" != https://vault:* && "${current_uri}" != http://127.0.0.1:* && "${current_uri}" != https://127.0.0.1:* ]]; then
      echo "[deploy] WARNING: stale VAULT_URI detected: ${current_uri}" >&2
      echo "[deploy] overriding with canonical: ${canonical_vault_uri}" >&2
      current_uri="${canonical_vault_uri}"
    fi

    # Set canonical if empty
    if [[ -z "${current_uri}" ]]; then
      current_uri="${canonical_vault_uri}"
    fi

    # Persist corrections
    upsert_env_value VAULT_URI "${current_uri}"
    upsert_env_value VAULT_SCHEME "http"
    export VAULT_URI="${current_uri}"
    export VAULT_SCHEME="http"
    echo "[deploy] VAULT_URI=${current_uri}"
  }
  validate_and_fix_vault_uri

  REPO_BRANCH="${PINNED_REPO_BRANCH}"
  sync_repo
  mkdir -p "${STATE_DIR}"

  if [[ -n "${GHCR_USERNAME:-}" && -n "${GHCR_TOKEN:-}" ]]; then
    echo "${GHCR_TOKEN}" | docker login ghcr.io -u "${GHCR_USERNAME}" --password-stdin >/dev/null
  fi

  local compose_flags
  local original_image_tag
  local active_image_tag
  local image_tag_updated="0"

  original_image_tag="$(read_env_value IMAGE_TAG)"
  active_image_tag="${original_image_tag:-${IMAGE_TAG:-main-stable}}"

  restore_image_tag_on_error() {
    local rc=$?
    if [[ "${rc}" -ne 0 && "${image_tag_updated}" = "1" && -n "${original_image_tag}" ]]; then
      upsert_env_value IMAGE_TAG "${original_image_tag}"
    fi
    if [[ "${rc}" -ne 0 && -n "${compose_flags:-}" ]]; then
      print_compose_diagnostics "${compose_flags}" || true
    fi
    exit "${rc}"
  }

  trap restore_image_tag_on_error EXIT

  if [[ -n "${TARGET_IMAGE_TAG}" && "${TARGET_IMAGE_TAG}" != "${active_image_tag}" ]]; then
    if [[ -n "${active_image_tag}" ]]; then
      printf '%s\n' "${active_image_tag}" > "${PREVIOUS_TAG_FILE}"
    fi
    upsert_env_value IMAGE_TAG "${TARGET_IMAGE_TAG}"
    IMAGE_TAG="${TARGET_IMAGE_TAG}"
    active_image_tag="${TARGET_IMAGE_TAG}"
    image_tag_updated="1"
  fi

  export IMAGE_TAG="${active_image_tag}"
  echo "[deploy] branch=${REPO_BRANCH} image_tag=${IMAGE_TAG}"

  compose_flags="$(compose_cmd)"

  # shellcheck disable=SC2206
  local compose_args=( ${compose_flags} )

  compose_run "${compose_args[@]}" config --services >/dev/null

  # --- STRATEGY ---
  # Backend deploy ONLY recreates application services.
  # Infrastructure (postgres, vault, keycloak, nginx, observability) stays RUNNING.
  # This prevents: Vault timeout, Keycloak cold-start, data loss.
  #
  # If infra config changed, run: docker compose up -d --force-recreate <service>

  local backend_services=(
    discovery-server
    permission-service
    auth-service
    user-service
    variant-service
    core-data-service
    report-service
    api-gateway
  )

  local build_flag
  build_flag="$(printf '%s' "${BUILD_LOCAL}" | tr '[:upper:]' '[:lower:]')"

  if [[ "${build_flag}" == "true" || "${build_flag}" == "1" ]]; then
    # ── Local build mode ──
    # Build images on this host, tag them to match GHCR names.
    # Eliminates GHCR pull (~25min on slow connections).
    echo "[deploy] LOCAL BUILD mode — building images on host"

    local ghcr_owner
    ghcr_owner="$(printf '%s' "${GHCR_OWNER:-halildeu}" | tr '[:upper:]' '[:lower:]')"

    docker compose -f "${BUILD_COMPOSE_FILE}" build 2>&1 | tail -5

    local img svc target tagged=0
    # Compose project name is 'platform' (enforced by compose files + doctor-infra Section E).
    # Previous 'serban-*' prefix was the old project name; images are now 'platform-*'.
    # PR #370 fixed the same drift in .github/workflows/deploy-backend.yml; this fixes the script counterpart.
    for img in $(docker image ls --format '{{.Repository}}:{{.Tag}}' | grep -E '^platform-'); do
      svc="${img%%:*}"
      svc="${svc#platform-}"
      target="ghcr.io/${ghcr_owner}/platform-ssot-${svc}:${IMAGE_TAG}"
      docker tag "${img}" "${target}"
      tagged=$((tagged + 1))
    done
    echo "[deploy] tagged ${tagged} images as ${IMAGE_TAG}"

    # Also tag as main-stable for rollback support
    # Compose project name is 'platform' (enforced by compose files + doctor-infra Section E).
    # Previous 'serban-*' prefix was the old project name; images are now 'platform-*'.
    # PR #370 fixed the same drift in .github/workflows/deploy-backend.yml; this fixes the script counterpart.
    for img in $(docker image ls --format '{{.Repository}}:{{.Tag}}' | grep -E '^platform-'); do
      svc="${img%%:*}"
      svc="${svc#platform-}"
      docker tag "${img}" "ghcr.io/${ghcr_owner}/platform-ssot-${svc}:main-stable"
    done

    export DOCKER_PULL_POLICY="never"

    # Clean old images to prevent disk fill
    docker image prune -f --filter "until=24h" >/dev/null 2>&1 || true
  else
    # ── Remote pull mode (default) ──
    # STORY-0319 PR #3c — GHCR retag strategy.
    # Compose `build:` tabanlı olduğu için `compose pull` GHCR image'larını
    # alsa bile `up -d` yine local build üretir (platform-{svc}:latest yoksa).
    # Fix: doğrudan `docker pull` + her servis için retag to local compose
    # name. Böylece `up -d` build'i by-pass eder ve runtime GHCR digest'leri
    # içerir. Eksik image durumunda fail-close (exit 1) — stale image riski
    # engellenir. IMAGE_TAG strict (`:?`) — sessiz `main-stable` fallback yok.
    echo "[deploy] REMOTE PULL mode — pulling images from GHCR + retag to compose local names"
    local ghcr_owner
    ghcr_owner="$(printf '%s' "${GHCR_OWNER:-halildeu}" | tr '[:upper:]' '[:lower:]')"
    local src tgt svc retagged=0 image_tag="${IMAGE_TAG:?IMAGE_TAG required for remote-pull mode}"

    for svc in "${backend_services[@]}"; do
      src="ghcr.io/${ghcr_owner}/platform-ssot-${svc}:${image_tag}"
      tgt="platform-${svc}:latest"
      if ! docker pull "${src}"; then
        echo "[error] docker pull ${src} failed — deploy aborted (no silent fallback)" >&2
        exit 1
      fi
      docker tag "${src}" "${tgt}"
      retagged=$((retagged + 1))
    done
    echo "[deploy] retagged ${retagged}/${#backend_services[@]} GHCR images -> platform-*:latest"

    # Clean dangling old images after retag
    docker image prune -f --filter "until=24h" >/dev/null 2>&1 || true

    export DOCKER_PULL_POLICY="never"
  fi

  # Ensure infrastructure is up (no recreate — prevents Vault seal, Keycloak cold-start).
  # Only starts containers if not already running.
  #
  # Stage hosts may keep an external postgres compose pair (platform-pg-*) that
  # already owns host :5432. In that mode `postgres-db` (project service) cannot
  # bind and the whole deploy aborts before backend recreates. If bind conflict is
  # explicitly on postgres :5432 and an external pg container exists, continue with
  # remaining infra services and skip postgres-db bootstrap for this run.
  local infra_bootstrap_log
  local infra_bootstrap_rc=0
  local infra_bootstrap_log_file
  local external_stateful_mode="0"
  local postgres_bootstrap_skipped="0"

  infra_bootstrap_log_file="$(mktemp)"
  if compose_run "${compose_args[@]}" up -d --no-recreate postgres-db openfga-migrate openfga vault keycloak >"${infra_bootstrap_log_file}" 2>&1; then
    infra_bootstrap_rc=0
  else
    infra_bootstrap_rc=$?
  fi
  infra_bootstrap_log="$(cat "${infra_bootstrap_log_file}")"
  rm -f "${infra_bootstrap_log_file}"
  printf '%s\n' "${infra_bootstrap_log}"

  if [[ "${infra_bootstrap_rc}" -ne 0 ]]; then
    if printf '%s' "${infra_bootstrap_log}" | grep -q 'failed to bind host port for 0.0.0.0:5432' && \
       docker ps --format '{{.Names}}' | grep -Eq '^platform-pg-(test|prod)$'; then
      echo "[deploy] postgres-db bootstrap skipped (host :5432 already owned by external platform-pg-* container)."
      echo "[deploy] external stateful mode enabled (postgres)."
      external_stateful_mode="1"
      postgres_bootstrap_skipped="1"
      compose_run "${compose_args[@]}" up -d --no-recreate openfga-migrate openfga
    elif printf '%s' "${infra_bootstrap_log}" | grep -q 'failed to bind host port for 0.0.0.0:8200' && \
         docker ps --format '{{.Names}}' | grep -Eq '^platform-vault-(test|prod)$'; then
      echo "[deploy] vault bootstrap skipped (host :8200 already owned by external platform-vault-* container)."
      echo "[deploy] external stateful mode enabled (vault)."
      external_stateful_mode="1"
      compose_run "${compose_args[@]}" up -d --no-recreate openfga-migrate openfga
    else
      return "${infra_bootstrap_rc}"
    fi
  fi
  # P1.10: KMS auto-unseal mode skips the vault-unseal Shamir sidecar (Vault
  # self-unseals via the cloud KMS seal stanza). VAULT_SEAL_MODE=shamir (or
  # unset) keeps the legacy sidecar loop for local/staging.
  if [[ "${VAULT_SEAL_MODE:-shamir}" != "shamir" ]]; then
    echo "[deploy] VAULT_SEAL_MODE=${VAULT_SEAL_MODE} — skipping vault-unseal sidecar (KMS auto-unseal)"
    compose_run "${compose_args[@]}" up -d --no-recreate vault-audit-init vault-snapshot 2>/dev/null || true
  else
    compose_run "${compose_args[@]}" up -d --no-recreate vault-unseal vault-audit-init vault-snapshot 2>/dev/null || true
  fi
  if [[ "${postgres_bootstrap_skipped}" != "1" ]]; then
    wait_for_service_state postgres-db healthy 60
  else
    echo "[deploy] postgres-db health wait skipped (external pg bridge mode)."
  fi
  if [[ "${external_stateful_mode}" != "1" ]]; then
    wait_for_service_state vault healthy 120
  else
    echo "[deploy] vault health wait skipped (external stateful mode)."
  fi
  wait_for_service_state openfga running 60

  # Vault preflight — verify unsealed and accessible from deploy host
  vault_preflight() {
    local vault_container
    vault_container="$(container_name_for vault)"
    # Pass VAULT_ADDR explicitly: inside the container, vault CLI defaults to
    # https://127.0.0.1:8200 but the dev server listens on HTTP. Without this,
    # `vault status` fails with "http: server gave HTTP response to HTTPS client"
    # and status_json is empty → preflight return 1 → silent deploy fail.
    # Confirmed live on staging 2026-04-14 (run #24402781242 line 490).
    local status_json
    status_json="$(docker exec -e VAULT_ADDR=http://127.0.0.1:8200 "${vault_container}" vault status -format=json 2>/dev/null || true)"
    if [[ -n "${status_json}" ]]; then
      local sealed
      sealed="$(printf '%s' "${status_json}" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("sealed","unknown"))' 2>/dev/null || echo "unknown")"
      echo "[deploy] vault preflight: sealed=${sealed}"
      if [[ "${sealed}" == "true" ]]; then
        echo "[error] Vault is still sealed after health wait." >&2
        if [[ "${VAULT_SEAL_MODE:-shamir}" != "shamir" ]]; then
          echo "[error] KMS auto-unseal (VAULT_SEAL_MODE=${VAULT_SEAL_MODE}) did not unseal — check cloud KMS credentials, key access, network egress." >&2
          echo "[deploy] vault logs (KMS mode):" >&2
          docker logs --tail 40 "$(container_name_for vault)" 2>&1 || true
        else
          echo "[error] Shamir unseal keys may be missing." >&2
          echo "[deploy] vault-unseal logs:" >&2
          docker logs --tail 20 "$(container_name_for vault-unseal)" 2>&1 || true
        fi
        return 1
      fi
    else
      echo "[error] cannot reach Vault inside container (VAULT_ADDR=http://127.0.0.1:8200 passed; check vault container health)" >&2
      return 1
    fi
  }
  if [[ "${external_stateful_mode}" != "1" ]]; then
    vault_preflight
  else
    echo "[deploy] vault preflight skipped (external stateful mode)."
  fi

  # Recreate backend services with new images (--force-recreate only touches these)
  compose_run "${compose_args[@]}" up -d --force-recreate --no-deps discovery-server
  wait_for_service_state discovery-server healthy 90

  compose_run "${compose_args[@]}" up -d --force-recreate --no-deps permission-service
  wait_for_service_state permission-service healthy 120

  compose_run "${compose_args[@]}" up -d --force-recreate --no-deps auth-service user-service variant-service core-data-service report-service
  wait_for_service_state auth-service healthy 120
  wait_for_service_state user-service healthy 120
  wait_for_service_state variant-service healthy 120
  wait_for_service_state core-data-service healthy 120
  wait_for_service_state report-service healthy 120

  compose_run "${compose_args[@]}" up -d --force-recreate --no-deps api-gateway
  wait_for_service_state api-gateway healthy 90

  # Ensure supporting services are up (idempotent).
  # Nginx config is generated from template via envsubst at container start —
  # Docker service names (keycloak, api-gateway) are ALWAYS correct.
  compose_run "${compose_args[@]}" up -d --no-recreate web-nginx service-manager vault-audit-init vault-snapshot loki promtail tempo prometheus grafana 2>/dev/null || true

  # Standalone nginx handling — compose-aware:
  # - Prod compose (deploy/docker-compose.prod.yml) manages web-nginx as a service.
  #   In that case, kill any leftover standalone so compose can take over cleanly.
  # - Staging compose (backend/docker-compose.yml) has NO web-nginx service; nginx
  #   lives as a standalone container started by run-frontend-nginx-container.sh.
  #   We MUST NOT remove it here (doing so leaves ai.acik.com dead until
  #   post-deploy-health-check's auto-restart fallback fires). Root cause of the
  #   2026-04-14 deploy incidents (PR #377/#378/#379).
  if compose_run "${compose_args[@]}" config --services 2>/dev/null | grep -qx "web-nginx"; then
    # Prod path: compose owns nginx → clear stale standalone so recreate is clean.
    docker rm -f platform-web-nginx 2>/dev/null || true
  fi
  # Staging/local: do NOTHING to platform-web-nginx here.

  # Remove orphan containers (old names, deleted services).
  # NOTE: --remove-orphans only touches orphans of THIS compose project. Standalone
  # nginx (no compose label) is unaffected by this call.
  compose_run "${compose_args[@]}" up -d --remove-orphans 2>/dev/null || true

  compose_run "${compose_args[@]}" ps

  printf '%s\n' "${active_image_tag}" > "${CURRENT_TAG_FILE}"
  trap - EXIT

  git -C "${REPO_DIR}" rev-parse --short HEAD
}

main "$@"
