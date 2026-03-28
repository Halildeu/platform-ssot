#!/usr/bin/env bash
set -euo pipefail

# Database lane için SQL + migration doğrulama wrapper.
#
# Kullanım (repo kökünden):
#   ./scripts/run_tests_database.sh
#
# Akış:
# 1) Varsa data SQL stil kontrolü (hızlı kalite kapısı)
# 2) Varsa backend/mvnw ile validate (migration/config doğrulaması)

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"

if [[ -f "$ROOT_DIR/scripts/check_data_sql_style.py" ]]; then
  echo "[run_tests_database] python3 scripts/check_data_sql_style.py"
  python3 "$ROOT_DIR/scripts/check_data_sql_style.py"
else
  echo "[run_tests_database] check_data_sql_style.py bulunamadı; SQL style kontrolü atlandı."
fi

if [[ ! -d "$BACKEND_DIR" ]]; then
  echo "[run_tests_database] HATA: backend/ klasörü bulunamadı: $BACKEND_DIR" >&2
  exit 1
fi

if [[ ! -x "$BACKEND_DIR/mvnw" ]]; then
  echo "[run_tests_database] HATA: backend/mvnw bulunamadı veya çalıştırılamıyor: $BACKEND_DIR/mvnw" >&2
  exit 1
fi

cd "$BACKEND_DIR"
echo "[run_tests_database] ./mvnw -q -DskipTests validate (cwd=$BACKEND_DIR)"
./mvnw -q -DskipTests validate

echo "[run_tests_database] Database lane kontrolleri başarıyla tamamlandı ✅"
