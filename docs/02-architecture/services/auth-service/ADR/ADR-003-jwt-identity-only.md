# ADR-003: JWT Contains Identity Only (No Permission Claims)

ID: ADR-003-jwt-identity-only

**Status:** Accepted
**Date:** 2026-03-29
**Decision Makers:** Halil Kocoglu

## Context

Mevcut JWT'de Keycloak realm role'leri ve permission claim'leri gomulu.
Permission degisiklikleri token expire'a kadar (5 dk) yansimaz.
SecurityConfig'de hardcoded admin role → 7+ permission mapping.

## Decision

**JWT sadece identity bilgisi tasir. Tum permission check'ler OpenFGA'dan runtime'da yapilir.**

JWT'de kalacak: sub, email, preferred_username, realm_access.roles
JWT'den kaldirilan: permissions claim, resource_access client role'leri

## Consequences

**Positive:** Permission degisiklikleri aninda etkili, token boyutu kucuk, net govrev ayriligi
**Negative:** Her request'te OpenFGA cagrisi (cache ile mitigate), permission-service SPOF riski
