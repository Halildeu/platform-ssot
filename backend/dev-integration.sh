#!/usr/bin/env bash
set -euo pipefail

# Start full stack in INTEGRATION mode (prod-like auth, local infra)
#
# Usage: cd backend && ./dev-integration.sh
#
# Profiles:
#   dev (default)   → local,docker     → permitAll, no JWT
#   integration     → docker,integration → Keycloak JWT, OpenFGA, real auth flow
#   prod            → prod              → Vault + prod DNS
#
# This script starts backend with JWT enabled so you can test
# authorization flows identical to production.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "🔐 Starting backend in INTEGRATION mode (JWT enabled)"

export USER_SERVICE_PROFILES=docker,integration
export AUTH_SERVICE_PROFILES=docker,integration
export VARIANT_SERVICE_PROFILES=docker,integration
export CORE_DATA_SERVICE_PROFILES=docker,integration
export API_GATEWAY_PROFILES=docker,integration
export PERMISSION_SERVICE_PROFILES=docker,integration
export REPORT_SERVICE_PROFILES=docker,integration

docker compose up -d

echo ""
echo "✅ Backend running in integration mode"
echo "   Keycloak: http://localhost:8081 (admin/admin)"
echo "   Gateway:  http://localhost:8080 (JWT required)"
echo "   Eureka:   http://localhost:8761"
echo ""
echo "📋 To start frontend in keycloak mode:"
echo "   cd web/apps/mfe-shell"
echo "   AUTH_MODE=keycloak VITE_AUTH_MODE=keycloak VITE_KEYCLOAK_URL=http://localhost:8081 npx vite --port 3000"
echo ""
echo "🔄 To switch back to dev mode:"
echo "   docker compose up -d  (without this script)"
