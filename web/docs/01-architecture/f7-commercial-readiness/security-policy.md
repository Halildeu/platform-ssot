# Security Policy

> Status: **Final** | Last updated: 2026-03-21

---

## Vulnerability Disclosure Process

### Reporting

If you discover a security vulnerability, please report it responsibly:

1. **DO NOT** open a public GitHub issue
2. Email **security@[domain]** with:
   - Description of the vulnerability
   - Steps to reproduce
   - Affected versions
   - Impact assessment (if known)
3. You will receive an acknowledgment within **48 hours**

### SECURITY.md Template

Every published package must include a `SECURITY.md` at the repository root:

```markdown
# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| x.y.z   | :white_check_mark: |
| < x.y.z | :x:                |

## Reporting a Vulnerability

Please report vulnerabilities to security@[domain].
Do NOT open a public issue.
We will acknowledge receipt within 48 hours and provide
a fix timeline within 5 business days.
```

---

## Response SLA by Severity

| Severity | CVSS Range | Response Target | Fix Target |
|----------|-----------|----------------|-----------|
| **Critical** | 9.0 - 10.0 | 4 hours | 24-hour patch release |
| **High** | 7.0 - 8.9 | 24 hours | 72-hour patch release |
| **Medium** | 4.0 - 6.9 | 3 business days | Next sprint (2 weeks) |
| **Low** | 0.1 - 3.9 | 5 business days | Next scheduled release |

- Critical/High fixes are backported to the current LTS branch
- Affected users are notified via GitHub Security Advisory

---

## Dependency Audit

### Automated (Weekly)

- **Dependabot** or **Renovate** configured on all repositories
- Automated PRs for dependency updates with security advisories
- CI pipeline runs `npm audit --audit-level=moderate` on every PR
- Failing audit blocks merge

### Manual (Quarterly)

- Quarterly manual security review of:
  - Direct dependencies and their transitive trees
  - Build toolchain and CI/CD pipeline
  - Authentication and authorization flows
  - CSP compliance and XSS vectors in editor/form components
- Results documented and tracked in internal security log

---

## Release Gate: No Known CVEs

All releases **must** pass the following before publish:

```bash
npm audit --audit-level=moderate
```

- **No moderate or higher** vulnerabilities allowed in production dependencies
- Low-severity issues are documented and tracked but do not block release
- If a dependency has an unpatched CVE, the release notes must document:
  - The CVE identifier
  - Affected component
  - Mitigation or workaround
  - Timeline for resolution

---

## Supply Chain Security

### Current

- **Lockfile integrity**: `package-lock.json` committed and verified in CI
- **Provenance**: npm `--provenance` flag enabled for published packages
- **Registry**: packages published exclusively to the configured npm registry
- **CI-only publishing**: no manual `npm publish` from developer machines

### Future (Planned)

- **Signed releases**: GPG-signed git tags for all production releases
- **SBOM generation**: Software Bill of Materials on request (CycloneDX format)
- **Reproducible builds**: deterministic build output verification

---

## Security Practices

- All components output CSP-compatible markup
- XSS prevention enforced in rich-text editor and form-builder components
- No `eval()`, `innerHTML` with user content, or `dangerouslySetInnerHTML` without sanitization
- Subresource Integrity (SRI) hashes provided for CDN-distributed bundles (future)
