#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="${ROOT_DIR}/backend"
TMP_FILE="/tmp/check_security_backend.$$"
SECRET_ASSIGNMENT_PATTERN='(?i)(password|secret|api[_-]?key|token)\s*[:=]\s*(?!\$\{|\$[A-Z_]+|envVars\.|process\.env\.|__ENV\.)(?!.*(change[-_]?me|placeholder|postgres|admin1234|dev-secret|example|your_))[A-Za-z0-9_./@:+-]{20,}'

if [[ ! -d "${BACKEND_DIR}" ]]; then
  echo "[check_security_backend] HATA: backend/ klasoru bulunamadi." >&2
  exit 1
fi

if ! command -v rg >/dev/null 2>&1; then
  echo "[check_security_backend] HATA: rg gerekli." >&2
  exit 2
fi

COMMON_GLOBS=(
  --glob '!docs/**'
  --glob '!**/legacy/**'
  --glob '!**/target/**'
  --glob '!**/.git/**'
  --glob '!**/src/main/java/**'
  --glob '!**/src/test/**'
  --glob '!**/mvnw'
  --glob '!**/mvnw.cmd'
  --glob '!**/*.example'
  --glob '!**/.env.example'
  --glob '!**/application-local.properties'
  --glob '!**/application-docker.properties'
  --glob '!**/docker-compose*.yml'
  --glob '!**/devops/**'
  --glob '!**/packages/**'
  --glob '!**/scripts/perf/**'
  --glob '!**/scripts/vault/**'
  --glob '!**/scripts/test-users-and-variants.sh'
  --glob '!**/infra/**'
)

run_search() {
  local label="$1"
  local pattern="$2"
  echo "[check_security_backend] Kontrol: $label"
  if rg -n --pcre2 "$pattern" "${BACKEND_DIR}" "${COMMON_GLOBS[@]}" >"${TMP_FILE}" 2>/dev/null; then
    echo "[WARN] $label icin potansiyel bulgular:"
    cat "${TMP_FILE}"
    echo
    return 1
  fi
  echo "[OK]   $label icin supheli satir bulunamadi."
  return 0
}

fail=0
run_search "Private key icerigi" 'BEGIN\s+PRIVATE\s+KEY' || fail=1
run_search "AWS benzeri access key" 'AKIA[0-9A-Z]{16}' || fail=1
run_search "Supheli literal secret assignment" "$SECRET_ASSIGNMENT_PATTERN" || fail=1
rm -f "${TMP_FILE}" 2>/dev/null || true

if [[ $fail -ne 0 ]]; then
  echo "[check_security_backend] Incelenmesi gereken backend security bulgulari var ❌"
  exit 1
fi

echo "[check_security_backend] Backend security lint temiz ✅"
