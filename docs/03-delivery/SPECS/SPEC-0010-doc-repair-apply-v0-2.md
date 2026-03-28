# SPEC-0010 – Doc-Repair Apply v0.2

ID: SPEC-0010  
Status: Draft  
Owner: Halil K.

## 1. AMAÇ

Doc-Repair Plan (v0.1) çıktısını kullanarak yalnız güvenli (allowlist) doküman patch’lerini otomatik uygulamak.

## 2. KAPSAM

- Girdi: `artifacts/doc-repair/plan.json` (plan-only generator çıktısı).
- Hedef: yalnız `docs/**` altında deterministik ve küçük delta ile düzeltmeler.
- v0.2 kapsamı, yalnız belirli reason’lar için “create/patch” otomasyonunu içerir.

## 3. KONTRAT (SSOT)

### Guardrails

- Allowlist: `docs/**` (çıktı artefact’ları hariç).
- Default: dry-run (apply kapalı). Uygulama yalnız `--apply` ile.
- Patch-first: küçük delta, minimal değişiklik.
- Gate: doc-qa PASS olmadan “tamamlandı” sayılmaz.
- Version Gate / env blokları: STOP (apply yok, needs-human).

### Uygulanacak Reason’lar (v0.2)

- `STORY_LINKS_SECTION_MISSING`
  - Fix: STORY’ye template’e uygun “7. LİNKLER (İSTEĞE BAĞLI)” bölümü ekle ve gerekli referansları yaz.
- `AC_FILE_MISSING` / `AC_MISSING`
  - Fix: Acceptance dosyası üret + STORY `Downstream:` satırına `AC-XXXX` ekle + STORY “LİNKLER” bölümüne Acceptance path’i ekle.
- `TP_FILE_MISSING` / `TP_MISSING` (yalnız L2+)
  - Fix: Test-Plan dosyası üret + STORY `Downstream:` satırına `TP-XXXX` ekle + STORY “LİNKLER” bölümüne Test Plan path’i ekle.

### ID Stratejisi (v0.2)

- Story-linked dokümanlar için ID, Story numarası ile **hizalı** olmalıdır:
  - `STORY-0123` → `AC-0123` ve `TP-0123`
- Eğer hizalı ID zaten tanımlıysa:
  - `*_FILE_MISSING`: dosya üretilir.
  - `*_MISSING`: doküman/Story referansları patch’lenir.
- Hizalı ID çakışması veya format dışı durumlarda: STOP (needs-human).  
  (Not: Delivery gate’leri hizasız ID’leri kabul etmez.)

### Çıktılar

- `artifacts/doc-repair/patch.diff` (dry-run veya apply sonrası unified diff)
- `artifacts/doc-repair/apply-report.md`

## 4. GOVERNANCE (DEĞİŞİKLİK POLİTİKASI)

- Apply kapsamının genişlemesi (yeni reason / yeni mutasyon tipi) yeni SPEC versiyonu ile yapılır.

## 5. LİNKLER

- SPEC (Plan): `docs/03-delivery/SPECS/SPEC-0009-doc-repair-loop-v0-1.md`
- Reason map (SSOT): `docs-ssot/03-delivery/SPECS/doc-repair-reason-map.v0.1.json`
- Plan generator: `scripts/doc_repair_plan.py`
