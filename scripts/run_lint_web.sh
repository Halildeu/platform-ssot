#!/usr/bin/env bash
set -euo pipefail

# WEB lint / style kontrollerini tek komutla çalıştıran yardımcı script.
#
# Kullanım (repo kökünden):
#   ./scripts/run_lint_web.sh
#
# Çalıştırdığı adımlar:
#   - python3 scripts/ops_technical_baseline_checklist.py --repo-root .
#   - npm run lint:style
#   - npm run lint:semantic
#   - npm run lint:tailwind
#   - npm run lint:no-antd

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "[run_lint_web] Root: $ROOT_DIR"

if [[ ! -d "$ROOT_DIR/web" ]]; then
  echo "[run_lint_web] HATA: web/ klasörü bulunamadı." >&2
  exit 1
fi

cd "$ROOT_DIR/web"

echo "[run_lint_web] python3 scripts/ops_technical_baseline_checklist.py --repo-root ."
python3 "$ROOT_DIR/scripts/ops_technical_baseline_checklist.py" --repo-root "$ROOT_DIR"

if [[ "${NODE_OPTIONS:-}" != *"--max-old-space-size="* ]]; then
  export NODE_OPTIONS="${NODE_OPTIONS:-} --max-old-space-size=6144"
fi
if [[ "${NODE_OPTIONS:-}" =~ --max-old-space-size=([0-9]+) ]]; then
  echo "[run_lint_web] Node memory: --max-old-space-size=${BASH_REMATCH[1]}"
fi

echo "[run_lint_web] npm run lint:style"
npm run lint:style

echo "[run_lint_web] npm run lint:semantic"
npm run lint:semantic

echo "[run_lint_web] npm run lint:tailwind"
npm run lint:tailwind

echo "[run_lint_web] npm run lint:no-antd"
npm run lint:no-antd

echo "[run_lint_web] Tüm WEB lint adımları başarıyla tamamlandı ✅"
