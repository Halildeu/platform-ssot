#!/usr/bin/env bash
set -euo pipefail

DIR=".autopilot-tmp/codex-chatlog"
mkdir -p "$DIR"

DAY="$(date -u +%Y%m%d)"
TODAY="${DIR}/${DAY}.md"
touch "$TODAY"

# latest.md her zaman bugünü göstersin:
# Symlink desteklenmiyorsa kopya/pointer fallback: en basit güvenli yol → symlink dene, olmazsa file copy.
rm -f "${DIR}/latest.md"
ln -s "${DAY}.md" "${DIR}/latest.md" 2>/dev/null || cp -f "$TODAY" "${DIR}/latest.md"

echo "[codex_chatlog_set_latest] latest -> ${DAY}.md"
