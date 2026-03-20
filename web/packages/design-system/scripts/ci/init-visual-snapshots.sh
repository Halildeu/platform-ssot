#!/bin/bash
# Initialize Visual Regression Snapshots
#
# First-time setup: generates baseline screenshots for all visual tests.
# Storybook (from monorepo root) must be running or will be started by Playwright.
#
# Usage: ./scripts/ci/init-visual-snapshots.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PKG_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
MONO_ROOT="$(cd "$PKG_ROOT/../.." && pwd)"

echo "Initializing Visual Regression Snapshots"
echo "============================================"
echo "  Package root : $PKG_ROOT"
echo "  Monorepo root: $MONO_ROOT"
echo ""

# ── 1. Check Playwright availability ──────────────────────────────────────────
if ! npx playwright --version > /dev/null 2>&1; then
  echo "ERROR: Playwright is not installed."
  echo ""
  echo "  Install it with:"
  echo "    npm install --save-dev @playwright/test"
  echo "    npx playwright install chromium"
  echo ""
  exit 1
fi

PLAYWRIGHT_VERSION=$(npx playwright --version 2>/dev/null)
echo "Playwright: $PLAYWRIGHT_VERSION"

# ── 2. Check Playwright browsers ─────────────────────────────────────────────
if ! npx playwright install --dry-run 2>&1 | grep -q "chromium"; then
  echo ""
  echo "WARNING: Chromium browser may not be installed for Playwright."
  echo "  Run: npx playwright install chromium"
  echo ""
fi

# ── 3. Verify Playwright config exists ────────────────────────────────────────
if [ ! -f "$PKG_ROOT/playwright.config.ts" ]; then
  echo "ERROR: playwright.config.ts not found at $PKG_ROOT"
  exit 1
fi
echo "Config: playwright.config.ts found"

# ── 4. Check visual test files exist (.visual.ts) ────────────────────────────
VISUAL_DIR="$PKG_ROOT/src/__visual__"
VISUAL_FILES=$(find "$VISUAL_DIR" -name "*.visual.ts" 2>/dev/null | wc -l | tr -d ' ')

if [ "$VISUAL_FILES" -eq 0 ]; then
  echo ""
  echo "ERROR: No visual test files found in src/__visual__/"
  echo "  Expected: *.visual.ts files"
  echo ""
  echo "  Example (src/__visual__/button.visual.ts):"
  echo "    import { test, expect } from '@playwright/test';"
  echo "    test('Button default', async ({ page }) => {"
  echo "      await page.goto('/iframe.html?id=components-primitives-button--default');"
  echo "      await expect(page).toHaveScreenshot();"
  echo "    });"
  exit 1
fi

echo "Tests: $VISUAL_FILES visual test file(s) found"

# ── 5. Check Storybook availability ──────────────────────────────────────────
echo ""
if curl -s --max-time 3 http://localhost:6006 > /dev/null 2>&1; then
  echo "Storybook: already running on port 6006"
  echo "  (Playwright will reuse it)"
else
  echo "Storybook: not running on port 6006"
  echo "  Playwright will start it via webServer config (from monorepo root)"
  if [ ! -f "$MONO_ROOT/.storybook/main.ts" ] && [ ! -f "$MONO_ROOT/.storybook/main.js" ]; then
    echo ""
    echo "WARNING: No .storybook/main.ts found at monorepo root ($MONO_ROOT)"
    echo "  Storybook auto-start may fail. Start it manually:"
    echo "    cd $MONO_ROOT && npm run storybook"
    echo ""
  fi
fi

# ── 6. Verify Storybook can serve stories ─────────────────────────────────────
STORYBOOK_RUNNING=false
if curl -s --max-time 3 http://localhost:6006 > /dev/null 2>&1; then
  STORYBOOK_RUNNING=true
fi

# ── 7. Capture baseline snapshots ────────────────────────────────────────────
echo ""
echo "Capturing baseline screenshots..."
echo "  (This starts Storybook if needed — may take 2-5 minutes)"
echo ""

cd "$PKG_ROOT"
if ! npx playwright test --update-snapshots --reporter=list; then
  echo ""
  echo "============================================"
  echo "ERROR: Snapshot capture failed."
  echo ""
  if [ "$STORYBOOK_RUNNING" = "false" ]; then
    echo "Storybook was not running and Playwright could not start it."
    echo ""
    echo "Common fixes:"
    echo "  1. Start Storybook manually:"
    echo "       cd $MONO_ROOT && npm run storybook"
    echo ""
    echo "  2. If Storybook has version mismatches, run:"
    echo "       cd $MONO_ROOT && npx storybook doctor"
    echo ""
    echo "  3. Once Storybook is running on :6006, re-run this script."
  fi
  exit 1
fi

SNAPSHOT_DIR="$VISUAL_DIR/__snapshots__"
SNAPSHOT_COUNT=0
if [ -d "$SNAPSHOT_DIR" ]; then
  SNAPSHOT_COUNT=$(find "$SNAPSHOT_DIR" -name "*.png" 2>/dev/null | wc -l | tr -d ' ')
fi

echo ""
echo "============================================"
echo "Baseline snapshots created: $SNAPSHOT_COUNT images"
echo "Location: src/__visual__/__snapshots__/"
echo ""
echo "Next steps:"
echo "  1. Review snapshots visually"
echo "  2. Commit the __snapshots__ directory"
echo "  3. Future runs compare against these baselines"
echo "  4. Update baselines: ./scripts/ci/visual-regression.sh --update"
