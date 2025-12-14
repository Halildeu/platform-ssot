# STORY-0024 – AuthZ Project Scope Filter

ID: STORY-0024-authz-project-scope-filter  
Epic: QLTY-AUTHZ-SCOPE  
Status: Planned  
Owner: @team/backend  
Upstream: QLTY-BE-AUTHZ-SCOPE-03-PROJECT (legacy)  
Downstream: AC-0024, TP-0024

## 1. AMAÇ

Proje/şantiye bazlı PROJECT scope filtresini standardize ederek kullanıcıların
yalnız yetkili oldukları projelerin verilerini görmesini güvence altına
almak.

## 2. TANIM

- Bir uygulama kullanıcısı olarak, sadece yetkili olduğum projeleri görebilmek istiyorum; böylece veri gizliliği ve yetki sınırları korunmuş olsun.

## 3. KAPSAM VE SINIRLAR

Dahil:
- PROJECT scope filtresi için domain modeli ve temel API davranışı.  
- Permission registry v1.0 ile entegrasyon (project scope).  

Hariç:
- Tüm proje/şantiye veri modelinin yeniden tasarlanması.

## 4. ACCEPTANCE KRİTERLERİ

- [ ] PROJECT scope filtresi için domain modeli ve temel API’lar
  dokümante edilmiştir.  

## 5. BAĞIMLILIKLAR

- Permission Registry v1.0 (STORY-0019).  

## 6. ÖZET

- PROJECT scope filtresi, yeni sistemde bu STORY ile yönetilecek ve
  test planlarıyla doğrulanacaktır.

## 7. LİNKLER (İSTEĞE BAĞLI)

- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0024-authz-project-scope-filter.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0024-authz-project-scope-filter.md`  
