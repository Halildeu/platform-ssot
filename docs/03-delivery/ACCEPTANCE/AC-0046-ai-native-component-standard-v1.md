# AC-0046 – AI-Native Component Standard v1 Acceptance

ID: AC-0046  
Story: STORY-0046-ai-native-component-standard-v1  
Status: Planned  
Owner: @team/platform

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- AI-native komponent sözleşmesinin (Intent + UI Contract) v1 kabul kriterlerini tanımlamak.  
- UI davranışlarının (loading/error/fallback) tek tip ve test edilebilir olmasını sağlamak.  

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Intent modeli (girdi) ve UI Contract (çıktı) kuralları  
- UI durumları: loading/partial/complete/error/fallback  
- Dokümantasyon ve örnek akışlar (kontrat seviyesinde)  

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

### Docs / Contract

- [ ] Senaryo 1 – Kontrat SSOT:
  - Given: Komponent sözleşmesi v1 tanımı yayınlanmıştır.  
  - When: Bir ekip yeni bir AI-native komponent tasarlamak ister.  
  - Then: Intent + UI Contract kuralları tek bir SSOT üzerinden referans alınabilir.  

- [ ] Senaryo 2 – Error + fallback davranışı:
  - Given: Komponent AI yanıtı alamaz (timeout/error).  
  - When: UI render edilir.  
  - Then: Error state deterministik görünür ve fallback davranışı uygulanır (kullanıcı kilitlenmez).  

- [ ] Senaryo 3 – Partial/streaming güncellemeler (varsa):
  - Given: Komponent partial yanıtlar üretebilir.  
  - When: UI partial update alır.  
  - Then: UI contract ihlali olmadan “partial → complete” geçişi deterministik ilerler.  

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- v1 kapsamında “tool orchestration” ve çoklu model stratejisi yoktur.  
- Kontrat doğrulama yaklaşımı (schema/typing) TP-0046 içinde netleşmelidir.  

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- Intent + UI Contract v1 tek tip olmalıdır.  
- Error/fallback davranışı zorunludur.  
- Partial/streaming varsa deterministik olmalıdır.  

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0046-ai-native-component-standard-v1.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0046-ai-native-component-standard-v1.md  

