#!/usr/bin/env bash
set -euo pipefail

ports=(3000 3001 3002 3003 3004 3005 3006 3007)
for port in "${ports[@]}"; do
  if lsof -tiTCP:"$port" -sTCP:LISTEN -Pn >/dev/null 2>&1; then
    pids=$(lsof -tiTCP:"$port" -sTCP:LISTEN -Pn)
    if [[ "${WEB_RUNTIME_STOP_SILENT:-0}" != "1" ]]; then
      echo "[stop-web] port $port -> kill $pids"
    fi
    kill $pids >/dev/null 2>&1 || true
  elif [[ "${WEB_RUNTIME_STOP_SILENT:-0}" != "1" ]]; then
    echo "[stop-web] port $port not listening"
  fi
done

if [[ "${WEB_RUNTIME_STOP_SILENT:-0}" != "1" ]]; then
  echo "[ok] Web dev server stop signal gonderildi"
fi
