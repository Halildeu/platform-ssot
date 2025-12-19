# STORY-0047 – UI Kit Component Test Factory v1 (Docs + Gates)

ID: STORY-0047-ui-kit-component-test-factory-v1  
Epic: QLTY-UIKIT-FACTORY  
Status: Planned  
Owner: @team/frontend  
Upstream: SPEC-0008 (doküman eklenecek)  
Downstream: AC-0047, TP-0047

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- UI Kit komponentleri için “test factory” yaklaşımını v1 seviyesinde standardize etmek.  
- Doküman + kalite gate’leri ile component doğrulamasını deterministik hale getirmek.  
- UI Kit genişleme işleri (örn. STORY-0048) için ortak kalite kapısı sağlamak.  

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir frontend geliştirici olarak, her yeni UI Kit komponenti için aynı test/doküman şablonunu uygulamak istiyorum; böylece kalite drift’i azalır.  
- Bir platform/kalite ekibi olarak, component seviyesinde minimum standartları gate’lere bağlamak istiyorum; böylece CI’da erken sinyal alınır.  

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil (v1):
- Komponent başına minimum “doküman + test artefact” seti:
  - Story/Acceptance/Test Plan zinciri  
  - Demo ve spec test yaklaşımı (kontrat seviyesinde)  
- L1 kalite kapısı (docflow): template/id/konum + story-links + doc-chain.  
- L2/L3 için gate tasarımı (plan): UI kit scope strict kontroller.  

Kapsam dışı (v1):
- Tüm UI Kit komponentlerinin geriye dönük tam refactor’u (kademeli).  
- Playwright senaryolarının tüm komponentlerde zorunlu hale gelmesi (v1.1+).  

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [ ] Story/AC/TP zinciri (STORY-0047) doc QA kontrollerinden geçer.  
- [ ] Gate yaklaşımı (L1 zorunlu, L2/L3 plan) TP-0047 içinde netleşmiştir.  
- [ ] UI Kit genişleme işlerinde bu factory standardı referans alınır (örn. STORY-0048).  

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- SPEC: SPEC-0008 (repo içi dosya eklenecek).  
- Downstream örnek: `docs/03-delivery/STORIES/STORY-0048-ui-kit-p2-expansion-v1.md`  
- Doc QA: `scripts/docflow_next.py`, `scripts/check_doc_templates.py`, `scripts/check_story_links.py`  

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- v1 hedefi: UI Kit component kalite zincirini “doküman + gate” ile standardize etmek.  
- Doğrulama: AC-0047 + TP-0047 ile delivery zinciri kilitlenir.  

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0047-ui-kit-component-test-factory-v1.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0047-ui-kit-component-test-factory-v1.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0047-ui-kit-component-test-factory-v1.md  
- Project Flow: docs/03-delivery/PROJECT-FLOW.md  

