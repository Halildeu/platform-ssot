# Incident Response Runbook

## Severity Levels

| Level | Description | Response Time | Examples |
|-------|-------------|---------------|----------|
| SEV1 | Critical — Production down, data loss risk | 15 min | Full outage, security breach, data corruption |
| SEV2 | Major — Significant feature degraded | 30 min | Auth failures, payment issues, major MFE unreachable |
| SEV3 | Minor — Non-critical feature impacted | 4 hours | UI glitch, minor perf degradation, single MFE flaky |
| SEV4 | Low — Cosmetic or informational | Next business day | Typo, non-blocking warning, minor style issue |

## Response Roles

### Incident Commander (IC)
- Owns the incident lifecycle from detection to postmortem
- Coordinates responders and communication
- Makes escalation decisions
- Declares incident resolved

### Tech Lead (TL)
- Leads technical investigation and mitigation
- Identifies root cause
- Implements fix or workaround
- Validates resolution

### Communications Lead (Comms)
- Updates stakeholders at regular intervals
- Posts status page updates
- Drafts internal/external communications
- Coordinates with customer support

## Incident Timeline

### 1. Detect
- Alert fires or user report received
- On-call engineer acknowledges within SLA
- Create incident channel/thread

### 2. Triage
- Assign severity level (SEV1-SEV4)
- Assign IC, TL, and Comms roles
- Identify affected systems and blast radius
- Determine if customer-facing impact exists

### 3. Mitigate
- Apply immediate mitigation (kill switch, rollback, feature flag toggle)
- Communicate mitigation status
- Verify mitigation effectiveness
- Monitor for regression

### 4. Resolve
- Implement permanent fix
- Deploy and verify fix in production
- Confirm all affected systems recovered
- IC declares incident resolved

### 5. Postmortem
- Schedule postmortem within 48 hours (SEV1/SEV2) or 1 week (SEV3)
- Complete postmortem document
- Review and assign action items
- Share learnings with broader team

## Postmortem Template

```
## Incident Postmortem: [Title]

**Date:** YYYY-MM-DD
**Duration:** X hours Y minutes
**Severity:** SEVN
**IC:** [Name]
**TL:** [Name]

### Summary
[1-2 sentence description of what happened and impact]

### Timeline (all times in UTC)
- HH:MM — [Event]
- HH:MM — [Event]

### Root Cause
[Technical description of root cause]

### Impact
- Users affected: [count/percentage]
- Duration of impact: [time]
- Revenue impact: [if applicable]

### What Went Well
- [Item]

### What Went Wrong
- [Item]

### Action Items
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| [Action] | [Name] | YYYY-MM-DD | Open |

### Lessons Learned
- [Item]
```

## Communication Template

### Internal Status Update

```
**Incident:** [Title]
**Severity:** SEVN
**Status:** Investigating / Mitigating / Monitoring / Resolved
**Last Updated:** YYYY-MM-DD HH:MM UTC

**Current Impact:** [Description of user-facing impact]

**What we know:** [Brief technical summary]

**Next update in:** [X minutes/hours]
```

### Stakeholder Notification (SEV1/SEV2)

```
Subject: [SEV1/SEV2] [Service] Incident — [Brief Title]

We are currently experiencing [brief description of the issue].

Impact: [What users/customers are affected and how]

We are actively investigating and will provide updates every [30 min / 1 hour].

Current mitigation: [Any steps taken]

Next update: [Time]
```

## Quick Reference: Kill Switches

Feature flags that can be toggled without deployment:

| Flag Key | Description | Safe to Disable? |
|----------|-------------|------------------|
| x-data-grid | Enterprise data grid | Yes |
| x-charts-dashboard | Chart widgets | Yes |
| x-scheduler | Scheduler views | Yes |
| x-kanban | Kanban board | Yes |
| x-editor-tiptap | Tiptap editor | Yes |
| x-form-builder | Schema-driven forms | Yes |
| sentry-tracing | Performance tracing | Yes |
| rum-web-vitals | Real User Monitoring | Yes |

See `apps/mfe-shell/src/lib/feature-flags.ts` for implementation.
