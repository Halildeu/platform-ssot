#!/bin/bash
# Visual Regression Test Runner
# Usage: ./scripts/ci/visual-regression.sh [--update]

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PKG_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "Visual Regression Tests"
echo "============================================"

# ── Pre-flight checks ────────────────────────────────────────────────────────

# 1. Check Playwright
if ! npx playwright --version > /dev/null 2>&1; then
  echo ""
  echo "ERROR: Playwright is not installed."
  echo ""
  echo "  Install with:"
  echo "    npm install --save-dev @playwright/test"
  echo "    npx playwright install chromium"
  echo ""
  echo "  Then re-run: $0 $*"
  exit 1
fi

# 2. Check Playwright config
if [ ! -f "$PKG_ROOT/playwright.config.ts" ]; then
  echo "ERROR: playwright.config.ts not found at $PKG_ROOT"
  exit 1
fi

# 3. Check visual test files
VISUAL_DIR="$PKG_ROOT/src/__visual__"
VISUAL_FILES=$(find "$VISUAL_DIR" -name "*.visual.ts" 2>/dev/null | wc -l | tr -d ' ')

if [ "$VISUAL_FILES" -eq 0 ]; then
  echo "ERROR: No *.visual.ts files found in src/__visual__/"
  exit 1
fi

# 4. Install Playwright browsers if needed (non-blocking in CI)
npx playwright install chromium --with-deps 2>/dev/null || true

# ── Run tests ─────────────────────────────────────────────────────────────────

cd "$PKG_ROOT"

if [ "$1" = "--update" ]; then
  echo ""
  echo "Updating snapshots ($VISUAL_FILES test files)..."
  npx playwright test --update-snapshots --reporter=list
  echo ""
  echo "Snapshots updated. Review and commit changes in src/__visual__/__snapshots__/"
else
  echo ""
  echo "Running visual tests ($VISUAL_FILES test files)..."
  npx playwright test
  echo ""
  echo "All visual tests passed"
fi
