#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

echo "=== pids ==="
ls -la .autopilot-tmp/pids 2>/dev/null || true
echo ""

echo "=== tracker tail ==="
tail -n 30 .autopilot-tmp/pids/tracker.log 2>/dev/null || true
echo ""

echo "=== orchestrator tail ==="
tail -n 60 .autopilot-tmp/pids/orchestrator.log 2>/dev/null || true
echo ""

echo "=== STATUS.md head ==="
sed -n '1,120p' .autopilot-tmp/pr-tracker/STATUS.md 2>/dev/null || true
echo ""

echo "=== queue head ==="
head -n 10 .autopilot-tmp/queue/queue.tsv 2>/dev/null || true

