#!/usr/bin/env bash
# dev-frontend.sh — Tek komutla tüm frontend MFE'leri başlatır
# Kullanım: cd web && ./scripts/dev-frontend.sh
#
# Başlatılan servisler:
#   Port 3000 — mfe-shell (ana uygulama)
#   Port 3004 — mfe-users (kullanıcı yönetimi)
#   Port 3007 — mfe-reporting (raporlar)
#
# Not: design-system MFE (3004) ve mfe-users aynı portu kullanıyor.
#   Bu script mfe-users'ı tercih eder (shell onu bekliyor).
#   Design Lab için ayrı bir tab'da `cd packages/design-system && npm start` çalıştırın.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; }

# ── Portları temizle ──
echo -e "\n${BOLD}━━━ Frontend Dev Servers ━━━${NC}\n"

for port in 3000 3004 3005 3006 3007; do
  pid=$(lsof -ti:$port 2>/dev/null || true)
  if [ -n "$pid" ]; then
    kill -9 $pid 2>/dev/null || true
    warn "Port $port temizlendi (PID: $pid)"
  fi
done
sleep 2

# ── Log dizini ──
LOG_DIR="$ROOT_DIR/logs/frontend"
mkdir -p "$LOG_DIR"

# ── Auth modu ──
export AUTH_MODE="${AUTH_MODE:-permitAll}"
export VITE_ENABLE_FAKE_AUTH="${VITE_ENABLE_FAKE_AUTH:-true}"

log "AUTH_MODE=$AUTH_MODE"

# ── Shell (3000) ──
cd "$ROOT_DIR/apps/mfe-shell"
nohup npx webpack serve --config webpack.dev.js > "$LOG_DIR/shell.log" 2>&1 &
SHELL_PID=$!
log "mfe-shell başlatıldı (PID: $SHELL_PID, port: 3000)"

# ── Users (3004) ──
cd "$ROOT_DIR/apps/mfe-users"
nohup npx webpack serve --config webpack.dev.js > "$LOG_DIR/users.log" 2>&1 &
USERS_PID=$!
log "mfe-users başlatıldı (PID: $USERS_PID, port: 3004)"

# ── Reporting (3007) ──
cd "$ROOT_DIR/apps/mfe-reporting"
nohup npx webpack serve --config webpack.dev.js > "$LOG_DIR/reporting.log" 2>&1 &
REPORTING_PID=$!
log "mfe-reporting başlatıldı (PID: $REPORTING_PID, port: 3007)"

# ── Sağlık kontrolü ──
echo ""
log "Webpack derlenmeyi bekliyor..."
sleep 5

MAX_WAIT=60
ELAPSED=0
ALL_UP=false

while [ $ELAPSED -lt $MAX_WAIT ]; do
  SHELL_OK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ 2>/dev/null || echo "000")
  USERS_OK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3004/remoteEntry.js 2>/dev/null || echo "000")
  REPORT_OK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3007/remoteEntry.js 2>/dev/null || echo "000")

  if [ "$SHELL_OK" = "200" ] && [ "$USERS_OK" = "200" ] && [ "$REPORT_OK" = "200" ]; then
    ALL_UP=true
    break
  fi

  sleep 3
  ELAPSED=$((ELAPSED + 3))
  echo -ne "\r${CYAN}[⏳]${NC} Bekleniyor... ($ELAPSED/$MAX_WAIT s) — Shell:$SHELL_OK Users:$USERS_OK Report:$REPORT_OK"
done

echo ""
if [ "$ALL_UP" = "true" ]; then
  echo -e "\n${BOLD}${GREEN}━━━ Tüm Frontend Servisleri Hazır ━━━${NC}\n"
  log "Shell:    http://localhost:3000  ✅"
  log "Users:    http://localhost:3004  ✅"
  log "Reporting: http://localhost:3007  ✅"
  echo ""
  log "Tarayıcıda aç: http://localhost:3000"
else
  echo -e "\n${BOLD}${YELLOW}━━━ Bazı Servisler Henüz Hazır Değil ━━━${NC}\n"
  [ "$SHELL_OK" = "200" ] && log "Shell: ✅" || warn "Shell: ❌ (log: $LOG_DIR/shell.log)"
  [ "$USERS_OK" = "200" ] && log "Users: ✅" || warn "Users: ❌ (log: $LOG_DIR/users.log)"
  [ "$REPORT_OK" = "200" ] && log "Reporting: ✅" || warn "Reporting: ❌ (log: $LOG_DIR/reporting.log)"
  echo ""
  warn "Webpack derlenmesi devam ediyor olabilir. 30 saniye daha bekleyin."
fi

echo ""
log "Loglar: $LOG_DIR/"
log "Durdurmak için: kill $SHELL_PID $USERS_PID $REPORTING_PID"

# PID dosyası kaydet
echo "$SHELL_PID $USERS_PID $REPORTING_PID" > "$LOG_DIR/.pids"
log "PID'ler kaydedildi: $LOG_DIR/.pids"
