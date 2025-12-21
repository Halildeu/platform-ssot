#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "${ROOT_DIR}"

FAILURE_MD="${1:-${FAILURE_MD:-}}"
if [[ -z "${FAILURE_MD}" || ! -f "${FAILURE_MD}" ]]; then
  echo "[codex-fix] ERROR: FAILURE.md not found (arg1 or FAILURE_MD env)."
  exit 2
fi

# Bu prompt dosyası Codex’e verilecek “iş tanımı”
mkdir -p .autopilot-tmp
PROMPT=".autopilot-tmp/CODEX_FIX_PROMPT.md"

cat > "${PROMPT}" <<'MD'
You are an automated fixer running locally in the repo working tree.

Rules (mandatory):
- Follow AGENT-CODEX.core.md + AGENTS.md rules.
- Smallest possible change. No refactor.
- Do NOT print or request any secrets/tokens.
- Only change files required to fix the failure.
- Run the failing command(s) locally after the fix.
- If PASS: commit with a clear message, then push the current branch.
- If you cannot safely fix: explain why and exit non-zero.

Input failure report (FAILURE.md) is attached below.
MD

echo "" >> "${PROMPT}"
echo "---- FAILURE.md ----" >> "${PROMPT}"
cat "${FAILURE_MD}" >> "${PROMPT}"

# Codex komutu: kendi ortamına göre ayarla.
# Örn: export CODEX_CMD='codex' veya 'openai codex ...' vs.
CODEX_CMD="${CODEX_CMD:-codex}"

echo "[codex-fix] Running: ${CODEX_CMD} (prompt: ${PROMPT})"
"${CODEX_CMD}" "${PROMPT}"
