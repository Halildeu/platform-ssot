# Support Policy

> Status: **Final** | Last updated: 2026-03-21

---

## Support Tiers

| Tier | Channel | Response SLA | Cost |
|------|---------|-------------|------|
| **Community** | GitHub Issues | 5 business days | Free |
| **Professional** | Email + GitHub Issues | 24 hours (business) | Paid SLA |
| **Enterprise** | Dedicated Slack/Teams channel | 24 hours (calendar), 4h critical | Paid + dedicated |

### Community (Free)

- **Channel**: GitHub Issues on the public repository
- **Response time**: Best-effort, within 5 business days
- **Scope**: Bug reports, documentation clarifications, community discussion
- **Availability**: Business hours, no weekend/holiday coverage

### Professional (SLA)

- **Channel**: Email support queue + priority GitHub Issues label
- **Response time**: 24 business hours for all severities
- **Scope**: Bug reports, feature requests, migration assistance, upgrade guidance
- **Includes**: Priority triage, quarterly release briefings
- **Availability**: Business hours (Mon-Fri, 09:00-18:00 CET)

### Enterprise (Dedicated)

- **Channel**: Dedicated Slack or Teams channel with named support engineer
- **Response time**: 24 calendar hours standard, 4 hours for critical (P0)
- **Scope**: Full support scope including architecture review and migration planning
- **Includes**: Custom patch builds for critical issues, dedicated escalation path
- **Availability**: Extended hours with on-call for critical issues

---

## Support Scope

### In Scope

| Category | Community | Professional | Enterprise |
|----------|-----------|-------------|-----------|
| Bug reports | Yes | Yes | Yes |
| Feature requests | Yes | Yes (prioritized) | Yes (roadmap input) |
| Migration assistance | Docs only | Guided | Hands-on |
| Upgrade guidance | Docs only | Guided | Hands-on |
| Configuration help | Community forum | Email | Dedicated channel |
| Security advisories | Public disclosure | Early notification | Early notification + patch |

### Out of Scope (All Tiers)

- **Custom development**: Building bespoke features or components
- **Third-party integration debugging**: Issues in AG Grid, Keycloak, or other vendor libraries should be reported to those vendors directly
- **Infrastructure/deployment support**: Hosting, CI/CD pipeline, cloud configuration
- **Legacy version support**: Versions outside the current LTS window (see [release-channels.md](./release-channels.md))

---

## Issue Severity Classification

| Severity | Definition | Target Response |
|----------|-----------|----------------|
| **P0 - Critical** | Production down, no workaround, data loss risk | 4h (Enterprise), 24h (Professional) |
| **P1 - High** | Major feature broken, workaround exists | 1 business day |
| **P2 - Medium** | Minor feature issue, cosmetic, non-blocking | 3 business days |
| **P3 - Low** | Enhancement, nice-to-have, documentation | 5 business days |

---

## Reporting a Bug

1. Search existing issues to avoid duplicates
2. Use the appropriate issue template on GitHub
3. Include: version number, browser/OS, reproduction steps, expected vs actual behavior
4. Attach screenshots or a minimal reproduction where possible

---

## Escalation Path

1. GitHub Issue created and triaged by maintainers
2. Professional/Enterprise: escalate via email or dedicated channel
3. Enterprise: named account engineer available for direct escalation
4. Critical issues: on-call rotation for Enterprise tier
