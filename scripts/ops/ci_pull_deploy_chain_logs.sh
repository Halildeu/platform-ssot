#!/usr/bin/env bash
set -euo pipefail

# Prevent accidental secret leakage if the caller enabled xtrace.
set +x

REPO="${GITHUB_REPOSITORY:-}"
SHA=""
OUT_DIR="artifacts/ci-logs"

usage() {
  cat <<'EOF'
Usage: bash scripts/ops/ci_pull_deploy_chain_logs.sh --sha <merge_commit_sha> [--repo owner/repo] [--out <dir>]

Finds and downloads logs for the deploy chain on main:
- deploy-web
- deploy-backend
- post-deploy-validate
- rollback

Output:
- <out>/main-<sha7>/DEPLOY-CHAIN.md
- <out>/run-<id>/* (via scripts/ops/gh_pull_run_logs.sh)

Notes:
- This is "best effort": missing runs are reported but not treated as an error.
- Requires gh auth or GH_TOKEN; token value is never printed.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo) REPO="$2"; shift 2;;
    --sha) SHA="$2"; shift 2;;
    --out) OUT_DIR="$2"; shift 2;;
    -h|--help) usage; exit 0;;
    *) echo "Unknown arg: $1"; usage; exit 2;;
  esac
done

if [[ -z "${REPO}" || -z "${SHA}" ]]; then
  usage; exit 2
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "[ci-pull-deploy] gh CLI not found. Install gh or set PATH."
  exit 2
fi

if [[ -n "${GITHUB_TOKEN:-}" && -z "${GH_TOKEN:-}" ]]; then
  export GH_TOKEN="${GITHUB_TOKEN}"
fi

if ! gh auth status -h github.com >/dev/null 2>&1 && [[ -z "${GH_TOKEN:-}" ]]; then
  echo "[ci-pull-deploy] gh not authenticated and GH_TOKEN not set."
  exit 2
fi

SHA7="${SHA:0:7}"
OUT_SHA_DIR="${OUT_DIR}/main-${SHA7}"
mkdir -p "${OUT_SHA_DIR}"

PAGES_JSON="${OUT_SHA_DIR}/runs-pages.json"

gh api --paginate --slurp "repos/${REPO}/actions/runs?head_sha=${SHA}&per_page=100" > "${PAGES_JSON}" || echo '[]' > "${PAGES_JSON}"

export PAGES_JSON OUT_SHA_DIR REPO SHA
python3 - <<'PY'
import json
import os
from pathlib import Path

pages_path = Path(os.environ["PAGES_JSON"])
out_dir = Path(os.environ["OUT_SHA_DIR"])
repo = os.environ.get("REPO", "")
sha = os.environ.get("SHA", "")

names = ["deploy-web", "deploy-backend", "post-deploy-validate", "rollback"]

pages = []
try:
    pages = json.loads(pages_path.read_text(encoding="utf-8"))
except Exception:
    pages = []

if not isinstance(pages, list):
    pages = [pages]

all_runs = []
for page in pages:
    if not isinstance(page, dict):
        continue
    runs = page.get("workflow_runs") or []
    if isinstance(runs, list):
        all_runs.extend([r for r in runs if isinstance(r, dict)])

# pick newest-first per name
latest_by_name = {}
for r in all_runs:
    name = r.get("name")
    if not isinstance(name, str):
        continue
    if name not in names:
        continue
    if name in latest_by_name:
        continue
    latest_by_name[name] = r

rows = []
for n in names:
    r = latest_by_name.get(n)
    if not isinstance(r, dict):
        rows.append({"name": n, "found": False})
        continue
    rows.append(
        {
            "name": n,
            "found": True,
            "id": r.get("id"),
            "status": r.get("status"),
            "conclusion": r.get("conclusion"),
            "event": r.get("event"),
            "html_url": r.get("html_url"),
        }
    )

report = out_dir / "DEPLOY-CHAIN.md"
lines = []
lines.append("# Deploy Chain Logs (local)")
lines.append("")
lines.append(f"- repo: {repo}")
lines.append(f"- head_sha: {sha}")
lines.append("")
lines.append("## Runs")
for row in rows:
    if not row.get("found"):
        lines.append(f"- {row['name']}: (not found)")
        continue
    rid = row.get("id")
    st = row.get("status")
    conc = row.get("conclusion")
    ev = row.get("event")
    url = row.get("html_url")
    lines.append(f"- {row['name']}: id={rid} status={st} conclusion={conc} event={ev} url={url}")
lines.append("")
report.write_text("\n".join(lines) + "\n", encoding="utf-8")

json_out = out_dir / "deploy-chain-runs.json"
json_out.write_text(json.dumps({"repo": repo, "sha": sha, "runs": rows}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

print(f"[ci-pull-deploy] wrote {report}")
print(f"[ci-pull-deploy] wrote {json_out}")
PY

# Download logs for found runs (best-effort)
RUN_IDS="$(
  python3 - <<'PY'
import json, os
from pathlib import Path

out_dir = Path(os.environ["OUT_SHA_DIR"])
data = json.loads((out_dir / "deploy-chain-runs.json").read_text(encoding="utf-8"))
for r in data.get("runs", []):
    if r.get("found") and isinstance(r.get("id"), int):
        print(r["id"])
PY
)"

if [[ -z "${RUN_IDS}" ]]; then
  echo "[ci-pull-deploy] no deploy-chain runs found for sha=${SHA7} (report: ${OUT_SHA_DIR}/DEPLOY-CHAIN.md)"
  exit 0
fi

while IFS= read -r rid; do
  [[ -n "${rid}" ]] || continue
  bash scripts/ops/gh_pull_run_logs.sh --repo "${REPO}" --run-id "${rid}" --out "${OUT_DIR}" || true
done <<< "${RUN_IDS}"

echo "[ci-pull-deploy] done. report: ${OUT_SHA_DIR}/DEPLOY-CHAIN.md"
