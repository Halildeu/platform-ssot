#!/usr/bin/env bash
set -euo pipefail

# Codex Fix Runner (v0.1)
# - Local SSOT: Fix üretimi yalnızca localde yapılır.
# - Token/secret değerleri ASLA loglanmaz.
# - Guardrails: allowlist + max change size.

FAILURE_MD="${1:-${FAILURE_MD:-}}"
if [[ -z "${FAILURE_MD}" || ! -f "${FAILURE_MD}" ]]; then
  echo "[codex-fix] ERROR: FAILURE.md not found (arg1 or FAILURE_MD env)." >&2
  exit 2
fi

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "${REPO_ROOT}"

ALLOWLIST_RE='^(docs/|scripts/|\.github/workflows/)'
MAX_FILES="${CODEX_FIX_MAX_FILES:-20}"
MAX_LINES="${CODEX_FIX_MAX_LINES:-500}"

BEFORE_SHA="$(git rev-parse HEAD)"

mkdir -p .autopilot-tmp
PROMPT_PATH=".autopilot-tmp/CODEX_FIX_PROMPT.md"

cat > "${PROMPT_PATH}" <<'MD'
You are an automated fixer running locally in the repo working tree.

Rules (mandatory):
- Follow AGENT-CODEX.core.md and Local SSOT policy (no GitHub-side auto-fix).
- Smallest possible change. No refactor.
- Do NOT print or request any secrets/tokens.
- Only change files required to fix the failure.
- Allowed paths (v0.1): docs/**, scripts/**, .github/workflows/**
- Hard limits (v0.1): max 20 files, max 500 changed lines (added+deleted).

Goal:
- Fix the failures described in FAILURE.md (and referenced run-*.log files).
- Prefer deterministic, minimal patches.
- If you cannot safely fix: explain why and exit non-zero.

Input failure report (FAILURE.md) is attached below.
MD

{
  echo ""
  echo "---- FAILURE.md ----"
  cat "${FAILURE_MD}"
} >> "${PROMPT_PATH}"

CODEX_CMD="${CODEX_CMD:-codex}"
if ! command -v "${CODEX_CMD}" >/dev/null 2>&1; then
  echo "[codex-fix] ERROR: CODEX_CMD not found on PATH: ${CODEX_CMD}" >&2
  echo "[codex-fix] Prompt written: ${PROMPT_PATH}" >&2
  exit 2
fi

echo "[codex-fix] Running Codex (prompt: ${PROMPT_PATH})"
"${CODEX_CMD}" "${PROMPT_PATH}"

# Guardrail check against the repo state BEFORE_SHA -> current working tree.
CHANGED_FILES="$(git diff --name-only "${BEFORE_SHA}")"
if [[ -z "${CHANGED_FILES}" ]]; then
  AFTER_SHA="$(git rev-parse HEAD)"
  if [[ "${AFTER_SHA}" == "${BEFORE_SHA}" ]]; then
    echo "[codex-fix] No changes detected; stopping." >&2
    exit 3
  fi
fi

BAD_FILES=""
COUNT_FILES=0
while IFS= read -r f; do
  [[ -z "${f}" ]] && continue
  COUNT_FILES=$((COUNT_FILES + 1))
  if [[ ! "${f}" =~ ${ALLOWLIST_RE} ]]; then
    BAD_FILES="${BAD_FILES}${f}"$'\n'
  fi
done <<< "${CHANGED_FILES}"

if [[ -n "${BAD_FILES}" ]]; then
  echo "[codex-fix] ERROR: changes outside allowlist:" >&2
  echo "${BAD_FILES}" >&2
  exit 4
fi

if [[ "${COUNT_FILES}" -gt "${MAX_FILES}" ]]; then
  echo "[codex-fix] ERROR: too many changed files (${COUNT_FILES} > ${MAX_FILES})" >&2
  exit 4
fi

TOTAL_LINES="$(git diff --numstat "${BEFORE_SHA}" | python3 - <<'PY'
import sys
total=0
for line in sys.stdin:
  parts=line.strip().split("\t")
  if len(parts) < 3:
    continue
  a,d=parts[0],parts[1]
  if a.isdigit():
    total += int(a)
  if d.isdigit():
    total += int(d)
print(total)
PY
)"

if [[ "${TOTAL_LINES}" -gt "${MAX_LINES}" ]]; then
  echo "[codex-fix] ERROR: too many changed lines (${TOTAL_LINES} > ${MAX_LINES})" >&2
  exit 4
fi

echo "[codex-fix] Guardrails OK: files=${COUNT_FILES} lines=${TOTAL_LINES}"
exit 0
