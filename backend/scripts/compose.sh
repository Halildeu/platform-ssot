#!/usr/bin/env bash
# compose.sh — Safe docker compose wrapper
# Ensures: correct directory, correct compose file, post-op health check.
#
# Usage (from anywhere):
#   ./scripts/compose.sh ps
#   ./scripts/compose.sh restart report-service
#   ./scripts/compose.sh up -d
#   ./scripts/compose.sh build permission-service
#   ./scripts/compose.sh logs -f report-service
#   ./scripts/compose.sh doctor          # run health check only
#   ./scripts/compose.sh fix-nginx       # fix nginx keycloak proxy IP
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
COMPOSE_FILE="$BACKEND_DIR/docker-compose.yml"

# Ensure .env exists
if [[ ! -f "$BACKEND_DIR/.env" ]]; then
  echo "[compose.sh] WARN: .env dosyası yok — .env.example'dan oluştur"
  exit 1
fi

cd "$BACKEND_DIR"

# Special commands
case "${1:-help}" in
  doctor)
    exec bash "$SCRIPT_DIR/doctor-compose.sh" "${2:-}"
    ;;
  fix-nginx)
    KC_IP=$(docker inspect platform-keycloak-1 --format "{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}" 2>/dev/null)
    if [[ -z "$KC_IP" ]]; then
      echo "[compose.sh] Keycloak container bulunamadı"
      exit 1
    fi
    NGINX_CONF="/home/halil/platform/web/nginx/default.conf"
    # Fix /api/ → gateway (127.0.0.1:8080)
    sed -i "/location \/api\//,/}/ s|proxy_pass http://[0-9.:]*|proxy_pass http://127.0.0.1:8080|" "$NGINX_CONF"
    # Fix /api/services/ → service-manager
    sed -i "/location \/api\/services/,/}/ s|proxy_pass http://[0-9.:]*|proxy_pass http://127.0.0.1:8795|" "$NGINX_CONF"
    # Fix /realms/ and /resources/ → keycloak
    sed -i "/location \/realms/,/}/ s|proxy_pass http://[0-9.:]*|proxy_pass http://${KC_IP}:8080|" "$NGINX_CONF"
    sed -i "/location \/resources/,/}/ s|proxy_pass http://[0-9.:]*|proxy_pass http://${KC_IP}:8080|" "$NGINX_CONF"
    docker restart platform-web-nginx 2>/dev/null || true
    echo "[compose.sh] Nginx proxy düzeltildi (keycloak=$KC_IP)"
    ;;
  help|--help|-h)
    echo "Usage: ./scripts/compose.sh <command> [args...]"
    echo ""
    echo "Commands:"
    echo "  ps, up, down, restart, build, logs, exec  — docker compose forwarding"
    echo "  doctor [--quick]                          — compose sağlık kontrolü"
    echo "  fix-nginx                                 — nginx keycloak proxy IP düzelt"
    echo ""
    echo "Examples:"
    echo "  ./scripts/compose.sh ps"
    echo "  ./scripts/compose.sh restart report-service"
    echo "  ./scripts/compose.sh up -d --no-deps permission-service"
    echo "  ./scripts/compose.sh doctor"
    exit 0
    ;;
  *)
    # Forward to docker compose
    docker compose "$@"

    # Post-op quick check for state-changing commands
    case "$1" in
      up|restart|start|stop|down|rm)
        echo ""
        echo "[compose.sh] Post-op kontrol..."
        sleep 2
        # Quick orphan check
        ORPHAN=$(docker compose up --dry-run --no-deps postgres-db 2>&1 | grep -i orphan || true)
        if [[ -n "$ORPHAN" ]]; then
          echo "[compose.sh] WARN: Orphan container tespit edildi!"
          echo "  $ORPHAN"
        fi
        # Quick project check
        PROJECTS=$(docker ps --format "{{.Labels}}" | grep -oP "com.docker.compose.project=\K[^,]+" | sort -u | tr '\n' ' ')
        echo "[compose.sh] Aktif projeler: $PROJECTS"
        ;;
    esac
    ;;
esac
