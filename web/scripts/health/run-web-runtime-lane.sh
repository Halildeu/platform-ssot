#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." &> /dev/null && pwd)
REPO_ROOT=$(cd -- "$ROOT_DIR/.." &> /dev/null && pwd)
REPORT_PATH="${WEB_RUNTIME_GUARD_REPORT:-$REPO_ROOT/.cache/reports/web_runtime_guard.v1.json}"

cleanup() {
  WEB_RUNTIME_STOP_SILENT=1 "$ROOT_DIR/scripts/health/stop-dev-servers.sh" >/dev/null 2>&1 || true
}

trap cleanup EXIT

WEB_RUNTIME_STOP_SILENT=1 "$ROOT_DIR/scripts/health/stop-dev-servers.sh" >/dev/null 2>&1 || true
WEB_RUNTIME_PROFILE="${WEB_RUNTIME_PROFILE:-core}" \
WEB_RUNTIME_POSTCHECK=1 \
WEB_RUNTIME_STRICT_WARNINGS=1 \
WEB_RUNTIME_TAIL=0 \
WEB_RUNTIME_REPORT="$REPORT_PATH" \
"$ROOT_DIR/scripts/health/run-dev-servers.sh" --profile "${WEB_RUNTIME_PROFILE:-core}"

echo "[ok] web runtime lane report: $REPORT_PATH"
