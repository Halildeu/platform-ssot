#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." &> /dev/null && pwd)
REPO_ROOT=$(cd -- "$ROOT_DIR/.." &> /dev/null && pwd)
LOG_DIR="$ROOT_DIR/logs"
LOG_ARCHIVE_DIR="$LOG_DIR/archive"
STATE_DIR="$REPO_ROOT/.cache/runtime_guard"
SESSION_ID="${WEB_RUNTIME_SESSION_ID:-$(date -u +%Y%m%dT%H%M%SZ)}"
SESSION_CREATED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
SESSION_TSV="$STATE_DIR/web_start_session.${SESSION_ID}.tsv"
SESSION_FILE="${WEB_RUNTIME_SESSION_FILE:-$STATE_DIR/web_start_session.v1.json}"
WEB_RUNTIME_PROFILE="${WEB_RUNTIME_PROFILE:-core}"
WEB_RUNTIME_POSTCHECK="${WEB_RUNTIME_POSTCHECK:-1}"
WEB_RUNTIME_STRICT_WARNINGS="${WEB_RUNTIME_STRICT_WARNINGS:-0}"
WEB_RUNTIME_TAIL="${WEB_RUNTIME_TAIL:-auto}"
WEB_RUNTIME_REPORT="${WEB_RUNTIME_REPORT:-$REPO_ROOT/.cache/reports/web_runtime_guard.v1.json}"
WEB_RUNTIME_WAIT_SECONDS="${WEB_RUNTIME_WAIT_SECONDS:-120}"
WEB_RUNTIME_POLL_INTERVAL="${WEB_RUNTIME_POLL_INTERVAL:-2}"
STARTUP_GUARD_SCRIPT="$ROOT_DIR/scripts/health/check-web-runtime-guard.py"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --profile)
      WEB_RUNTIME_PROFILE="${2:-core}"
      shift 2
      ;;
    *)
      echo "[run-web] bilinmeyen arguman: $1" >&2
      exit 1
      ;;
  esac
done

mkdir -p "$LOG_DIR" "$LOG_ARCHIVE_DIR" "$STATE_DIR"
: > "$SESSION_TSV"

rotate_log() {
  local name="$1"; shift
  local log_path="$1"; shift
  if [[ -f "$log_path" ]]; then
    mv "$log_path" "$LOG_ARCHIVE_DIR/${name}.${SESSION_ID}.log"
  fi
  : > "$log_path"
}

record_session_line() {
  local name="$1"; shift
  local port="$1"; shift
  local status="$1"; shift
  local check_url="$1"; shift
  local log_path="$1"; shift
  local command="$1"; shift
  printf '%s\t%s\t%s\t%s\t%s\t%s\n' "$name" "$port" "$status" "$check_url" "$log_path" "$command" >> "$SESSION_TSV"
}

write_session_json() {
  python3 - "$SESSION_TSV" "$SESSION_FILE" "$SESSION_ID" "$SESSION_CREATED_AT" "$WEB_RUNTIME_PROFILE" <<'PY'
import json
import sys
from pathlib import Path

tsv_path = Path(sys.argv[1])
out_path = Path(sys.argv[2])
session_id = sys.argv[3]
created_at = sys.argv[4]
profile = sys.argv[5]

services = []
for raw_line in tsv_path.read_text(encoding="utf-8").splitlines():
    if not raw_line.strip():
        continue
    name, port, status, check_url, log_path, command = raw_line.split("\t")
    services.append(
        {
            "name": name,
            "port": int(port),
            "status": status,
            "check_url": check_url,
            "log_path": log_path,
            "command": command,
        }
    )

payload = {
    "version": "v1",
    "kind": "web-start-session",
    "session_id": session_id,
    "created_at": created_at,
    "profile": profile,
    "services": services,
}
out_path.parent.mkdir(parents=True, exist_ok=True)
out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
PY
}

service_names_for_profile() {
  case "$WEB_RUNTIME_PROFILE" in
    core)
      printf '%s\n' shell users access audit
      ;;
    remotes)
      printf '%s\n' shell reporting users access
      ;;
    full|all)
      printf '%s\n' shell suggestions ethic ui-kit users access audit reporting
      ;;
    *)
      echo "[run-web] desteklenmeyen profile: $WEB_RUNTIME_PROFILE" >&2
      exit 1
      ;;
  esac
}

service_port() {
  case "$1" in
    shell) printf '3000\n' ;;
    suggestions) printf '3001\n' ;;
    ethic) printf '3002\n' ;;
    ui-kit) printf '3003\n' ;;
    users) printf '3004\n' ;;
    access) printf '3005\n' ;;
    audit) printf '3006\n' ;;
    reporting) printf '3007\n' ;;
    *) return 1 ;;
  esac
}

