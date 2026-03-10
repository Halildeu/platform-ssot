# STORY-0030 – Agent Docs Contract Check

ID: STORY-0030-agent-docs-contract-check  
Epic: QLTY-DOC-QA  
Status: Done  
Owner: @team/platform-arch  
Upstream: docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md, AGENTS.md, docs/OPERATIONS/AI-MULTIREPO-OPERATING-CONTRACT.v1.md, transition handbook entrypoints  
Downstream: AC-0030, TP-0030

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Transition-active agent/doc katmanının canonical OPO authority ile
  çelişmesini önlemek.  
- `AGENTS.md`, alan transition rehberleri, kritik handbook girişleri ve
  ilgili runbook/workflow yüzeyinin yeni authority map’e yönlendiğini otomatik
  kontrol etmek.  
- Kalan transition/legacy referans tüketicilerini raporlayarak cleanup
  backlog’unu görünür tutmak.

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Dokümantasyon/AI‑Ops ekibi olarak, transition-active dokümanların her zaman
  canonical OPO katmanına redirect vermesini istiyoruz; böylece eski ve yeni
  yönetim katmanları karışmasın.
- Bir ai agent olarak, bu sözleşmenin script ile düzenli kontrol edilmesini ve
  transition/legacy referans tüketicilerinin raporlanmasını istiyorum; böylece
  temizlik işlerini görünür ve ölçülebilir tutabileyim.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- `AGENTS.md` ve alan transition rehberleri.  
- Kritik handbook girişleri: `DEV-GUIDE.md`, `DOC-HIERARCHY.md`,
  `DOCS-WORKFLOW.md`, `DOCS-PROJECT-LAYOUT.md`.  
- `docs/04-operations/RUNBOOKS/RB-insansiz-flow.md` ve
  `RB-codex-canonical-flow-v0.1.md`.  
- `scripts/check_transition_authority_map.py` ile marker/redirect kontrolü.  
- `scripts/report_transition_reference_consumers.py` ile transition/legacy
  referans tüketici raporu.

Hariç:
- Tüm transition/legacy referanslarının aynı anda sıfırlanması.  
- Feature-level doküman zinciri kontrolü (STORY-0031 kapsamı).  
- İşlevsel testler veya entegrasyon testleri.

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [x] `scripts/check_transition_authority_map.py`, `AGENTS.md`,
  alan transition rehberleri, kritik handbook entrypoint’leri ve seçili
  runbook’larda
  authority map referansını ve transition marker’larını doğrular.  
- [x] `scripts/report_transition_reference_consumers.py`, archive hariç
  transition/legacy referans tüketicilerini JSON/Markdown raporu olarak
  üretir.  
- [x] `doc-qa.yml`, authority map check ve transition reference consumer
  raporunu çalıştırır.  
- [x] Repo için transition reference ölçümü alınmış ve cleanup backlog’u
  görünür hale getirilmiştir.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md  
- AGENTS.md  
- Çekirdek transition rehberi ve diğer alan transition rehberleri  
- DOCS-WORKFLOW.md  
- DOCS-PROJECT-LAYOUT.md  
- scripts/check_transition_authority_map.py  
- scripts/report_transition_reference_consumers.py

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- Bu Story ile transition-active agent/doc katmanı için otomatik bir
  “authority kontrat kontrolü” ve tüketici görünürlüğü mekanizması
  kurulmuş oldu.  
- 2026-03-09 itibarıyla authority marker check `OK`, transition consumer
  raporu ise `.cache/reports/transition_reference_consumers.v1.{json,md}`
  altında üretilmektedir.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0030-agent-docs-contract-check.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0030-agent-docs-contract-check.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0030-agent-docs-contract-check.md`  
