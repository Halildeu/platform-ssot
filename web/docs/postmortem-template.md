# Postmortem Template

## Incident Summary

| Field | Value |
|-------|-------|
| **Incident ID** | INC-YYYY-NNN |
| **Date** | YYYY-MM-DD |
| **Severity** | P0 / P1 / P2 / P3 |
| **Duration** | HH:MM (from detection to resolution) |
| **Author** | Name |
| **Reviewers** | Names |
| **Status** | Draft / Reviewed / Closed |

### One-line Summary
<!-- A single sentence describing what happened and the user impact. -->

## Timeline

All times in local timezone (Europe/Istanbul).

| Time | Event | Actor |
|------|-------|-------|
| HH:MM | **Detect** — How the incident was first noticed (alert, user report, monitoring) | |
| HH:MM | **Triage** — Severity assigned, on-call engaged | |
| HH:MM | **Mitigate** — Immediate action taken to reduce impact (kill switch, rollback, scaling) | |
| HH:MM | **Resolve** — Root cause fixed and deployed, full service restored | |
| HH:MM | **Verify** — Monitoring confirms metrics are back to normal | |

## Root Cause Analysis (5 Whys)

1. **Why** did the incident occur?
   -
2. **Why** did that happen?
   -
3. **Why** did that happen?
   -
4. **Why** did that happen?
   -
5. **Why** did that happen?
   -

### Contributing Factors
<!-- List any additional factors that made the incident worse or delayed detection/resolution. -->
-
-

## Impact Assessment

| Dimension | Details |
|-----------|---------|
| **Users affected** | Number / percentage |
| **Features affected** | List of impacted MFEs or pages |
| **Data impact** | Any data loss or corruption (none / details) |
| **Revenue impact** | Estimated or none |
| **SLO impact** | Error budget consumed (e.g., "used 40% of monthly error budget") |

## Action Items

| # | Action | Owner | Priority | Deadline | Status |
|---|--------|-------|----------|----------|--------|
| 1 | | | P0/P1/P2 | YYYY-MM-DD | Open / In Progress / Done |
| 2 | | | | | |
| 3 | | | | | |

## Lessons Learned

### What went well
-
-

### What went poorly
-
-

### Where we got lucky
-
-

## Prevention Measures

### Detection Improvements
<!-- What monitoring, alerting, or observability changes would catch this earlier? -->
-

### Process Improvements
<!-- What process changes would prevent recurrence or reduce impact? -->
-

### Technical Improvements
<!-- What code, infrastructure, or architecture changes would prevent recurrence? -->
-

---

## Postmortem Review Checklist

- [ ] Timeline is accurate and complete
- [ ] Root cause is identified (not just symptoms)
- [ ] All action items have owners and deadlines
- [ ] Action items address root cause, not just symptoms
- [ ] SLO impact is documented
- [ ] Postmortem reviewed by at least two people
- [ ] Action items tracked in issue tracker
