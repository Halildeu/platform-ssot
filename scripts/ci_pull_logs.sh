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

PR_JSON="$(gh api "repos/${REPO}/pulls/${PR}")"

HEAD_SHA="$(python3 - <<'PY'
import json,sys
print(json.load(sys.stdin).get('head',{}).get('sha',''))
PY
<<<"${PR_JSON}")"

HEAD_REF="$(python3 - <<'PY'
import json,sys
print(json.load(sys.stdin).get('head',{}).get('ref',''))
PY
<<<"${PR_JSON}")"

PR_URL="$(python3 - <<'PY'
import json,sys
print(json.load(sys.stdin).get('html_url',''))
PY
<<<"${PR_JSON}")"

if [[ -z "${HEAD_SHA}" ]]; then
  echo "[ci-logs] Cannot read head SHA for PR #${PR}."; exit 3
fi

RUNS_PAGES_PATH="${OUT_PR_DIR}/runs-pages.json"
FAILING_RUNS_JSON="${OUT_PR_DIR}/failing-runs.json"
FAILING_RUNS_TSV="${OUT_PR_DIR}/failing-runs.tsv"
FAILURE_MD="${OUT_PR_DIR}/FAILURE.md"

gh api --paginate --slurp \
  "repos/${REPO}/actions/runs?event=pull_request&head_sha=${HEAD_SHA}&per_page=100" \
  > "${RUNS_PAGES_PATH}"

python3 - "${RUNS_PAGES_PATH}" "${FAILING_RUNS_JSON}" "${FAILING_RUNS_TSV}" <<'PY'
import json
import sys

runs_pages_path, out_json_path, out_tsv_path = sys.argv[1:4]
pages = json.load(open(runs_pages_path, "r", encoding="utf-8"))
if not isinstance(pages, list):
    pages = [pages]

all_runs = []
for page in pages:
    if not isinstance(page, dict):
        continue
    runs = page.get("workflow_runs") or []
    if isinstance(runs, list):
        all_runs.extend([r for r in runs if isinstance(r, dict)])

def is_failing(run: dict) -> bool:
    if run.get("status") != "completed":
        return False
    conclusion = run.get("conclusion")
    if not conclusion or not isinstance(conclusion, str):
        return False
    return conclusion != "success"

# actions/runs zaten newest-first gelir; aynı workflow için sadece en son fail'i al.
seen = set()
selected = []
for run in all_runs:
    if not is_failing(run):
        continue
    name = run.get("name") or ""
    if not isinstance(name, str):
        name = ""
    key = name.strip() or f"id:{run.get('id')}"
    if key in seen:
        continue
    seen.add(key)
    selected.append(
        {
            "id": run.get("id"),
            "name": name.strip() or "(unknown)",
            "conclusion": run.get("conclusion") or "",
            "html_url": run.get("html_url") or "",
        }
    )

with open(out_json_path, "w", encoding="utf-8") as f:
    json.dump(selected, f, ensure_ascii=False, indent=2)

with open(out_tsv_path, "w", encoding="utf-8") as f:
    f.write("RUN_ID\tWORKFLOW\tCONCLUSION\tRUN_URL\n")
    for r in selected:
        f.write(f"{r.get('id')}\t{r.get('name')}\t{r.get('conclusion')}\t{r.get('html_url')}\n")
PY

if [[ ! -s "${FAILING_RUNS_TSV}" ]] || [[ "$(wc -l < "${FAILING_RUNS_TSV}")" -le 1 ]]; then
  {
    echo "# CI Failure Digest (local)"
    echo ""
    echo "- PR: ${PR_URL}"
    echo "- Head: ${HEAD_REF}@${HEAD_SHA}"
    echo ""
    echo "No failing workflow runs found for this PR head SHA."
  } > "${FAILURE_MD}"
  echo "[ci-logs] no failing runs; wrote ${FAILURE_MD}"
  exit 0
fi

