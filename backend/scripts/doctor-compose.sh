#!/usr/bin/env bash
# doctor-compose.sh — Compose health guard
# Validates: single project, no orphans, correct profiles, Eureka registration,
# nginx routing, env consistency. Run after every compose operation.
#
# Usage:
#   ./scripts/doctor-compose.sh          # full check
#   ./scripts/doctor-compose.sh --quick  # skip runtime checks
set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[0;33m'; NC='\033[0m'
ERRORS=0; WARNINGS=0

pass() { echo -e "  ${GREEN}PASS${NC}  $1"; }
fail() { echo -e "  ${RED}FAIL${NC}  $1"; ERRORS=$((ERRORS + 1)); }
warn() { echo -e "  ${YELLOW}WARN${NC}  $1"; WARNINGS=$((WARNINGS + 1)); }

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
QUICK=false
[[ "${1:-}" == "--quick" ]] && QUICK=true

echo "=== doctor-compose.sh ==="
echo ""

# ── A. Compose dosya tutarlılığı ─────────────────────────────────

echo "[A] Compose dosya kontrolü"

# A1: dev compose name field
DEV_NAME=$(grep -m1 '^name:' "$BACKEND_DIR/docker-compose.yml" 2>/dev/null | awk '{print $2}')
if [[ "$DEV_NAME" == "platform" ]]; then
  pass "A1: docker-compose.yml name=platform"
else
  fail "A1: docker-compose.yml name='$DEV_NAME' (beklenen: platform)"
fi

# A2: prod compose name field
PROD_NAME=$(grep -m1 '^name:' "$BACKEND_DIR/docker-compose.prod.yml" 2>/dev/null | awk '{print $2}')
if [[ "$PROD_NAME" == "platform" ]]; then
  pass "A2: docker-compose.prod.yml name=platform"
else
  fail "A2: docker-compose.prod.yml name='$PROD_NAME' (beklenen: platform)"
fi

# A3: .env.example has COMPOSE_PROJECT_NAME
if grep -q "COMPOSE_PROJECT_NAME=platform" "$BACKEND_DIR/.env.example" 2>/dev/null; then
  pass "A3: .env.example COMPOSE_PROJECT_NAME=platform"
else
  fail "A3: .env.example COMPOSE_PROJECT_NAME eksik"
fi

# A4: No hardcoded container_name (except vault which needs it)
CUSTOM_NAMES=$(grep -n "container_name:" "$BACKEND_DIR/docker-compose.yml" 2>/dev/null | grep -v vault | grep -v "^#" || true)
if [[ -z "$CUSTOM_NAMES" ]]; then
  pass "A4: container_name override yok (vault hariç)"
else
  warn "A4: container_name override var: $CUSTOM_NAMES"
fi

if $QUICK; then
  echo ""
  echo "[B-F] Runtime kontroller atlandı (--quick)"
  echo ""
  echo "=== Sonuç: $ERRORS hata, $WARNINGS uyarı ==="
  exit $ERRORS
fi

# ── B. Runtime: Tek compose project ──────────────────────────────

echo ""
echo "[B] Runtime container kontrolü"

# B1: All containers same project
PROJECTS=$(docker ps --format "{{.Labels}}" 2>/dev/null | grep -oP "com.docker.compose.project=\K[^,]+" | sort -u)
MANUAL_COUNT=$(docker ps --format "{{.Names}}" 2>/dev/null | while read n; do
  svc=$(docker inspect "$n" --format "{{index .Config.Labels \"com.docker.compose.service\"}}" 2>/dev/null)
  [[ -z "$svc" ]] && echo "$n"
done | wc -l)

if [[ "$PROJECTS" == "platform" ]]; then
  pass "B1: Tek compose project: platform"
else
  fail "B1: Birden fazla project: $PROJECTS"
fi

if [[ "$MANUAL_COUNT" -le 1 ]]; then
  pass "B2: Manual container ≤1 (nginx hariç kabul)"
else
  fail "B2: $MANUAL_COUNT manual container (beklenen ≤1)"
fi

# B3: No orphan warning
ORPHAN_CHECK=$(cd "$BACKEND_DIR" && docker compose up --dry-run --no-deps postgres-db 2>&1 | grep -i orphan || true)
if [[ -z "$ORPHAN_CHECK" ]]; then
  pass "B3: Orphan container yok"
else
  fail "B3: Orphan tespit edildi: $ORPHAN_CHECK"
fi

# B4: All compose config files same
CONFIG_FILES=$(docker ps --filter "label=com.docker.compose.project=platform" --format "{{.Names}}" 2>/dev/null | while read n; do
  docker inspect "$n" --format "{{index .Config.Labels \"com.docker.compose.project.config_files\"}}" 2>/dev/null
done | sort -u | grep -v "^$")
CONFIG_COUNT=$(echo "$CONFIG_FILES" | wc -l)
if [[ "$CONFIG_COUNT" -le 1 ]]; then
  pass "B4: Tüm container'lar aynı compose dosyasından"
else
  fail "B4: $CONFIG_COUNT farklı compose dosyası kullanılmış:"
  echo "$CONFIG_FILES" | sed 's/^/        /'
fi

# ── C. Profil tutarlılığı ────────────────────────────────────────

echo ""
echo "[C] Spring profil kontrolü"

for SVC in api-gateway user-service permission-service report-service auth-service variant-service core-data-service schema-service; do
  CONTAINER="platform-${SVC//-service/-service}-1"
  # Fix container name pattern
  CONTAINER="platform-$(echo $SVC | sed 's/_/-/g')-1"
  PROFILE=$(docker exec "$CONTAINER" printenv SPRING_PROFILES_ACTIVE 2>/dev/null || echo "N/A")
  if [[ "$PROFILE" == *"local"* ]] || [[ "$PROFILE" == *"docker"* ]]; then
    pass "C: $SVC profile=$PROFILE"
  elif [[ "$PROFILE" == "N/A" ]]; then
    warn "C: $SVC container bulunamadı"
  else
    fail "C: $SVC profile=$PROFILE (beklenen: local,docker)"
  fi
done

# ── D. Eureka kayıt kontrolü ────────────────────────────────────

echo ""
echo "[D] Eureka kayıt kontrolü"

EUREKA_APPS=$(curl -s http://127.0.0.1:8761/eureka/apps 2>/dev/null | grep -oP "<name>[^<]+" | sed "s/<name>//" | sort)
EXPECTED_APPS="API-GATEWAY AUTH-SERVICE CORE-DATA-SERVICE PERMISSION-SERVICE REPORT-SERVICE SCHEMA-SERVICE USER-SERVICE VARIANT-SERVICE"

for APP in $EXPECTED_APPS; do
  if echo "$EUREKA_APPS" | grep -q "$APP"; then
    pass "D: $APP Eureka'da kayıtlı"
  else
    fail "D: $APP Eureka'da YOK"
  fi
done

# Eureka IP check (should not be 127.0.0.1)
for APP in PERMISSION-SERVICE REPORT-SERVICE; do
  HOST=$(curl -s -H "Accept: application/json" "http://127.0.0.1:8761/eureka/apps/$APP" 2>/dev/null | python3 -c "
import sys,json
try:
  d=json.load(sys.stdin)
  i=d['application']['instance']
  i=i[0] if isinstance(i,list) else i
  print(i.get('hostName','?'))
except: print('?')
" 2>/dev/null)
  if [[ "$HOST" == "127.0.0.1" ]]; then
    fail "D: $APP Eureka host=127.0.0.1 (container IP olmalı)"
  elif [[ "$HOST" == "?" ]]; then
    warn "D: $APP Eureka bilgisi alınamadı"
  else
    pass "D: $APP Eureka host=$HOST"
  fi
done

# ── E. Endpoint sağlık kontrolü ──────────────────────────────────

echo ""
echo "[E] Endpoint sağlık kontrolü"

check_endpoint() {
  local name="$1" url="$2" expected="${3:-200}"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
  if [[ "$code" == "$expected" ]]; then
    pass "E: $name → $code"
  else
    fail "E: $name → $code (beklenen: $expected)"
  fi
}

check_endpoint "shell (nginx)" "https://ai.acik.com/"
check_endpoint "authz/me" "https://ai.acik.com/api/v1/authz/me"
check_endpoint "reports" "https://ai.acik.com/api/v1/reports?page=1"
check_endpoint "keycloak" "https://ai.acik.com/realms/serban"
check_endpoint "users-mfe" "https://ai.acik.com/remotes/users/remoteEntry.js"
check_endpoint "gateway health" "http://127.0.0.1:8080/actuator/health"

# ── F. Nginx proxy tutarlılığı ───────────────────────────────────

echo ""
echo "[F] Nginx proxy kontrolü"

NGINX_CONF="/home/halil/platform/web/nginx/default.conf"
if [[ -f "$NGINX_CONF" ]]; then
  # /api/ should go to 127.0.0.1:8080 (gateway)
  API_PROXY=$(grep -A2 "location /api/" "$NGINX_CONF" | grep proxy_pass | head -1 | grep -oP "http://[^ ;]+")
  if [[ "$API_PROXY" == "http://127.0.0.1:8080" ]]; then
    pass "F1: /api/ → gateway (127.0.0.1:8080)"
  else
    fail "F1: /api/ → $API_PROXY (beklenen: 127.0.0.1:8080)"
  fi

  # /realms/ should go to keycloak container IP (not 127.0.0.1)
  REALM_PROXY=$(grep -A5 "location /realms/" "$NGINX_CONF" | grep proxy_pass | head -1 | grep -oP "http://[^ ;]+")
  if [[ "$REALM_PROXY" == *"127.0.0.1"* ]]; then
    fail "F2: /realms/ → $REALM_PROXY (keycloak container IP olmalı)"
  else
    pass "F2: /realms/ → $REALM_PROXY (keycloak)"
  fi
fi

# ── Sonuç ────────────────────────────────────────────────────────

echo ""
echo "═══════════════════════════════════════════"
if [[ $ERRORS -eq 0 ]]; then
  echo -e "  ${GREEN}PASS${NC}  $ERRORS hata, $WARNINGS uyarı"
else
  echo -e "  ${RED}FAIL${NC}  $ERRORS hata, $WARNINGS uyarı"
fi
echo "═══════════════════════════════════════════"
exit $ERRORS
