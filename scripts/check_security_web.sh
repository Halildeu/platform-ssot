#!/usr/bin/env bash
set -euo pipefail

# Web için security kontrollerini (SRI ve CSP özetleri) tetikleyen script.
#
# Kullanım (repo kökünden):
#   ./scripts/check_security_web.sh
#
# Davranış:
# - web/ klasörüne geçer.
# - Aşağıdaki komutları çalıştırır:
#   - npm run security:sri:check
#   - npm run security:csp:summary

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB_DIR="$ROOT_DIR/web"

if [[ ! -d "$WEB_DIR" ]]; then
  echo "[check_security_web] HATA: web/ klasörü bulunamadı." >&2
  exit 1
fi

cd "$WEB_DIR"

echo "[check_security_web] npm run security:sri:check"
npm run security:sri:check

echo "[check_security_web] npm run security:csp:summary"
npm run security:csp:summary

echo "[check_security_web] Web security kontrolleri (SRI + CSP) başarıyla tamamlandı ✅"
exit 0

