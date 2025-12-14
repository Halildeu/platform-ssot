#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
PORT=4815
ARTIFACT_DIR="$DIR/artifacts"
ARTIFACT_FILE="$ARTIFACT_DIR/gateway-smoke.log"
mkdir -p "$ARTIFACT_DIR"
node "$DIR/mock-gateway-server.mjs" >/tmp/mock-gateway.log 2>&1 &
SERVER_PID=$!
cleanup() {
  if ps -p $SERVER_PID >/dev/null 2>&1; then
    kill $SERVER_PID >/dev/null 2>&1 || true
    wait $SERVER_PID 2>/dev/null || true
  fi
}
trap cleanup EXIT
sleep 1
CMD401="curl -i -s -H 'X-Trace-Id: smoke-401' http://127.0.0.1:$PORT/api/v1/users"
CMD200="curl -i -s -H 'Authorization: Bearer demo-token' -H 'X-Trace-Id: smoke-200' http://127.0.0.1:$PORT/api/v1/users"
{
  echo "$ $CMD401"
  eval "$CMD401"
  echo
  echo "$ $CMD200"
  eval "$CMD200"
} > "$ARTIFACT_FILE"
echo "Gateway smoke log written to $ARTIFACT_FILE"
