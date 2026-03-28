#!/usr/bin/env bash
# stop-frontend.sh — Tüm frontend MFE'leri durdurur
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PID_FILE="$ROOT_DIR/logs/frontend/.pids"

if [ -f "$PID_FILE" ]; then
  PIDS=$(cat "$PID_FILE")
  echo "Durduruluyor: $PIDS"
  kill $PIDS 2>/dev/null || true
  rm -f "$PID_FILE"
fi

# Portları da temizle (zombie process)
for port in 3000 3004 3005 3006 3007; do
  pid=$(lsof -ti:$port 2>/dev/null || true)
  if [ -n "$pid" ]; then
    kill -9 $pid 2>/dev/null || true
    echo "Port $port temizlendi"
  fi
done

echo "✓ Tüm frontend servisleri durduruldu"
