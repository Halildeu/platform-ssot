#!/usr/bin/env bash
set -euo pipefail

WEB_CURRENT_LINK="${WEB_CURRENT_LINK:-/home/halil/platform/web/current}"
NGINX_RUNTIME_DIR="${NGINX_RUNTIME_DIR:-/home/halil/platform/web/nginx}"
NGINX_CONTAINER_NAME="${NGINX_CONTAINER_NAME:-platform-web-nginx}"
NGINX_IMAGE="${NGINX_IMAGE:-nginx:1.27-alpine}"
NGINX_CONFIG_PATH="${NGINX_CONFIG_PATH:-${NGINX_RUNTIME_DIR}/default.conf}"
NGINX_PORT="${NGINX_PORT:-80}"
NGINX_HTTP_PORT="${NGINX_HTTP_PORT:-80}"
NGINX_HTTPS_PORT="${NGINX_HTTPS_PORT:-443}"
NGINX_SERVER_NAME="${NGINX_SERVER_NAME:-ai.acik.com}"
NGINX_TLS_ENABLED="${NGINX_TLS_ENABLED:-true}"
# Default TLS paths point to the public cert directory for ${NGINX_SERVER_NAME}.
# NOTE: Previously defaulted to /state/vault/tls (Vault's dev self-signed cert),
# which caused NET::ERR_CERT_AUTHORITY_INVALID in production on 2026-04-14.
# Root cause: nginx mount shared host path with Vault's dev TLS dir; on Vault
# reinit the tls.crt/tls.key files were overwritten with a CN=vault self-signed
# cert. Fix: pin to public cert directory + pre-flight guard below.
NGINX_TLS_CERT_PATH="${NGINX_TLS_CERT_PATH:-/home/halil/platform/tls/ai.acik.com/fullchain.pem}"
NGINX_TLS_KEY_PATH="${NGINX_TLS_KEY_PATH:-/home/halil/platform/tls/ai.acik.com/privkey.pem}"
# Host network mode: use 127.0.0.1 with host-side ports (Docker DNS unavailable)
NGINX_GATEWAY_UPSTREAM="${NGINX_GATEWAY_UPSTREAM:-http://127.0.0.1:8080}"
# Default to host port (8081) since nginx runs --network host and can't resolve Docker DNS.
# Keycloak container maps 8080→8081 on host.
NGINX_KEYCLOAK_UPSTREAM="${NGINX_KEYCLOAK_UPSTREAM:-http://127.0.0.1:8081}"
NGINX_SERVICE_MANAGER_UPSTREAM="${NGINX_SERVICE_MANAGER_UPSTREAM:-http://127.0.0.1:8795}"
CONFIG_ONLY="${CONFIG_ONLY:-false}"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "[error] required command not found: $1" >&2
    exit 1
  fi
}

