#!/usr/bin/env bash
set -euo pipefail

ports=(3000 3001 3002 3003 3004 3005 3006 3007 3008)
stop_wait_seconds="${WEB_RUNTIME_STOP_WAIT_SECONDS:-8}"
stop_poll_interval="${WEB_RUNTIME_STOP_POLL_INTERVAL:-0.25}"
force_kill="0"

port_pids() {
  local port="$1"
  lsof -tiTCP:"$port" -sTCP:LISTEN -Pn 2>/dev/null || true
}

port_is_listening() {
  local port="$1"
  lsof -tiTCP:"$port" -sTCP:LISTEN -Pn >/dev/null 2>&1
}

wait_for_port_release() {
  local port="$1"
  python3 - "$port" "$stop_wait_seconds" "$stop_poll_interval" <<'PY'
import socket
import sys
import time

port = int(sys.argv[1])
timeout = float(sys.argv[2])
interval = float(sys.argv[3])
deadline = time.time() + timeout

def is_listening() -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(0.2)
        return sock.connect_ex(("127.0.0.1", port)) == 0

while time.time() < deadline:
    if not is_listening():
        sys.exit(0)
    time.sleep(interval)

sys.exit(1 if is_listening() else 0)
PY
}

for port in "${ports[@]}"; do
  pids="$(port_pids "$port")"
  if [[ -n "$pids" ]]; then
    if [[ "${WEB_RUNTIME_STOP_SILENT:-0}" != "1" ]]; then
      echo "[stop-web] port $port -> term $pids"
    fi
    kill $pids >/dev/null 2>&1 || true
    if ! wait_for_port_release "$port"; then
      force_kill="1"
      retry_pids="$(port_pids "$port")"
      if [[ -n "$retry_pids" ]]; then
        if [[ "${WEB_RUNTIME_STOP_SILENT:-0}" != "1" ]]; then
          echo "[stop-web] port $port hala dolu -> kill -9 $retry_pids"
        fi
        kill -9 $retry_pids >/dev/null 2>&1 || true
        wait_for_port_release "$port" || true
      fi
    fi
  elif [[ "${WEB_RUNTIME_STOP_SILENT:-0}" != "1" ]]; then
    echo "[stop-web] port $port not listening"
  fi
done

if [[ "${WEB_RUNTIME_STOP_SILENT:-0}" != "1" ]]; then
  if [[ "$force_kill" == "1" ]]; then
    echo "[ok] Web dev serverlar durduruldu (force kill kullanildi)"
  else
    echo "[ok] Web dev serverlar durduruldu"
  fi
fi
