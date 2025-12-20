# AC-0045 – Invoice Approval v1 Acceptance

ID: AC-0045  
Story: STORY-0045-invoice-approval-v1  
Status: Planned  
Owner: @team/platform

## 1. AMAÇ

- STORY-0045 kapsamında deterministik karar + AI öneri davranışını test edilebilir kriterlerle doğrulamak.

## 2. KAPSAM

- Deterministik karar üretimi.
- AI önerilerinin “öneri” olarak kalması ve izlenebilirlik.

## 3. GIVEN / WHEN / THEN SENARYOLARI

- [ ] Senaryo 1 – Deterministik karar  
      Given: Onay kural seti tanımlıdır  
      When: Aynı giriş verisiyle karar üretimi çalıştırılır  
      Then: Aynı karar üretilir ve kayıt altına alınır

- [ ] Senaryo 2 – AI önerisi kararın yerine geçmez  
      Given: AI öneri üretimi aktiftir  
      When: Öneri üretilir ve kullanıcıya sunulur  
      Then: Öneri kararın yerine geçmez; karar deterministik kural setinden gelir

## 4. NOTLAR / KISITLAR

- Upstream PB/PRD henüz netleşmediyse bu acceptance yalnız “davranış”ı tanımlar.

## 5. ÖZET

- Deterministik karar üretimi ve AI öneri sunumu birbirinden ayrıdır ve izlenebilir kalır.

## 6. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0045-invoice-approval-v1.md
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0045-invoice-approval-v1.md

