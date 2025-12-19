# STORY-0045 – Invoice Approval v1 (AI Suggestions + Deterministic Decision)

ID: STORY-0045-invoice-approval-v1  
Epic: EPIC-APPROVAL-SYSTEM  
Status: Planned  
Owner: @team/platform  
Upstream: SPEC-0001, SPEC-0002, SPEC-0003, SPEC-0004; ADR-0003, ADR-0004, ADR-0005, ADR-0006 (dokümanlar eklenecek)  
Downstream: AC-0045, TP-0045

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Fatura onay sürecini v1 seviyesinde ürünleştirmek: AI önerisi + deterministik karar.  
- Denetlenebilir karar üretmek: “neden bu karar?” sorusu kural/öneri bazında izlenebilir olmalı.  
- Güvenli fallback: AI yoksa/kapanırsa deterministik akış tek başına çalışmalı.  

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir onaylayıcı kullanıcı olarak, fatura için AI önerisini ve deterministik karar sonucunu birlikte görmek istiyorum; böylece hızlı ama kontrollü karar verebilirim.  
- Bir platform ekibi olarak, öneri (AI) ve karar (deterministik) katmanları arasında net bir sözleşme istiyorum; böylece kararlar tekrarlanabilir ve test edilebilir olur.  

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil (v1):
- AI öneri üretimi (skor + gerekçe) ve karar ekranında gösterimi.  
- Deterministik karar motoru (kural seti) ve AI önerisi ile birlikte değerlendirme.  
- Minimum audit/event seti (karar kaynağı + gerekçe izi).  

Kapsam dışı (v1):
- Tam otomatik onay (human-in-the-loop zorunlu).  
- Çok adımlı/çok rolü orkestrasyon (v2).  

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [ ] AI önerisi aktifken kullanıcı öneri + gerekçeyi görebilir.  
- [ ] AI önerisi kapalı/erişilemezken deterministik karar akışı çalışır.  
- [ ] Verilen kararın kaynağı (kural/öneri) audit’e düşer.  

Detaylı Given/When/Then senaryoları: AC-0045.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- ADR: ADR-0003, ADR-0004, ADR-0005, ADR-0006 (repo içi dosyalar eklenecek).  
- SPEC: SPEC-0001, SPEC-0002, SPEC-0003, SPEC-0004 (repo içi dosyalar eklenecek).  

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- v1 hedefi: AI önerisi + deterministik kararın birlikte ve izlenebilir çalışması.  
- Doğrulama: AC-0045 + TP-0045 ile delivery zinciri kilitlenir.  

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0045-invoice-approval-v1.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0045-invoice-approval-v1.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0045-invoice-approval-v1.md  
- Project Flow: docs/03-delivery/PROJECT-FLOW.md  

