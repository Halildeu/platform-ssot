#!/usr/bin/env bash
set -euo pipefail

# Finds a docker compose file that contains "vault" service.
#
# Output: prints the compose file path (relative to repo root) to stdout.
# Exit codes:
# - 0: found
# - 2: not found

match_vault_service() {
  if command -v rg >/dev/null 2>&1; then
    rg -x "vault" >/dev/null
  else
    grep -x "vault" >/dev/null
  fi
}

for f in $(find . -maxdepth 4 -type f \( -name "docker-compose.yml" -o -name "docker-compose.*.yml" \) | sort); do
  if docker compose -f "$f" config --services 2>/dev/null | match_vault_service; then
    echo "$f"
    exit 0
  fi
done

echo "[error] no docker-compose file with vault service found" >&2
exit 2

