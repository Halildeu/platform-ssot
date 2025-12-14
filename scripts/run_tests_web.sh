#!/usr/bin/env bash
set -euo pipefail

# Web için otomatik test runner wrapper.
#
# Kullanım (repo kökünden):
#   ./scripts/run_tests_web.sh           # Varsayılan: unit test (npm test)
#   ./scripts/run_tests_web.sh unit      # Aynı: npm test
#   ./scripts/run_tests_web.sh pw        # Playwright YAML smoke (Seviye 1)
#   ./scripts/run_tests_web.sh pw-nightly# Playwright YAML smoke (Seviye 1+2)
#   ./scripts/run_tests_web.sh e2e       # Cypress e2e testleri
#   ./scripts/run_tests_web.sh quality   # Bundle/perf/a11y kalite turu
#   ./scripts/run_tests_web.sh all       # unit + e2e + quality

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB_DIR="$ROOT_DIR/web"

if [[ ! -d "$WEB_DIR" ]]; then
  echo "[run_tests_web] HATA: web/ klasörü bulunamadı." >&2
  exit 1
fi

MODE="${1:-unit}"

cd "$WEB_DIR"

case "$MODE" in
  unit)
    echo "[run_tests_web] npm test"
    npm test
    ;;
  pw)
    echo "[run_tests_web] npm run pw:ci"
    npm run pw:ci
    ;;
  pw-nightly)
    echo "[run_tests_web] npm run pw:nightly"
    npm run pw:nightly
    ;;
  e2e)
    echo "[run_tests_web] npm run test:e2e"
    npm run test:e2e
    ;;
  quality)
    echo "[run_tests_web] npm run test:quality"
    npm run test:quality
    ;;
  all)
    echo "[run_tests_web] npm test"
    npm test
    echo "[run_tests_web] npm run test:e2e"
    npm run test:e2e
    echo "[run_tests_web] npm run test:quality"
    npm run test:quality
    ;;
  *)
    echo "[run_tests_web] Kullanım: $0 [unit|pw|pw-nightly|e2e|quality|all]" >&2
    exit 1
    ;;
esac

echo "[run_tests_web] Web testleri ($MODE) başarıyla tamamlandı ✅"
