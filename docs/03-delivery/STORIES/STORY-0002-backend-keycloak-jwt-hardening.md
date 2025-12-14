# STORY-0002 – Backend Keycloak JWT Sertleştirmesi

ID: STORY-0002-backend-keycloak-jwt-hardening  
Epic: QLTY-Security-Hardening  
Status: Done  
Owner: @team/backend  
Upstream: PRD-0001-security-hardening (varsayım)  
Downstream: AC-0002, RB-keycloak (ilgili güvenlik ADR’leri legacy altında), TP-0002

## 1. AMAÇ

Tüm Spring Boot backend servislerinin prod/test profillerinde yalnızca Keycloak
tarafından imzalanan RS256 access token’larını doğrulaması, legacy service-token
ve internal JWT filtrelerinin prod/test’ten kaldırılması ve güvenlik zincirinin
DOCS-PROJECT-LAYOUT + runbook’larla uyumlu tek kaynak olarak belgelenmesi.

## 2. TANIM

- Güvenlik odaklı backend ekibi olarak, all backend servislerinin yalnız Keycloak RS256 JWT doğrulamasını istiyoruz; böylece access kontrol zinciri sade, izlenebilir ve güvenli olsun.
- Operatör olarak, dev/local profillerinde esnek token kullanımının korunmasını istiyoruz; böylece geliştirme deneyimi bozulmadan prod/test sıkı kalabilsin.

## 3. KAPSAM VE SINIRLAR

Dahil:
- `api-gateway`, `auth-service`, `user-service`, `permission-service`, `variant-service`
  security config’lerinin prod/test profillerinde `oauth2ResourceServer(jwt)` + ortak
  Keycloak issuer/jwks değerleriyle tekilleştirilmesi.
- ServiceToken / InternalApiKey / legacy admin fallback filtrelerinin yalnızca
  `local|dev` profillerinde çalışması.
- Vault ve Keycloak yapılandırma adımlarının:
  - docs/02-architecture/SYSTEM-OVERVIEW.md  
  - docs/02-architecture/services/auth-service/**  
  - docs/04-operations/RUNBOOKS/RB-keycloak.md  
  ile uyumlu hale getirilmesi.
- Güvenlik smoke testleri (mvn profili + curl zinciri) ve PROJECT-FLOW güncellemeleri.

Hariç:
- Keycloak realm içi kullanıcı/grup yönetimi veya MFA.
- FE shell veya shared-http değişiklikleri.

## 4. ACCEPTANCE KRİTERLERİ

- [x] Prod/test profillerinde tüm servisler yalnız Keycloak RS256 JWT doğrular, legacy token kabul etmez.
- [x] Dev/local profillerinde permitAll ve legacy token filtreleri yalnız bu profillerde çalışır.
- [x] Güvenlik smoke testleri ve runbook’lar günceldir, PROJECT-FLOW kayıtları tamamlanmıştır.

## 5. BAĞIMLILIKLAR

- PRD-0001-security-hardening (varsayım)
- İlgili TECH-DESIGN ve ADR dokümanları (`auth-service` ve security mimarisi)
- RB-keycloak ve Vault runbook’ları
- AC-0002 ve TP-0002 kabul/test planları

## 6. ÖZET

- Prod/test ortamlarında tüm backend servisleri için JWT doğrulama zinciri Keycloak RS256’e sabitlenmiştir.
- Dev/local profillerinde gerekli esneklik korunurken, güvenlik kuralları dokümante edilmiş ve testlerle doğrulanmıştır.

## 7. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0002-backend-keycloak-jwt-hardening.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0002-backend-keycloak-jwt-hardening.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0002-backend-keycloak-jwt-hardening.md`  
- Runbook: docs/04-operations/RUNBOOKS/RB-keycloak.md  
