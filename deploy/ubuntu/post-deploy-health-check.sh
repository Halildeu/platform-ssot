#!/usr/bin/env bash
set -euo pipefail
# Post-deploy health validation — runs after deploy-backend.sh
# Ensures ALL services are healthy, Vault unsealed, endpoints reachable.
# Updated: Vault auto-unseal retry loop (vault-unseal watcher needs time)

echo "[health-check] Starting post-deploy validation..."
echo "[health-check] Waiting 30s for services to stabilize..."
sleep 30

FAILURES=0

# ---- 1. Vault sealed check (retry loop — vault-unseal watcher may need time) ----
VAULT_RETRIES=12
VAULT_SEALED="True"
echo "[health-check] Checking Vault seal status (max ${VAULT_RETRIES} retries, 10s interval)..."
for i in $(seq 1 $VAULT_RETRIES); do
  # VAULT_ADDR=http://... required: vault CLI defaults to HTTPS but dev server is HTTP.
  # Without this, status returns "unknown" for the full retry window and FAIL emits.
  # Same bug as vault_preflight in deploy-backend.sh (fixed in PR #374).
  VAULT_SEALED=$(docker exec -e VAULT_ADDR=http://127.0.0.1:8200 platform-vault-1 vault status -format=json 2>/dev/null | python3 -c "import json,sys; print(json.load(sys.stdin).get('sealed','unknown'))" 2>/dev/null || echo "unknown")
  if [[ "$VAULT_SEALED" == "False" ]]; then
    echo "  OK: vault unsealed (attempt $i)"
    break
  fi
  if [[ $i -lt $VAULT_RETRIES ]]; then
    echo "  WAIT: vault sealed=$VAULT_SEALED (attempt $i/$VAULT_RETRIES, retrying in 10s...)"
    sleep 10
  else
    echo "  FAIL: vault still sealed after $VAULT_RETRIES attempts"
    FAILURES=$((FAILURES + 1))
  fi
done

# ---- 2. If Vault was sealed, wait extra 20s for dependent services to recover ----
if [[ "$VAULT_SEALED" == "False" ]]; then
  # Check if auth-dependent services need restart
  for svc in auth-service user-service variant-service; do
    container="platform-${svc}-1"
    status=$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}no-healthcheck{{end}}' "$container" 2>/dev/null || echo "missing")
    if [[ "$status" != "healthy" ]]; then
      echo "[health-check] Restarting $svc (unhealthy after Vault unseal)..."
      docker restart "$container" 2>/dev/null || true
    fi
  done
  echo "[health-check] Waiting 30s for Vault-dependent services to recover..."
  sleep 30
fi

# ---- 3. Docker health status ----
# NOTE: web-nginx is a standalone container (deploy/ubuntu/run-frontend-nginx-container.sh),
# not part of docker-compose.yml. Its container name is "platform-web-nginx" (no "-1" suffix).
# Health for it is a simple running-state check; compose-managed services use healthchecks.
for svc in postgres-db vault keycloak openfga discovery-server permission-service auth-service user-service variant-service core-data-service report-service api-gateway; do
  container="platform-${svc}-1"
  status=$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}no-healthcheck{{end}}' "$container" 2>/dev/null || echo "missing")
  if [[ "$status" == "healthy" || "$status" == "no-healthcheck" ]]; then
    echo "  OK: $svc ($status)"
  else
    echo "  FAIL: $svc ($status)"
    FAILURES=$((FAILURES + 1))
  fi
done

# web-nginx: standalone container (no compose-managed -1 suffix)
# 2026-04-14: deploy'da nginx'in silinebildiği (orphan cleanup veya compose
# 'down' side-effect) tespit edildi → /ai.acik.com down. Auto-restart ekli.
nginx_state=$(docker inspect --format '{{.State.Status}}' platform-web-nginx 2>/dev/null || echo "missing")
if [[ "$nginx_state" == "running" ]]; then
  echo "  OK: web-nginx (running, standalone)"
else
  echo "  WARN: web-nginx ($nginx_state) — auto-restart attempt"
  nginx_script="/home/halil/platform/repo/deploy/ubuntu/run-frontend-nginx-container.sh"
  # -f (file exists) instead of -x: repo files may not have executable bit
  # set after clone. We invoke via `bash "$script"` which doesn't need it.
  if [[ -f "$nginx_script" ]]; then
    if bash "$nginx_script" >/tmp/nginx-restore.log 2>&1; then
      sleep 3
      nginx_state=$(docker inspect --format '{{.State.Status}}' platform-web-nginx 2>/dev/null || echo "missing")
      if [[ "$nginx_state" == "running" ]]; then
        echo "  OK: web-nginx recovered after auto-restart"
      else
        echo "  FAIL: web-nginx auto-restart failed (state=$nginx_state, log: /tmp/nginx-restore.log)"
        FAILURES=$((FAILURES + 1))
      fi
    else
      echo "  FAIL: web-nginx restore script errored (log: /tmp/nginx-restore.log)"
      FAILURES=$((FAILURES + 1))
    fi
  else
    echo "  FAIL: web-nginx missing + restore script not found at $nginx_script"
    FAILURES=$((FAILURES + 1))
  fi
fi

# ---- 4. OpenFGA health ----
OPENFGA=$(curl -sf http://localhost:4000/healthz 2>/dev/null || echo '{"status":"FAIL"}')
if echo "$OPENFGA" | grep -q "SERVING"; then
  echo "  OK: openfga SERVING"
else
  echo "  FAIL: openfga $OPENFGA"
  FAILURES=$((FAILURES + 1))
fi

# ---- 5. BACKEND_HEALTH_URLS edge-path validation (2026-04-18 Codex Thread 5 #5) ----
# Post-deploy-validate workflow job uses BACKEND_HEALTH_URLS GH secret to probe
# public paths. If that secret drifts (e.g. stale 8082 port after stage compose
# change), container health can be green but edge path broken — false green.
# This step mirrors the workflow probe so host-side script catches drift too.
if [[ -n "${BACKEND_HEALTH_URLS:-}" ]]; then
  echo "[health-check] Validating BACKEND_HEALTH_URLS edge paths..."
  IFS=',' read -r -a health_urls <<< "${BACKEND_HEALTH_URLS}"
  for u in "${health_urls[@]}"; do
    u="$(echo "$u" | xargs)"
    [[ -n "$u" ]] || continue
    if url_status="$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 --connect-timeout 3 "$u" 2>/dev/null)"; then
      case "$url_status" in
        200|204|301|302|401|403)
          # 200/204 healthy; 3xx redirect to login = healthy; 401/403 = auth gate = healthy
          echo "  OK: $u → $url_status"
          ;;
        *)
          echo "  FAIL: $u → $url_status (unexpected)"
          FAILURES=$((FAILURES + 1))
          ;;
      esac
    else
      curl_exit=$?
      echo "  FAIL: $u unreachable (curl exit=$curl_exit)"
      FAILURES=$((FAILURES + 1))
    fi
  done
else
  # BACKEND_HEALTH_URLS unset is expected for local dev. On stage it should
  # be set by the deploy workflow env. Emit a hint rather than fail.
  echo "[health-check] NOTE: BACKEND_HEALTH_URLS unset — edge-path probe skipped (local dev?)"
fi

echo ""
if [[ $FAILURES -gt 0 ]]; then
  echo "[health-check] FAIL: $FAILURES check(s) unhealthy"
  exit 1
fi
echo "[health-check] PASS: all checks healthy"
