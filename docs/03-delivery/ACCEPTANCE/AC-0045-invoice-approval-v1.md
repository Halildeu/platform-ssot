# AC-0045 – Invoice Approval v1 Acceptance

ID: AC-0045  
Story: STORY-0045-invoice-approval-v1  
Status: Planned  
Owner: @team/platform

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Invoice Approval v1 için test edilebilir kabul kriterlerini tanımlamak.  
- AI önerisi ve deterministik karar katmanının birlikte çalışmasını doğrulamak.  

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- AI önerisi görünürlüğü ve gerekçe sunumu  
- Deterministik karar akışı + fallback  
- Minimum audit/event izi (karar kaynağı)  

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

### Ortak

- [ ] Senaryo 1 – Öneri + karar birlikte görünür:
  - Given: AI önerisi aktiftir ve ilgili invoice için öneri üretilmiştir.  
  - When: Kullanıcı invoice onay ekranını açar.  
  - Then: AI önerisi (skor + gerekçe) ve deterministik karar durumu birlikte görünür.  

- [ ] Senaryo 2 – AI kapalıyken fallback:
  - Given: AI önerisi kapalıdır veya servis yanıt veremez.  
  - When: Kullanıcı invoice için karar akışını çalıştırır.  
  - Then: Deterministik karar motoru tek başına sonucu üretir; UI’da “AI yok” durumu net görünür.  

- [ ] Senaryo 3 – Audit izi:
  - Given: Kullanıcı bir invoice için onay/ret kararı verir.  
  - When: Karar kaydedilir.  
  - Then: Kararın kaynağı (kural/öneri) ve minimum gerekçe izi audit/event olarak kaydedilir.  

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- v1’de tam otomatik onay kapsam dışıdır (human-in-the-loop).  
- Model/metrik detayları Acceptance yerine SPEC/ADR dokümanlarında kilitlenmelidir.  

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- AI önerisi mevcutken görünürlük + gerekçe zorunludur.  
- AI yokken deterministik fallback çalışmalıdır.  
- Audit izi zorunludur.  

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0045-invoice-approval-v1.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0045-invoice-approval-v1.md  

