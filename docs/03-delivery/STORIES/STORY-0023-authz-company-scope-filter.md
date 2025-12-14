# STORY-0023 – AuthZ Company Scope Filter

ID: STORY-0023-authz-company-scope-filter  
Epic: QLTY-AUTHZ-SCOPE  
Status: Planned  
Owner: @team/backend  
Upstream: QLTY-BE-AUTHZ-SCOPE-03 (legacy)  
Downstream: AC-0023, TP-0023

## 1. AMAÇ

User-service için company scope filtresini standardize ederek yetkilendirme
kararlarının merkezi permission registry ile tutarlı olmasını sağlamak.

## 2. TANIM

- Bir backend geliştiricisi olarak, company scope bazlı filtrenin tek bir yerde tanımlanmasını istiyorum; böylece farklı servislerde çelişkili kurallar oluşmasın.

## 3. KAPSAM VE SINIRLAR

Dahil:
- Company scope filtresi için domain modeli ve temel API davranışı.  
- Permission registry v1.0 ile entegrasyon (scope bilgisi).  

Hariç:
- Tüm authorization katmanının yeniden yazılması; yalnız company scope
  filtresinin v1 standardizasyonu kapsamdadır.

## 4. ACCEPTANCE KRİTERLERİ

- [ ] Company scope filtresi için domain modeli ve temel API’lar
  dokümante edilmiştir.  

## 5. BAĞIMLILIKLAR

- Permission Registry v1.0 (STORY-0019).  

## 6. ÖZET

- Company scope filtresi bu STORY ile yeni sistemde izlenebilir ve
  dokümante hale getirilecektir.

## 7. LİNKLER (İSTEĞE BAĞLI)

- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0023-authz-company-scope-filter.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0023-authz-company-scope-filter.md`  
