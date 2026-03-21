# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | ✓         |
| < 1.0   | ✗         |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** open a public GitHub issue
2. Email security concerns to: security@company.com
3. Include a description of the vulnerability and steps to reproduce
4. We will acknowledge receipt within 48 hours
5. We will provide a fix timeline within 5 business days

## Security Measures

This project implements:
- **SCA scanning** via Trivy on every PR
- **DAST scanning** via OWASP ZAP
- **SBOM generation** with CycloneDX + Cosign signing
- **SRI verification** for all external resources
- **CSP policy** enforcement
- **Dependency audit** as part of CI pipeline

## Disclosure Policy

We follow coordinated disclosure. Security fixes are released as patch versions with CVE identifiers when applicable.
