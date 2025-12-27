# SPEC-0009 – Doc-Repair Loop v0.1

ID: SPEC-0009  
Status: Draft  
Owner: Halil K.

## 1. AMAÇ

Doc-qa gate ve `docflow_next` “BLOCKED/FAIL” sinyallerinden deterministik bir onarım planı üretip,
yalnız güvenli (allowlist) değişikliklerle doküman zincirini PASS seviyesine taşımak.

## 2. GİRDİLER

### 2.1 `docflow_next` sinyali

- `decision`: RUN/SKIP/STOP
- `result`: PASS/FAIL/BLOCKED
- `blockedReason`: serbest metin (normalize edilecek)

### 2.2 doc-qa gate sinyali

- Script exit code + stdout formatı.
- Parse edilecek script seti (gate):
  - `check_doc_templates.py`
  - `check_doc_ids.py`
  - `check_unique_delivery_ids.py`
  - `check_doc_locations.py`
  - `check_acceptance_evidence.py`
  - `check_story_links.py`
  - `check_doc_chain.py`
  - `check_governance_migration.py`

## 3. ÇIKTILAR

### 3.1 Repair Plan (makine okunur)

- Format: JSON (`plan.json`)
- Şema (v0.1):
  - `story_id`
  - `reason_code` (kanonik)
  - `actions[]`: `{ file_path, op (create/patch), summary, constraints[] }`

### 3.2 Repair Report (insan okunur)

- Format: Markdown (`report.md`)
- “Reason → Patch → Gate sonucu” tablosu.

## 4. REASON CATALOGUE (NORMALIZE)

`blockedReason` + doc-qa hataları aşağıdaki kanonik kodlara map edilir:

- `STORY_LINKS_SECTION_MISSING`
  - Sinyal:
    - `STORY içinde LİNKLER bölümü yok`
  - Fix:
    - `docs/99-templates/STORY.template.md` ile uyumlu “LİNKLER” bölümü ekle.

- `AC_MISSING` / `AC_FILE_MISSING`
  - Sinyal:
    - `AC bulunamadı (Flow/Downstream)` veya `AC dosyası yok: ...`
  - Fix:
    - STORY meta `Downstream:` satırını düzelt (`AC-XXXX`).
    - `docs/99-templates/ACCEPTANCE.template.md` ile `docs/03-delivery/ACCEPTANCE/AC-XXXX-*.md` üret.

- `TP_MISSING` / `TP_FILE_MISSING` (yalnız L2+)
  - Sinyal:
    - `TP bulunamadı (Downstream)` veya `TP dosyası yok: ...`
  - Fix:
    - STORY meta `Downstream:` satırını düzelt (`TP-XXXX`).
    - `docs/99-templates/TEST-PLAN.template.md` ile `docs/03-delivery/TEST-PLANS/TP-XXXX-*.md` üret.

- `EVIDENCE_MISSING_STRICT`
  - Sinyal:
    - `Repo içi kanıt referansı bulunamadı (...)`
  - Fix:
    - Acceptance “Kanıt/Evidence” altında repo içi referans ekle (allowlist path).

- `API_DOC_MISSING` (API story + L2+)
  - Sinyal:
    - `API_DOC_MISSING`
  - Fix:
    - STORY “LİNKLER” bölümüne ilgili `docs/03-delivery/api/*.api.md` referansını ekle.

- `SPEC_IN_PROGRESS` / `ADR_IN_PROGRESS`
  - Sinyal:
    - PROJECT-FLOW satırında `🔧` durumları (readiness).
  - Fix (v0.1):
    - Referans edilen doküman yoksa “stub + link” üret; kapsamı büyütmeden minimum kontratı tamamla.

- `VERSION_GATE_BLOCKED`
  - Sinyal:
    - `Version Gate: ortam/lockfile engeli`
  - Fix:
    - Doküman onarımı yapılmaz; STOP (needs-human).

- `STORY_PATH_INVALID`
  - Sinyal:
    - `STORY dosyası bulunamadı: STORY-XXXX` vb.
  - Fix:
    - `check_doc_locations.py` ve `DOCS-PROJECT-LAYOUT`’a göre path düzelt (move/rename).

## 5. GUARDRAILS

- Allowlist: varsayılan `docs/**`; `scripts/**` yalnız parse/normalize/plan için.
- Patch-first: başlık sırası/meta/link/ID/evidence düzeltmeleri.
- No-fabrication: template + mevcut STORY bağlamı dışında içerik uydurma yok.
- PASS kontratı: doc-qa PASS olmadan onarım “tamamlandı” sayılmaz.

## 6. ID STRATEJİSİ (v0.1)

`docs/03-delivery/ID-REGISTRY.tsv` boşsa:
- Next ID: repo taramasıyla `AC-\\d{4}` ve `TP-\\d{4}` max+1 bulunur.
- v0.2: ID-REGISTRY authoritative hale getirilebilir.

## 7. LİNKLER

- Reason map (SSOT): `docs/03-delivery/SPECS/doc-repair-reason-map.v0.1.json`
- Plan generator (plan-only): `scripts/doc_repair_plan.py`
- Runbook: `docs/04-operations/RUNBOOKS/RB-doc-repair-loop.md`
