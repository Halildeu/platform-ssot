# AC-0314 – NC CAPA Workflow Acceptance (MVP)

ID: AC-0314  
Story: STORY-0314-nc-capa-workflow  
Status: Draft  
Owner: TBD

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- `STORY-0314` kapsamındaki CAPA workflow beklentileri için test edilebilir kabul kriterlerini tanımlamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- CAPA aksiyon yaşam döngüsü (owner + due date + verify + close).
- SLA breach/eskalasyon (policy) beklentisi.
- Platform capability reuse (SPEC-0014) guardrail’i.

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

### Senaryo 1 – CAPA workflow kontratı (MVP)

- [ ] Given: `PRD-0005` ve `SPEC-0015` vardır.  
  When: CAPA workflow maddeleri incelenir.  
  Then: aksiyon yaşam döngüsü ve SLA/bildirim tetikleri net olmalıdır.

### Senaryo 2 – Doc QA PASS

- [ ] Given: `STORY-0314` zinciri eklidir.  
  When: Doc QA script seti çalıştırılır.  
  Then: PASS olmalıdır.

### Senaryo 3 – Platform capability reuse (anti-pattern guardrail)

- [ ] Given: `SPEC-0014` vardır.  
  When: implementasyon yaklaşımı planlanır.  
  Then: Custom implementation yapılmayacak; ilgili capability sözleşmesine uyulacak (Platform Spec: SPEC-0014).

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- RCA içeriği v0.1’de şablon seviyesindedir; derin yöntem standardı sonraki iterasyonda ele alınır.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- CAPA workflow acceptance kriterleri tanımlıdır.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0314-nc-capa-workflow.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0314-nc-capa-workflow.md  
- PRD: docs/01-product/PRD/PRD-0005-nc-capa-management-mvp.md  
- SPEC: docs/03-delivery/SPECS/SPEC-0015-nc-capa-contract-v1.md  

