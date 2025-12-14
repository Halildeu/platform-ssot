# STORY-0019 – Permission Registry v1.0

ID: STORY-0019-permission-registry-v1  
Epic: QLTY-AUTHZ-SCOPE  
Status: Planned  
Owner: @team/backend  
Upstream: QLTY-BE-AUTHZ-SCOPE-01 (legacy)  
Downstream: AC-0019, TP-0019

## 1. AMAÇ

Permission-service tabanlı merkezi yetki modeli (mini Zanzibar) ile scope’lu
izin kataloğu ve AuthorizationContext katmanını v1.0 seviyesinde hayata
geçirmek.

## 2. TANIM

- Bir backend geliştiricisi olarak, merkezi bir permission registry istiyorum; böylece yetki kontrolleri tüm servislerde tutarlı ve yönetilebilir olsun.

## 3. KAPSAM VE SINIRLAR

Dahil:
- Permission ve scope tablolarının permission-service’de tutulması.
- Keycloak claim’leri ile eşleme ve servislerde AuthorizationContext/cache
  yapısının standardizasyonu.

Hariç:
- Tam Zanzibar implementasyonu; yalnız v1 permission registry kapsamdadır.

## 4. ACCEPTANCE KRİTERLERİ

- [ ] Permission-service için v1 registry modeli ve ana API’lar tanımlanmıştır.  

## 5. BAĞIMLILIKLAR

- Legacy Story: backend/docs/legacy/root/05-governance/02-stories/QLTY-BE-AUTHZ-SCOPE-01.md  
- Legacy Spec: backend/docs/legacy/root/05-governance/06-specs/SPEC-QLTY-BE-AUTHZ-SCOPE-01-AUTHZ-SCOPED-PERMISSIONS.md  
- Legacy Acceptance: backend/docs/legacy/root/05-governance/07-acceptance/QLTY-BE-AUTHZ-SCOPE-01.acceptance.md  

## 6. ÖZET

- Permission registry talebi yeni sistemde bu STORY/AC/TP zinciriyle
  izlenecektir.

## 7. LİNKLER (İSTEĞE BAĞLI)

- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0019-permission-registry-v1.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0019-permission-registry-v1.md`  
