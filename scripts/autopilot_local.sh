#!/usr/bin/env bash
set -euo pipefail

REPO="${GITHUB_REPOSITORY:-}"
PR=""
MAX_ATTEMPTS=5
OUT_DIR="artifacts/ci-logs"
FIX_CMD="${AUTOPILOT_FIX_CMD:-}"
ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
AUTOPILOT_TMP="${ROOT_DIR}/.autopilot-tmp"
CI_PULL_LOGS_SRC="${ROOT_DIR}/scripts/ci_pull_logs.sh"
CI_PULL_LOGS_BIN="${AUTOPILOT_TMP}/ci_pull_logs.sh"

usage() {
  echo "Usage: $0 --pr <num> [--repo owner/repo] [--max N] [--out dir]"
  echo "Env: GH_TOKEN (or GH_LOCAL_AUTOPILOT_TOKEN) must be set or gh auth login; token value not printed."
  echo "Env: AUTOPILOT_FIX_CMD optional (command that applies a fix locally)."
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

mkdir -p "${AUTOPILOT_TMP}"
if [[ -x "${CI_PULL_LOGS_SRC}" ]]; then
  cp "${CI_PULL_LOGS_SRC}" "${CI_PULL_LOGS_BIN}"
  chmod +x "${CI_PULL_LOGS_BIN}"
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "[autopilot] gh CLI not found. Install gh or set PATH."; exit 2
fi

if [[ -n "${GITHUB_TOKEN:-}" && -z "${GH_TOKEN:-}" ]]; then
  export GH_TOKEN="${GITHUB_TOKEN}"
fi

if [[ -n "${GH_LOCAL_AUTOPILOT_TOKEN:-}" && -z "${GH_TOKEN:-}" ]]; then
  export GH_TOKEN="${GH_LOCAL_AUTOPILOT_TOKEN}"
fi

if ! gh auth status -h github.com >/dev/null 2>&1 && [[ -z "${GH_TOKEN:-}" ]]; then
  echo "[autopilot] gh not authenticated and GH_TOKEN not set."; exit 2
fi

ci_gate_state() {
  local head_sha="$1"
  local runs_json
  local out

  runs_json="$(gh api "repos/${REPO}/actions/runs?event=pull_request&head_sha=${head_sha}&per_page=50" 2>/dev/null || true)"
  out="$(RUNS_JSON="${runs_json}" python3 - <<'PY'
import json, os
raw = os.environ.get("RUNS_JSON", "")
try:
  data = json.loads(raw) if raw.strip() else {}
except json.JSONDecodeError:
  data = {}
runs = data.get("workflow_runs") or []
picked = None
for r in runs:
  if (r.get("name") or "") == "ci-gate":
    picked = r
    break
if not picked:
  print("")
  raise SystemExit(0)
print("%s\t%s\t%s\t%s" % (
  picked.get("status",""),
  picked.get("conclusion",""),
  picked.get("id",""),
  picked.get("html_url",""),
))
PY
)"

  if [[ -z "${out}" ]]; then
    echo ""
    return 0
  fi
  echo "${out}"
}

wait_ci_gate() {
  local head_sha="$1"
  local sleep_s=10
  local state=""
  local status=""
  local conclusion=""
  local run_id=""
  local run_url=""

  while true; do
    state="$(ci_gate_state "${head_sha}")"
    if [[ -z "${state}" ]]; then
      echo "[autopilot] ci-gate: run not found yet for head_sha=${head_sha:0:7}; waiting..."
      sleep "${sleep_s}"
      continue
    fi

    status="${state%%$'\t'*}"
    rest="${state#*$'\t'}"
    conclusion="${rest%%$'\t'*}"
    rest2="${rest#*$'\t'}"
    run_id="${rest2%%$'\t'*}"
    run_url="${rest2#*$'\t'}"

    echo "[autopilot] ci-gate: status=${status} conclusion=${conclusion:-none} run_id=${run_id} run=${run_url}"

    if [[ "${status}" != "completed" ]]; then
      sleep "${sleep_s}"
      continue
    fi

    if [[ "${conclusion}" = "success" ]]; then
      return 0
    fi
    return 1
  done
}

PR_JSON="$(gh api "repos/${REPO}/pulls/${PR}")"
HEAD_REF="$(PR_JSON="${PR_JSON}" python3 - <<'PY'
import json, os
raw = os.environ.get("PR_JSON", "")
try:
    data = json.loads(raw) if raw.strip() else {}
except json.JSONDecodeError:
    data = {}
head = data.get("head") or {}
print(head.get("ref", ""))
PY
)"

if [[ -z "${HEAD_REF}" ]]; then
  echo "[autopilot] Cannot read PR head ref."; exit 2
fi

echo "[autopilot] repo=${REPO} pr=#${PR} head_ref=${HEAD_REF} max=${MAX_ATTEMPTS}"

# head branch'e geç (local branch yoksa fetch)
git fetch --all --prune
if git show-ref --verify --quiet "refs/heads/${HEAD_REF}"; then
  git checkout "${HEAD_REF}"
else
  git checkout -b "${HEAD_REF}" "origin/${HEAD_REF}"
fi

attempt=1
while [[ $attempt -le $MAX_ATTEMPTS ]]; do
  PR_JSON="$(gh api "repos/${REPO}/pulls/${PR}")"
  HEAD_SHA="$(PR_JSON="${PR_JSON}" python3 - <<'PY'
import json, os
raw = os.environ.get("PR_JSON", "")
try:
  data = json.loads(raw) if raw.strip() else {}
except json.JSONDecodeError:
  data = {}
head = data.get("head") or {}
print(head.get("sha", ""))
PY
)"

  if [[ -z "${HEAD_SHA}" ]]; then
    echo "[autopilot] Cannot read PR head sha."; exit 2
  fi

  echo "[autopilot] attempt ${attempt}/${MAX_ATTEMPTS}: watching ci-gate (head_sha=${HEAD_SHA:0:7})..."
  if wait_ci_gate "${HEAD_SHA}"; then
    pr_state="$(PR_JSON="${PR_JSON}" python3 - <<'PY'
import json, os
raw = os.environ.get("PR_JSON", "")
try:
  data = json.loads(raw) if raw.strip() else {}
except json.JSONDecodeError:
  data = {}
print(data.get("state","unknown"))
PY
)"
    echo "[autopilot] PASS. PR state=${pr_state}"
    exit 0
  fi

  echo "[autopilot] FAIL. downloading logs..."
  if [[ -x "${CI_PULL_LOGS_SRC}" ]]; then
    "${CI_PULL_LOGS_SRC}" --repo "${REPO}" --pr "${PR}" --out "${OUT_DIR}" || true
  elif [[ -x "${CI_PULL_LOGS_BIN}" ]]; then
    "${CI_PULL_LOGS_BIN}" --repo "${REPO}" --pr "${PR}" --out "${OUT_DIR}" || true
  else
    echo "[autopilot] ci_pull_logs.sh not found; skipping log download."
  fi
  FAILURE_MD="${OUT_DIR}/pr-${PR}/FAILURE.md"
  echo "[autopilot] failure bundle: ${FAILURE_MD}"

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
  attempt=$((attempt+1))
done

echo "[autopilot] max attempts reached; stopping."
exit 5