while IFS=$'\t' read -r RUN_ID WF_NAME CONCLUSION RUN_URL; do
  [[ "${RUN_ID}" == "RUN_ID" ]] && continue
  [[ -z "${RUN_ID}" ]] && continue
  LOG_PATH="${OUT_PR_DIR}/run-${RUN_ID}.log"
  # Logları indir. Cancelled/permission vb durumlarda dosya boş kalabilir.
  (gh run view "${RUN_ID}" -R "${REPO}" --log || true) > "${LOG_PATH}"
done < "${FAILING_RUNS_TSV}"

export OUT_PR_DIR FAILURE_MD FAILING_RUNS_JSON HEAD_SHA HEAD_REF PR_URL
python3 - <<'PY'
import json
import os
import re
from pathlib import Path

out_dir = Path(os.environ["OUT_PR_DIR"])
fail_path = Path(os.environ["FAILURE_MD"])
failing_runs_json = Path(os.environ["FAILING_RUNS_JSON"])
head_sha = os.environ.get("HEAD_SHA", "")
head_ref = os.environ.get("HEAD_REF", "")
pr_url = os.environ.get("PR_URL", "")

pat = re.compile(
    r"(\\[ci-gate\\]\\s+FAIL:|Traceback|Process completed with exit code|npm ERR!|Module not found|ERROR\\b|Error:|FAILED\\b|Exception)",
    re.IGNORECASE,
)
path_pat = re.compile(r"(?P<p>(?:docs|web|backend|\\.github)/[^\\s\\)\\]\\[\\\"']+)")

runs = json.load(open(failing_runs_json, "r", encoding="utf-8"))
if not isinstance(runs, list):
    runs = []

lines = []
lines.append("# CI Failure Digest (local)")
lines.append("")
lines.append(f"- PR: {pr_url}")
lines.append(f"- Head: {head_ref}@{head_sha}")
lines.append(f"- Bundle: {out_dir}")
lines.append(f"- Failing workflows: {len(runs)}")
lines.append("")

lines.append("## Failing Workflows")
lines.append("")
for r in runs:
    run_id = r.get("id")
    name = r.get("name", "(unknown)")
    conclusion = r.get("conclusion", "")
    url = r.get("html_url", "")
    log_path = out_dir / f"run-{run_id}.log"
    lines.append(f"- {name} ({conclusion}) - {url} (log: `{log_path}`)")

paths = []
seen_paths = set()

for r in runs:
    run_id = r.get("id")
    name = r.get("name", "(unknown)")
    conclusion = r.get("conclusion", "")
    url = r.get("html_url", "")
    log_path = out_dir / f"run-{run_id}.log"

    raw_lines = []
    if log_path.exists():
        try:
            raw_lines = log_path.read_text(encoding="utf-8", errors="replace").splitlines()
        except OSError:
            raw_lines = []

    idx = None
    for i, l in enumerate(raw_lines):
        if pat.search(l):
            idx = i
            break

    if idx is None:
        snippet = raw_lines[-200:] if raw_lines else ["(log empty)"]
        title = "Tail (no error match)"
    else:
        snippet = raw_lines[idx : idx + 120]
        title = f"First error match at line {idx+1}"

    for l in snippet:
        m = path_pat.search(l)
        if not m:
            continue
        p = m.group("p")
        p = p.rstrip('),"]')
        if p in seen_paths:
            continue
        seen_paths.add(p)
        paths.append(p)
        if len(paths) >= 200:
            break

    lines.append("")
    lines.append(f"## {name} (conclusion={conclusion})")
    lines.append("")
    lines.append(f"- Run: {url}")
    lines.append(f"- Log: `{log_path}`")
    lines.append("")
    lines.append(f"### {title}")
    lines.append("")
    lines.append("```text")
    lines.extend(snippet)
    lines.append("```")
    if len(paths) >= 200:
        break

if paths:
    lines.append("")
    lines.append("## Paths Referenced (best-effort)")
    lines.append("")
    for p in paths:
        lines.append(f"- `{p}`")

fail_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
PY

echo "[ci-logs] wrote ${FAILURE_MD}"
