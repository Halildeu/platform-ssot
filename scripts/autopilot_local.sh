#!/usr/bin/env bash
set -euo pipefail

REPO="${GITHUB_REPOSITORY:-}"
PR=""
MAX_ATTEMPTS=5
OUT_DIR="artifacts/ci-logs"
FIX_CMD="${AUTOPILOT_FIX_CMD:-}"
ANY_FAIL="${AUTOPILOT_ANY_FAIL:-}"
AUTO_CONFLICT="${AUTOPILOT_AUTO_CONFLICT:-}"

usage() {
  echo "Usage: $0 --pr <num> [--repo owner/repo] [--max N] [--out dir]"
  echo "Env: GH_TOKEN must be set or gh auth login; token value not printed."
  echo "Env: AUTOPILOT_FIX_CMD optional (command that applies a fix locally)."
  echo "Env: AUTOPILOT_ANY_FAIL=1 optional (treat any failing check as failure; default watches required checks only)."
  echo "Env: AUTOPILOT_AUTO_CONFLICT=1 optional (mergeable_state=dirty ise main ile auto-resolve dener; allowlist scope)."
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
HEAD_REF="$(
  python3 -c 'import json,sys; print((json.load(sys.stdin).get("head",{}) or {}).get("ref",""))' <<<"${PR_JSON}"
)"

if [[ -z "${HEAD_REF}" ]]; then
  echo "[autopilot] Cannot read PR head ref."; exit 2
fi

echo "[autopilot] repo=${REPO} pr=#${PR} head_ref=${HEAD_REF} max=${MAX_ATTEMPTS}"
if [[ "${ANY_FAIL}" == "1" ]]; then
  echo "[autopilot] mode=any-fail (all checks)"
else
  echo "[autopilot] mode=required-only (default)"
fi

if [[ "${AUTO_CONFLICT}" == "1" ]]; then
  MERGEABLE_STATE="$(
    python3 -c 'import json,sys; print((json.load(sys.stdin).get("mergeable_state") or "").strip())' <<<"${PR_JSON}"
  )"
  if [[ "${MERGEABLE_STATE}" == "dirty" ]]; then
    echo "[autopilot] mergeable_state=dirty -> attempting auto conflict resolve with main..."
    python3 scripts/resolve_merge_conflicts.py --repo "${REPO}" --pr "${PR}" || {
      echo "[autopilot] STOP: auto conflict resolve failed (needs-human)."
      exit 6
    }
  fi
fi

wait_for_workflows() {
  local head_sha="$1"
  local mode="$2" # required|any

  local max_wait_sec="${AUTOPILOT_WAIT_MAX_SEC:-1800}"
  local sleep_sec="${AUTOPILOT_WAIT_INTERVAL_SEC:-10}"
  local start_ts
  start_ts="$(date +%s)"

  local out_dir="${OUT_DIR}/pr-${PR}"
  mkdir -p "${out_dir}"
  local runs_pages="${out_dir}/runs-pages.json"

  while true; do
    gh api --paginate --slurp \
      "repos/${REPO}/actions/runs?event=pull_request&head_sha=${head_sha}&per_page=100" \
      > "${runs_pages}"

    # Exit codes:
    #  0 = PASS
    #  1 = FAIL
    #  2 = WAIT (pending / not ready)
    python3 - "${runs_pages}" "${mode}" <<'PY'
import json
import sys

path = sys.argv[1]
mode = sys.argv[2]

pages = json.load(open(path, "r", encoding="utf-8"))
if not isinstance(pages, list):
    pages = [pages]

all_runs = []
for page in pages:
    if not isinstance(page, dict):
        continue
    runs = page.get("workflow_runs") or []
    if isinstance(runs, list):
        all_runs.extend([r for r in runs if isinstance(r, dict)])

# Newest-first already; pick latest run per workflow name.
latest_by_name = {}
for r in all_runs:
    name = r.get("name")
    if not isinstance(name, str) or not name.strip():
        continue
    if name in latest_by_name:
        continue
    latest_by_name[name] = r

ci = latest_by_name.get("ci-gate")
if not isinstance(ci, dict):
    print("[autopilot] ci-gate: missing (waiting)")
    raise SystemExit(2)

ci_status = ci.get("status") or ""
ci_conclusion = ci.get("conclusion") or ""
ci_url = ci.get("html_url") or ""

if ci_status != "completed":
    print(f"[autopilot] ci-gate: {ci_status} (waiting) {ci_url}")
    raise SystemExit(2)

def ok_conclusion(c: str) -> bool:
    # "neutral"/"skipped" are not failures for our local loop.
    return c in ("success", "neutral", "skipped", "")

pending = []
failing = []
for name, r in latest_by_name.items():
    status = r.get("status") or ""
    if status != "completed":
        pending.append(name)
        continue
    conclusion = str(r.get("conclusion") or "")
    if not ok_conclusion(conclusion):
        failing.append(name)

pending.sort()
failing.sort()

if mode == "any":
    if pending:
        print(f"[autopilot] pending workflows: {', '.join(pending)} (waiting)")
        raise SystemExit(2)
    if failing:
        print(f"[autopilot] FAIL workflows: {', '.join(failing)}")
        raise SystemExit(1)
    print(f"[autopilot] PASS all workflows (ci-gate={ci_conclusion})")
    raise SystemExit(0)

# required-only: only ci-gate matters
if ci_conclusion == "success":
    print(f"[autopilot] PASS ci-gate {ci_url}")
    raise SystemExit(0)

print(f"[autopilot] FAIL ci-gate (conclusion={ci_conclusion}) {ci_url}")
raise SystemExit(1)
PY
    local rc=$?
    if [[ $rc -ne 2 ]]; then
      return $rc
    fi

    local now_ts
    now_ts="$(date +%s)"
    if (( now_ts - start_ts >= max_wait_sec )); then
      echo "[autopilot] STOP: wait timeout (${max_wait_sec}s) for workflows on head_sha=${head_sha}"
      return 7
    fi
    sleep "${sleep_sec}"
  done
}

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
  HEAD_SHA="$(
    python3 -c 'import json,sys; print((json.load(sys.stdin).get("head",{}) or {}).get("sha",""))' <<<"${PR_JSON}"
  )"
  if [[ -z "${HEAD_SHA}" ]]; then
    echo "[autopilot] Cannot read PR head sha."; exit 2
  fi

  echo "[autopilot] attempt ${attempt}/${MAX_ATTEMPTS}: waiting workflows for head_sha=${HEAD_SHA}..."
  MODE="required"
  [[ "${ANY_FAIL}" == "1" ]] && MODE="any"

  wait_for_workflows "${HEAD_SHA}" "${MODE}"
  RC=$?
  if [[ $RC -eq 0 ]]; then
    state="$(gh pr view "${PR}" -R "${REPO}" --json state -q .state || echo unknown)"
    echo "[autopilot] PASS. PR state=${state}"
    exit 0
  elif [[ $RC -ne 1 ]]; then
    # timeout / invariant
    exit "$RC"
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
