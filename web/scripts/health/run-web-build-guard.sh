#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." &> /dev/null && pwd)
REPO_ROOT=$(cd -- "$ROOT_DIR/.." &> /dev/null && pwd)
LOG_DIR="$ROOT_DIR/logs"
LOG_ARCHIVE_DIR="$LOG_DIR/archive"
STATE_DIR="$REPO_ROOT/.cache/build_guard"
SESSION_ID="${WEB_BUILD_SESSION_ID:-$(date -u +%Y%m%dT%H%M%SZ)}"
WEB_BUILD_SCRIPT="${WEB_BUILD_SCRIPT:-build:raw}"
WEB_BUILD_LABEL="${WEB_BUILD_LABEL:-build}"
WEB_BUILD_REPORT="${WEB_BUILD_REPORT:-$REPO_ROOT/.cache/reports/web_build_guard.v1.json}"
WEB_BUILD_STRICT_WARNINGS="${WEB_BUILD_STRICT_WARNINGS:-0}"
CHECKER_SCRIPT="$ROOT_DIR/scripts/health/check-web-build-guard.py"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --script)
      WEB_BUILD_SCRIPT="${2:-$WEB_BUILD_SCRIPT}"
      shift 2
      ;;
    --label)
      WEB_BUILD_LABEL="${2:-$WEB_BUILD_LABEL}"
      shift 2
      ;;
    --report)
      WEB_BUILD_REPORT="${2:-$WEB_BUILD_REPORT}"
      shift 2
      ;;
    *)
      echo "[run-web-build-guard] bilinmeyen arguman: $1" >&2
      exit 1
      ;;
  esac
done

mkdir -p "$LOG_DIR" "$LOG_ARCHIVE_DIR" "$STATE_DIR"
LOG_PATH="$LOG_DIR/${WEB_BUILD_LABEL}.log"
if [[ -f "$LOG_PATH" ]]; then
  mv "$LOG_PATH" "$LOG_ARCHIVE_DIR/${WEB_BUILD_LABEL}.${SESSION_ID}.log"
fi

if [[ "${NODE_OPTIONS:-}" != *"--max-old-space-size="* ]]; then
  export NODE_OPTIONS="${NODE_OPTIONS:-} --max-old-space-size=6144"
fi
export BROWSERSLIST_IGNORE_OLD_DATA="${BROWSERSLIST_IGNORE_OLD_DATA:-1}"

echo "[run-web-build-guard] npm run $WEB_BUILD_SCRIPT (cwd=$ROOT_DIR)"
set +e
(
  cd "$ROOT_DIR"
  npm run "$WEB_BUILD_SCRIPT"
) 2>&1 | tee "$LOG_PATH"
npm_rc=${PIPESTATUS[0]}
set -e

guard_args=(
  "$CHECKER_SCRIPT"
  --log "$LOG_PATH"
  --report "$WEB_BUILD_REPORT"
  --label "$WEB_BUILD_LABEL"
  --command "npm run $WEB_BUILD_SCRIPT"
)
if [[ "$WEB_BUILD_STRICT_WARNINGS" == "1" ]]; then
  guard_args+=(--strict-warnings)
fi

set +e
python3 "${guard_args[@]}"
guard_rc=$?
set -e

if [[ "$npm_rc" -ne 0 ]]; then
  exit "$npm_rc"
fi
if [[ "$guard_rc" -ne 0 ]]; then
  exit "$guard_rc"
fi

echo "[ok] Web build guard report: $WEB_BUILD_REPORT"
