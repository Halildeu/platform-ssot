#!/usr/bin/env bash
set -euo pipefail

# Prevent accidental secret leakage if the caller enabled xtrace.
set +x

REPO="${GITHUB_REPOSITORY:-}"
RUN_ID=""
OUT_DIR="artifacts/ci-logs"

usage() {
  cat <<'EOF'
Usage: bash scripts/ops/gh_pull_run_logs.sh --run-id <id> [--repo owner/repo] [--out <dir>]

Downloads a GitHub Actions run log (single text file) and writes a small digest.

Outputs (under OUT_DIR/run-<id>/):
- run.json
- run.log
- DIGEST.md

Security:
- Requires gh auth or GH_TOKEN; token value is never printed.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo) REPO="$2"; shift 2;;
    --run-id) RUN_ID="$2"; shift 2;;
    --out) OUT_DIR="$2"; shift 2;;
    -h|--help) usage; exit 0;;
    *) echo "Unknown arg: $1"; usage; exit 2;;
  esac
done

if [[ -z "${REPO}" || -z "${RUN_ID}" ]]; then
  usage; exit 2
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "[gh-pull-run-logs] gh CLI not found. Install gh or set PATH."
  exit 2
fi

if [[ -n "${GITHUB_TOKEN:-}" && -z "${GH_TOKEN:-}" ]]; then
  export GH_TOKEN="${GITHUB_TOKEN}"
fi

if ! gh auth status -h github.com >/dev/null 2>&1 && [[ -z "${GH_TOKEN:-}" ]]; then
  echo "[gh-pull-run-logs] gh not authenticated and GH_TOKEN not set."
  exit 2
fi

OUT_RUN_DIR="${OUT_DIR}/run-${RUN_ID}"
mkdir -p "${OUT_RUN_DIR}"

RUN_JSON_PATH="${OUT_RUN_DIR}/run.json"
LOG_PATH="${OUT_RUN_DIR}/run.log"
DIGEST_MD="${OUT_RUN_DIR}/DIGEST.md"

# Fetch run metadata (best-effort)
gh api "repos/${REPO}/actions/runs/${RUN_ID}" > "${RUN_JSON_PATH}" 2>/dev/null || echo '{}' > "${RUN_JSON_PATH}"

# Pull logs (best-effort); gh prints URLs but no secrets. Capture to file.
(gh run view "${RUN_ID}" -R "${REPO}" --log || true) > "${LOG_PATH}"

export RUN_JSON_PATH LOG_PATH DIGEST_MD REPO RUN_ID
python3 - <<'PY'
import json
import os
import re
from pathlib import Path

run_json_path = Path(os.environ["RUN_JSON_PATH"])
log_path = Path(os.environ["LOG_PATH"])
digest_path = Path(os.environ["DIGEST_MD"])
repo = os.environ.get("REPO", "")
run_id = os.environ.get("RUN_ID", "")

run = {}
try:
    run = json.loads(run_json_path.read_text(encoding="utf-8"))
except Exception:
    run = {}

name = str(run.get("name") or "")
event = str(run.get("event") or "")
status = str(run.get("status") or "")
conclusion = str(run.get("conclusion") or "")
html_url = str(run.get("html_url") or "")
head_branch = str(run.get("head_branch") or "")
head_sha = str(run.get("head_sha") or "")

lines = []
try:
    lines = log_path.read_text(encoding="utf-8", errors="replace").splitlines()
except Exception:
    lines = []

pat = re.compile(
    r"(::error\b|\\bERROR\\b|\\bFAILED\\b|Traceback|Exception|Process completed with exit code|npm ERR!|Module not found|Error:)",
    re.IGNORECASE,
)

idx = None
for i, l in enumerate(lines):
    if pat.search(l):
        idx = i
        break

if idx is None:
    snippet = lines[-220:] if lines else ["(log empty)"]
    title = "Tail (no error match)"
else:
    snippet = lines[idx : idx + 120]
    title = f"First error match at line {idx+1}"

out = []
out.append("# Workflow Run Digest (local)")
out.append("")
out.append(f"- Repo: {repo}")
out.append(f"- Run ID: {run_id}")
if name:
    out.append(f"- Workflow: {name}")
if event:
    out.append(f"- Event: {event}")
if status:
    out.append(f"- Status: {status}")
if conclusion:
    out.append(f"- Conclusion: {conclusion}")
if head_branch:
    out.append(f"- Head branch: {head_branch}")
if head_sha:
    out.append(f"- Head sha: {head_sha[:7]}")
if html_url:
    out.append(f"- Run URL: {html_url}")
out.append(f"- Log: {log_path}")
out.append("")
out.append(f"## {title}")
out.append("")
out.append("```text")
out.extend(snippet)
out.append("```")
out.append("")

digest_path.write_text("\n".join(out) + "\n", encoding="utf-8")
print(f"[gh-pull-run-logs] wrote {digest_path}")
PY

echo "[gh-pull-run-logs] wrote ${RUN_JSON_PATH}"
echo "[gh-pull-run-logs] wrote ${LOG_PATH}"
