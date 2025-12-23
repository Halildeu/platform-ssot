#!/usr/bin/env bash
set -euo pipefail

REPO="${GITHUB_REPOSITORY:-}"
PR=""
MAX_ATTEMPTS=5
OUT_DIR="artifacts/ci-logs"
FIX_CMD="${AUTOPILOT_FIX_CMD:-}"
SEMANTIC_LINT_ENABLED="${AUTOPILOT_SEMANTIC_LINT:-}"
SEMANTIC_JSON_OUT="${AUTOPILOT_SEMANTIC_JSON_OUT:-.autopilot-tmp/doc-lint/semantic-report.json}"
SEMANTIC_TSV_OUT="${AUTOPILOT_SEMANTIC_TSV_OUT:-.autopilot-tmp/doc-lint/semantic-report.tsv}"

usage() {
  echo "Usage: $0 --pr <num> [--repo owner/repo] [--max N] [--out dir]"
  echo "Env: GH_TOKEN must be set or gh auth login; token value not printed."
  echo "Env: AUTOPILOT_FIX_CMD optional (command that applies a fix locally)."
  echo "Env: AUTOPILOT_SEMANTIC_LINT=1 optional (local-only semantic lint report)."
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

HEAD_REF="$(gh api "repos/${REPO}/pulls/${PR}" --jq '.head.ref' 2>/dev/null || true)"
HEAD_REF="$(printf '%s' "${HEAD_REF}" | tr -d '\r' | sed -E 's/^"//; s/"$//; s/^[[:space:]]+//; s/[[:space:]]+$//')"

if [[ -z "${HEAD_REF}" || "${HEAD_REF}" == "null" ]]; then
  echo "[autopilot] Cannot read PR head ref."; exit 2
fi

echo "[autopilot] repo=${REPO} pr=#${PR} head_ref=${HEAD_REF} max=${MAX_ATTEMPTS}"

collect_changed_docs() {
  {
    git diff --name-only
    git diff --name-only --cached
    git diff --name-only origin/main...HEAD 2>/dev/null || true
  } | sed -n -E '/^docs\\//p' | sed -n -E '/\\.md$/p' | sort -u
}

maybe_semantic_lint() {
  if [[ "${SEMANTIC_LINT_ENABLED}" != "1" ]]; then
    return 0
  fi

  local changed_docs
  changed_docs="$(collect_changed_docs || true)"
  if [[ -z "${changed_docs}" ]]; then
    echo "[autopilot] semantic-lint: no docs changes detected; skip"
    return 0
  fi

  echo "[autopilot] semantic-lint: running (non-blocking)"
  python3 scripts/check_doc_semantic_lint.py \
    --paths ${changed_docs} \
    --json-out "${SEMANTIC_JSON_OUT}" \
    --tsv-out "${SEMANTIC_TSV_OUT}" \
    >/dev/null 2>&1 || true

  SEMANTIC_JSON_OUT="${SEMANTIC_JSON_OUT}" python3 - <<'PY' || true
import json
import os
from pathlib import Path

json_out = Path(os.environ.get("SEMANTIC_JSON_OUT", ".autopilot-tmp/doc-lint/semantic-report.json"))
if not json_out.exists():
    raise SystemExit(0)

d = json.loads(json_out.read_text(encoding="utf-8"))
s = d.get("summary") or {}
sc = s.get("severity_counts") or {}
avg = s.get("avg_score")

files = d.get("files") or []
lowest = sorted((f.get("score", 0), f.get("path", "")) for f in files)[:3]

print("[autopilot] semantic-lint: avg_score=", avg, "counts=", sc)
if lowest:
    print("[autopilot] semantic-lint: lowest=", ", ".join(f"{p}:{score}" for score, p in lowest if p))
PY
}

# Local PR tracker (gitignored). No-op on errors.
python3 scripts/pr_tracker_tsv.py add --repo "${REPO}" --pr "${PR}" >/dev/null 2>&1 || true

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
  if gh pr checks "${PR}" -R "${REPO}" --watch; then
    state="$(gh pr view "${PR}" -R "${REPO}" --json state -q .state || echo unknown)"
    echo "[autopilot] PASS. PR state=${state}"
    python3 scripts/pr_tracker_tsv.py add --repo "${REPO}" --pr "${PR}" >/dev/null 2>&1 || true
    maybe_semantic_lint || true
    exit 0
  fi

  echo "[autopilot] FAIL. downloading logs..."
  ./scripts/ci_pull_logs.sh --repo "${REPO}" --pr "${PR}" --out "${OUT_DIR}" || true
  FAILURE_MD="${OUT_DIR}/pr-${PR}/FAILURE.md"
  echo "[autopilot] failure bundle: ${FAILURE_MD}"
  python3 scripts/pr_tracker_tsv.py add --repo "${REPO}" --pr "${PR}" >/dev/null 2>&1 || true

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

  maybe_semantic_lint || true

  git add -A
  git commit -m "fix(autopilot): attempt ${attempt} for PR #${PR}" || true
  git push -u origin HEAD
  python3 scripts/pr_tracker_tsv.py add --repo "${REPO}" --pr "${PR}" >/dev/null 2>&1 || true
  attempt=$((attempt+1))
done

echo "[autopilot] max attempts reached; stopping."
exit 5
