# STORY-0025 – FE Version Pinning & MF Audit

ID: STORY-0025-fe-version-pinning-and-mf-audit  
Epic: QLTY-FE-VERSIONS  
Status: Planned  
Owner: @team/frontend  
Upstream: QLTY-FE-VERSIONS-01 (legacy)  
Downstream: AC-0025, TP-0025

## 1. AMAÇ

Frontend için shared kütüphane ve MF versiyon pinning & audit sürecini
standardize ederek, versiyon drift ve uyumsuzluk risklerini azaltmak.

## 2. TANIM

- Bir frontend geliştiricisi olarak, versiyon pinning ve MF audit kurallarının net olmasını istiyorum; böylece micro frontend’ler arasında uyumsuz versiyonlar yüzünden gizli bug’lar oluşmasın.

## 3. KAPSAM VE SINIRLAR

Dahil:
- Versiyon pinning stratejisi (örn. semver + lock dosyaları).  
- MF shared modüller ve router/http/ui kit gibi paylaşılan paketler için
  audit kuralları.  

Hariç:
- Tüm bağımlılık yönetim sisteminin değiştirilmesi; yalnız kurallar ve
  dokümantasyon kapsamdadır.

## 4. ACCEPTANCE KRİTERLERİ

- [ ] Versiyon pinning ve MF audit için checklist ve doküman günceldir.  

## 5. BAĞIMLILIKLAR

- Shell Auth ve shared HTTP çalışmaları.  

## 6. ÖZET

- FE version pinning & MF audit konusu bu STORY ile yeni sisteme taşınmış
  olacaktır.

## 7. LİNKLER (İSTEĞE BAĞLI)

- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0025-fe-version-pinning-and-mf-audit.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0025-fe-version-pinning-and-mf-audit.md`  
