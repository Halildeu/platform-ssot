# STORY-0046 – AI-Native Component Standard v1 (Intent + UI Contract)

ID: STORY-0046-ai-native-component-standard-v1  
Epic: EPIC-UI-PLATFORM-AI  
Status: Planned  
Owner: @team/platform  
Upstream: (PB/PRD TBD)  
Downstream: AC-0046, TP-0046

## 1. AMAÇ

- “AI-native UI component” yaklaşımı için ortak bir intent + UI contract standardı belirlemek.

## 2. TANIM

- Platform ekibi olarak, AI destekli UI bileşenlerinin kontratını standardize etmek istiyoruz; böylece yeniden kullanım ve kalite kapıları güçlenir.

## 3. KAPSAM VE SINIRLAR

Dahil:
- Intent tanımı (input/output) ve UI contract formatı.
- Minimum örnek(ler) ve doğrulama kuralları.

Hariç:
- Tüm UI kit bileşenlerinin refactor edilmesi (ayrı işler).

## 4. ACCEPTANCE KRİTERLERİ

- [ ] Given: Standart yayınlanmıştır, When: yeni AI-native component geliştirilir, Then: kontrat bu standarda uyar.  
- [ ] Given: Kontrat bozuksa, When: doğrulama çalışır, Then: kalite kapısı FAIL üretir.

## 5. BAĞIMLILIKLAR

- ADR: ADR-0007
- SPEC: SPEC-0005, SPEC-0006, SPEC-0007
- Downstream: AC-0046, TP-0046

## 6. ÖZET

- AI-native component’ler için intent + UI contract standardı tanımlanır ve doğrulanabilir hale getirilir.

## 7. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0046-ai-native-component-standard-v1.md
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0046-ai-native-component-standard-v1.md
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0046-ai-native-component-standard-v1.md

