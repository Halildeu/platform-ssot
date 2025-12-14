# STORY-0018 – ERP User Provisioning

ID: STORY-0018-erp-user-provisioning  
Epic: QLTY-ERP-PROVISIONING  
Status: Planned  
Owner: @team/backend  
Upstream: FR-012 (legacy)  
Downstream: AC-0018, TP-0018

## 1. AMAÇ

ERP’den gelen kullanıcıların otomatik olarak Keycloak + user-service’e
provisioning ve düzenli senkronizasyonunu sağlamak.

## 2. TANIM

- Bir ops/identity yöneticisi olarak, ERP kullanıcılarının otomatik olarak Keycloak + user-service’e aktarılmasını istiyorum; böylece manuel kullanıcı açma süreci ortadan kalksın.

## 3. KAPSAM VE SINIRLAR

Dahil:
- ERP → Keycloak entegrasyonu ve sync script’leri.

Hariç:
- ERP sistemi içindeki tüm kullanıcı yaşam döngüsü kuralları.

## 4. ACCEPTANCE KRİTERLERİ

- [ ] ERP’den gelen kullanıcılar belirli aralıklarla Keycloak + user-service
  tarafına başarıyla aktarılır.  

## 5. BAĞIMLILIKLAR

- Legacy FR: backend/docs/legacy/root/05-governance/FEATURE_REQUESTS.md (FR-012)  

## 6. ÖZET

- ERP user provisioning talebi yeni sistemde bu STORY/AC/TP zinciriyle
  izlenecektir.

## 7. LİNKLER (İSTEĞE BAĞLI)

- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0018-erp-user-provisioning.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0018-erp-user-provisioning.md`  
