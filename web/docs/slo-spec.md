# SLO Dashboard Specification

## SLO Definitions

### 1. Availability: 99.9% Uptime

**Scope**: Shell application and all production MFEs.

| Metric | Target | Measurement |
|--------|--------|-------------|
| Shell uptime | 99.9% | Synthetic monitoring (1-minute intervals) returns HTTP 200 and renders the shell layout |
| MFE availability | 99.9% per remote | Health check endpoint returns `healthy` status |

**Calculation**:
```
Availability = (total_minutes - downtime_minutes) / total_minutes * 100
```

Monthly budget at 99.9%: **43.2 minutes** of downtime allowed.

### 2. Latency: P95 < 3s, P99 < 5s

**Scope**: Full page load from navigation start to largest contentful paint (LCP).

| Metric | Target | Measurement |
|--------|--------|-------------|
| P95 page load | < 3 seconds | Real User Monitoring (RUM) LCP percentile |
| P99 page load | < 5 seconds | Real User Monitoring (RUM) LCP percentile |
| P50 page load | < 1.5 seconds | Informational, not an SLO target |

**Calculation**: Rolling 28-day window of RUM data, segmented by route.

### 3. Error Rate: < 0.1% Frontend Error Rate

**Scope**: Unhandled JavaScript exceptions and failed API calls originating from frontend code.

| Metric | Target | Measurement |
|--------|--------|-------------|
| JS error rate | < 0.1% | `(error_count / total_page_views) * 100` over a 1-hour window |
| API failure rate | < 0.5% | `(5xx_responses / total_requests) * 100` for BFF/API calls |

**Exclusions**: Expected 4xx responses (401 for unauthenticated, 404 for missing resources) are not counted.

### 4. Test Health: > 95% Pass Rate

**Scope**: All CI test suites (unit, integration, e2e, visual regression, a11y).

| Metric | Target | Measurement |
|--------|--------|-------------|
| Overall pass rate | > 95% | `(passed_tests / total_tests) * 100` per CI run |
| Flaky test rate | < 2% | Tests that flip pass/fail without code changes over 7 days |

### 5. Build Health: > 99% CI Success Rate

**Scope**: All CI pipeline runs on the `main` branch.

| Metric | Target | Measurement |
|--------|--------|-------------|
| CI success rate | > 99% | `(successful_runs / total_runs) * 100` over a 7-day window |
| Mean build time | < 10 minutes | P95 of pipeline duration |

## Error Budget Calculation

Each SLO has a corresponding error budget representing the allowed amount of "bad" time or events within a period.

```
Error Budget = 1 - SLO Target

Example (Availability 99.9%, 30-day month):
  Budget = 0.1% of 43,200 minutes = 43.2 minutes of downtime

Example (Error Rate < 0.1%, 1M page views/month):
  Budget = 0.1% of 1,000,000 = 1,000 errors allowed
```

### Budget Tracking

| SLO | Period | Budget | Consumed | Remaining |
|-----|--------|--------|----------|-----------|
| Availability | Monthly | 43.2 min | — | — |
| Latency P95 | 28-day rolling | 5% of requests > 3s | — | — |
| Error Rate | Monthly | 0.1% of page views | — | — |
| Test Health | Per run | 5% test failures | — | — |
| Build Health | Weekly | 1% CI failures | — | — |

## Burn Rate Alerts

Burn rate measures how fast the error budget is being consumed relative to the budget period.

| Alert Level | Burn Rate | Window | Action |
|-------------|-----------|--------|--------|
| **Page (P1)** | 14.4x | 1 hour | Immediate on-call response, likely active incident |
| **Page (P2)** | 6x | 6 hours | On-call investigates within 30 minutes |
| **Ticket** | 3x | 1 day | Create a ticket, address within the sprint |
| **Warning** | 1.5x | 3 days | Monitor closely, discuss in weekly review |

### Burn Rate Calculation
```
Burn Rate = (error_rate_in_window / total_error_budget) * (budget_period / window_duration)

Example:
  If 10 minutes of downtime in 1 hour, and monthly budget is 43.2 minutes:
  Burn Rate = (10 / 43.2) * (30*24 / 1) = 0.23 * 720 = 166x — immediate page
```

### Alert Configuration

```yaml
# Pseudo-config for alerting rules
alerts:
  - name: availability-burn-fast
    slo: availability
    burn_rate: 14.4
    window: 1h
    severity: page-p1
    channel: '#incidents'

  - name: availability-burn-moderate
    slo: availability
    burn_rate: 6
    window: 6h
    severity: page-p2
    channel: '#incidents'

  - name: error-rate-burn-fast
    slo: error-rate
    burn_rate: 14.4
    window: 1h
    severity: page-p1
    channel: '#incidents'

  - name: latency-burn-slow
    slo: latency-p95
    burn_rate: 3
    window: 1d
    severity: ticket
    channel: '#platform-alerts'
```

## Review Cadence

### Weekly SLO Review (Every Monday)

**Attendees**: Platform team lead, on-call engineer, product owner.

**Agenda**:
1. Review each SLO's current status (meeting / at risk / breached).
2. Review error budget consumption for the past 7 days.
3. Review any burn rate alerts that fired.
4. Discuss open postmortems and their action item progress.
5. Decide on any velocity trade-offs if budget is low (slow down feature work, prioritize reliability).

**Outputs**:
- Updated SLO dashboard with weekly snapshot.
- Action items for any SLOs at risk.
- Decision on feature freeze if error budget is exhausted.

### Monthly SLO Report

- Full month summary of all SLO metrics.
- Error budget reset (or carry-over policy if applicable).
- Trend analysis: are we improving or degrading over time?
- Recommendations for SLO target adjustments.
