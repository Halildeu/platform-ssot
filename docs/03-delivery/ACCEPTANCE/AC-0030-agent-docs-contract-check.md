# AC-0030 – Agent Docs Contract Check Acceptance

ID: AC-0030  
Story: STORY-0030-agent-docs-contract-check  
Status: Done  
Owner: @team/platform-arch

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Transition-active agent/doc katmanının canonical authority map ile
  tutarlı biçimde işaretlendiğini ve tüketicilerinin ölçülebildiğini
  doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- `AGENTS.md`, `AGENT-CODEX.*`, kritik handbook girişleri ve seçili
  runbook’lar.  
- `scripts/check_transition_authority_map.py` ve
  `scripts/report_transition_reference_consumers.py`.  
- `doc-qa.yml` içindeki ilgili çağrılar.

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

- [x] Senaryo 1 – Marker/redirect doğrulaması:
  - Given: `AGENTS.md`, `AGENT-CODEX.*` ve kritik handbook girişlerinde
    authority map marker’ları bulunmalıdır.  
    When: `check_transition_authority_map.py` çalıştırılır.  
    Then: Eksik marker varsa FAIL, mevcut durumda ise `OK` sonucu üretilir.

- [x] Senaryo 2 – Tüketici raporu:
  - Given: Repo içinde transition/legacy referanslarını hâlâ kullanan
    dosyalar vardır.  
    When: `report_transition_reference_consumers.py` çalıştırılır.  
    Then: JSON ve Markdown raporu içinde tüketici sayısı, toplam isabet ve
    top consumer listesi üretilir.

- [x] Senaryo 3 – Workflow entegrasyonu:
  - Given: `doc-qa.yml` authority map check ve tüketici raporu komutlarını
    içerir.  
    When: Workflow veya lokal aynı komut seti çalıştırılır.  
    Then: Authority kontratı ve cleanup backlog görünürlüğü aynı hat
    üzerinden doğrulanır.

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Bu acceptance transition referanslarını sıfırlamayı değil, onları ölçülebilir
  ve yönetilebilir hale getirmeyi doğrular.  
- Tüketici raporunda kontrol scriptlerinin kendi string literalleri de
  sayılabilir; rapor yorumlanırken bu durum dikkate alınır.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- 2026-03-09 itibarıyla authority marker check `OK`, transition consumer
  raporu ise geçerli consumer sayımı ve top consumer listesini üretmiştir;
  bu acceptance tamamlanmıştır.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0030-agent-docs-contract-check.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0030-agent-docs-contract-check.md  
