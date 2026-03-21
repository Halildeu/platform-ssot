# Release Health Checklist

Complete all items before promoting a release to production.

## Pre-Release Verification

- [ ] `pnpm verify:release` exits with code 0
- [ ] No P0/P1 open issues in the milestone
- [ ] CHANGELOG.md updated with all changes in this release
- [ ] Compatibility matrix CI is green (Node 20/22, React 18.2/18.3)
- [ ] Bundle size within budget (no regressions beyond threshold)
- [ ] Visual regression tests approved (Chromatic or equivalent)
- [ ] Accessibility audit passed (axe-core, no new violations)
- [ ] Security scan clean (no new high/critical vulnerabilities)
- [ ] Feature flags configured correctly for new features
- [ ] Rollback plan documented and tested
- [ ] Stakeholders notified of upcoming release

## Release Execution

- [ ] Git tag created following semver convention
- [ ] Package published to registry successfully
- [ ] CDN cache invalidated for updated assets
- [ ] Deployment verified in staging environment
- [ ] Smoke tests pass in staging

## Post-Release Verification

- [ ] Production deployment successful
- [ ] Synthetic monitoring confirms availability
- [ ] Error rate within SLO threshold for 15 minutes post-deploy
- [ ] Performance metrics (LCP, FID, CLS) within expected range
- [ ] No new error spikes in observability dashboard
- [ ] Release notes published (GitHub release, internal comms)

## Rollback Criteria

Initiate rollback if any of the following occur within 30 minutes of deploy:
- Error rate exceeds 1% (10x normal)
- Availability drops below 99%
- P95 latency exceeds 5s
- Critical user flow is broken (login, navigation, data entry)

## Sign-off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Engineering Lead | | | [ ] |
| QA Lead | | | [ ] |
| Product Owner | | | [ ] |
