# TEST-PLAN – Budget Report Grid V2

ID: TP-0201  
Story: STORY-0201-budget-report-grid-v2
Status: Planned  
Owner: Sezar

Not: Aşağıdaki başlıklar ve sıralama **zorunludur**. Yeni bir Test Plan
yazılırken bu H2 başlıkları ve numaraları bire bir korunmalı; agent sadece
bu başlıkların altını doldurabilir.

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Grid V2’nin fonksiyonel ve performans testlerini tanımlamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- UI akışları: listeleme/filtre/sıralama/export.  
- API entegrasyonu ve veri hacmi senaryoları.  
- Performans bütçesi ölçümleri.

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- E2E test: temel grid akışları.  
- Perf test: p95 load/render hedefleri (fixture veri ile).  
- Negatif test: büyük export ve limit davranışları.

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] Listeleme doğru ve hızlı.  
- [ ] Filtre/sıralama doğru, performans bütçesine uyuyor.  
- [ ] Export doğru formatta ve limitler uygulanıyor.

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Staging/dev ortamı (temsilî veri).  
- E2E aracı (Playwright/Cypress) ve perf ölçüm aracı.

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Gerçek veri hacmi ile ölçüm yapılmazsa prod regresyon riski.  
- Export limitleri net olmazsa kullanıcı deneyimi bozulabilir.

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- Grid V2, fonksiyon + perf test setiyle doğrulanır.

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0201-budget-report-grid-v2.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0201-budget-report-grid-v2.md  

