#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

for name in orchestrator tracker; do
  if [ -f ".autopilot-tmp/pids/$name.pid" ]; then
    kill "$(cat ".autopilot-tmp/pids/$name.pid")" 2>/dev/null || true
    rm -f ".autopilot-tmp/pids/$name.pid"
    echo "[ops] stopped $name"
  fi
done

