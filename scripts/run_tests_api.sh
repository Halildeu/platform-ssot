#!/usr/bin/env bash
set -euo pipefail

# API lane için contract/docs + compile doğrulama wrapper.
#
# Kullanım (repo kökünden):
#   ./scripts/run_tests_api.sh
#
# Akış:
# 1) Varsa API docs kontrolü
# 2) Varsa backend/mvnw ile compile

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"

if [[ -f "$ROOT_DIR/scripts/check_api_docs.py" ]]; then
  echo "[run_tests_api] python3 scripts/check_api_docs.py"
  python3 "$ROOT_DIR/scripts/check_api_docs.py"
else
  echo "[run_tests_api] check_api_docs.py bulunamadı; API docs kontrolü atlandı."
fi

if [[ ! -d "$BACKEND_DIR" ]]; then
  echo "[run_tests_api] HATA: backend/ klasörü bulunamadı: $BACKEND_DIR" >&2
  exit 1
fi

if [[ ! -x "$BACKEND_DIR/mvnw" ]]; then
  echo "[run_tests_api] HATA: backend/mvnw bulunamadı veya çalıştırılamıyor: $BACKEND_DIR/mvnw" >&2
  exit 1
fi

echo "[run_tests_api] backend build guard wrapper -> compile"
BACKEND_BUILD_LABEL="${BACKEND_BUILD_LABEL:-api-compile}" \
BACKEND_BUILD_REPORT="${BACKEND_BUILD_REPORT:-$ROOT_DIR/.cache/reports/backend_build_guard.v1.json}" \
  bash "$BACKEND_DIR/scripts/health/run-backend-build-guard.sh" --label api-compile -- -q -DskipTests compile

echo "[run_tests_api] API lane kontrolleri başarıyla tamamlandı ✅"
