#!/usr/bin/env bash
set -euo pipefail

REPO="${GITHUB_REPOSITORY:-}"
PR=""
MAX_ATTEMPTS=5
OUT_DIR="artifacts/ci-logs"
FIX_CMD="${AUTOPILOT_FIX_CMD:-}"
ANY_FAIL="${AUTOPILOT_ANY_FAIL:-}"

usage() {
  echo "Usage: $0 --pr <num> [--repo owner/repo] [--max N] [--out dir]"
  echo "Env: GH_TOKEN must be set or gh auth login; token value not printed."
  echo "Env: AUTOPILOT_FIX_CMD optional (command that applies a fix locally)."
  echo "Env: AUTOPILOT_ANY_FAIL=1 optional (treat any failing check as failure; default watches required checks only)."
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo) REPO="$2"; shift 2;;
    --pr) PR="$2"; shift 2;;
    --max) MAX_ATTEMPTS="$2"; shift 2;;
    --out) OUT_DIR="$2"; shift 2;;
    -h|--help) usage; exit 0;;
    *) echo "Unknown arg: $1"; usage; exit 2;;
  esac
done

if [[ -z "${REPO}" || -z "${PR}" ]]; then
  usage; exit 2
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "[autopilot] gh CLI not found. Install gh or set PATH."; exit 2
fi

if [[ -n "${GITHUB_TOKEN:-}" && -z "${GH_TOKEN:-}" ]]; then
  export GH_TOKEN="${GITHUB_TOKEN}"
fi

if ! gh auth status -h github.com >/dev/null 2>&1 && [[ -z "${GH_TOKEN:-}" ]]; then
  echo "[autopilot] gh not authenticated and GH_TOKEN not set."; exit 2
fi

PR_JSON="$(gh api "repos/${REPO}/pulls/${PR}")"
HEAD_REF="$(python3 - <<'PY'
import json,sys
print(json.load(sys.stdin).get('head',{}).get('ref',''))
PY
<<<"${PR_JSON}")"

if [[ -z "${HEAD_REF}" ]]; then
  echo "[autopilot] Cannot read PR head ref."; exit 2
fi

echo "[autopilot] repo=${REPO} pr=#${PR} head_ref=${HEAD_REF} max=${MAX_ATTEMPTS}"
if [[ "${ANY_FAIL}" == "1" ]]; then
  echo "[autopilot] mode=any-fail (all checks)"
else
  echo "[autopilot] mode=required-only (default)"
fi

# head branch'e geç (local branch yoksa fetch)
git fetch --all --prune
if git show-ref --verify --quiet "refs/heads/${HEAD_REF}"; then
  git checkout "${HEAD_REF}"
else
  git checkout -b "${HEAD_REF}" "origin/${HEAD_REF}"
fi

attempt=1
while [[ $attempt -le $MAX_ATTEMPTS ]]; do
  echo "[autopilot] attempt ${attempt}/${MAX_ATTEMPTS}: watching checks..."
  if [[ "${ANY_FAIL}" == "1" ]]; then
    CHECKS_ARGS=(--watch)
  else
    CHECKS_ARGS=(--required --watch)
  fi

  if gh pr checks "${PR}" -R "${REPO}" "${CHECKS_ARGS[@]}"; then
    state="$(gh pr view "${PR}" -R "${REPO}" --json state -q .state || echo unknown)"
    echo "[autopilot] PASS. PR state=${state}"
    exit 0
  fi

  echo "[autopilot] FAIL. downloading logs..."
  ./scripts/ci_pull_logs.sh --repo "${REPO}" --pr "${PR}" --out "${OUT_DIR}" || true
  FAILURE_MD="${OUT_DIR}/pr-${PR}/FAILURE.md"
  echo "[autopilot] failure bundle: ${FAILURE_MD}"

  if [[ -z "${FIX_CMD}" ]]; then
    echo "[autopilot] No AUTOPILOT_FIX_CMD set. Stop here so you can run Codex manually using FAILURE.md."
    exit 3
  fi

  BEFORE_SHA="$(git rev-parse HEAD)"
  echo "[autopilot] running fix command (token not printed)..."
  export FAILURE_MD
  bash -lc "${FIX_CMD}"

  AFTER_SHA="$(git rev-parse HEAD)"

  if git diff --quiet && git diff --cached --quiet; then
    if [[ "${AFTER_SHA}" != "${BEFORE_SHA}" ]]; then
      echo "[autopilot] fix command created a commit (no working tree diff)."
    else
      echo "[autopilot] no changes after fix. stopping."
      exit 4
    fi
  fi

  if ! (git diff --quiet && git diff --cached --quiet); then
    git add -A
    git commit -m "fix(autopilot): attempt ${attempt} for PR #${PR}" || true
  fi
  git push -u origin HEAD
  attempt=$((attempt+1))
done

echo "[autopilot] max attempts reached; stopping."
exit 5
