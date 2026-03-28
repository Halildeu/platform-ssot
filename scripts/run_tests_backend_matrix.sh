#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPORT_DIR="$ROOT_DIR/.cache/reports/backend_test_matrix"
MATRIX_ID="${BACKEND_TEST_MATRIX_ID:-$(date -u +%Y%m%dT%H%M%SZ)-$$}"
INCLUDE_UPSTREAM="${BACKEND_TEST_INCLUDE_UPSTREAM:-1}"
DEFAULT_MATRIX="${BACKEND_TEST_MATRIX_DEFAULT:-user-service api-gateway variant-service core-data-service}"

usage() {
  cat <<'EOF'
Kullanim:
  ./scripts/run_tests_backend_matrix.sh
  ./scripts/run_tests_backend_matrix.sh user-service api-gateway

Opsiyonel env:
  BACKEND_TEST_INCLUDE_UPSTREAM=1   -> modul kosularina -am ekler (varsayilan)
  BACKEND_TEST_MATRIX_ID=<id>       -> log dosyalari icin ortak kimlik
  BACKEND_TEST_MATRIX_DEFAULT=...   -> arguman verilmezse kullanilacak varsayilan matrix
EOF
}

normalize_modules() {
  local raw="$1"
  raw="${raw//,/ }"
  printf '%s\n' "$raw"
}

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
  exit 0
fi

mkdir -p "$REPORT_DIR"

declare -a MODULES=()
declare -a INPUT_TOKENS=()
if [[ $# -eq 0 ]]; then
  echo "[run_tests_backend_matrix] Varsayilan matrix kullaniliyor: $DEFAULT_MATRIX"
  while IFS= read -r normalized; do
    for module in $normalized; do
      if [[ -n "$module" ]]; then
        INPUT_TOKENS+=("$module")
      fi
    done
  done < <(normalize_modules "$DEFAULT_MATRIX")
else
  for token in "$@"; do
    INPUT_TOKENS+=("$token")
  done
fi

for token in "${INPUT_TOKENS[@]}"; do
  while IFS= read -r normalized; do
    for module in $normalized; do
      if [[ -n "$module" ]]; then
        MODULES+=("$module")
      fi
    done
  done < <(normalize_modules "$token")
done

if [[ ${#MODULES[@]} -eq 0 ]]; then
  echo "[run_tests_backend_matrix] HATA: gecerli modul listesi olusmadi" >&2
  exit 1
fi

declare -a PIDS=()
declare -a NAMES=()
declare -a LOGS=()

for module in "${MODULES[@]}"; do
  safe_module="${module//[^A-Za-z0-9._-]/-}"
  run_id="${MATRIX_ID}-${safe_module}"
  log_path="$REPORT_DIR/${run_id}.log"
  cmd=(bash "$ROOT_DIR/scripts/run_tests_backend.sh" --run-id "$run_id")
  if [[ "$INCLUDE_UPSTREAM" == "1" ]]; then
    cmd+=(--with-upstream)
  fi
  cmd+=("$module")

  echo "[run_tests_backend_matrix] ${cmd[*]} -> $log_path"
  (
    cd "$ROOT_DIR"
    "${cmd[@]}"
  ) >"$log_path" 2>&1 &
  PIDS+=("$!")
  NAMES+=("$module")
  LOGS+=("$log_path")
done

failures=0
for idx in "${!PIDS[@]}"; do
  pid="${PIDS[$idx]}"
  module="${NAMES[$idx]}"
  log_path="${LOGS[$idx]}"
  if wait "$pid"; then
    echo "[run_tests_backend_matrix] PASS $module"
  else
    echo "[run_tests_backend_matrix] FAIL $module -> $log_path" >&2
    tail -n 40 "$log_path" >&2 || true
    failures=$((failures + 1))
  fi
done

if [[ "$failures" -gt 0 ]]; then
  echo "[run_tests_backend_matrix] HATA: $failures modul kosusu basarisiz" >&2
  exit 1
fi

echo "[run_tests_backend_matrix] Tum modul kosulari basarili. Loglar: $REPORT_DIR"
