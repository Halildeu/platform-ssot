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
AG_GRID_KEY_PATTERN='AG_Charts_and_AG_Grid|Enterprise_key|\[TRIAL\]'

if [[ ! -d "$WEB_DIR" ]]; then
  echo "[check_security_web] HATA: web/ klasörü bulunamadı." >&2
  exit 1
fi

echo "[check_security_web] AG Grid lisans anahtarı sızıntı kontrolü"
if git -C "$ROOT_DIR" grep -I -l -E "$AG_GRID_KEY_PATTERN" -- web >/dev/null 2>&1; then
  echo "[check_security_web] HATA: web/ altında AG Grid lisans anahtarı tespit edildi (repo'ya secret koymayın)." >&2
  git -C "$ROOT_DIR" grep -I -l -E "$AG_GRID_KEY_PATTERN" -- web | sed 's/^/[check_security_web]  - /' >&2
  exit 1
fi

cd "$WEB_DIR"

if [[ ! -f dist/users/remoteEntry.js || ! -f dist/suggestions/remoteEntry.js || ! -f dist/ethic/remoteEntry.js || ! -f dist/access/remoteEntry.js || ! -f dist/ui-kit/remoteEntry.js ]]; then
  echo "[check_security_web] publish bundle eksik; npm run security:build-bundle"
  npm run security:build-bundle
fi

echo "[check_security_web] npm run security:sri:check"
npm run security:sri:check

echo "[check_security_web] npm run security:csp:summary"
npm run security:csp:summary

echo "[check_security_web] Web security kontrolleri (SRI + CSP) başarıyla tamamlandı ✅"
exit 0
