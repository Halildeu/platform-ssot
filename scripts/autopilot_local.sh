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
CODEX_FIX_RUNNER_SRC="${ROOT_DIR}/scripts/codex_fix_runner.sh"
CODEX_FIX_RUNNER_BIN="${AUTOPILOT_TMP}/codex_fix_runner.sh"

DRY_RUN_PR_UPDATES="false"

FAILURE_MARKER="<!-- local-autopilot:failure -->"
STATUS_MARKER="<!-- local-autopilot:status -->"

LABEL_FAILING="autopilot/failing"
LABEL_FIX_SENT="autopilot/fix-sent"
LABEL_PASSED="autopilot/passed"
LABEL_NEEDS_HUMAN="autopilot/needs-human"

CI_GATE_STATUS=""
CI_GATE_CONCLUSION=""
CI_GATE_RUN_ID=""
CI_GATE_RUN_URL=""

usage() {
  echo "Usage: $0 --pr <num> [--repo owner/repo] [--max N] [--out dir]"
  echo "Env: GH_TOKEN must be set or gh auth login; token value not printed."
  echo "Env: AUTOPILOT_FIX_CMD optional (command that applies a fix locally)."
  echo "Flags:"
  echo "  --dry-run-pr-updates   Don't write PR comments/labels; print planned actions only."
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo) REPO="$2"; shift 2;;
    --pr) PR="$2"; shift 2;;
    --max) MAX_ATTEMPTS="$2"; shift 2;;
    --out) OUT_DIR="$2"; shift 2;;
    --dry-run-pr-updates) DRY_RUN_PR_UPDATES="true"; shift 1;;
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

if [[ -n "${GH_LOCAL_AUTOPILOT_TOKEN:-}" && -z "${GH_TOKEN:-}" ]]; then
  export GH_TOKEN="${GH_LOCAL_AUTOPILOT_TOKEN}"
fi

if ! gh auth status -h github.com >/dev/null 2>&1 && [[ -z "${GH_TOKEN:-}" ]]; then
  echo "[autopilot] gh not authenticated and GH_TOKEN not set."; exit 2
fi

mkdir -p "${AUTOPILOT_TMP}"
if [[ -f "${CI_PULL_LOGS_SRC}" ]]; then
  cp "${CI_PULL_LOGS_SRC}" "${CI_PULL_LOGS_BIN}" || true
  chmod +x "${CI_PULL_LOGS_BIN}" || true
fi
if [[ -f "${CODEX_FIX_RUNNER_SRC}" ]]; then
  cp "${CODEX_FIX_RUNNER_SRC}" "${CODEX_FIX_RUNNER_BIN}" || true
  chmod +x "${CODEX_FIX_RUNNER_BIN}" || true

  if [[ -n "${FIX_CMD}" ]]; then
    FIX_CMD="${FIX_CMD//.\/scripts\/codex_fix_runner\.sh/${CODEX_FIX_RUNNER_BIN}}"
    FIX_CMD="${FIX_CMD//scripts\/codex_fix_runner\.sh/${CODEX_FIX_RUNNER_BIN}}"
  fi
fi

urlencode() {
  python3 - <<'PY' "$1"
import sys, urllib.parse
print(urllib.parse.quote(sys.argv[1], safe=""))
PY
}

is_dry_run_pr_updates() {
  [[ "${DRY_RUN_PR_UPDATES}" = "true" ]]
}

ensure_label() {
  local name="$1"
  local color="$2"
  local desc="$3"

  if is_dry_run_pr_updates; then
    echo "[autopilot] would ensure label exists: ${name}"
    return 0
  fi

  if gh api -X POST "repos/${REPO}/labels" -f name="${name}" -f color="${color}" -f description="${desc}" >/dev/null 2>&1; then
    echo "[autopilot] label created: ${name}"
    return 0
  fi
  # 422 (exists) dahil tüm error'larda label ensure best-effort.
  return 0
}

label_meta() {
  local name="$1"
  case "${name}" in
    autopilot/failing) echo "D73A4A|Local autopilot: ci-gate failing" ;;
    autopilot/fix-sent) echo "FBCA04|Local autopilot: fix pushed; waiting for ci-gate" ;;
    autopilot/passed) echo "0E8A16|Local autopilot: ci-gate passed" ;;
    autopilot/needs-human) echo "6A737D|Local autopilot: needs human intervention" ;;
    *) echo "6A737D|Local autopilot label" ;;
  esac
}

