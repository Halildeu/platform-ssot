#!/usr/bin/env bash
set -euo pipefail

STATE_DIR="${STATE_DIR:-/home/halil/platform/state}"
PROD_WEB_ROOT_DEFAULT="/home/halil/platform/web"
STAGE_WEB_ROOT_DEFAULT="/home/halil/platform/web-stage"

case "$(printf '%s' "${DEPLOY_ENV:-}" | tr '[:upper:]' '[:lower:]')" in
  prod|production)
    _default_previous_release_file="${STATE_DIR}/web.previous-release"
    _default_current_release_file="${STATE_DIR}/web.current-release"
    _default_web_current_link="${PROD_WEB_ROOT_DEFAULT}/current"
    ;;
  *)
    _default_previous_release_file="${STATE_DIR}/web-stage.previous-release"
    _default_current_release_file="${STATE_DIR}/web-stage.current-release"
    _default_web_current_link="${STAGE_WEB_ROOT_DEFAULT}/current"
    ;;
esac

PREVIOUS_RELEASE_FILE="${PREVIOUS_RELEASE_FILE:-${_default_previous_release_file}}"
CURRENT_RELEASE_FILE="${CURRENT_RELEASE_FILE:-${_default_current_release_file}}"
WEB_CURRENT_LINK="${WEB_CURRENT_LINK:-${_default_web_current_link}}"
NGINX_CONTAINER_ENABLED="${NGINX_CONTAINER_ENABLED:-false}"
NGINX_CONTAINER_SCRIPT="${NGINX_CONTAINER_SCRIPT:-$(cd "$(dirname "$0")" && pwd)/run-frontend-nginx-container.sh}"

unset _default_previous_release_file _default_current_release_file _default_web_current_link

if [[ ! -f "${PREVIOUS_RELEASE_FILE}" ]]; then
  echo "[error] previous frontend release not found: ${PREVIOUS_RELEASE_FILE}" >&2
  exit 1
fi

previous_release="$(tr -d '[:space:]' < "${PREVIOUS_RELEASE_FILE}")"
if [[ -z "${previous_release}" || ! -d "${previous_release}" ]]; then
  echo "[error] previous frontend release is invalid: ${previous_release:-empty}" >&2
  exit 1
fi

mkdir -p "$(dirname "${WEB_CURRENT_LINK}")"
ln -sfn "${previous_release}" "${WEB_CURRENT_LINK}"
printf '%s\n' "${previous_release}" > "${CURRENT_RELEASE_FILE}"

if [[ "${NGINX_CONTAINER_ENABLED}" == "true" ]]; then
  if [[ ! -x "${NGINX_CONTAINER_SCRIPT}" ]]; then
    echo "[error] nginx container script missing or not executable: ${NGINX_CONTAINER_SCRIPT}" >&2
    exit 1
  fi
  "${NGINX_CONTAINER_SCRIPT}"
fi

echo "[rollback] frontend release=${previous_release}"
