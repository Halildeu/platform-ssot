# ADR-001: OpenFGA for Authorization (Zanzibar Model)

ID: ADR-001-openfga-authorization
Status: Accepted
Date: 2026-03-29
Owner: @halilkocoglu

## Context

ERP sistemi Keycloak (authentication) + custom permission-service (authorization) kullaniyordu.
Sorunlar:
- JWT'ye gomulu permission → token expire'a kadar stale
- Hardcoded admin role → permission mapping (SecurityConfig icinde)
- Veri katmaninda zorlama yok → developer WHERE unutursa data leak
- inline isAdmin() check'ler, tutarsiz permission isimleri

## Decision

**OpenFGA'yi kullan, kendi authorization engine'i yazma.**

- OpenFGA (Apache 2.0, Google Zanzibar implementasyonu) self-hosted deploy
- Mevcut permission-service kademeli olarak kaldirilacak
- Keycloak = authentication only (identity JWT)
- OpenFGA = authorization (ReBAC tuple store)
- Hibernate @Filter + PostgreSQL RLS = data enforcement

## Alternatives Considered

| Secenek | Karar | Neden |
|---------|-------|-------|
| Custom SaaS auth platform | Ertelendi | Solo developer, market dolu (Auth0 FGA, Permit.io, Authzed) |
| Permit.io (SaaS) | Ertelendi | Vendor lock-in; OpenFGA ayni temeli ucretsiz sunar |
| SpiceDB | Ertelendi | OpenFGA daha genis ekosistem, Keycloak connector mevcut |
| Cerbos | Reddedildi | ABAC-focused, ReBAC destegi sinirli |

## Consequences

**Positive:** Zanzibar inheritance, OSS/ucretsiz, Java/JS SDK mevcut, Playground UI
**Negative:** Yeni teknoloji egrisi, migration sureci, OpenFGA performans izlenmeli
**Risks:** OpenFGA SPOF → circuit breaker + cached fallback

## Links

- OpenFGA: https://openfga.dev
- Google Zanzibar Paper: https://research.google/pubs/pub48190/
