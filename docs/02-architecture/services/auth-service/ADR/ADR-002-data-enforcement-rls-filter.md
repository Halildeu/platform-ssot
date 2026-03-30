# ADR-002: Dual Data Enforcement (Hibernate @Filter + PostgreSQL RLS)

ID: ADR-002-data-enforcement-rls-filter

**Status:** Accepted
**Date:** 2026-03-29
**Decision Makers:** Halil Kocoglu

## Context

ERP'de company/project/warehouse bazli veri izolasyonu gerekli.
Developer WHERE clause'u unutursa sirketler arasi veri sizintisi olusabilir.

## Decision

**Cift katmanli veri zorlamasi: Hibernate @Filter + PostgreSQL RLS.**

- Katman 1: Hibernate @Filter — JPQL/Criteria query'lere otomatik WHERE
- Katman 2: PostgreSQL RLS — native query ve direct JDBC bile filtrelenir
- ScopeContext: OpenFGA veya YAML'dan populate, her request'te ThreadLocal
- Dev mode: filtreler YAML scope ile aktif (OpenFGA gerekmez)

## Consequences

**Positive:** Developer hatasi bypass-proof, dev'de bile aktif
**Negative:** entityManager.find(id) Hibernate filter'i bypass eder (RLS yakalar), RLS performans izlenmeli