service_command() {
  case "$1" in
    shell) printf 'cd apps/mfe-shell && exec npx webpack serve --config webpack.dev.js --no-watch-options-stdin\n' ;;
    suggestions) printf 'cd apps/mfe-suggestions && exec npx webpack serve --config webpack.dev.js --no-watch-options-stdin\n' ;;
    ethic) printf 'cd apps/mfe-ethic && exec npx webpack serve --config webpack.dev.js --no-watch-options-stdin\n' ;;
    ui-kit) printf 'cd packages/ui-kit && exec npx webpack serve --config webpack.dev.js --no-watch-options-stdin\n' ;;
    users) printf 'cd apps/mfe-users && exec npx webpack serve --config webpack.dev.js --no-watch-options-stdin\n' ;;
    access) printf 'cd apps/mfe-access && exec npx webpack serve --config webpack.dev.js --no-watch-options-stdin\n' ;;
    audit) printf 'cd apps/mfe-audit && exec npx webpack serve --config webpack.dev.js --hot --no-watch-options-stdin\n' ;;
    reporting) printf 'cd apps/mfe-reporting && exec npx webpack serve --config webpack.dev.js --no-watch-options-stdin\n' ;;
    *) return 1 ;;
  esac
}

service_check_url() {
  case "$1" in
    shell) printf 'http://127.0.0.1:3000/\n' ;;
    suggestions) printf 'http://127.0.0.1:3001/remoteEntry.js\n' ;;
    ethic) printf 'http://127.0.0.1:3002/remoteEntry.js\n' ;;
    ui-kit) printf 'http://127.0.0.1:3003/remoteEntry.js\n' ;;
    users) printf 'http://127.0.0.1:3004/remoteEntry.js\n' ;;
    access) printf 'http://127.0.0.1:3005/remoteEntry.js\n' ;;
    audit) printf 'http://127.0.0.1:3006/remoteEntry.js\n' ;;
    reporting) printf 'http://127.0.0.1:3007/remoteEntry.js\n' ;;
    *) return 1 ;;
  esac
}

WEB_RUNTIME_STOP_SILENT=1 "$ROOT_DIR/scripts/health/stop-dev-servers.sh" >/dev/null 2>&1 || true

selected_logs=()
while IFS= read -r service_name; do
  [[ -n "$service_name" ]] || continue
  port="$(service_port "$service_name")"
  command="$(service_command "$service_name")"
  check_url="$(service_check_url "$service_name")"
  log_path="$LOG_DIR/${service_name}.log"
  rotate_log "$service_name" "$log_path"
  printf '[session] %s %s\n' "$SESSION_ID" "$SESSION_CREATED_AT" >> "$log_path"
  echo "[run-web] $service_name (port $port) -> $log_path"
  python3 - "$ROOT_DIR" "$log_path" "$command" <<'PY'
import subprocess
import sys
from pathlib import Path

root_dir = Path(sys.argv[1])
log_path = Path(sys.argv[2])
command = sys.argv[3]

with log_path.open("ab", buffering=0) as log_file:
    subprocess.Popen(
        command,
        cwd=root_dir,
        shell=True,
        executable="/bin/bash",
        stdin=subprocess.DEVNULL,
        stdout=log_file,
        stderr=log_file,
        start_new_session=True,
    )
PY
  record_session_line "$service_name" "$port" "started" "$check_url" "$log_path" "$command"
  selected_logs+=("$log_path")
done < <(service_names_for_profile)

write_session_json

echo "[ok] Web startup session file: $SESSION_FILE"

if [[ "$WEB_RUNTIME_POSTCHECK" == "1" && -f "$STARTUP_GUARD_SCRIPT" ]]; then
  guard_args=(
    "$STARTUP_GUARD_SCRIPT"
    --session-file "$SESSION_FILE"
    --report "$WEB_RUNTIME_REPORT"
    --wait-seconds "$WEB_RUNTIME_WAIT_SECONDS"
    --poll-interval "$WEB_RUNTIME_POLL_INTERVAL"
  )
  if [[ "$WEB_RUNTIME_STRICT_WARNINGS" == "1" ]]; then
    guard_args+=(--strict-warnings)
  fi
  python3 "${guard_args[@]}"
  echo "[ok] Web runtime guard report: $WEB_RUNTIME_REPORT"
else
  echo "[info] Web runtime guard skipped (WEB_RUNTIME_POSTCHECK=$WEB_RUNTIME_POSTCHECK)"
fi

tail_mode="$WEB_RUNTIME_TAIL"
if [[ "$tail_mode" == "auto" ]]; then
  if [[ -t 1 ]]; then
    tail_mode="1"
  else
    tail_mode="0"
  fi
fi

if [[ "$tail_mode" == "1" ]]; then
  cleanup() {
    WEB_RUNTIME_STOP_SILENT=1 "$ROOT_DIR/scripts/health/stop-dev-servers.sh" >/dev/null 2>&1 || true
  }
  trap cleanup EXIT INT TERM
  echo "[ok] Web dev server loglari tail modunda izleniyor. Cikmak icin Ctrl+C."
  tail -n 20 -f "${selected_logs[@]}"
fi
