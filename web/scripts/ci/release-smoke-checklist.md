# Release Smoke Checklist — Faz 0B

Before publishing a new design-system release, verify every item below.

## Automated gates

- [ ] All design-system tests pass (`node scripts/ci/publish-gate.mjs`)
- [ ] Visual diff reviewed and approved (`node scripts/ci/visual-diff-check.mjs`)

## Manual spot checks

- [ ] Dark mode spot check (3 components)
- [ ] Compact density spot check
- [ ] Browser: Chrome latest
- [ ] Browser: Firefox latest
- [ ] No console errors in development
- [ ] Token bridge CSS loads correctly
- [ ] Critical components render: Button, Switch, Input, Select
