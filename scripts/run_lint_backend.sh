#!/usr/bin/env bash
set -euo pipefail

# Backend için temel Maven lint / derleme kontrolü.
#
# Kullanım (repo kökünden):
#   ./scripts/run_lint_backend.sh
#
# Şu an için:
#   - ./mvnw -q -DskipTests compile
# çalıştırır. İleride Checkstyle / SpotBugs vs. eklendiğinde
# bu script genişletilebilir.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"

echo "[run_lint_backend] Root: $ROOT_DIR"

if [[ ! -d "$BACKEND_DIR" ]]; then
  echo "[run_lint_backend] HATA: backend/ klasörü bulunamadı: $BACKEND_DIR" >&2
  exit 1
fi

if [[ ! -x "$BACKEND_DIR/mvnw" ]]; then
  echo "[run_lint_backend] HATA: backend/mvnw bulunamadı veya çalıştırılamıyor: $BACKEND_DIR/mvnw" >&2
  exit 1
fi

cd "$BACKEND_DIR"

echo "[run_lint_backend] ./mvnw -q -DskipTests compile (cwd=$BACKEND_DIR)"
./mvnw -q -DskipTests compile

echo "[run_lint_backend] Backend compile / basic check başarıyla tamamlandı ✅"
