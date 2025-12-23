#!/usr/bin/env bash
set -euo pipefail

REPO="${GITHUB_REPOSITORY:-}"
PR=""
OUT_DIR="artifacts/ci-logs"

usage() {
  echo "Usage: $0 --pr <num> [--repo owner/repo] [--out dir]"
  echo "Env: GH_TOKEN or gh auth login required (token value never printed)."
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo) REPO="$2"; shift 2;;
    --pr) PR="$2"; shift 2;;
    --out) OUT_DIR="$2"; shift 2;;
    -h|--help) usage; exit 0;;
    *) echo "Unknown arg: $1"; usage; exit 2;;
  esac
done

if [[ -z "${REPO}" || -z "${PR}" ]]; then
  usage; exit 2
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "[ci-logs] gh CLI not found. Install gh or set PATH."; exit 2
fi

if [[ -n "${GITHUB_TOKEN:-}" && -z "${GH_TOKEN:-}" ]]; then
  export GH_TOKEN="${GITHUB_TOKEN}"
fi

if ! gh auth status -h github.com >/dev/null 2>&1 && [[ -z "${GH_TOKEN:-}" ]]; then
  echo "[ci-logs] gh not authenticated and GH_TOKEN not set."; exit 2
fi

OUT_PR_DIR="${OUT_DIR}/pr-${PR}"
mkdir -p "${OUT_PR_DIR}"

PR_INFO="$(gh api "repos/${REPO}/pulls/${PR}" --jq '[.head.sha, .head.ref, .html_url] | @tsv' 2>/dev/null || true)"
PR_INFO="$(printf '%s' "${PR_INFO}" | tr -d '\r')"
HEAD_SHA=""
HEAD_REF=""
PR_URL=""
IFS=$'\t' read -r HEAD_SHA HEAD_REF PR_URL <<<"${PR_INFO}"

if [[ -z "${HEAD_SHA}" ]]; then
  echo "[ci-logs] Cannot read head SHA for PR #${PR}."; exit 3
fi

RUN_INFO="$(
  gh api "repos/${REPO}/actions/runs?event=pull_request&head_sha=${HEAD_SHA}&per_page=50" 2>/dev/null \
    --jq '(.workflow_runs | map(select(.conclusion != null and .conclusion != "success"))[0] // .workflow_runs[0] // empty)
          | [.id, .html_url, (.conclusion // ""), (.name // "")] | @tsv' \
    | tr -d '\r' \
    | head -n 1
)"

if [[ -z "${RUN_INFO}" ]]; then
  FAILURE_MD="${OUT_PR_DIR}/FAILURE.md"
  {
    echo "# CI Failure Digest (local)"
    echo ""
    echo "- PR: ${PR_URL}"
    echo "- Head: ${HEAD_REF}@${HEAD_SHA}"
    echo "- Run: (not found)"
    echo ""
    echo "No workflow_run found for this PR head SHA."
  } > "${FAILURE_MD}"
  echo "[ci-logs] No runs found; wrote ${FAILURE_MD}"
  exit 0
fi

RUN_ID="${RUN_INFO%%$'\t'*}"
REST="${RUN_INFO#*$'\t'}"
RUN_URL="${REST%%$'\t'*}"
REST2="${REST#*$'\t'}"
CONCLUSION="${REST2%%$'\t'*}"
WF_NAME="${REST2#*$'\t'}"

LOG_PATH="${OUT_PR_DIR}/run-${RUN_ID}.log"
FAILURE_MD="${OUT_PR_DIR}/FAILURE.md"

# Logları indir (tek dosya). Hata olursa boş dosya kalabilir.
(gh run view "${RUN_ID}" -R "${REPO}" --log || true) > "${LOG_PATH}"

export LOG_PATH FAILURE_MD RUN_URL WF_NAME CONCLUSION HEAD_SHA HEAD_REF PR_URL
python3 - <<'PY'
import os,re,sys
log_path=os.environ.get("LOG_PATH")
fail_path=os.environ.get("FAILURE_MD")
run_url=os.environ.get("RUN_URL","")
wf=os.environ.get("WF_NAME","")
conclusion=os.environ.get("CONCLUSION","")
head_sha=os.environ.get("HEAD_SHA","")
head_ref=os.environ.get("HEAD_REF","")
pr_url=os.environ.get("PR_URL","" )

pat=re.compile(r"(\[ci-gate\]\s+FAIL:|Traceback|Process completed with exit code|npm ERR!|Module not found|ERROR\b|Error:|FAILED\b|Exception)", re.IGNORECASE)

lines=[]
if log_path and os.path.exists(log_path):
  try:
    with open(log_path, "r", encoding="utf-8", errors="replace") as f:
      lines=f.read().splitlines()
  except Exception:
    lines=[]

idx=None
for i,l in enumerate(lines):
  if pat.search(l):
    idx=i; break

if idx is None:
  snippet=lines[-200:] if lines else ["(log empty)"]
  title="Tail (no error match)"
else:
  snippet=lines[idx:idx+80]
  title=f"First error match at line {idx+1}"

with open(fail_path, "w", encoding="utf-8") as out:
  out.write("# CI Failure Digest (local)\n\n")
  out.write(f"- PR: {pr_url}\n")
  out.write(f"- Head: {head_ref}@{head_sha}\n")
  out.write(f"- Run: {run_url}\n")
  if wf:
    out.write(f"- Workflow: {wf}\n")
  if conclusion:
    out.write(f"- Conclusion: {conclusion}\n")
  out.write(f"- Log: {log_path}\n\n")
  out.write(f"## {title}\n\n")
  out.write("```text\n")
  for l in snippet:
    out.write(l + "\n")
  out.write("```\n")
PY

echo "[ci-logs] wrote ${FAILURE_MD}"
