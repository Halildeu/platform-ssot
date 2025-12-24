#!/usr/bin/env bash
set -euo pipefail

FAILURE_MD="${1:-${FAILURE_MD:-}}"
if [[ -z "${FAILURE_MD}" || ! -f "${FAILURE_MD}" ]]; then
  echo "[codex-fix] ERROR: FAILURE.md not found (arg1 or FAILURE_MD env)."
  exit 2
fi

mkdir -p .autopilot-tmp
PROMPT_FILE=".autopilot-tmp/CODEX_FIX_PROMPT.md"

cat > "${PROMPT_FILE}" <<'MD'
You are an automated fixer running locally in the repo working tree.

Rules (mandatory):
- Follow AGENT-CODEX.md rules.
- Smallest possible change. No refactor.
- Do NOT print or request any secrets/tokens.
- Only change files required to fix the failure.
- Run the failing command(s) locally after the fix.
- Do NOT commit or push; the caller script will handle git commit/push.

Input failure report (FAILURE.md) is attached below.
MD

echo "" >> "${PROMPT_FILE}"
echo "---- FAILURE.md ----" >> "${PROMPT_FILE}"
cat "${FAILURE_MD}" >> "${PROMPT_FILE}"

CODEX_BIN="${CODEX_BIN:-codex}"
CODEX_EXEC_ARGS="${CODEX_EXEC_ARGS:---dangerously-bypass-approvals-and-sandbox --sandbox danger-full-access}"

echo "[codex-fix] Running Codex exec (prompt: ${PROMPT_FILE})"
"${CODEX_BIN}" exec ${CODEX_EXEC_ARGS} - < "${PROMPT_FILE}"
