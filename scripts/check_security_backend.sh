#!/usr/bin/env bash
set -euo pipefail

# Backend için basit statik security/vulnerability kontrol script'i.
#
# Kullanım (repo kökünden):
#   ./scripts/check_security_backend.sh
#
# Davranış:
# - backend/ klasörü içinde bazı riskli pattern'leri (hard-coded secret, private key vb.)
#   arar ve bulunan satırları raporlar.
# - Amaç: Güvenlik review'ü için erken uyarı vermek; nihai karar yine insanlar +
#   detaylı security araçları tarafından verilmelidir.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"

if [[ ! -d "$BACKEND_DIR" ]]; then
  echo "[check_security_backend] HATA: backend/ klasörü bulunamadı." >&2
  exit 1
fi

have_rg=1
if ! command -v rg >/dev/null 2>&1; then
  have_rg=0
fi

fail=0

run_search() {
  local label="$1"
  local pattern="$2"
  local path="$3"

  echo "[check_security_backend] Kontrol: $label"
  if [[ $have_rg -eq 1 ]]; then
    if rg -n "$pattern" "$path" --glob '!target' --glob '!.git' --glob '!*test*' >/tmp/check_security_backend.$$ 2>/dev/null; then
      echo "[WARN] $label için potansiyel bulgular:"
      cat /tmp/check_security_backend.$$
      echo
      fail=1
    else
      echo "[OK]   $label için şüpheli satır bulunamadı."
    fi
  else
    if grep -RInE "$pattern" "$path" --exclude-dir=target --exclude-dir=.git --exclude='*Test.java' >/tmp/check_security_backend.$$ 2>/dev/null; then
      echo "[WARN] $label için potansiyel bulgular (grep):"
      cat /tmp/check_security_backend.$$
      echo
      fail=1
    else
      echo "[OK]   $label için şüpheli satır bulunamadı."
    fi
  fi
}

cd "$ROOT_DIR"

run_search "Hard-coded password" '(?i)password\s*=' "$BACKEND_DIR"
run_search "Private key içeriği" 'BEGIN\s+PRIVATE\s+KEY' "$BACKEND_DIR"
run_search "AWS benzeri access key" 'AKIA[0-9A-Z]{16}' "$BACKEND_DIR"
run_search "Hard-coded secret key" '(?i)(secret_key|api_key|access_token)\s*=' "$BACKEND_DIR"

rm -f /tmp/check_security_backend.$$ 2>/dev/null || true

if [[ $fail -ne 0 ]]; then
  echo "[check_security_backend] Güvenlik açısından incelenmesi gereken satırlar bulundu ❌"
  exit 1
fi

echo "[check_security_backend] Belirlenen basic security kontrolleri için şüpheli satır bulunamadı ✅"
exit 0

