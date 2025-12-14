#!/usr/bin/env bash
set -euo pipefail

# Backend için otomatik test runner wrapper.
#
# Kullanım (repo kökünden):
#   ./scripts/run_tests_backend.sh          # Tüm modüller için mvn test
#   ./scripts/run_tests_backend.sh user-service   # Sadece belirli modül
#
# Not:
# - Varsayılan davranış tüm multi-module Maven projesi için test çalıştırmaktır.
# - Belirli bir servis/test için performans gerekirse modül adı verilerek
#   daha hedefli test çalıştırılabilir.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"

echo "[run_tests_backend] Root: $ROOT_DIR"

if [[ ! -d "$BACKEND_DIR" ]]; then
  echo "[run_tests_backend] HATA: backend/ klasörü bulunamadı: $BACKEND_DIR" >&2
  exit 1
fi

if [[ ! -x "$BACKEND_DIR/mvnw" ]]; then
  echo "[run_tests_backend] HATA: backend/mvnw bulunamadı veya çalıştırılamıyor: $BACKEND_DIR/mvnw" >&2
  exit 1
fi

cd "$BACKEND_DIR"

MODULE="${1:-}"

if [[ -n "$MODULE" ]]; then
  echo "[run_tests_backend] ./mvnw -q -pl $MODULE test (cwd=$BACKEND_DIR)"
  ./mvnw -q -pl "$MODULE" test
else
  echo "[run_tests_backend] ./mvnw -q test (cwd=$BACKEND_DIR)"
  ./mvnw -q test
fi

echo "[run_tests_backend] Backend testleri başarıyla tamamlandı ✅"