add_labels() {
  local pr_number="$1"; shift

  if [[ $# -eq 0 ]]; then
    return 0
  fi

  for name in "$@"; do
    local meta color desc
    meta="$(label_meta "${name}")"
    color="${meta%%|*}"
    desc="${meta#*|}"
    ensure_label "${name}" "${color}" "${desc}" || true

    if is_dry_run_pr_updates; then
      echo "[autopilot] would add label: ${name}"
      continue
    fi

    if gh api -X POST "repos/${REPO}/issues/${pr_number}/labels" -f labels[]="${name}" >/dev/null 2>&1; then
      echo "[autopilot] label added: ${name}"
      continue
    fi

    # Label yoksa retry (create -> add) best-effort
    ensure_label "${name}" "${color}" "${desc}" || true
    if gh api -X POST "repos/${REPO}/issues/${pr_number}/labels" -f labels[]="${name}" >/dev/null 2>&1; then
      echo "[autopilot] label added (retry): ${name}"
      continue
    fi
    echo "[autopilot] WARN: label add failed: ${name}"
  done
}

remove_labels() {
  local pr_number="$1"; shift

  if [[ $# -eq 0 ]]; then
    return 0
  fi

  for name in "$@"; do
    if is_dry_run_pr_updates; then
      echo "[autopilot] would remove label: ${name}"
      continue
    fi

    enc="$(urlencode "${name}")"
    if gh api -X DELETE "repos/${REPO}/issues/${pr_number}/labels/${enc}" >/dev/null 2>&1; then
      echo "[autopilot] label removed: ${name}"
      continue
    fi
    # 404 normal (label yok / PR'da değil)
    true
  done
}

upsert_comment() {
  local pr_number="$1"
  local marker="$2"
  local content="$3"

  if is_dry_run_pr_updates; then
    echo "[autopilot] would upsert comment marker=${marker}"
    return 0
  fi

  local desired body_json comments_json comment_id
  desired="${marker}"$'\n'"${content}"
  comments_json="$(gh api "repos/${REPO}/issues/${pr_number}/comments?per_page=100" 2>/dev/null || true)"

  comment_id="$(COMMENTS_JSON="${comments_json}" MARKER="${marker}" python3 - <<'PY'
import json, os
raw = os.environ.get("COMMENTS_JSON","")
marker = os.environ.get("MARKER","")
try:
  data = json.loads(raw) if raw.strip() else []
except json.JSONDecodeError:
  data = []
for c in data if isinstance(data, list) else []:
  body = c.get("body")
  if isinstance(body, str) and marker in body:
    print(c.get("id") or "")
    raise SystemExit(0)
print("")
PY
)"

  if [[ -n "${comment_id}" ]]; then
    if gh api -X PATCH "repos/${REPO}/issues/comments/${comment_id}" -f body="${desired}" >/dev/null 2>&1; then
      echo "[autopilot] comment updated (marker)"
      return 0
    fi
    echo "[autopilot] WARN: comment update failed (marker)"
    return 0
  fi

  if gh api -X POST "repos/${REPO}/issues/${pr_number}/comments" -f body="${desired}" >/dev/null 2>&1; then
    echo "[autopilot] comment created (marker)"
    return 0
  fi
  echo "[autopilot] WARN: comment create failed (marker)"
}

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

  CI_GATE_STATUS=""
  CI_GATE_CONCLUSION=""
  CI_GATE_RUN_ID=""
  CI_GATE_RUN_URL=""

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

    CI_GATE_STATUS="${status}"
    CI_GATE_CONCLUSION="${conclusion}"
    CI_GATE_RUN_ID="${run_id}"
    CI_GATE_RUN_URL="${run_url}"

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
HEAD_META="$(PR_JSON="${PR_JSON}" python3 - <<'PY'
import json, os
raw = os.environ.get("PR_JSON","")
try:
  data = json.loads(raw) if raw.strip() else {}
except json.JSONDecodeError:
  data = {}
head = data.get("head") or {}
print("%s\t%s\t%s" % (
  head.get("ref",""),
  head.get("sha",""),
  data.get("html_url",""),
))
PY
)"

HEAD_REF="${HEAD_META%%$'\t'*}"
REST="${HEAD_META#*$'\t'}"
HEAD_SHA="${REST%%$'\t'*}"
PR_URL="${REST#*$'\t'}"

if [[ -z "${HEAD_REF}" ]]; then
  echo "[autopilot] Cannot read PR head ref."; exit 2
fi

echo "[autopilot] pr_updates_dry_run=${DRY_RUN_PR_UPDATES}"
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
raw = os.environ.get("PR_JSON","")
try:
  data = json.loads(raw) if raw.strip() else {}
except json.JSONDecodeError:
  data = {}
head = data.get("head") or {}
print(head.get("sha",""))
PY
)"
  if [[ -z "${HEAD_SHA}" ]]; then
    echo "[autopilot] Cannot read PR head sha."; exit 2
  fi

  echo "[autopilot] attempt ${attempt}/${MAX_ATTEMPTS}: watching ci-gate (head_sha=${HEAD_SHA:0:7})..."
  if wait_ci_gate "${HEAD_SHA}"; then
    remove_labels "${PR}" "${LABEL_FAILING}" "${LABEL_FIX_SENT}" "${LABEL_NEEDS_HUMAN}" || true
    add_labels "${PR}" "${LABEL_PASSED}" || true

    upsert_comment "${PR}" "${STATUS_MARKER}" "$(cat <<EOF
Local Autopilot (local SSOT)

Result: passed
PR: ${PR_URL}
Head: ${HEAD_REF}@${HEAD_SHA:0:7}
ci-gate: ${CI_GATE_RUN_URL}
Attempt: ${attempt}/${MAX_ATTEMPTS}
EOF
)" || true

    echo "[autopilot] PASS."
    exit 0
  fi

  echo "[autopilot] FAIL. downloading logs..."
  remove_labels "${PR}" "${LABEL_PASSED}" || true
  add_labels "${PR}" "${LABEL_FAILING}" || true

  upsert_comment "${PR}" "${STATUS_MARKER}" "$(cat <<EOF
