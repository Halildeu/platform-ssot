# F4 Enterprise X Suite — Phase Gate Definitions

## Status: DRAFT | Date: 2026-03-21

Every phase in the X Suite delivery lifecycle must pass **all four gates** before it can close.
Each gate is evaluated as **PASS**, **FAIL**, or **BLOCKED**.
A phase can only close when all 4 gates reach PASS status.

---

## Gate 1: Contract Gate

Ensures the public API surface is stable, reviewed, and documented before implementation begins.

| # | Criterion | Evidence | Status |
|---|-----------|----------|--------|
| 1.1 | API contract (`CONTRACT.md`) exists in package root | File present in repo | |
| 1.2 | API contract reviewed by at least 2 engineers | PR approval record | |
| 1.3 | TypeScript interfaces exported from package entry point | `index.ts` barrel export verified | |
| 1.4 | All public props documented with JSDoc descriptions | TSDoc coverage check | |
| 1.5 | Data model defined (input shapes, event payloads, state) | Documented in CONTRACT.md | |
| 1.6 | Breaking change policy stated | Section in CONTRACT.md | |

**Pass condition**: All 6 criteria met.
**Fail condition**: Any criterion not met.
**Blocked condition**: Waiting on external dependency (e.g., upstream API not finalized).

---

## Gate 2: Quality Gate

Ensures the implementation meets reliability, accessibility, and performance standards.

| # | Criterion | Evidence | Status |
|---|-----------|----------|--------|
| 2.1 | Unit test coverage >= 80% | Istanbul/c8 coverage report | |
| 2.2 | Integration tests for key flows (CRUD, selection, export, etc.) | Test suite green in CI | |
| 2.3 | Visual regression baseline captured | Chromatic/Percy snapshot set | |
| 2.4 | axe-core accessibility score >= 95/100 | CI axe audit report | |
| 2.5 | Performance budgets met (see `benchmark-matrix.md`) | Lighthouse / custom perf harness | |
| 2.6 | Zero console errors in all Storybook stories | CI console error check | |
| 2.7 | Design Lab quality score 100% | Design Lab audit report | |

**Pass condition**: All 7 criteria met.
**Fail condition**: Any criterion not met.
**Blocked condition**: Test infrastructure not available or benchmark tooling not configured.

---

## Gate 3: Docs Gate

Ensures consumers can discover, learn, and adopt the package without tribal knowledge.

| # | Criterion | Evidence | Status |
|---|-----------|----------|--------|
| 3.1 | API reference auto-generated from TypeScript types | Typedoc / API Extractor output published | |
| 3.2 | Minimum 3 usage examples per component | Examples directory / docs site | |
| 3.3 | Minimum 1 recipe or tutorial per package | Docs site recipe section | |
| 3.4 | Migration guide provided (if replacing an existing solution) | `MIGRATION.md` in package root | |
| 3.5 | Storybook stories for all component variants | Storybook build verified | |
| 3.6 | Entry added to Component Selection Guide | Selection guide doc updated | |

**Pass condition**: All applicable criteria met (3.4 only required when replacing existing).
**Fail condition**: Any applicable criterion not met.
**Blocked condition**: Docs infrastructure not deployed.

---

## Gate 4: Adoption Gate

Ensures the package is validated in real product usage and ready for broad rollout.

| # | Criterion | Evidence | Status |
|---|-----------|----------|--------|
| 4.1 | Minimum 2 internal consumers integrated (e.g., mfe-shell, mfe-users, mfe-reporting) | Import references in consumer repos | |
| 4.2 | Usage metrics instrumented (renders, errors, feature flags) | Telemetry dashboard or log evidence | |
| 4.3 | No open P0 or P1 bugs | Issue tracker query | |
| 4.4 | Developer feedback collected from at least 2 consuming teams | Survey / retro notes | |

**Pass condition**: All 4 criteria met.
**Fail condition**: Any criterion not met.
**Blocked condition**: Fewer than 2 consumers available for integration.

---

## Phase Closure Checklist

```
Phase: _______________
Date:  _______________

[ ] Contract Gate  — PASS / FAIL / BLOCKED
[ ] Quality Gate   — PASS / FAIL / BLOCKED
[ ] Docs Gate      — PASS / FAIL / BLOCKED
[ ] Adoption Gate  — PASS / FAIL / BLOCKED

Phase closed: YES / NO
Sign-off: _______________
```
