#!/usr/bin/env bash
set -euo pipefail

REPO="${GITHUB_REPOSITORY:-}"
PR=""
MAX_ATTEMPTS=5
OUT_DIR="artifacts/ci-logs"
FIX_CMD="${AUTOPILOT_FIX_CMD:-}"
TRACKER_REPORT_ENABLED="${AUTOPILOT_TRACKER_REPORT:-}"

usage() {
  echo "Usage: $0 --pr <num> [--repo owner/repo] [--max N] [--out dir]"
  echo "Env: GH_TOKEN must be set or gh auth login; token value not printed."
  echo "Env: AUTOPILOT_FIX_CMD optional (command that applies a fix locally)."
  echo "Env: AUTOPILOT_TRACKER_REPORT=1 optional (write .autopilot-tmp/pr-tracker/STATUS.md)."
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

tracker_add() {
  python3 scripts/pr_tracker_tsv.py --repo "${REPO}" add --pr "${PR}" >/dev/null 2>&1 || true
}

tracker_report() {
  if [[ "${TRACKER_REPORT_ENABLED}" != "1" ]]; then
    return 0
  fi
  python3 scripts/pr_tracker_tsv.py --repo "${REPO}" report --out .autopilot-tmp/pr-tracker/STATUS.md >/dev/null 2>&1 || true
}

HEAD_REF="$(gh api "repos/${REPO}/pulls/${PR}" --jq '.head.ref' 2>/dev/null || true)"
HEAD_REF="$(printf '%s' "${HEAD_REF}" | tr -d '\r' | sed -E 's/^"//; s/"$//; s/^[[:space:]]+//; s/[[:space:]]+$//')"

if [[ -z "${HEAD_REF}" ]]; then
  echo "[autopilot] Cannot read PR head ref."; exit 2
fi

echo "[autopilot] repo=${REPO} pr=#${PR} head_ref=${HEAD_REF} max=${MAX_ATTEMPTS}"
tracker_add
tracker_report

# head branch'e geç (local branch yoksa fetch)
git fetch --all --prune
if git show-ref --verify --quiet "refs/heads/${HEAD_REF}"; then
  git checkout "${HEAD_REF}"
else
  git checkout -b "${HEAD_REF}" "origin/${HEAD_REF}"
fi

watch_ci_gate() {
  local poll_s=5
  local max_polls=180

  local head_sha
  head_sha="$(gh api "repos/${REPO}/pulls/${PR}" --jq '.head.sha' 2>/dev/null || true)"
  head_sha="$(printf '%s' "${head_sha}" | tr -d '\r' | sed -E 's/^"//; s/"$//; s/^[[:space:]]+//; s/[[:space:]]+$//')"
  if [[ -z "${head_sha}" || "${head_sha}" == "null" ]]; then
    echo "[autopilot] ci-gate: Cannot read PR head sha."
    return 2
  fi

  local i
  for ((i = 1; i <= max_polls; i++)); do
    local run_info
    run_info="$(
      gh api "repos/${REPO}/actions/runs?event=pull_request&head_sha=${head_sha}&per_page=50" 2>/dev/null \
        --jq '.workflow_runs | map(select(.name=="ci-gate")) | .[0] // empty | [.id, .html_url, .status, (.conclusion // "")] | @tsv' \
        | tr -d '\r' \
        | head -n 1
    )"

    if [[ -z "${run_info}" ]]; then
      echo "[autopilot] ci-gate: waiting for run (head_sha=${head_sha:0:7})..."
      sleep "${poll_s}"
      continue
    fi

    local run_id run_url status conclusion
    IFS=$'\t' read -r run_id run_url status conclusion <<<"${run_info}"

    if [[ "${status}" != "completed" ]]; then
      echo "[autopilot] ci-gate: run=${run_id} status=${status} (${run_url})"
      sleep "${poll_s}"
      continue
    fi

    echo "[autopilot] ci-gate: run=${run_id} conclusion=${conclusion} (${run_url})"
    [[ "${conclusion}" == "success" ]]
    return
  done

  echo "[autopilot] ci-gate: timeout waiting for completion."
  return 1
}

attempt=1
while [[ $attempt -le $MAX_ATTEMPTS ]]; do
  echo "[autopilot] attempt ${attempt}/${MAX_ATTEMPTS}: waiting for ci-gate..."
  if watch_ci_gate; then
    state="$(gh api "repos/${REPO}/pulls/${PR}" --jq '.state' 2>/dev/null || echo unknown)"
    state="$(printf '%s' "${state}" | tr -d '\r' | sed -E 's/^"//; s/"$//; s/^[[:space:]]+//; s/[[:space:]]+$//')"
    echo "[autopilot] PASS. PR state=${state}"
    tracker_add
    tracker_report
    exit 0
  fi

  echo "[autopilot] FAIL. downloading logs..."
  ./scripts/ci_pull_logs.sh --repo "${REPO}" --pr "${PR}" --out "${OUT_DIR}" || true
  FAILURE_MD="${OUT_DIR}/pr-${PR}/FAILURE.md"
  echo "[autopilot] failure bundle: ${FAILURE_MD}"
  tracker_add
  tracker_report

  if [[ -z "${FIX_CMD}" ]]; then
    echo "[autopilot] No AUTOPILOT_FIX_CMD set. Stop here so you can run Codex manually using FAILURE.md."
    exit 3
  fi

  echo "[autopilot] running fix command (token not printed)..."
  export FAILURE_MD
  bash -lc "${FIX_CMD}"

  if git diff --quiet && git diff --cached --quiet; then
    echo "[autopilot] no changes after fix. stopping."
    exit 4
  fi

  git add -A
  git commit -m "fix(autopilot): attempt ${attempt} for PR #${PR}" || true
  git push -u origin HEAD
  tracker_add
  tracker_report
  attempt=$((attempt+1))
done

echo "[autopilot] max attempts reached; stopping."
exit 5
