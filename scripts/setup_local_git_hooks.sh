#!/usr/bin/env bash
set -euo pipefail

# Setup local git hooks for pre-push gate enforcement.
# Run once: bash scripts/setup_local_git_hooks.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
HOOKS_DIR="${ROOT_DIR}/.git/hooks"

mkdir -p "${HOOKS_DIR}"

# ── Pre-push hook: require local gate PASS before push ──
cat > "${HOOKS_DIR}/pre-push" <<'HOOK'
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel)"
GUARD="${ROOT_DIR}/scripts/require_local_gate.sh"

if [[ -f "${GUARD}" ]]; then
  bash "${GUARD}" --caller "pre-push"
else
  echo "[pre-push] require_local_gate.sh bulunamadı — skip"
fi
HOOK

chmod +x "${HOOKS_DIR}/pre-push"
echo "[setup-hooks] pre-push hook installed: ${HOOKS_DIR}/pre-push"
echo "[setup-hooks] Push öncesi local gate chain PASS zorunlu."
echo ""
echo "Usage:"
echo "  bash scripts/run_local_gate_chain.sh   # Gate zincirini çalıştır"
echo "  git push                                # Otomatik guard kontrol eder"
echo "  bash scripts/require_local_gate.sh --auto-run  # Eksikse otomatik çalıştır"
