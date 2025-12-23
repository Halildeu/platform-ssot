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

HEAD_REF="$(gh api "repos/${REPO}/pulls/${PR}" --jq '.head.ref')"

if [[ -z "${HEAD_REF}" || "${HEAD_REF}" == "null" ]]; then
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
  # Fine-grained tokens may not have access to GraphQL statusCheckRollup (gh pr checks).
  # This watcher uses Actions runs (REST) only.
  HEAD_SHA="$(gh api "repos/${REPO}/pulls/${PR}" --jq '.head.sha')"

  if [[ -z "${HEAD_SHA}" || "${HEAD_SHA}" == "null" ]]; then
    echo "[autopilot] Cannot read PR head SHA." >&2
    exit 2
  fi

  POLL_SECS="${AUTOPILOT_POLL_SECS:-10}"
  TIMEOUT_SECS="${AUTOPILOT_WATCH_TIMEOUT_SECS:-3600}"
  waited=0

  while true; do
    RUNS_JSON="$(gh api "repos/${REPO}/actions/runs?event=pull_request&head_sha=${HEAD_SHA}&per_page=100")"

    CI_STATUS=""
    CI_CONCLUSION=""
    CI_URL=""
    FAIL_COUNT="0"
    FAIL_LIST=""

    while IFS='=' read -r k v; do
      case "$k" in
        ci_gate_status) CI_STATUS="$v" ;;
        ci_gate_conclusion) CI_CONCLUSION="$v" ;;
        ci_gate_url) CI_URL="$v" ;;
        fail_count) FAIL_COUNT="$v" ;;
        fail_list) FAIL_LIST="$v" ;;
      esac
    done < <(
      python3 -c $'import json,sys\n\ndata=json.loads(sys.stdin.read() or \"{}\")\nruns=data.get(\"workflow_runs\") or []\nif not isinstance(runs, list):\n    runs=[]\n\ndef is_completed(r):\n    return r.get(\"status\")==\"completed\"\n\ndef is_failing(r):\n    if not is_completed(r):\n        return False\n    c=r.get(\"conclusion\")\n    return isinstance(c,str) and c not in (\"success\",\"skipped\")\n\nci=None\nfor r in runs:\n    name=r.get(\"name\")\n    if isinstance(name,str) and name.strip().lower()==\"ci-gate\":\n        ci=r\n        break\n\nfail=[r for r in runs if is_failing(r)]\nfail_names=[]\nfor r in fail:\n    n=r.get(\"name\")\n    if isinstance(n,str) and n.strip():\n        fail_names.append(n.strip())\n\ndef s(v):\n    return \"\" if v is None else str(v)\n\nprint(f\"ci_gate_status={s(ci.get(\'status\') if isinstance(ci,dict) else \'\')}\")\nprint(f\"ci_gate_conclusion={s(ci.get(\'conclusion\') if isinstance(ci,dict) else \'\')}\")\nprint(f\"ci_gate_url={s(ci.get(\'html_url\') if isinstance(ci,dict) else \'\')}\")\nprint(f\"fail_count={len(fail)}\")\nprint(\"fail_list=\"+\",\".join(fail_names))\n' <<<"${RUNS_JSON}"
    )

    echo "[autopilot] ci-gate: status=${CI_STATUS:-?} conclusion=${CI_CONCLUSION:-?} run=${CI_URL:-n/a} | failing_runs=${FAIL_COUNT} ${FAIL_LIST:+(${FAIL_LIST})}"

    if [[ "${ANY_FAIL}" == "1" && "${FAIL_COUNT}" != "0" ]]; then
      echo "[autopilot] FAIL (any-fail): found failing workflow runs."
      break
    fi

    if [[ "${CI_STATUS}" == "completed" ]]; then
      if [[ "${CI_CONCLUSION}" == "success" ]]; then
        pr_state="$(gh api "repos/${REPO}/pulls/${PR}" --jq '.state' 2>/dev/null || echo unknown)"
        echo "[autopilot] PASS. PR state=${pr_state}"
        exit 0
      fi
      echo "[autopilot] FAIL (ci-gate): conclusion=${CI_CONCLUSION:-unknown}"
      break
    fi

    if (( waited >= TIMEOUT_SECS )); then
      echo "[autopilot] FAIL: watch timeout after ${TIMEOUT_SECS}s (ci-gate not completed)." >&2
      break
    fi
    sleep "${POLL_SECS}"
    waited=$((waited + POLL_SECS))
  done

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