main() {
  local config_only_flag
  config_only_flag="$(printf '%s' "${CONFIG_ONLY}" | tr '[:upper:]' '[:lower:]')"

  # --config-only mode: just generate the config file, don't touch containers.
  # Used by deploy-backend.sh when nginx is managed by docker compose.
  for arg in "$@"; do
    if [[ "${arg}" == "--config-only" ]]; then
      config_only_flag="true"
    fi
  done

  if [[ "${config_only_flag}" != "true" ]]; then
    require_cmd docker
    require_cmd readlink

    if [[ ! -e "${WEB_CURRENT_LINK}" ]]; then
      echo "[error] current frontend release not found: ${WEB_CURRENT_LINK}" >&2
      exit 1
    fi

    local resolved_root
    resolved_root="$(readlink -f "${WEB_CURRENT_LINK}")"
    if [[ -z "${resolved_root}" || ! -d "${resolved_root}" ]]; then
      echo "[error] failed to resolve frontend release directory from ${WEB_CURRENT_LINK}" >&2
      exit 1
    fi
  fi

  mkdir -p "${NGINX_RUNTIME_DIR}"

  local tls_enabled
  local docker_args=()
  local redirect_port_suffix=""
  tls_enabled="$(printf '%s' "${NGINX_TLS_ENABLED}" | tr '[:upper:]' '[:lower:]')"

  if [[ "${tls_enabled}" == "true" ]]; then
    # In config-only mode, skip file existence checks (compose handles mounts)
    if [[ "${config_only_flag}" != "true" ]]; then
      if [[ -z "${NGINX_TLS_CERT_PATH}" || -z "${NGINX_TLS_KEY_PATH}" ]]; then
        echo "[error] NGINX_TLS_ENABLED=true but cert/key paths are missing." >&2
        exit 1
      fi
      if [[ ! -f "${NGINX_TLS_CERT_PATH}" ]]; then
        echo "[error] TLS certificate not found: ${NGINX_TLS_CERT_PATH}" >&2
        exit 1
      fi
      if [[ ! -f "${NGINX_TLS_KEY_PATH}" ]]; then
        echo "[error] TLS key not found: ${NGINX_TLS_KEY_PATH}" >&2
        exit 1
      fi

      # Pre-flight cert guard — prevents 2026-04-14 regression (Vault dev cert mount)
      # If openssl is available on the host, verify cert subject/SAN covers NGINX_SERVER_NAME
      # and that the private key matches the cert. Skip with NGINX_SKIP_CERT_GUARD=true for
      # legitimate wildcard/alternate-domain edge cases; never set this silently.
      if [[ "${NGINX_SKIP_CERT_GUARD:-false}" != "true" ]] && command -v openssl >/dev/null 2>&1; then
        local cert_subject cert_san server_base cn_match san_match key_md5 cert_md5
        cert_subject="$(openssl x509 -in "${NGINX_TLS_CERT_PATH}" -noout -subject 2>/dev/null || true)"
        cert_san="$(openssl x509 -in "${NGINX_TLS_CERT_PATH}" -noout -ext subjectAltName 2>/dev/null || true)"

        # Guard 1: reject self-signed CN=vault (root cause of 2026-04-14 incident)
        if printf '%s' "${cert_subject}" | grep -qE 'CN\s*=\s*vault$'; then
          echo "[error] TLS certificate is Vault's self-signed dev cert (CN=vault)." >&2
          echo "[error] This is the 2026-04-14 regression. Check NGINX_TLS_CERT_PATH:" >&2
          echo "[error]   current = ${NGINX_TLS_CERT_PATH}" >&2
          echo "[error]   expected = /home/halil/platform/tls/${NGINX_SERVER_NAME}/fullchain.pem" >&2
          exit 1
        fi

        # Guard 2: cert CN or SAN must cover server_name (supports wildcards)
        server_base="${NGINX_SERVER_NAME#*.}"
        cn_match=0
        san_match=0
        if printf '%s' "${cert_subject}" | grep -qE "CN\s*=\s*(\*\.)?${server_base//./\\.}(\b|$|/)" ; then
          cn_match=1
        fi
        if printf '%s' "${cert_subject}" | grep -qE "CN\s*=\s*${NGINX_SERVER_NAME//./\\.}(\b|$|/)" ; then
          cn_match=1
        fi
        if printf '%s' "${cert_san}" | grep -qE "DNS:(\*\.)?${server_base//./\\.}(\b|,|$)" ; then
          san_match=1
        fi
        if printf '%s' "${cert_san}" | grep -qE "DNS:${NGINX_SERVER_NAME//./\\.}(\b|,|$)" ; then
          san_match=1
        fi
        if [[ "${cn_match}" -eq 0 && "${san_match}" -eq 0 ]]; then
          echo "[error] TLS cert does not cover server_name=${NGINX_SERVER_NAME}" >&2
          echo "[error]   cert subject: ${cert_subject}" >&2
          echo "[error]   cert SAN    : ${cert_san}" >&2
          echo "[error] Set NGINX_SKIP_CERT_GUARD=true to override (not recommended)." >&2
          exit 1
        fi

        # Guard 3: private key must match cert (detects swapped/stale pair)
        cert_md5="$(openssl x509 -noout -modulus -in "${NGINX_TLS_CERT_PATH}" 2>/dev/null | openssl md5 | awk '{print $NF}')"
        key_md5="$(openssl rsa -noout -modulus -in "${NGINX_TLS_KEY_PATH}" 2>/dev/null | openssl md5 | awk '{print $NF}')"
        if [[ -n "${cert_md5}" && -n "${key_md5}" && "${cert_md5}" != "${key_md5}" ]]; then
          echo "[error] TLS cert/key modulus mismatch — wrong key for this cert." >&2
          echo "[error]   cert path: ${NGINX_TLS_CERT_PATH}" >&2
          echo "[error]   key  path: ${NGINX_TLS_KEY_PATH}" >&2
          exit 1
        fi
      fi
    fi

    if [[ "${NGINX_HTTPS_PORT}" != "443" ]]; then
      redirect_port_suffix=":${NGINX_HTTPS_PORT}"
    fi

    cat > "${NGINX_CONFIG_PATH}" <<EOF
server_tokens off;

server {
  listen ${NGINX_HTTP_PORT};
  server_name ${NGINX_SERVER_NAME};

  location = /nginx-healthz {
    access_log off;
    add_header Content-Type text/plain;
    return 200 'ok';
  }

  location / {
    return 301 https://\$host${redirect_port_suffix}\$request_uri;
  }
}

server {
  listen ${NGINX_HTTPS_PORT} ssl;
  server_name ${NGINX_SERVER_NAME};

  ssl_certificate /etc/nginx/tls/tls.crt;
  ssl_certificate_key /etc/nginx/tls/tls.key;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_prefer_server_ciphers on;
  ssl_session_cache shared:SSL:10m;
  ssl_session_timeout 10m;

  # Security headers
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

  root /usr/share/nginx/html;
  index index.html;

  # Block Keycloak admin console (not /admin/reports, /admin/users etc.)
  location /admin/master/ {
    return 403;
  }
  location /admin/realms/ {
    return 403;
  }

  location = /nginx-healthz {
    access_log off;
    add_header Content-Type text/plain;
    return 200 'ok';
  }

  location /assets/ {
    try_files \$uri =404;
    access_log off;
    expires 1h;
    add_header Cache-Control "public, max-age=3600, immutable";
  }

  location /remotes/ {
    try_files \$uri =404;
    access_log off;
    expires 1h;
    add_header Cache-Control "public, max-age=3600, immutable";
  }

  resolver 127.0.0.11 valid=10s;

  location /api/services/ {
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_pass ${NGINX_SERVICE_MANAGER_UPSTREAM};
  }

  location /api/ {
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Forwarded-Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_set_header X-Forwarded-Port \$server_port;
    proxy_pass ${NGINX_GATEWAY_UPSTREAM};
  }

  location /realms/ {
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Forwarded-Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_set_header X-Forwarded-Port \$server_port;
    proxy_pass ${NGINX_KEYCLOAK_UPSTREAM};
  }

  location /resources/ {
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Forwarded-Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_set_header X-Forwarded-Port \$server_port;
    proxy_pass ${NGINX_KEYCLOAK_UPSTREAM};
  }

  location / {
    try_files \$uri \$uri/ /index.html;
  }
}
EOF

    docker_args+=(
      -v "${NGINX_TLS_CERT_PATH}:/etc/nginx/tls/tls.crt:ro"
      -v "${NGINX_TLS_KEY_PATH}:/etc/nginx/tls/tls.key:ro"
    )
  else
    cat > "${NGINX_CONFIG_PATH}" <<EOF
server_tokens off;

server {
  listen ${NGINX_PORT};
  server_name ${NGINX_SERVER_NAME};

  # Security headers
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;

  root /usr/share/nginx/html;
  index index.html;

  # Block Keycloak admin console (not /admin/reports, /admin/users etc.)
  location /admin/master/ {
    return 403;
  }
  location /admin/realms/ {
    return 403;
  }

  location = /nginx-healthz {
    access_log off;
    add_header Content-Type text/plain;
    return 200 'ok';
  }

  location /assets/ {
    try_files \$uri =404;
    access_log off;
    expires 1h;
    add_header Cache-Control "public, max-age=3600, immutable";
  }

  location /remotes/ {
    try_files \$uri =404;
    access_log off;
    expires 1h;
    add_header Cache-Control "public, max-age=3600, immutable";
  }

  location /api/ {
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Forwarded-Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_pass ${NGINX_GATEWAY_UPSTREAM};
  }

  location /realms/ {
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Forwarded-Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_pass ${NGINX_KEYCLOAK_UPSTREAM};
  }

  location /resources/ {
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Forwarded-Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_pass ${NGINX_KEYCLOAK_UPSTREAM};
  }

  location / {
    try_files \$uri \$uri/ /index.html;
  }
}
EOF
  fi

  if [[ "${config_only_flag}" == "true" ]]; then
    echo "[nginx] config written to ${NGINX_CONFIG_PATH} (config-only mode)"
    return 0
  fi

  docker pull "${NGINX_IMAGE}" >/dev/null
  docker rm -f "${NGINX_CONTAINER_NAME}" >/dev/null 2>&1 || true
  docker run -d \
    --name "${NGINX_CONTAINER_NAME}" \
    --restart unless-stopped \
    --network host \
    -v "${resolved_root}:/usr/share/nginx/html:ro" \
    -v "${NGINX_CONFIG_PATH}:/etc/nginx/conf.d/default.conf:ro" \
    "${docker_args[@]}" \
    "${NGINX_IMAGE}" >/dev/null

  if [[ "${tls_enabled}" == "true" ]]; then
    echo "[nginx] container=${NGINX_CONTAINER_NAME} root=${resolved_root} http=${NGINX_HTTP_PORT} https=${NGINX_HTTPS_PORT} server_name=${NGINX_SERVER_NAME} tls=true"
  else
    echo "[nginx] container=${NGINX_CONTAINER_NAME} root=${resolved_root} port=${NGINX_PORT} server_name=${NGINX_SERVER_NAME} tls=false"
  fi
}

main "$@"
