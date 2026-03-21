# Issue Triage Runbook

> Standard operating procedure for triaging issues and pull requests in the @mfe platform repository.

## Severity Definitions

| Severity | Label | Definition | Example |
|---|---|---|---|
| **P0 — Critical** | `P0` | Production broken, no workaround, affects all users | Build fails on main, auth token leak, total a11y failure |
| **P1 — High** | `P1` | Major feature broken, workaround exists or limited blast | DataGrid crashes with >5K rows, SSO redirect loop on Firefox |
| **P2 — Medium** | `P2` | Feature degraded, non-blocking workaround available | DatePicker keyboard nav broken in Safari, chart tooltip flicker |
| **P3 — Low** | `P3` | Minor issue, cosmetic, or edge case | Badge text truncation at extreme zoom, stale Storybook link |
| **P4 — Wishlist** | `P4` | Nice-to-have, not a defect | "Add animation to Accordion open", doc improvement suggestion |

## Label Taxonomy

### Priority
`P0` `P1` `P2` `P3` `P4`

### Type
`bug` `feature` `enhancement` `docs` `chore` `refactor` `performance` `security` `a11y` `breaking`

### Package
`pkg:design-system` `pkg:x-data-grid` `pkg:x-charts` `pkg:x-scheduler` `pkg:x-kanban` `pkg:x-editor` `pkg:ui-kit` `pkg:shell` `pkg:docs`

### Status
`needs-triage` `needs-repro` `confirmed` `in-progress` `blocked` `stale` `wontfix` `duplicate`

### Special
`good-first-issue` `help-wanted` `pinned` `WIP` `breaking` `rfc`

## Triage Flowchart

```
New Issue Opened
       │
       ▼
┌──────────────┐
│ Is it spam /  │──── Yes ──→ Close + label `spam`
│ off-topic?    │
└──────┬───────┘
       │ No
       ▼
┌──────────────┐
│ Is it a       │──── Yes ──→ Link original + label `duplicate` + close
│ duplicate?    │
└──────┬───────┘
       │ No
       ▼
┌──────────────┐
│ Has repro     │──── No ───→ Label `needs-repro` + comment template
│ steps?        │             (wait 14 days, then close if no response)
└──────┬───────┘
       │ Yes
       ▼
┌──────────────┐
│ Can we        │──── No ───→ Label `needs-repro` + ask for more info
│ reproduce?    │
└──────┬───────┘
       │ Yes
       ▼
┌──────────────────────────┐
│ Assign labels:           │
│  - Priority (P0-P4)      │
│  - Type (bug/feature/...) │
│  - Package (pkg:*)        │
│  - Status → `confirmed`   │
└──────────┬───────────────┘
           │
           ▼
┌──────────────┐
│ P0 or P1?    │──── Yes ──→ Assign owner immediately
└──────┬───────┘             Notify in #platform-alerts
       │ No
       ▼
  Add to backlog
  (prioritized in next sprint planning)
```

## Assignment Rules

| Condition | Assigned To |
|---|---|
| `pkg:design-system` issues | Design system team lead |
| `pkg:x-data-grid` issues | Grid team lead |
| `pkg:x-charts` issues | Charts team lead |
| `security` label | Security champion (immediate) |
| `a11y` label | Accessibility lead |
| `P0` any package | On-call engineer + team lead |
| `good-first-issue` | Unassigned (community pool) |
| External contributor PR | Maintainer with most context on files changed |

## Escalation Path

```
Level 1: Package owner (same day for P0/P1)
    │
    ▼ (no response in 4 hours for P0, 1 day for P1)
Level 2: Platform engineering lead
    │
    ▼ (no resolution in 1 day for P0, 3 days for P1)
Level 3: Engineering manager + architecture review
    │
    ▼ (security issues)
Level 4: CISO / security team
```

## Response Time Targets

| Severity | First Response | Triage Complete | Fix Merged |
|---|---|---|---|
| P0 | < 1 hour | < 4 hours | < 24 hours |
| P1 | < 4 hours | < 1 business day | < 1 week |
| P2 | < 1 business day | < 3 business days | Next sprint |
| P3 | < 3 business days | < 1 week | Best effort |
| P4 | < 1 week | < 2 weeks | Backlog |

## Weekly Triage Meeting

**When**: Every Monday, 10:00 AM (30 minutes)

**Participants**: Platform lead, package leads, QA lead, a11y lead

**Agenda**:
1. Review `needs-triage` issues (5 min)
2. Review `needs-repro` older than 7 days (3 min)
3. P0/P1 status check (5 min)
4. Stale issue review (3 min)
5. PR review queue health (5 min)
6. Sprint capacity check for incoming P2s (5 min)
7. Open discussion (4 min)

**Outputs**:
- All `needs-triage` issues labeled and assigned
- Stale `needs-repro` issues closed or escalated
- P0/P1 owners confirmed with ETAs
- Updated sprint backlog

## Templates

### Needs Reproduction Comment

```markdown
Thanks for reporting this issue. To help us investigate, could you provide:

1. **Steps to reproduce** (minimal, specific)
2. **Expected behavior**
3. **Actual behavior**
4. **Environment**: OS, browser, package version
5. **Minimal reproduction**: CodeSandbox or repo link preferred

We'll revisit this in 14 days. If we don't hear back, we'll close the issue — feel free to reopen anytime with more details.
```

### Duplicate Close Comment

```markdown
This appears to be a duplicate of #[NUMBER]. Closing in favor of the original issue to keep discussion in one place.

If you believe this is different, please reopen with details on how it differs.
```
