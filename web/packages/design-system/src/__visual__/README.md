# Visual Regression Tests

Playwright-based visual regression testing for design-system components via Storybook.

## Prerequisites

- Storybook running on port 6006 (`npm run storybook`)
- Playwright installed (`npx playwright install chromium`)

## Running Tests

```bash
# Auto-starts Storybook if not already running
npx playwright test

# Or use the CI script
./scripts/ci/visual-regression.sh
```

## Updating Snapshots

When a visual change is intentional, update the baseline screenshots:

```bash
npx playwright test --update-snapshots

# Or via CI script
./scripts/ci/visual-regression.sh --update
```

## Test Structure

| File                       | Purpose                                        |
| -------------------------- | ---------------------------------------------- |
| `components.visual.ts`     | Static screenshots of 21 components + dark mode |
| `interactions.visual.ts`   | Hover, focus, checked, toggled states           |

## Snapshots

- Stored in `__snapshots__/` (committed to git)
- Test artifacts in `test-results/` (gitignored)
- `maxDiffPixelRatio: 0.01` threshold (1% pixel tolerance)

## Story IDs

Story IDs are derived from the Storybook `title` field and export name:

```
title: 'Components/Primitives/Button'  +  export Default
  =>  components-primitives-button--default
```

If a story ID changes (e.g. component is reorganized), update the corresponding
entry in `components.visual.ts`.

## CI Integration

The `webServer` config in `playwright.config.ts` auto-starts Storybook in CI.
Set `CI=true` to enforce single-worker execution and retry on failure.