Local Autopilot (local SSOT)

Result: failing
PR: ${PR_URL}
Head: ${HEAD_REF}@${HEAD_SHA:0:7}
ci-gate: ${CI_GATE_RUN_URL}
Attempt: ${attempt}/${MAX_ATTEMPTS}
EOF
)" || true

  if [[ -x "${CI_PULL_LOGS_SRC}" ]]; then
    "${CI_PULL_LOGS_SRC}" --repo "${REPO}" --pr "${PR}" --out "${OUT_DIR}" || true
  elif [[ -x "${CI_PULL_LOGS_BIN}" ]]; then
    "${CI_PULL_LOGS_BIN}" --repo "${REPO}" --pr "${PR}" --out "${OUT_DIR}" || true
  else
    echo "[autopilot] ci_pull_logs.sh not found; skipping log download."
  fi
  FAILURE_MD="${OUT_DIR}/pr-${PR}/FAILURE.md"
  echo "[autopilot] failure bundle: ${FAILURE_MD}"

  if [[ -f "${FAILURE_MD}" ]]; then
    FAIL_SNIP="$(sed -n '1,120p' "${FAILURE_MD}" | sed 's/\r$//' || true)"
  else
    FAIL_SNIP="(FAILURE.md not found)"
  fi

  upsert_comment "${PR}" "${FAILURE_MARKER}" "$(cat <<EOF
CI Failure Digest (local)

Run: ${CI_GATE_RUN_URL}

~~~text
${FAIL_SNIP}
~~~
EOF
)" || true

  if [[ -z "${FIX_CMD}" ]]; then
    add_labels "${PR}" "${LABEL_NEEDS_HUMAN}" || true
    upsert_comment "${PR}" "${STATUS_MARKER}" "$(cat <<EOF
Local Autopilot (local SSOT)

Result: needs-human
Reason: AUTOPILOT_FIX_CMD not set
PR: ${PR_URL}
Head: ${HEAD_REF}@${HEAD_SHA:0:7}
ci-gate: ${CI_GATE_RUN_URL}
Attempt: ${attempt}/${MAX_ATTEMPTS}
EOF
)" || true
    echo "[autopilot] No AUTOPILOT_FIX_CMD set. Stop here so you can run Codex manually using FAILURE.md."
    exit 3
  fi

  echo "[autopilot] running fix command (token not printed)..."
  export FAILURE_MD
  bash -lc "${FIX_CMD}"

  if git diff --quiet && git diff --cached --quiet; then
    add_labels "${PR}" "${LABEL_NEEDS_HUMAN}" || true
    upsert_comment "${PR}" "${STATUS_MARKER}" "$(cat <<EOF
Local Autopilot (local SSOT)

Result: needs-human
Reason: fix command produced no changes
PR: ${PR_URL}
Head: ${HEAD_REF}@${HEAD_SHA:0:7}
Attempt: ${attempt}/${MAX_ATTEMPTS}
EOF
)" || true
    echo "[autopilot] no changes after fix. stopping."
    exit 4
  fi

  git add -A -- . ":!${OUT_DIR%%/*}" ":!${AUTOPILOT_TMP##*/}"
  git commit -m "fix(autopilot): attempt ${attempt} for PR #${PR}" || true
  add_labels "${PR}" "${LABEL_FIX_SENT}" || true
  remove_labels "${PR}" "${LABEL_PASSED}" || true
  git push -u origin HEAD

  upsert_comment "${PR}" "${STATUS_MARKER}" "$(cat <<EOF
Local Autopilot (local SSOT)

Result: fix-sent
PR: ${PR_URL}
Head: ${HEAD_REF}@${HEAD_SHA:0:7}
Attempt: ${attempt}/${MAX_ATTEMPTS}
EOF
)" || true

  attempt=$((attempt+1))
done

add_labels "${PR}" "${LABEL_NEEDS_HUMAN}" || true
upsert_comment "${PR}" "${STATUS_MARKER}" "$(cat <<EOF
Local Autopilot (local SSOT)

Result: needs-human
Reason: max attempts reached
PR: ${PR_URL}
Head: ${HEAD_REF}@${HEAD_SHA:0:7}
Attempt: ${MAX_ATTEMPTS}/${MAX_ATTEMPTS}
EOF
)" || true

echo "[autopilot] max attempts reached; stopping."
exit 5
